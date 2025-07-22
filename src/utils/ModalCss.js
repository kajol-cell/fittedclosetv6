import {StyleSheet} from 'react-native';
import COLORS from './colors';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const ModalCss = StyleSheet.create({
  // modalOverlay: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // },
  // modalContainer: {
  //   alignItems: 'flex-start',
  //   backgroundColor: '#fff',
  //   width: '93%',
  //   borderRadius: 20,
  //   maxHeight: height * 0.8,
  //   padding:5,
  // },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: width * 0.93,
    minHeight: height * 0.3,
    borderRadius: 20,
    marginVertical: 70,
    padding: 5,
    // backgroundColor:'green'
  },
  recyclerView: {
    //minHeight:height*0.3,
    height: 'inhirit',
    width: '100%',
    //  backgroundColor:'red'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 10,
  },
  innerWrapper: {
    borderRadius: 10,
    backgroundColor: COLORS.OffWhite,
    padding: 12,
    height: height * 0.3,
  },
  input: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: COLORS.ShadowDarkest,
  },
  blueTick: {
    backgroundColor: '#fff',
    borderRadius: 10,
    color: '#56C2FF',
  },
  fitItem: {
    width: '32%',
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
    marginHorizontal: 1,
  },

  noPiecesText: {
    textAlign: 'center',
    marginTop: 20,
  },
  // fitItemWrapper: {
  //     alignItems: "center", borderRadius: 10,
  //     backgroundColor: COLORS.white, shadowColor: "#000",
  //     shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25,
  //     shadowRadius: 3.84, elevation: 5, borderWidth: 1, borderColor: COLORS.btnColor
  // },
  // fitItemWrapper: {
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   backgroundColor: COLORS.white,
  //   shadowColor: COLORS.SecondaryDarkest,
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  //   height: height * 0.32,
  //   justifyContent: 'space-around',
  // },
  // headItem: {width: width * 0.1, height: height * 0.04, marginBottom: 3},
  // upperItem: {width: width * 0.2, height: height * 0.1, marginBottom: 3},
  // lowerItem: {width: width * 0.2, height: height * 0.1, marginBottom: 3},
  // shoesItem: {width: width * 0.12, height: height * 0.05},
  btncontainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    left: 12,
    right: 12,
    width: 'auto',
    justifyContent: 'space-between',
  },
  inputHead: {marginBottom: 20, fontSize: 17, fontWeight: '700'},
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ModalCss;
