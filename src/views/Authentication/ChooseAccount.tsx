import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import CommonHeader from '../../components/CommonHeader';
import COLORS from '../../const/colors';
import { navigate } from '../../navigation/navigationService';

const { width, height } = Dimensions.get('window');

interface ChooseAccountProps {
  navigation: any;
}

const ChooseAccount: React.FC<ChooseAccountProps> = ({ navigation }) => {
  const [selectedAccountType, setSelectedAccountType] = useState<'public' | 'private'>('public');

  const handleContinue = () => {
    navigate('MediaPermission')
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title="Choose your account type"
        subtitle="You can change this later in Settings"
        onBackPress={handleBackPress}
        headerStyle="simple"
      />

      <View style={styles.content}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedAccountType === 'public' && styles.selectedOption
            ]}
            onPress={() => setSelectedAccountType('public')}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <FastImage
                  source={require('../../assets/images/unlock.png')}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[
                  styles.optionTitle,
                  selectedAccountType === 'public' && styles.selectedText
                ]}>
                  Public account
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedAccountType === 'public' && styles.selectedDescription
                ]}>
                  Anyone can view your closet
                </Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  selectedAccountType === 'public' && styles.selectedRadio
                ]}>
                  {selectedAccountType === 'public' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedAccountType === 'private' && styles.selectedOption
            ]}
            onPress={() => setSelectedAccountType('private')}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <FastImage
                  source={require('../../assets/images/lock.png')}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[
                  styles.optionTitle,
                  selectedAccountType === 'private' && styles.selectedText
                ]}>
                  Private account
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedAccountType === 'private' && styles.selectedDescription
                ]}>
                  Only people you approve can view your closet
                </Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  selectedAccountType === 'private' && styles.selectedRadio
                ]}>
                  {selectedAccountType === 'private' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.Black,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding:5,
    borderWidth: 1,
    borderColor: COLORS.grayBackground,
    overflow: 'hidden',
  },
  optionCard: {
    padding: 10,
  },
  selectedOption: {
    backgroundColor: '#F8F8F8',
    borderRadius:15,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily:'SFPRODISPLAYBOLD',
    color: COLORS.grayInactive,
    marginBottom: 4,
  },
  selectedText: {
    color: COLORS.Black,
  },
  optionDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 18,
  },
  selectedDescription: {
    color: '#666',
  },
  radioContainer: {
    marginLeft: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    borderColor: COLORS.Black,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.Black,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: COLORS.Black,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChooseAccount;
