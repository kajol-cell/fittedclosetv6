import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import COLORS from '../../const/colors';
import { navigate } from '../../navigation/navigationService';
import { ApiMessageType, ScreenType } from '../../utils/enums';
import { dispatchThunk } from '../../utils/reduxUtils';
import { sendCode, verifyCode } from '../../redux/features/authSlice';
import { setAuthInfo, setVerificationToken } from '../../redux/features/sessionSlice';
import { identifyUserFromProfile, trackLogin, trackSignup } from '../../lib/analytics';
import LoadingWrapper from '../../components/LoadingWrapper';
import VerifyCode from '../../components/VerifyCode';
import CommonHeader from '../../components/CommonHeader';

interface OtpVerifyProps {
    navigation: any;
    route: any;
}

interface AuthInfo {
    profile: {
        id: string;
        email: string;
        phoneCountryCode: string;
        phoneNumber: string;
    };
    newUser: boolean;
}

const handleTracking = (authInfo: AuthInfo, authMethod: string) => {
    console.log('handleTracking', authInfo);
    identifyUserFromProfile(authInfo.profile, authMethod, authInfo.newUser);
    if (authInfo.newUser) {
        trackSignup(authMethod);
    } else {
        trackLogin(authMethod);
    }
};

const OtpVerify: React.FC<OtpVerifyProps> = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { phoneNumber, countryCode, email } = route.params || {};
    const isPhoneVerification = !!phoneNumber;
    const isEmailVerification = !!email;
    const [contactInfo, setContactInfo] = useState(isPhoneVerification ? phoneNumber : email || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [status, setStatus] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);

    console.log('code', code);
    console.log('Verification type:', isPhoneVerification ? 'Phone' : 'Email');
    console.log('Contact info:', contactInfo);

    useEffect(() => {
        if (code?.every(item => item !== '')) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [code]);

    const handleVerifyCode = async () => {
        setLoading(true);
        setError('');

        try {
            const messageType = isPhoneVerification
                ? ApiMessageType.VERIFY_PHONE_CODE
                : ApiMessageType.VERIFY_EMAIL_CODE;

            const payload = isPhoneVerification
                ? { code: code.join(''), phone: contactInfo }
                : { code: code.join(''), email: contactInfo };

            await dispatchThunk(
                verifyCode,
                messageType,
                payload,
                (arg: any) => {
                    console.log('Verification response:', arg);

                    if (!arg) {
                        console.error('No response received from verification');
                        setError('Invalid response from server');
                        return;
                    }
                    if (arg.authInfo) {
                        let authInfo = arg.authInfo;
                        dispatch(setAuthInfo(authInfo));
                        const authMethod = isPhoneVerification ? 'phone' : 'email';
                        handleTracking(authInfo, authMethod);
                    } else if (arg.verificationToken) {
                        dispatch(setVerificationToken(arg.verificationToken));
                        if (arg.authInfo) {
                            let authInfo = arg.authInfo;
                            dispatch(setAuthInfo(authInfo));
                            const authMethod = isPhoneVerification ? 'phone' : 'email';
                            handleTracking(authInfo, authMethod);
                        }
                    } else {
                        dispatch(setAuthInfo(arg));
                        const authMethod = isPhoneVerification ? 'phone' : 'email';
                        handleTracking(arg, authMethod);
                    }

                    navigate(ScreenType.MAIN);
                },
                (error: any) => {
                    console.error('Code verification failed:', error);
                    setError(error.message || 'Code verification failed');
                },
            );
        } catch (err) {
            console.error('Error verifying code:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        setLoading(true);
        setError('');

        try {
            const messageType = isPhoneVerification
                ? ApiMessageType.SEND_PHONE_CODE
                : ApiMessageType.SEND_EMAIL_CODE;

            const payload = isPhoneVerification
                ? { phone: contactInfo }
                : { email: contactInfo };

            await dispatchThunk(
                sendCode,
                messageType,
                payload,
                (response) => {
                    console.log('Code resent successfully:', response);
                    setIsCodeSent(true);
                    setError('');
                },
                (error: any) => {
                    console.error('Failed to resend code:', error);
                    setError(error.message || 'Failed to resend code');
                },
            );
        } catch (err) {
            console.error('Error resending code:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (isCodeSent) {
            setIsCodeSent(false);
            setError('');
        } else {
            navigation.goBack();
        }
    };

    const getDisplayContact = () => {
        if (isPhoneVerification && countryCode) {
            const cleanPhone = contactInfo.replace(countryCode, '');
            return `${countryCode} ${cleanPhone}`;
        }
        return contactInfo;
    };

    const getTitle = () => {
        return isPhoneVerification ? 'Check your SMS' : 'Check your inbox';
    };

    const getSubtitle = () => {
        const displayContact = getDisplayContact();
        return `We sent a verification code to ${displayContact}`;
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <CommonHeader
                    title={getTitle()}
                    subtitle={getSubtitle()}
                    onBackPress={handleBack}
                    showBackButton
                    headerStyle="simple"
                />

                <LoadingWrapper
                    loading={loading}
                    content={
                        <VerifyCode
                            onResendCode={resendCode}
                            status={status}
                            email={contactInfo}
                            code={code}
                            setCode={setCode}
                        />
                    }
                />

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: isValid && !loading ? COLORS.Black : '#F5F5F5',
                            },
                        ]}
                        onPress={handleVerifyCode}
                        disabled={!isValid || loading}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                {
                                    color: isValid && !loading ? COLORS.white : '#999',
                                },
                            ]}
                        >
                            {loading ? 'Verifying...' : 'Continue'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default OtpVerify;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    safeArea: {
        flex: 1,
    },
    button: {
        marginHorizontal: 20,
        marginBottom: 20,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    errorContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
    },
});