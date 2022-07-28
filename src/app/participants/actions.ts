import { props, createAction } from '@ngrx/store';
import { IParticipant } from '../interfaces/participant';

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
