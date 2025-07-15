import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import sessionReducer from './features/sessionSlice';
import loadingReducer from './features/loadingSlice';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from "./rootReducer";
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['verificationToken'], 
};
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const store = configureStore({
  reducer: {
    root:rootReducer,
    auth: persistedAuthReducer, 
    session: sessionReducer, 
    loading: loadingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, 
      immutableCheck: false, 
    }),
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
