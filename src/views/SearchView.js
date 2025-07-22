import React, {useState} from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {dispatchThunk} from "../utils/reduxUtils";
import {callSessionApi, switchToPublicCloset} from "../redux/features/sessionSlice";
import {SessionMessageType} from "../utils/enums";
import {hydrateClosetInfo} from "../utils/closetUtils";
import {navigate} from "../navigation/navigationService";
import {useDispatch} from "react-redux";

const SearchView = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const fetchSuggestions = async (text) => {
        setQuery(text);
        if (text.length < 2) {
            setSuggestions([]);
            return;
        }

        dispatchThunk(callSessionApi,
            SessionMessageType.LOOKUP_USERS,
            {inputText: text},
            successResponse => {
                setSuggestions(successResponse || []);
            },
            errorResponse => {
                Alert.alert('Error fetching suggestions', errorResponse);
                setSuggestions([]);
            });
    };

    const handleSelect = (item) => {
        console.info('Selected item:', item);
        setQuery(item);
        setSuggestions([]);
        dispatchThunk(
            callSessionApi,
            SessionMessageType.PUBLIC_CLOSET,
            {userHandle: item},
            successResponse => {
                // Handle successful selection
                const closetInfo = hydrateClosetInfo(successResponse);
                closetInfo.publicCloset= true;
                dispatch(switchToPublicCloset({username:item, closet:closetInfo}));
                navigate('Closet');
            },
            errorResponse => {
                Alert.alert('Error selecting user', errorResponse);
            }
        );
        // Handle selection logic here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Enter username</Text>
            <View style={styles.inputWrapper}>
                <Icon name="magnify" size={22} color="#666" style={styles.icon}/>
                <Autocomplete
                    data={suggestions}
                    value={query}
                    onChangeText={fetchSuggestions}
                    placeholder="Start typing username ..."
                    inputContainerStyle={styles.inputContainer}
                    listStyle={styles.listStyle}
                    containerStyle={styles.autocompleteContainer}
                    flatListProps={{
                        keyExtractor: (_, idx) => idx.toString(),
                        renderItem: ({item}) => (
                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                                <Text style={styles.itemText}>{item}</Text>
                            </TouchableOpacity>
                        ),
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 10,
        zIndex: 2,
    },
    autocompleteContainer: {
        flex: 1,
        zIndex: 1,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 40,
        backgroundColor: '#f9f9f9',
        elevation: 2,
    },
    listStyle: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginTop: 5,
        elevation: 2,
        backgroundColor: '#fff',
    },
    item: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 16,
    },
});

export default SearchView;
