import React, {useEffect} from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Platform, Image, Dimensions} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AUTH_CONFIG} from '../config/appConfig';

const GoogleSignInButton = ({onSuccess, onError, onCancel}) => {
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
    GoogleSignin.configure(options);
  }, []);

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      onSuccess?.(userInfo.data);
    } catch (error) {
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
        <Image source={require('../assets/images/google.png')} resizeMode='contain' style={styles.icon} />
        <Text style={styles.text}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    bottom:Dimensions.get('window').height * 0.005
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SFPRODISPLAYBOLD',
    flex: 1,
    textAlign: 'center',
  },
});


export default GoogleSignInButton;
