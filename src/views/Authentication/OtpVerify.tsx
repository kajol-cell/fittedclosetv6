import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../const/colors';
import { navigate } from '../../navigation/navigationService';
import { ApiMessageType,  ScreenType } from '../../utils/enums';
import { dispatchThunk } from '../../utils/reduxUtils';
import { sendCode, verifyCode } from '../../redux/features/authSlice';
import { setAuthInfo, setVerificationToken } from '../../redux/features/sessionSlice';
import { hideLoading } from '../../redux/features/loadingSlice';
import { authenticate } from '../../utils/apiUtils';
import { API_CONFIG } from '../../config/appConfig';
import LoadingWrapper from '../../components/LoadingWrapper';
import VerifyCode from '../../components/VerifyCode';
import CommonHeader from '../../components/CommonHeader';

interface OtpVerifyProps {
    navigation: any;
    route: any;
}

const OtpVerify: React.FC<OtpVerifyProps> = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const apiSessionKey = useSelector((state: any) => state.auth.apiSessionKey);
    const { phoneNumber, countryCode, email } = route.params || {};
    const isPhoneVerification = !!phoneNumber;
    const isEmailVerification = !!email;
    
    if (!phoneNumber && !email) {
        console.error('Missing required route parameters: phoneNumber or email');
    }
    
    const [contactInfo, setContactInfo] = useState(isPhoneVerification ? phoneNumber : isEmailVerification ? email : '');
    const [authMethod, setAuthMethod] = useState(isPhoneVerification ? 'phoneNumber' : isEmailVerification ? 'email' : '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [status, setStatus] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [resetFocus, setResetFocus] = useState(false);
    const verificationAttemptedRef = useRef(false);
    const isUserTypingRef = useRef(false);
    const didShowLoaderRef = useRef(false);
    const isNavigatingRef = useRef(false);


    const handleSetCode = (newCode: any) => {
        if (error && !isUserTypingRef.current) {
            setError('');
        }
        isUserTypingRef.current = true;
        setCode(newCode);
    };

    const resetVerificationState = () => {
        isUserTypingRef.current = false;
        setCode(['', '', '', '', '', '']);
        setIsValid(false);
        verificationAttemptedRef.current = false;
        
        setResetFocus(true);
        
        setTimeout(() => {
            setResetFocus(false);
        }, 150);
    };

    useEffect(() => {
        const allFilled = code.every(item => item !== '');

        if (allFilled && !isVerifying && !loading && !verificationAttemptedRef.current) {
            setIsValid(true);
            verificationAttemptedRef.current = true;
            setIsVerifying(true);
            handleVerifyCode();
        } else if (!allFilled) {
            setIsValid(false);
            verificationAttemptedRef.current = false;
            if (error && isUserTypingRef.current) {
                setError('');
            }
        }
    }, [code, error]);

    useEffect(() => {
        return () => {
            setLoading(false);
            setIsVerifying(false);
            setError('');
            isNavigatingRef.current = false;
            if (didShowLoaderRef.current) {
                dispatch(hideLoading());
                didShowLoaderRef.current = false;
            }
        };
    }, [dispatch]);


    const handleVerifyCode = async () => {
        setError('');

        try {
            const messageType = route.params.email
                ? ApiMessageType.VERIFY_EMAIL_CODE
                : ApiMessageType.VERIFY_PHONE_CODE;

            await dispatchThunk(
                verifyCode,
                messageType,
                { code: code.join('') },
                async (arg) => {
                    if (arg && arg.verificationToken && arg.isValid) {
                        dispatch(setVerificationToken(arg.verificationToken));
                        authenticate();
                        verifyAndAuthenticate();
                    } else {
                        setError('You have entered wrong OTP.');
                        resetVerificationState();
                    }
                },
                (error) => {
                    setError(error || 'Verification failed.');
                    resetVerificationState();
                }
            );
        } catch (error) {
            setError('Verification failed. Please try again.');
            resetVerificationState();
        } finally {
            setLoading(false);
            setIsVerifying(false);
        }
    };

    const verifyAndAuthenticate = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('verificationToken');

            if (storedToken) {
                authenticate({
                    dispatcher: dispatch,
                    onAuthenticate: (success: any) => {
                        if (success) {
                            navigate('Walkthrough');
                        } else {
                            createAccount(storedToken);
                        }
                    }
                });
            } else {
                setError('Verification token not found. Please try again.');
                resetVerificationState();
            }
        } catch (error) {
            setError('Authentication failed. Please try again.');
            resetVerificationState();
        }
    };

    const createAccount = async (verificationToken: string) => {
        setError('');
        setLoading(true);

        if (!verificationToken) {
            setError('Verification token is required');
            setLoading(false);
            return;
        }

        if (!apiSessionKey) {
            setError('Session key is required');
            setLoading(false);
            return;
        }

        if (!contactInfo) {
            setError('Contact information is required');
            setLoading(false);
            return;
        }

        try {
            const payload = isPhoneVerification
                ? {
                    phoneNumber: contactInfo,
                    phoneCountryCode: countryCode,
                }
                : {
                    email: contactInfo,
                };

            const requestBody = {
                messageType: ApiMessageType.CREATE_ACCOUNT,
                sessionKey: apiSessionKey,
                verificationToken: verificationToken,
                payload: payload,
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(`${API_CONFIG.SERVER_URL}/api/api/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'VC-Device-Platform': Platform.OS,
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            let responseData: any;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`Server returned invalid JSON: ${responseText}`);
            }

            if (responseData.responseCode === 200) {
                if (responseData.payload && responseData.payload.authInfo) {
                    if (isNavigatingRef.current) {
                        return;
                    }
                    isNavigatingRef.current = true;
                    setLoading(false);
                    setIsVerifying(false);
                    dispatch(hideLoading());
                    dispatch(setAuthInfo(responseData.payload.authInfo));
                    navigate(ScreenType.MAIN);
                } else {
                    setError('Account creation failed. Please try again.');
                    setLoading(false);
                }
            } else {
                setError(responseData.responseDescription || 'Account creation failed. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                setError('Request timed out. Please try again.');
            } else {
                setError('Account creation failed. Please try again.');
            }
            setLoading(false);
        }
    };

    const resendCode = async () => {
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
                    setIsCodeSent(true);
                    setError('');
                },
                (error: any) => {
                    setError(error.message || 'Invalid code, please try again.');
                    resetVerificationState();
                },
            );
        } catch (err) {
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
                            code={code}
                            setCode={handleSetCode}
                            error={error}
                            resetFocus={resetFocus}
                        />
                    }
                />

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