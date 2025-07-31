import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import COLORS from '../const/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCameraPermission } from '../utils/usePermission';
import PermissionModal from './PermissionModal';

interface CameraPermissionScreenProps {
  onPermissionGranted: () => void;
  onBack: () => void;
}

const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({
  onPermissionGranted,
  onBack,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(true);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const {
    status: permissionStatus,
    isLoading,
    request,
    showSettingsAlert,
    isBlocked,
  } = useCameraPermission({
    autoCheck: true,
    autoRequest: false,
    onStatusChange: (status) => {
      if (status === 'granted' || status === 'limited') {
        onPermissionGranted();
      }
    },
  });

  const handleAllowClick = async () => {
    setShowCustomModal(false);
    await request();
  };

  const handleDeclineClick = () => {
    setShowCustomModal(false);
    setOpenSettingsModal(true);
  };

  const handleOpenSettings = () => {
    showSettingsAlert();
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

  if (isLoading || permissionStatus === 'checking') {
    return (
      <View style={styles.fullScreenContainer}>
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
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialCommunityIcons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.cameraBackground}>
          <TouchableOpacity style={styles.galleryButton}>
            <MaterialCommunityIcons name="image-multiple" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {openSettingsModal && (
          <View style={styles.deniedOverlay}>
            <View style={styles.deniedContent}>
              <View style={styles.cameraIconContainer}>
                <MaterialCommunityIcons name="camera-off" size={48} color={COLORS.white} />
              </View>
              <Text style={styles.deniedText}>
                Allow camera access. You'll be able to snap pictures of your pieces
              </Text>
              <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
                <Text style={styles.settingsButtonText}>Open settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>

      <PermissionModal
        visible={showCustomModal && permissionStatus === 'denied'}
        type="camera"
        status={permissionStatus}
        onAllow={handleAllowClick}
        onDecline={handleDeclineClick}
        onOpenSettings={handleOpenSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Black,
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