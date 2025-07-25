import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {badgeMap} from '../utils/badgeMap';
import {useDispatch} from 'react-redux';
import {dispatchThunk} from '../utils/reduxUtils';
import {callSessionApi, updateBadgeId} from '../redux/features/sessionSlice';
import {SessionMessageType} from '../utils/enums';

const BADGE_COUNT = 12;
const badgeList = Array.from({length: BADGE_COUNT}, (_, i) => String(i + 1));

const ChangeBadgeModal = forwardRef((_, ref) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);

  useImperativeHandle(ref, () => ({
    open: badgeId => {
      setSelectedBadgeId(badgeId);
      setVisible(true);
    },
    close: () => setVisible(false),
  }));

  const handleSelectBadge = badgeId => {
    console.log('Selected badge:', badgeId);
    setSelectedBadgeId(badgeId);
    // TODO: Save badgeId to profile (stub)
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    console.log('Confirmed badge:', selectedBadgeId);
    dispatchThunk(
      callSessionApi,
      SessionMessageType.SAVE_BADGE_ID,
      {badgeId: selectedBadgeId},
      () => {
        console.log('Badge ID saved successfully');
        dispatch(updateBadgeId({badgeId: selectedBadgeId}));
      },
    );
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent={false} animationType="slide">
      <SafeAreaView style={[styles.fullScreenModal, {paddingTop: insets.top}]}>
        {/* Header with back and check icons */}
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={28} onPress={handleCancel} />
          <Text style={styles.headerTitle}>Change Badge</Text>
          <IconButton icon="check" size={28} onPress={handleConfirm} />
        </View>

        <View style={styles.contentWrapper}>
          <Text style={styles.subtitle}>Current Badge</Text>
          <Image
            source={
              badgeMap[selectedBadgeId] ||
              require('../assets/images/badge-placeholder.png')
            }
            style={styles.currentBadge}
          />

          <Text style={styles.subtitle}>Available Badges</Text>
          <FlatList
            data={badgeList}
            keyExtractor={item => item.toString()}
            numColumns={3}
            contentContainerStyle={styles.badgeGrid}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleSelectBadge(item)}
                style={styles.badgeWrapper}>
                <Image source={badgeMap[item]} style={styles.badgeImage} />
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },
  currentBadge: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  badgeGrid: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeWrapper: {
    width: 90,
    height: 90,
    margin: 8,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ChangeBadgeModal;
