import React, { useState, useRef, useEffect } from 'react';
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
import ThemeStyle from '../const/ThemeStyle';

const VerifyCode = ({ onResendCode, status, code, setCode, error, resetFocus }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (resetFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    }
  }, [resetFocus]);

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
      style={ThemeStyle.container}
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
        style={timeLeft > 0 ? styles.resendButton : styles.sendCode}
        onPress={() => {
          if (timeLeft <= 0 && status !== 'loading') {
            onResendCode();
            setTimeLeft(30);
          }
        }}
        disabled={status === 'loading' || timeLeft > 0}
      >
        <Text style={[styles.resendButtonText, { color: timeLeft > 0 ? COLORS.secondaryDark : COLORS.Black }]}>
          {timeLeft > 0 ? `Send new code in ${timeLeft}s` : 'Send new code'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 12,
    marginTop:10, marginRight:10
  },
  inputBox: {
    width: 45,
    height: 47,
    borderWidth: 1.2,
    borderColor: COLORS.graySubtle,
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
    borderColor: COLORS.graySubtle,
    borderWidth: 1.2,
    borderRadius: 10,
    width: '45%', height: '8%',
    justifyContent: 'center', 
    marginTop: Dimensions.get('window').height * 0.01,
  },
  sendCode: {
    borderRadius: 15,
    marginBottom: 10, width: '35%', height: '8%',
    justifyContent: 'center', alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.02,
    backgroundColor: COLORS.whiteSoft,
  },
  resendButtonText: {
    color: COLORS.secondaryDark,
    fontSize: 12,
    fontFamily: 'SFPRODISPLAYBOLD', textAlign:'center'
  },
});

export default VerifyCode;
