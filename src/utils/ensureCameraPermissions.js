import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const ensureCameraPermission = async () => {
    const permission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
    });

    const result = await check(permission);
    console.log('Permission Result', result);
    if (result === RESULTS.GRANTED) {
        return true;
    }
    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
    }
    return false;
};
