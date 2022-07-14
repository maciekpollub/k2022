import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class ParticipantsEffects {

  constructor(private actions$: Actions) {
    
  }
}
