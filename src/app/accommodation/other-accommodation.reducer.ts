import { IOtherAccommodationState } from '../interfaces/other-accommodation-state';
import { fetchSpreadSheet } from '../actions';
import { on, createReducer, Action, createFeatureSelector, createSelector } from '@ngrx/store';

const initialState: IOtherAccommodationState = {
  otherAccommodations: [],
}

const _otherAccommodationsReducer = createReducer(
  initialState,
  on(fetchSpreadSheet, (state, { fetchedDataOtherAccommodations }) => ({
    ...state,
    otherAccommodations: fetchedDataOtherAccommodations
  }) )
)
export function otherAccommodationsReducer(state: any, action: Action) {
  return _otherAccommodationsReducer(state, action);
}

export const getOtherAccommodationsState = createFeatureSelector<IOtherAccommodationState>('otherAccommodationsState');
export const getOtherAccommodations = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.otherAccommodations
);
