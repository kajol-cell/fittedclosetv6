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
    console.log(route.params, 'route.params>>>>>>>>')

    const isPhoneVerification = !!phoneNumber;
    const isEmailVerification = !!email;
    const [contactInfo, setContactInfo] = useState(isPhoneVerification ? phoneNumber : email || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [status, setStatus] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const verificationAttemptedRef = useRef(false);


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
    
            if (error) {
                setError('');
            }
        }
    }, [code]);
    

  
    const handleVerifyCode = async () => {
        console.log('Verifying code:', code);
        console.log('Route params:', route.params);
        setLoading(true);
        setError('');
        
        try {
            const messageType = route.params.email 
                ? ApiMessageType.VERIFY_EMAIL_CODE
                : ApiMessageType.VERIFY_PHONE_CODE;
            
            console.log('Using message type:', messageType);
            console.log('Code to verify:', code.join(''));
            
            const result = await dispatchThunk(
               verifyCode,
               messageType,
               {code: code.join('')},
               arg => {
                console.log('Verification response>>>:', arg);
                  if (arg && arg.verificationToken) {
                      dispatch(setVerificationToken(arg.verificationToken));
                      let authInfo = arg.authInfo;
                      if (authInfo) {
                          dispatch(setAuthInfo(authInfo));
                          handleTracking(authInfo, route.params.email ? 'email' : 'phone');
                      } else {
                          console.error('Missing authInfo in response:', arg);
                          setError('Invalid verification response - missing auth info');
                      }
                  } else {
                      console.error('Invalid verification response:', arg);
                      setError('Invalid verification response - missing verification token');
                  }
               },
               error => {
                  console.error('Code verification failed:', error);
                  setError(error);
               },
            );
            
            if (result) {
                console.log('Verification successful:', result);
            }
        } catch (error) {
            console.error('Verification error:', error);
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
            setIsVerifying(false);
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
                    console.error('Code verification failed:', error);
                    setError(error.message || 'Invalid code, please try again.');
                    setCode(['', '', '', '', '', '']); 
                    setIsValid(false);
                    verificationAttemptedRef.current = false; 
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