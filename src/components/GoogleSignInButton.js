import React, {useEffect} from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Platform} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AUTH_CONFIG} from '../config/appConfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/*
GoogleSignin.configure({
  iosClientId: AUTH_CONFIG.GOOGLE.IOS_CLIENT_ID,
  webClientId: AUTH_CONFIG.GOOGLE.WEB_CLIENT_ID,
  offlineAccess: AUTH_CONFIG.GOOGLE.OFFLINE_ACCESS,
});
*/

const GoogleSignInButton = ({onSuccess, onError, onCancel}) => {
  useEffect(() => {
    let options = {
      ...(Platform.OS === 'ios'
          ? {
            iosClientId: AUTH_CONFIG.GOOGLE.IOS_CLIENT_ID,
            offlineAccess: false,
          }
          : {
            webClientId: AUTH_CONFIG.GOOGLE.WEB_CLIENT_ID,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
          }),
    };
    console.log("Options for Google SignIn:", options);
    GoogleSignin.configure(options);
  }, []);

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      console.log("Google Play Services are available");
      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      console.log('Already signed in?', isSignedIn);
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign In Success:', userInfo);
      onSuccess?.(userInfo.data);
    } catch (error) {
      console.log('Google Sign In Error:', error.code);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        onCancel?.();
      } else {
        onError?.(error);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleSignIn} style={styles.button}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="google"
          size={24}
          color="#4285F4"
          style={styles.icon}
        />
        <Text style={styles.text}>Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4285F4', // Google theme color
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4285F4', // Google theme color
  },
});

export default GoogleSignInButton;
