import { props, createAction } from '@ngrx/store';
import { callbackify } from 'util';
import { IParticipant } from '../interfaces/participant';

export const fetchParticipantsDataRequest = createAction(
  '[Participants] Fetch participants from data base - request',
)

export const fetchParticipantsDataSuccess = createAction(
  '[Participants] Fetch participants from data base - success',
  props<{ participantList: IParticipant[] }>()
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
  props<{ participantId: string }>()
)

export const deleteParticipantSuccess = createAction(
  '[Participants] Delete participant - success',
  props<{ participantId: string }>()
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

// export const occupySelectedRoomRequest = createAction(
//   '[Participants] Occupy selected room - request',
//   props<{ participant: IParticipant }>
// )

// export const occupySelectedRoomSuccess = createAction(
//   '[Participants] Occupy selected room - success',
//   props<{ participant: IParticipant }>
// )

export const updateParticipantRequest = createAction(
  '[Participants] Update participant - request',
  props<{ participant: IParticipant }>(),
)

export const updateParticipantSuccess = createAction(
  '[Participants] Update participant - success',
  props<{ participant: IParticipant }>()
)

export const markSaveParticipantBtnClicked = createAction(
  '[Participants] Mark save participant button as clicked'
)

export const markSaveParticipantBtnUnClicked = createAction(
  '[Participants] Mark save participant button as unclicked'
)

