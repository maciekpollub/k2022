import { Injectable, OnDestroy } from '@angular/core';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from './firebase.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService implements OnDestroy {

  subs = new Subscription();

  constructor(

  ) { }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }
}
