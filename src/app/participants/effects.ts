import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, filter, merge, Observable, combineLatest, zip, take, concat } from 'rxjs';
import { map, catchError, tap, switchMap, mergeMap, concatMap, delay } from 'rxjs/operators';
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
import { deleteParticipantRequest, deleteParticipantSuccess } from './actions';
import { ParticipantsService } from '../services/participants.service';
import { AnyForUntypedForms } from '@angular/forms';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';


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
        console.log('Jesteśmy w mapie po fBsrv.updateParticipant<<<<<<<<<<: ', action['participant']);
        return updateParticipantSuccess({ participant: action['participant'] })
      }),
      switchMap(() => {
        let acc$: Observable<any>;
        let part: IParticipant = action['participant'];
        if(part['zakwaterowanie']) {
          acc$ = combineLatest(([this.accomSrv.findAccommodationByItsOccupier(part), this.othAccomSrv.findOtherAccommodationByItsOccupier(part)]))
          .pipe(map(([acc, othAcc]) => acc || othAcc));
        } else {
          acc$ = combineLatest(([this.accomSrv.findRelievedAccommodation(), this.othAccomSrv.findRelievedOtherAccommodation()]))
          .pipe(map(([acc, othAcc]) => acc || othAcc));
        }
        return combineLatest([
          acc$,
          this.partSrv.checkIfSaveParticipantBtnWasRecentlyClicked()
        ]).pipe(
          map(([accom, clicked]) => {
            if(action['updateAcmd'] && accom) {
              let accIsBuzuns = accom.hasOwnProperty('il tap 1-os');
              let accomUpdated: IAccommodation;
              let otherAccomUpdated: IOtherAccommodation;

              if(!!part['zakwaterowanie']) {
                accom = {...accom, 'nazwiska': part['nazwisko'], 'wspólnota': part['wspólnota']};
                let actionToTake: any;
                if(!!accIsBuzuns) {
                  accomUpdated = accom;
                  actionToTake = updateAccommodationRequest({ accommodation: accomUpdated, updatePart: false });
                } else {
                  otherAccomUpdated = accom;
                  actionToTake = updateOtherAccommodationRequest({ otherAccommodation: otherAccomUpdated, updatePart: false })
                }
                if(clicked) {this.router.navigate(['participants', 'list'])};
                return actionToTake;
              } else {
                accom = {...accom, 'nazwiska': '', 'wspólnota': ''};
                let actionToTake: any;
                if(!!accIsBuzuns) {
                  accomUpdated = accom;
                  actionToTake = updateAccommodationRequest({ accommodation: accomUpdated, updatePart: false });
                } else {
                  otherAccomUpdated = accom;
                  actionToTake = updateOtherAccommodationRequest({ otherAccommodation: otherAccomUpdated, updatePart: false })
                }
                if(clicked) {this.router.navigate(['participants', 'list'])};
                return actionToTake;
              }
            } else {
              if(clicked) {this.router.navigate(['participants', 'list'])};
              // nonaccom Particiant has been updated with nonaccom properities...
              // we update again because an action must be returned
              return updateParticipantSuccess({participant: action['participant']});
            }
          }),
          catchError(() => EMPTY)
        );
      })
    )),
  ));

  deleteParticipant$ = createEffect(() => this.actions$.pipe(
    ofType(deleteParticipantRequest.type),
    switchMap((action) => this.fBSrv.deleteParticipant(action['participant']).pipe(
      map(() => deleteParticipantSuccess({ participant: action['participant'] })),
      catchError(() => EMPTY)
    ))
  ));

  constructor(
    private actions$: Actions,
    private fBSrv: FirebaseService,
    private router: Router,
    private partSrv: ParticipantsService,
    private accomSrv: AccommodationService,
    private othAccomSrv: OtherAccommodationService) {
  }
}
