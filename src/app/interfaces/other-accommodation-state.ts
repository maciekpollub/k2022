import { IOtherAccommodation } from './other-accommodation';
export interface IOtherAccommodationState {
  otherAccommodations: IOtherAccommodation[];
  activeOtherAccommodation: IOtherAccommodation | undefined;
}
