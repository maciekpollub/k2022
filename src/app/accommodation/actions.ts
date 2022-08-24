import { props, createAction } from '@ngrx/store';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { IParticipant } from '../interfaces/participant';


export const fetchAccommodationsDataRequest = createAction(
  '[Accommodations] Fetch accommodations from data base - request',
)

export const fetchAccommodationsDataSuccess = createAction(
  '[Accommodations] Fetch accommodations from data base - success',
  props<{ accommodationList: IAccommodation[] }>()
)

export const fetchOtherAccommodationsDataRequest = createAction(
  '[Accommodations] Fetch other accommodations from data base - request',
)

export const fetchOtherAccommodationsDataSuccess = createAction(
  '[Accommodations] Fetch other accommodations from data base - success',
  props<{ otherAccommodationList: IOtherAccommodation[] }>()
)

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

export const updateAccommodationRequest = createAction(
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

export const markSaveAccommodationBtnClicked = createAction(
  '[Accommodations] Mark save accommodation button as clicked'
)

export const markSaveAccommodationBtnUnClicked = createAction(
  '[Accommodations] Mark save accommodation button as unclicked'
)

export const markSaveOtherAccommodationBtnClicked = createAction(
  '[Other accommodations] Mark save other accommodation button as clicked'
)

export const markSaveOtherAccommodationBtnUnClicked = createAction(
  '[Other accommodations] Mark save other accommodation button as unclicked'
)

