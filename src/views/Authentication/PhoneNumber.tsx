import React, { useState } from 'react';
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
import { identifyUserFromProfile, trackLogin, trackSignup } from '../../lib/analytics';
import LoadingWrapper from '../../components/LoadingWrapper';
import VerifyCode from '../../components/VerifyCode';
import CommonHeader from '../../components/CommonHeader';
import PhoneInput from '../../components/PhoneInput';
import { createFullPhoneNumber, getPhoneValidationError } from '../../utils/phoneUtils';

interface EmailScreenProps {
    navigation: any;
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

const PhoneNumberScreen: React.FC<EmailScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const handlePhoneChange = (phone: string, code: string) => {
        setPhoneNumber(phone);
        setCountryCode(code);
        setError('');
    };

    const handleCountryCodeChange = (code: string, countryCode: string) => {
        setCountryCode(code);
        setError('');
    };

    const handleValidationChange = (valid: boolean) => {
        setIsValid(valid);
    };

    const submitPhone = async () => {
        if (!isValid) {
            const validationError = getPhoneValidationError(phoneNumber, countryCode);
            setError(validationError || 'Please enter a valid phone number');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const fullPhoneNumber = createFullPhoneNumber(phoneNumber, countryCode);
            console.log('Submitting phone:', fullPhoneNumber);
            await dispatchThunk(
                sendCode,
                ApiMessageType.SEND_PHONE_CODE,
                { phone: fullPhoneNumber },
                (response) => {
                    console.log('Code sent successfully:', response);
                    setIsCodeSent(true);
                    setLoading(false);
                    navigate('OtpVerify', {
                        phoneNumber: fullPhoneNumber,
                        countryCode: countryCode
                    });
                },
                (error: any) => {
                    console.error('Failed to send code:', error);
                    setError(error.message || 'Failed to send verification code');
                    setLoading(false);
                },
            );
        } catch (err) {
            console.error('Error submitting phone:', err);
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!isValid) {
            const validationError = getPhoneValidationError(phoneNumber, countryCode);
            setError(validationError || 'Please enter a valid phone number');
            return;
        }
        submitPhone();
    };

    const handleBack = () => {
        if (isCodeSent) {
            setIsCodeSent(false);
            setPhoneNumber('');
            setError('');
        } else {
            navigation.goBack();
        }
    };

    const content = (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <CommonHeader
                    title="Enter your phone number"
                    subtitle="We will send you a confirmation code there"
                    onBackPress={handleBack}
                    showBackButton
                    headerStyle="simple"
                />

                <View style={styles.content}>
                    <PhoneInput
                        onPhoneChange={handlePhoneChange}
                        onCountryCodeChange={handleCountryCodeChange}
                        onValidationChange={handleValidationChange}
                        phoneData={{
                            phone: phoneNumber,
                            countryCode: countryCode
                        }}
                        disabled={loading}
                        error={error}
                    />
                </View>

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: isValid && !loading ? COLORS.Black : '#F5F5F5',
                            },
                        ]}
                        onPress={handleContinue}
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
                            {loading ? 'Sending...' : 'Continue'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );

    return (
        <LoadingWrapper loading={loading} content={content} />
    );
};

export default PhoneNumberScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
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
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
});