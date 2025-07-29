import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import CommonHeader from '../../components/CommonHeader';
import COLORS from '../../const/colors';
import { navigate } from '../../navigation/navigationService';

interface ChooseCategoryProps {
  navigation: any;
}

type ClothingCategory = 'menswear' | 'womenswear' | 'unisex';

const ChooseCategory: React.FC<ChooseCategoryProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('menswear');

  const handleContinue = () => {
    navigate('Profile')
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    navigate('Profile')
  };

  const renderOption = (category: ClothingCategory, title: string) => (
    <TouchableOpacity
      style={[
        styles.optionRow,
        selectedCategory === category && styles.selectedOption
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.optionText,
        selectedCategory === category && styles.selectedOptionText
      ]}>
        {title}
      </Text>
      <View style={[
        styles.radioButton,
        selectedCategory === category && styles.selectedRadio
      ]}>
        {selectedCategory === category && (
          <View style={styles.radioInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title="What do you wear?"
        subtitle="You can always change this later in settings"
        onBackPress={handleBackPress}
        headerStyle="simple"
      />

      <View style={styles.content}>
        <View style={styles.optionsContainer}>
          {renderOption('menswear', 'Menswear')}
          {renderOption('womenswear', 'Womenswear')}
          {renderOption('unisex', 'Unisex')}
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
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden', borderColor:COLORS.grayBackground,
    borderWidth:0.8
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius:15, marginTop:4,padding:15,
    width:'97%',
    alignSelf:'center'
  },
  selectedOption: {
    backgroundColor: '#F8F8F8',
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'SFPRODISPLAYBOLD',
    color: COLORS.grayInactive,
  },
  selectedOptionText: {
    fontFamily: 'SFPRODISPLAYBOLD',
    fontSize: 18,
    color: COLORS.Black,

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
    marginBottom: 16,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipButtonText: {
    color: COLORS.grayInactive,
    fontSize: 16,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
});

export default ChooseCategory;
