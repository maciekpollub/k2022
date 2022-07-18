import { createAction, props } from '@ngrx/store';
import { IParticipant } from './interfaces/participant';
import { IAccommodation } from './interfaces/accommodation';
import { IOtherAccommodation } from './interfaces/other-accommodation';

export const fetchData = createAction(
  '[App Component] Fetch data from firebase store',
  props<{
    fetchedDataParticipants: IParticipant[],
    fetchedDataAccommodations: IAccommodation[],
    fetchedDataOtherAccommodations: IOtherAccommodation[],
  }>()
  );

export const setCTAVisibility = createAction(
  '[App Component] Set CallToAction button visibility',
  props<{ visible: boolean }>()
)

export const toggleDrawerState = createAction(
  '[App Component] Set drawer state',
)
