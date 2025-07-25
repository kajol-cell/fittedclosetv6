import { sessionAuthenticate } from '../redux/features/sessionSlice';
import { getCountryCodes } from '../redux/features/authSlice';
import { setVerificationToken } from '../redux/features/sessionSlice';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dispatchMessageTypeThunk } from './reduxUtils';

const fetchCountryCodes = async (onSuccess = () => { }, onError = () => { }) => {
  await dispatchMessageTypeThunk(getCountryCodes, {}, onSuccess, error =>
    console.error('Failed to fetch country codes:', error),
  );
};

const authenticate = async ({ dispatcher, onAuthenticate }) => {
  await dispatchMessageTypeThunk(
    sessionAuthenticate,
    {},
    async response => {
      onAuthenticate(true);
    },
    async error => {
      const errorString = String(error).toLowerCase();
      const isUserNotAuthenticated = errorString.includes('401') ||
        errorString.includes('user is not authenticated') ||
        errorString.includes('not authenticated');

      if (isUserNotAuthenticated) {
        onAuthenticate(false);
      } else {
        Alert.alert('Verification expired, please verify again', error?.message || error);
        await AsyncStorage.removeItem('verificationToken');
        dispatcher(setVerificationToken(null));
        onAuthenticate(false);
      }
    },
  );
};

export { authenticate, fetchCountryCodes };
