import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import COLORS from '../const/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface CameraScreenProps {
  onPhotoTaken: (photo: any) => void;
  onBack: () => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({
  onPhotoTaken,
  onBack,
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [photo, setPhoto] = useState<any>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  React.useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    setHasPermission(cameraPermission === 'granted');
  };

  const takePhoto = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        setPhoto(photo);
        setIsReviewMode(true);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setIsReviewMode(false);
  };

  const usePhoto = () => {
    onPhotoTaken(photo);
  };

  const handleBack = () => {
    if (isReviewMode) {
      Alert.alert(
        'Go Back',
        'Are you sure you want to go back? This will discard the photo.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Back', style: 'destructive', onPress: onBack },
        ]
      );
    } else {
      onBack();
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>Camera permission is required</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>Camera not available</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (isReviewMode && photo) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Photo Review */}
          <View style={styles.photoContainer}>
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={false}
              photo={true}
            />
            <View style={styles.photoOverlay}>
              <View style={styles.photoFrame} />
            </View>
          </View>

          {/* Review Controls */}
          <View style={styles.reviewControls}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <MaterialCommunityIcons name="delete" size={20} color={COLORS.white} />
              <Text style={styles.retakeButtonText}>Retake photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.usePhotoButton} onPress={usePhoto}>
              <MaterialCommunityIcons name="check" size={20} color={COLORS.white} />
              <Text style={styles.usePhotoButtonText}>Use photo</Text>
            </TouchableOpacity>
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

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          
          {/* Camera Overlay */}
          <View style={styles.cameraOverlay}>
            <View style={styles.serveArea} />
          </View>
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.galleryButton}>
            <MaterialCommunityIcons name="image-multiple" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shutterButton} onPress={takePhoto}>
            <View style={styles.shutterButtonInner} />
          </TouchableOpacity>
          
          <View style={styles.placeholder} />
        </View>
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: COLORS.white,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serveArea: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  galleryButton: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.Black,
  },
  placeholder: {
    width: 48,
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFrame: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 8,
  },
  reviewControls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    gap: 8,
  },
  retakeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  usePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    gap: 8,
  },
  usePhotoButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen; 