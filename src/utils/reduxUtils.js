import store from '../redux/store';

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
    //console.error(`Error dispatching ${thunk.typePrefix}:`, error);
    onError(error);
    throw error;
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
    const responsePayload = await store
      .dispatch(thunk({messageType, payload}))
      .unwrap();
    //console.log('Response payload:', responsePayload);
    onSuccess(responsePayload);
    return responsePayload;
  } catch (error) {
    //console.log('Error', error)
    //console.error(`Error dispatching ${thunk.typePrefix}:`, error);
    onError(error);
  }
};
