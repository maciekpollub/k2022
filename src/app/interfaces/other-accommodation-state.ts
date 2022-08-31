import { IOtherAccommodation } from './other-accommodation';
import { relieveActiveOtherAccommodationOccupier } from '../accommodation/actions';
export interface IOtherAccommodationState {
  otherAccommodations: IOtherAccommodation[];
  activeOtherAccommodation: IOtherAccommodation | undefined;
  relievedActiveOtherAccommodationOccupier: string;
  saveOtherAccommodationButtonRecentlyClicked: boolean;
}
