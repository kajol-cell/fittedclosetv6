// PiecesView.js
import React, {useRef, useState} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text, IconButton, Snackbar, Button} from 'react-native-paper';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import Piece from '../../components/Piece';
import AddPiece from '../../components/AddPiece';
import {showNotification} from '../../firebase/NotificationUtil';
import {
    callSessionApi,
    markPieceAsInCloset,
} from '../../redux/features/sessionSlice';
import {SessionMessageType} from '../../utils/enums';
import {dispatchThunk} from '../../utils/reduxUtils';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {selectMyCloset} from '../../utils/selectors';
import {trackSubscriptionModalOpen} from '../../lib/analytics';

const FILTER_CATEGORIES = ['Favorite', 'Category', 'Type', 'Color', 'Brand', 'Price'];

function markPieceInCloset(piece, dispatch) {
    dispatchThunk(
        callSessionApi,
        SessionMessageType.MARK_PIECE_AS_IN_CLOSET,
        {pieceId: piece.id},
        responsePayload => dispatch(markPieceAsInCloset(piece.id)),
    );
}

const PiecesView = ({route}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const pieces = useSelector(state => state.session.closet?.pieces || [], shallowEqual);
    const isMyCloset = useSelector(selectMyCloset);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [filterSelections, setFilterSelections] = useState({});
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [modalTop, setModalTop] = useState(150);
    const badgeRefs = useRef({});
    const scrollViewRef = useRef(null);
    const handlePiecePress = piece => {
        if (piece.newPiece) {
            showNotification('Piece tagging in progress');
        } else {
            navigation.navigate('PieceDetail', {
                pieceId: piece.id,
            });
            if (!piece.inCloset) {markPieceInCloset(piece, dispatch);}
        }
    };

    const handleAddPiece = () => navigation.navigate('UploadPieceImage');
    const handleUpgrade = () => {
        trackSubscriptionModalOpen();
        navigation.navigate('RevenueCat');
    };

    const getUniqueTagDescriptions = tagName => {
        const values = pieces.flatMap(p =>
            p.tags?.filter(t => t.name === tagName).map(t => t.description),
        );
        return [...new Set(values)].filter(Boolean).sort();
    };

    const getGarmentTypes = () => [
        ...new Set(pieces.map(p => p.garmentType).filter(Boolean)),
    ];

    const getPriceRanges = () => {
        const prices = pieces
            .flatMap(p => {
                const tag = p.tags?.find(t => t.name === 'Estimated Resale Price');
                return tag ? parseFloat(tag.description.replace(/[^\d.]/g, '')) : null;
            })
            .filter(p => p != null);
        if (!prices.length) {return [];}
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;
        const step = range / 3 || 1;
        return [
            {
                label: `$ (${prices.filter(p => p >= min && p < min + step).length})`,
                min,
                max: min + step,
            },
            {
                label: `$$ (${prices.filter(p => p >= min + step && p < min + 2 * step).length})`,
                min: min + step,
                max: min + 2 * step,
            },
            {
                label: `$$$ (${prices.filter(p => p >= min + 2 * step && p <= max).length})`,
                min: min + 2 * step,
                max: max + 1,
            },
        ];
    };

    const getFilterOptions = () => {
        if (selectedFilter === 'Category') {return getGarmentTypes();}
        if (selectedFilter === 'Type') {return getUniqueTagDescriptions('Type');}
        if (selectedFilter === 'Color') {return getUniqueTagDescriptions('Color');}
        if (selectedFilter === 'Brand') {return getUniqueTagDescriptions('Brand');}
        if (selectedFilter === 'Price') {return getPriceRanges();}
        return [];
    };

    const handleFilterBadgePress = category => {
        if (category === 'Favorite') {
            setFilterSelections(prev => ({...prev, Favorite: !prev.Favorite}));
        } else {
            const badgeRef = badgeRefs.current[category];
            if (badgeRef) {
                badgeRef.measure((x, y, width, height, pageX, pageY) => {
                    const screenWidth = Dimensions.get('window').width;
                    const scrollToX = Math.max(0, pageX + width / 2 - screenWidth / 2);
                    scrollViewRef.current.scrollTo({x: scrollToX, animated: true});
                    setModalTop(pageY + height + 10);
                });
            }
            setSelectedFilter(category);
            setFilterModalVisible(true);
        }
    };

    const isPieceVisible = piece => {
        const {Favorite, Category, Type, Color, Brand, Price} = filterSelections;
        if (Favorite && !piece.favorite) {return false;}
        if (Category?.length && !Category.includes(piece.garmentType)) {return false;}
        if (Type?.length && !piece.tags?.some(t => t.name === 'Type' && Type.includes(t.description))) {return false;}
        if (Color?.length && !piece.tags?.some(t => t.name === 'Color' && Color.includes(t.description))) {return false;}
        if (Brand?.length && !piece.tags?.some(t => t.name === 'Brand' && Brand.includes(t.description))) {return false;}
        if (Price?.length) {
            const priceTag = piece.tags?.find(t => t.name === 'Estimated Resale Price');
            const price = priceTag ? parseFloat(priceTag.description.replace(/[^\d.]/g, '')) : null;
            if (price == null || !Price.some(range => price >= range.min && price < range.max)) {return false;}
        }
        return true;
    };

    const filteredPieceIds = isMyCloset ? [0, ...pieces.filter(isPieceVisible).map(p => p.id)]
        : pieces.filter(isPieceVisible).map(p => p.id);

    const getActiveFilterLabels = () => {
        const result = [];
        if (filterSelections.Favorite) {result.push('Favorite');}
        for (const key of ['Category', 'Type', 'Color', 'Brand', 'Price']) {
            if (Array.isArray(filterSelections[key]) && filterSelections[key].length > 0) {
                const labels = filterSelections[key].map(v => (typeof v === 'string' ? v : v.label));
                result.push(...labels);
            }
        }
        return result;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterBar}
                contentContainerStyle={styles.filterBarContent}>
                {FILTER_CATEGORIES.map(cat => {
                    const hasSelection = Array.isArray(filterSelections[cat])
                        ? filterSelections[cat].length > 0
                        : !!filterSelections[cat];
                    const isActive = selectedFilter === cat && filterModalVisible;
                    return (
                        <TouchableOpacity
                            key={cat}
                            ref={ref => (badgeRefs.current[cat] = ref)}
                            style={[
                                styles.filterBadge,
                                isActive
                                    ? styles.activeFilterBadge
                                    : hasSelection
                                        ? styles.selectedFilterBadge
                                        : {},
                            ]}
                            onPress={() => handleFilterBadgePress(cat)}>
                            <Text
                                style={isActive ? styles.activeFilterText : hasSelection ? styles.selectedFilterText : styles.filterText}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            {getActiveFilterLabels().length > 0 && (<View style={styles.clearFiltersContainer}>
                    <Button
                        mode="text"
                        icon="filter-remove-outline"
                        onPress={() => {
                            setFilterSelections({});
                            setSnackbarVisible(false);
                        }}>
                        Clear Filters
                    </Button>
                </View>
            )}
            <FlatList
                data={filteredPieceIds}
                keyExtractor={item => item.toString()}
                numColumns={3}
                initialNumToRender={12}       // Render 12 items up front
                maxToRenderPerBatch={8}       // How many to render in each batch
                windowSize={10}               // How far ahead to render
                removeClippedSubviews={true}  // Unmount views outside window (good for performance)
                renderItem={({item}) =>
                    isMyCloset && item === 0 ? (
                        <AddPiece onAddPiece={handleAddPiece} onUpgrade={handleUpgrade}/>
                    ) : (
                        <Piece pieceId={item} onPress={handlePiecePress}/>
                    )
                }
            />

            <Modal visible={filterModalVisible} transparent animationType="fade">
                <View style={[styles.modalBackdrop, {paddingTop: modalTop}]}>
                    <View style={[styles.modalContainer, {maxHeight: 500}]}>
                        <View style={styles.modalHeader}>
                            <IconButton icon="filter-remove" size={28} onPress={() => {
                                setFilterSelections(prev => ({...prev, [selectedFilter]: []}));
                                setFilterModalVisible(false);
                            }}/>
                            <Text style={styles.modalTitle}>{selectedFilter}</Text>
                            <IconButton icon="check" size={28} onPress={() => setFilterModalVisible(false)}/>
                        </View>
                        <ScrollView>
                            {(getFilterOptions() || []).map(option => {
                                const label = typeof option === 'string' ? option : option.label;
                                const isSelected = (filterSelections[selectedFilter] || []).some(
                                    sel => (typeof sel === 'object' ? sel.label === label : sel === label),
                                );
                                return (
                                    <TouchableOpacity
                                        key={label}
                                        style={styles.modalOption}
                                        onPress={() => {
                                            setFilterSelections(prev => {
                                                const current = prev[selectedFilter] || [];
                                                const exists = current.some(sel =>
                                                    typeof sel === 'object' ? sel.label === label : sel === label,
                                                );
                                                const updated = exists
                                                    ? current.filter(sel =>
                                                        typeof sel === 'object' ? sel.label !== label : sel !== label,
                                                    )
                                                    : [...current, option];
                                                return {...prev, [selectedFilter]: updated};
                                            });
                                        }}>
                                        <MaterialIcon
                                            name={isSelected ? 'check-circle' : 'circle-outline'}
                                            size={24}
                                            color={isSelected ? '#007BFF' : 'gray'}
                                            style={{marginRight: 10}}
                                        />
                                        <Text style={{fontSize: 16}}>{label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Snackbar
                visible={getActiveFilterLabels().length > 0 && snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={Snackbar.DURATION_LONG}
                action={{label: 'Dismiss'}}
                style={{backgroundColor: '#333', borderRadius: 8, marginHorizontal: 5}}>
                <Text style={{color: '#fff', fontSize: 16}}>
                    {`Filters: ${getActiveFilterLabels().join(', ')}`}
                </Text>
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 10},
    filterBar: {flexGrow: 0, marginBottom: 10},
    filterBarContent: {paddingRight: 10, alignItems: 'center'},
    filterBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
    },
    activeFilterBadge: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
        borderWidth: 1,
    },
    selectedFilterBadge: {
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1,
    },
    filterText: {color: '#000', fontSize: 14},
    activeFilterText: {color: '#fff'},
    selectedFilterText: {color: '#fff'},
    modalBackdrop: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    modalTitle: {fontSize: 18, fontWeight: 'bold'},
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    clearFiltersContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
        marginRight: 5,
    },
});

export default PiecesView;
