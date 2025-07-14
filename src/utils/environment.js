import { Platform } from 'react-native';
import {ENVIRONMENT} from '@env';
/**
 * Environment detection utilities
 * Used to determine which environment the app is running in
 */

/**
 * Checks if the app is running in local development mode
 * @returns {boolean} true if in local development mode
 */
export const isInDevelopmentMode = () => {
  return 'development' === ENVIRONMENT;
};

/**
 * Checks if the app is running in TestFlight (iOS beta)
 * @returns {boolean} true if in TestFlight
 */
export const isInTestFlight = () => {
  return 'staging' === ENVIRONMENT  && Platform.OS === 'ios';
};

/**
 * Checks if the app is running in Android beta channel
 * @returns {boolean} true if in Android beta
 */
export const isInAndroidBeta = () => {
  return 'staging' === ENVIRONMENT && Platform.OS === 'android';
};

/**
 * Checks if the app is in any development or testing environment
 * @returns {boolean} true if in a dev environment (local dev, TestFlight or Android beta)
 */
export const isInDevEnvironment = () => {
  return isInDevelopmentMode() || isInTestFlight() || isInAndroidBeta();
};

/**
 * Checks if the app is running in production
 * @returns {boolean} true if in production
 */
export const isInProduction = () => {
  return !isInDevEnvironment();
};

/**
 * Gets the current environment name
 * @returns {string} The current environment name
 */
export const getEnvironmentName = () => {
  if (isInDevelopmentMode()) {
    return 'development';
  }
  if (isInTestFlight()) {
    return 'testflight';
  }
  if (isInAndroidBeta()) {
    return 'android-beta';
  }
  return 'production';
};

export default {
  isInDevelopmentMode,
  isInTestFlight,
  isInAndroidBeta,
  isInDevEnvironment,
  isInProduction,
  getEnvironmentName,
};
