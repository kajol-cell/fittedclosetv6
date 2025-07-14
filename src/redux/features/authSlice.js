import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {callApi, handleUnexpectedError} from '../api';
import {setAuthInfo} from './sessionSlice';
import {API_CONFIG} from '../../config/appConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiMessageType} from '../../utils/enums';

let store; // Global reference to the Redux store
const SESSION_DURATION_MINUTES = 60; // Session duration in minutes
const BUFFER_MINUTES = 5; // Buffer time in minutes

export const setAuthStore = s => {
  store = s;
}; // Setter function to initialize store

async function handleApiAuthenticate(getState) {
  const apiSessionKey = getState().auth.apiSessionKey;
  if (!apiSessionKey || getState().auth.sessionExpiresAt < Date.now()) {
    const response = await callApi(ApiMessageType.AUTHENTICATE, {
      apiKey: API_CONFIG.SECRET_KEY,
    });
    const sessionKey = response.payload.sessionKey;
    getState().auth.apiSessionKey = sessionKey;
    console.log('Authenticated, session key', sessionKey);
    return sessionKey;
  } else {
    console.log('Already authenticated, session key', apiSessionKey);
  }
  return apiSessionKey;
}

async function makeThunkCall(
  messageType,
  onSuccess,
  payload,
  onError,
  getState,
  rejectWithValue,
) {
  try {
    const sessionKey = await handleApiAuthenticate(getState);
    if (messageType === ApiMessageType.AUTHENTICATE) {
      onSuccess(sessionKey);
      return sessionKey;
    }
    console.log('myMessageType', messageType);
    console.log('myPayload', payload);
    const response = await callApi(messageType, payload);
    const {responseCode, responseDescription, payload: responseData} = response;

    if (responseCode !== 200) {
      // Properly invoke onError and reject
      onError(responseDescription || 'Unknown error');
      return rejectWithValue({
        code: responseCode,
        message: responseDescription || 'Unknown error',
      });
    }
    onSuccess(responseData);
    return responseData;
  } catch (error) {
    return handleUnexpectedError(error, onError, rejectWithValue);
  }
}

// Generic thunk creator for authentication calls
const createAuthThunk = (type, messageType) =>
  createAsyncThunk(
    type,
    async (
      {payload = {}, onSuccess = () => {}, onError = () => {}},
      {getState, rejectWithValue},
    ) => {
      return await makeThunkCall(
        messageType,
        onSuccess,
        payload,
        onError,
        getState,
        rejectWithValue,
      );
    },
  );
// Generic thunk creator for authentication calls
const createGenericAuthThunk = type =>
  createAsyncThunk(
    type,
    async (
      {messageType, payload = {}, onSuccess = () => {}, onError = () => {}},
      {getState, rejectWithValue},
    ) => {
      return await makeThunkCall(
        messageType,
        onSuccess,
        payload,
        onError,
        getState,
        rejectWithValue,
      );
    },
  );

export const thirdPartyAuthenticate = createAsyncThunk(
  'auth/thirdPartyAuthenticate',
  async (
    {payload, onSuccess = () => {}, onError = () => {}},
    {getState, rejectWithValue, dispatch},
  ) => {
    try {
      console.log('thirdparty auth, payload', payload);
      await handleApiAuthenticate(getState);
      const response = await callApi(
        ApiMessageType.THIRD_PARTY_AUTHENTICATE,
        payload,
      );
      const {
        responseCode,
        responseDescription,
        payload: responseData,
      } = response;

      if (responseCode !== 200) {
        // Properly invoke onError and reject
        onError(responseDescription || 'Unknown error');
        return rejectWithValue({
          code: responseCode,
          message: responseDescription || 'Unknown error',
        });
      }
      dispatch(setAuthInfo(responseData));
      onSuccess(responseData);
      return responseData;
    } catch (error) {
      return handleUnexpectedError(error, onError, rejectWithValue);
    }
  },
);
export const apiAuthenticate = createAuthThunk(
  'auth/apiAuthenticate',
  ApiMessageType.AUTHENTICATE,
);
export const getCountryCodes = createAuthThunk(
  'auth/getCountryCodes',
  ApiMessageType.COUNTRY_CODES,
);

export const sendCode = createGenericAuthThunk('auth/sendCode');
export const verifyCode = createGenericAuthThunk('auth/verifyCode');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    apiSessionKey: null,
    verificationToken: null,
    userInfo: null,
    countryCodes: [],
    isCodeSent: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCodeSent(state, action) {
      state.isCodeSent = action.payload;
    },
    logout(state) {
      state.apiSessionKey = null;
      state.sessionExpiresAt = 0;
      state.verificationToken = null;
      state.isCodeSent = false;
      state.status = 'idle';
      state.error = null;
      AsyncStorage.removeItem('verificationToken');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(apiAuthenticate.fulfilled, (state, action) => {
        state.apiSessionKey = action.payload;
        this.state.sessionExpiresAt = Date.now() + (SESSION_DURATION_MINUTES - BUFFER_MINUTES) * 60 * 1000;
        state.status = 'succeeded';
      })
      .addCase(apiAuthenticate.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(getCountryCodes.fulfilled, (state, action) => {
        //console.log('getCountryCodes fulfilled, payload=', action.payload);
        state.countryCodes = action.payload.countryCodes;
      })
      .addCase(getCountryCodes.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        console.log('Verify code fulfilled, payload=', action.payload);
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(sendCode.fulfilled, state => {
        state.isCodeSent = true;
        state.status = 'succeeded';
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {setCodeSent, logout} = authSlice.actions;
export default authSlice.reducer;
