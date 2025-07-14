// SendCode.js
import React, {useState} from 'react';
import {TextInput, Button, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

export const VerifyCode = ({onVerifyCode, onResendCode, status}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleTextChange = text => {
    if (/^\d*$/.test(text)) {
      setCode(text);
      setError('');
    } else {
      setError('Only digits are allowed.');
    }
  };
  const handleVerifyPress = () => {
    console.log('VerifyPress');
    if (code.length !== 6) {
      setError('Code must be exactly 6 digits.');
      return;
    }
    setError('');
    onVerifyCode(code);
  };

  return (
    <View>
      <TextInput
        label="Enter code"
        value={code}
        onChangeText={handleTextChange}
        mode="outlined"
        style={{marginVertical: 10}}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleVerifyPress}
        disabled={status === 'loading' || !/^\d{6}$/.test(code)}>
        Verify Code
      </Button>
      <Button
        mode="text"
        onPress={onResendCode}
        disabled={status === 'loading'}
        style={{marginTop: 10}}>
        Resend Code
      </Button>
    </View>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
});
