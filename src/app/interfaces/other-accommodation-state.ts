import { IOtherAccommodation } from './other-accommodation';

export interface IOtherAccommodationState {
  otherAccommodations: IOtherAccommodation[];
  otherAccommodationsWithFBKeys: any[],
  activeOtherAccommodation: IOtherAccommodation | undefined;
  relievedActiveOtherAccommodationOccupier: string;
  saveOtherAccommodationButtonRecentlyClicked: boolean;
}
