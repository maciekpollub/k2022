import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, filter, merge, Observable } from 'rxjs';
import { map, catchError, tap, switchMap, mergeMap } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { updateParticipantRequest, updateParticipantSuccess,
        fetchParticipantsDataRequest, fetchParticipantsDataSuccess } from './actions';
import { Router } from '@angular/router';
import { AccommodationService } from '../services/accommodation.service';
import { updateAccommodationRequest, updateOtherAccommodationRequest } from '../accommodation/actions';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { OtherAccommodationService } from '../services/other-accommodation.service';
import { IParticipant } from '../interfaces/participant';


@Injectable()
export class ParticipantsEffects {

  fetchParticipants$ = createEffect(() => this.actions$.pipe(
    ofType(fetchParticipantsDataRequest.type),
    switchMap(() => this.fBSrv.getParticipantList().pipe(
      map((participants) => fetchParticipantsDataSuccess({ participantList: participants })),
      catchError(() => EMPTY)
    ))
  ));

  updateParticipant$ = createEffect(() => this.actions$.pipe(
    ofType(updateParticipantRequest.type),
    switchMap((action) => this.fBSrv.updateParticipant(action['participant']).pipe(
      map(() => {
        return updateParticipantSuccess({ participant: action['participant'] })
      }),
      mergeMap(() => {
        let acc$: Observable<any>;
        let part: IParticipant = action['participant'];
        if (part['zakwaterowanie']) {
          acc$ = merge(this.accomSrv.findAccommodationByItsOccupier(part), this.othAccomSrv.findOtherAccommodationByItsOccupier(part));
        } else {
          acc$ = merge(this.accomSrv.findRelievedAccommodation(), this.othAccomSrv.findRelievedOtherAccommodation());
        }
        return acc$.pipe(
          filter(accom => !!accom),
          map((accom) => {
            let accIsBuzuns = accom.hasOwnProperty('il tap 1-os');
            let accomUpdated: IAccommodation;
            let otherAccomUpdated: IOtherAccommodation;

            if(!!part['zakwaterowanie']) {
              accom = {...accom, 'nazwiska': part['nazwisko'], 'wspólnota': part['wspólnota']};

              if(!!accIsBuzuns) {
                accomUpdated = accom;
                return updateAccommodationRequest({ accommodation: accomUpdated });
              } else {
                otherAccomUpdated = accom;
                return updateOtherAccommodationRequest({ otherAccommodation: otherAccomUpdated })
              }
            } else {
              accom = {...accom, 'nazwiska': '', 'wspólnota': ''};
              if(!!accIsBuzuns) {
                accomUpdated = accom;
                return updateAccommodationRequest({ accommodation: accomUpdated });
              } else {
                otherAccomUpdated = accom;
                return updateOtherAccommodationRequest({ otherAccommodation: otherAccomUpdated })
              }
            }
          }),
          catchError(() => EMPTY)
        );
      })
    )),
    tap(() => this.router.navigate(['participants', 'list']))
  ))

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private router: Router,
    private accomSrv: AccommodationService,
    private othAccomSrv: OtherAccommodationService) {
  }
}
