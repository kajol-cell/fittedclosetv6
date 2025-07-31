import { Platform, Linking, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Camera } from 'react-native-vision-camera';

export type PermissionStatus = 'checking' | 'granted' | 'denied' | 'limited' | 'blocked' | 'unavailable';

export type PermissionType = 'camera' | 'photoLibrary' | 'location' | 'contacts';

interface PermissionConfig {
  ios: any;
  android: any;
  title: string;
  message: string;
}

const PERMISSION_CONFIGS: Record<PermissionType, PermissionConfig> = {
  camera: {
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
    title: 'Camera Permission',
    message: 'Fitted needs access to your camera to capture pieces.',
  },
  photoLibrary: {
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    title: 'Photos Permission',
    message: 'Fitted needs access to your photos to let you edit images.',
  },

  location: {
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    title: 'Location Permission',
    message: 'Fitted needs access to your location to provide accurate outfit suggestions.',
  },
  contacts: {
    ios: PERMISSIONS.IOS.CONTACTS,
    android: PERMISSIONS.ANDROID.READ_CONTACTS,
    title: 'Contacts Permission',
    message: 'Fitted needs access to your contacts to help you share outfits.',
  },
};

/**
 * Get the appropriate permission constant for the current platform
 */
export const getPermissionConstant = (type: PermissionType) => {
  const config = PERMISSION_CONFIGS[type];
  return Platform.select({
    ios: config.ios,
    android: config.android,
  });
};

/**
 * Check permission status for a specific permission type
 */
export const checkPermission = async (type: PermissionType): Promise<PermissionStatus> => {
  try {
    const permission = getPermissionConstant(type);
    if (!permission) {
      return 'unavailable';
    }

    const result = await check(permission);
    
    switch (result) {
      case RESULTS.GRANTED:
        return 'granted';
      case RESULTS.DENIED:
        return 'denied';
      case RESULTS.LIMITED:
        return 'limited';
      case RESULTS.BLOCKED:
        return 'blocked';
      case RESULTS.UNAVAILABLE:
        return 'unavailable';
      default:
        return 'denied';
    }
  } catch (error) {
    console.error(`Error checking ${type} permission:`, error);
    return 'denied';
  }
};

/**
 * Request permission for a specific permission type
 */
export const requestPermission = async (type: PermissionType): Promise<PermissionStatus> => {
  try {
    const permission = getPermissionConstant(type);
    if (!permission) {
      return 'unavailable';
    }

    const result = await request(permission);
    
    switch (result) {
      case RESULTS.GRANTED:
        return 'granted';
      case RESULTS.DENIED:
        return 'denied';
      case RESULTS.LIMITED:
        return 'limited';
      case RESULTS.BLOCKED:
        return 'blocked';
      case RESULTS.UNAVAILABLE:
        return 'unavailable';
      default:
        return 'denied';
    }
  } catch (error) {
    console.error(`Error requesting ${type} permission:`, error);
    return 'denied';
  }
};

/**
 * Check and request permission in one call (legacy compatibility)
 */
export const ensurePermission = async (type: PermissionType): Promise<boolean> => {
  const status = await checkPermission(type);
  
  if (status === 'granted' || status === 'limited') {
    return true;
  }
  
  if (status === 'denied') {
    const requestStatus = await requestPermission(type);
    return requestStatus === 'granted' || requestStatus === 'limited';
  }
  
  return false;
};

/**
 * Open device settings
 */
export const openSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

/**
 * Show permission denied alert with option to open settings
 */
export const showPermissionDeniedAlert = (
  type: PermissionType,
  onOpenSettings?: () => void,
  onCancel?: () => void
) => {
  const config = PERMISSION_CONFIGS[type];
  
  Alert.alert(
    config.title,
    `${config.message}\n\nPlease enable this permission in your device settings to continue.`,
    [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { 
        text: 'Open Settings', 
        onPress: () => {
          openSettings();
          onOpenSettings?.();
        }
      },
    ]
  );
};

/**
 * Check if permission is permanently denied (requires settings)
 */
export const isPermissionPermanentlyDenied = (status: PermissionStatus): boolean => {
  return status === 'blocked';
};

/**
 * Check if permission can be requested again
 */
export const canRequestPermission = (status: PermissionStatus): boolean => {
  return status === 'denied';
};

/**
 * Legacy camera permission function for backward compatibility
 */
export const ensureCameraPermission = async (): Promise<boolean> => {
  return ensurePermission('camera');
};

/**
 * Vision Camera compatibility function
 */
export const checkVisionCameraPermission = async (): Promise<boolean> => {
  try {
    const permission = await Camera.requestCameraPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error checking vision camera permission:', error);
    return false;
  }
}; 