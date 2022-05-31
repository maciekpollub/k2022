import { createAction, props } from '@ngrx/store';
import { IParticipant } from './interfaces/participant';
import { IAccommodation } from './interfaces/accommodation';

export const fetchSpreadSheet = createAction(
  '[App Component] Fetch data from the xlsx file',
  props<{
    fetchedDataParticipants: IParticipant[],
    fetchedDataAccommodations: IAccommodation[],
  }>()
  );

export const setCTAVisibility = createAction(
  '[App Component] Set CallToAction button visibility',
  props<{ visible: boolean }>()
)

export const toggleDrawerState = createAction(
  '[App Component] Set drawer state',
)
