import React, {useState, useEffect} from 'react';
import {TextInput, Button} from 'react-native-paper';
import {StyleSheet, View, Text} from 'react-native';
import COLORS from '../const/colors';

const EmailInput = ({onSubmit, emailValue = ''}) => {
  const [email, setEmail] = useState(emailValue);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsValid(validateEmail(email));
  }, [email]);

  const handleSubmit = () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="name@company.com"
        placeholderTextColor={COLORS.grayInactive}
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (error) setError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        mode="flat"
        theme={{colors: {background: COLORS.white}}}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}

    </View>
  );
};

export default EmailInput;

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  input: {
    backgroundColor: '#F5F5F5',
    fontSize: 16,
    borderRadius:20
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginVertical: 6,
    marginLeft: 4,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
});
