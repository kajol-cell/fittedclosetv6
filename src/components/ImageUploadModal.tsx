import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ensureCameraPermission } from '../utils/ensureCameraPermissions';


interface ImageUploadModalProps {
  onImageSelected?: (image: any, photoType: 'profile' | 'cover') => void;
  photoType?: 'profile' | 'cover';
}

const ImageUploadModal = forwardRef<any, ImageUploadModalProps>(({ onImageSelected, photoType = 'profile' }, ref) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const selectImage = async (fromCamera: boolean) => {
    const options = {
      mediaType: 'photo' as const,
      selectionLimit: 1,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8 as const,
      includeBase64: false,
      saveToPhotos: true,
    };

    const callback = (response) => {
      if (response.didCancel || response.errorMessage) {
        console.log('Image picker cancelled or error:', response.errorMessage);
        return;
      }
      if (response.assets?.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage);
        if (onImageSelected) {
          onImageSelected(selectedImage, photoType);
        }
        setVisible(false);
      }
    };

    if (fromCamera) {
      const hasPermission = await ensureCameraPermission();
      if (hasPermission) {
        launchCamera(options, callback);
      } else {
        Alert.alert(
          'Camera Permission Denied',
          'Please enable camera permissions in your device settings.',
        );
      }
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const handleClose = () => {
    setImage(null);
    setVisible(false);
  };

  const getTitle = () => {
    return photoType === 'profile' ? 'Add Profile Photo' : 'Add Cover Photo';
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <IconButton 
            icon="arrow-left" 
            size={24} 
            onPress={handleClose} 
          />
          <Text style={styles.title}>{getTitle()}</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={() => selectImage(false)}
          >
            <IconButton icon="image" size={96} iconColor="#888" />
            <Text style={styles.placeholderText}>Tap to select an image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            mode="outlined"
            onPress={() => selectImage(false)}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Select from Device
          </Button>
          <Button
            mode="outlined"
            onPress={() => selectImage(true)}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Take a Picture
          </Button>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <Button
            mode="outlined"
            onPress={handleClose}
            style={styles.cancelButton}
          >
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'AkkuratStd-Bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontFamily: 'AkkuratStd',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    height: 48,
  },
  footer: {
    paddingHorizontal: 0,
  },
  cancelButton: {
    width: '100%',
  },
});

export default ImageUploadModal; 