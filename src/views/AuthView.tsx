import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Text,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform,
    ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { NativeModules } from 'react-native';
import GoogleSignInButton from '../components/GoogleSignInButton';
import AppleSignInButton from '../components/AppleSignInButton';
import LoadingWrapper from '../components/LoadingWrapper';
import { getClientType, isIOS } from '../utils/platformUtils';
import { navigate } from '../navigation/navigationService';
import { ApiMessageType, ScreenType } from '../utils/enums';
import { dispatchMessageTypeThunk, dispatchThunk } from '../utils/reduxUtils';
import {
    thirdPartyAuthenticate,
    sendCode
} from '../redux/features/authSlice';
import { identifyUserFromProfile, trackLogin, trackSignup } from '../lib/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import COLORS from '../const/colors';
import BottomOptionModal from '../components/BottomOptionModal';
import ThemeStyle from '../const/ThemeStyle';
const { TikTokEventsManager } = NativeModules;
const { width, height } = Dimensions.get('window');

interface AuthInfo {
    profile: {
        id: string;
        email: string;
        phoneCountryCode: string;
        phoneNumber: string;
    };
    newUser: boolean;
}

interface UserInfo {
    identityToken?: string;
    idToken?: string;
}

const handleTracking = (authInfo: AuthInfo, authMethod: string) => {
    console.log('handleTracking', authInfo);
    identifyUserFromProfile(authInfo.profile, authMethod, authInfo.newUser);
    if (authInfo.newUser) {
        trackSignup(authMethod);
    } else {
        trackLogin(authMethod);
    }
    TikTokEventsManager?.logEvent('login', {
        method: authMethod,
        email_address: authInfo.profile.email,
    });
    const profile = authInfo.profile;
    if (profile) {
        TikTokEventsManager.logout();
        TikTokEventsManager?.identify(
            String(profile.id),
            profile.email,
            profile.phoneCountryCode + profile.phoneNumber,
            profile.email,
        );
    }
};

const slides = [
    {
        title: "Organize all \n your clothes",
        image: require('../assets/images/onboardclothes.png'),
    },
    {
        title: "Style outfits\nfrom your closet",
        image: require('../assets/images/slide2.png'),
    },
    {
        title: "Resell pieces you don't wear",
        image: require('../assets/images/slide3.png'),
    },
    {
        title: "Share your closet with friends",
        image: require('../assets/images/slide4.png'),
    }
];

const AuthView: React.FC = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [showOptionsModal, setShowOptionsModal] = useState(false);


    const handleAppError = (error: any) => {
        Alert.alert(error.message);
    };

    const handleLoginWithApple = async (userInfo: UserInfo) => {
        console.log(userInfo);
        setLoading(true);
        try {
            await dispatchMessageTypeThunk(
                thirdPartyAuthenticate,
                {
                    clientType: getClientType(),
                    thirdPartyJwt: userInfo.identityToken,
                    thirdPartyLoginType: 'APPLE',
                },
                (arg: any) => {
                    handleTracking(arg, 'APPLE');
                    navigate(ScreenType.MAIN);
                },
                (error: any) => {
                    navigate(ScreenType.ENTRY);
                    Alert.alert('Login failed', error.message);
                },
            );
        } catch (error) {
            console.error('Apple login error:', error);
            Alert.alert('Login failed', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginWithGoogle = async (userInfo: UserInfo) => {
        setLoading(true);
        try {
            await dispatchMessageTypeThunk(
                thirdPartyAuthenticate,
                {
                    clientType: getClientType(),
                    thirdPartyJwt: userInfo.idToken,
                    thirdPartyLoginType: 'GOOGLE',
                },
                (arg: any) => {
                    handleTracking(arg, 'GOOGLE');
                    navigate(ScreenType.MAIN);
                },
                (error: any) => {
                    navigate(ScreenType.ENTRY);
                    Alert.alert('Login failed', error.message);
                },
            );
        } catch (error) {
            console.error('Google login error:', error);
            Alert.alert('Login failed', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };


    const googleCancel = () => {
        console.log("Google Sign-In Cancelled");
        setLoading(false);
    };


    const googleError = (error: any) => {
        console.log('Google Sign In Error: ', error);
        setLoading(false);
    };

    const handleScroll = (event: any) => {
        const slideWidth = width;
        const currentIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
        setCurrentSlide(currentIndex);
    };

    const renderSlides = () => {
        return (
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{ width }}
            >
                {slides.map((slide, index) => (
                    <View key={index} style={styles.slidewrap}>
                        <FastImage
                            source={slide.image}
                            style={styles.slideImage}
                            resizeMode='contain'
                        />
                    </View>
                ))}
            </ScrollView>
        );
    };

    const renderProgressIndicator = () => {
        return (
            <View style={styles.progressContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressDot,
                            index === currentSlide ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        );
    };

    const renderSocialButtons = () => {
        return (
            <View style={styles.socialButtonsContainer}>
                {/* {isIOS() && ( */}
                <AppleSignInButton
                    onSuccess={handleLoginWithApple}
                    onError={handleAppError}
                />
                {/* )} */}

                <GoogleSignInButton
                    onSuccess={handleLoginWithGoogle}
                    onError={googleError}
                    onCancel={googleCancel}
                />
                <TouchableOpacity onPress={() => {
                    setShowOptionsModal(true);
                }}
                    style={[styles.termsContainer]}
                >
                    <Text style={[ThemeStyle.H4, ThemeStyle.textBold,
                    { color: COLORS.secondaryDarker }]}>Other options</Text>
                </TouchableOpacity>
                <View style={styles.termsContainer}>
                    <Text style={[ThemeStyle.body2, { color: COLORS.secondaryDarker }]}>
                        By continuing you agree to the
                    </Text>
                    <Text style={[ThemeStyle.body2, ThemeStyle.textBold, { color: COLORS.secondaryDarker }]}>
                        Terms of Service  <Text style={[ThemeStyle.body2, ThemeStyle.text]}>and
                        </Text>{'  '}Privacy Policy
                    </Text>
                </View>
            </View>
        );
    };


    return (
        <SafeAreaView style={ThemeStyle.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <LoadingWrapper
                loading={loading}
                content={
                    <View style={[ThemeStyle.mainContainer, { paddingTop: insets.top + 8 }]}>
                        {renderProgressIndicator()}

                        <View style={styles.contentContainer}>
                            {renderSlides()}
                            <Text style={ThemeStyle.H2} numberOfLines={2}>
                                {slides[currentSlide].title}
                            </Text>
                        </View>

                        <View >
                            {renderSocialButtons()}
                        </View>
                    </View>
                }
            />

            {showOptionsModal && <BottomOptionModal
                visible={true}
                onClose={() => setShowOptionsModal(false)}
                onSelectEmail={() => {
                    setAuthMethod('email');
                    setShowOptionsModal(false);
                }}
                onSelectPhone={() => {
                    setAuthMethod('phone');
                    setShowOptionsModal(false);
                }}
            />} 
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        bottom: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    slidewrap: {
        justifyContent: 'center',
        alignSelf: 'center',
        bottom: Dimensions.get('window').height * 0.01
    },
    slideImage: {
        height: height * 0.5,
        aspectRatio: 1 / 1.07,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    socialButtonsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    termsContainer: {
        alignItems: 'center',
        marginTop: 12
    },

    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: Platform.OS === 'ios' ? 10 : 20,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 39, height: 2,
        borderRadius: 10, opacity: 0.7
    },
    inactiveDot: {
        backgroundColor: '#E5E5E5',
        width: 20,
        height: 2,
        borderRadius: 4,
        marginHorizontal: 4,
    },

});

export default AuthView;