import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ToastTopRight = ({text1}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {top: insets.top + 10, right: insets.right + 10},
      ]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  );
};

export const toastConfig = {
  topRight: ToastTopRight,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    zIndex: 9999,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
