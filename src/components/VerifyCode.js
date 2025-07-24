import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import COLORS from '../const/colors';
import { HelperText } from 'react-native-paper';

const { width } = Dimensions.get('window');

const VerifyCode = ({ onResendCode, status, email, code, setCode, error }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);

  const handleTextChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text !== '' && index < 6) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleInputFocus = (index) => {
    setActiveIndex(index);
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.inputBox,
              activeIndex === index && styles.activeInputBox,
              digit !== '' && styles.filledInputBox
            ]}
          >
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.input}
              value={digit}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleInputFocus(index)}
              maxLength={1}
              keyboardType="numeric"
              returnKeyType={index === 6 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (index < 6) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
            />
          </View>
        ))}
      </View>
      {error ? <HelperText type="error">{error}</HelperText> : null}


      <TouchableOpacity
        style={styles.resendButton}
        onPress={onResendCode}
        disabled={status === 'loading'}
      >
        <Text style={styles.resendButtonText}>Resend Code</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, marginHorizontal: Dimensions.get('window').width * 0.05
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputBox: {
    width: 45,
    height: 47,
    borderWidth: 1,
    borderColor: COLORS.grayInactive,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  activeInputBox: {
    borderWidth: 2,
    borderColor: COLORS.Black
  },
  filledInputBox: {
    borderWidth: 1,
    borderColor: COLORS.grayBackground,
  },
  input: {
    fontSize: 18,
    color: COLORS.Black,
    textAlign: 'center',
    fontFamily: 'SFPRODISPLAYBOLD',
    width: '100%',
    height: '100%',
    padding: 0,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendButtonText: {
    color: COLORS.Black,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'SFPRODISPLAYMEDIUM',
  },
});

export default VerifyCode;
