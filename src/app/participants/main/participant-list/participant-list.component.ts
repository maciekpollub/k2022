import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromParticipants from '../../participants.reducer';
import { Subscription, tap } from 'rxjs';
import { IParticipant, IExpandedParticipant } from '../../../interfaces/participant';
import { MatTableDataSource } from '@angular/material/table';
import { loadActiveParticipantDataSuccess } from '../../actions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeletionDialogComponent } from '../../../deletion-dialog/deletion-dialog.component';

export interface IExpPartTile {
  rows: number,
  cols: number;
  text: string;
}

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ParticipantListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<IParticipant>;

  subs: Subscription = new Subscription();

  columnsToDisplay = ['wspólnota', 'nazwisko', 'kobiety', 'mężczyźni', 'małżeństwo', 'prezbiter', 'uwagi', 'zakwaterowany','akcje'];
  numericValueColumns = ['kobiety', 'mężczyźni', 'małżeństwo', 'prezbiter', 'zakwaterowany'];
  expandedElement: IExpandedParticipant;

  constructor(
    private store: Store<fromRoot.IAppState>,
    private router: Router,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subs.add(
      this.store.select(fromParticipants.getParticipants).pipe(
        tap((participants) => {
          this.dataSource = new MatTableDataSource(participants);
          console.log('To są participants: ', participants)
        })
      ).subscribe());
  }

  edit(participant: IParticipant) {
    this.store.dispatch(loadActiveParticipantDataSuccess({participantId: participant.id.toString()}));
    this.router.navigate(['participants', 'edit', participant.id.toString()])
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, element: any): void {
    this.dialog.open(DeletionDialogComponent, {
      data: element,
      width: '50%',
    });
  }

  compareParticipants(one: IParticipant, two: IParticipant) {
  if ( one.wspólnota.toLowerCase() < two.wspólnota.toLowerCase()){
    return -1;
  }
  if ( one.wspólnota.toLowerCase() > two.wspólnota.toLowerCase()){
    return 1;
  }
  return 0;
}

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }

}


