import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {callSession, handleUnexpectedError} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {hydrateClosetInfo} from '../../utils/closetUtils';
import {SessionMessageType} from '../../utils/enums';
import Purchases from 'react-native-purchases';
import {identifyUserFromProfile} from '../../lib/analytics';

let store; // Global reference to the Redux store

export const setSessionStore = s => {
    store = s;
}; // Setter function to initialize store
const getPieceById = (closet, pieceId) => {
    return closet?.pieces?.find(piece => piece.id === pieceId) || null;
};

async function makeThunkCall(
    messageType,
    payload,
    transformer = null,
    onSuccess,
    onError,
    rejectWithValue,
) {
    try {
        const response = await callSession(messageType, payload);
        const {responseCode, responseDescription, payload: responseData} = response;
        console.log('ResponseCode:', responseCode);
        if (responseCode !== 200) {
            // Properly invoke onError and reject
            onError(responseDescription || 'Unknown error');
            return rejectWithValue({
                code: responseCode,
                message: responseDescription || 'Unknown error',
            });
        }

        // Call success handler and return result
        let finalResponse =
            transformer !== null ? transformer(responseData) : responseData;
        onSuccess(finalResponse);
        return finalResponse;
    }
    catch (error) {
        return handleUnexpectedError(error, onError, rejectWithValue);
    }
}

// Generic thunk creator for reducing boilerplate
const createThunk = (type, messageType, transformer = null) =>
    createAsyncThunk(
        type,
        async (
            {
                payload = {}, onSuccess = () => {
            }, onError = () => {
            },
            },
            {rejectWithValue},
        ) => {
            return await makeThunkCall(
                messageType,
                payload,
                transformer,
                onSuccess,
                onError,
                rejectWithValue,
            );
        },
    );

const createGenericThunk = type =>
    createAsyncThunk(
        type,
        async (
            {
                messageType,
                payload = {},
                transformer,
                onSuccess = () => {
                },
                onError = () => {
                },
            },
            {rejectWithValue},
        ) => {
            return await makeThunkCall(
                messageType,
                payload,
                transformer,
                onSuccess,
                onError,
                rejectWithValue,
            );
        },
    );

export const sessionAuthenticate = createThunk(
    'session/sessionAuthenticate',
    SessionMessageType.AUTHENTICATE,
);
export const fetchCloset = createThunk(
    'session/fetchCloset',
    SessionMessageType.CLOSET,
    hydrateClosetInfo,
);

export const callSessionApi = createGenericThunk('session/callSessionApi');

function moveFitToFront(state, fit) {
    state.closet.fits = [
        fit,
        ...state.closet.fits.filter(f => f.id !== fit.id),
    ];
}

function moveFitCollToFront(state, fitColl) {
    state.closet.fitColls = [
        fitColl,
        ...state.closet.fitColls.filter(f => f.id !== fitColl.id),
    ];
    //console.log('Move fitColl to front', fitColl.name);
}

