import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import {useSelector} from "react-redux";
import {selectMyCloset} from "../utils/selectors";

const DropdownPicker = ({label, value, options, onSelect}) => {
  const [visible, setVisible] = useState(false);
  const isMyCloset = useSelector(selectMyCloset);

  return (
    <>
      {/* Display the selected value with label */}
      <TouchableOpacity
        style={styles.container}
        onPress={() => setVisible(isMyCloset)}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        <IconButton icon="chevron-down" size={20} style={styles.icon} />
      </TouchableOpacity>

      {/* Modal for selecting an option */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={item => item.name}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.name);
                    setVisible(false);
                  }}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2, // Reduced height
    paddingHorizontal: 0, // Remove extra padding on sides
    marginHorizontal: 0, // Adjust to align with screen edges
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#555',
    textAlign: 'right',
  },
  icon: {
    marginLeft: 5, // Adjust icon spacing
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '50%',
  },
  option: {
    paddingVertical: 10, // Compact options
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default DropdownPicker;
