import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG} from '../config/appConfig';
import {Platform} from 'react-native';
import {hideLoading, showLoading} from "./features/loadingSlice";

export const API_URL = API_CONFIG.SERVER_URL;

const AUTHENTICATE = 'AUTHENTICATE';

let storeInstance = null; 

export const setStore = store => {
    storeInstance = store; 
};

function assertHasSessionKey(messageType, sessionKey) {
    let isNotAuth = messageType !== AUTHENTICATE;
    /*console.log(
      'assertHasSessionKey',
      isNotAuth,
      AUTHENTICATE,
      messageType,
      sessionKey,
    );*/
    if (isNotAuth && !sessionKey) {
        console.info('Session key is missing');
        throw new Error('Session key is missing');
    }
}

export const callApi = async (messageType, payload) => {
    const url = `${API_URL}/api/api/send`;
    const state = storeInstance.getState(); // Safely call getState
    const sessionKey = state.auth.apiSessionKey;
    // state.loading.isLoading = true;
    // state.loading.isLoading = false;
    assertHasSessionKey(messageType, sessionKey);

    try {
        storeInstance.dispatch(showLoading());
        let body;
        if (messageType === AUTHENTICATE) {
            body = JSON.stringify({messageType, payload});
        } else {
            body = JSON.stringify({messageType, sessionKey, payload});
        }
        console.log('callApi', body, url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'VC-Device-Platform': Platform.OS,
            },
            body,
        });
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return response.json();
    } finally {
        storeInstance.dispatch(hideLoading());
    }
};

export const callSession = async (messageType, payload) => {
    const url = `${API_URL}/api/session/send`;
    const state = storeInstance.getState(); 
    const sessionKey = state.session.sessionKey;
    assertHasSessionKey(messageType, sessionKey);
    try {
        storeInstance.dispatch(showLoading());
        const isAuthenticate = messageType === AUTHENTICATE;
        let body;
        const verificationToken = await AsyncStorage.getItem('verificationToken');
        console.log('callSession - verificationToken from AsyncStorage:', verificationToken);
        if (isAuthenticate) {
            body = JSON.stringify({messageType, verificationToken, payload});
        } else {
            body = JSON.stringify({
                messageType,
                sessionKey,
                verificationToken,
                payload,
            });
        }
        console.log('callSession', body);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'VC-Device-Platform': Platform.OS,
            },
            body,
        });

        if (!response.ok) {
            throw new Error('Session request failed');
        }
        return response.json();
    } finally {
        storeInstance.dispatch(hideLoading());
    }
};

export function handleUnexpectedError(error, onError, rejectWithValue) {
    const errorMsg = error?.message || 'Unexpected error';
    onError(errorMsg);
    return rejectWithValue({
        code: 500,
        message: errorMsg,
    });
}
