import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {TextInput, HelperText, Button, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import COLORS from '../const/colors';
import {validatePhoneNumber, formatPhoneNumber, getPhoneValidationError} from '../utils/phoneUtils';

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
      country?.phoneCode === phoneData.countryCode || country?.code === 'US',
  );
  const [phone, setPhone] = useState(phoneData.phone || '');
  const [selectedCountry, setSelectedCountry] = useState(defaultCode);
  const [internalError, setInternalError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);



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
          placeholderTextColor={COLORS.gray}
          mode='outlined'
          activeOutlineColor={COLORS.backGroundGray}
          value={phone}
          onChangeText={handlePhoneChange}
          outlineStyle={{borderRadius:15}}
          keyboardType="phone-pad"
          autoCorrect={false}
          error={!!displayError}
          disabled={disabled}
        />
      </View>

      {displayError ? <HelperText type="error">{displayError}</HelperText> : null}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={countryCodes}
              keyExtractor={item => item.code}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleCountryChange(item)}>
                  <View style={styles.optionRow}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`,
                      }}
                      style={styles.flagIcon}
                    />
                    <Text
                      style={
                        styles.optionText
                      }>{`${item.name} (${item.phoneCode})`}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
    paddingVertical: 10,
    paddingHorizontal:10,
    borderRadius:15,
    borderWidth:1,
    borderColor:COLORS.backGroundGray,
  },
  disabled: {
    opacity: 0.5,
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius:20,
    alignItems:'center', 
    justifyContent:'center',
  },
  phoneInput: {
    flex: 1,
    height: Dimensions.get('window').height * 0.06,
    marginHorizontal:10
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
    fontWeight: 'bold',
    color: 'red',
  },
});

export default PhoneInput;
