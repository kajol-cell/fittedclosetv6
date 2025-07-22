// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import sessionReducer from './features/sessionSlice';

const appReducer = combineReducers({
    auth: authReducer,
    session: sessionReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_APP') {
        state = undefined; // this resets all slices
    }
    return appReducer(state, action);
};

export default rootReducer;
