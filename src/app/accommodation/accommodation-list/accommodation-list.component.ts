import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as fromRoot from '../../reducer';
import * as fromAccommodations from '../accommodation.reducer';
import { IAccommodation } from '../../interfaces/accommodation';
import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccommodationListComponent implements OnInit {
  dataSource: MatTableDataSource<IAccommodation>;

  subs: Subscription = new Subscription();

  columnsToDisplay = ['pokój', 'il os zakwaterowana', 'wolne łóżka', 'nazwiska', 'wspólnota'];
  expandedElement: any;
  numericValueColumns = ['il os zakwaterowana', 'wolne łóżka'];

  constructor( private store: Store<fromRoot.IAppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store.select(fromAccommodations.getAccommodations).pipe(
        tap((accommodations) => {
          this.dataSource = new MatTableDataSource(accommodations);
        })
      ).subscribe());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
