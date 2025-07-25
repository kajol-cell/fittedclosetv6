import React from 'react';
import {TouchableOpacity, StyleSheet, View, Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {selectPieceById} from '../redux/features/sessionSlice';
import {useRenderTracker} from '../utils/debugUtils';
import PieceImage from './PieceImage';

/**
 * Piece Component
 * - Renders an image from PieceInfo using PieceImage (with loader + error fallback)
 * - Supports tap interaction for custom actions
 */
const Piece = ({pieceId, onPress}) => {
    const pieceInfo = useSelector(state => selectPieceById(state, pieceId));
    useRenderTracker('Piece : ' + pieceId);

    if (!pieceInfo) return null;

    return (
        <TouchableOpacity onPress={() => onPress(pieceInfo)}>
            <View style={styles.container}>
                <PieceImage
                    uri={pieceInfo.imageUrl}
                    style={styles.image}
                />
                {!pieceInfo.inCloset && <View style={styles.badge}/>}
            </View>
        </TouchableOpacity>
    );
};

const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth / 3) - 10; // Adjusted for padding and margin

const styles = StyleSheet.create({
    container: {
        margin: 1,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 0,
    },
    image: {
        width: imageSize,
        height: imageSize,
        borderRadius: 10,
    },
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#00AEEF',
        borderWidth: 2,
        borderColor: 'white',
    },
});

function areEqual(prevProps, nextProps) {
    return prevProps.pieceId === nextProps.pieceId;
}

export default React.memo(Piece, areEqual);
