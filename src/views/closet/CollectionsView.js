import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {Button} from 'react-native-paper';
import Collection from '../../components/Collection';
import {useNavigation} from "@react-navigation/native";

const CollectionsView = React.memo(() => {
  // Extract closet and loading state from Redux store
  const navigation = useNavigation();
  const fitColls = useSelector(
    state => state.session.closet?.fitColls,
    shallowEqual,
  );
  //const isLoading = useSelector(state => state.session.isLoading);

  const handleCollectionPress = collection => {
    navigation.navigate('AddEditCollection', {
      mode: 'edit',
      collection,
    });
  };

  const handleAddCollection = () => {
    navigation.navigate('AddEditCollection', {
      mode: 'create',
    });
  };

  /*
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
  */

  if (!fitColls) {
    return null; // Ensure we don't render before closet data is available
  }

  const renderItem = ({item}) => (
    <Collection onPress={handleCollectionPress} collectionInfo={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={fitColls}
        renderItem={renderItem}
        keyExtractor={(item, index) => `collection-${item.id}`}
        numColumns={3} // Ensures 3 collections per row
        contentContainerStyle={styles.listContainer}
      />

      {/* Fixed Add Collection Button at the Bottom */}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleAddCollection}
          style={styles.addButton}
          labelStyle={styles.addButtonText}>
          Create Collection
        </Button>
      </View>
    </View>
  );
});

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

export default CollectionsView;
