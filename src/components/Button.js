import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, Animated } from 'react-native';
import COLORS from '../const/colors';
import ThemeStyle from '../const/ThemeStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Button = props => {
  const {
    iconName,
    title,
    buttonType,
    btnwidth,
    stylesCss,
    btnTextColor,
    imgSrc,
    imgStyle,
    bgColor,
    shadowProp,
    primaryShadow,
    textSize,
    onPress = () => {},
    disabled,
  } = props;

  // Create an animated value for scale
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Function to handle the press in animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95, // Scale down to 95% of original size
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Function to handle the press out animation
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Scale back to original size
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = buttonType === true ? bgColor : COLORS.white;
  const textColor = buttonType ? btnTextColor || COLORS.white : btnTextColor;

  return (
    <Animated.View
      style={[
        style.btnCustom,
        {
          transform: [{ scale: scaleAnim }],
          backgroundColor: backgroundColor,
          width: btnwidth || '100%',
        },
        buttonType ? '' : shadowProp ? '' : style.shadowProp,
        stylesCss,
        primaryShadow ? style.primaryShadow : '',
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={disabled ? null : onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={style.iconContai}>
          {iconName && (
            <MaterialCommunityIcons
              name={iconName}
              style={[
                style.font18,
                style.titleWithIcon,
                {
                  color: textColor,
                },
              ]}
            />
          )}
          {imgSrc && (
            <Image source={imgSrc} resizeMode="contain" style={[imgStyle, style.titleWithIcon]} />
          )}
          <Text
            style={[
              textSize ? textSize : ThemeStyle.H4,
              style.titlesty,
              {
                color: textColor,
              },
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  shadowProp: {
    shadowColor: COLORS.SecondaryDarkest,
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
    height: 45,
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconContai: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  font18: { fontSize: 18 },
  titlesty: {
    textAlign: 'center',
  },
  titleWithIcon: {
    marginRight: 10,
  },
});

export default Button;
