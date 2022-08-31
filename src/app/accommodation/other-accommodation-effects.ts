import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, take } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap, finalize, mapTo } from 'rxjs/operators';
import { fetchOtherAccommodationsDataRequest, fetchOtherAccommodationsDataSuccess,
    updateOtherAccommodationRequest, updateOtherAccommodationSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { OtherAccommodationService } from '../services/other-accommodation.service';
import { Router } from '@angular/router';
import { IParticipant } from '../interfaces/participant';
import { AccommodationService } from '../services/accommodation.service';
import { updateParticipantRequest } from '../participants/actions';

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
        let surname = otherAccommodation['nazwiska'];
        if(surname) {
          // during edition, a participant has been assigned to the accommodation (rare...but possible)
          part$ = this.accomSrv.findParticipantByIncomingOccupiersSurname(surname);
        } else {
          // participant assigned to the accom has been relieved and thus, participant update is inevitable
          part$ = this.othAccomSrv.findParticipantByRelievedOccupiersSurname();
        }
        return part$.pipe(
          take(1),
          map((participant) => {
            let participantUpdated: IParticipant;
            if(participant) {
              if(surname) {
                participantUpdated = {...participant, 'zakwaterowanie': otherAccommodation['pokój']};
              } else {
                participantUpdated = {...participant, 'zakwaterowanie': ''};
              }
              return updateParticipantRequest({ participant: participantUpdated, updateAcmd: false });
            } else {
              return updateOtherAccommodationSuccess({ otherAccommodation: action['otherAccommodation'] });
            }
          }),
          tap(() => this.othAccomSrv.emptyRelievedActiveOtherAccommodationOccupier())
        );
      }),
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
    private accomSrv: AccommodationService,
    private othAccomSrv: OtherAccommodationService,
    private router: Router,
  ) {

  }
}
