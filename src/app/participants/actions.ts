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
