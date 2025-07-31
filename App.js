import 'react-native-pager-view';
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {AppState,  Platform, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from './src/navigation/navigationService';
import {selectAuthInfo, selectFirebaseConfig, setVerificationToken} from './src/redux/features/sessionSlice';
import MainView from './src/views/MainView';
import {AppStateType, ScreenType} from './src/utils/enums';
import {authenticate, fetchCountryCodes} from './src/utils/apiUtils';
import {DefaultTheme, PaperProvider, Portal} from 'react-native-paper';
import LoadingWrapper from './src/components/LoadingWrapper';
import AuthView from './src/views/AuthView';
import FirebaseManager from './src/firebase/FirebaseManager';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/firebase/ToastConfig';
import MessageProcessor from './src/firebase/MessageProcessor';
import PrivacyPolicy from './src/components/PrivacyPolicy';
import TermsOfService from './src/components/TermsOfService';
import PieceDetail from './src/components/PieceDetail';
import UploadPieceImage from './src/components/UploadPieceImage';
import FitStylist from './src/components/FitStylist';
import AddEditCollection from './src/components/AddEditCollection';
import GlobalLoader from './src/components/GlobalLoader';
import {APP_CONFIG} from './src/config/appConfig';
import {initializeRevenueCat, initializeTracking} from './src/utils/initUtils';
import RevenueCat from './src/components/RevenueCat';
import analytics, {trackAppOpen} from './src/lib/analytics';
import {fireTokTokLaunchEvent} from './src/components/tiktok';
import EmailScreen from './src/views/Authentication/Email';
import OtpVerify from './src/views/Authentication/OtpVerify';
import PhoneNumberScreen from './src/views/Authentication/PhoneNumber';
import ChooseAccount from './src/views/Authentication/ChooseAccount';
import MediaPermission from './src/views/Permissions/MediaPermission';
import ChooseUsername from './src/views/ChooseUsername';
import Profile from './src/views/MyProfile/Profile';
import WalkthroughView from './src/views/WalkthroughView';
import CameraPermissionScreen from './src/components/CameraPermissionScreen';
import CameraScreen from './src/components/CameraScreen.js';
import ChooseCategory from './src/views/Authentication/ChooseCategory';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5',
    accent: '#0056b3',
    gray: '#9E9E9E',
    secondaryContainer: 'transparent',
  },
};

const Stack = createNativeStackNavigator();

