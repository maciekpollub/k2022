import { Injectable, OnDestroy } from '@angular/core';
import { IAccommodation } from '../interfaces/accommodation';
import { deleteAccommodationSuccess } from '../accommodation/actions';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService implements OnDestroy {

  subs = new Subscription();

  constructor(
    private store: Store<IAppState>,
    private fBSrv: FirebaseService,
  ) { }

  delete(accommodation: IAccommodation) {
    this.store.dispatch(deleteAccommodationSuccess({accommodationId: accommodation.id.toString()}));
    this.subs.add(
      this.fBSrv.deleteAccommodation(accommodation.id.toString()).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
