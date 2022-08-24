import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap, finalize, mapTo } from 'rxjs/operators';
import { fetchOtherAccommodationsDataRequest, fetchOtherAccommodationsDataSuccess,
    updateOtherAccommodationRequest, updateOtherAccommodationSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { OtherAccommodationService } from '../services/other-accommodation.service';
import { Router } from '@angular/router';

@Injectable()

export class OtherAccommodationEffects {

  fetchOtherAccommodations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchOtherAccommodationsDataRequest.type),
    switchMap(() => this.fBSrv.getOtherAccommodationList().pipe(
      map((otherAccommodations) => fetchOtherAccommodationsDataSuccess({ otherAccommodationList: otherAccommodations })),
      catchError(() => EMPTY)
    ))
  ));

  updateOtherAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateOtherAccommodationRequest.type),
    switchMap((action) => this.fBSrv.updateOtherAccommodation(action['otherAccommodation']).pipe(
      map(() => updateOtherAccommodationSuccess({ otherAccommodation: action['otherAccommodation'] })),
      catchError(() => EMPTY)
    )),
    tap(() => this.othAccomSrv.checkIfSaveOtherAccommodationBtnWasRecentlyClicked().pipe(
      map((clicked) => {
        if(clicked) { this.router.navigate(['accommodation', 'other-list']) };
      })
    ).subscribe()),
  ));

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private othAccomSrv: OtherAccommodationService,
    private router: Router,
  ) {

  }
}
