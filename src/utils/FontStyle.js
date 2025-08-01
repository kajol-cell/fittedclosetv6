import {StyleSheet} from 'react-native';
import COLORS from './colors';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const FontStyle = StyleSheet.create({
  HeadingOne: {
    fontSize: 35,
    fontWeight: '500',
    textAlign: 'center',
  },

  FontStyleOne: {
    fontSize: height * 0.02,
    fontWeight: '300',
  },

  FontStyleTwo: {
    fontSize: height * 0.04,
    fontWeight: '600',
  },

  FontStyleThree: {
    fontSize: height * 0.019,
  },

  FontStyleFive: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default FontStyle;
