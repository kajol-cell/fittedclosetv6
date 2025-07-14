import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Fit from './Fit';

const FitPickerItem = ({ item, isSelected, onToggle }) => {
    const handleToggle = useCallback(() => {
        onToggle(item);
    }, [item, onToggle]);

    return (
        <View style={styles.fitWrapper}>
            <TouchableOpacity onPress={handleToggle}>
                <Fit fitInfo={item} onPress={handleToggle} />
            </TouchableOpacity>
            <IconButton
                icon={isSelected ? 'check-circle' : 'checkbox-blank-circle-outline'}
                size={24}
                style={styles.checkboxIcon}
                onPress={handleToggle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    fitWrapper: {
        position: 'relative',
        margin: 1,
    },
    checkboxIcon: {
        position: 'absolute',
        top: -15,
        right: -15,
    },
});

export default React.memo(FitPickerItem);
