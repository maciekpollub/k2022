import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from './firebase.service';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { deleteOtherAccommodationSuccess } from '../accommodation/actions';

@Injectable({
  providedIn: 'root'
})
export class OtherAccommodationService {

  subs = new Subscription();

  constructor(
    private store: Store<IAppState>,
    private fBSrv: FirebaseService,
  ) { }

  delete(otherAccommodation: IOtherAccommodation) {
    this.store.dispatch(deleteOtherAccommodationSuccess({otherAccommodationId: otherAccommodation.id.toString()}));
    this.subs.add(
      this.fBSrv.deleteAccommodation(otherAccommodation.id.toString()).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
