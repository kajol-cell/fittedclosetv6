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
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Apple</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black', // Apple theme color
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
    color: 'black', // Apple theme color
  },
});

export default AppleSignInButton;
