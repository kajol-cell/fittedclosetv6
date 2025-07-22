import React from 'react';
import {TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRenderTracker} from '../utils/debugUtils';
import {shallowEqual, useSelector} from 'react-redux';
import ThemeStyle from '../const/ThemeStyle';
import COLORS from '../const/colors';
import {Text} from 'react-native-paper';

/**
 * AddPiece Component
 * - Displays an add button with the same size as a piece
 * - Calls `onPress` when tapped
 */
const AddPiece = ({onAddPiece, onUpgrade}) => {
  const isEntitled = useSelector(state => state.session.isEntitled);
  const numFreePieces = 5; //useSelector(state => state.session.authInfo?.profile.numFreePieces);
  const pieces = useSelector(state => state.session.closet?.pieces || [], shallowEqual);
  useRenderTracker('Add Piece');
  return (isEntitled ?
      (<TouchableOpacity onPress={onAddPiece} style={styles.container}>
          <View style={styles.innerContainer}>
            <Icon name="add" size={40} color="gray"/>
            <Text style={[ThemeStyle.Font16, styles.addPieceTextThree]}>Add Piece</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            {(pieces.length >= numFreePieces && pieces.length >= 1) ? (
              <TouchableOpacity
                style={[styles.upgradeWrapper, {marginBottom: 5}]}
                onPress={onUpgrade}
              >
                <Text style={[ThemeStyle.body5, ThemeStyle.FontWeight700]}>
                  Upgrade
                </Text>
                <Image
                  source={require('../assets/images/blackThunder.png')}
                  style={styles.upgradeBtnIMG}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onAddPiece} style={[styles.innerContainer, {marginBottom: 5}]}>
                <Icon name="add" size={40} color="gray"/>
                <Text style={[ThemeStyle.Font16, styles.addPieceTextThree]}>Add Piece</Text>
              </TouchableOpacity>
            )}
            <Text style={{fontSize : 14, color: COLORS.ShadowDarkest}}>
              {pieces?.length}/{numFreePieces} Free pieces
            </Text>
          </View>
        </View>)
  );
};

const styles = StyleSheet.create({
  container: {
    width: 115, // Same as Piece component
    height: 115, // Same as Piece component
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPieceTextThree: {color: COLORS.ShadowDarkest, fontWeight: '600'},
  upgradeWrapper: {
    backgroundColor: COLORS.btnColor,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  upgradeBtnIMG: {width: 12, height: 16, marginLeft: 5},
});

function areEqual(prevProps, nextProps) {
  return true; // Always return true so this component never re-renders
}

export default React.memo(AddPiece, areEqual);
