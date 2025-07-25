// authConfig.js for managing environment-specific configurations
import {
    ENVIRONMENT,
    SERVER_URL,
    PIECE_IMAGE_URL,
    MIXPANEL_TOKEN,
    ONESIGNAL_APP_ID,
    SECRET_KEY,
    IOS_CLIENT_ID,
    WEB_CLIENT_ID,
    REVENUE_CAT_ANDROID_API_KEY,
    REVENUE_CAT_IOS_API_KEY,
    POSHMARK_TRACKING_ID,
    POSHMARK_PARTNER_KEY,
    POSHMARK_URL,
    ANDROID_TIKTOK_APP_ID,
    ANDROID_TIKTOK_TT_APP_ID,
    ANDROID_TIKTOK_APP_SECRET,
    IOS_TIKTOK_APP_ID,
    IOS_TIKTOK_TT_APP_ID,
    IOS_TIKTOK_APP_SECRET,
} from '@env';

export const APP_CONFIG = Object.freeze({
    ENVIRONMENT: ENVIRONMENT,
    MIXPANEL_TOKEN: MIXPANEL_TOKEN,
    ONESIGNAL_APP_ID: ONESIGNAL_APP_ID,
});

export const AUTH_CONFIG = Object.freeze({
    GOOGLE: {
        IOS_CLIENT_ID: IOS_CLIENT_ID,
        WEB_CLIENT_ID: WEB_CLIENT_ID,
        OFFLINE_ACCESS: false,
    },
    APPLE: {
        BUTTON_STYLE: 'BLACK',
        BUTTON_TYPE: 'SIGN_IN',
        BUTTON_SIZE: {width: 200, height: 45},
    },
});

export const API_CONFIG = Object.freeze({
    SERVER_URL: SERVER_URL,
    SECRET_KEY: SECRET_KEY,
    PIECE_IMAGE_URL: PIECE_IMAGE_URL,
});

export const REVENUE_CAT_CONFIG = Object.freeze({
    ANDROID_API_KEY: REVENUE_CAT_ANDROID_API_KEY,
    IOS_API_KEY: REVENUE_CAT_IOS_API_KEY,
});

export const POSHMARK_CONFIG = Object.freeze({
    TRACKING_ID: POSHMARK_TRACKING_ID,
    PARTNER_KEY: POSHMARK_PARTNER_KEY,
    URL: POSHMARK_URL,
});

export const TIKTOK_CONFIG = Object.freeze({
    ANDROID_APP_ID: ANDROID_TIKTOK_APP_ID,
    ANDROID_TT_APP_ID: ANDROID_TIKTOK_TT_APP_ID,
    ANDROID_APP_SECRET: ANDROID_TIKTOK_APP_SECRET,
    IOS_APP_ID: IOS_TIKTOK_APP_ID,
    IOS_TT_APP_ID: IOS_TIKTOK_TT_APP_ID,
    IOS_APP_SECRET: IOS_TIKTOK_APP_SECRET,
});
