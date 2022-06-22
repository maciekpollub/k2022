import { props, createAction } from '@ngrx/store';
import { IParticipant } from '../interfaces/participant';

export const addParticipant = createAction(
  '[Participants] Add newly created participant',
  props<{ newParticipant: IParticipant }>()
);
