// src/components/GlobalLoader.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

const GlobalLoader = () => {
    const isLoading = useSelector(state => state.loading.isLoading);

    if (!isLoading) return null;

    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color="blue" />
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Make sure it's on top of all screens
    },
});

export default GlobalLoader;
