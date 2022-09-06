import { Injectable, OnDestroy } from '@angular/core';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { isSaveParticipantButtonRecentlyClicked } from '../participants/participants.reducer';
import { relieveActiveParticpantData } from '../participants/actions';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService implements OnDestroy {

  subs = new Subscription();

  constructor(
    private store: Store<IAppState>,
  ) { }

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
    return this.store.select(isSaveParticipantButtonRecentlyClicked);
  }
  relieveActiveParticipantData() {
    return this.store.dispatch(relieveActiveParticpantData());
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }
}
