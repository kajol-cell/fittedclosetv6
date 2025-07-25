import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, IconButton, Text} from 'react-native-paper';
import {useRenderTracker} from '../utils/debugUtils';
import {useSelector} from 'react-redux';
import {
  getGarmentTypeRandomPiece,
  getLayerRandomPiece,
} from '../utils/closetUtils';
import {GARMENT_TYPES, LAYER_TYPES} from '../utils/enums';
import {useFocusEffect} from "@react-navigation/native";

function getSlotHeight(slot) {
  switch (slot) {
    case GARMENT_TYPES.HEADWEAR.name:
      return 80;
    case GARMENT_TYPES.TOP.name:
      return 150;
    case GARMENT_TYPES.BOTTOM.name:
      return 150;
    case GARMENT_TYPES.FOOTWEAR.name:
      return 80;
    default:
      return 100; // Default height if slotIndex is not recognized
  }
}

const FitSlot = React.memo(
  ({
    marginTop = 0,
    marginBottom = 0,
    slot,
    fitData,
    layerPieceContainer = {},
    onRemove,
    onLockChange,
  }) => {
    useRenderTracker('FitSlot : ' + slot);
    const closet = useSelector(state => state.session.closet);
    const pieces = useMemo(() => closet?.pieces || [], [closet?.pieces]);
    const [showDelete, setShowDelete] = useState(false);
    const [showLock, setShowLock] = useState(false);
    const [locked, setLocked] = useState(fitData.locked === slot);
    const [selectedPiece, setSelectedPiece] = useState(fitData[slot]);
    const [layerPiece, setLayerPiece] = useState(
      layerPieceContainer.layerPiece,
    );
    const [chooseLayerPiece, setChooseLayerPiece] = useState(false);
    const [availablePieces, setAvailablePieces] = useState([]);
    const [pickerVisible, setPickerVisible] = useState(false);

    const translateY = useRef(
      new Animated.Value(fitData.translation[slot] || 0),
    ).current;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          translateY.setValue(fitData.translation[slot] + gestureState.dy);
        },
        onPanResponderRelease: (_, gestureState) => {
          const finalY = fitData.translation[slot] + gestureState.dy;
          fitData.translation[slot] = Math.round(finalY);
        },
      }),
    ).current;

    const getAvailableLayerPieces = useCallback(() => {
      return pieces.filter(p => p.garmentLayerType === LAYER_TYPES.OUTER.name);
    }, [pieces]);

    const getAvailablePieces = useCallback(() => {
      return pieces.filter(p => p.garmentType === slot);
    }, [pieces, slot]);

    const handleActivateDelete = useCallback(() => {
      setShowDelete(true);
      if (!locked) {
        setShowLock(true);
        setTimeout(() => setShowLock(false), 2000);
      }
      setTimeout(() => setShowDelete(false), 2000);
    }, [locked]);

    const toggleLock = () => {
      setLocked(prev => !prev);
      if (!locked) {
        setShowLock(true);
      }
      onLockChange(!locked);
    };

    const openLayerPicker = useCallback(() => {
      setChooseLayerPiece(true);
      setAvailablePieces(getAvailableLayerPieces());
      setPickerVisible(true);
    }, [getAvailableLayerPieces]);

    const openPicker = useCallback(() => {
      if (!locked) {
        setChooseLayerPiece(false);
        setAvailablePieces(getAvailablePieces(slot));
        setPickerVisible(true);
      }
    }, [slot, getAvailablePieces, locked]);

    const closePicker = useCallback(() => setPickerVisible(false), []);

    const selectLayerPiece = useCallback(
      newPiece => {
        layerPieceContainer.layerPiece = newPiece;
        setLayerPiece(newPiece);
      },
      [layerPieceContainer.layerPiece],
    );

    const selectMainPiece = useCallback(
      newPiece => {
        setLocked(true);
        onLockChange(true);
        fitData[slot] = newPiece;
        setSelectedPiece(newPiece);
      },
      [fitData, onLockChange, slot],
    );

    const selectPiece = useCallback(
      newPiece => {
        if (chooseLayerPiece) {
          selectLayerPiece(newPiece);
        } else {
          selectMainPiece(newPiece);
        }
        closePicker();
      },
      [chooseLayerPiece, closePicker, selectLayerPiece, selectMainPiece],
    );

    const getRandomPiece = useCallback(
      () => getGarmentTypeRandomPiece(slot, pieces, selectedPiece),
      [slot, pieces, selectedPiece],
    );

    const refreshLayerPiece = useCallback(() => {
      const randomPiece = getLayerRandomPiece(pieces, layerPiece);
      layerPieceContainer.layerPiece = randomPiece;
      setLayerPiece(randomPiece);
    }, [pieces, layerPiece]);

    const refreshPiece = useCallback(() => {
      if (!locked) {
        const randomPiece = getRandomPiece();
        fitData[slot] = randomPiece;
        setSelectedPiece(randomPiece);
      }
    }, [locked, slot, fitData, getRandomPiece]);

    const toggleLayer = () => {
      if (layerPiece) {
        setLayerPiece(null);
        layerPieceContainer.layerPiece = null;
      } else {
        const outerPiece = pieces.find(
          p => p.garmentType === 'Top' && p.garmentLayerType === 'OUTER',
        );
        if (outerPiece) {
          setLayerPiece(outerPiece);
          layerPieceContainer.layerPiece = outerPiece;
        } else {
          Alert.alert(
            'No outer piece available',
            'Please make sure you have an outer piece in your closet.',
          );
        }
      }
    };

    useEffect(() => {
      console.log('LayerPiece', layerPieceContainer.layerPiece);
      setSelectedPiece(fitData[slot]);
      setLayerPiece(layerPieceContainer.layerPiece);
    }, [fitData, layerPieceContainer.layerPiece, slot]);

    if (!fitData[slot]) return null;

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slot,
          {height: getSlotHeight(slot), marginTop, marginBottom},
          {transform: [{translateY}]},
        ]}>
        <TouchableOpacity
          onPress={handleActivateDelete}
          activeOpacity={1}
          style={[styles.touchArea, {height: getSlotHeight(slot)}]}
        />
        <Animated.View style={[styles.imageContainer, {height: getSlotHeight(slot)}]}>
          {layerPiece && (
            <TouchableOpacity
              style={[
                styles.layerImageContainer,
                {height: getSlotHeight(slot)},
              ]}
              onPress={refreshLayerPiece}
              onLongPress={openLayerPicker}
              activeOpacity={0.7}>
              <FastImage
                source={{
                  uri: layerPiece.imageUrl,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={[styles.image, {height: getSlotHeight(slot)}]}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.mainImageContainer}
            onPress={refreshPiece}
            onLongPress={openPicker}
            activeOpacity={0.7}>
            {selectedPiece ? (
              <FastImage
                source={{
                  uri: selectedPiece.imageUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={[styles.image, {height: getSlotHeight(slot)}]}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <Text style={styles.placeholderText}>Select a piece</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        {showDelete && (
          <IconButton
            icon="trash-can"
            size={32}
            style={styles.deleteIcon}
            onPress={onRemove}
          />
        )}

        {(showLock || locked) && (
          <IconButton
            icon={locked ? 'lock' : 'lock-open'}
            size={32}
            style={styles.lockIcon}
            onPress={toggleLock}
          />
        )}

        {slot === 'Top' && (
          <Animated.View style={styles.iconWithLabel}>
            <IconButton
              icon={layerPiece ? 'close' : 'plus'}
              size={42}
              onPress={toggleLayer}
            />
            <Text style={styles.iconLabel}>
              {layerPiece ? 'Layer' : 'Layer'}
            </Text>
          </Animated.View>
        )}

        <Modal visible={pickerVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Piece</Text>
              <FlatList
                data={availablePieces}
                keyExtractor={item => item.id}
                numColumns={3}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => selectPiece(item)}>
                    <View style={styles.itemContainer}>
                      <FastImage
                        source={{uri: item.imageUrl}}
                        style={styles.itemImage}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
              <Button
                mode="outlined"
                onPress={closePicker}
                style={styles.cancelButton}>
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '80%',
    borderWidth: 0,
    borderColor: '#ccc',
  },
  touchArea: {
    position: 'absolute',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  layerImageContainer: {
    position: 'absolute',
    left: -80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  mainImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  deleteIcon: {
    position: 'absolute',
    top: -5,
    right: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  lockIcon: {
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  iconWithLabel: {
    position: 'absolute',
    right: -40,
    top: '30%',
    transform: [{translateY: -11}],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 16,
    color: '#333',
    marginTop: -16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default FitSlot;
