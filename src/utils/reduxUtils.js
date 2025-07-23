import store from '../redux/store';
import { extractErrorMessage } from './utils';

export const dispatchMessageTypeThunk = async (
  thunk,
  payload = {},
  onSuccess = responsePayload => {},
  onError = error => {},
) => {
  try {
    console.log('thirdparty auth, payload', payload);
    const responsePayload = await store.dispatch(thunk({payload})).unwrap();
    onSuccess(responsePayload);
    return responsePayload;
  } catch (error) {
    const errorMessage = extractErrorMessage(error, 'An error occurred');
    onError(errorMessage);
  }
};

export const dispatchThunk = async (
  thunk,
  messageType,
  payload = {},
  onSuccess = responsePayload => {},
  onError = error => {},
) => {
  try {
    console.log('dispatchThunk - calling thunk with:', { messageType, payload });
    const responsePayload = await store
      .dispatch(thunk({messageType, payload}))
      .unwrap();
    
    console.log('dispatchThunk - success response:', responsePayload);
    onSuccess(responsePayload);
    return responsePayload;
  } catch (error) {
    console.log('dispatchThunk - error caught:', error);
    const errorMessage = extractErrorMessage(error, 'An error occurred');
    console.log('dispatchThunk - extracted error message:', errorMessage);
    onError(errorMessage);
    throw error;
  }
};
