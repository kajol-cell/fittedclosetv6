import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import backArrow from '../assets/images/backArrow.png';
import ThemeStyle from '../const/ThemeStyle';
import COLORS from '../const/colors';

import {useNavigation} from '@react-navigation/native';

const HeaderOne = ({pageName, showArrorw, navigationCustom}) => {
  const navigationRoute = useNavigation();
  return (
    <View style={styles.mainWrapper}>
      {!showArrorw && (
        <TouchableOpacity
          style={styles.backArrowWrapper}
          onPress={() =>
            navigationCustom ? navigationCustom : navigationRoute.goBack()
          }>
          <Image
            source={backArrow}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <View style={styles.nameWrapper}>
        <Text style={[ThemeStyle.H3]}>{pageName}</Text>
      </View>
    </View>
  );
};

export default HeaderOne;
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  mainWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: width * 0.06,
    position: 'relative',
    paddingHorizontal: width * 0.05,
  },
  backArrowWrapper: {
    position: 'absolute',
    // left: width * 0.06,
    left: 0,
  },
  backArrow: {width: 23, height: 23},
  nameWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    color: COLORS.ShadowDarkest,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});
