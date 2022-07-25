import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IOtherAccommodation } from '../../interfaces/other-accommodation';
import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromOtherAccommodations from '../other-accommodation.reducer';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-other-accommodation-list',
  templateUrl: './other-accommodation-list.component.html',
  styleUrls: ['./other-accommodation-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OtherAccommodationListComponent implements OnInit {
  dataSource: MatTableDataSource<IOtherAccommodation>;

  subs: Subscription = new Subscription();

  columnsToDisplay = ['pokój', 'max il osób', 'il os zakwaterowana','nazwiska', 'wspólnota'];
  expandedElement: any;
  numericValueColumns = ['max il osób', 'il os zakwaterowana'];

  constructor( private store: Store<fromRoot.IAppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store.select(fromOtherAccommodations.getOtherAccommodations).pipe(
        tap((otherAccommodations) => {
          this.dataSource = new MatTableDataSource(otherAccommodations);
        })
      ).subscribe());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
