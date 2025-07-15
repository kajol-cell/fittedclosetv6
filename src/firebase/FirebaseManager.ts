import {getAuth} from '@react-native-firebase/auth';
import {getDatabase} from '@react-native-firebase/database';
import {getApp, getApps, initializeApp} from '@react-native-firebase/app';
const isFirebaseInitialized = () => {
  return getApps().length > 0;
};
let firebaseApp;
if (isFirebaseInitialized()) {
  console.log('Firebase is initialized, using existing app instance');
  firebaseApp = getApp();
} else {
  console.log('Firebase is not initialized, creating a new app instance');
  const appConfig = {
    projectId: 'fitted-image-upload',
    appId: '1:870456912957:ios:99a8d9b110da9fac988e54',
    apiKey: 'AIzaSyCiR63bANLSvRsA5SmdklzsLEBAC5iusHw',
    databaseURL: 'https://fitted-image-upload-default-rtdb.firebaseio.com',
    storageBucket: 'fitted-image-upload.appspot.com',
    messagingSenderId: '870456912957',
  };
  firebaseApp = initializeApp(appConfig);
}
let subscription = null;
const FirebaseManager = {
  async initialize(firebaseConfig, onUpdate) {
    const config = firebaseConfig;
    if (!config) {
      return;
    }
    const {authToken, channelKey, databaseURL} = config;
    const auth = getAuth();
    await auth
      .signInWithCustomToken(authToken)
      .then(credential => {
        console.log(
          'Firebase authenticated with custom token:',
          credential.user.uid,
        );
      })
      .catch(error => {
        console.error('Firebase authentication error:', error);
      });
    const dbRef = getDatabase(firebaseApp, databaseURL).ref(
      `/channels/${channelKey}`,
    );
    dbRef.on('value', snapshot => {
      onUpdate(snapshot.val());
    });
    subscription = dbRef;
  },
  cleanup() {
    if (subscription) {
      subscription.off();
      subscription = null;
    }
  },
};
export default FirebaseManager;
