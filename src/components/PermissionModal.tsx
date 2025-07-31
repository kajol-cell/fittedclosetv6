import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../const/colors';
import { PermissionType, PermissionStatus } from '../utils/permissionUtils';

interface PermissionModalProps {
  visible: boolean;
  type: PermissionType;
  status: PermissionStatus;
  onAllow: () => void;
  onDecline: () => void;
  onOpenSettings?: () => void;
  title?: string;
  description?: string;
  allowText?: string;
  declineText?: string;
  settingsText?: string;
}

const { width } = Dimensions.get('window');

const PermissionModal: React.FC<PermissionModalProps> = ({
  visible,
  type,
  status,
  onAllow,
  onDecline,
  onOpenSettings,
  title,
  description,
  allowText = 'Allow',
  declineText = 'Decline',
  settingsText = 'Open Settings',
}) => {
  const getPermissionConfig = () => {
    const configs = {
      camera: {
        icon: 'camera',
        defaultTitle: '"Fitted" Would Like to Access the Camera',
        defaultDescription: 'Snap photos of your pieces',
      },
      photoLibrary: {
        icon: 'image-multiple',
        defaultTitle: '"Fitted" Would Like to Access Photos',
        defaultDescription: 'Select photos of your pieces',
      },
      
      location: {
        icon: 'map-marker',
        defaultTitle: '"Fitted" Would Like to Access Location',
        defaultDescription: 'Get location-based outfit suggestions',
      },
      contacts: {
        icon: 'account-multiple',
        defaultTitle: '"Fitted" Would Like to Access Contacts',
        defaultDescription: 'Share outfits with your contacts',
      },
    };
    return configs[type];
  };

  const config = getPermissionConfig();
  const isBlocked = status === 'blocked';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDecline}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {isBlocked ? (
            // Blocked state - show settings option
            <View style={styles.blockedContent}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons 
                  name={`${config.icon}-off`} 
                  size={48} 
                  color={COLORS.white} 
                />
              </View>
              <Text style={styles.blockedTitle}>
                {title || config.defaultTitle}
              </Text>
              <Text style={styles.blockedDescription}>
                {description || config.defaultDescription}
              </Text>
              <Text style={styles.blockedSubtext}>
                Please enable this permission in your device settings to continue.
              </Text>
              <TouchableOpacity 
                style={styles.settingsButton} 
                onPress={onOpenSettings}
              >
                <Text style={styles.settingsButtonText}>{settingsText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Request state - show allow/decline options
            <View style={styles.requestContent}>
              <Text style={styles.requestTitle}>
                {title || config.defaultTitle}
              </Text>
              <Text style={styles.requestDescription}>
                {description || config.defaultDescription}
              </Text>
              <View style={styles.separatorLine}/>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.declineButton} 
                  onPress={onDecline}
                >
                  <Text style={styles.declineButtonText}>{declineText}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.allowButton} 
                  onPress={onAllow}
                >
                  <Text style={styles.allowButtonText}>{allowText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.graySubtle,
    borderRadius: 12,width:'70%',paddingTop:12
  },
  separatorLine: {
    backgroundColor: COLORS.grayExtraLight,opacity:0.3,
    borderWidth:0.2, width:'100%',
  },
  blockedContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  blockedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.Black,
    textAlign: 'center',
    marginBottom: 8,
  },
  blockedDescription: {
    fontSize: 16,
    color: COLORS.secondaryDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  blockedSubtext: {
    fontSize: 14,
    color: COLORS.grayLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
  requestContent: {
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 16,
    color: COLORS.Black,
    textAlign: 'center',
    fontFamily:'SFPRODISPLAYBOLD', width:'90%'
  },
  requestDescription: {
    fontSize: 12,
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginBottom:12,fontFamily:'SFPRODISPLAYBOLD', opacity:0.8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.tertiaryAlt,
    textAlign: 'center',
  },
  allowButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  allowButtonText: {
    fontSize: 16,
    color: COLORS.tertiaryAlt,
    textAlign: 'center',fontFamily:'SFPRODISPLAYBOLD'
  },
});

export default PermissionModal; 