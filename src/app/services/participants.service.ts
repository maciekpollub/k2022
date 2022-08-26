import { Injectable, OnDestroy } from '@angular/core';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from './firebase.service';
import { Subscription } from 'rxjs';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService implements OnDestroy {

  subs = new Subscription();

  constructor(

  ) { }

  isTaken(accom: IAccommodation | IOtherAccommodation) {
    return accom['nazwiska'] || (!accom['nazwiska'] && (accom['wolne łóżka'] >= 0));
  }

  isSubjectToAboveAccom(accom: IAccommodation | IOtherAccommodation) {
    return !accom['nazwiska'] && (accom['wolne łóżka'] >= 0);
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }
}
