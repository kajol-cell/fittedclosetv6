// ClosetView.js
import React, {useCallback, useEffect, useRef, useState} from 'react';
import 'react-native-pager-view';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PiecesView from './closet/PiecesView';
import FitsView from './closet/FitsView';
import CollectionsView from './closet/CollectionsView';
import {Text, Alert, View, TouchableOpacity, StyleSheet} from 'react-native';
import {ScreenType} from '../utils/enums';
import {fetchCloset} from '../redux/features/sessionSlice';
import {useDispatch, useSelector} from 'react-redux';
import LoadingWrapper from '../components/LoadingWrapper';
import {resetCloset} from '../redux/features/sessionSlice';
import {selectPublicCloset} from "../utils/selectors";


const Tab = createMaterialTopTabNavigator();

const ClosetView = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const isPublicCloset = useSelector(selectPublicCloset);
    const closetUsername = useSelector( state => state.session.closetUsername);
    const isAuthenticated = useSelector(state => state.session.isAuthenticated);
    const closet = useSelector(state => state.session.closet);

    // Create ref to expose methods from FitsView
    const fitsViewRef = useRef();

    useEffect(() => {
        const getCloset = async () => {
            console.log('Getting Closet');
            try {
                await dispatch(fetchCloset({})).unwrap();
            } catch (err) {
                Alert.alert('Error getting closet', err);
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated) {
            if (!closet) {
                getCloset();
            } else {
                setLoading(false);
            }
        }
    }, [isAuthenticated, dispatch, closet]);

    return (
        <View style={{flex: 1}}>
            <LoadingWrapper
                loading={loading}
                content={
                    <Tab.Navigator
                        initialRouteName="Pieces"
                        screenOptions={({route}) => ({
                            tabBarLabel: ({focused}) => (
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: focused ? 'bold' : 'normal',
                                        color: focused ? '#333' : 'gray',
                                    }}>
                                    {route.name === ScreenType.PIECES
                                        ? 'Pieces'
                                        : route.name === ScreenType.FITS
                                            ? 'Fits'
                                            : 'Collections'}
                                </Text>
                            ),
                            tabBarStyle: {backgroundColor: 'white'},
                        })}>
                        <Tab.Screen
                            name={ScreenType.PIECES}
                            component={PiecesView}
                        />
                        <Tab.Screen
                            name={ScreenType.FITS}
                            component={FitsView}
                        />
                        <Tab.Screen
                            name={ScreenType.COLLECTIONS}
                            component={CollectionsView}
                        />
                    </Tab.Navigator>
                }
            />
            {/* Floating Banner */}
            {isPublicCloset && (
                <View style={styles.banner}>
                    <Text style={styles.at}>@</Text>
                    <Text style={styles.bannerText}>{closetUsername}’s Closet</Text>
                    <TouchableOpacity onPress={() => dispatch(resetCloset())}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        bottom: 55,
        right: 16,
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    at: {
        color: 'white',
        marginRight: 2,
        fontSize: 24,
    },
    bannerText: {
        color: 'white',
        marginRight: 10,
        fontSize: 16,
    },
    closeIcon: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ClosetView;
