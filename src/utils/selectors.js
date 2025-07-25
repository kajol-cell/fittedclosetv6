// selectors.js
import { createSelector } from 'reselect';

export const selectPublicCloset = createSelector(
    state => state.session.closet,
    closet => closet?.publicCloset
);
export const selectMyCloset = createSelector(
    state => state.session.closet,
    closet => !closet?.publicCloset
);
