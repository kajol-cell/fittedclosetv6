import Toast from 'react-native-toast-message';

export function showNotification(message, type = 'info') {
  Toast.show({
    type: 'topRight', // must match custom type key
    text1: message,
    position: 'top',
  });
}
