import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, take, combineLatest, zip } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap, finalize, mapTo } from 'rxjs/operators';
import { fetchOtherAccommodationsDataRequest, fetchOtherAccommodationsDataSuccess,
    updateOtherAccommodationRequest, updateOtherAccommodationSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { OtherAccommodationService } from '../services/other-accommodation.service';
import { Router } from '@angular/router';
import { IParticipant } from '../interfaces/participant';
import { AccommodationService } from '../services/accommodation.service';
import { updateParticipantRequest } from '../participants/actions';
import { deleteOtherAccommodationRequest, deleteOtherAccommodationSuccess } from './actions';

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
      switchMap(() => {
        let part$: Observable<IParticipant>;
        let otherAccommodation = action['otherAccommodation'];
        let updateParticipant = action['updatePart'];
        let surname = otherAccommodation['nazwiska'];
        if(surname) {
          // during edition, a participant has been assigned to the accommodation (rare...but possible)
          part$ = this.accomSrv.findParticipantByIncomingOccupiersSurname(surname);
        } else {
          // participant assigned to the accom has been relieved and thus, participant update is inevitable
          part$ = this.othAccomSrv.findParticipantByRelievedOccupiersSurname();
        }
        return combineLatest([
          part$,
          this.othAccomSrv.checkIfSaveOtherAccommodationBtnWasRecentlyClicked()
        ]).pipe(
          take(1),
          map(([participant, clicked]) => {
            let participantUpdated: IParticipant;
            let actionToTake: any;
            if(participant && updateParticipant) {
              if(surname) {
                participantUpdated = {...participant, 'zakwaterowanie': otherAccommodation['pokój']};
              } else {
                participantUpdated = {...participant, 'zakwaterowanie': ''};
              }
              actionToTake = updateParticipantRequest({ participant: participantUpdated, updateAcmd: false });
            } else {
              actionToTake = updateOtherAccommodationSuccess({ otherAccommodation: action['otherAccommodation'] });
            }
            if(clicked) { this.router.navigate(['accommodation', 'other-list']) };
            return actionToTake;
          }),
          tap(() => this.othAccomSrv.emptyRelievedActiveOtherAccommodationOccupier()),
        );
      }),
      catchError(() => EMPTY)
    )),
  ));

  deleteOtherAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(deleteOtherAccommodationRequest.type),
    switchMap((action) => this.fBSrv.deleteOtherAccommodation(action['otherAccommodation']['id']).pipe(
      map(() => deleteOtherAccommodationSuccess({ otherAccommodation: action['otherAccommodation'] })),
      catchError(() => EMPTY)
    ))
  ))

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private accomSrv: AccommodationService,
    private othAccomSrv: OtherAccommodationService,
    private router: Router,
  ) {

  }
}
