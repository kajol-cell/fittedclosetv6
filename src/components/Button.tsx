import React, { useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Animated,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../const/colors';
import ThemeStyle from '../const/ThemeStyle';

// Define prop types
interface ButtonProps {
  iconName?: string;
  title: string;
  buttonType?: boolean;
  btnwidth?: number | string;
  stylesCss?: StyleProp<ViewStyle>;
  btnTextColor?: string;
  imgSrc?: ImageSourcePropType;
  bgColor?: string;
  shadowProp?: boolean;
  primaryShadow?: boolean;
  textSize?: StyleProp<TextStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  iconName,
  title,
  buttonType = false,
  btnwidth = '100%',
  stylesCss,
  btnTextColor,
  imgSrc,
  bgColor = COLORS.white,
  shadowProp = false,
  primaryShadow = false,
  textSize,
  onPress = () => { },
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = buttonType ? bgColor : COLORS.white;
  const textColor = buttonType ? btnTextColor || COLORS.white : btnTextColor;

  return (
    <Animated.View
  style={[
    styles.btnCustom,
    {
      transform: [{ scale: scaleAnim }],
      backgroundColor,
      width: (btnwidth ?? '100%') as number | 'auto' | `${number}%`,
    },
    !buttonType && !shadowProp && styles.shadowProp,
    stylesCss,
    primaryShadow && styles.primaryShadow,
  ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={disabled ? undefined : onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={styles.iconContainer}>
          {iconName && (
            <MaterialCommunityIcons
              name={iconName}
              style={[styles.icon, { color: textColor }]}
            />
          )}
          {imgSrc && (
            <Image source={imgSrc} resizeMode="contain" style={styles.imgStyle} />
          )}
          <Text
            style={[
              textSize || ThemeStyle.H3,
              { color: textColor },
            ]}
          >
            {title}
          </Text>
          {/* Empty view to balance the layout */}
          <View />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: COLORS.secondary,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryShadow: {
    shadowColor: 'rgb(255, 255, 255)',
    shadowOpacity: 1.0,
    elevation: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
  },
  btnCustom: {
    height: 50,
    justifyContent: 'center',
    borderRadius: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 22,
  },
  imgStyle:{
    width:25,
    height:25,
  }
  // title: {
  //   textAlign: 'center',
  // },
});

export default Button;
