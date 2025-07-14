export const AppStateType = Object.freeze({
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive',
  EXTENSION: 'extension', // iOS only
});

export const RouteType = Object.freeze({
  AUTHENTICATION: 'Authentication',
  HOME: 'Home',
});

export const ErrorMessageType = Object.freeze({
  API_SESSION_ERROR: 'Error initializing API session',
  VERIFICATION_ERROR: 'Error reading verificationToken from AsyncStorage',
});

export const ProfileEditType = Object.freeze({
  NAME: 'Name',
  EMAIL: 'Email',
  PHONE: 'Phone',
});

// Enum for component names and refs using CompType convention
export const ScreenType = Object.freeze({
  ENTRY: 'Entry',
  MAIN: 'Main',
  CLOSET: 'Closet',
  FITS: 'Fits',
  PIECES: 'Pieces',
  COLLECTIONS: 'Collections',
  PROFILE: 'Profile',
  TERMS_OF_SERVICE: 'TermsOfService',
  PRIVACY_POLICY: 'PrivacyPolicy',
  PERMISSIONS: 'Permissions',
});

export const GARMENT_TYPES = Object.freeze({
  HEADWEAR: {name: 'Headwear', label: 'Headwear', slotIndex: 0},
  TOP: {name: 'Top', label: 'Top', slotIndex: 1},
  BOTTOM: {name: 'Bottom', label: 'Bottom', slotIndex: 2},
  FOOTWEAR: {name: 'Footwear', label: 'Footwear', slotIndex: 3},
  ACCESSORY: {name: 'Accessory', label: 'Accessory', slotIndex: 4},
  UNKNOWN: {name: 'Unknown', label: 'Unknown', slotIndex: -1},
});

export function getGarmentName(index) {
  const entry = Object.values(GARMENT_TYPES).find(g => g.slotIndex === index);
  return entry?.name || null;
}
export const LAYER_TYPES = Object.freeze({
  INNER: {name: 'INNER', label: 'Inner'},
  OUTER: {name: 'OUTER', label: 'Outer'},
  NONE: {name: 'NONE', label: 'None'},
});

