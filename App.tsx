import 'react-native-pager-view';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { AppState, Image, Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './src/navigation/navigationService';
import { selectAuthInfo, selectFirebaseConfig, setVerificationToken } from './src/redux/features/sessionSlice';
import MainView from './src/views/MainView';
import { AppStateType, ScreenType } from './src/utils/enums';
import { authenticate, fetchCountryCodes } from './src/utils/apiUtils';
import { DefaultTheme, PaperProvider, Portal } from 'react-native-paper';
import LoadingWrapper from './src/components/LoadingWrapper';
import AuthView from './src/views/AuthView';
import FirebaseManager from './src/firebase/FirebaseManager';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/firebase/ToastConfig';
import MessageProcessor from './src/firebase/MessageProcessor';
import PrivacyPolicy from './src/components/PrivacyPolicy';
import TermsOfService from './src/components/TermsOfService';
import PieceDetail from './src/components/PieceDetail';
import UploadPieceImage from './src/components/UploadPieceImage';
import FitStylist from './src/components/FitStylist';
import AddEditCollection from './src/components/AddEditCollection';
import GlobalLoader from './src/components/GlobalLoader';
import { APP_CONFIG } from './src/config/appConfig';
import { initializeRevenueCat, initializeTracking } from './src/utils/initUtils';
import RevenueCat from './src/components/RevenueCat';
import analytics, { trackAppOpen } from './src/lib/analytics';
import { fireTokTokLaunchEvent } from './src/components/tiktok';

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
  const [initialRoute, setInitialRoute] = useState<string>(ScreenType.ENTRY);
  const [loading, setLoading] = useState(true);
  const authInfo = useSelector(selectAuthInfo);
  const firebaseConfig = useSelector(selectFirebaseConfig);
  const onAuthenticate = async success => {
    console.log('onAuthenticate:', success);
    try {
      if (success) {
        setInitialRoute(ScreenType.MAIN);
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
    }
  };

  useEffect(() => {
    if (!authInfo) {
      console.log('No authInfo available');
      return;
    }
    const sessionExpirationMillis =
      authInfo.sessionExpirationMinutes * 60 * 1000;
    const delay = sessionExpirationMillis - 60 * 1000;
    const timeout = setTimeout(() => {
      console.log('[AuthRefresh] Refreshing session before channel timeout...');
      const onAuth = async success => {
        console.log('[AuthRefresh] AuthRefresh:', success);
      };
      authenticate({ dispatcher: dispatch, onAuthenticate: onAuth });
    }, delay);

    return () => clearTimeout(timeout);
  }, [authInfo, dispatch]);

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
          await authenticate({ dispatcher, onAuthenticate });
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
                  id={undefined}
                  initialRouteName={initialRoute}
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#fff',
                    },
                    headerShadowVisible: false,
                    headerTintColor: '#000',
                    headerTitleStyle: {
                      fontSize: 20,
                      fontWeight: 'bold',
                    },
                    headerLeft: () => (
                      <Image
                        source={require('./src/assets/images/logo.png')}
                        style={{
                          width: 48,
                          height: 48,
                          marginLeft: 10,
                        }}
                        resizeMode="contain"
                      />
                    ),
                    headerTitleAlign: 'center',
                    headerTitle: 'Closet in Your Pocket',
                  }}>
                  <Stack.Screen name={ScreenType.ENTRY} component={AuthView} options={{ headerShown: false }} />
                  <Stack.Screen name={ScreenType.MAIN} component={MainView} options={{ headerShown: false }} />
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
            <GlobalLoader />
            <Portal>
              <Toast config={toastConfig} />
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
