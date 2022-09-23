import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, combineLatest, of, filter } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { fetchOtherAccommodationsDataRequest, fetchOtherAccommodationsDataSuccess,
    updateOtherAccommodationRequest, updateOtherAccommodationSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { OtherAccommodationService } from '../services/other-accommodation.service';
import { Router } from '@angular/router';
import { IParticipant } from '../interfaces/participant';
import { AccommodationService } from '../services/accommodation.service';
import { updateParticipantRequest } from '../participants/actions';
import { deleteOtherAccommodationRequest, deleteOtherAccommodationSuccess, addOtherAccommodationRequest,
        addOtherAccommodationSuccess, supplyOtherAccommodationsWithFBKeysRequest,
        supplyOtherAccommodationsWithFBKeysSuccess } from './actions';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { drawOtherAccommodationUpdateConsequences, closeOtherAccommodationUpdate } from './actions';

@Injectable()

export class OtherAccommodationEffects {

  fetchOtherAccommodations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchOtherAccommodationsDataRequest.type),
    switchMap(() => this.fBSrv.getOtherAccommodationList().pipe(
      filter(otherAccommodations => !!otherAccommodations),
      map((otherAccommodations) => fetchOtherAccommodationsDataSuccess({ otherAccommodationList: otherAccommodations })),
      catchError(() => EMPTY)
    ))
  ));

  supplyOtherAccommodationsWithKeys$ = createEffect(() => this.actions$.pipe(
    ofType(supplyOtherAccommodationsWithFBKeysRequest.type),
    switchMap(() => this.fBSrv.supplyOtherAccommodationsWithFBKeys().pipe(
      map((otherAccommodationsWithKeys) => supplyOtherAccommodationsWithFBKeysSuccess({ otherAccommodationsWithKeys })),
      catchError(() => EMPTY)
    ))
  ));

  addOtherAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(addOtherAccommodationRequest.type),
    switchMap((action) => of(this.fBSrv.addOtherAccommodation(action['newOtherAccommodation'])).pipe(
      map(() => addOtherAccommodationSuccess({ newOtherAccommodation: action['newOtherAccommodation'] })),
      catchError(() => EMPTY)
    )),
    tap(() => this.router.navigate(['accommodation', 'other-list']))
  ));

  updateOtherAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateOtherAccommodationRequest.type),
    switchMap((action) => this.fBSrv.updateOtherAccommodation(action['otherAccommodation']).pipe(
      map(() => updateOtherAccommodationSuccess({ otherAccommodation: action['otherAccommodation'], updatePart: action['updatePart'] })),
      catchError(() => EMPTY)
    )),
  ));

  successfullyUpdateOtherAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateOtherAccommodationSuccess.type),
    switchMap((action) => of(drawOtherAccommodationUpdateConsequences({ otherAccommodation: action['otherAccommodation'], updatePart: action['updatePart'] })).pipe(
      map((v) => v)
    ))
  ));

  drawUpdateConsequences$ = createEffect(() => this.actions$.pipe(
    ofType(drawOtherAccommodationUpdateConsequences.type),
    switchMap((action) => {
      let part$: Observable<IParticipant>;
      let otherAccommodation = action['otherAccommodation'];
      let surname = otherAccommodation['nazwiska'];
      if(surname) {
        // during edition, a participant has been assigned to the accommodation (rare...but possible)
        part$ = this.accomSrv.findParticipantByIncomingOccupiersSurname(surname);
      } else {
        // participant assigned to the accom has been relieved and thus, participant update is inevitable
        part$ = this.othAccomSrv.findParticipantByRelievedOccupiersSurname();
      }
      return combineLatest([part$, this.othAccomSrv.checkIfSaveOtherAccommodationBtnWasRecentlyClicked()]).pipe(
        // take(1),
        map(([part, wasClicked]) => {
          let participantUpdated: IParticipant;
          let actionToTake: any;
          if(part && action['updatePart']) {
            if(surname) {
              participantUpdated = {...part, 'zakwaterowanie': otherAccommodation['pokój']};
            } else {
              participantUpdated = {...part, 'zakwaterowanie': ''};
            }
            actionToTake = updateParticipantRequest({ participant: participantUpdated, updateAcmd: false });
            if(wasClicked) { this.router.navigate(['accommodation', 'other-list']) }
            return actionToTake;
          } else {
            if(wasClicked) {this.router.navigate(['accommodation', 'other-list'])};
            return closeOtherAccommodationUpdate();
          }
        }),
        // tap(() => this.othAccomSrv.emptyRelievedActiveOtherAccommodationOccupier())
      );
    }),
  ));

  deleteOtherAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(deleteOtherAccommodationRequest.type),
    switchMap((action) => {
      const otherAccommodation_: IOtherAccommodation = action['otherAccommodation'];
      return this.fBSrv.deleteOtherAccommodation(otherAccommodation_?.id).pipe(
        map(() => deleteOtherAccommodationSuccess({ otherAccommodation: otherAccommodation_ })),
        catchError(() => EMPTY)
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private accomSrv: AccommodationService,
    private othAccomSrv: OtherAccommodationService,
    private router: Router,
  ) {

  }
}
