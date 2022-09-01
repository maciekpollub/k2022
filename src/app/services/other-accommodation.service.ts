import { Injectable } from '@angular/core';
import { Subscription, take, zip, combineLatest } from 'rxjs';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { emptyRelievedActiveOtherAccommodationOccupier } from '../accommodation/actions';
import { isSaveOtherAccommodationButtonRecentlyClicked } from '../accommodation/other-accommodation.reducer';
import * as fromOtherAccommodations from '../accommodation/other-accommodation.reducer';
import * as fromParticipants from '../participants/participants.reducer';
import { IParticipant } from '../interfaces/participant';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OtherAccommodationService {

  subs = new Subscription();
  occupiersOtherAccommodation: IOtherAccommodation;

  constructor(
    private store: Store<IAppState>,
  ) { }

  findOtherAccommodationByItsOccupier(participant: IParticipant) {
    return this.store.select(fromOtherAccommodations.getOtherAccommodations).pipe(
      take(1),
      map((otherAccommodationList) => {
        if (participant.zakwaterowanie) {
          this.occupiersOtherAccommodation = otherAccommodationList.filter(a => a.pokój === participant.zakwaterowanie)[0];
        };
        // console.log('To jest occupiersOtherAccommodation: ', this.occupiersOtherAccommodation)
        return this.occupiersOtherAccommodation;
      })
    );
  }

  findRelievedOtherAccommodation() {
    return zip([
      this.store.select(fromOtherAccommodations.getOtherAccommodations),
      this.store.select(fromParticipants.getActiveParticipantRelievedRoom)
    ]).pipe(
      map(([otherAccommodationList, room]) => {
        let otherAccommodation;
        otherAccommodation = otherAccommodationList.filter(a => a.pokój === room)[0];
        return otherAccommodation;
      })
    )
  }

  findParticipantByRelievedOccupiersSurname() {
    return combineLatest([
      this.store.select(fromOtherAccommodations.getActiveOtherAccommodationRelievedOccupier),
      this.store.select(fromParticipants.getParticipants)]).pipe(
        map(([surname, participants]) => {
          return participants.filter(p => p.nazwisko === surname)[0];
        })
      );
  }

  emptyRelievedActiveOtherAccommodationOccupier() {
    this.store.dispatch(emptyRelievedActiveOtherAccommodationOccupier());
  }

  checkIfSaveOtherAccommodationBtnWasRecentlyClicked() {
    return this.store.select(isSaveOtherAccommodationButtonRecentlyClicked);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
