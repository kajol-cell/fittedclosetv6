import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = Object.freeze({
  IS_FIRST_INSTALL: 'is_first_install',
});

/**
 * Get a value from AsyncStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {Promise<any>} The stored value or defaultValue
 */
export const getItem = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Storage: Failed to get item ${key}`, error);
    return defaultValue;
  }
};

/**
 * Set a value in AsyncStorage
 * @param {string} key - The key to store
 * @param {any} value - The value to store (will be JSON stringified)
 * @returns {Promise<boolean>} Success status
 */
export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Storage: Failed to set item ${key}`, error);
    return false;
  }
};

/**
 * Remove a value from AsyncStorage
 * @param {string} key - The key to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Storage: Failed to remove item ${key}`, error);
    return false;
  }
};

/**
 * Clear all values in AsyncStorage
 * @returns {Promise<boolean>} Success status
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Storage: Failed to clear storage', error);
    return false;
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  STORAGE_KEYS,
};
