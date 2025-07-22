import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {Button} from 'react-native-paper';
import Fit from '../../components/Fit';
import {useRenderTracker} from '../../utils/debugUtils';
import {useNavigation} from '@react-navigation/native'; // Import FitStylist modal

const FitsView = () => {
    useRenderTracker('FitView');
    const navigation = useNavigation();
    const fits = useSelector(state => state.session.closet?.fits, shallowEqual);
    const isLoading = useSelector(state => state.session.isLoading);

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="blue"/>
            </View>
        );
    }

    if (!fits) {
        return null;
    }

    const handleFitPress = (fit) => {
        navigation.navigate('FitStylist', {
            mode: 'edit',
            fitInfo: fit,
        });
    };

    const handleCreateFit = () => {
        navigation.navigate('FitStylist', {
            mode: 'create',
            fitInfo: {},
        });
    };

    const renderItem = ({item}) => {
        
        return <Fit onPress={handleFitPress} fitInfo={item}/>;
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={fits}
                renderItem={renderItem}
                keyExtractor={(item, index) => `fit-${item.id}`}
                numColumns={3}
                contentContainerStyle={styles.listContainer}
            />

            {/* Fixed Create Fit Button at the Bottom */}

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => handleCreateFit()}
                    style={styles.addButton}
                    labelStyle={styles.addButtonText}>
                    Create Fit
                </Button>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 70, // Prevent content from being hidden behind button
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    addButton: {
        width: '90%',
        borderRadius: 5,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default React.memo(FitsView);
