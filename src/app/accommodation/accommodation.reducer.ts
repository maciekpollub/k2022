import { IAccommodationState } from '../interfaces/accommodation-state';
import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { fetchData } from '../actions';
import { addAccommodationSuccess, deleteAccommodationSuccess, loadActiveAccommodationDataSuccess, relieveActiveAccommodationData, updateAccommodationSuccess } from './actions';

const initialState: IAccommodationState = {
  accommodations: [],
  activeAccommodation: undefined,
}

const _accommodationsReducer = createReducer(
  initialState,
  on(fetchData, (state, { fetchedDataAccommodations }) => ({
    ...state,
    accommodations: fetchedDataAccommodations
    })),
  on(addAccommodationSuccess, (state, { newAccommodation }) => ({
      ...state,
      accommodations: [...state.accommodations, newAccommodation]
    })),
  on(deleteAccommodationSuccess, (state, { accommodationId }) => ({
    ...state,
    accommodations: [...state.accommodations.filter(a => a.id?.toString() !== accommodationId)]
    })),
  on(loadActiveAccommodationDataSuccess, (state, { accommodationId }) => ({
    ...state,
    activeAccommodation: state.accommodations.find(a => a.id.toString() === accommodationId)
  })),
  on(relieveActiveAccommodationData, (state) => ({
    ...state,
    activeAccommodation: undefined,
  })),
  on(updateAccommodationSuccess, (state, { accommodation }) => {
    const accommodationBeforeUpdate = state.accommodations.find(a => a.id === accommodation.id);
    let updatedAccommodationOrderNumber = -1;
    if (accommodationBeforeUpdate) {
      updatedAccommodationOrderNumber = state.accommodations.indexOf(accommodationBeforeUpdate);
    }
    let accommodationsCopy = state.accommodations.slice();
    accommodationsCopy.splice(updatedAccommodationOrderNumber, 1, accommodation);

    return ({
      ...state,
      accommodations: accommodationsCopy,
    })
  })
)
export function accommodationsReducer(state: any, action: Action){
  return _accommodationsReducer(state, action);
}

export const getAccommodationsState = createFeatureSelector<IAccommodationState>('accommodationsState');
export const getAccommodations = createSelector(
  getAccommodationsState,
  (state: IAccommodationState) => state.accommodations
);
export const getActiveAccommodation = createSelector(
  getAccommodationsState,
  (state: IAccommodationState) => state.activeAccommodation
);

