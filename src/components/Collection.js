import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text, Snackbar} from 'react-native-paper';
import {useRenderTracker} from '../utils/debugUtils';

const Collection = ({collectionInfo, onPress}) => {
  useRenderTracker('Collection ' + collectionInfo.id);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.collectionContainer}>
      {/* Collection Name & Looks Count */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.headerContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.collectionName}>
          {collectionInfo.name}
        </Text>
        <Text style={styles.looksCount}>
          {collectionInfo.fits.length} Looks
        </Text>
      </TouchableOpacity>

      {/* Collection Fit Display */}
      <TouchableOpacity
        onPress={() => onPress(collectionInfo)}
        style={styles.collectionTouchable}>
        {collectionInfo.fits[0]?.fitPieces.map((fitPiece, index) => (
          <FastImage
            key={index}
            source={{
              uri: fitPiece.piece.imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={[
              styles.fitPieceImage,
              {transform: [{translateY: fitPiece.translateY}]},
            ]}
            resizeMode={FastImage.resizeMode.contain}
          />
        ))}
      </TouchableOpacity>

      {/* Snackbar for Full Collection Name */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000} // Auto-dismiss after 3 seconds
        style={{
          position: 'absolute',
          bottom: 290, // adjust based on other UI elements
          width: '92%',
          borderRadius: 6,
        }}>
        {collectionInfo.name}
      </Snackbar>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth / 3) - 35; // Adjusted for padding and margin

const styles = StyleSheet.create({
  collectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
  },
  looksCount: {
    fontSize: 12,
    color: 'gray',
  },
  collectionTouchable: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  fitPieceImage: {
    width: imageSize,
    height: imageSize,
    marginVertical: 0,
  },
});

function areEqual(prevProps, nextProps) {
  return (
      prevProps.collectionInfo.id === nextProps.collectionInfo.id &&
      prevProps.collectionInfo.name === nextProps.collectionInfo.name &&
      prevProps.collectionInfo.fits.length === nextProps.collectionInfo.fits.length
  );
}

export default React.memo(Collection, areEqual);

