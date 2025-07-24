import React from 'react';
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import COLORS from '../const/colors';
import { navigate } from '../navigation/navigationService';

const { width, height } = Dimensions.get('window');

interface BottomOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectEmail: () => void;
    onSelectPhone: () => void;
}

const BottomOptionsModal: React.FC<BottomOptionsModalProps> = ({
    visible,
    onClose,
    onSelectEmail,
    onSelectPhone,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Other options</Text>
                        </View>
                        <TouchableOpacity onPress={() => onClose()} style={styles.closeButtonBackground}>
                            <IconButton
                                icon="close"
                                size={24}
                                style={styles.closeButton}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                navigate('Email')
                                onClose()
                            }}
                        >
                            <View style={styles.optionContent}>
                                <IconButton
                                    icon="email"
                                    size={24}
                                    iconColor={COLORS.Black}
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Email address</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                navigate('PhoneNumber')
                                onClose()
                            }}
                        >
                            <View style={styles.optionContent}>
                                <IconButton
                                    icon="phone"
                                    size={24}
                                    iconColor={COLORS.Black}
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Phone number</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        width: '90%',
        bottom:Dimensions.get('window').height * 0.05,
        height: Dimensions.get('window').height * 0.2,
        padding: 15,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        borderRadius: 25,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.Black,
        fontFamily: 'SFPRODISPLAYSEMIBOLD',
        marginLeft: 12
    },
    closeButtonBackground: {
        borderRadius: 20,
        backgroundColor: '#F8F8F8'
    },
    closeButton: {
        margin: 0,
        opacity: 0.7,
        height: 30, width: 30,
    },
    optionsContainer: {
        gap: 10, bottom: 12
    },
    optionButton: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        paddingVertical: 4
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    optionIcon: {
        margin: 0,
        marginRight: 12,
    },
    optionText: {
        fontSize: 18,
        color: COLORS.Black,
        fontWeight: '700',
        fontFamily: 'SFPRODISPLAYSEMIBOLD',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
});

export default BottomOptionsModal;
