import React, { useEffect, useState } from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  User
} from '@react-native-google-signin/google-signin';
import { AUTH_CONFIG } from '../config/appConfig';
import Button from './Button';
import COLORS from '../const/colors';

// Define prop types
interface GoogleSignInButtonProps {
  onSuccess?: (userInfo: User) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  useEffect(() => {
    const options = Platform.select({
      ios: {
        iosClientId: AUTH_CONFIG.GOOGLE.IOS_CLIENT_ID,
        offlineAccess: false,
      },
      android: {
        webClientId: AUTH_CONFIG.GOOGLE.WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      },
    });

    GoogleSignin.configure(options!); 

    return () => {
      GoogleSignin.signOut().catch(error => {
        console.log('Error signing out during cleanup:', error);
      });
    };
  }, []);

  const handleSignIn = async () => {
    if (isSigningIn) {
      console.log('Google Sign-In already in progress');
      return;
    }

    setIsSigningIn(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.data) {
        onSuccess?.(userInfo.data);
      } else {
        onError?.({ message: 'No user data received from Google Sign-In' });
      }
    } catch (error: any) {
      console.log('Google Sign-In error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google Sign-In cancelled by user');
        onCancel?.();
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google Sign-In already in progress');
        onError?.({ message: 'Sign-in already in progress' });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available');
        onError?.({ message: 'Google Play Services not available' });
      } else {
        console.log('Google Sign-In error:', error);
        onError?.(error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.BtnContainer}>
      <Button
        imgSrc={require('../assets/images/google.png')}
        title={isSigningIn ? "Signing in..." : "Continue with Google"}
        buttonType={true}
        bgColor={COLORS.primary}
        onPress={handleSignIn}
        disabled={isSigningIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  BtnContainer: {
    marginVertical: 5,
    width: '100%',
  },
});

export default GoogleSignInButton;
