import { Injectable } from '@angular/core';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import * as fromParticipants from '../participants/participants.reducer';
import { relieveActiveParticpantData } from '../participants/actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  constructor(
    private store: Store<IAppState>,
    private router: Router
  ) { }

  getParticipantsWithFBKeys() {
    return this.store.select(fromParticipants.getParticipantsWithFBKeys);
  }

  isTaken(accom: any) {
    if(accom){
      return accom['nazwiska'] || (!accom['nazwiska'] && (accom['przydział'] !== ''));
    }
    return;
  }

  isSubjectToAboveAccom(accom: IAccommodation | IOtherAccommodation) {
    if(accom) {
      return (!accom['nazwiska']) && (accom['wolne łóżka']) && (accom['wolne łóżka'] >= 0);
    }
    return;
  }

  checkIfSaveParticipantBtnWasRecentlyClicked() {
    return this.store.select(fromParticipants.isSaveParticipantButtonRecentlyClicked);
  }

  relieveActiveParticipantData() {
    return this.store.dispatch(relieveActiveParticpantData());
  }

  goToRoom(room: IAccommodation | IOtherAccommodation) {
    if(room.hasOwnProperty('il tap 1-os')) {
      this.router.navigate(['accommodation', 'buzun-list', 'edit', room.id]);
    } else {
      this.router.navigate(['accommodation', 'other-list', 'edit', room.id]);
    }
  }
}
