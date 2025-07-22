import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TextInput,
    Dimensions,
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

const EmailScreen: React.FC<EmailScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [status, setStatus] = useState('');
    const [isValid, setIsValid] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        setIsValid(email.length > 0 && validateEmail(email));
    }, [email]);

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (error) {
            setError('');
        }
    };

    const submitEmail = async (emailValue: string) => {
        setLoading(true);
        await dispatchThunk(
            sendCode,
            ApiMessageType.SEND_EMAIL_CODE,
            { email: emailValue },
            (response) => {
                console.log('Code sent successfully:', response);
                setIsCodeSent(true);
                setLoading(false);
                navigate('OtpVerify', { email: emailValue });
            },
            (error: any) => {
                console.error('Failed to send code:', error);
                Alert.alert('Login failed', error.message);
                setLoading(false);
            },
        );
    };

    const handleContinue = () => {
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }

        setError('');
        submitEmail(email);
    };


    const handleBack = () => {
        if (isCodeSent) {
            setIsCodeSent(false);
            setEmail('');
            setError('');
        } else {
            navigation.goBack();
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <CommonHeader
                    title="Enter your email"
                    subtitle="We will send you a confirmation code there"
                    onBackPress={handleBack}
                    showBackButton
                    headerStyle="simple"
                />

                <View style={styles.content}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="name@company.com"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={handleEmailChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            returnKeyType="done"
                        />
                        {email.length > 0 && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => setEmail('')}
                            >
                                <Text style={styles.clearButtonText}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: isValid ? COLORS.Black : '#F5F5F5',
                            },
                        ]}
                        onPress={handleContinue}
                        disabled={!isValid}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                {
                                    color: isValid ? COLORS.white : '#999',
                                },
                            ]}
                        >
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default EmailScreen;

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
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 0.8,
        borderColor: '#F5F5F5',
        padding: 3,
    },
    emailInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.Black,
        paddingRight: 10,
        fontFamily: 'SFPRODISPLAYBOLD', paddingHorizontal: 10
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        fontSize: 16,
        color: '#999',
    },
    errorText: {
        color: 'red',
        marginTop: 8,
        fontSize: 14,
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
});