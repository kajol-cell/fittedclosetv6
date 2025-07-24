import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { TextInput, HelperText, Button, Text, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import COLORS from '../const/colors';
import { validatePhoneNumber, formatPhoneNumber, getPhoneValidationError } from '../utils/phoneUtils';

const PhoneInput = ({
  onPhoneChange,
  onCountryCodeChange,
  onValidationChange,
  phoneData = {},
  disabled = false,
  error = '',
}) => {
  const countryCodes = useSelector(state => state.auth.countryCodes);
  const defaultCode = countryCodes.find(
    country =>
      country?.phoneCode === phoneData.countryCode ||
      (country?.phoneCode === '+1' && country?.code === 'US'),
  );
  const [phone, setPhone] = useState(phoneData.phone || '');
  const [selectedCountry, setSelectedCountry] = useState(defaultCode);
  const [internalError, setInternalError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const filteredCodes = countryCodes.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );



  useEffect(() => {
    const isValid = validatePhoneNumber(phone, selectedCountry?.phoneCode);
    const formattedPhone = formatPhoneNumber(phone, selectedCountry?.phoneCode);

    if (onPhoneChange) {
      onPhoneChange(formattedPhone, selectedCountry?.phoneCode);
    }

    if (onValidationChange) {
      onValidationChange(isValid && phone.length > 0);
    }

    if (phone.length > 0) {
      const validationError = getPhoneValidationError(phone, selectedCountry?.phoneCode);
      setInternalError(validationError || '');
    } else {
      setInternalError('');
    }
  }, [phone, selectedCountry]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    if (onCountryCodeChange) {
      onCountryCodeChange(country.phoneCode, country.code);
    }
    setModalVisible(false);
  };

  const handlePhoneChange = (text) => {
    const cleanText = text.replace(/\D/g, '');
    setPhone(cleanText);
  };

  const displayError = error || internalError;

  return (
    <View>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.countryCodeBox, disabled && styles.disabled]}
          onPress={() => !disabled && setModalVisible(true)}>
          {selectedCountry?.code && (
            <Image
              source={{
                uri: `https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`,
              }}
              style={styles.flagIcon}
            />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.phoneInput}
          placeholder='765 4321'
          placeholderTextColor={COLORS.grayInactive}
          mode='outlined'
          activeOutlineColor={COLORS.grayBackground}
          value={phone}
          onChangeText={handlePhoneChange}
          outlineStyle={{ borderRadius: 15 }}
          keyboardType="phone-pad"
          autoCorrect={false}
          error={!!displayError}
          disabled={disabled}
        />
      </View>

      {displayError ? <HelperText type="error">{displayError}</HelperText> : null}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.header}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.title}>Country Code</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButtonBackground}>
                <IconButton
                  icon="close"
                  size={24}
                  style={styles.closeButton}
                />
              </TouchableOpacity>
            </View>

              <TextInput
                mode="flat"
                placeholder="Search"
                placeholderTextColor={COLORS.grayInactive}
                placeholderStyle={{ fontFamily: 'SFPRODISPLAYBOLD' }}
                style={styles.searchInput}
                left={<TextInput.Icon icon="magnify" color={COLORS.grayInactive} />}
                underlineStyle={{ backgroundColor: 'transparent' }}
                value={searchText}
                onChangeText={setSearchText}
              />

              <FlatList
                data={filteredCodes}
                keyExtractor={item => item.code}
                renderItem={({ item }) => {
                  const isSelected = selectedCountry?.code === item.code;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionRowNew,
                        isSelected && styles.selectedRow,
                      ]}
                      onPress={() => handleCountryChange(item)}>
                      <Image
                        source={{
                          uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`,
                        }}
                        style={styles.flagIcon}
                      />
                      <Text style={styles.codeText}>
                        {item.phoneCode}
                      </Text>
                      <Text style={styles.optionTextNew}>
                        {item.name}
                      </Text>
                      {isSelected && (
                        <Text style={styles.checkIcon}>✔</Text>
                      )}
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.grayBackground,
  },
  disabled: {
    opacity: 0.5,
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal:10
  },
  phoneInput: {
    flex: 1,
    marginHorizontal: 10
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'SFPRODISPLAYBOLD',
    color: 'red',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 20,
    paddingHorizontal:20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'SFPRODISPLAYBOLD',
  },
  closeButtonBackground: {
    borderRadius: 20,
    backgroundColor: '#F8F8F8'
  },
  closeButton: {
    margin: 0,
    opacity: 0.7,
    height: 30, width: 30,
  },
  searchInput: {
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 10,
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
  },
  optionRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionTextNew: {
    flex: 1,
    fontSize: 18,
    fontFamily:'SFPRODISPLAYBOLD', marginHorizontal:20
  },
  codeText: {
    fontSize: 18,
    color:COLORS.grayInactive,
    fontFamily:'SFPRODISPLAYBOLD'
  },
  checkIcon: {
    fontSize: 12,
    color: COLORS.Black,
    marginRight:10,
    backgroundColor: COLORS.Black,
    borderRadius:20,height:25,width:25,
    textAlign:'center',
    textAlignVertical:'center',
    color:'white'
  },
  selectedRow: {
    backgroundColor: '#f4f4f4',
    borderRadius:20,
  },

});

export default PhoneInput;
