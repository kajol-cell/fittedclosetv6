/**
 * @format
 */

import {AppRegistry, Alert} from 'react-native';
import AppEntry from './AppEntry';
import {name as appName} from './app.json';
import RNRestart from 'react-native-restart';


ErrorUtils.setGlobalHandler(error => {
  console.error('Global Error:', error);
  Alert.alert(
    'Unexpected Error',
    'An unexpected error occurred. Would you like to restart the app?',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Restart', onPress: () => RNRestart.Restart()},
    ],
  );
});

AppRegistry.registerComponent(appName, () => AppEntry);
