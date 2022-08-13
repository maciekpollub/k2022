import { Injectable, OnDestroy } from '@angular/core';
import { IParticipant } from '../interfaces/participant';
import { IAppState } from '../reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from './firebase.service';
import { deleteParticipantSuccess } from '../participants/actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService implements OnDestroy {

  subs = new Subscription();

  constructor(
    private store: Store<IAppState>,
    private fBSrv: FirebaseService,
  ) { }

  delete(participant: IParticipant) {
    this.store.dispatch(deleteParticipantSuccess({participantId: participant.id.toString()}));
    this.subs.add(
      this.fBSrv.deleteParticipant(participant.id.toString()).subscribe()
    );
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }
}