const App = () => {
  console.log('Starting App, environment:', APP_CONFIG.ENVIRONMENT);
  const dispatch = useDispatch();
  const [initialRoute, setInitialRoute] = useState(ScreenType.ENTRY);
  const [loading, setLoading] = useState(true);
  const [isInitialAuth, setIsInitialAuth] = useState(true);
  const authInfo = useSelector(selectAuthInfo);
  const firebaseConfig = useSelector(selectFirebaseConfig);
  const onAuthenticate = async success => {
    console.log('onAuthenticate:', success);
    try {
      if (success) {
        setInitialRoute(ScreenType.WALKTHROUGH);
      }
      else {
        setInitialRoute(ScreenType.ENTRY);
      }
    }
    catch (err) {
      console.error('Error removing verificationToken from AsyncStorage:', err);
    }
    finally {
      setLoading(false);
      setIsInitialAuth(false);
    }
  };

  useEffect(() => {
    if (!authInfo) {
      console.log('No authInfo available');
      return;
    }
    
    if (isInitialAuth) {
      console.log('[AuthRefresh] Skipping refresh during initial auth');
      return;
    }
    
    if (!authInfo.sessionExpirationMinutes || authInfo.sessionExpirationMinutes <= 0) {
      console.log('[AuthRefresh] No valid session expiration time, skipping refresh');
      return;
    }
    
    const sessionExpirationMillis = authInfo.sessionExpirationMinutes * 60 * 1000;
    const delay = sessionExpirationMillis - 60 * 1000;
    
    if (delay <= 0) {
      console.log('[AuthRefresh] Session expires too soon, skipping refresh');
      return;
    }
    
    console.log(`[AuthRefresh] Setting up session refresh in ${Math.round(delay / 1000 / 60)} minutes`);
    
    const timeout = setTimeout(() => {
      console.log('[AuthRefresh] Refreshing session before channel timeout...');
      const onAuth = async success => {
        console.log('[AuthRefresh] AuthRefresh:', success);
      };
      authenticate({dispatcher: dispatch, onAuthenticate: onAuth});
    }, delay);

    return () => clearTimeout(timeout);
  }, [authInfo, dispatch, isInitialAuth]);

  useEffect(() => {
    if (firebaseConfig) {
      FirebaseManager.initialize(firebaseConfig, data => {
        console.log('[App] Firebase update:', data);
        MessageProcessor.process(data, dispatch);
      });
    }

    return () => {
      FirebaseManager.cleanup();
    };
  }, [firebaseConfig, dispatch]);

  useEffect(() => {
    const checkVerificationToken = async () => {
      try {
        const token = await AsyncStorage.getItem('verificationToken');
        console.log('verificationToken:', token);
        if (token) {
          dispatch(setVerificationToken(token));
          const dispatcher = arg => dispatch(arg);
          await authenticate({dispatcher, onAuthenticate});
        }
        else {
          setLoading(false);
          setInitialRoute(ScreenType.ENTRY);
        }
      }
      catch (err) {
        console.error(
          'Error reading verificationToken from AsyncStorage:',
          err,
        );
      }
      finally {
      }
    };
    checkVerificationToken();
    const handleAppStateChange = nextAppState => {
      console.log('App State changed:', nextAppState);
      if (nextAppState === AppStateType.ACTIVE) {
        console.log('App State is active');
        trackAppOpen();
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  useEffect(() => {
    fetchCountryCodes(() => {
      console.log('fetchCountryCodes callback');
    });
  }, []);

  useEffect(() => {
    initializeRevenueCat();
    initializeTracking();
    analytics.initialize();
    fireTokTokLaunchEvent();

  }, []);

  return (
    <SafeAreaProvider>
      <LoadingWrapper
        loading={loading}
        content={
          <PaperProvider theme={theme}>
            <SafeAreaView style={styles.container} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['bottom']}>
              <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                  initialRouteName={initialRoute}
                  screenOptions={{
                    headerShown: false, 
                  }}>
                  <Stack.Screen name={ScreenType.ENTRY} component={AuthView}/>
                  <Stack.Screen name={ScreenType.WALKTHROUGH} component={WalkthroughView}/>
                  <Stack.Screen name={ScreenType.MAIN} component={MainView}/>
                  <Stack.Screen name="CameraPermission" component={CameraPermissionScreen}/>
                  <Stack.Screen name="Camera" component={CameraScreen}/>
                  <Stack.Screen
                    name={ScreenType.EMAIL}
                    component={EmailScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="OtpVerify"
                    component={OtpVerify}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="PhoneNumber"
                    component={PhoneNumberScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ChooseAccount"
                    component={ChooseAccount}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="MediaPermission"
                    component={MediaPermission}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ChooseUsername"
                    component={ChooseUsername}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ChooseCategory"
                    component={ChooseCategory}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="PieceDetail"
                    component={PieceDetail}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="UploadPieceImage"
                    component={UploadPieceImage}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="FitStylist"
                    component={FitStylist}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="AddEditCollection"
                    component={AddEditCollection}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="RevenueCat"
                    component={RevenueCat}
                    options={{
                      headerShown: false, 
                    }}
                  />
                  <Stack.Screen
                    name={ScreenType.TERMS_OF_SERVICE}
                    component={TermsOfService}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name={ScreenType.PRIVACY_POLICY}
                    component={PrivacyPolicy}
                    options={{
                      headerShown: false,
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaView>
            <GlobalLoader/>
            <Portal>
              <Toast config={toastConfig}/>
            </Portal>
          </PaperProvider>
        }
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
});

export default App;
