import React, {useState} from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

const PieceImage = ({uri, style}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <View style={[style, styles.container]}>
            {loading && !error && (
                <View style={styles.loader}>
                    <ActivityIndicator size="small" color="#999"/>
                </View>
            )}

            {!error ? (
                <FastImage
                    source={{
                        uri,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                    style={StyleSheet.absoluteFill}
                    resizeMode={FastImage.resizeMode.contain}
                    onLoadStart={() => {
                        setLoading(true);
                        setError(false);
                    }}
                    onLoad={() => {
                        setLoading(false);
                        setError(false);
                    }}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                />
            ) : (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Image unavailable</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#999',
        fontSize: 12,
    },
});

export default PieceImage;
