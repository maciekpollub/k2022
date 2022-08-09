import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as fromRoot from '../../reducer';
import * as fromAccommodations from '../accommodation.reducer';
import { IAccommodation } from '../../interfaces/accommodation';
import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { deleteAccommodationSuccess, loadActiveAccommodationDataSuccess } from '../actions';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

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

  columnsToDisplay = ['pokój', 'il os zakwaterowana', 'wolne łóżka', 'nazwiska', 'wspólnota', 'akcje'];
  expandedElement: any;
  numericValueColumns = ['il os zakwaterowana', 'wolne łóżka'];

  constructor(
    private store: Store<fromRoot.IAppState>,
    private fBSrv: FirebaseService,
    private router: Router) { }

  ngOnInit(): void {
    this.subs.add(
      this.store.select(fromAccommodations.getAccommodations).pipe(
        tap((accommodations) => {
          this.dataSource = new MatTableDataSource(accommodations);
        })
      ).subscribe());
  }

  edit(accommodation: IAccommodation) {
    this.store.dispatch(loadActiveAccommodationDataSuccess({accommodationId: accommodation.id.toString()}));
    this.router.navigate(['accommodation', 'buzun-list', 'edit', accommodation.id.toString()]);
  }

  delete(accommodation: IAccommodation) {
    this.store.dispatch(deleteAccommodationSuccess({accommodationId: accommodation.id.toString()}));
    this.subs.add(
      this.fBSrv.deleteAccommodation(accommodation.id.toString()).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
