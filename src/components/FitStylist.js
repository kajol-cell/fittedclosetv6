import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Platform, StyleSheet, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import FitSlot from './FitSlot';
import {useRenderTracker} from '../utils/debugUtils';
import {GARMENT_TYPES, getGarmentName, SessionMessageType} from '../utils/enums';
import {getGarmentTypeRandomPiece} from '../utils/closetUtils';
import {isEmpty, isNotEmpty} from '../utils/utils';
import EditableLabelInput from './EditableLabelInput';
import {dispatchThunk} from '../utils/reduxUtils';
import {callSessionApi, removeFit, updateFit, updateFitName} from '../redux/features/sessionSlice';
import {showNotification} from '../firebase/NotificationUtil';
import {useAppContext} from '../navigation/AppContext';
import {useFocusEffect} from '@react-navigation/native';
import {selectMyCloset} from '../utils/selectors';
import {trackFitCreate, trackFitView} from '../lib/analytics';

function addSlotPiece(selectedFit, garmentType, saveFitInfo, layerPiece) {
   const fitPieceData = selectedFit[garmentType.name];
   if (fitPieceData) {
      const fitPiece = {
         slotIndex: garmentType.slotIndex,
         pieceId: fitPieceData.id,
         translateY: selectedFit.translation[garmentType.name],
      };
      if (GARMENT_TYPES.TOP.name === garmentType.name) {
         fitPiece.layerPieceId = layerPiece?.id;
      }
      saveFitInfo.fitPieces = [...saveFitInfo.fitPieces, fitPiece];
   }
}

function updateSlotPiece(fitPiece, selectedFit, saveFitInfo, layerPiece) {
   const garmentName = getGarmentName(fitPiece.slotIndex);
   console.log('Update SlotPiece', garmentName);
   const fitPieceInfo = {
      id: fitPiece.id,
      slotIndex: fitPiece.slotIndex,
      pieceId: selectedFit[garmentName].id,
      translateY: selectedFit.translation[garmentName],
   };
   console.log('After Update SlotPiece', garmentName);

   if (GARMENT_TYPES.TOP.name === garmentName) {
      fitPieceInfo.layerPieceId = layerPiece?.id;
   }
   saveFitInfo.fitPieces = [...saveFitInfo.fitPieces, fitPieceInfo];
}

function initTranslation() {
   return {
      Headwear: 20,
      Top: 10,
      Bottom: -10,
      Footwear: -10,
   };
}

function initFitTranslation(formatFitData1, fit) {
   fit.fitPieces.forEach(fitPiece => {
      formatFitData1.translation[getGarmentName(fitPiece.slotIndex)] =
         fitPiece.translateY;
   });
}

