import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLORS from '../const/colors';
import {BlurView} from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Button from './Button';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Purchases from 'react-native-purchases';
import {useFocusEffect} from '@react-navigation/native';
import {trackSubscriptionPurchaseComplete, trackSubscriptionPurchaseStart} from '../lib/analytics';
import {logTikTokPurchaseEvent} from './tiktok';
import {hideLoading, showLoading} from '../redux/features/loadingSlice';
import {setEntitled} from '../redux/features/sessionSlice';

const RevenueCat = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [selectedPackage, setSelectedPackage] = useState();
  const [offerings, setOfferings] = useState(null);

  const purchasePackage = async pkg => {
    console.log('pkg', pkg);
    const canMakePurchases = await Purchases.canMakePayments();
    console.log('canMakePurchases', canMakePurchases);
    if (!canMakePurchases) {
      Alert.alert('Purchases', 'Unable to make purchases. Please check your payment settings.');
      return;
    }
    // Show loader before processing
    dispatch(showLoading());
    try {
      trackSubscriptionPurchaseStart(pkg);
      const purchaseResult = await Purchases.purchasePackage(pkg);
      // console.log('purchasePackage', JSON.stringify(purchaseResult, null, 2));
      await processSubscription(purchaseResult, pkg);
    }
    catch (error) {
      console.error('Purchase Failed:', error);
    }
    finally {
      // Hide loader after processing, regardless of success or failure
      dispatch(hideLoading());
    }
  };

  const processSubscription = async (eventInfo, pkg) => {
    if (eventInfo?.productIdentifier && eventInfo.transaction?.transactionIdentifier) {
      dispatch(setEntitled(true));
      trackSubscriptionPurchaseComplete(eventInfo);
      logTikTokPurchaseEvent(eventInfo, pkg);
      Alert.alert('Subscription Successful', `You have successfully subscribed to ${pkg.packageType} for ${pkg.product.priceString}.`);
      navigation.goBack();
    }
    else {
      Alert.alert('Subscription Error', 'Invalid subscription data received. Please try again.');
      console.error('Invalid event data for subscription processing.');
    }
  };

  const fetchOfferings = useCallback(async () => {
    try {
      const offeringsData = await Purchases.getOfferings();
      //console.log('offeringsData',JSON.stringify(offeringsData.current, null, 2))
      if (offeringsData.current) {
        setOfferings(offeringsData.current);
      }
    }
    catch (error) {
      console.error('Error fetching offerings', error);
    }
  }, []);

  useEffect(() => {
    if (offerings?.availablePackages?.length > 0 && !selectedPackage) {
      // Find the Annual package
      const annualPackage = offerings.availablePackages.find(pkg => pkg.packageType === 'ANNUAL');

      // Set the Annual package if found, otherwise default to the first package
      if (annualPackage) {
        setSelectedPackage(annualPackage);
        // console.log('Default Selected Package:', annualPackage);
      }
      else {
        setSelectedPackage(offerings.availablePackages[0]); // Fallback
      }
    }

  }, [offerings, selectedPackage]);

  useFocusEffect(() => {
    fetchOfferings();
  });

  const getCheckmarkColor = (pkg) => selectedPackage?.identifier === pkg.identifier ? '#0094ff' : COLORS.LockGrey;

  function doCancel() {
    navigation.goBack();
  }

  if (!offerings) {
    return null;
  }
  return (<SafeAreaView style={styles.container} edges={Platform.OS === 'android' ? ['top', 'bottom'] : ['bottom']}>
    <LinearGradient
      colors={['#0094ff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
      style={styles.linearGradient}
    >
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={doCancel} style={styles.closeButton}>
          <Ionicons name="close-outline" size={35}/>
        </TouchableOpacity>

        <View style={styles.modalContent}>
          <Text style={styles.heading}>+Unlimited</Text>
          <Text style={styles.subHeading}>
            Be admired for fits that elevate your style and turn heads
          </Text>

          <View style={styles.feature}>
            <Ionicons name="scan-outline" size={22} style={styles.unlimitedIcon}/>
            <Text style={styles.featureText}>Upload unlimited pieces</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="shirt" size={22} style={styles.shirtIcon}/>
            <Text style={styles.featureText}>Create unlimited fits</Text>
          </View>
          <View style={styles.feature}>
            <Octicons name="stack" size={22} style={styles.StckIcon}/>
            <Text style={styles.featureText}>Create unlimited collections</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="sparkles-sharp" size={22} style={styles.sharpIcon}/>
            <Text style={styles.featureText}>Early access to new features</Text>
          </View>

          <View style={styles.packageSection}>
            {offerings && offerings.availablePackages.map(pkg => (<TouchableOpacity
              key={pkg.identifier}
              style={[styles.packageItem, selectedPackage?.identifier === pkg.identifier && styles.selectedPackageItem]}
              //        style={styles.packageItem}
              onPress={() => setSelectedPackage(pkg)}
            >
              <View style={styles.packageCheckmark}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  style={{
                    color: getCheckmarkColor(pkg),
                  }}
                />

                <Text style={styles.packageTitle}>{pkg.packageType}</Text>
              </View>
              <View style={styles.packageDetails}>
                <Text style={styles.packagePrice}>{`${pkg.product.priceString}`}</Text>
                <Text style={styles.packageDescription}>{pkg.product.description}</Text>
              </View>
            </TouchableOpacity>))}
            {selectedPackage?.product?.priceString && (<View style={styles.width100}>
              <Button
                buttonType
                bgColor={COLORS.SecondaryDarkest}
                title={`Subscribe for ${selectedPackage.product.priceString}/${selectedPackage.packageType}`}
                onPress={() => purchasePackage(selectedPackage)}
                btnwidth="100%"
                stylesCss={styles.stylesCssOne}
              />
            </View>)}
          </View>
          <View style={styles.footerStyle}>
            <Text style={styles.FooterText}>
              Subscriptions billed as one payment. Recurring billing.
            </Text>
            <Text style={styles.FooterText}>Cancel anytime for any reason</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  </SafeAreaView>);
};

export default RevenueCat;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
  },
  innerContainer: {
    paddingVertical: 50,
    width: width * 0.9,
    height: height * 0.8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    //  backgroundColor:'red'
  },
  linearGradient: {
    flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',
  },
  absolute: {
    position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
  },
  closeButton: {
    position: 'absolute', right: 5, top: 5,
  },
  modalContent: {
    alignItems: 'flex-start', width: '100%',
  },
  heading: {
    fontStyle: 'italic', textAlign: 'left', fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: '#0500ff',
  },
  subHeading: {
    textAlign: 'left', fontSize: 24, marginBottom: 20,
  },
  feature: {
    flexDirection: 'row', marginBottom: 10, justifyContent: 'center', alignItems: 'center',
  },
  featureText: {
    fontSize: 16, paddingLeft: 10,
  },
  packageSection: {
    marginTop: 100, width: '100%',
  },
  packageItem: {
    width: '100%',
    padding: 10,
    backgroundColor: COLORS.ShadowLightest,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageDetails: {
    flexDirection: 'column', padding: 10, borderRadius: 8, alignItems: 'flex-end',
  },
  packageCheckmark: {
    flexDirection: 'row',
  },
  packageTitle: {
    paddingLeft: 5, fontSize: 15,
  },
  packagePrice: {
    fontSize: 16, color: COLORS.primary,
  },
  packageDescription: {
    fontSize: 13, color: COLORS.primary,
  },
  stylesCssOne: {
    borderRadius: 20,
  },
  footerStyle: {
    width: '100%', alignItems: 'center', marginTop: 20,
  },
  FooterText: {
    textAlign: 'center', fontSize: 12, color: COLORS.charcoalColor,
  },
  selectedPackageItem: {
    borderWidth: 2, borderColor: '#0094ff', backgroundColor: COLORS.lightBackground,
  },
  unlimitedIcon: {color: 'blue'},
  shirtIcon: {color: 'green'},
  StckIcon: {color: 'magenta'},
  sharpIcon: {color: '#ccc'},
  width100: {width: '100%'},
});
