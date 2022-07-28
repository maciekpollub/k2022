import { props, createAction } from '@ngrx/store';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';

export const addAccommodationRequest = createAction(
  '[Accommodations] Add newly created accommodation - request',
  props<{ newAccommodation: IAccommodation }>()
);

export const addAccommodationSuccess = createAction(
  '[Accommodations] Add newly created accommodation - success',
  props<{ newAccommodation: IAccommodation }>()
);

export const addOtherAccommodationSuccess = createAction(
  '[Accommodations] Add newly created other accommodation - success',
  props<{ newOtherAccommodation: IOtherAccommodation }>()
);

export const deleteAccommodationRequest = createAction(
  '[Accommodations] Delete accommodation - request',
  props<{ accommodationId: string }>()
)

export const deleteAccommodationSuccess = createAction(
  '[Accommodations] Delete accommodation - success',
  props<{ accommodationId: string }>()
)

export const deleteOtherAccommodationRequest = createAction(
  '[Accommodations] Delete other accommodation - request',
  props<{ otherAccommodationId: string }>()
)

export const deleteOtherAccommodationSuccess = createAction(
  '[Accommodations] Delete other accommodation - success',
  props<{ otherAccommodationId: string }>()
)
