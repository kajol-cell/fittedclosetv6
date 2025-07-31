import React, { useEffect, useState } from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const LoadingWrapper = ({loading, content}) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowLoading(true);
      const timeout = setTimeout(() => {
        console.warn('LoadingWrapper: Auto-hiding loading after timeout');
        setShowLoading(false);
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      setShowLoading(false);
    }
  }, [loading]);

  return showLoading ? (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/*<ActivityIndicator size="large" color="blue" />*/}
    </SafeAreaView>
  ) : (
    content
  );
};

export default LoadingWrapper;
