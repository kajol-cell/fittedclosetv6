import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import COLORS from '../const/colors';

interface CommonButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onPress = () => {},
  disabled = false,
  loading = false,
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.disabledButton : styles.enabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      <Text
        style={[
          styles.buttonText,
          disabled ? styles.disabledText : styles.enabledText,
          textStyle
        ]}
      >
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginHorizontal: 20,
  },
  enabledButton: {
    backgroundColor: COLORS.Black,
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  enabledText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#999999',
  },
});

export default CommonButton;
