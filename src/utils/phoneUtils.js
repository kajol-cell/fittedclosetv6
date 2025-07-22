export const validatePhoneNumber = (phoneNumber, countryCode = '+1') => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return false;
    }

    switch (countryCode) {
        case '+1':
            return cleanPhone.length === 10;
        case '+44':
            return cleanPhone.length >= 10 && cleanPhone.length <= 11;
        case '+91':
            return cleanPhone.length === 10;
        case '+86':
            return cleanPhone.length === 11;
        case '+81':
            return cleanPhone.length >= 9 && cleanPhone.length <= 11;
        default:
            return cleanPhone.length >= 7 && cleanPhone.length <= 15;
    }
};

export const formatPhoneNumber = (phoneNumber, countryCode = '+1') => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    switch (countryCode) {
        case '+1':
            if (cleanPhone.length === 10) {
                return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
            }
            break;
        case '+44':
            if (cleanPhone.length === 11) {
                return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
            }
            break;
        case '+91':
            if (cleanPhone.length === 10) {
                return `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
            }
            break;
        default:
            return cleanPhone;
    }

    return cleanPhone;
};

export const cleanPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, '');
};

export const createFullPhoneNumber = (phoneNumber, countryCode) => {
    const cleanPhone = cleanPhoneNumber(phoneNumber);
    return `${countryCode}${cleanPhone}`;
};

export const parsePhoneNumber = (fullPhoneNumber) => {
    const match = fullPhoneNumber.match(/^(\+\d{1,3})(.+)$/);
    if (match) {
        return {
            countryCode: match[1],
            phoneNumber: match[2]
        };
    }
    return {
        countryCode: '+1',
        phoneNumber: fullPhoneNumber
    };
};

export const getPhoneValidationError = (phoneNumber, countryCode = '+1') => {
    const cleanPhone = cleanPhoneNumber(phoneNumber);

    if (!cleanPhone) {
        return 'Phone number is required';
    }

    if (!validatePhoneNumber(phoneNumber, countryCode)) {
        switch (countryCode) {
            case '+1':
                return 'Please enter a valid 10-digit US phone number';
            case '+44':
                return 'Please enter a valid UK phone number';
            case '+91':
                return 'Please enter a valid 10-digit Indian phone number';
            default:
                return 'Please enter a valid phone number';
        }
    }

    return null;
}; 