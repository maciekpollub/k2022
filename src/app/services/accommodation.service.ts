import { Injectable, OnDestroy } from '@angular/core';
import { IAccommodation } from '../interfaces/accommodation';
import { emptyRelievedActiveAccommodationOccupier } from '../accommodation/actions';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { map, Subscription, take, zip, combineLatest } from 'rxjs';
import { IParticipant } from '../interfaces/participant';
import * as fromAccommodations from '../accommodation/accommodation.reducer';
import * as fromParticipants from '../participants/participants.reducer';
import { isSaveAccommodationButtonRecentlyClicked } from '../accommodation/accommodation.reducer';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService implements OnDestroy {

  subs = new Subscription();
  occupiersAccommodation: IAccommodation;

  constructor(
    private store: Store<IAppState>,
    private router: Router,
  ) { }

  getAccommodationsWithFBKeys() {
    return this.store.select(fromAccommodations.getAccommodationsWithFBKeys);
  }

  findAccommodationByItsOccupier(participant: IParticipant) {
    return this.store.select(fromAccommodations.getAccommodations).pipe(
      take(1),
      map((accommodationList) => {
        if (participant.zakwaterowanie) {
          this.occupiersAccommodation = accommodationList.filter(a => {
            if(a.nazwiska) {
              return a.pokój === participant.zakwaterowanie && a.nazwiska?.trim() === participant.nazwisko?.trim();
            } else {
              return a.pokój === participant.zakwaterowanie;
            }
          })[0];
          console.log('A to jest zakwaterowanie znalezione w metodzie findAccommodationByItsOccupeir: ', this.occupiersAccommodation)
        };
        return this.occupiersAccommodation;
      })
    );
  }

  findRelievedAccommodation() {
    return zip([
      this.store.select(fromAccommodations.getAccommodations),
      this.store.select(fromParticipants.getActiveParticipantRelievedRoom)
    ]).pipe(
      map(([accommodationList, room]) => {
        let accommodation;
        accommodation = accommodationList.filter(a => a.pokój === room)[0];
        return accommodation;
      })
    );
  }

  findParticipantByIncomingOccupiersSurname(surname: string) {
    return this.store.select(fromParticipants.getParticipants).pipe(
      take(1),
      map((participants: IParticipant[]) => participants.filter(p => p['nazwisko']?.trim() === surname?.trim())[0])
    );
  }

  findParticipantByRelievedOccupiersSurname() {
    return combineLatest([
      this.store.select(fromAccommodations.getActiveAccommodationRelievedOccupier),
      this.store.select(fromParticipants.getParticipants)]).pipe(
        take(1),
        map(([surname, participants]) => {
          return participants.filter(p => p.nazwisko === surname)[0];
        })
      );
  }

  emptyRelievedActiveAccommodationOccupier() {
    this.store.dispatch(emptyRelievedActiveAccommodationOccupier());
  }

  checkIfSaveAccommodationBtnWasRecentlyClicked() {
    return this.store.select(isSaveAccommodationButtonRecentlyClicked);
  }

  goToParticipant(participant: IParticipant) {
    this.router.navigate(['participants', 'edit', participant.id.toString()]);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
