import {requestTrackingPermission} from 'react-native-tracking-transparency';
import Purchases from "react-native-purchases";
import {isIOS} from "./platformUtils";
import {REVENUE_CAT_CONFIG} from "../config/appConfig";

const initializeTracking = async () => {
    try {
        const status = await requestTrackingPermission();
        console.log('📊 Tracking Permission Status:', status);
    } catch (error) {
        console.error('❌ Error requesting tracking permission:', error);
    }
};

const initializeRevenueCat = async () => {
    try {
        const apiKey = isIOS() ? REVENUE_CAT_CONFIG.IOS_API_KEY : REVENUE_CAT_CONFIG.ANDROID_API_KEY;
        Purchases.configure({ apiKey });
        console.log('✅ RevenueCat initialized');
    } catch (error) {
        console.error('❌ RevenueCat initialization failed:', error);
    }
};

export {initializeRevenueCat, initializeTracking}
