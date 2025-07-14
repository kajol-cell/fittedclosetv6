import React, {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Button from '../../components/Button';
import COLORS from '../../const/colors';
import {useNavigation} from '@react-navigation/native';
import ThemeStyle from '../../const/ThemeStyle';
import Switchbtn from '../../components/buttons/Switchbtn';
import HeaderOne from '../../components/headers/HeaderOne';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch} from 'react-redux';

const Permissions = () => {
  const dispatch = useDispatch();
  const navigationRoute = useNavigation();

  const [photosPermission, setPhotosPermission] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(true);
  const [notificationsPermission, setNotificationsPermission] = useState(true);
  const [locationPermission, setLocationPermission] = useState(true);
  const [contactsPermission, setContactsPermission] = useState(false);

  const handleEnablePermissions = async () => {
    dispatch({type: 'SHOW_LOADER'});
    try {
      if (photosPermission) {
        const photosPermissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Photos Permission',
            message:
              'Fitted needs access to your photos to let you edit images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (photosPermissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
          dispatch({
            type: 'SHOW_SNACKBAR',
            payload: 'Photos permission denied',
          });
        }
      }

      // Request camera permission
      if (cameraPermission) {
        const cameraPermissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Fitted needs access to your camera to capture pieces.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (cameraPermissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
          dispatch({
            type: 'SHOW_SNACKBAR',
            payload: 'Camera permission denied',
          });
        }
      }

      // Request location permission
      if (locationPermission) {
        const locationPermissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'Fitted needs access to your location to provide accurate outfit suggestions.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (locationPermissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
          dispatch({
            type: 'SHOW_SNACKBAR',
            payload: 'Location permission denied',
          });
        }
      }

      // Request contacts permission
      if (contactsPermission) {
        const contactsPermissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message:
              'Fitted needs access to your contacts to connect with people you know.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (contactsPermissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
          dispatch({
            type: 'SHOW_SNACKBAR',
            payload: 'Contacts permission denied',
          });
        }
      }
      dispatch({type: 'HIDE_LOADER'});
      // navigationRoute.navigate('HowToUpload');
      navigationRoute.goBack();
    } catch (error) {
      dispatch({type: 'HIDE_LOADER'});
      dispatch({
        type: 'SHOW_SNACKBAR',
        payload: 'Error requesting permissions ' + error,
      });
    }
  };

  return (
    <>
      <SafeAreaView style={[ThemeStyle.mainContainer]}>
        <View style={ThemeStyle.containerView}>
          <HeaderOne pageName={'Permissions'} />
          <Text style={ThemeStyle.H2}>Manage your permissions</Text>
          <Text
            style={[
              {paddingVertical: 10},
              ThemeStyle.text,
              ThemeStyle.FontWeight600,
            ]}>
            For the best experience on Fitted, please grant access to the
            following settings:
          </Text>

          <View style={[styles.permissionContainer]}>
            <Ionicons name="images-outline" style={styles.iconstyle} />
            {/* <Image
                            source={require('../../assets/extra/gallery1.png')}
                            style={{ width: 40 }}
                            resizeMode="contain"
                        /> */}
            <View style={styles.textContainer}>
              <Text
                style={[ThemeStyle.H4, {fontWeight: '600', paddingBottom: 5}]}>
                Photos
              </Text>
              <Text style={[ThemeStyle.body3, {fontWeight: '600'}]}>
                Easily edit images of your pieces directly from your Camera Roll
                on Fitted.
              </Text>
            </View>
            <Switchbtn value={photosPermission} setFun={setPhotosPermission} />
          </View>

          <View style={styles.permissionContainer}>
            <SimpleLineIcons name="camera" style={styles.iconstyle} />
            {/* <Image
                            source={require('../../assets/extra/camera.png')}
                            style={{ width: 40 }}
                            resizeMode="contain"
                        /> */}
            <View style={styles.textContainer}>
              <Text
                style={[ThemeStyle.H4, {fontWeight: '600', paddingBottom: 5}]}>
                Camera
              </Text>
              <Text style={[ThemeStyle.body3, {fontWeight: '600'}]}>
                Capture pieces right from your phone.
              </Text>
            </View>
            <Switchbtn value={cameraPermission} setFun={setCameraPermission} />
          </View>

          <View style={styles.permissionContainer}>
            <Ionicons name="notifications-outline" style={styles.iconstyle} />
            {/* <Image
                            source={require('../../assets/extra/notification.png')}
                            style={{ width: 40 }}
                            resizeMode="contain"
                        /> */}
            <View style={styles.textContainer}>
              <Text
                style={[ThemeStyle.H4, {fontWeight: '600', paddingBottom: 5}]}>
                Notifications
              </Text>
              <Text style={[ThemeStyle.body3, {fontWeight: '600'}]}>
                Be notified on when new pieces are uploaded and outfit
                suggestions.
              </Text>
            </View>
            <Switchbtn
              value={notificationsPermission}
              setFun={setNotificationsPermission}
            />
          </View>

          <View style={styles.permissionContainer}>
            <Ionicons name="location-outline" style={styles.iconstyle} />
            {/* <Image
                            source={require('../../assets/extra/location-pin.png')}
                            style={{ width: 40 }}
                            resizeMode="contain"
                        /> */}
            <View style={styles.textContainer}>
              <Text
                style={[ThemeStyle.H4, {fontWeight: '600', paddingBottom: 5}]}>
                Location
              </Text>
              <Text style={[ThemeStyle.body3, {fontWeight: '600'}]}>
                Get accurate outfit suggestions based on weather and local
                culture.
              </Text>
            </View>
            <Switchbtn
              value={locationPermission}
              setFun={setLocationPermission}
            />
          </View>

          <View style={styles.permissionContainer}>
            <AntDesign name="contacts" style={styles.iconstyle} />
            {/* <Image
                            source={require('../../assets/extra/contact1.png')}
                            style={{ width: 40 }}
                            resizeMode="contain"
                        /> */}
            <View style={styles.textContainer}>
              <Text
                style={[ThemeStyle.H4, {fontWeight: '600', paddingBottom: 5}]}>
                Contacts
              </Text>
              <Text style={[ThemeStyle.body3, {fontWeight: '600'}]}>
                Connect with people you already know on Fitted by syncing your
                contacts.
              </Text>
            </View>
            <Switchbtn
              value={contactsPermission}
              setFun={setContactsPermission}
            />
          </View>
        </View>

        <View style={ThemeStyle.contentContainerBottom}>
          <Button
            title="Continue"
            buttonType
            bgColor={COLORS.btnColor}
            btnTextColor={COLORS.SecondaryDarkest}
            stylesCss={ThemeStyle.stylesCssOne}
            btnwidth="100%"
            onPress={() => handleEnablePermissions()}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  permissionContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.ShadowLight,
  },
  icon: {width: 40},
  textContainer: {flex: 1, paddingHorizontal: 5},
  iconstyle: {fontSize: 32, color: COLORS.ShadowDark},
});

export default Permissions;
