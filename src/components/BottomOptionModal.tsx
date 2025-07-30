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

interface BottomOptionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectEmail: () => void;
    onSelectPhone: () => void;
}

const BottomOptionModal: React.FC<BottomOptionModalProps> = ({
    visible,
    onClose,
    onSelectEmail,
    onSelectPhone,
}) => {
    console.log('BottomOptionModal rendered with visible:', visible);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => {onClose() }}
                >
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Other options</Text>
                        </View>
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
                                    iconColor={COLORS.white}
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
                                    iconColor={COLORS.white}
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Phone number</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#2A2A2A',
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    handleContainer: {
        alignItems: 'center',
        marginBottom: 27,
    },
    handle: {
        width: 42,
        height: 4,
        backgroundColor: '#9E9E9E',
        borderRadius: 2, opacity: 0.4
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    titleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
        fontFamily: 'SFPRODISPLAYSEMIBOLD', opacity: 0.8
    },
    optionsContainer: {
        gap: 15,
    },
    optionButton: {
        backgroundColor: 'rgba(104, 102, 101, 0.66)',
        borderRadius: 15,
        paddingHorizontal: 5,
        width: '90%', alignSelf: 'center'
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: Dimensions.get('window').width * 0.14,
        justifyContent:'center',alignItems:'center'
    },
    optionText: {
        fontSize: 18,
        color: COLORS.white,
        fontWeight: '700',
        fontFamily: 'SFPRODISPLAYREGULAR', opacity: 0.8
    },
});

export default BottomOptionModal;
