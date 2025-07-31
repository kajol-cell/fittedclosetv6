// src/components/GlobalLoader.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading } from '../redux/features/loadingSlice';

const GlobalLoader = () => {
    const isLoading = useSelector(state => state.loading.isLoading);
    const dispatch = useDispatch();
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setShowLoader(true);
            const timeout = setTimeout(() => {
                dispatch(hideLoading());
                setShowLoader(false);
            }, 3000);

            return () => clearTimeout(timeout);
        } else {
            setShowLoader(false);
        }
    }, [isLoading, dispatch]);

    if (!showLoader) return null;

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
        zIndex: 9999,
    },
});

export default GlobalLoader;
