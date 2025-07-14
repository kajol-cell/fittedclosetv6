import { Mixpanel } from 'mixpanel-react-native';
import { isInDevEnvironment, getEnvironmentName } from '../utils/environment';
import {APP_CONFIG} from '../config/appConfig';

// Analytics instance that will be initialized in App.js
let mixpanel = null;

// Environment-based analytics configuration
const getAnalyticsConfig = () => {
  // Use DEV token for any development environment (local dev, TestFlight, beta)
  if (isInDevEnvironment()) {
    return {
      token: APP_CONFIG.MIXPANEL_TOKEN,
      isDevEnvironment: true,
    };
  }

  // Use PROD token only for production
  return {
    token: APP_CONFIG.MIXPANEL_TOKEN,
    isDevEnvironment: false,
  };
};

// Helper function to check if analytics is initialized
const ensureAnalyticsInitialized = operation => {
  if (!mixpanel) {
    console.warn(`Analytics: Cannot ${operation} - analytics not initialized`);
    return false;
  }
  return true;
};

// ============================================================================
// Event Constants
// ============================================================================

// Event names as constants
export const AnalyticsEvents = Object.freeze({
  // Installation Events
  APP_FIRST_INSTALL: 'app_first_install',
  APP_OPEN: 'app_open',

  // Authentication Events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',

  // Closet Events
  PIECE_ADDED_TO_CLOSET: 'piece_added_to_closet',
  PIECE_UPLOAD: 'piece_upload',

  // Collection Events
  COLLECTION_CREATE: 'collection_create',
  COLLECTION_VIEW: 'collection_view',

  // Fit Events
  FIT_CREATE: 'fit_create',
  FIT_VIEW: 'fit_view',

  // Subscription Events
  SUBSCRIPTION_MODAL_OPEN: 'subscription_modal_open',
  SUBSCRIPTION_PURCHASE_START: 'subscription_purchase_start',
  SUBSCRIPTION_PURCHASE_COMPLETE: 'subscription_purchase_complete',
});

// Event parameter names
export const AnalyticsParams = Object.freeze({
  // Piece parameters
  PIECE_ID: 'piece_id',
  PIECE_NAME: 'piece_name',
  PIECE_CATEGORY: 'piece_category',
  PIECE_TYPE: 'piece_type',
  PIECE_BRAND: 'piece_brand',

  // Collection parameters
  COLLECTION_ID: 'collection_id',
  COLLECTION_NAME: 'collection_name',

  // Fit parameters
  FIT_NAME: 'fit_name',

  // Subscription parameters
  SUBSCRIPTION_TYPE: 'subscription_type',
  SUBSCRIPTION_PRICE: 'price',
  SUBSCRIPTION_CURRENCY: 'currency',
  SUBSCRIPTION_PERIOD: 'period',
  TRANSACTION_ID: 'transaction_id',
  PRODUCT_ID: 'product_id',
  PURCHASE_DATE: 'purchase_date',
});

// ============================================================================
// Core Analytics Functions
// ============================================================================

// Initialize analytics
export const initializeAnalytics = async () => {
  try {
    // Skip initialization if analytics instance already exists
    if (mixpanel) {
      console.log('Analytics: Analytics already initialized');
      return true;
    }

    const config = getAnalyticsConfig();
    const environment = getEnvironmentName();

    // Create Mixpanel instance with appropriate token
    mixpanel = new Mixpanel(config.token, false);
    await mixpanel.init();

    // Enable debug logging in dev environments
    if (config.isDevEnvironment) {
      mixpanel.setLoggingEnabled(true);
    }

    // Register the environment as a super property
    mixpanel.registerSuperProperties({ environment });

    console.log(
      `Analytics: Initialized with ${
        config.isDevEnvironment ? 'DEVELOPMENT' : 'PRODUCTION'
      } token for environment: ${environment}`,
    );
    return true;
  } catch (error) {
    console.error('Analytics: Failed to initialize Analytics', error.message);
    // Continue app execution even if analytics fails
    return false;
  }
};

// Track event
export const trackEvent = (eventName, params) => {
  try {
    if (!ensureAnalyticsInitialized('track event')) {
      return;
    }

    mixpanel.track(eventName, params);
    console.log(`Analytics: Event tracked - ${eventName}`, params);
  } catch (error) {
    console.error(`Analytics: Failed to track event - ${eventName}`, error.message);
  }
};

// Set user ID
export const identifyUser = async userId => {
  try {
    if (!ensureAnalyticsInitialized('identify user')) {
      return;
    }

    if (userId) {
      await mixpanel.identify(userId);
      console.log(`Analytics: User identified - ${userId}`);
    }
  } catch (error) {
    console.error(`Analytics: Failed to identify user - ${userId}`, error.message);
  }
};

