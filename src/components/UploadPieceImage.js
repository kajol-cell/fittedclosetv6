import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal, Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {SessionMessageType} from '../utils/enums';
import {addPieces, callSessionApi} from '../redux/features/sessionSlice';
import {
    createImageDataUrl,
    createImageUploadData,
    resizeImageList,
} from '../utils/imageUtils';
import {ensureCameraPermission} from '../utils/ensureCameraPermissions';
import {trackPieceUpload} from '../lib/analytics';

const MAX_IMAGES = 5;

const UpdatePieceImage = ({route, navigation}) => {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const selectImages = fromCamera => {
        if (images.length >= MAX_IMAGES) {
            Alert.alert(
                'Limit Reached',
                `You can only upload up to ${MAX_IMAGES} images.`,
            );
            return;
        }

        const options = {
            mediaType: 'photo',
            selectionLimit: MAX_IMAGES,
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.8,
            includeBase64: false,
            saveToPhotos: true,
        };

        const pickerCallback = response => {
            if (response.didCancel || response.errorMessage) {
                console.error('Image Picker Error: ', response.errorMessage);
                return;
            }
            if (response.assets) {
                setImages(prevImages => [
                    ...prevImages,
                    ...response.assets.slice(0, MAX_IMAGES - prevImages.length),
                ]);
            }
        };
        if (fromCamera) {
            ensureCameraPermission().then(result => {
                console.log('Has Camera Permission', result);
                if (result) {
                    launchCamera(options, pickerCallback);
                } else {
                    Alert.alert(
                        'Camera Permission Denied',
                        'Please enable camera permissions in your device settings.',
                    );
                }
            });
        } else {
            launchImageLibrary(options, pickerCallback);
        }
    };

    const removeImage = index => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        if (images.length === 0) {
            Alert.alert('No Images', 'Please select images to upload.');
            return;
        }
        //printImages(images);
        const resizedImages = await resizeImageList(images, 800);
        //printImages(resizedImages);
        setUploading(true);
        try {
            const fileMap = resizedImages.reduce((acc, img) => {
                acc[img.fileName] = img.type;
                return acc;
            }, {});

            // Request signed URLs from backend
            const requestPayload = {
                messageType: SessionMessageType.IMAGE_UPLOAD_INFO,
                payload: fileMap,
            };
            console.log(requestPayload);
            const responseData = await dispatch(
                callSessionApi(requestPayload),
            ).unwrap();
            console.log(responseData);
            if (!responseData) {
                throw new Error('Invalid response from server');
            }
            const imageUploadInfos = responseData;
            const uploadPromises = resizedImages.map(img => {
                const imageId = imageUploadInfos[img.fileName].imageId;
                const uploadUrl = imageUploadInfos[img.fileName].uploadUrl;
                const binaryData = createImageUploadData(img);
                console.log('Uploading  ', imageId, ' to ', uploadUrl);
                return axios.put(uploadUrl, binaryData, {
                    headers: {
                        'Content-Type': `${img.type}; charset=utf-8`,
                        'Content-Length': binaryData.byteLength,
                        authority: 'storage.googleapis.com',
                    },
                });
            });

            const results = await Promise.allSettled(uploadPromises);

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    console.log('Upload ${index + 1} succeeded:', result.value);
                } else {
                    console.error(`Upload ${index + 1} failed:`, result.reason);
                }
            });

            const fittedImages = resizedImages.map(img => {
                return {
                    mainImage: true,
                    pieceImageType: 'FRONT',
                    fileName: img.fileName,
                    mimeType: img.type,
                    photoId: imageUploadInfos[img.fileName].imageId,
                    fileSize: img.fileSize,
                };
            });

            console.log(fittedImages);
            // Notify backend about the uploaded images
            const pieceUploadInfo = await dispatch(
                callSessionApi({
                    messageType: SessionMessageType.SUBMIT_PIECE_PHOTOS,
                    payload: {photos: fittedImages},
                }),
            ).unwrap();

            const imageIdDateUrlMap = resizedImages.reduce((acc, img) => {
                acc[img.fileName] = createImageDataUrl(img);
                return acc;
            }, {});
            const pieceInfos = pieceUploadInfo.pieceInfos;
            pieceInfos.forEach(pieceInfo => {
                pieceInfo.newPiece = true;
                pieceInfo.imageUrl =
                    imageIdDateUrlMap[pieceInfo.imageId] || pieceInfo.imageUrl;
            });
            dispatch(addPieces(pieceInfos));
            pieceInfos.forEach(pieceInfo => {
                trackPieceUpload();
            });
            Alert.alert('Success', 'Images uploaded successfully!');
            setImages([]);
            goBack();
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload Failed', 'Something went wrong, please try again.');
        } finally {
            setUploading(false);
        }
    };
    const goBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container]} edges={Platform.OS === 'android' ? ['top', 'bottom'] : ['bottom']}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => goBack()}
                />
                <Text style={styles.title}>Upload Images</Text>
                <View style={{width: 24}}/>
            </View>

            {/* Image Preview or Placeholder */}
            <View style={styles.listContainer}>
                {images.length > 0 ? (
                    <FlatList
                        data={images}
                        keyExtractor={(item, index) => `image-${index}`}
                        numColumns={3}
                        contentContainerStyle={styles.imageGrid}
                        renderItem={({item, index}) => (
                            <View style={styles.imageWrapper}>
                                <Image source={{uri: item.uri}} style={styles.imagePreview}/>
                                <IconButton
                                    icon="close"
                                    size={18}
                                    style={styles.removeIcon}
                                    onPress={() => removeImage(index)}
                                />
                            </View>
                        )}
                    />
                ) : (
                    <TouchableOpacity
                        style={styles.placeholderContainer}
                        onPress={() => selectImages(false)}>
                        <IconButton icon="image" size={96} color="#888"/>
                        <Text style={styles.placeholderText}>Tap to select images</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Add Image Buttons */}
            <View style={styles.addButtonContainer}>
                <Button
                    mode="outlined"
                    onPress={() => selectImages(false)}
                    disabled={images.length >= MAX_IMAGES}>
                    Select from Device
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => selectImages(true)}
                    disabled={images.length >= MAX_IMAGES}>
                    Take a Picture
                </Button>
            </View>

            {/* Upload and Cancel Buttons */}
            <View style={[styles.buttonContainer, {paddingBottom: insets.bottom}]}>
                <Button
                    mode="contained"
                    loading={uploading}
                    disabled={uploading || images.length === 0}
                    onPress={uploadImages}
                    style={styles.uploadButton}>
                    Upload
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => goBack()}
                    disabled={uploading}
                    style={styles.cancelButton}>
                    Cancel
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        maxHeight: '70%',
    },
    imageGrid: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    imageWrapper: {
        position: 'relative',
        margin: 5,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeIcon: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 10,
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
        marginTop: 10,
    },
    addButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: 'white',
    },
    uploadButton: {
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        flex: 1,
    },
});

export default React.memo(UpdatePieceImage);
