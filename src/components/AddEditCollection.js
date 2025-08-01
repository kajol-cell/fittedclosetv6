import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, Modal, Platform, StyleSheet, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import EditableLabelInput from './EditableLabelInput';
import Fit from './Fit';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {dispatchThunk} from '../utils/reduxUtils';
import {callSessionApi, removeFit, updateFitColl, updateFitCollName} from '../redux/features/sessionSlice';
import {SessionMessageType} from '../utils/enums';
import {isNotEmpty} from '../utils/utils';
import {showNotification} from '../firebase/NotificationUtil';
import {extractIds} from '../utils/closetUtils';
import FitPickerItem from './FitPickerItem';
import {selectMyCloset} from '../utils/selectors';
import {trackCollectionCreate, trackCollectionView} from '../lib/analytics';

const AddEditCollection = ({route, navigation}) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const isMyCloset = useSelector(selectMyCloset);
    const allFits = useSelector(state => state.session.closet?.fits || []);
    const mode = route.params?.mode;
    const initialCollection = route.params?.collection;

    const [pickerVisible, setPickerVisible] = useState(false);
    const [collectionInfo, setCollectionInfo] = useState(null);
    const [collectionName, setCollectionName] = useState('');
    const [collectionFits, setCollectionFits] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFitIds, setSelectedFitIds] = useState(new Set());

    useEffect(() => {
        if (mode === 'edit' && initialCollection) {
            setCollectionInfo(initialCollection);
            setCollectionName(initialCollection.name);
            setCollectionFits(initialCollection.fits || []);
        } else {
            setCollectionInfo({});
            setCollectionName('');
            setCollectionFits([]);
        }
    }, [mode, initialCollection]);

    const closeModal = () => navigation.goBack();

    function saveFitColl() {
        const saveFitCollInfo = {fitIds: extractIds(collectionFits)};
        saveFitCollInfo.name = collectionName;
        let newFitColl = false;
        if (isNotEmpty(collectionInfo)) {
            console.log('Save FitColl');
            saveFitCollInfo.id = collectionInfo.id;
            saveFitCollInfo.displayOrder = collectionInfo.displayOrder;
        } else {
            console.log('New FitColl');
            newFitColl = true;
            saveFitCollInfo.displayOrder = 0;
        }
        dispatchThunk(
            callSessionApi,
            SessionMessageType.SAVE_FIT_COLL,
            saveFitCollInfo,
            responsePayload => {
                if (responsePayload) {
                    dispatch(updateFitColl(responsePayload));
                    if (newFitColl && responsePayload.id && responsePayload.name) {
                        trackCollectionCreate(responsePayload.id, responsePayload.name);
                    }
                    closeModal();
                    showNotification('Collection saved successfully!');
                } else {
                    console.warn('Response payload is null/undefined');
                    showNotification('Failed to save collection');
                }
            },
        );
    }

    const handleAddSelectedFits = () => {
        if (selectedFitIds.size === 0) {
            setPickerVisible(false);
            showNotification('No fits added');
            return;
        }
        const uniqueFits = allFits.filter(
            fit => selectedFitIds.has(fit.id) && !collectionFits.some(f => f.id === fit.id)
        );
        setCollectionFits(prev => [...prev, ...uniqueFits]);
        setSelectedFitIds(new Set());
        setPickerVisible(false);
    };

    const handleToggleSelectFit = fit => {
        setSelectedFitIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fit.id)) {
                newSet.delete(fit.id);
            } else {
                newSet.add(fit.id);
            }
            return newSet;
        });
    };

    const handleRemoveFit = fitId => {
        if (collectionFits.length === 1) {return;}
        setCollectionFits(prev => prev.filter(fit => fit.id !== fitId));
    };

    const renderFit = ({item}) => (
        <View style={styles.fitWrapper}>
            <Fit fitInfo={item} onPress={() => handleRemoveFit(item.id)}/>
            <IconButton
                icon="minus-circle"
                size={24}
                style={styles.removeIcon}
                onPress={() => handleRemoveFit(item.id)}
            />
        </View>
    );

    const renderFitPickerItem = useCallback(({ item }) => {
        return (
            <FitPickerItem
                item={item}
                isSelected={selectedFitIds.has(item.id)}
                onToggle={handleToggleSelectFit}
            />
        );
    }, [selectedFitIds]);

    const getPickerFits = () => {
        console.log('getPickerFits', pickerVisible);
        if (!pickerVisible) {
            return [];
        }
        const selectedIds = new Set(collectionFits.map(fit => fit.id));
        return allFits.filter(fit => !selectedIds.has(fit.id));
    };
    const confirmDelete = handleDelete => {
        Alert.alert(
            'Delete this collection, Confirm?',
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

    function deleteCollection() {
        console.log('Delete Collection', collectionInfo);
        confirmDelete(value => {
            if (!value) {
                return;
            }
            dispatchThunk(
                callSessionApi,
                SessionMessageType.ARCHIVE_FIT_COLLS,
                {fitCollIds: [collectionInfo.id]},
                responsePayload => {
                    closeModal();
                    dispatch(removeFit({fitCollId: collectionInfo.id}));
                    showNotification('Fit deleted successfully!');
                },
            );
        });
    }

    function updateExistingCollName(newName) {
        dispatchThunk(
            callSessionApi,
            SessionMessageType.UPDATE_FIT_NAME,
            {
                id: collectionInfo.id,
                fieldMap: {name: newName},
            },
            responsePayload => {
                dispatch(updateFitCollName({id: collectionInfo.id, name: newName}));
                trackCollectionView(collectionInfo.id, newName);
            },
        );
    }

    function saveFitCollName(newName) {
        console.log('Save FitCollName', newName);
        if (collectionInfo) {
            updateExistingCollName(newName);
        }
        setCollectionName(newName);
    }

    function setCollName(newName) {
        setCollectionName(newName);
    }

    if (collectionInfo === null) {
        return null;
    }

    function handleAddFits() {
        setSelectedFitIds(new Set());
        setPickerVisible(true);
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
                <Text style={styles.headerTitle}>
                    {isEditing ? 'Edit Collection' : 'Add Collection'}
                </Text>
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
                        value={collectionInfo?.name}
                        placeholder="Enter collection name"
                        onChangeText={setCollName}
                        onSave={saveFitCollName}
                    />
                </View>
                {collectionInfo?.id && (
                    <IconButton
                        icon="trash-can"
                        size={32}
                        onPress={deleteCollection}
                        style={{marginRight: -10, marginTop: -3}}
                    />
                )}
            </View>
            <FlatList
                data={collectionFits}
                keyExtractor={item => item.id}
                renderItem={renderFit}
                numColumns={3}
                contentContainerStyle={styles.fitsGrid}
            />

            <View style={[styles.buttonRow, {bottom: 0}]}>
                <Button
                    mode="outlined"
                    onPress={() => handleAddFits()}
                    style={styles.refreshButton}>
                    Add Fits
                </Button>
                {isMyCloset && (<Button
                    mode="contained"
                    onPress={saveFitColl}
                    style={styles.saveButton}>
                    Save Collection
                </Button>)}
            </View>

            {/* Picker Modal */}
            <Modal visible={pickerVisible} animationType="slide">
                <SafeAreaView
                    style={[
                        styles.pickerContainer,
                        {paddingTop: insets.top, paddingBottom: insets.bottom + 20},
                    ]}>
                    <Text style={styles.pickerTitle}>Choose Fits</Text>
                    <FlatList
                        data={getPickerFits()}
                        keyExtractor={item => item.id}
                        renderItem={renderFitPickerItem}
                        numColumns={3}
                        contentContainerStyle={styles.fitsGrid}
                    />
                    <View style={styles.buttonRow}>
                        <Button
                            mode="outlined"
                            onPress={() => setPickerVisible(false)}
                            style={styles.refreshButton}>
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleAddSelectedFits}
                            style={styles.saveButton}>
                            Add {selectedFitIds.size} Selected
                        </Button>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    fitsGrid: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
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
    pickerContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    fitWrapper: {
        position: 'relative',
        margin: 1,
    },
    removeIcon: {
        position: 'absolute',
        top: -15,
        right: -15,
    },
    checkboxIcon: {
        position: 'absolute',
        top: -15,
        right: -15,
    },
});

export default AddEditCollection;
