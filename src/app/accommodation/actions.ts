import { props, createAction } from '@ngrx/store';
import { IAccommodation, IFBAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation, IFBOtherAccommodation } from '../interfaces/other-accommodation';


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

export const supplyAccommodationsWithFBKeysRequest = createAction(
  '[Application start] Supply accommodations with Firebase keys - request'
)

export const supplyAccommodationsWithFBKeysSuccess = createAction(
  '[Application start] Supply accommodations with Firebase keys - success',
  props<{ accommodationsWithKeys: IFBAccommodation[] }>()
)

export const supplyOtherAccommodationsWithFBKeysRequest = createAction(
  '[Application start] Supply other accommodations with Firebase keys - request'
)

export const supplyOtherAccommodationsWithFBKeysSuccess = createAction(
  '[Application start] Supply other accommodations with Firebase keys - success',
  props<{ otherAccommodationsWithKeys: IFBOtherAccommodation[] }>()
)

export const addAccommodationRequest = createAction(
  '[Accommodations] Add newly created accommodation - request',
  props<{ newAccommodation: IAccommodation }>()
);

export const addAccommodationSuccess = createAction(
  '[Accommodations] Add newly created accommodation - success',
  props<{ newAccommodation: IAccommodation }>()
);

export const addOtherAccommodationRequest = createAction(
  '[Other accommodations] Add newly created other accommodation - request',
  props<{ newOtherAccommodation: IOtherAccommodation }>()
);

export const addOtherAccommodationSuccess = createAction(
  '[Accommodations] Add newly created other accommodation - success',
  props<{ newOtherAccommodation: IOtherAccommodation }>()
);

export const deleteAccommodationRequest = createAction(
  '[Accommodations] Delete accommodation - request',
  props<{ accommodation: IAccommodation }>()
)

export const deleteAccommodationSuccess = createAction(
  '[Accommodations] Delete accommodation - success',
  props<{ accommodation: IAccommodation }>()
)

export const deleteOtherAccommodationRequest = createAction(
  '[Accommodations] Delete other accommodation - request',
  props<{ otherAccommodation: IOtherAccommodation }>()
)

export const deleteOtherAccommodationSuccess = createAction(
  '[Accommodations] Delete other accommodation - success',
  props<{ otherAccommodation: IOtherAccommodation }>()
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

export const relieveActiveAccommodationOccupier = createAction(
  '[Accommodation edit] Relieve active accommodation occupier',
)

export const goToAssignedParticipant = createAction(
  '[Accommodation edit] Go to room assigned participant',
  props<{ room: IAccommodation | IOtherAccommodation }>()
)

export const relieveActiveOtherAccommodationData = createAction(
  '[Accommodations] Relieve active other accommodation data',
)

export const relieveActiveOtherAccommodationOccupier = createAction(
  '[Other accommodation edit] Relieve active other accommodation occupier',
)

export const emptyRelievedActiveAccommodationOccupier = createAction(
  '[Accommodation edit] Empty the relieved active accommodation occupier',
)

export const emptyRelievedActiveOtherAccommodationOccupier = createAction(
  '[Other accommodation edit] Empty the relieved active other accommodation occupier',
)

export const updateAccommodationRequest = createAction(
  '[Accommodations] Update accommodation - request',
  props<{ accommodation: IAccommodation, updatePart: boolean }>()
)

export const updateAccommodationSuccess = createAction(
  '[Accommodations] Update accommodation - success',
  props<{ accommodation: IAccommodation, updatePart: boolean }>()
)

export const drawAccommodationUpdateConsequences = createAction(
  '[Accommodation update] Draw consequences after accommodation update',
  props<{ accommodation: IAccommodation, updatePart: boolean }>()
)

export const closeAccommodationUpdate = createAction(
  '[Accommodation update] Close the process of accommodation update'
)

export const updateOtherAccommodationRequest = createAction(
  '[Accommodations] Update other accommodation - request',
  props<{ otherAccommodation: IOtherAccommodation, updatePart: boolean }>()
)

export const updateOtherAccommodationSuccess = createAction(
  '[Accommodations] Update other accommodation - success',
  props<{ otherAccommodation: IOtherAccommodation, updatePart: boolean }>()
)

export const drawOtherAccommodationUpdateConsequences = createAction(
  '[Oter accommodation update] Draw consequences after other accommodation update',
  props<{ otherAccommodation: IOtherAccommodation, updatePart: boolean }>()
)

export const closeOtherAccommodationUpdate = createAction(
  '[Other accommodation update] Close the process of other accommodation update'
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

