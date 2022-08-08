import { Action, createReducer, on, createFeatureSelector, createSelector, ActionReducerMap } from '@ngrx/store';
import { fetchData } from '../actions';
import { IParticipantsState } from '../interfaces/participant-state';
import { addParticipantSuccess, deleteParticipantSuccess, loadActiveParticipantDataSuccess, relieveActiveParticpantData, updateParticipantSuccess } from './actions';

const initialState: IParticipantsState = {
  participants: [],
  activeParticipant: undefined,
}

const _participantsReducer = createReducer(
  initialState,
  on(fetchData, (state, { fetchedDataParticipants, fetchedDataAccommodations }) => ({
    ...state,
    participants: fetchedDataParticipants
  })),
  on(addParticipantSuccess, (state, { newParticipant } ) => ({
    ...state,
    participants: [...state.participants, newParticipant]
  })),
  on(deleteParticipantSuccess, (state, { participantId } ) => ({
    ...state,
    participants: [...state.participants.filter(p => p.id.toString() !== participantId)]
  })),
  on(loadActiveParticipantDataSuccess, (state, { participantId }) => ({
    ...state,
    activeParticipant: state.participants.find(p => p.id === +participantId)
  })),
  on(relieveActiveParticpantData, (state) => ({
    ...state,
    activeParticipant: undefined,
  })),
  on(updateParticipantSuccess, (state, { participant }) => {
    const participantBeforeUpdate = state.participants.find(p => p.id === participant.id);
    let updatedParticipantOrderNumber = -1;
    if (participantBeforeUpdate) {
      updatedParticipantOrderNumber = state.participants.indexOf(participantBeforeUpdate);
    }
    let participantsCopy = state.participants.slice();
    participantsCopy.splice(updatedParticipantOrderNumber, 1, participant);

    return ({
      ...state,
      participants: participantsCopy,
    })
  }),
)
export function participantsReducer(state: any, action: Action) {
  return _participantsReducer(state, action);
}

export const getParticipantsState = createFeatureSelector<IParticipantsState>('participantsState');
export const getParticipants = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.participants
  );
export const getActiveParticipant = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.activeParticipant
);



