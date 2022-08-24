import { createAction, props } from '@ngrx/store';


export const setCTAVisibility = createAction(
  '[App Component] Set CallToAction button visibility',
  props<{ visible: boolean }>()
)

export const toggleDrawerState = createAction(
  '[App Component] Set drawer state',
)
