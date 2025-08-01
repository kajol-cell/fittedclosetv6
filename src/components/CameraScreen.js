import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import COLORS from '../const/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callSessionApi, addPieces } from '../redux/features/sessionSlice';
import { SessionMessageType } from '../utils/enums';
import { resizeImageList, createImageUploadData, createImageDataUrl } from '../utils/imageUtils';
import { useCameraPermission, usePhotoLibraryPermission } from '../utils/usePermission';
import CameraPermissionScreen from './CameraPermissionScreen';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');

const CameraScreen = ({ onPhotoTaken, onBack }) => {
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState(null);
  const [screenState, setScreenState] = useState('camera');
  const [pieceData, setPieceData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);


  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'back');

  const {
    isLoading: cameraPermissionLoading,
    isGranted: isCameraGranted,
  } = useCameraPermission({
    autoCheck: true,
    autoRequest: false,
  });

  const {
    showSettingsAlert: showGallerySettingsAlert,
    isGranted: isGalleryGranted,
  } = usePhotoLibraryPermission({
    autoCheck: false,
    autoRequest: false,
  });

  const openGallery = async () => {
    console.log('openGallery called, hasGalleryPermission:', isGalleryGranted);

    console.log('Launching image library...');
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8,
      includeBase64: false,
    };

    const callback = (response) => {
      console.log('Gallery response:', response);

      if (response.didCancel) {
        console.log('User cancelled gallery selection');
        return;
      }

      if (response.errorMessage) {
        console.error('Gallery error:', response.errorMessage);
        if (response.errorMessage.includes('permission') || response.errorMessage.includes('Permission')) {
          Alert.alert(
            'Permission Required',
            'Gallery permission is required to select photos. Please grant permission in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Grant Permission', onPress: () => showGallerySettingsAlert() },
            ]
          );
        } else {
          Alert.alert('Error', 'Failed to open gallery. Please try again.');
        }
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const selectedPhoto = response.assets[0];
        console.log('Selected photo:', selectedPhoto);

        if (selectedPhoto.uri) {
          const photoData = {
            path: selectedPhoto.uri,
            uri: selectedPhoto.uri,
            fileSize: selectedPhoto.fileSize || 0,
            width: selectedPhoto.width || 0,
            height: selectedPhoto.height || 0,
          };
          setPhoto(photoData);
          setScreenState('review');
        }
      }
    };

    try {
      launchImageLibrary(options, callback);
    } catch (error) {
      console.error('Error launching gallery:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({ flash: 'off' });
        setPhoto(photo);
        setScreenState('review');
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setScreenState('camera');
  };

  const uploadPhotoForAnalysis = async (photo) => {
    try {
      setLoadingProgress(0);

      const photoUri = getPhotoUri(photo);
      const dimensions = await getImageDimensions(photoUri);

      const photoForUpload = {
        uri: photoUri,
        type: 'image/jpeg',
        fileName: `photo_${Date.now()}.jpg`,
        fileSize: photo.fileSize || 0,
        width: dimensions.width,
        height: dimensions.height,
      };

      const resizedImages = await resizeImageList([photoForUpload], 800);
      setLoadingProgress(25);

      const fileMap = resizedImages.reduce((acc, img) => {
        acc[img.fileName] = img.type;
        return acc;
      }, {});

      console.log('Requesting upload info with fileMap:', fileMap);
      const responseData = await dispatch(
        callSessionApi({
          messageType: SessionMessageType.IMAGE_UPLOAD_INFO,
          payload: fileMap
        })
      ).unwrap();
      console.log('Upload info response:', responseData);
      setLoadingProgress(50);

      const uploadPromises = resizedImages.map(img => {
        const uploadUrl = responseData[img.fileName].uploadUrl;
        const binaryData = createImageUploadData(img);
        return axios.put(uploadUrl, binaryData, {
          headers: {
            'Content-Type': `${img.type}; charset=utf-8`,
            'Content-Length': binaryData.byteLength,
          },
        });
      });

      await Promise.all(uploadPromises);
      setLoadingProgress(75);

      const fittedImages = resizedImages.map(img => ({
        mainImage: true,
        pieceImageType: 'FRONT',
        fileName: img.fileName,
        mimeType: img.type,
        photoId: responseData[img.fileName].imageId,
        fileSize: img.fileSize,
      }));

      console.log('Submitting piece photos with fittedImages:', fittedImages);
      const pieceUploadInfo = await dispatch(
        callSessionApi({
          messageType: SessionMessageType.SUBMIT_PIECE_PHOTOS,
          payload: { photos: fittedImages }
        })
      ).unwrap();
      console.log('Piece upload info response:', pieceUploadInfo);
      setLoadingProgress(100);

      return pieceUploadInfo;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const usePhoto = async () => {
    try {
      setScreenState('loading');
      const pieceUploadInfo = await uploadPhotoForAnalysis(photo);
      
      if (!pieceUploadInfo || !pieceUploadInfo.pieceInfos || pieceUploadInfo.pieceInfos.length === 0) {
        throw new Error('No piece data received from server');
      }
      
      const pieceInfo = pieceUploadInfo.pieceInfos[0];
      console.log('Piece data received:', pieceInfo);
      
      // Create local image URL for display
      const photoUri = getPhotoUri(photo);
      pieceInfo.imageUrl = photoUri;
      pieceInfo.newPiece = true;
      
      setPieceData(pieceInfo);
      setScreenState('pieceReview');
    } catch (error) {
      console.error('Error in usePhoto:', error);
      Alert.alert('Error', 'Failed to analyze photo. Please try again.');
      setScreenState('review');
    }
  };

  const addToCloset = () => {
    if (pieceData) {
      // Add the piece to the Redux store
      dispatch(addPieces([pieceData]));
      // Call the callback to notify parent component
      onPhotoTaken(pieceData);
    }
  };

  const handleBack = () => {
    if (screenState === 'review') {
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

  const renderHeader = (title, onBackPress, showMore = false) => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons
          name="chevron-back"
          size={22}
          color={screenState === 'pieceReview' ? COLORS.Black : COLORS.white}
        />
      </TouchableOpacity>
      {title && (
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText, { color: COLORS.Black }]}>{title}</Text>
        </View>
      )}
      {showMore && (
        <TouchableOpacity style={styles.moreButton}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={COLORS.Black} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingScreen = () => (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
      <SafeAreaView style={styles.safeArea}>
        {renderHeader('', handleBack)}
        <View style={styles.photoContainer}>
          <FastImage
            source={{ uri: getPhotoUri(photo) }}
            style={styles.capturedPhoto}
            resizeMode="cover"
          />
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Cleaning & tagging this piece...</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${loadingProgress}%` }]} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderPieceReview = () => (
    <View style={[styles.fullScreenContainer, { backgroundColor: COLORS.white }]}>
      <SafeAreaView style={styles.safeArea}>
        {renderHeader(pieceData?.name || 'Piece Details', handleBack, true)}
        <ScrollView style={styles.pieceReviewContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.pieceImageContainer}>
            <FastImage
              source={{ uri: pieceData?.imageUrl || getPhotoUri(photo) }}
              style={styles.pieceImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.pieceDetailsContainer}>
            <DetailItem label="Piece Name" value={pieceData?.name || 'Untitled Piece'} />
            <DetailItem label="Brand" value={getTagValue(pieceData, 'Brand')} />
            <DetailItem label="Price" value={getTagValue(pieceData, 'Estimated Original Price')} />
            <DetailItem label="Type" value={getTagValue(pieceData, 'Type')} />
            <DetailItem label="Size" value={getTagValue(pieceData, 'Size')} />
            <DetailItem label="Layer Type" value={pieceData?.garmentLayerType || 'Outer'} />
            <DetailItem label="Category" value={getTagValue(pieceData, 'Category')} />
            <DetailItem label="Color" value={getTagValue(pieceData, 'Color')} />
            <DetailItem label="Condition" value={getTagValue(pieceData, 'Condition') || 'Used'} />
          </View>
        </ScrollView>
        <View style={styles.addToClosetButton}>
          <TouchableOpacity style={styles.addButton} onPress={addToCloset}>
            <Text style={styles.addButtonText}>Add to closet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderPhotoReview = () => (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
      <SafeAreaView style={styles.safeArea}>
        {renderHeader('', handleBack)}
        <View style={styles.photoContainer}>
          <FastImage
            source={{ uri: getPhotoUri(photo) }}
            style={styles.capturedPhoto}
            resizeMode="cover"
          />
        </View>
        <View style={styles.reviewControls}>
          <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
            <MaterialCommunityIcons name="delete" size={20} color={COLORS.white} />
            <Text style={styles.retakeButtonText}>Retake photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.usePhotoButton} onPress={usePhoto}>
            <MaterialCommunityIcons name="check" size={20} color={COLORS.Black} />
            <Text style={styles.usePhotoButtonText}>Use photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderCameraScreen = () => (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
      <Camera
        ref={camera}
        style={styles.fullScreenCamera}
        device={device}
        isActive={true}
        photo={true}
      />
      <SafeAreaView style={styles.overlayContainer}>
        {renderHeader('', handleBack)}
        <View style={styles.cropOverlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.cropFrame} />
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
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

  if (!isCameraGranted && !cameraPermissionLoading) {
    return (
      <CameraPermissionScreen
        onPermissionGranted={() => { }}
        onBack={onBack}
      />
    );
  }

  if (cameraPermissionLoading) {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>Checking permissions...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.Black} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>Camera not available</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <>
      {screenState === 'loading' && renderLoadingScreen()}
      {screenState === 'pieceReview' && pieceData && renderPieceReview()}
      {screenState === 'review' && photo && renderPhotoReview()}
      {screenState === 'camera' && renderCameraScreen()}
    </>
  );
};

const DetailItem = ({ label, value, isEditable = true }) => (
  <View >
    <View style={styles.detailRow}>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}: </Text>
      </View>

      {isEditable && (
        <TouchableOpacity onPress={() => { }} style={styles.editButton}>
          <Text style={styles.detailValue}>{value || 'Not detected'}</Text>
          <MaterialCommunityIcons name="pencil" size={16} color={COLORS.Black} />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.separator} />
  </View>
);

const getTagValue = (pieceData, tagName) => {
  const tag = pieceData.tags?.find((t) => t.name === tagName);
  return tag?.description || '';
};

const getPhotoUri = (photo) => {
  if (photo.path) return `file://${photo.path}`;
  if (photo.uri) return photo.uri;
  return photo.path || '';
};

const getImageDimensions = (uri) => {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => {
      resolve({ width, height });
    }, reject);
  });
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  fullScreenCamera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayContainer: {
    flex: 1,
    position: 'relative',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'SFPRODISPLAYREGULAR',
    textAlign: 'center',
  },
  cropOverlay: {
    flex: 1,
    position: 'relative',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: width * 0.8,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropFrame: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 8,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  galleryButton: {
    padding: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  capturedPhoto: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.Black,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 20,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  reviewControls: {
    gap: 16,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: '40%',
    padding: 10,
    alignSelf: 'center',
    gap: 8,
  },
  retakeButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  usePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 254, 254, 0.89)',
    borderRadius: 20,
    width: '35%',
    padding: 10,
    alignSelf: 'center',
    gap: 8,
  },
  usePhotoButtonText: {
    color: COLORS.Black,
    fontSize: 12,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  pieceReviewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  pieceImageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.grayBackground,
  },
  pieceImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
  },
  pieceDetailsContainer: {
    paddingBottom: 100,
    backgroundColor: COLORS.white,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:10,justifyContent:'space-between'
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.grayInactive,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.Black,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  editButton: {
    flexDirection: 'row', 
    backgroundColor: COLORS.whiteLight,
    borderRadius: 20, 
    padding: 7,
    alignItems: 'center',gap:8,marginRight:'20%'
  },
  separator: {
    height: 0.5,
    backgroundColor: COLORS.separator,
  },
  addToClosetButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.Black,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
});

export default CameraScreen; 