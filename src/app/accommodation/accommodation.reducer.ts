import { IAccommodationState } from '../interfaces/accommodation-state';
import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { fetchData } from '../actions';

const initialState: IAccommodationState = {
  accommodations: [],
}

const _accommodationsReducer = createReducer(
  initialState,
  on(fetchData, (state, { fetchedDataAccommodations }) => ({
    ...state,
    accommodations: fetchedDataAccommodations
    })
  )
)
export function accommodationsReducer(state: any, action: Action){
  return _accommodationsReducer(state, action);
}

export const getAccommodationsState = createFeatureSelector<IAccommodationState>('accommodationsState');
export const getAccommodations = createSelector(
  getAccommodationsState,
  (state: IAccommodationState) => state.accommodations
);
