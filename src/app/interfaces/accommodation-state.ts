import { IAccommodation } from './accommodation';
export interface IAccommodationState {
  accommodations: IAccommodation[];
  accommodationsWithFBKeys: any[],
  activeAccommodation: IAccommodation | undefined;
  relievedActiveAccommodationOccupier: string,
  saveAccommodationButtonRecentlyClicked: boolean;

}
