import { Injectable } from '@angular/core';
import { IParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { Store } from '@ngrx/store';
import * as fromRoot from './../reducer';
import { fetchSpreadSheet } from '../actions';
export let participantsDB: IParticipant[] = [];
export let accommodationsDB: IAccommodation[] = []
export let otherAccommodationsDB: IOtherAccommodation[] = [];

export let participantsDBJson: any;


@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  constructor(private store: Store<fromRoot.IAppState>) { }

  pushToLocalDB(participants: IParticipant[],
                accommodations: IAccommodation[],
                otherAccommodations: IOtherAccommodation[]): void {
    participantsDB = participants;
    accommodationsDB = accommodations;
    otherAccommodationsDB = otherAccommodations

    participantsDBJson = JSON.stringify(participantsDB);

    this.store.dispatch(fetchSpreadSheet({
      fetchedDataParticipants: participantsDB,
      fetchedDataAccommodations: accommodationsDB,
      fetchedDataOtherAccommodations: otherAccommodationsDB,
    }));
  }
}
