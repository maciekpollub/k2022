import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromParticipants from '../participants.reducer';
import { Subscription, tap } from 'rxjs';
import { IParticipant, IExpandedParticipant } from '../../interfaces/participant';
import { MatTableDataSource } from '@angular/material/table';

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

  columnsToDisplay = ['wspólnota', 'nazwisko', 'kobiety', 'mężczyźni', 'małżeństwo', 'prezbiter', 'uwagi'];
  expandedElement: IExpandedParticipant;

  constructor(
    private store: Store<fromRoot.IAppState>) {
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


  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }

}


