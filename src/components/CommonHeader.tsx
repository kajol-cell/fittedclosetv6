import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import COLORS from '../const/colors';
import FastImage from 'react-native-fast-image';

import Ionicons from 'react-native-vector-icons/Ionicons';
interface CommonHeaderProps {
    title: string;
    subtitle?: string;
    onBackPress: () => void;
    showBackButton?: boolean;
    headerStyle?: 'default' | 'simple' | 'centered';
    titleStyle?: any;
    subtitleStyle?: any;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
    title,
    subtitle,
    onBackPress,
    showBackButton = true,
    headerStyle = 'default',
    titleStyle,
    subtitleStyle
}) => {
    const renderHeader = () => {
        switch (headerStyle) {
            case 'simple':
                return (
                    <View style={styles.simpleContainer}>
                        <View style={styles.simpleHeaderRow}>

                            {showBackButton && (

                                <TouchableOpacity style={styles.backButtonContainer} onPress={onBackPress}>
                                    <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.simpleContent}>
                            <Text style={[styles.simpleTitle, titleStyle]}>{title}</Text>
                            {subtitle && (
                                <Text style={[styles.simpleSubtitle, subtitleStyle]}>{subtitle}</Text>
                            )}
                        </View>
                    </View>
                );
            case 'centered':
                return (
                    <View style={styles.centeredHeader}>
                        {showBackButton && (
                            <TouchableOpacity onPress={onBackPress}>
                                <Ionicons name="chevron-back" size={22} color={COLORS.primary} />

                            </TouchableOpacity>
                        )}
                        <Text style={[styles.centeredTitle, titleStyle]} numberOfLines={1}>
                            {title}
                        </Text>
                        {showBackButton && <View style={{ width: 28 }} />}
                    </View>
                );
            default:
                return (
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onBackPress}>
                                <Ionicons name="chevron-back" size={22} color={COLORS.primary} />

                            </TouchableOpacity>
                        </View>

                        <View style={styles.content}>
                            <Text style={[styles.title, titleStyle]}>{title}</Text>
                            {subtitle && (
                                <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
                            )}
                        </View>
                    </>
                );
        }
    };

    return (
        <View style={styles.container}>
            {renderHeader()}
        </View>
    );
};

const styles = StyleSheet.create({
    simpleContainer: {
        width: '100%',
        // padding:20,
        paddingTop: Dimensions.get('window').height * 0.06,
    },

    simpleHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    simpleContent: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },

    simpleTitle: {
        fontSize: 26,
        color: COLORS.Black,
        fontFamily: 'SFPRODISPLAYBOLD',
    },

    simpleSubtitle: {
        fontSize: 14,
        color: COLORS.grayInactive,
        fontFamily: 'SFPRODISPLAYBOLD',
        textAlign: 'left',
        lineHeight: 20, marginTop: 10, marginBottom: 10,
    },
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backButton: {
        height: 14,
        width: 14, alignSelf: 'center'
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    backButtonContainer: {
        backgroundColor: '#F5F5F5',
        padding: 6, borderRadius: 20
    },
    title: {
        fontSize: 32,
        color: COLORS.Black,
        fontFamily: 'SFPRODISPLAYBOLD',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'SFPRODISPLAYBOLD',
        textAlign: 'center',
        lineHeight: 22,
    },
    simpleHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    centeredHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    centeredTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 10,
    },
});

export default CommonHeader; 