import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CommonHeader from '../../components/CommonHeader';
import COLORS from '../../const/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigate } from '../../navigation/navigationService';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';

interface MediaPermissionProps {
    navigation: any;
    onComplete?: () => void;
}

const MediaPermission: React.FC<MediaPermissionProps> = ({ navigation, onComplete }) => {
    const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'not_determined'>('not_determined');
    const [photoLibraryPermission, setPhotoLibraryPermission] = useState<'granted' | 'denied' | 'not_determined'>('not_determined');
    const [emailImportEnabled, setEmailImportEnabled] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        checkPermissions();
    }, []);

    useEffect(() => {
        const allGranted =
            cameraPermission === 'granted' ||
            photoLibraryPermission === 'granted' ||
            emailImportEnabled;
        setIsValid(allGranted ? true : false);
    }, [cameraPermission, photoLibraryPermission, emailImportEnabled]);


    const checkPermissions = async () => {
        try {
            const cameraResult = await check(
                Platform.select({
                    ios: PERMISSIONS.IOS.CAMERA,
                    android: PERMISSIONS.ANDROID.CAMERA,
                })!
            );
            setCameraPermission(cameraResult === RESULTS.GRANTED ? 'granted' : cameraResult === RESULTS.DENIED ? 'denied' : 'not_determined');
            
            const photoResult = await check(
                Platform.select({
                    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
                    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                })!
            );
            setPhotoLibraryPermission(photoResult === RESULTS.GRANTED ? 'granted' : photoResult === RESULTS.DENIED ? 'denied' : 'not_determined');
        } catch (error) {
            console.error('Error checking permissions:', error);
        }
    };

    const requestCameraPermission = async () => {
        try {
            const result = await request(
                Platform.select({
                    ios: PERMISSIONS.IOS.CAMERA,
                    android: PERMISSIONS.ANDROID.CAMERA,
                })!
            );
            setCameraPermission(result === RESULTS.GRANTED ? 'granted' : 'denied');
        } catch (error) {
            console.error('Error requesting camera permission:', error);
            setCameraPermission('denied');
        }
    };

    const requestPhotoLibraryPermission = async () => {
        try {
            const result = await request(
                Platform.select({
                    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
                    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                })!
            );
            setPhotoLibraryPermission(result === RESULTS.GRANTED ? 'granted' : 'denied');
        } catch (error) {
            console.error('Error requesting photo library permission:', error);
            setPhotoLibraryPermission('denied');
        }
    };

    const handleEmailImportToggle = () => {
        setEmailImportEnabled(!emailImportEnabled);
    };

    const handleContinue = () => {
        onComplete?.();
        navigate('Walkthrough');
    };

    const handleSkip = () => {
        onComplete?.();
    };

    const renderPermissionCard = (
        icon: string,
        title: string,
        description: string,
        permissionStatus: 'granted' | 'denied' | 'not_determined',
        onRequestPermission: () => void,
        showNewBadge = false,
        isEmailImport = false
    ) => {
        const isGranted = isEmailImport ? emailImportEnabled : permissionStatus === 'granted';
        const buttonText = isGranted ? '✔️' : 'Allow';
        const buttonStyle = isGranted ? styles.allowedButton : styles.allowButton;
        const buttonTextStyle = isGranted ? styles.allowedButtonText : styles.allowButtonText;
        return (
            <View style={styles.permissionCard}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconStyle}>
                        {showNewBadge ? (
                            <FastImage source={require('../../assets/images/gmail.png')} style={{ width: 24, height: 24 }} />
                        ) : (
                            <Ionicons name={icon as any} size={24} color={COLORS.Black} />
                        )}
                    </View>
                    {showNewBadge && (
                        <View style={styles.newBadgeContainer}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    )}
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardDescription}>{description}</Text>
                    </View>

                    <View style={styles.rightContent}>

                        <TouchableOpacity
                            style={buttonStyle}
                            onPress={onRequestPermission}
                            disabled={isGranted}
                        >
                            <Text style={buttonTextStyle}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader
                title="Let's get set up"
                subtitle="You'll need these to start adding pieces."
                onBackPress={() => navigation.goBack()}
                headerStyle="simple"
            />

            <View style={styles.content}>
                {renderPermissionCard(
                    'camera',
                    'Camera',
                    'Take photos of your pieces in app.',
                    cameraPermission,
                    requestCameraPermission
                )}

                {renderPermissionCard(
                    'images',
                    'Photo Library',
                    'Upload pieces you\'ve taken.',
                    photoLibraryPermission,
                    requestPhotoLibraryPermission
                )}

                {renderPermissionCard(
                    'mail',
                    'Import from Email',
                    'Use information sent to your inbox.',
                    'not_determined',
                    handleEmailImportToggle,
                    true,
                    true
                )}
            </View>
            <View style={styles.buttonWrapper}>
                <Button
                    title='Continue'
                    onPress={handleContinue}
                    disabled={!isValid}
                    buttonType={true}
                    bgColor={isValid ? COLORS.Black : COLORS.whiteAlt}
                    btnTextColor={isValid ? COLORS.whiteAlt : COLORS.grayInactive}
                />

                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.02
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,width:'90%', alignSelf:'center'
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
    },
    permissionCard: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: 12,
        backgroundColor: COLORS.white,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconStyle: {
        alignSelf: 'flex-start', flex: 1
    },
    textContainer: {
        alignSelf: 'flex-start',
    },
    cardTitle: {
        fontSize: 16,
        color: COLORS.Black,
        marginBottom: 4,
        fontFamily: 'SFPRODISPLAYBOLD'
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'SFPRODISPLAYREGULAR',
        color: COLORS.Black,
        opacity: 0.6
    },
    rightContent: {
        alignSelf: 'flex-end'
    },
    newBadgeContainer: {
        borderWidth: 1.5,
        borderColor: COLORS.tertiary,
        borderRadius: 5,
        paddingHorizontal: 7,
        marginLeft: 10, justifyContent: 'center'
    },
    newBadgeText: {
        fontSize: 10,
        color: COLORS.tertiary,
        fontFamily: 'SFPRODISPLAYBOLD',
        alignSelf: 'center'
    },
    allowButton: {
        backgroundColor: COLORS.Black,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    allowedButton: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 70,
        alignItems: 'center',
    },
    allowButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    allowedButtonText: {
        fontSize: 12,
        color: 'gray',
    },
    bottomContainer: {
        paddingHorizontal: 15,
    },
    continueButton: {
        backgroundColor: COLORS.Black,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    skipButton: {
        alignItems: 'center',
        padding: 10,
    },
    skipButtonText: {
        fontSize: 18,
        color: 'gray',
        fontFamily: 'SFPRODISPLAYBOLD'
    },
});

export default MediaPermission;