import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {TextInput, HelperText, Button, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {isEmpty} from '../utils/utils';

const PhoneInput = ({onSubmit, onSubmitPhone, phoneData = {}}) => {
  const countryCodes = useSelector(state => state.auth.countryCodes);
  const defaultCode = countryCodes.find(
    country =>
      country?.phoneCode === phoneData.countryCode || country?.code === 'US',
  );
  const [phone, setPhone] = useState(phoneData.phone || '');
  const [selectedCountry, setSelectedCountry] = useState(defaultCode);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Function to validate phone number format
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
      {/* Phone Input Row */}
      <View style={styles.inputContainer}>
        {/* Country Code Box */}
        <TouchableOpacity
          style={styles.countryCodeBox}
          onPress={() => setModalVisible(true)}>
          {selectedCountry.code && (
            <Image
              source={{
                uri: `https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`, // Uses flag emoji CDN
              }}
              style={styles.flagIcon}
            />
          )}
          <Text style={styles.countryCodeText}>
            {selectedCountry.phoneCode}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
        </TouchableOpacity>

        {/* Phone Number Input */}
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

      {/* Error Message */}
      {error ? <HelperText type="error">{error}</HelperText> : null}

      {/* Submit Button */}
      <Button mode="contained" onPress={handleSubmit} style={{marginTop: 10}}>
        Submit
      </Button>

      {/* Country Code Picker Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={countryCodes}
              keyExtractor={item => item.code}
              renderItem={({item}) => (
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
