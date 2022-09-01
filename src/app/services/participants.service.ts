import { Injectable, OnDestroy } from '@angular/core';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { isSaveParticipantButtonRecentlyClicked } from '../participants/participants.reducer';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService implements OnDestroy {

  subs = new Subscription();

  constructor(
    private store: Store<IAppState>,
  ) { }

  isTaken(accom: any) {
    return accom['nazwiska'] || (!accom['nazwiska'] && (accom['przydział'] !== ''));
  }

  isSubjectToAboveAccom(accom: IAccommodation | IOtherAccommodation) {
    return !accom['nazwiska'] && (accom['wolne łóżka'] >= 0);
  }

  checkIfSaveParticipantBtnWasRecentlyClicked() {
    return this.store.select(isSaveParticipantButtonRecentlyClicked);
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }
}