const FitStylist = ({route, navigation}) => {
   const mode = route.params?.mode;
   const dispatch = useDispatch();
   const insets = useSafeAreaInsets();
   const isMyCloset = useSelector(selectMyCloset);
   const {appState, updateAppState} = useAppContext();
   const closet = useSelector(state => state.session.closet);
   const pieces = useMemo(() => closet?.pieces || [], [closet?.pieces]);
   const [createdWithPiece, setCreatedWithPiece] = useState(appState.onCreateFitPiece !== null);
   const [fitInfo] = useState(route.params?.fitInfo || {});
   const [selectedFit, setSelectedFit] = useState(null);
   const [removedSlots, setRemovedSlots] = useState({});
   const [layerPieceContainer, setLayerPieceContainer] = useState({});
   const [lockedSlots, setLockedSlots] = useState({
      Headwear: false,
      Top: false,
      Bottom: false,
      Footwear: false,
   });

   const resetLockedSlots = () => {
      
      lockedSlots.Headwear = false;
      lockedSlots.Top = false;
      lockedSlots.Bottom = false;
      lockedSlots.Footwear = false;
   };
   const refreshFit = () => {
      
      setRemovedSlots({});
      const newFit = generateRandomFit();

      const updatedFit = {};
      Object.keys(newFit).forEach(slot => {
         updatedFit[slot] = lockedSlots[slot] ? selectedFit[slot] : newFit[slot];
      });

      setSelectedFit(updatedFit);
   };

   function initFitData() {
      console.log('Init Fit Data');
      resetLockedSlots();
      setRemovedSlots({});
      setLayerPieceContainer({});
   }

   useFocusEffect(
      useCallback(() => {
         if (appState.onCreateFitPiece) {
            const pieceInfo = appState.onCreateFitPiece;
            initFitData();
            lockedSlots[pieceInfo.garmentType] = true;
            setLockedSlots(lockedSlots);
            const fit = generateRandomFit();
            fit[pieceInfo.garmentType] = pieceInfo;
            fit.locked = pieceInfo.garmentType;
            setSelectedFit(fit);
            updateAppState({onCreateFitPiece: null}); // clear it
         }
      }, [appState.onCreateFitPiece, lockedSlots, updateAppState, generateRandomFit])
   );

   useEffect(() => {
      if (createdWithPiece === true) {
         setCreatedWithPiece(false);
         return;
      }
      initFitData();
      console.log('FitStylist mode=', mode);
      if (mode === 'edit' && fitInfo) {
         const formatted = formatFitData(fitInfo);
         initFitTranslation(formatted, fitInfo);
         setSelectedFit(formatted);
      }
      else if (mode === 'create') {
         const randomFit = generateRandomFit();
         setSelectedFit(randomFit);
      }
   }, [mode, fitInfo]);

   const closeModal = () => navigation.goBack();

   const confirmDelete = handleDelete => {
      Alert.alert(
         'Delete this fit, Confirm?',
         'You cannot undo this action',
         [
            {text: 'Keep', style: 'cancel', onPress: () => handleDelete(false)},
            {
               text: 'Delete',
               style: 'destructive',
               onPress: () => handleDelete(true),
            },
         ],
         {cancelable: true},
      );
   };

   function deleteFit() {
      console.log('Delete Fit');
      confirmDelete(value => {
         if (!value) {
            return;
         }
         dispatchThunk(
            callSessionApi,
            SessionMessageType.ARCHIVE_FITS,
            {fitIds: [fitInfo.id]},
            responsePayload => {
               closeModal();
               dispatch(removeFit({fitId: fitInfo.id}));
               showNotification('Fit deleted successfully!');
            },
         );
      });
   }

   function saveFit() {
      const saveFitInfo = {fitPieces: []};
      let newFit = false;
      if (isNotEmpty(fitInfo)) {
         console.log('Save Fit');
         saveFitInfo.id = fitInfo.id;
         saveFitInfo.name = selectedFit.name;
         console.log('selectedFit', selectedFit);
         Object.values(GARMENT_TYPES)
            .filter(type => !removedSlots[type.name])
            .forEach(type => {
               if (selectedFit[type.name]) {
                  let fitPiece = fitInfo.fitPieces
                     .find(fitPiece => fitPiece.slotIndex === type.slotIndex);
                  if (fitPiece) {
                     updateSlotPiece(
                        fitPiece,
                        selectedFit,
                        saveFitInfo,
                        layerPieceContainer.layerPiece,
                     );
                  }
                  else {
                     addSlotPiece(
                        selectedFit,
                        type,
                        saveFitInfo,
                        layerPieceContainer.layerPiece,
                     );
                  }
               }
            });
      }
      else {
         console.log('New Fit');
         newFit = true;
         saveFitInfo.name = selectedFit.name;
         Object.values(GARMENT_TYPES)
            .filter(type => !removedSlots[type.name])
            .forEach(type => {
               addSlotPiece(
                  selectedFit,
                  type,
                  saveFitInfo,
                  layerPieceContainer.layerPiece,
               );
            });
      }
      dispatchThunk(
         callSessionApi,
         SessionMessageType.SAVE_FIT,
         saveFitInfo,
         responsePayload => {
            dispatch(updateFit(responsePayload));
            if (newFit) {
               trackFitCreate();
            }
            closeModal();
            showNotification('Fit saved successfully!');
         },
      );
   }

   // Get a random piece by garment type
   const getRandomPiece = useCallback(
      type => {
         return getGarmentTypeRandomPiece(type, pieces);
      },
      [pieces],
   );

   // Generate a new random fit
   const generateRandomFit = useCallback(
      () => ({
         Headwear: getRandomPiece(GARMENT_TYPES.HEADWEAR.name),
         Top: getRandomPiece(GARMENT_TYPES.TOP.name),
         Bottom: getRandomPiece(GARMENT_TYPES.BOTTOM.name),
         Footwear: getRandomPiece(GARMENT_TYPES.FOOTWEAR.name),
         translation: initTranslation(),
      }),
      [getRandomPiece],
   );

   // Format `selectedFitData` correctly
   const formatFitData = useCallback(
      fitData => {
         if (isEmpty(fitData)) {
            setLayerPieceContainer({});
            return generateRandomFit();
         }
         layerPieceContainer.layerPiece =
            fitData.fitPieces?.[1]?.layerPiece || null;
         console.log('LayerPiece', layerPieceContainer.layerPiece);
         setLayerPieceContainer(layerPieceContainer);
         const formattedFitData = {};
         formattedFitData.name = fitData.name;
         formattedFitData.translation = initTranslation();
         fitData.fitPieces.forEach(fitPiece => {
            const garmentName = getGarmentName(fitPiece.slotIndex);
            formattedFitData[garmentName] = fitPiece.piece;
         });
         return formattedFitData;
      },
      [generateRandomFit, layerPieceContainer],
   );
   // Remove a slot
   const removeSlot = useCallback(slot => {
      setRemovedSlots(prevState => ({...prevState, [slot]: true}));
   }, []);

   const updateLocked = useCallback(
      (locked, slot) => {
         console.log('Update locked', locked, slot);
         lockedSlots[slot] = locked;
      },
      [lockedSlots],
   );

   useRenderTracker('FitStylist');
   if (selectedFit === null || fitInfo === null) {
      console.log('FitStylist is not visible, skip rendering');
      return null;
   }

   function updateExistingFitName(newName) {
      dispatchThunk(
         callSessionApi,
         SessionMessageType.UPDATE_FIT_NAME,
         {
            id: fitInfo.id,
            fieldMap: {name: newName},
         },
         responsePayload => {
            dispatch(updateFitName({id: fitInfo.id, name: newName}));
            trackFitView(fitInfo.id, newName);
         },
      );
   }

   function saveFitName(newName) {
      console.log('Save FitName', newName);
      if (fitInfo?.id) {
         updateExistingFitName(newName);
      }
      selectedFit.name = newName;
   }

   function setFitName(newName) {
      selectedFit.name = newName;
   }

   return (
      <SafeAreaView edges={Platform.OS === 'android' ? ['top', 'bottom'] : ['bottom']}
                    style={[
                       styles.container,
                    ]}>
         <View style={styles.header}>
            <IconButton
               icon="arrow-left"
               size={28}
               onPress={() => closeModal()}
            />
            <Text style={styles.title}>Fit Stylist</Text>
            <View style={{width: 24}}/>
         </View>
         <View
            style={{
               flexDirection: 'row',
               alignItems: 'center',
               marginBottom: 10,
            }}>
            <View style={{flex: 1}}>
               <EditableLabelInput
                  value={fitInfo.name}
                  onChangeText={setFitName}
                  onSave={newName => {
                     saveFitName(newName); // trigger re-render if needed
                  }}
               />
            </View>
            {isMyCloset && fitInfo?.id && (
               <IconButton
                  icon="trash-can"
                  size={32}
                  onPress={deleteFit}
                  style={{marginRight: -10, marginTop: -3}}
               />
            )}
         </View>
         {/* Fit Slots */}
         <View style={styles.fitContainer}>
            {!removedSlots[GARMENT_TYPES.HEADWEAR.name] && (
               <FitSlot
                  marginBotton={-10}
                  slot={GARMENT_TYPES.HEADWEAR.name}
                  fitData={selectedFit}
                  onRemove={() => removeSlot(GARMENT_TYPES.HEADWEAR.name)}
                  onLockChange={locked =>
                     updateLocked(locked, GARMENT_TYPES.HEADWEAR.name)
                  }
               />
            )}
            {!removedSlots[GARMENT_TYPES.TOP.name] && (
               <FitSlot
                  marginBotton={-20}
                  slot={GARMENT_TYPES.TOP.name}
                  fitData={selectedFit}
                  layerPieceContainer={layerPieceContainer}
                  onRemove={() => removeSlot(GARMENT_TYPES.TOP.name)}
                  onLockChange={locked =>
                     updateLocked(locked, GARMENT_TYPES.TOP.name)
                  }
               />
            )}
            {!removedSlots[GARMENT_TYPES.BOTTOM.name] && (
               <FitSlot
                  marginTop={-20}
                  slot={GARMENT_TYPES.BOTTOM.name}
                  fitData={selectedFit}
                  onRemove={() => removeSlot(GARMENT_TYPES.BOTTOM.name)}
                  onLockChange={locked =>
                     updateLocked(locked, GARMENT_TYPES.BOTTOM.name)
                  }
               />
            )}
            {!removedSlots[GARMENT_TYPES.FOOTWEAR.name] && (
               <FitSlot
                  marginTop={-10}
                  slot={GARMENT_TYPES.FOOTWEAR.name}
                  fitData={selectedFit}
                  onRemove={() => removeSlot(GARMENT_TYPES.FOOTWEAR.name)}
                  onLockChange={locked =>
                     updateLocked(locked, GARMENT_TYPES.FOOTWEAR.name)
                  }
               />
            )}
         </View>

         {/* Bottom Buttons */}
         <View style={[styles.buttonContainer, {paddingBottom: insets.bottom}]}>
            <Button
               mode="outlined"
               onPress={() => refreshFit()}
               style={styles.refreshButton}>
               Refresh Fit
            </Button>
            {isMyCloset && (<Button
               mode="contained"
               onPress={() => saveFit()}
               style={styles.saveButton}>
               Save Fit
            </Button>)}
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 15,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   fitName: {
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center',
      paddingTop: 15,
   },
   fitContainer: {
      flex: 1,
      paddingTop: 15,
      justifyContent: 'flex-start',
      alignItems: 'center',
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 15,
      backgroundColor: 'white',
   },
   refreshButton: {
      flex: 1,
      marginRight: 10,
   },
   saveButton: {
      flex: 1,
   },
});

export default React.memo(FitStylist);
