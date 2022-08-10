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

export const loadActiveAccommodationDataRequest = createAction(
  '[Accommodations] Load active accommodation data - request',
  props<{ accommodationId: string }>()
)

export const loadActiveAccommodationDataSuccess = createAction(
  '[Accommodations] Load active accommodation data - success',
  props<{ accommodationId: string }>()
)

export const loadActiveOtherAccommodationDataRequest = createAction(
  '[Accommodations] Load active other accommodation data - request',
  props<{ otherAccommodationId: string }>()
)

export const loadActiveOtherAccommodationDataSuccess = createAction(
  '[Accommodations] Load active other accommodation data - success',
  props<{ otherAccommodationId: string }>()
)

export const relieveActiveAccommodationData = createAction(
  '[Accommodations] Relieve active accommodation data',
)

export const relieveActiveOtherAccommodationData = createAction(
  '[Accommodations] Relieve active other accommodation data',
)

export const updateAccomodationRequest = createAction(
  '[Accommodations] Update accommodation - request',
  props<{ accommodation: IAccommodation }>()
)

export const updateAccommodationSuccess = createAction(
  '[Accommodations] Update accommodation - success',
  props<{ accommodation: IAccommodation }>()
)

export const updateOtherAccommodationRequest = createAction(
  '[Accommodations] Update other accommodation - request',
  props<{ otherAccommodation: IOtherAccommodation }>()
)

export const updateOtherAccommodationSuccess = createAction(
  '[Accommodations] Update other accommodation - success',
  props<{ otherAccommodation: IOtherAccommodation }>()
)
