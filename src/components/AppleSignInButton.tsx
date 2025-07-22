import React from 'react';
import { View, StyleSheet } from 'react-native';
import { appleAuth, AppleRequestResponse } from '@invertase/react-native-apple-authentication';
import Button from './Button';
import COLORS from '../const/colors';

// Define prop types
interface AppleSignInButtonProps {
  onSuccess?: (response: AppleRequestResponse) => void;
  onError?: (error: unknown) => void;
}

const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({ onSuccess, onError }) => {
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
    <View style={styles.BtnContainer}>
      <Button
        title="Continue with Apple"
        buttonType={true}
        bgColor={COLORS.primary}
        iconName="apple"
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

export default AppleSignInButton;
