import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const LoadingWrapper = ({loading, content}) =>
  loading ? (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/*<ActivityIndicator size="large" color="blue" />*/}
    </SafeAreaView>
  ) : (
    content
  );

export default LoadingWrapper;
