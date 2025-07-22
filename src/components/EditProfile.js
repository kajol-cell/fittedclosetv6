import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import {ProfileEditType, SessionMessageType} from '../utils/enums';
import {callSessionApi, updateProfileField} from '../redux/features/sessionSlice';
import {dispatchThunk} from '../utils/reduxUtils';
import {showNotification} from '../firebase/NotificationUtil';
import {API_CONFIG} from "../config/appConfig";

const EditProfile = forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [editType, setEditType] = useState(null);
    const [formData, setFormData] = useState({});
    const [profileLink, setProfileLink] = useState('');
    const [isShareProfilePrompt, setShareProfilePrompt] = useState(false);

    useImperativeHandle(ref, () => ({
        open: (type, data = {}) => {
            if (type === 'SHARE_PROFILE') {
                setShareProfilePrompt(true);
                setFormData(data);
                setProfileLink(API_CONFIG.SERVER_URL + 'fp/' + data.vcHandle);
                setVisible(true);
            } else {
                setEditType(type);
                setFormData(data);
                setVisible(true);
                setShareProfilePrompt(false);
            }
        },
    }));

    const handleClose = () => {
        setVisible(false);
        setEditType(null);
        setFormData({});
        setShareProfilePrompt(false);
    };

    const handleSave = () => {
        dispatchThunk(
            callSessionApi,
            SessionMessageType.UPDATE_PROFILE_FIELD,
            {editType, ...formData},
            responsePayload => {
                dispatch(updateProfileField(responsePayload));
                showNotification('Profile updated');
                handleClose();
            },
        );
    };

    const handleShare = () => {
        Clipboard.setString(profileLink);
        showNotification('Profile link copied to clipboard!');
        handleClose();

    };
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.backdrop}>
                <View style={styles.modalContainer}>
                    {isShareProfilePrompt ? (
                        <>
                            <Text style={styles.title}>Share Your Public Profile</Text>
                            <Text style={styles.description}>
                                Available at:
                            </Text>
                            <Text style={styles.link}>{profileLink}</Text>
                            <Button mode="contained" onPress={handleShare} style={styles.button}>
                                Copy Link
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text style={styles.title}>Edit Profile</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Value"
                                value={formData.value}
                                onChangeText={text =>
                                    setFormData(prev => ({...prev, value: text}))
                                }
                            />
                            <Button mode="contained" onPress={handleSave} style={styles.button}>
                                Save
                            </Button>
                        </>
                    )}
                    <Button onPress={handleClose} style={styles.cancelButton}>Cancel</Button>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '90%',
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    link: {
        fontSize: 14,
        color: '#007BFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        marginBottom: 20,
    },
    button: {
        marginBottom: 10,
    },
    cancelButton: {
        alignSelf: 'center',
        marginTop: 10,
    },
});

export default EditProfile;
