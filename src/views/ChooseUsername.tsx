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
import COLORS from '../const/colors';
import CommonHeader from '../components/CommonHeader';
import { navigate } from '../navigation/navigationService';
import { dispatchThunk } from '../utils/reduxUtils';
import { sendCode } from '../redux/features/authSlice';
import { ApiMessageType } from '../utils/enums';
import { useSelector } from 'react-redux';

const ChooseUsername: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.auth);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [status, setStatus] = useState('');
    const [isValid, setIsValid] = useState(false);

    const validateUsername = (username: string): boolean => {
        const regex = /^[a-zA-Z0-9_]{5,15}$/;
        return regex.test(username);
    };

    useEffect(() => {
        setIsValid(username.length > 0 && validateUsername(username));
    }, [username]);

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        if (error) {
            setError('');
        }
    };


    const handleContinue = () => {
        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        if (!validateUsername(username)) {
            setError('Username must be 5-15 characters and contain only letters, numbers, or underscores');
            return;
        }

        setError('');
        navigate('ChooseAccount');
    };


    const handleBack = () => {
        if (isCodeSent) {
            setIsCodeSent(false);
            setUsername('');
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
                    title="Choose a username"
                    subtitle={username.length > 0 ? "This will be part of your profile link." : "Your username must be longer then 4 characters."}
                    onBackPress={handleBack}
                    showBackButton
                    headerStyle="simple"
                />

                <View style={styles.content}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="@ Username"
                            placeholderTextColor={COLORS.grayInactive}
                            value={username}
                            onChangeText={handleUsernameChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            returnKeyType="done"
                        />
                        {username.length > 0 && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => setUsername('')}
                            >
                                {isValid ? (
                                    <View style={styles.tickContainer}>
                                        <Text style={styles.tickText}>✓</Text>
                                    </View>
                                ) : (
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.errorIcon}>!</Text>
                                    </View>
                                )}
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

export default ChooseUsername;

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
        fontFamily: 'SFPRODISPLAYBOLD', paddingHorizontal: 10
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        fontSize: 16,
        color: '#999',
    },
    tickContainer: {
        width: 18,
        height: 18,
        borderRadius: 18,
        backgroundColor: '#04DE71',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tickText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'SFPRODISPLAYBOLD',
    },
    errorContainer: {
        width: 18,
        height: 18,
        borderRadius: 18,
        backgroundColor: '#FF3B30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorIcon: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'SFPRODISPLAYBOLD',
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