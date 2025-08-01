import React, {useRef} from 'react';
import {Alert, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {dispatchThunk} from '../utils/reduxUtils';
import {callSessionApi, clearAuthInfo, toggleProfileSharing} from '../redux/features/sessionSlice';
import {ProfileEditType, ScreenType, SessionMessageType} from '../utils/enums';
import {navigate, navigationRef} from '../navigation/navigationService';
import ChangeBadgeModal from '../components/ChangeBadgeModal';
import {badgeMap} from '../utils/badgeMap';
import FastImage from 'react-native-fast-image';
import ChangeProfileImage from '../components/ChangeProfileImage';
import EditProfile from '../components/EditProfile';
import {showNotification} from "../firebase/NotificationUtil";
import {isEmpty} from "../utils/utils";

function resetApp(dispatch) {
    dispatch(clearAuthInfo());
    dispatch({type: 'RESET_APP'});
    navigationRef.reset({
        index: 0,
        routes: [{name: ScreenType.ENTRY}],
    });
}

function getBadgeSource(profile) {
    let badgeSource = profile.badgeId
        ? badgeMap[parseInt(profile.badgeId, 10)]
        : require('../assets/images/badge-placeholder.png');
    console.log('Badge Source', badgeSource);
    return badgeSource;
}

const ProfileView = () => {
    const dispatch = useDispatch();
    const changeProfileImageRef = useRef();
    const changeBadgeRef = useRef();
    const editProfileRef = useRef();
    const profile = useSelector(state => state.session.authInfo?.profile || {});
    const profilePublic = useSelector(state => state.session.authInfo?.profile?.profilePublic || false);
    const openAppSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings(); 
        }
    };

    const handleLogout = () => {
        dispatchThunk(
            callSessionApi,
            SessionMessageType.LOGOUT,
            {},
            responsePayload => {
                resetApp(dispatch);
            },
        );
    };

    const handleEditProfile = editType => {
        console.log('Edit Profile pressed');
        const data = {};
        if (editType === ProfileEditType.NAME) {
            data.firstName = profile.firstName;
            data.lastName = profile.lastName;
        } else if (editType === ProfileEditType.PHONE) {
            data.phoneCountryCode = profile.phoneCountryCode
                ? profile.phoneCountryCode
                : '+1';
            data.phoneNumber = profile.phoneNumber;
        } else if (editType === ProfileEditType.EMAIL) {
            data.email = profile.email;
        }
        editProfileRef.current.open(editType, data);
    };

    const confirmDelete = handleDelete => {
        Alert.alert(
            'Delete this account, Confirm?',
            'You cannot undo this action',
            [
                {text: 'Keep', style: 'cancel', onPress: () => handleDelete(false)},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => handleDelete(true),
                },
            ],
            {cancelable: true},
        );
    };

    const handleDeleteAccount = () => {
        console.log('Delete My Account pressed');
        confirmDelete(value => {
            if (!value) {
                return;
            }
            dispatchThunk(
                callSessionApi,
                SessionMessageType.REMOVE_ACCOUNT,
                {},
                responsePayload => {
                    resetApp(dispatch)
                    showNotification('Account deleted successfully!');
                },
                responsePayload => {
                    Alert.alert(responsePayload?.message || 'An error occurred');
                }
            );
        });
    };

    const handleToggleProfileSharing = () => {
        dispatchThunk(
            callSessionApi,
            SessionMessageType.TOGGLE_PROFILE_SHARING,
            {},
            responsePayload => {
                console.log('Profile Public', profilePublic);
                dispatch(toggleProfileSharing({profilePublic: !profilePublic}));
                console.log('Profile Public', profilePublic);
                showNotification(
                    `Profile is now ${profilePublic ? 'Private' : 'Public'}`,
                );
                if (!profilePublic) {
                    editProfileRef.current.open('SHARE_PROFILE', { vcHandle: profile.vcHandle });
                }
            },
            responsePayload => {
                Alert.alert(responsePayload?.message || 'An error occurred');
            },
        );
        console.log(
            profilePublic ? 'Switching to Private' : 'Switching to Public',
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Profile Picture and Badge Row */}
            <View style={styles.imageRow}>
                {!isEmpty(profile) && (<TouchableOpacity
                    style={styles.imageColumn}
                    onPress={() => changeProfileImageRef.current?.open()}>
                    {<FastImage
                        source={
                                profile.imageUrl && profile.imageUrl !== ''
                                    ? profile.imageUrl
                                    : require('../assets/images/profile-placeholder.png')
                        }
                        style={styles.image}
                    />}
                    <Text style={styles.imageLabel}>Change Picture</Text>
                </TouchableOpacity>)}

                <TouchableOpacity
                    style={styles.imageColumn}
                    onPress={() => changeBadgeRef.current?.open(profile.badgeId)}>
                    <FastImage
                        source={
                            getBadgeSource(profile)
                        }
                        style={styles.image}
                    />
                    <Text style={styles.imageLabel}>Change Badge</Text>
                </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <ProfileRow
                    label="First Name"
                    value={profile.firstName}
                    onPress={() => handleEditProfile(ProfileEditType.NAME)}
                />
                <ProfileRow
                    label="Last Name"
                    value={profile.lastName}
                    onPress={() => handleEditProfile(ProfileEditType.NAME)}
                />
                <ProfileRow
                    label="Email"
                    value={profile.email}
                    onPress={() => handleEditProfile(ProfileEditType.EMAIL)}
                />
                <ProfileRow
                    label="Phone"
                    value={profile.phoneCountryCode + profile.phoneNumber}
                    onPress={() => handleEditProfile(ProfileEditType.PHONE)}
                />
                <ProfileRow
                    label="Terms & Conditions"
                    value="View"
                    onPress={() => navigate(ScreenType.TERMS_OF_SERVICE)}
                />
                <ProfileRow
                    label="Privacy Policy"
                    value="View"
                    onPress={() => navigate(ScreenType.PRIVACY_POLICY)}
                />
                <ProfileRow
                    label="Permissions"
                    value="Modify"
                    onPress={() => openAppSettings()}
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.button} onPress={handleToggleProfileSharing}>
                    <Icon
                        name={profilePublic ? 'shield-lock-outline' : 'share-variant'}
                        size={24}
                        color={profilePublic ? '#FF9500' : '#007BFF'}
                    />
                    <Text
                        style={[
                            styles.buttonText,
                            {color: profilePublic ? '#FF9500' : '#007BFF'},
                        ]}>
                        {profilePublic ? 'Make Profile Private' : 'Make Profile Public'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Icon name="logout" size={24} color="#007BFF"/>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
                    <Icon name="delete" size={24} color="#FF3B30"/>
                    <Text style={[styles.buttonText, {color: '#FF3B30'}]}>
                        Delete My Account
                    </Text>
                </TouchableOpacity>
            </View>

            <ChangeProfileImage ref={changeProfileImageRef}/>
            <ChangeBadgeModal ref={changeBadgeRef}/>
            <EditProfile ref={editProfileRef}/>
        </ScrollView>
    );
};

const ProfileRow = ({label, value, onPress}) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text onPress={onPress} style={onPress ? styles.rowLink : styles.rowValue}>
            {value || 'Add'}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    imageColumn: {
        alignItems: 'center',
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'transparent',
        marginBottom: 8,
    },
    imageLabel: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: '500',
    },
    infoSection: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    rowLabel: {
        fontSize: 16,
        color: '#555',
    },
    rowValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    rowLink: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: '500',
    },
    buttonSection: {
        gap: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 5,
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default ProfileView;
