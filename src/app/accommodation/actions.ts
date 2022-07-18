import { props, createAction } from '@ngrx/store';
import { IAccommodation } from '../interfaces/accommodation';

export const addAccommodationRequest = createAction(
  '[Accommodations] Add newly created accommodation - request',
  props<{ newAccommodation: IAccommodation }>()
);

export const addAccommodationSuccess = createAction(
  '[Accommodations] Add newly created accommodation - success',
  props<{ newAccommodation: IAccommodation }>()
);
