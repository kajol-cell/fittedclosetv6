import {Platform} from 'react-native';

export const getClientType = () => Platform.OS.toUpperCase();

export const isIOS = () => Platform.OS === 'ios';
export const isWeb = () => Platform.OS === 'web';
export const isAndroid = () => Platform.OS === 'android';
