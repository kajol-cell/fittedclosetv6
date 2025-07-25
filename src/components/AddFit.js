import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRenderTracker} from '../utils/debugUtils';

const AddFit = ({onPress}) => {
  useRenderTracker('AddFit');
  return (
    <View style={styles.addFitContainer}>
      <TouchableOpacity onPress={onPress} style={styles.addFitButton}>
        <MaterialCommunityIcons name="plus" size={40} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addFitContainer: {
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120, // Adjust as needed to match Fit component
    width: 120, // Adjust as needed to match Fit component
  },
  addFitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default AddFit;
