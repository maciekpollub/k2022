import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { fetchAccommodationsDataRequest, updateAccommodationRequest,
      updateAccommodationSuccess, fetchAccommodationsDataSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AccommodationService } from '../services/accommodation.service';

@Injectable()

export class AccommodationEffects {

  fetchAccommodations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchAccommodationsDataRequest.type),
    switchMap(() => this.fBSrv.getAccommodationList().pipe(
      map((accommodations) => fetchAccommodationsDataSuccess({ accommodationList: accommodations })),
      catchError(() => EMPTY)
    ))
  ));

  updateAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccommodationRequest.type),
    switchMap((action) => this.fBSrv.updateAccommodation(action['accommodation']).pipe(
      map(() => updateAccommodationSuccess({ accommodation: action['accommodation'] })),
      catchError(() => EMPTY)
    )),
    tap(() => this.accomSrv.checkIfSaveAccommodationBtnWasRecentlyClicked().pipe(
      map((clicked) => {
        if(clicked) { this.router.navigate(['accommodation', 'buzun-list'])};
      })
    ).subscribe()),
  ));

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private router: Router,
    private accomSrv: AccommodationService,
  ) {

  }
}
