// src/context/AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        onCreateFitPiece: null,
        onEditCollection: null,
        pendingUpload: false,
        // Add more as needed
    });

    const updateAppState = (updates) => {
        setAppState((prev) => ({ ...prev, ...updates }));
    };

    return (
        <AppContext.Provider value={{ appState, updateAppState }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
