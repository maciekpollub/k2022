import { Injectable, OnDestroy } from '@angular/core';
import { IAccommodation } from '../interfaces/accommodation';
import { deleteAccommodationSuccess, emptyRelievedActiveAccommodationOccupier } from '../accommodation/actions';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { map, Subscription, take, zip, combineLatest } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { IParticipant } from '../interfaces/participant';
import * as fromAccommodations from '../accommodation/accommodation.reducer';
import * as fromParticipants from '../participants/participants.reducer';
import { isSaveAccommodationButtonRecentlyClicked } from '../accommodation/accommodation.reducer';


@Injectable({
  providedIn: 'root'
})
export class AccommodationService implements OnDestroy {

  subs = new Subscription();
  occupiersAccommodation: IAccommodation;

  constructor(
    private store: Store<IAppState>,
    private fBSrv: FirebaseService,
  ) { }

  findAccommodationByItsOccupier(participant: IParticipant) {
    return this.store.select(fromAccommodations.getAccommodations).pipe(
      take(1),
      map((accommodationList) => {
        if (participant.zakwaterowanie) {
          this.occupiersAccommodation =  accommodationList.filter(a => a.pokój === participant.zakwaterowanie)[0];
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
      map((participants: IParticipant[]) => participants.filter(p => p['nazwisko'] === surname)[0])
    );
  }

  findParticipantByRelievedOccupiersSurname() {
    return zip([
      this.store.select(fromAccommodations.getActiveAccommodationRelievedOccupier),
      this.store.select(fromParticipants.getParticipants)]).pipe(
        map(([surname, participants]) => {
          console.log('To natomiast jest surname z metody findParticpantByRelievedCooucpierSurname w accomSrv: ', surname)
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
