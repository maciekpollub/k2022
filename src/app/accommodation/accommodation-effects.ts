import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, take, of, withLatestFrom, combineLatest } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap, filter } from 'rxjs/operators';
import { fetchAccommodationsDataRequest, updateAccommodationRequest,
      updateAccommodationSuccess, fetchAccommodationsDataSuccess } from './actions';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AccommodationService } from '../services/accommodation.service';
import { deleteAccommodationRequest, deleteAccommodationSuccess, addAccommodationRequest, addAccommodationSuccess, supplyAccommodationsWithFBKeysRequest, supplyAccommodationsWithFBKeysSuccess, drawAccommodationUpdateConsequences, closeAccommodationUpdate } from './actions';
import { IParticipant } from '../interfaces/participant';
import { updateParticipantRequest } from '../participants/actions';
import { IAccommodation } from '../interfaces/accommodation';
import { FetchedDataService } from '../services/fetched-data.service';

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
  ))

  addAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(addAccommodationRequest.type),
    switchMap((action) => of(this.fBSrv.addAccommodation(action['newAccommodation'])).pipe(
      map(() => addAccommodationSuccess({ newAccommodation: action['newAccommodation'] })),
      catchError(() => EMPTY)
    )),
    tap(() => this.router.navigate(['accommodation', 'buzun-list']))
  ));

  updateAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccommodationRequest.type),
    switchMap((action) => this.fBSrv.updateAccommodation(action['accommodation']).pipe(
      map(() => updateAccommodationSuccess({ accommodation: action['accommodation'], updatePart: action['updatePart'] })),
      // switchMap(() => {
      //   let part$: Observable<IParticipant>;
      //   let accommodation = action['accommodation'];
      //   let updateParticipant = action['updatePart'];
      //   let surname = accommodation['nazwiska'];
      //   if(surname) {
      //     // during edition, a participant has been assigned to the accommodation (rare...but possible)
      //     part$ = this.accomSrv.findParticipantByIncomingOccupiersSurname(surname);
      //   } else {
      //     // participant assigned to the accom has been relieved and thus, participant update is inevitable
      //     part$ = this.accomSrv.findParticipantByRelievedOccupiersSurname();
      //   }
      //   return combineLatest([
      //     part$,
      //     this.accomSrv.checkIfSaveAccommodationBtnWasRecentlyClicked()
      //   ]).pipe(
      //     take(1),
      //     map(([participant, clicked]) => {
      //       let participantUpdated: IParticipant;
      //       let actionToTake: any;
      //       if(participant && updateParticipant) {
      //         if(surname) {
      //           participantUpdated = {...participant, 'zakwaterowanie': accommodation['pokój']};
      //         } else {
      //           participantUpdated = {...participant, 'zakwaterowanie': ''};
      //         }
      //         console.log('To jest zupdateowanyParticipant z efektu updateAccommodation: ', participantUpdated);
      //         actionToTake = updateParticipantRequest({ participant: participantUpdated, updateAcmd: false });
      //       } else {
      //         actionToTake = updateAccommodationSuccess({ accommodation: action['accommodation'] });
      //       }
      //       if(clicked) { this.router.navigate(['accommodation', 'buzun-list']) }
      //       return actionToTake;
      //     }),
      //     // tap(() => this.accomSrv.emptyRelievedActiveAccommodationOccupier())
      //   );
      // }),
      // tap(() => this.accomSrv.emptyRelievedActiveAccommodationOccupier()),
      catchError(() => EMPTY)
    ))
  ));

  successfullyUpdateAccommodation$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccommodationSuccess.type),
    switchMap((action) => of(drawAccommodationUpdateConsequences({ accommodation: action['accommodation'], updatePart: action['updatePart'] })).pipe(
      map((v) => v)
    ))
  ))

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
  ))

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
    private fDSrv: FetchedDataService
  ) {

  }
}