// Set user properties
export const setUserProperties = properties => {
  try {
    if (!ensureAnalyticsInitialized('set properties')) {
      return;
    }

    // Filter out null values and convert to a valid properties object
    const validProperties = Object.entries(properties)
      .filter(([_, value]) => value !== null)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Set as profile properties
    mixpanel.getPeople().set(validProperties);

    // Also set as super properties for future events
    mixpanel.registerSuperProperties(validProperties);

    console.log('Analytics: User properties set', validProperties);
  } catch (error) {
    console.error('Analytics: Failed to set user properties', error.message);
  }
};

// Reset analytics data
export const resetAnalyticsData = () => {
  try {
    if (!ensureAnalyticsInitialized('reset data')) {
      return;
    }

    mixpanel.reset();
    console.log('Analytics: Analytics data reset');
  } catch (error) {
    console.error('Analytics: Failed to reset analytics data', error.message);
  }
};

// ============================================================================
// Onboarding Events
// ============================================================================

// Event prefixes
export const EventPrefixes = Object.freeze({
  ONBOARDING_STEP: 'onboarding_step_',
  HOW_TO_UPLOAD: 'how_to_upload_',
  SUBSCRIPTION: 'subscription_',
});

// Helper to generate step event name
export const getOnboardingStepEvent = step =>
  `${EventPrefixes.ONBOARDING_STEP}${step.toLowerCase()}`;

// Track onboarding step
export const trackOnboardingStep = (step, params) => {
  const eventName = getOnboardingStepEvent(step);
  trackEvent(eventName, params);
};

// ============================================================================
// Subscription
// ============================================================================

// Track when subscription modal is opened
export const trackSubscriptionModalOpen = () => {
  trackEvent(AnalyticsEvents.SUBSCRIPTION_MODAL_OPEN);
};

// Track when user starts purchase process
export const trackSubscriptionPurchaseStart = pkg => {
  if (!pkg?.product) {return;}

  const params = {
    [AnalyticsParams.SUBSCRIPTION_TYPE]: pkg.packageType,
    [AnalyticsParams.SUBSCRIPTION_PRICE]: pkg.product.price,
    [AnalyticsParams.SUBSCRIPTION_CURRENCY]: pkg.product.currencyCode,
    [AnalyticsParams.PRODUCT_ID]: pkg.product.identifier,
  };

  trackEvent(AnalyticsEvents.SUBSCRIPTION_PURCHASE_START, params);
};

// Track when purchase is completed successfully
export const trackSubscriptionPurchaseComplete = purchaseResult => {
  if (!purchaseResult) {return;}

  const { productIdentifier, transaction } = purchaseResult;
  const isMonthly = productIdentifier?.includes('Monthly');
  const isYearly = productIdentifier?.includes('Yearly');

  const params = {
    [AnalyticsParams.SUBSCRIPTION_TYPE]: isYearly ? 'ANNUAL' : isMonthly ? 'MONTHLY' : 'UNKNOWN',
    [AnalyticsParams.PRODUCT_ID]: productIdentifier,
    [AnalyticsParams.TRANSACTION_ID]: transaction?.transactionIdentifier,
    [AnalyticsParams.PURCHASE_DATE]: transaction?.purchaseDate,
  };

  trackEvent(AnalyticsEvents.SUBSCRIPTION_PURCHASE_COMPLETE, params);
};

// ============================================================================
// How To Upload Events
// ============================================================================

// Helper to generate How To Upload event name
export const getHowToUploadEvent = action =>
  `${EventPrefixes.HOW_TO_UPLOAD}${action.toLowerCase()}`;

// ============================================================================
// Timing Events
// ============================================================================

// Mixpanel has built-in timing functionality which we expose with a simplified API
export const startTimedEvent = eventName => {
  if (!ensureAnalyticsInitialized('start timed event')) {
    return;
  }

  mixpanel.timeEvent(eventName);
  console.log(`Analytics: Started timed event - ${eventName}`);
};

// ============================================================================
// Auth Analytics Functions
// ============================================================================

/**
 * Identifies and sets properties for a user based on their profile data
 * @param {Object} profile - User profile object from the API
 * @param {string} authMethod - Authentication method used (e.g., 'email', 'google', 'apple', 'app_load')
 * @param {boolean} isNewUser - Whether this is a new user registration
 * @returns {Promise<void>}
 */
