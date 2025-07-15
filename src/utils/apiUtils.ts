import {sessionAuthenticate} from '../redux/features/sessionSlice';
import {getCountryCodes} from '../redux/features/authSlice';
import {setVerificationToken} from '../redux/features/sessionSlice';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dispatchMessageTypeThunk} from './reduxUtils';
const fetchCountryCodes = async (onSuccess = () => {}, onError = () => {}) => {
  console.log('fetchCountryCodes called');
  await dispatchMessageTypeThunk(getCountryCodes, {}, 
    () => {
      console.log('fetchCountryCodes success callback');
      onSuccess();
    }, 
    error => {
      console.error('Failed to fetch country codes:', error);
      onError();
    }
  );
};
const authenticate = async ({dispatcher, onAuthenticate}) => {
  await dispatchMessageTypeThunk(
    sessionAuthenticate,
    {},
    async response => {
      console.log('API session authenticated:', response.profile.entitlements);
      onAuthenticate(true);
    },
    async error => {
      console.error('Error initializing API session:', error);
      Alert.alert('Verification expired, please verify again', error);
      await AsyncStorage.removeItem('verificationToken');
      dispatcher(setVerificationToken(null));
      onAuthenticate(false);
    },
  );
};
export {authenticate, fetchCountryCodes};
