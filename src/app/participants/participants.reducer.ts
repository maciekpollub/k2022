import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IParticipantsState } from '../interfaces/participant-state';
import { addParticipantSuccess, deleteParticipantSuccess,
  loadActiveParticipantDataSuccess, relieveActiveParticpantData,
  updateParticipantSuccess, fetchParticipantsDataSuccess, relieveActiveParticipantRoom,
  markSaveParticipantBtnClicked, markSaveParticipantBtnUnClicked, supplyParticipantsWithFBKeysSuccess } from './actions';

const initialState: IParticipantsState = {
  participants: [],
  participantsWithFBKeys: [],
  activeParticipant: undefined,
  relievedActiveParticipantRoom: '',
  saveParticipantButtonRecentlyClicked: false,
}

const _participantsReducer = createReducer(
  initialState,
  on(fetchParticipantsDataSuccess, (state, { participantList }) => {
    return ({
      ...state,
      participants: participantList
    })
  }),
  on(supplyParticipantsWithFBKeysSuccess, (state, { participantsWithKeys }) => {
    return ({
      ...state,
      participantsWithFBKeys: participantsWithKeys
    })
  }),
  on(addParticipantSuccess, (state, { newParticipant } ) => ({
    ...state,
    participants: [...state.participants, newParticipant]
  })),
  on(deleteParticipantSuccess, (state, { participant } ) => ({
    ...state,
    participants: [...state.participants.filter(p => p.id?.toString() !== participant.id.toString())]
  })),
  on(loadActiveParticipantDataSuccess, (state, { participantId }) => ({
    ...state,
    activeParticipant: state.participants.find(p => p.id === +participantId)
  })),
  on(relieveActiveParticpantData, (state) => ({
    ...state,
    activeParticipant: undefined,
  })),
  on(relieveActiveParticipantRoom, (state) => {
    let activeParticipantWithRelievedAccommodation;
    let relievedRoom;
    if(state.activeParticipant) {
      activeParticipantWithRelievedAccommodation = {
        ...state.activeParticipant,
        'zakwaterowanie': ''
      };
      relievedRoom = state.activeParticipant.zakwaterowanie;
    }

    return ({
      ...state,
      relievedActiveParticipantRoom: relievedRoom ?? '',
      activeParticipant: activeParticipantWithRelievedAccommodation,
    })
  }),
  on(updateParticipantSuccess, (state, { participant, updateAcmd }) => {
    console.log('To jest participantZupdateowany: ', participant, ' a to wartość updateAcmd: ', updateAcmd);
    const participantBeforeUpdate = state.participants.find(p => p?.id === participant.id);
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
  on(markSaveParticipantBtnClicked, (state) => ({
    ...state,
    saveParticipantButtonRecentlyClicked: true,
  })),
  on(markSaveParticipantBtnUnClicked, (state) => ({
    ...state,
    saveParticipantButtonRecentlyClicked: false,
  })),
)

export function participantsReducer(state: any, action: Action) {
  return _participantsReducer(state, action);
}

export const getParticipantsState = createFeatureSelector<IParticipantsState>('participantsState');
export const getParticipants = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.participants
)
export const getParticipantsWithFBKeys = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.participantsWithFBKeys
)
export const getActiveParticipant = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.activeParticipant
)
export const getActiveParticipantRelievedRoom = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.relievedActiveParticipantRoom
)
export const isSaveParticipantButtonRecentlyClicked = createSelector(
  getParticipantsState,
  (state: IParticipantsState) => state.saveParticipantButtonRecentlyClicked
)

