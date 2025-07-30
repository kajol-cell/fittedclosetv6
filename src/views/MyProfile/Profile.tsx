import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import COLORS from '../../const/colors';
import CommonHeader from '../../components/CommonHeader';
import { Icon } from 'react-native-paper';
import ImageUploadModal from '../../components/ImageUploadModal';
import ChangeProfileImage from '../../components/ChangeProfileImage';
import { navigate } from '../../navigation/navigationService';
import { useSelector } from 'react-redux';
import { selectAuthInfo } from '../../redux/features/sessionSlice';

const Profile: React.FC = () => {
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
    const imageModalRef = useRef(null);
    const changeProfileImageRef = useRef(null);
    const [currentPhotoType, setCurrentPhotoType] = useState<'profile' | 'cover'>('profile');
    const authInfo = useSelector(selectAuthInfo);

    const handleAddProfilePhoto = () => {
        setCurrentPhotoType('profile');
        changeProfileImageRef.current?.open();
    };

    const handleAddCoverPhoto = () => {
        setCurrentPhotoType('cover');
        imageModalRef.current?.open();
    };

    const handleImageSelected = (image: any, photoType: any) => {
        if (photoType === 'cover') {
            setCoverPhoto(image.uri);
        }
    };

    const handleContinue = () => {
        navigate('MediaPermission')
    };

    const handleSkip = () => {
        navigate('MediaPermission')
    };

    const handleBack = () => {
        console.log('Profile Completed')
    };

    // Get profile image from Redux store if available
    const profileImageUrl = authInfo?.profile?.imageUrl || profilePhoto;

    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

                <CommonHeader
                    title='Add profile photos'
                    subtitle='Choose a profile and cover photo.'
                    showBackButton
                    onBackPress={handleBack}
                    headerStyle='simple'
                />
                <View style={styles.content}>
                    <View style={styles.photoSection}>
                        <View style={styles.photoContainer}>
                            <View style={styles.coverPhotoContainer}>
                                <FastImage
                                    source={{
                                        uri: coverPhoto,
                                        priority: FastImage.priority.low,
                                        cache: FastImage.cacheControl.immutable
                                    }}
                                    style={styles.coverPhoto}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    style={styles.cameraButton}
                                    onPress={handleAddCoverPhoto}
                                >
                                    <Icon source="camera" size={24} color={COLORS.Black} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ bottom: Dimensions.get('window').height * 0.08 }}>
                                {profileImageUrl ? (
                                    <FastImage
                                        source={{
                                            uri: profileImageUrl,
                                            priority: FastImage.priority.low,
                                            cache: FastImage.cacheControl.immutable,
                                        }}
                                        style={styles.profilePhoto}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View >
                                        <FastImage source={require('../../assets/images/noprofile.png')} style={styles.profilePhoto} />
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.profileCameraIcon}
                                    onPress={handleAddProfilePhoto}
                                >
                                    <Icon source="camera" size={24} color={COLORS.Black} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            (!profileImageUrl && !coverPhoto) && styles.continueButtonDisabled
                        ]}
                        onPress={handleContinue}
                        disabled={!profileImageUrl && !coverPhoto}
                    >
                        <Text style={[
                            styles.continueButtonText,
                            (!profileImageUrl && !coverPhoto) && styles.continueButtonTextDisabled
                        ]}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                    >
                        <Text style={styles.skipButtonText}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ImageUploadModal
                ref={imageModalRef}
                onImageSelected={handleImageSelected}
                photoType={currentPhotoType}
            />

            <ChangeProfileImage ref={changeProfileImageRef} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        flex: 1,
    },
    photoSection: {
        flex: 1,
    },
    photoContainer: {
        alignItems: 'flex-start',
    },
    coverPhotoContainer: {
        width: '100%',
        height: Dimensions.get('window').height * 0.3,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverPhoto: {
        width: '100%',
        height: '100%',
    },
    profilePhoto: {
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3,
        borderRadius: Dimensions.get('window').width * 0.3 / 2,

    },

    placeholderIcon: {
        fontSize: 32,
        color: COLORS.primaryDark,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 10,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        right: 15, padding: 10
    },
    profileCameraIcon: {
        position: 'absolute',
        borderRadius: 30,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        right: 5, padding: 10, marginTop: Dimensions.get('window').height * 0.10
    },
    cameraIcon: {
        fontSize: 16,
        color: COLORS.white,
    },
    bottomSection: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    continueButton: {
        backgroundColor: COLORS.Black,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    continueButtonDisabled: {
        backgroundColor: '#F8F8F8',
        opacity: 0.7,
    },
    continueButtonTextDisabled: {
        color: 'gray',
    },
    skipButton: {
        alignItems: 'center',
        padding: 10,
    },
    skipButtonText: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'SFPRODISPLAYBOLD',
    },
});

export default Profile;