export const identifyUserFromProfile = async (profile, authMethod, isNewUser = false) => {
  try {
    if (!profile) {
      console.warn('Analytics: Cannot identify user - no profile data provided');
      return;
    }

    const userEmail = profile.email;
    const userId = profile.id;

    // Identify the user with the best available identifier
    if (userEmail) {
      await identifyUser(userEmail);
    } else if (userId) {
      await identifyUser(String(userId));
    }

    // Set standard user properties
    setUserProperties({
      email: profile.email,
      user_id: String(profile.id),
      auth_method: authMethod,
      is_new_user: isNewUser,
      has_verified_email: profile.emailVerified,
      has_verified_phone: profile.phoneVerified,
    });
  } catch (error) {
    console.error('Analytics: Error identifying user from profile', error.message);
  }
};

/**
 * Tracks user signup with appropriate properties
 * @param {string} authMethod - Authentication method used (e.g., 'email', 'phone', 'google', 'apple')
 * @returns {void}
 */
export const trackSignup = authMethod => {
  trackEvent(AnalyticsEvents.USER_SIGNUP, {
    auth_method: authMethod,
  });
};

/**
 * Tracks user login with appropriate properties
 * @param {string} authMethod - Authentication method used (e.g., 'email', 'phone', 'google', 'apple')
 * @returns {void}
 */
export const trackLogin = authMethod => {
  trackEvent(AnalyticsEvents.USER_LOGIN, {
    auth_method: authMethod,
  });
};

/**
 * Tracks a piece being added to the closet
 * @param {string|number} id - The piece ID
 * @param {Object} formData - The piece form data containing piece details
 * @returns {void}
 */
export const trackPieceAddedToCloset = (id, formData) => {
  if (!id || !formData) {
    return;
  }

  trackEvent(AnalyticsEvents.PIECE_ADDED_TO_CLOSET, {
    [AnalyticsParams.PIECE_ID]: id,
    [AnalyticsParams.PIECE_NAME]: formData.name,
    [AnalyticsParams.PIECE_CATEGORY]: formData.category,
    [AnalyticsParams.PIECE_TYPE]: formData.type,
    [AnalyticsParams.PIECE_BRAND]: formData.brand,
  });
};

// ============================================================================
// Collection Tracking Functions
// ============================================================================

/**
 * Tracks when a collection is created
 * @param {string|number} collectionId - The collection ID
 * @param {string} collectionName - The collection name
 */
export const trackCollectionCreate = (collectionId, collectionName) => {
  trackEvent(AnalyticsEvents.COLLECTION_CREATE, {
    [AnalyticsParams.COLLECTION_ID]: collectionId,
    [AnalyticsParams.COLLECTION_NAME]: collectionName,
  });
};

/**
 * Tracks when a collection is viewed
 * @param {string|number} collectionId - The collection ID
 * @param {string} collectionName - The collection name
 */
export const trackCollectionView = (collectionId, collectionName) => {
  trackEvent(AnalyticsEvents.COLLECTION_VIEW, {
    [AnalyticsParams.COLLECTION_ID]: collectionId,
    [AnalyticsParams.COLLECTION_NAME]: collectionName,
  });
};

// ============================================================================
// Fit Tracking Functions
// ============================================================================

/**
 * Tracks when a fit is created
 * @param {string|number} fitId - The fit ID
 * @param {string} fitName - The fit name
 */
export const trackFitCreate = () => {
  trackEvent(AnalyticsEvents.FIT_CREATE);
};

/**
 * Tracks when a fit is viewed
 * @param {string|number} fitId - The fit ID
 * @param {string} fitName - The fit name
 */
export const trackFitView = fitId => {
  trackEvent(AnalyticsEvents.FIT_VIEW, {
    [AnalyticsParams.FIT_ID]: fitId,
  });
};

// ============================================================================
// Piece Upload Tracking
// ============================================================================

/**
 * Tracks when a piece is uploaded
 */
export const trackPieceUpload = () => {
  trackEvent(AnalyticsEvents.PIECE_UPLOAD);
};

// ============================================================================
// App Lifecycle Tracking
// ============================================================================

/**
 * Tracks when the app is opened
 */
export const trackAppOpen = () => {
  trackEvent(AnalyticsEvents.APP_OPEN);
};

// Exports
export default {
  initialize: initializeAnalytics,
  trackEvent,
  identifyUser,
  setUserProperties,
  resetAnalyticsData,
  trackOnboardingStep,
  startTimedEvent,
  trackAppOpen,
  AnalyticsEvents,
  AnalyticsParams,
  identifyUserFromProfile,
  trackSignup,
  trackLogin,
  trackPieceAddedToCloset,
  trackCollectionCreate,
  trackCollectionView,
  trackFitCreate,
  trackFitView,
  trackPieceUpload,
};