export const ApiMessageType = Object.freeze({
  AUTHENTICATE: 'AUTHENTICATE',
  SEND_EMAIL_CODE: 'SEND_EMAIL_CODE',
  SEND_PHONE_CODE: 'SEND_PHONE_CODE',
  VERIFY_PHONE_CODE: 'VERIFY_PHONE_CODE',
  CHECK_OUT: 'CHECK_OUT',
  SAVE_PROSPECT: 'SAVE_PROSPECT',
  CONVERT_PROSPECT: 'CONVERT_PROSPECT',
  VERIFY_EMAIL_CODE: 'VERIFY_EMAIL_CODE',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  THIRD_PARTY_AUTHENTICATE: 'THIRD_PARTY_AUTHENTICATE',
  COUNTRY_CODES: 'COUNTRY_CODES',
});
export const SessionMessageType = Object.freeze({
  AUTHENTICATE: 'AUTHENTICATE',
  LOGOUT: 'LOGOUT',
  SUBSCRIPTION_ADDED: 'SUBSCRIPTION_ADDED',
  PIECE: 'PIECE',
  RECEIVED_PIECES: 'RECEIVED_PIECES',
  IN_CLOSET_PIECES: 'IN_CLOSET_PIECES',
  CLOSET: 'CLOSET',
  FITS: 'FITS',
  FIT_COLLS: 'FIT_COLLS',
  IMAGE_UPLOAD_INFO: 'IMAGE_UPLOAD_INFO',
  PROFILE_IMAGE_UPLOAD_INFO: 'PROFILE_IMAGE_UPLOAD_INFO',
  SUBMIT_PIECE_PHOTOS: 'SUBMIT_PIECE_PHOTOS',
  SUBMIT_PROFILE_PHOTO: 'SUBMIT_PROFILE_PHOTO',
  ARCHIVE_PIECES: 'ARCHIVE_PIECES',
  ARCHIVE_FITS: 'ARCHIVE_FITS',
  ARCHIVE_FIT_COLLS: 'ARCHIVE_FIT_COLLS',
  PIECE_CATEGORIES: 'PIECE_CATEGORIES',
  ADD_PIECE_TO_CLOSET: 'ADD_PIECE_TO_CLOSET',
  UPDATE_PIECE_TAGS: 'UPDATE_PIECE_TAGS',
  ADD_PIECE: 'ADD_PIECE',
  ARCHIVE_PIECE: 'ARCHIVE_PIECE',
  TOGGLE_PIECE_FAVORITE: 'TOGGLE_PIECE_FAVORITE',
  TOGGLE_PROFILE_SHARING: 'TOGGLE_PROFILE_SHARING',
  ADD_PIECES_TO_CLOSET: 'ADD_PIECES_TO_CLOSET',
  UPDATE_PIECE_NAME: 'UPDATE_PIECE_NAME',
  SHARE_PIECE: 'SHARE_PIECE',
  SAVE_FIT: 'SAVE_FIT',
  SAVE_FIT_COLL: 'SAVE_FIT_COLL',
  SAVE_GARMENT_TYPE: 'SAVE_GARMENT_TYPE',
  SAVE_PIECE_LAYER: 'SAVE_PIECE_LAYER',
  SAVE_PIECE_TAG: 'SAVE_PIECE_TAG',
  SAVE_PIECE_TAGS: 'SAVE_PIECE_TAGS',
  SAVE_BADGE_ID: 'SAVE_BADGE_ID',
  CREATE_USER_HANDLE: 'CREATE_USER_HANDLE',
  UPDATE_FIT_NAME: 'UPDATE_FIT_NAME',
  UPDATE_FIT_COLL_NAME: 'UPDATE_FIT_COLL_NAME',
  ADD_FITS_TO_COLL: 'ADD_FITS_TO_COLL',
  ACCOUNT: 'ACCOUNT',
  IS_DUPLICATE_EMAIL: 'IS_DUPLICATE_EMAIL',
  IS_DUPLICATE_PHONE: 'IS_DUPLICATE_PHONE',
  SAVE_PERSONAL_INFO: 'SAVE_PERSONAL_INFO',
  SAVE_ADDRESS: 'SAVE_ADDRESS',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
  SET_CURRENT_ADDRESS: 'SET_CURRENT_ADDRESS',
  SAVE_PREFS: 'SAVE_PREFS',
  SAVE_PLAN: 'SAVE_PLAN',
  SAVE_PROFILE_IMAGE: 'SAVE_PROFILE_IMAGE',
  REMOVE_FITS_FROM_COLL: 'REMOVE_FITS_FROM_COLL',
  VALIDATE_SESSION_KEY: 'VALIDATE_SESSION_KEY',
  VALIDATE_CHANNEL_KEY: 'VALIDATE_CHANNEL_KEY',
  UPLOAD_IMAGE: 'UPLOAD_IMAGE',
  TAG_PIECE: 'TAG_PIECE',
  MARK_PIECE_AS_IN_CLOSET: 'MARK_PIECE_AS_IN_CLOSET',
  UPDATE_BARD_TOKEN: 'UPDATE_BARD_TOKEN',
  REMOVE_PIECE_IMAGE: 'REMOVE_PIECE_IMAGE',
  PUBLIC_CLOSET: 'PUBLIC_CLOSET',
  LOOKUP_USERS: 'LOOKUP_USERS',
  UPDATE_USER_PHONE: 'UPDATE_USER_PHONE',
  VERIFY_UPDATE_USER_PHONE: 'VERIFY_UPDATE_USER_PHONE',
  UPDATE_USER_EMAIL: 'UPDATE_USER_EMAIL',
  VERIFY_UPDATE_USER_EMAIL: 'VERIFY_UPDATE_USER_EMAIL',
  REMOVE_ACCOUNT: 'REMOVE_ACCOUNT',
});

export const FirebaseMessageType = {
  PIECES_RECEIVED: 'PIECES_RECEIVED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UPLOADED_IMAGE: 'UPLOADED_IMAGE',
  HEART_BEAT: 'HEART_BEAT',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  USER_STATUS_CHANGED: 'USER_STATUS_CHANGED',
  PIECES_IMAGES_UPDATED: 'PIECES_IMAGES_UPDATED',
  PIECE_TAGGED: 'PIECE_TAGGED',
};

export const MessageTypeLabel = {
  [FirebaseMessageType.PIECES_RECEIVED]: 'Pieces Received',
  [FirebaseMessageType.SESSION_EXPIRED]: 'Session expired',
  [FirebaseMessageType.UPLOADED_IMAGE]: 'Image uploaded',
  [FirebaseMessageType.HEART_BEAT]: 'Heartbeat received',
  [FirebaseMessageType.PROFILE_UPDATED]: 'Updated Profile',
  [FirebaseMessageType.USER_STATUS_CHANGED]: 'User Status Changed',
  [FirebaseMessageType.PIECES_IMAGES_UPDATED]: 'Piece Images Updated',
  [FirebaseMessageType.PIECE_TAGGED]: 'Piece Tagged',
};

// Utility functions
export function isHeartBeat(type) {
  return type === FirebaseMessageType.HEART_BEAT;
}

export function isNotification(type) {
  return type === FirebaseMessageType.PIECES_RECEIVED;
}

export function isPhoneEvent(type) {
  return [
    FirebaseMessageType.PIECE_TAGGED,
    FirebaseMessageType.PIECES_RECEIVED,
    FirebaseMessageType.PIECES_IMAGES_UPDATED,
    FirebaseMessageType.SESSION_EXPIRED,
    FirebaseMessageType.UPLOADED_IMAGE,
    FirebaseMessageType.HEART_BEAT,
  ].includes(type);
}
