import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, ScrollView, StyleSheet, TouchableOpacity, View, Image, Dimensions, Platform} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import DropdownPicker from '../components/DropdownPicker';
import {GARMENT_TYPES, LAYER_TYPES, SessionMessageType} from '../utils/enums';
import {
    callSessionApi,
    removePiece, selectPieceById,
    selectPieceTags,
    togglePieceFavorite,
    updatePieceGarmentLayerType,
    updatePieceGarmentType,
    updatePieces,
    updatePieceTag,
} from '../redux/features/sessionSlice';
import {dispatchThunk} from '../utils/reduxUtils';
import {useRenderTracker} from '../utils/debugUtils';
import EditTag from './EditTag';
import {useAppContext} from "../navigation/AppContext";
import {navigate} from "../navigation/navigationService";
import {selectMyCloset, selectPublicCloset} from "../utils/selectors";
import logo from '../assets/images/poshmark-logo.png';
import {handleResellOnPoshmark} from "../utils/poshmarkUtils";
import {SafeAreaView} from "react-native-safe-area-context";

const PieceDetail = ({route, navigation}) => {
    const dispatch = useDispatch();
    const {updateAppState} = useAppContext();
    const isMyCloset = useSelector(selectMyCloset);
    const editTagRef = useRef(null);
    const {pieceId} = route.params;
    useSelector(state => state.session.authInfo.pmResellerSdkKey);
    const pieceInfo = useSelector(state => selectPieceById(state, pieceId));
    const [favorite, setFavorite] = useState(pieceInfo?.favorite);
    const [garmentType, setGarmentType] = useState(pieceInfo?.garmentType);
    const [garmentLayerType, setGarmentLayerType] = useState(pieceInfo?.garmentLayerType);
    const [tags, setTags] = useState(pieceInfo?.tags || []);

    function updateTagInfo(tagInfo) {
        dispatchThunk(
            callSessionApi,
            SessionMessageType.SAVE_PIECE_TAG,
            {
                pieceTagId: tagInfo.id,
                description: tagInfo.description,
            },
            response => {
                dispatch(
                    updatePieceTag({
                        pieceId: pieceInfo.id,
                        tagId: tagInfo.id,
                        description: tagInfo.description,
                    }),
                );
                setTags(selectPieceTags(pieceInfo.id));
            },
        );
    }

    function editTag(tag) {
        if (isMyCloset) {
            editTagRef.current.open(tag, pieceInfo.id, updateTagInfo);
        }
    }

    const handleToggleFavorite = () => {
        setFavorite(!favorite);
        dispatchThunk(
            callSessionApi,
            SessionMessageType.TOGGLE_PIECE_FAVORITE,
            {pieceId: pieceInfo.id},
            response => {
                dispatch(togglePieceFavorite({pieceId: pieceInfo.id}));
            }
        );
    };

    const confirmDelete = handleDelete => {
        Alert.alert(
            'Delete this piece, Confirm?',
            'You cannot undo this action',
            [
                {text: 'Keep', style: 'cancel', onPress: () => handleDelete(false)},
                {text: 'Delete', style: 'destructive', onPress: () => handleDelete(true)},
            ],
            {cancelable: true},
        );
    };

    const handleDeletePiece = () => {
        confirmDelete(value => {
            if (value) {
                dispatchThunk(
                    callSessionApi,
                    SessionMessageType.ARCHIVE_PIECE,
                    {pieceId: pieceInfo.id},
                    response => {
                        dispatch(removePiece({pieceId: pieceInfo.id}));
                        goBack();
                    }
                );
            }
        });
    };

    const handleTagPiece = () => {
        dispatchThunk(
            callSessionApi,
            SessionMessageType.TAG_PIECE,
            {
                pieceId: pieceInfo.id,
                apiToken: '',
            },
            response => {
                dispatch(updatePieces([response]));
            },
            onError => {
                Alert.alert('Failed to tag piece:', onError.message);
            }
        );
    };

    const updateGarmentType = type => {
        setGarmentType(type);
        const payload = {pieceId: pieceInfo.id, garmentType: type};
        dispatchThunk(
            callSessionApi,
            SessionMessageType.SAVE_GARMENT_TYPE,
            payload,
            () => dispatch(updatePieceGarmentType(payload))
        );
    };

    const updateGarmentLayerType = type => {
        setGarmentLayerType(type);
        const payload = {pieceId: pieceInfo.id, garmentLayerType: type};
        dispatchThunk(
            callSessionApi,
            SessionMessageType.SAVE_PIECE_LAYER,
            payload,
            () => dispatch(updatePieceGarmentLayerType(payload))
        );
    };

    const goBack = () => navigation.goBack();

    const handleCreateFit = () => {
        updateAppState({onCreateFitPiece: pieceInfo});
        navigate('FitStylist');
    };

    const resellOnPoshmark = () => {
        console.log('Resell on Poshmark tapped');
        // TODO: Implement actual integration
        handleResellOnPoshmark(pieceInfo)
    };

    useRenderTracker('PieceDetail');

    useEffect(() => {
        if (pieceInfo) {
            setFavorite(pieceInfo.favorite);
            setGarmentType(pieceInfo.garmentType);
            setGarmentLayerType(pieceInfo.garmentLayerType);
            setTags(pieceInfo.tags || []);
        }
    }, [pieceInfo]);

    return (
        <SafeAreaView style={styles.container} edges={Platform.OS === 'android' ? ['top', 'bottom'] : ['bottom']}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={28} onPress={goBack}/>
                <Text numberOfLines={1} style={styles.title}>{pieceInfo.name}</Text>
            </View>

            <View style={styles.imageContainer}>
                <FastImage
                    source={{
                        uri: pieceInfo.imageUrl,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable
                    }}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.contain}
                />
                {isMyCloset && (
                    <View style={styles.iconColumn}>
                        <IconButton icon={favorite ? 'heart' : 'heart-outline'}
                                    iconColor={favorite ? 'pink' : undefined} size={32} onPress={handleToggleFavorite}/>
                        <IconButton icon="trash-can" size={32} onPress={handleDeletePiece}/>
                        {!pieceInfo.tagged && <IconButton icon="tag" size={32} onPress={handleTagPiece}/>}
                    </View>
                )}

                {/* Resell Button */}
                {isMyCloset && (
                    <TouchableOpacity onPress={resellOnPoshmark} style={styles.resellButton}>
                        <Text style={styles.resellText}>Resell on</Text>
                        <Image source={logo} style={styles.resellIcon}
                               resizeMode="contain"/>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <DropdownPicker label="Garment Type" value={garmentType} options={Object.values(GARMENT_TYPES)}
                                onSelect={updateGarmentType}/>

                {garmentType === GARMENT_TYPES.TOP.name && (
                    <DropdownPicker label="Layer Type" value={LAYER_TYPES[garmentLayerType].label}
                                    options={Object.values(LAYER_TYPES)} onSelect={updateGarmentLayerType}/>
                )}

                {tags.filter(tag => tag.display).sort((a, b) => a.displayOrder - b.displayOrder).map((tag, index) => (
                    <TouchableOpacity key={index} style={styles.tagContainer} onPress={() => editTag(tag)}>
                        <Text style={styles.tagLabel}>{tag.label}</Text>
                        <View style={styles.tagValueContainer}>
                            <Text style={styles.tagValue}>{tag.description}</Text>
                            <IconButton icon="chevron-right" size={20}/>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleCreateFit} style={styles.createButton}
                        labelStyle={styles.createButtonText}>
                    Create a Fit
                </Button>
            </View>
            <EditTag ref={editTagRef}/>
        </SafeAreaView>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: 'white'},
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    title: {flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginHorizontal: 10},
    imageContainer: {position: 'relative', alignItems: 'center'},
    image: {width: '100%', height: 300, maxWidth: 270, marginBottom: 0},
    iconColumn: {position: 'absolute', top: 10, right: 10, zIndex: 2},
    content: {paddingHorizontal: 15, paddingBottom: 20},
    tagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    tagLabel: {fontSize: 16, fontWeight: 'bold'},
    tagValueContainer: {flexDirection: 'row', alignItems: 'center'},
    tagValue: {fontSize: 16, color: '#555'},
    buttonContainer: {alignItems: 'center', paddingHorizontal: 15},
    createButton: {width: '100%', borderRadius: 5},
    createButtonText: {fontSize: 16, fontWeight: 'bold'},
    resellButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7F0353',
        borderRadius: 3,
        width: screenWidth - 40,
        paddingVertical:5,
    },
    resellIcon: {
        height: 32,
        width: 200,
        marginRight: 8,
    },
    resellText: {
        color: '#FCFBFB',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default PieceDetail;
