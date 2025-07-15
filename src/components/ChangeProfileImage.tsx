import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {launchCamera, launchImageLibrary, MediaType, PhotoQuality} from 'react-native-image-picker';
import axios from 'axios';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {SessionMessageType} from '../utils/enums';
import {
  callSessionApi,
  updateProfileImageUrl,
} from '../redux/features/sessionSlice';
import {createImageUploadData, resizeImageList} from '../utils/imageUtils';

const ChangeProfileImage = forwardRef((_, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const selectImage = (fromCamera: boolean) => {
    const options = {
      mediaType: 'photo' as MediaType,
      selectionLimit: 1,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8 as PhotoQuality,
    };

    const callback = (response: any) => {
      if (response.didCancel || response.errorMessage) return;
      if (response.assets?.length > 0) {
        setImage(response.assets[0]);
      }
    };

    if (fromCamera) {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select an image to upload.');
      return;
    }

    setUploading(true);
    try {
      const [resized] = await resizeImageList([image], 800);
      const fileMap = {[resized.fileName]: resized.type};
      
      const uploadInfoResponse = await dispatch(
        callSessionApi({
          messageType: SessionMessageType.PROFILE_IMAGE_UPLOAD_INFO,
          payload: fileMap,
        })
      ).unwrap();
      
      const {uploadUrl, imageId} = uploadInfoResponse[resized.fileName];
      const binaryData = createImageUploadData(resized);
      
      await axios.put(uploadUrl, binaryData, {
        headers: {
          'Content-Type': `${resized.type}; charset=utf-8`,
          'Content-Length': binaryData.byteLength,
        },
      });

      const response = await dispatch(
        callSessionApi({
          messageType: SessionMessageType.SUBMIT_PROFILE_PHOTO,
          payload: {
            fileName: resized.fileName,
            mimeType: resized.type,
            photoId: imageId,
            fileSize: resized.fileSize,
          },
        })
      ).unwrap();

      dispatch(updateProfileImageUrl({imageUrl: response.photoUrl}));
      Alert.alert('Success', 'Profile image updated successfully!');
      setImage(null);
      setVisible(false);
    } catch (error) {
      console.error('Profile upload failed:', error);
      Alert.alert('Upload Failed', 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={[styles.container]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => setVisible(false)} />
          <Text style={styles.title}>Change Profile Picture</Text>
          <View style={{width: 28}} />
        </View>
        <View style={styles.content}>
          {image ? (
            <View style={styles.imageWrapper}>
              <Image source={{uri: image.uri}} style={styles.previewImage} />
              <IconButton
                icon="close"
                size={32}
                onPress={() => setImage(null)}
                style={styles.removeIcon}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imagePlaceHolder}
              onPress={() => selectImage(false)}>
              <IconButton icon="image" size={96} iconColor="#888" />
              <Text style={styles.placeholder}>Tap to select an image</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonGroup}>
          <Button
            mode="outlined"
            onPress={() => selectImage(false)}
            disabled={uploading}>
            Select from Device
          </Button>
          <Button
            mode="outlined"
            onPress={() => selectImage(true)}
            disabled={uploading}>
            Take a Picture
          </Button>
        </View>
        <View style={styles.footer}>
          <Button
            mode="contained"
            loading={uploading}
            onPress={uploadImage}
            disabled={!image || uploading}
            style={styles.uploadButton}>
            Upload
          </Button>
          <Button
            mode="outlined"
            onPress={() => setVisible(false)}
            disabled={uploading}>
            Cancel
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePlaceHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  removeIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  footer: {
    paddingBottom: 20,
  },
  uploadButton: {
    marginBottom: 10,
  },
});
export default ChangeProfileImage;
