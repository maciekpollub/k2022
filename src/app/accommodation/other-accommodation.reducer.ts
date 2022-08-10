import { IOtherAccommodationState } from '../interfaces/other-accommodation-state';
import { fetchData } from '../actions';
import { on, createReducer, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { addOtherAccommodationSuccess, deleteOtherAccommodationSuccess, loadActiveOtherAccommodationDataSuccess, relieveActiveOtherAccommodationData, updateOtherAccommodationRequest, updateOtherAccommodationSuccess } from './actions';
import { state } from '@angular/animations';

const initialState: IOtherAccommodationState = {
  otherAccommodations: [],
  activeOtherAccommodation: undefined,
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
  })),
  on(loadActiveOtherAccommodationDataSuccess, (state, { otherAccommodationId }) => ({
    ...state,
    activeOtherAccommodation: state.otherAccommodations.find(a => a.id.toString() === otherAccommodationId)
  })),
  on(relieveActiveOtherAccommodationData, (state) => ({
    ...state,
    activeOtherAccommodation: undefined,
  })),
  on(updateOtherAccommodationSuccess, (state, { otherAccommodation }) => {
    const otherAccommodationBeforeUpdate = state.otherAccommodations.find(a => a.id === otherAccommodation.id);
    let updatedOtherAccommodationOrderNumber = -1;
    if(otherAccommodationBeforeUpdate) {
      updatedOtherAccommodationOrderNumber = state.otherAccommodations.indexOf(otherAccommodationBeforeUpdate);
    }
    let otherAccommodationsCopy = state.otherAccommodations.slice();
    otherAccommodationsCopy.splice(updatedOtherAccommodationOrderNumber, 1, otherAccommodation)
    return ({
      ...state,
      otherAccommodations: otherAccommodationsCopy,
    })
  })
)
export function otherAccommodationsReducer(state: any, action: Action) {
  return _otherAccommodationsReducer(state, action);
}

export const getOtherAccommodationsState = createFeatureSelector<IOtherAccommodationState>('otherAccommodationsState');
export const getOtherAccommodations = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.otherAccommodations
);
export const getActiveOtherAccommodation = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.activeOtherAccommodation
);
