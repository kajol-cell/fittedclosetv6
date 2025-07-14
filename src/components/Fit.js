import React, {useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Snackbar, Text} from 'react-native-paper';
import {useRenderTracker} from '../utils/debugUtils';


function getPieceHeight(fitPiece) {
  switch (fitPiece.slotIndex) {
    case 0:
      return 80;
    case 1:
      return 100;
    case 2:
      return 100;
    case 3:
      return 60;
    default:
      return 100; // Default height if slotIndex is not recognized
  }
}

const Fit = ({fitInfo, onPress = info => {}}) => {
  useRenderTracker('Fit ' + fitInfo.id);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fitContainer}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.headerContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.fitName}>
          {fitInfo.name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPress(fitInfo)}
        style={styles.fitTouchable}>
        {fitInfo.fitPieces.map((fitPiece, index) => (
          <View
            key={index}
            style={[
              styles.pieceWrapper,
              {height: getPieceHeight(fitPiece)},
              {transform: [{translateY: fitPiece.translateY}]},
            ]}>
            {fitPiece.layerPiece && (
              <FastImage
                source={{
                  uri: fitPiece.layerPiece.imageUrl,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={[
                  styles.layerPieceImage,
                  styles.layerPiece,
                  {height: getPieceHeight(fitPiece)},
                ]}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
            {fitPiece.piece && (
            <FastImage
              source={{
                uri: fitPiece.piece.imageUrl,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={[styles.fitPieceImage, {height: getPieceHeight(fitPiece)}]}
              resizeMode={FastImage.resizeMode.contain}
            />
            )}
          </View>
        ))}
      </TouchableOpacity>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{
          position: 'absolute',
          bottom: 290,
          width: '92%',
          borderRadius: 6,
        }}>
        {fitInfo.name}
      </Snackbar>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth / 3) - 35; // Adjusted for padding and margin

const styles = StyleSheet.create({
  fitContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fitName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
  },
  headerContainer: {
    marginTop: 4,
  },
  fitTouchable: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceWrapper: {
    width: imageSize,
    position: 'relative',
    marginVertical: 0,
  },
  fitPieceImage: {
    width: imageSize,
    height: imageSize,
    position: 'absolute',
  },
  layerPieceImage: {
    left: -30,
    width: imageSize,
    height: imageSize,
    position: 'absolute',
  },
  layerPiece: {},
});

function areFitPiecesEqual(fitA, fitB) {
  if (!fitA?.fitPieces || !fitB?.fitPieces) return false;
  if (fitA.fitPieces.length !== fitB.fitPieces.length) return false;

  const idsA = fitA.fitPieces.map(fp => fp.piece.id).sort();
  const idsB = fitB.fitPieces.map(fp => fp.piece.id).sort();
  //console.log("Ids A", idsA, "Ids B", idsB);
  return idsA.every((id, i) => id === idsB[i]);
}

function areEqual(prevProps, nextProps) {
  let fitsEqual = prevProps.fitInfo.id === nextProps.fitInfo.id &&
      prevProps.fitInfo.name === nextProps.fitInfo.name &&
      areFitPiecesEqual(prevProps.fitInfo, nextProps.fitInfo);
  //console.log('Fits Equal', fitsEqual);
  return fitsEqual;
}

export default React.memo(Fit, areEqual);

