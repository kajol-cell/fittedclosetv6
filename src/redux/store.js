// store.js with Configuration for authSlice and sessionSlice

import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import sessionReducer from './features/sessionSlice';
import loadingReducer from './features/loadingSlice';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from "./rootReducer";

// Persist configuration for authSlice
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['verificationToken'], // Only persist verificationToken
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    root:rootReducer,
    auth: persistedAuthReducer, // Auth slice with persistence
    session: sessionReducer, // Session slice without persistence
    loading: loadingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // <-- Disable serializable state check
      immutableCheck: false, // <-- Disable immutable state check (optional)
    }),
});

export const persistor = persistStore(store);
export default store;
