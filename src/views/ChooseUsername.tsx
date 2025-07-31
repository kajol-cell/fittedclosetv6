import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native';
import COLORS from '../const/colors';
import CommonHeader from '../components/CommonHeader';
import { navigate } from '../navigation/navigationService';
import { dispatchThunk } from '../utils/reduxUtils';
import { createUserHandle } from '../redux/features/authSlice';
import {  SessionMessageType } from '../utils/enums';
import { HelperText } from 'react-native-paper';

const ChooseUsername: React.FC<any> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [status, setStatus] = useState('');
    const [isValid, setIsValid] = useState(false);


    const getValidationError = (username: string): string => {
        if (username.length === 0) {
            return '';
        }
        if (username.length < 5) {
            return 'Username must be longer than 4 characters.';
        }
        if (username.length > 15) {
            return 'Username must be 15 characters or less.';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'Use only letters, numbers or underscores';
        }
        return '';
    };

    useEffect(() => {
        const validationError = getValidationError(username);
        setIsValid(username.length > 0 && validationError === '');
        if (validationError) {
            setError(validationError);
        } else if (!validationError && error && !error.includes('already taken')) {
            setError('');
        }
    }, [username]);

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        if (error && !error.includes('already taken') && !error.includes('Failed to create username')) {
            setError('');
        }
    };


    const submitUsername = async (usernameValue: string) => {
        setLoading(true);
        await dispatchThunk(
            createUserHandle,
            SessionMessageType.CREATE_USER_HANDLE,
            { handle: usernameValue },
            (response) => {
                console.log('Username created successfully:', response);
                setLoading(false);
                navigate('ChooseAccount');
            },
            (error: any) => {
                if (error.message && error.message.includes('already taken')) {
                    setError('Username is already taken. Please choose another.');
                } else if (error.code === 500 || (error.message && error.message.includes('500'))) {
                    setError('Server error occurred. Please try again in a moment.');
                } else if (error.responseDescription && error.responseDescription.trim() !== '') {
                    setError(error.responseDescription);
                } else if (error.message && error.message.trim() !== '') {
                    setError(error.message);
                } else {
                    setError('Failed to create username. Please try again.');
                }
                setLoading(false);
            },
        );
    };

    const handleContinue = () => {
        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        const validationError = getValidationError(username);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        submitUsername(username);
    };


    const handleBack = () => {
        if (isCodeSent) {
            setIsCodeSent(false);
            setUsername('');
            setError('');
        } else {
            navigation.goBack()
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
                    {error ? <HelperText type="error">{error}</HelperText> : null}
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
                            {loading ? 'Creating...' : 'Continue'}
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
        marginTop:10
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
        justifyContent:'center'
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