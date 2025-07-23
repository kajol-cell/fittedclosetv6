import FastImage from "react-native-fast-image";

export const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim() === '')
  );
};

export const isNotEmpty = value => {
  return !isEmpty(value);
};

/**
 * Clears both memory and disk cache used by FastImage.
 * Can be safely called during app startup.
 */
export const clearImageCache = async () => {
  try {
    console.log('Clear imageCache');
    await FastImage.clearMemoryCache(); // memory first
    await FastImage.clearDiskCache();   // then disk
    console.log('✅ FastImage cache cleared');
  } catch (err) {
    console.error('❌ Failed to clear image cache:', err);
  }
};

export const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
  if (!error) return defaultMessage;
  
  // Handle different error formats
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.payload && error.payload.message) return error.payload.message;
  
  if (error.responseDescription) return error.responseDescription;
  
  return defaultMessage;
};
