import { IOtherAccommodationState } from '../interfaces/other-accommodation-state';
import { fetchData } from '../actions';
import { on, createReducer, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { addOtherAccommodationSuccess, deleteOtherAccommodationSuccess } from './actions';

const initialState: IOtherAccommodationState = {
  otherAccommodations: [],
}

const _otherAccommodationsReducer = createReducer(
  initialState,
  on(fetchData, (state, { fetchedDataOtherAccommodations }) => ({
    ...state,
    otherAccommodations: fetchedDataOtherAccommodations
  })),
  on(addOtherAccommodationSuccess, (state, { newOtherAccommodation } ) => ({
    ...state,
    otherAccommodations: [...state.otherAccommodations, newOtherAccommodation]
  })),
  on(deleteOtherAccommodationSuccess, (state, { otherAccommodationId }) => ({
    ...state,
    otherAccommodations: [...state.otherAccommodations.filter(a => a.id?.toString() !== otherAccommodationId)]
  }))
)
export function otherAccommodationsReducer(state: any, action: Action) {
  return _otherAccommodationsReducer(state, action);
}

export const getOtherAccommodationsState = createFeatureSelector<IOtherAccommodationState>('otherAccommodationsState');
export const getOtherAccommodations = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.otherAccommodations
);
