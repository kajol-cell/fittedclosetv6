import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, View, StyleSheet, TextInput, ScrollView} from 'react-native';
import {Text, IconButton, Button} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const EditTag = forwardRef((_, ref) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [updateCallback, setUpdateCallback] = useState(null);
  const [tagValues, setTagValues] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [pieceId, setPieceId] = useState(null);

  useImperativeHandle(ref, () => ({
    open: (tag, pId, updateTagInfo) => {
      setCurrentTag(tag);
      setUpdateCallback(() => updateTagInfo);
      setTagValues((tag.description || '').split(' ').filter(Boolean));
      setPieceId(pId);
      setVisible(true);
    },
    close: () => closeModal(),
  }));

  function closeModal() {
    console.log('Close EditTag modal');
    setVisible(false);
    const description = tagValues.join(' ');
    if (currentTag.description === description) {
      return;
    }
    updateCallback({id: currentTag.id, description: description});
    setCurrentTag('');
    setTagValues([]);
    setNewValue('');
    setPieceId(null);
  }

  const addValue = () => {
    if (newValue.trim() !== '') {
      setTagValues(prev => [...prev, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeValue = index => {
    setTagValues(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView style={[styles.modalContainer, {paddingTop: insets.top}]}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{currentTag.label}</Text>
            <IconButton
              icon="check"
              size={32}
              onPress={closeModal}
              style={styles.closeIcon}
            />
          </View>

          {/* Tag Values */}
          <ScrollView vertical contentContainerStyle={styles.tagsContainer}>
            {tagValues.map((val, index) => (
              <View key={index} style={styles.tagBubble}>
                <Text style={styles.tagText}>{val}</Text>
                <IconButton
                  icon="close"
                  size={14}
                  style={styles.removeIcon}
                  onPress={() => removeValue(index)}
                />
              </View>
            ))}
          </ScrollView>

          {/* Input Row */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Add new value"
              value={newValue}
              onChangeText={setNewValue}
              onBlur={addValue}
              style={styles.input}
            />
            <Button mode="contained" onPress={addValue}>
              Add
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    padding: 15,
    marginTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    backgroundColor: 'transparent',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tagBubble: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 16,
  },
  removeIcon: {
    marginLeft: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    fontSize: 16,
    paddingVertical: 4,
  },
});

export default EditTag;
