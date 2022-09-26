import { props, createAction } from '@ngrx/store';
import { IParticipant, IFBParticipant } from '../interfaces/participant';

export const fetchParticipantsDataRequest = createAction(
  '[Participants] Fetch participants from data base - request',
)

export const fetchParticipantsDataSuccess = createAction(
  '[Participants] Fetch participants from data base - success',
  props<{ participantList: IParticipant[] }>()
)

export const supplyParticipantsWithFBKeysRequest = createAction(
  '[Application start] Supply participants with Firebase keys - request',
)

export const supplyParticipantsWithFBKeysSuccess = createAction(
  '[Application start] Supply participants with Firebase keys - success',
  props<{ participantsWithKeys: IFBParticipant[]}>()
)

export const addParticipantRequest = createAction(
  '[Participants] Add newly created participant - request',
  props<{ newParticipant: IParticipant }>()
);

export const addParticipantSuccess = createAction(
  '[Participants] Add newly created participant - success',
  props<{ newParticipant: IParticipant }>()
);

export const deleteParticipantRequest = createAction(
  '[Participants] Delete participant - request',
  props<{ participant: IParticipant }>()
)

export const deleteParticipantSuccess = createAction(
  '[Participants] Delete participant - success',
  props<{ participant: IParticipant }>()
)

export const loadActiveParticipantDataRequest = createAction(
  '[Participants] Load active participant data - request',
  props<{ participantId: string }>()
)

export const loadActiveParticipantDataSuccess = createAction(
  '[Participants] Load active participant data - success',
  props<{ participantId: string }>()
)

export const relieveActiveParticpantData = createAction(
  '[Participants] Relieve active participant data',
)

export const relieveActiveParticipantRoom = createAction(
  '[Participants] Relieve active participant room',
)

export const goToAssignedRoom = createAction(
  '[Participant edit] Go to participants assigned room',
  props<{ participant: IParticipant }>()
)

export const updateParticipantRequest = createAction(
  '[Participants] Update participant - request',
  props<{ participant: IParticipant, updateAcmd: boolean }>(),
)

export const updateParticipantSuccess = createAction(
  '[Participants] Update participant - success',
  props<{ participant: IParticipant, updateAcmd: boolean }>()
)

export const drawParticipantUpdateConsequences = createAction(
  '[Participant update] Draw consequences after participants update',
  props<{ participant: IParticipant, updateAcmd: boolean }>()
)

export const closeParticipantUpdate = createAction(
  '[Participant update] Close the process of participant update.'
)

export const markSaveParticipantBtnClicked = createAction(
  '[Participants] Mark save participant button as clicked'
)

export const markSaveParticipantBtnUnClicked = createAction(
  '[Participants] Mark save participant button as unclicked'
)

