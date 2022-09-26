import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, combineLatest, of, zip, forkJoin } from 'rxjs';
import { map, catchError, switchMap, tap, finalize, mergeMap, startWith, filter, delay } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { updateParticipantRequest, updateParticipantSuccess,
        fetchParticipantsDataRequest, fetchParticipantsDataSuccess, goToAssignedRoom } from './actions';
import { Router } from '@angular/router';
import { AccommodationService } from '../services/accommodation.service';
import { updateAccommodationRequest, updateOtherAccommodationRequest, loadActiveAccommodationDataSuccess, loadActiveOtherAccommodationDataSuccess } from '../accommodation/actions';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { OtherAccommodationService } from '../services/other-accommodation.service';
import { IParticipant } from '../interfaces/participant';
import { deleteParticipantRequest, deleteParticipantSuccess, supplyParticipantsWithFBKeysRequest,
      supplyParticipantsWithFBKeysSuccess, drawParticipantUpdateConsequences } from './actions';
import { ParticipantsService } from '../services/participants.service';
import { closeParticipantUpdate, addParticipantRequest, addParticipantSuccess } from './actions';

@Injectable()
export class ParticipantsEffects {

  fetchParticipants$ = createEffect(() => this.actions$.pipe(
    ofType(fetchParticipantsDataRequest.type),
    switchMap(() => this.fBSrv.getParticipantList().pipe(
      map((participants) => fetchParticipantsDataSuccess({ participantList: participants })),
      catchError(() => EMPTY)
    ))
  ));

  supplyParticipantsWithKeys$ = createEffect(() => this.actions$.pipe(
    ofType(supplyParticipantsWithFBKeysRequest.type),
    switchMap(() => this.fBSrv.supplyParticipantsWithFBKeys().pipe(
      map((participantsWithKeys) => supplyParticipantsWithFBKeysSuccess({ participantsWithKeys })),
      catchError(() => EMPTY)
    ))
  ))

  addParticipant$ = createEffect(() => this.actions$.pipe(
    ofType(addParticipantRequest.type),
    switchMap((action) => of(this.fBSrv.addParticipant(action['newParticipant'])).pipe(
      map(() => addParticipantSuccess({ newParticipant: action['newParticipant']})),
      catchError(() => EMPTY)
    )),
    tap(() => this.router.navigate(['participants', 'list']))
  ));

  updateParticipant$ = createEffect(() => this.actions$.pipe(
    ofType(updateParticipantRequest.type),
    switchMap((action) => this.fBSrv.updateParticipant(action['participant']).pipe(
      map(() => updateParticipantSuccess({ participant: action['participant'], updateAcmd: action['updateAcmd'] })),
      catchError(() => EMPTY)
    ))
  ));

  successfullyUpdateParticipant$ = createEffect(() => this.actions$.pipe(
    ofType(updateParticipantSuccess.type),
    switchMap((action) => of(drawParticipantUpdateConsequences({ participant: action['participant'], updateAcmd: action['updateAcmd'] })).pipe(
      map((v) => v)
    ))
  ))

  drawUpdateConsequences$ = createEffect(() => this.actions$.pipe(
    ofType(drawParticipantUpdateConsequences.type),
    switchMap((action) => {
      let acc$: Observable<any>;
      let part: IParticipant = action['participant'];
      if(part['zakwaterowanie']) {
        acc$ = combineLatest(([this.accomSrv.findAccommodationByItsOccupier(part), this.othAccomSrv.findOtherAccommodationByItsOccupier(part)])).pipe(
          map(([acc, othAcc]) => acc || othAcc))
      } else {
        acc$ = combineLatest(([this.accomSrv.findRelievedAccommodation(), this.othAccomSrv.findRelievedOtherAccommodation()])).pipe(
          map(([acc, othAcc]) => acc || othAcc));
      }
      return combineLatest([acc$, this.partSrv.checkIfSaveParticipantBtnWasRecentlyClicked()]).pipe(
        map(([accom, wasClicked]) => {
          // console.log('To jest akomodacja i wartość wasClicked otrzymane w I etapie returna...', accom, wasClicked)
          if(accom && action['updateAcmd']) {
            let accIsBuzuns = accom.hasOwnProperty('il tap 1-os');
            let accomUpdated: IAccommodation;
            let otherAccomUpdated: IOtherAccommodation;
            let actionToTake: any;
            if(!!part['zakwaterowanie']) {
              accom = {...accom, 'nazwiska': part['nazwisko'], 'wspólnota': part['wspólnota']};
              // console.log('Teraz prezentujemy wartość akomodacji po uzupełnieniu danych participanta: ', accom);
              if(!!accIsBuzuns) {
                accomUpdated = accom;
                actionToTake = updateAccommodationRequest({ accommodation: accomUpdated, updatePart: false });
              } else {
                otherAccomUpdated = accom;
                actionToTake = updateOtherAccommodationRequest({ otherAccommodation: otherAccomUpdated, updatePart: false })
              }
              if(wasClicked) {this.router.navigate(['participants', 'list'])};
              return actionToTake;
            } else {
              accom = {...accom, 'nazwiska': '', 'wspólnota': '', 'przydział': ''};
              if(!!accIsBuzuns) {
                accomUpdated = accom;
                actionToTake = updateAccommodationRequest({ accommodation: accomUpdated, updatePart: false });
              } else {
                otherAccomUpdated = accom;
                actionToTake = updateOtherAccommodationRequest({ otherAccommodation: otherAccomUpdated, updatePart: false })
              }
              if(wasClicked) {this.router.navigate(['participants', 'list'])};
              return actionToTake;
            }
          } else {
            if(wasClicked) {this.router.navigate(['participants', 'list'])};
              // nonaccom Particiant has been updated with nonaccom properities...
              // we update again because an action must be returned
            return closeParticipantUpdate();
          }
        }),
        catchError(() => EMPTY)
      );
    }),
  ));

  goToAssignedRoom$ = createEffect(() => this.actions$.pipe(
    ofType(goToAssignedRoom.type),
    switchMap((action) => {
      let part = action['participant'];
      let room: IAccommodation | IOtherAccommodation;
      return zip([this.accomSrv.findAccommodationByItsOccupier(part), this.othAccomSrv.findOtherAccommodationByItsOccupier(part)]).pipe(
        map(([accom, othAccom]) => accom  || othAccom),
        map(a => {
          room = a;
          let buzuns = room.hasOwnProperty('il tap 1-os');
          return buzuns
                 ? loadActiveAccommodationDataSuccess({accommodationId: a.id.toString()})
                 : loadActiveOtherAccommodationDataSuccess({otherAccommodationId: a.id.toString()});
        }),
        tap(() => this.partSrv.goToRoom(room)),
        catchError(() => EMPTY)
      )
    })
  ));

  deleteParticipant$ = createEffect(() => this.actions$.pipe(
    ofType(deleteParticipantRequest.type),
    switchMap((action) => this.fBSrv.deleteParticipant(action['participant']['id']).pipe(
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
