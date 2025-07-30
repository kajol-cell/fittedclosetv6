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
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.payload && error.payload.message) return error.payload.message;
  
  if (error.responseDescription && error.responseDescription.trim() !== '') {
    return error.responseDescription;
  }
  
  if (error.code === 500) {
    return 'Server error occurred. Please try again in a moment.';
  }
  
  if (error.code === 401) {
    return 'Authentication failed. Please sign in again.';
  }
  
  if (error.code === 403) {
    return 'Access denied. Please check your permissions.';
  }
  
  if (error.code === 404) {
    return 'Resource not found. Please try again.';
  }
  
  return defaultMessage;
};
