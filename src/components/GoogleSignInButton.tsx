import React, { useEffect } from 'react';
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

    GoogleSignin.configure(options!); // assert non-null since Platform.select ensures one is returned
  }, []);

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      onSuccess?.(userInfo?.data);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        onCancel?.();
      } else {
        onError?.(error);
      }
    }
  };

  return (
    <View style={styles.BtnContainer}>
      <Button
        imgSrc={require('../assets/images/google.png')}
        title="Continue with Google"
        buttonType={true}
        bgColor={COLORS.primary}
        onPress={handleSignIn}
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
