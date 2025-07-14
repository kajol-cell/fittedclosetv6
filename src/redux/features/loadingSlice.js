import {createSlice} from '@reduxjs/toolkit';

let store; // Global reference to the Redux store

export const setLoadingStore = s => {
  store = s;
}; // Setter function to initialize store

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {isLoading: false},
  reducers: {
    showLoading: state => {
      state.isLoading = true;
    },
    hideLoading: state => {
      state.isLoading = false;
    },
  },
});

export const {showLoading, hideLoading} = loadingSlice.actions;
export default loadingSlice.reducer;
