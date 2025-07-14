import React from 'react';
import {Provider} from 'react-redux';
import store, {persistor} from './src/redux/store';
import App from './App';
import {setStore} from './src/redux/api';
import {setAuthStore} from './src/redux/features/authSlice';
import {setLoadingStore} from './src/redux/features/loadingSlice';
import {setSessionStore} from './src/redux/features/sessionSlice';
import {PersistGate} from 'redux-persist/integration/react';
import {AppProvider} from "./src/navigation/AppContext";

setStore(store);
setAuthStore(store);
setLoadingStore(store);
setSessionStore(store);

export default function AppEntry() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppProvider>
                    <App/>
                </AppProvider>
            </PersistGate>
        </Provider>
    );
}