function handleUserLogin(profile) {
    Purchases.setAttributes({
        email: profile?.email ?? '',
        userName: profile?.firstName ?? '',
    });
    Purchases.logIn(profile?.email);
}

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        isAuthenticated: false,
        isEntitled: false,
        verificationToken: null,
        sessionKey: null,
        authInfo: null,
        closet: null,
        myCloset: null,
        closetUsername: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        toggleProfileSharing: (state, action) => {
            if (state.authInfo?.profile) {
                state.authInfo = {
                    ...state.authInfo,
                    profile: {
                        ...state.authInfo.profile,
                        profilePublic: action.payload.profilePublic,
                    },
                };
            }
        },
        switchToPublicCloset: (state, action) => {
            state.myCloset = state.closet;
            state.closetUsername = action.payload.username;
            state.closet = action.payload.closet;
        },
        resetCloset: (state, action) => {
            state.closet = state.myCloset;
        },
        setVerificationToken: (state, action) => {
            console.log('set VerificationToken', action.payload);
            state.verificationToken = action.payload;
            AsyncStorage.setItem('verificationToken', action.payload);
        },
        setAuthInfo: (state, action) => {
            if (!state.isAuthenticated) {
                state.isAuthenticated = true;
                AsyncStorage.setItem(
                    'verificationToken',
                    action.payload.verificationToken,
                );
            }
            state.authInfo = action.payload;
            state.isEntitled = state.authInfo.profile.entitlements?.length > 0;
            state.firebaseConfig = action.payload.firebaseConfig;
            state.sessionKey = action.payload.sessionKey;
            handleUserLogin(state.authInfo.profile);
        },
        clearAuthInfo: state => {
            state.isAuthenticated = false;
            state.isEntitled = false;
            state.authInfo = null;
            state.sessionKey = null;
            state.verificationToken = null;
            state.closet = null;
            AsyncStorage.removeItem('verificationToken');

        },
        setEntitled: (state, action) => {
            state.isEntitled = action.payload;
        },
        updateBadgeId: (state, action) => {
            state.authInfo.profile.badgeId = action.payload.badgeId;
        },
        updateProfileImageUrl: (state, action) => {
            state.authInfo.profile.imageUrl = action.payload.imageUrl;
        },
        updatePersonalInfo: (state, action) => {
            state.authInfo.profile.firstName = action.payload.firstName;
            state.authInfo.profile.lastName = action.payload.lastName;
        },
        updatePhone: (state, action) => {
            state.authInfo.profile.phoneNumber = action.payload.phoneNumber;
            state.authInfo.profile.phoneCountryCode = action.payload.phoneCountryCode;
        },
        updateEmail: (state, action) => {
            state.authInfo.profile.email = action.payload.email;
        },
        updatePieceTag: (state, action) => {
            const pieceId = action.payload.pieceId;
            const tagId = action.payload.tagId;
            const description = action.payload.description;
            const pieceById = getPieceById(state.closet, pieceId);
            pieceById.tags.find(tag => tag.id === tagId).description = description;
        },
        togglePieceFavorite: (state, action) => {
            const pieceId = action.payload.pieceId;
            const pieceById = getPieceById(state.closet, pieceId);
            pieceById.favorite = !pieceById.favorite;
        },
        updatePieceGarmentType: (state, action) => {
            const pieceId = action.payload.pieceId;
            getPieceById(state.closet, pieceId).garmentType =
                action.payload.garmentType;
        },
        updatePieceGarmentLayerType: (state, action) => {
            const pieceId = action.payload.pieceId;
            getPieceById(state.closet, pieceId).garmentLayerType =
                action.payload.garmentLayerType;
        },
        updateFitName: (state, action) => {
            const id = action.payload.id;
            const name = action.payload.name;
            const fit = state.closet.fits.find(f => f.id === id);
            fit.name = name;
            moveFitToFront(state, fit);
        },
        updateFitCollName: (state, action) => {
            const id = action.payload.id;
            const name = action.payload.name;
            const fitColl = state.closet.fitColls.find(f => f.id === id);
            fitColl.name = name;
            moveFitCollToFront(state, fitColl);
        },
        addPiece: (state, action) => {
            const newPiece = action.payload; // `pieceInfo` object
            state.closet.pieces.unshift(newPiece); // Insert at the beginning
        },
        removePiece: (state, action) => {
            const pieceId = action.payload.pieceId; // `pieceInfo` object
            state.closet.pieces = state.closet.pieces.filter(
                piece => piece.id !== pieceId,
            );
        },
        removeFit: (state, action) => {
            const fitId = action.payload.fitId; // `pieceInfo` object
            state.closet.fits = state.closet.fits.filter(fit => fit.id !== fitId);
        },
        removeFitColl: (state, action) => {
            const fitCollId = action.payload.fitCollId; // `pieceInfo` object
            state.closet.fitColls = state.closet.fitColls.filter(
                fitColl => fitColl.id !== fitCollId,
            );
        },
        markPieceAsInCloset: (state, action) => {
            const pieceId = action.payload; // `pieceInfo` object
            const pieceToUpdate = state.closet.pieces.find(
                piece => piece.id === pieceId,
            );
            if (pieceToUpdate) {
                pieceToUpdate.inCloset = true;
            }
        },
        addPieces: (state, action) => {
            const newPieces = action.payload; // Array of `pieceInfo` objects
            state.closet.pieces = [...newPieces, ...state.closet.pieces]; // Prepend new pieces
        },
        updatePieces: (state, action) => {
            const updatedPieces = action.payload; // Array of pieceInfo objects
            const pieceMap = new Map(updatedPieces.map(piece => [piece.id, piece]));

            state.closet.pieces = state.closet.pieces.map(existing =>
                pieceMap.has(existing.id) ? pieceMap.get(existing.id) : existing,
            );

            // If there are any truly new pieces, add them
            const existingIds = new Set(state.closet.pieces.map(p => p.id));
            const newPieces = updatedPieces.filter(p => !existingIds.has(p.id));
            if (newPieces.length > 0) {
                state.closet.pieces = [...newPieces, ...state.closet.pieces];
            }
        },
        updateFit: (state, action) => {
            const updatedFit = action.payload; // `fit` object
            const index = state.closet.fits.findIndex(f => f.id === updatedFit.id);
            if (index !== -1) {
                moveFitToFront(state, updatedFit);
            }
            else {
                state.closet.fits = [updatedFit, ...state.closet.fits];
            }
        },
        updateFitColl: (state, action) => {
            const updatedFitColl = action.payload; // `fit` object
            const index = state.closet.fitColls.findIndex(
                f => f.id === updatedFitColl.id,
            );
            if (index !== -1) {
                moveFitCollToFront(state, updatedFitColl);
            }
            else {
                state.closet.fitColls = [updatedFitColl, ...state.closet.fitColls];
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(sessionAuthenticate.pending, state => {
                //state.status = 'loading';
            })
            .addCase(sessionAuthenticate.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.authInfo = action.payload;
                state.sessionKey = action.payload.sessionKey;
                //state.status = 'succeeded';
            })
            .addCase(sessionAuthenticate.rejected, (state, action) => {
                state.error = action.payload;
                //state.status = 'failed';
            })
            .addCase(fetchCloset.fulfilled, (state, action) => {
                console.log('fetchCloset.fulfilled');
                state.closet = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCloset.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export const {
    setEntitled,
    toggleProfileSharing,
    switchToPublicCloset,
    resetCloset,
    setVerificationToken,
    setAuthInfo,
    clearAuthInfo,
    updateBadgeId,
    updateProfileImageUrl,
    updatePersonalInfo,
    updatePhone,
    updateEmail,
    updatePieceTag,
    togglePieceFavorite,
    updatePieceGarmentType,
    updatePieceGarmentLayerType,
    updateFitName,
    updateFitCollName,
    addPieces,
    markPieceAsInCloset,
    updatePieces,
    updateFit,
    updateFitColl,
    addPiece,
    removePiece,
    removeFit,
    removeFitColl,
} = sessionSlice.actions;
export default sessionSlice.reducer;
// In your sessionSlice.js or selectors.js
export const selectAuthInfo = state => state.session.authInfo;
export const selectFirebaseConfig = state =>
    state.session.authInfo?.firebaseConfig;

export const selectPieceById = (state, pieceId) =>
    state.session.closet?.pieces.find(p => p.id === pieceId);

export const selectPieceTags = pieceId =>
    selectPieceById(store.getState(), pieceId).tags;
