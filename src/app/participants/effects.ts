import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { addParticipantRequest, addParticipantSuccess } from './actions';

@Injectable()
export class ParticipantsEffects {

  // addParticipant$ = createEffect(() => this.actions$.pipe(
  //   ofType(addParticipantRequest.type),
  //   mergeMap((action) => this.fBSrv.addParticipant(action['newParticipant']).valueChanges().pipe(
  //     map(participant => ({ type: addParticipantSuccess.type, payload: participant }))
  //   ))
  // ))

  constructor(private actions$: Actions, private fBSrv: FirebaseService) {
  }
}
