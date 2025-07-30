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
} from 'react-native';
import { useDispatch } from 'react-redux';
import COLORS from '../../const/colors';
import { navigate } from '../../navigation/navigationService';
import { ApiMessageType } from '../../utils/enums';
import { dispatchThunk } from '../../utils/reduxUtils';
import { sendCode } from '../../redux/features/authSlice';
import CommonHeader from '../../components/CommonHeader';
import Button from '../../components/Button';
import ThemeStyle from '../../const/ThemeStyle';

interface EmailScreenProps {
    navigation: any;
}

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
            style={ThemeStyle.container}
        >
            <SafeAreaView style={ThemeStyle.mainContainer}>
                <CommonHeader
                    title="Enter your email"
                    subtitle="We will send you a confirmation code there"
                    onBackPress={handleBack}
                    showBackButton
                    headerStyle="simple"
                />

                <View >
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
                    <Button
                        title='Continue'
                        onPress={handleContinue}
                        disabled={!isValid}
                        buttonType={true}
                        bgColor={isValid?COLORS.primary:COLORS.whiteAlt}
                        btnTextColor={isValid?COLORS.whiteAlt:COLORS.grayInactive}
                    />                 
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default EmailScreen;

const styles = StyleSheet.create({   
    safeArea: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 0.8,
        borderColor: '#F5F5F5',
        padding: 3,width:'90%', alignSelf:'center'
    },
    emailInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.Black,
        paddingRight: 10,
        fontFamily: 'SFPRODISPLAYBOLD',
         paddingHorizontal: 10
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
    buttonWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
});