import { IAccommodation } from './accommodation';
export interface IAccommodationState {
  accommodations: IAccommodation[];
  activeAccommodation: IAccommodation | undefined;
  relievedActiveAccommodationOccupier: string,
  saveAccommodationButtonRecentlyClicked: boolean;

}
