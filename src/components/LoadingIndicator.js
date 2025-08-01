import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';

const LoadingIndicator = () => {
  const isLoading = useSelector(state => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
};

export default LoadingIndicator;
