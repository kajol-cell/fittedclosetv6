import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import COLORS from '../const/colors';
import ThemeStyle from '../const/ThemeStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface CameraPermissionScreenProps {
  onPermissionGranted: () => void;
  onBack: () => void;
  onNavigateToCamera: () => void;
}

const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({
  onPermissionGranted,
  onBack,
  onNavigateToCamera,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'asking' | 'granted' | 'denied'>('checking');
  const [showCustomModal, setShowCustomModal] = useState(true);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      const result = await check(permission);
      
      if (result === RESULTS.GRANTED) {
        setPermissionStatus('granted');
        onPermissionGranted();
      } else {
        setPermissionStatus('asking');
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      setPermissionStatus('asking');
    }
  };

  const handleAllowClick = async () => {
    setShowCustomModal(false);
    try {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        setPermissionStatus('granted');
        onNavigateToCamera();
      } else {
        setPermissionStatus('denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setPermissionStatus('denied');
    }
  };

  const handleDeclineClick = () => {
    setShowCustomModal(false);
    setPermissionStatus('denied');
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Go Back',
      'Are you sure you want to go back? You need camera access to add pieces.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Back', style: 'destructive', onPress: onBack },
      ]
    );
  };

  if (permissionStatus === 'checking') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Checking permissions...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialCommunityIcons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Camera View Background */}
        <View style={styles.cameraBackground}>
          {/* Gallery Icon */}
          <TouchableOpacity style={styles.galleryButton}>
            <MaterialCommunityIcons name="image-multiple" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Custom Permission Modal */}
        {showCustomModal && (
          <View style={styles.permissionModal}>
            <Text style={styles.permissionTitle}>"Fitted" Would Like to Access the Camera</Text>
            <Text style={styles.permissionDescription}>Snap photos of your pieces</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.declineButton} onPress={handleDeclineClick}>
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.allowButton} onPress={handleAllowClick}>
                <Text style={styles.allowButtonText}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Camera Access Denied Screen */}
        {permissionStatus === 'denied' && (
          <View style={styles.deniedOverlay}>
            <View style={styles.deniedContent}>
              <View style={styles.cameraIconContainer}>
                <MaterialCommunityIcons name="camera-off" size={48} color={COLORS.white} />
              </View>
              <Text style={styles.deniedText}>
                Allow camera access. You'll be able to snap pictures of your pieces
              </Text>
              <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
                <Text style={styles.settingsButtonText}>Open settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  cameraBackground: {
    flex: 1,
    position: 'relative',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  permissionModal: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    transform: [{ translateY: -100 }],
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.Black,
    textAlign: 'center',
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 16,
    color: COLORS.secondaryDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.grayLight,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.Black,
    textAlign: 'center',
  },
  allowButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
  deniedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deniedContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cameraIconContainer: {
    marginBottom: 20,
  },
  deniedText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  settingsButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.Black,
  },
});

export default CameraPermissionScreen; 