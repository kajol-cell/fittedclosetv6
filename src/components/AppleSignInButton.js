import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AppleSignInButton = ({onSuccess, onError}) => {
  const handleSignIn = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      console.log('Apple response:', appleAuthRequestResponse);
      onSuccess?.(appleAuthRequestResponse);
    } catch (error) {
      console.log('Apple Sign-In Error:', error);
      onError?.(error);
    }
  };

  return (
    <TouchableOpacity onPress={handleSignIn} style={styles.button}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="apple"
          size={18}
          color="#FFFFFF"
          style={styles.icon}
        />
        <Text style={styles.text}>Continue with Apple</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 12,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 12,
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

export default AppleSignInButton;
