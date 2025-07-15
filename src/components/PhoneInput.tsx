import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { TextInput, HelperText, Button, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PhoneInput = ({ onSubmit, onSubmitPhone, phoneData = {} }) => {
  
  const countryCodes = useSelector((state: any) => state?.auth?.countryCodes || []);
  console.log('PhoneInput - countryCodes:', countryCodes);
  console.log('PhoneInput - countryCodes length:', countryCodes.length);
  
  // Fallback country codes if API fails
  const fallbackCountryCodes = [
    { code: 'US', name: 'United States', phoneCode: '+1' },
    { code: 'CA', name: 'Canada', phoneCode: '+1' },
    { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
    { code: 'AU', name: 'Australia', phoneCode: '+61' },
    { code: 'IN', name: 'India', phoneCode: '+91' },
  ];
  
  const displayCountryCodes = countryCodes.length > 0 ? countryCodes : fallbackCountryCodes;
  
  const defaultCode = displayCountryCodes.find(
    (country: any) =>
      country?.phoneCode === (phoneData as any)?.countryCode || country?.code === 'US',
  );
  console.log('PhoneInput - defaultCode:', defaultCode);

  const [phone, setPhone] = useState((phoneData as any)?.phone || '');
  const [selectedCountry, setSelectedCountry] = useState(defaultCode);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const validatePhoneNumber = phone => /^[0-9]{7,15}$/.test(phone);

  const handleSubmit = () => {
    if (!selectedCountry) {
      setError('Country code is required');
      return;
    }
    if (!phone) {
      setError('Phone number is required');
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setError('Invalid phone number format');
      return;
    }
    setError('');
    if (onSubmitPhone) {
      onSubmitPhone(selectedCountry.phoneCode, phone);
    }
    if (onSubmit) {
      onSubmit(`${selectedCountry.phoneCode}${phone}`);
    }
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countryCodeBox}
          onPress={() => setModalVisible(true)}>
          {selectedCountry?.code && (
            <Image
              source={{
                uri: `https://flagcdn.com/w40/${selectedCountry?.code.toLowerCase()}.png`,
              }}
              style={styles.flagIcon}
            />
          )}
          <Text style={styles.countryCodeText}>
            {selectedCountry?.phoneCode}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
        </TouchableOpacity>
        <TextInput
          style={styles.phoneInput}
          mode="outlined"
          label="Phone"
          value={phone}
          onChangeText={text => {
            setPhone(text);
            if (error) setError('');
          }}
          keyboardType="phone-pad"
          autoCorrect={false}
          error={!!error}
        />
      </View>
      {error ? <HelperText type="error">{error}</HelperText> : null}
      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 10 }}>
        Submit
      </Button>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={displayCountryCodes}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setSelectedCountry(item);
                    setModalVisible(false);
                  }}>
                  <View style={styles.optionRow}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`,
                      }}
                      style={styles.flagIcon}
                    />
                    <Text
                      style={styles.optionText}>{`${item.name} (${item.phoneCode})`}</Text>
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
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 5,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  flagIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderRadius: 5,
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
