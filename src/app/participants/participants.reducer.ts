import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { fetchSpreadSheet } from '../actions';
import { IParticipantsState } from '../interfaces/participant-state';
import { addParticipant } from './actions';

const initialState: IParticipantsState = {
  participants: [],
}

const _participantsReducer = createReducer(
  initialState,
  on(fetchSpreadSheet, (state, { fetchedDataParticipants, fetchedDataAccommodations }) => ({
    ...state,
    participants: fetchedDataParticipants
  })),
  on(addParticipant, (state, { newParticipant } ) => ({
    ...state,
    participants: [...state.participants, newParticipant]
  })),
)
export function participantsReducer(state: any, action: Action) {
  return _participantsReducer(state, action);
}

export const getParticipantsState = createFeatureSelector<IParticipantsState>('participantsState');
export const getParticipants = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.participants
  );
