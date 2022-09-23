import { IOtherAccommodationState } from '../interfaces/other-accommodation-state';
import { on, createReducer, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { relieveActiveOtherAccommodationOccupier, emptyRelievedActiveOtherAccommodationOccupier, supplyOtherAccommodationsWithFBKeysSuccess } from './actions';
import { addOtherAccommodationSuccess, deleteOtherAccommodationSuccess,
        loadActiveOtherAccommodationDataSuccess, relieveActiveOtherAccommodationData,
        updateOtherAccommodationSuccess, fetchOtherAccommodationsDataSuccess,
        markSaveOtherAccommodationBtnClicked, markSaveOtherAccommodationBtnUnClicked } from './actions';

const initialState: IOtherAccommodationState = {
  otherAccommodations: [],
  otherAccommodationsWithFBKeys: [],
  activeOtherAccommodation: undefined,
  relievedActiveOtherAccommodationOccupier: '',
  saveOtherAccommodationButtonRecentlyClicked: false,
}

const _otherAccommodationsReducer = createReducer(
  initialState,
  on(fetchOtherAccommodationsDataSuccess, (state, { otherAccommodationList }) => ({
    ...state,
    otherAccommodations: otherAccommodationList
    })),
  on(supplyOtherAccommodationsWithFBKeysSuccess, (state, { otherAccommodationsWithKeys }) => {
    return ({
      ...state,
      otherAccommodationsWithFBKeys: otherAccommodationsWithKeys
    })
  }),
  on(addOtherAccommodationSuccess, (state, { newOtherAccommodation } ) => ({
    ...state,
    otherAccommodations: [...state.otherAccommodations, newOtherAccommodation]
  })),
  on(deleteOtherAccommodationSuccess, (state, { otherAccommodation }) => ({
    ...state,
    otherAccommodations: [...state.otherAccommodations.filter(a => a.id?.toString() !== otherAccommodation.id?.toString())]
  })),
  on(loadActiveOtherAccommodationDataSuccess, (state, { otherAccommodationId }) => ({
    ...state,
    activeOtherAccommodation: state.otherAccommodations.find(a => a.id.toString() === otherAccommodationId)
  })),
  on(relieveActiveOtherAccommodationData, (state) => ({
    ...state,
    activeOtherAccommodation: undefined,
  })),
  on(relieveActiveOtherAccommodationOccupier, (state) => {
    let activeOtherAccommodationWithRelievedOccupier;
    let relievedOccupier;
    if(state.activeOtherAccommodation) {
      activeOtherAccommodationWithRelievedOccupier = {
        ...state.activeOtherAccommodation,
        'nazwiska': '',
        'wspólnota': ''
      };
      relievedOccupier = state.activeOtherAccommodation.nazwiska;
    }

    return ({
      ...state,
      relievedActiveOtherAccommodationOccupier: relievedOccupier ?? '',
      activeOtherAccommodation: activeOtherAccommodationWithRelievedOccupier,
    })
  }),
  on(emptyRelievedActiveOtherAccommodationOccupier, (state) => ({
    ...state,
    relievedActiveOtherAccommodationOccupier: ''
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
  }),
  on(markSaveOtherAccommodationBtnClicked, (state) => ({
    ...state,
    saveOtherAccommodationButtonRecentlyClicked: true,
  })),
  on(markSaveOtherAccommodationBtnUnClicked, (state) => ({
    ...state,
    saveOtherAccommodationButtonRecentlyClicked: false,
  })),
)
export function otherAccommodationsReducer(state: any, action: Action) {
  return _otherAccommodationsReducer(state, action);
}

export const getOtherAccommodationsState = createFeatureSelector<IOtherAccommodationState>('otherAccommodationsState');
export const getOtherAccommodations = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.otherAccommodations
);
export const getOtherAccommodationsWithFBKeys = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.otherAccommodationsWithFBKeys
)
export const getActiveOtherAccommodation = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.activeOtherAccommodation
);
export const getActiveOtherAccommodationRelievedOccupier = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.relievedActiveOtherAccommodationOccupier
)
export const isSaveOtherAccommodationButtonRecentlyClicked = createSelector(
  getOtherAccommodationsState,
  (state: IOtherAccommodationState) => state.saveOtherAccommodationButtonRecentlyClicked
);
