import { IAccommodationState } from '../interfaces/accommodation-state';
import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { addAccommodationSuccess, deleteAccommodationSuccess, loadActiveAccommodationDataSuccess, relieveActiveAccommodationData, updateAccommodationSuccess, fetchAccommodationsDataSuccess, fetchOtherAccommodationsDataSuccess, markSaveAccommodationBtnUnClicked, markSaveAccommodationBtnClicked } from './actions';


const initialState: IAccommodationState = {
  accommodations: [],
  activeAccommodation: undefined,
  saveAccommodationButtonRecentlyClicked: false,
}

const _accommodationsReducer = createReducer(
  initialState,
  on(fetchAccommodationsDataSuccess, (state, { accommodationList }) => ({
    ...state,
    accommodations: accommodationList
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
    activeAccommodation: state.accommodations.find(a => a.id?.toString() === accommodationId)
  })),
  on(relieveActiveAccommodationData, (state) => ({
    ...state,
    activeAccommodation: undefined,
  })),
  on(updateAccommodationSuccess, (state, { accommodation }) => {
    const accommodationBeforeUpdate = state.accommodations.find(a => a.id === accommodation.id);
    let updatedAccommodationOrderNumber = -1;
    if(accommodationBeforeUpdate) {
      updatedAccommodationOrderNumber = state.accommodations.indexOf(accommodationBeforeUpdate);
      console.log('To jerst udatedAccOrderNumber:', updatedAccommodationOrderNumber);
    }
    let accommodationsCopy = state.accommodations.slice();
    accommodationsCopy.splice(updatedAccommodationOrderNumber, 1, accommodation);

    return ({
      ...state,
      accommodations: accommodationsCopy,
    })
  }),
  on(markSaveAccommodationBtnClicked, (state) => ({
    ...state,
    saveAccommodationButtonRecentlyClicked: true,
  })),
  on(markSaveAccommodationBtnUnClicked, (state) => ({
    ...state,
    saveAccommodationButtonRecentlyClicked: false,
  })),
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
export const isSaveAccommodationButtonRecentlyClicked = createSelector(
  getAccommodationsState,
  (state: IAccommodationState) => state.saveAccommodationButtonRecentlyClicked
);

