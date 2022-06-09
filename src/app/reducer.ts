import { createReducer, on, Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { setCTAVisibility, toggleDrawerState } from './actions';
import { participantsReducer } from './participants/participants.reducer';
import { IParticipantsState } from './interfaces/participant-state';
import { IAccommodationState } from './interfaces/accommodation-state';
import { accommodationsReducer } from './accommodation/accommodation.reducer';
import { IOtherAccommodationState } from './interfaces/other-accommodation-state';
import { otherAccommodationsReducer } from './accommodation/other-accommodation.reducer';

const initialGeneralState: IGeneralState = {
  callToActionVisible: true,
  drawerOpened: false,
}

const _generalReducer = createReducer(
  initialGeneralState,
  on(setCTAVisibility, (state, { visible }) => ({ ...state, callToActionVisible: visible })),
  on(toggleDrawerState, (state) => ({ ...state, drawerOpened: !state.drawerOpened})),
)


function generalReducer(state: any, action: Action) {
  return _generalReducer(state, action);
}


export interface IAppState {
  participantsState: IParticipantsState;
  accommodationsState: IAccommodationState;
  otherAccommodationsState: IOtherAccommodationState;
  generalState: IGeneralState;
}

export interface IGeneralState {
  callToActionVisible: boolean;
  drawerOpened: boolean;
}


export const reducers: ActionReducerMap<IAppState> = {
  participantsState: participantsReducer,
  accommodationsState: accommodationsReducer,
  otherAccommodationsState: otherAccommodationsReducer,
  generalState: generalReducer,
}

export const getGeneralState = createFeatureSelector<IGeneralState>('generalState')
export const isCTAVisible = createSelector(
  getGeneralState,
  (state: IGeneralState) => state.callToActionVisible
);
