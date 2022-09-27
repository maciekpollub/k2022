import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of, combineLatest } from 'rxjs';
import { map, catchError, switchMap, tap, filter, startWith } from 'rxjs/operators';
import { fetchAccommodationsDataRequest, updateAccommodationRequest,
      updateAccommodationSuccess, fetchAccommodationsDataSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AccommodationService } from '../services/accommodation.service';
import { deleteAccommodationRequest, deleteAccommodationSuccess, addAccommodationRequest,
        addAccommodationSuccess, supplyAccommodationsWithFBKeysRequest,
        supplyAccommodationsWithFBKeysSuccess, drawAccommodationUpdateConsequences,
        closeAccommodationUpdate } from './actions';
import { IParticipant } from '../interfaces/participant';
import { updateParticipantRequest, loadActiveParticipantDataSuccess } from '../participants/actions';
import { IAccommodation } from '../interfaces/accommodation';
import { FetchedDataService } from '../services/fetched-data.service';
import { goToAssignedParticipant, relieveActiveAccommodationData } from './actions';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { start } from 'repl';

@Injectable()

export class AccommodationEffects {

  fetchAccommodations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchAccommodationsDataRequest.type),
    switchMap(() => this.fBSrv.getAccommodationList().pipe(
      filter(accommodations => !!accommodations),
      map((accommodations) => fetchAccommodationsDataSuccess({ accommodationList: accommodations })),
      catchError(() => EMPTY)
    ))
  ));

  supplyAccommodationsWithKeys$ = createEffect(() => this.actions$.pipe(
    ofType(supplyAccommodationsWithFBKeysRequest.type),
    switchMap(() => this.fBSrv.supplyAccommodationsWithFBKeys().pipe(
      map((accommodationsWithKeys) => supplyAccommodationsWithFBKeysSuccess({ accommodationsWithKeys })),
      catchError(() => EMPTY)
    ))
  ));

  addAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(addAccommodationRequest.type),
    switchMap((action) => of(this.fBSrv.addAccommodation(action['newAccommodation'])).pipe(
      map(() => addAccommodationSuccess({ newAccommodation: action['newAccommodation'] })),
      catchError(() => EMPTY)
    )),
    // tap(() => relieveActiveAccommodationData()),
    tap(() => this.router.navigate(['accommodation', 'buzun-list']))
  ));

  updateAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccommodationRequest.type),
    switchMap((action) => this.fBSrv.updateAccommodation(action['accommodation']).pipe(
      map(() => updateAccommodationSuccess({ accommodation: action['accommodation'], updatePart: action['updatePart'] })),
      catchError(() => EMPTY)
    ))
  ));

  successfullyUpdateAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccommodationSuccess.type),
    switchMap((action) => of(drawAccommodationUpdateConsequences({ accommodation: action['accommodation'], updatePart: action['updatePart'] })).pipe(
      map((v) => v)
    ))
  ));

  drawUpdateConsequences$ = createEffect(() => this.actions$.pipe(
    ofType(drawAccommodationUpdateConsequences.type),
    switchMap((action) => {
      let part$: Observable<IParticipant>;
      let accommodation = action['accommodation'];
      // let updateParticipant = action['updatePart'];
      let surname = accommodation['nazwiska'];
      if(surname) {
        // during edition, a participant has been assigned to the accommodation (rare...but possible)
        part$ = this.accomSrv.findParticipantByIncomingOccupiersSurname(surname);
      } else {
        // participant assigned to the accom has been relieved and thus, participant update is inevitable
        part$ = this.accomSrv.findParticipantByRelievedOccupiersSurname();
      }
      return combineLatest([part$, this.accomSrv.checkIfSaveAccommodationBtnWasRecentlyClicked()]).pipe(
        // take(1),
        map(([part, wasClicked]) => {
          let participantUpdated: IParticipant;
          let actionToTake: any;
          if(part && action['updatePart']) {
            if(surname) {
              participantUpdated = {...part, 'zakwaterowanie': accommodation['pokój']};
            } else {
              participantUpdated = {...part, 'zakwaterowanie': ''};
            }
            actionToTake = updateParticipantRequest({ participant: participantUpdated, updateAcmd: false });
            if(wasClicked) { this.router.navigate(['accommodation', 'buzun-list']) }
            return actionToTake;
          } else {
            if(wasClicked) {this.router.navigate(['accommodation', 'buzun-list'])};
            return closeAccommodationUpdate();
          }
        }),
        // tap(() => this.accomSrv.emptyRelievedActiveAccommodationOccupier())
      );
    }),
  ));

  goToAssignedParticipant$ = createEffect(() => this.actions$.pipe(
    ofType(goToAssignedParticipant.type),
    switchMap((action) => {
      let acc: IAccommodation | IOtherAccommodation = action['room'];
      let participant: IParticipant;
      return this.accomSrv.findParticipantByIncomingOccupiersSurname(acc['nazwiska']).pipe(
        map(p => {
          participant = p;
          return loadActiveParticipantDataSuccess({ participantId: p.id.toString()});
        }),
        tap(() => this.accomSrv.goToParticipant(participant)),
        catchError(() => EMPTY)
      )
    })
  ));

  deleteAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(deleteAccommodationRequest.type),
    switchMap((action) => {
      const accommodation_: IAccommodation = action['accommodation'];
      return this.fBSrv.deleteAccommodation(accommodation_?.id).pipe(
        map(() => deleteAccommodationSuccess({ accommodation: accommodation_ })),
        catchError(() => EMPTY)
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private router: Router,
    private accomSrv: AccommodationService,
  ) {

  }
}
