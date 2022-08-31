import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, take, of, withLatestFrom } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap, filter } from 'rxjs/operators';
import { fetchAccommodationsDataRequest, updateAccommodationRequest,
      updateAccommodationSuccess, fetchAccommodationsDataSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AccommodationService } from '../services/accommodation.service';
import { deleteAccommodationRequest, deleteAccommodationSuccess } from './actions';
import { IParticipant } from '../interfaces/participant';
import { updateParticipantRequest } from '../participants/actions';

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
      switchMap(() => {
        let part$: Observable<IParticipant>;
        let accommodation = action['accommodation'];
        let surname = accommodation['nazwiska'];
        console.log('To jest surname z efektu updateAccommodation: ', surname)
        if(surname) {
          // during edition, a participant has been assigned to the accommodation (rare...but possible)
          part$ = this.accomSrv.findParticipantByIncomingOccupiersSurname(surname);
        } else {
          // participant assigned to the accom has been relieved and thus, participant update is inevitable
          part$ = this.accomSrv.findParticipantByRelievedOccupiersSurname();
        }
        return part$.pipe(
          take(1),
          map((participant) => {
            let participantUpdated: IParticipant;
            console.log('A to jest participant z efektu updateAccommodation: ', participant)
            if(participant) {
              if(surname) {
                participantUpdated = {...participant, 'zakwaterowanie': accommodation['pokój']};
              } else {
                participantUpdated = {...participant, 'zakwaterowanie': ''};
              }
              console.log('To jest zupdateowanyParticipant z efektu updateAccommodation: ', participantUpdated);
              return updateParticipantRequest({ participant: participantUpdated, updateAcmd: false });
            } else {
              return updateAccommodationSuccess({ accommodation: action['accommodation'] });
            }
          }),
          tap(() => this.accomSrv.emptyRelievedActiveAccommodationOccupier())
        );
      }),
      catchError(() => EMPTY)
    )),
    tap(() => this.accomSrv.checkIfSaveAccommodationBtnWasRecentlyClicked().pipe(
      map((clicked) => {
        if(clicked) { this.router.navigate(['accommodation', 'buzun-list'])};
      })
    ).subscribe()),
  ));

  deleteAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(deleteAccommodationRequest.type),
    switchMap((action) => this.fBSrv.deleteAccommodation(action['accommodation']['id']).pipe(
      map(() => deleteAccommodationSuccess({ accommodation: action['accommodation'] })),
      catchError(() => EMPTY)
    ))
  ))

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private router: Router,
    private accomSrv: AccommodationService,
  ) {

  }
}
