import { StyleSheet } from 'react-native';
import COLORS from './colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ThemeStyle = StyleSheet.create({
  // container: {
  //       flex: 1,
  //       backgroundColor: '#FFFFFF',
  //   },
  //   mainContainer: {
  //       flex: 1,
  //       paddingHorizontal: 20,
  //   },
  //   contentContainer: {
  //       bottom: 2,
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       marginBottom: 16,
  //   },

  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingHorizontal: width * 0.05,
  },  
  mainContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  containerColumn: {
    flex: 1,
    backgroundColor: COLORS.white,
    flexDirection: 'column',
  },
  contentContainerWithoutP: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  headingContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  inputContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },

  contentContainerBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  mainWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.028,
    paddingHorizontal: width * 0.08,
    position: 'relative',
  },
  containerView: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
  },
  backArrowWrapper: {
    position: 'absolute',
    left: 0,
  },
  backArrow: {
    width: 20,
    height: 20,
  },
  nameText: {
    color: COLORS.ShadowDarkest,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  text: {
    fontFamily: 'SFPRODISPLAYREGULAR',
  },
  textBold: {
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  H1: {
    fontFamily: 'SFPRODISPLAYMEDIUM',
    lineHeight: 48,
    fontSize: 36,
  },
  H2: {
    fontFamily: 'SFPRODISPLAYBOLD',
    lineHeight: 32,
    fontSize: 28,
  },
  H3: {
    fontFamily: 'SFPRODISPLAYMEDIUM',
    lineHeight: 24,
    fontSize: 20,
  },
  H4: {
    fontFamily: 'SFPRODISPLAYMEDIUM',
    lineHeight: 24,
    fontSize: 18,
  },
  H5: {
    fontFamily: 'SFPRODISPLAYMEDIUM',
    lineHeight: 24,
    fontSize: 13,
  },
  body0: {
    fontFamily: 'SFPRODISPLAYREGULAR',
    lineHeight: 24,
    fontSize: 20,
  },
  body1: {
    fontFamily: 'SFPRODISPLAYREGULAR',
    lineHeight: 24,
    fontSize: 18,
  },
  body2: {
    fontFamily: 'SFPRODISPLAYREGULAR',
    lineHeight: 18,
    fontSize: 16,
  },
  body3: {
    fontFamily: 'SFPRODISPLAYREGULAR',
    lineHeight: 15,
    fontSize: 13,
  },
  body4: {
    fontFamily: 'SFPRODISPLAYREGULAR',
    lineHeight: 15,
    fontSize: 10,
  },

  body5: {
    fontFamily: 'SFPRODISPLAYREGULAR',
    lineHeight: 15,
    fontSize: 14,
  },

  miscellaneousFontSize: {
    fontSize: 11,
    fontWeight: '400',
  },

  Font16: {
    fontSize: 16,
  },
  FontUnderline: {
    textDecorationLine: 'underline',
  },
  FontWeight400: {
    fontWeight: '400',
  },
  FontWeight600: {
    fontWeight: '600',
  },
  FontWeight700: {
    fontWeight: '700',
  },
  signupNloginLogo: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  stylesCssOne: { borderWidth: 0, marginTop: 20 },
  stylesCssTwo: { borderWidth: 1, marginTop: 12 },

  fitItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  fitItem: {
    width: '30%',
    marginBottom: 20,
    position: 'relative',
    marginHorizontal: 5,
  },
  fitItemWrapper: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.SecondaryDarkest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: height * 0.32,
    justifyContent: 'space-around',
  },
  headItem: { height: height * 0.04, marginBottom: 3, aspectRatio: 1 / 1 },
  upperItem: { height: height * 0.1, marginBottom: 3, aspectRatio: 1 / 1 },
  lowerItem: { height: height * 0.12, marginBottom: 3, aspectRatio: 1 / 1 },
  shoesItem: { height: height * 0.05, aspectRatio: 1 / 1 },
  itemContainer: {
    width: width / 3 - 20,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 2,
  },

  checkboxContainer: { position: 'absolute', top: 5, right: 5, zIndex: 1 },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layerUpperStyle: {
    position: 'absolute',
    right: 15,
    zIndex: 2,
  },
  layerInnerStyle: {
    position: 'absolute',
    left: 12,
  },
  blurEffect: {
    position: 'absolute',
    width: '200%', // Extends blur beyond button
    height: '200%', // Increase height for a stronger blur effect
    borderRadius: 50, // Makes blur smooth
  },
  glowEffect: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    borderRadius: 50,
  },
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  flexGrow: {
    flexGrow: 1,
  },
});

export default ThemeStyle;
