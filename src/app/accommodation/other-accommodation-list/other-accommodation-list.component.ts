import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IOtherAccommodation } from '../../interfaces/other-accommodation';
import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromOtherAccommodations from '../other-accommodation.reducer';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from '../../services/firebase.service';
import { deleteOtherAccommodationSuccess, loadActiveOtherAccommodationDataSuccess } from '../actions';
import { Router } from '@angular/router';

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

  columnsToDisplay = ['pokój', 'max il osób', 'il os zakwaterowana','nazwiska', 'wspólnota', 'akcje'];
  expandedElement: any;
  numericValueColumns = ['max il osób', 'il os zakwaterowana'];

  constructor(
    private store: Store<fromRoot.IAppState>,
    private fBSrv: FirebaseService,
    private router: Router) { }

  ngOnInit(): void {
    this.subs.add(
      this.store.select(fromOtherAccommodations.getOtherAccommodations).pipe(
        tap((otherAccommodations) => {
          this.dataSource = new MatTableDataSource(otherAccommodations);
        })
      ).subscribe());
  }

  edit(otherAccommodation: IOtherAccommodation) {
    this.store.dispatch(loadActiveOtherAccommodationDataSuccess({otherAccommodationId: otherAccommodation.id.toString()}));
    this.router.navigate(['accommodation', 'other-list', 'edit', otherAccommodation.id.toString()]);
  }

  delete(otherAccommodation: IOtherAccommodation) {
    this.store.dispatch(deleteOtherAccommodationSuccess({ otherAccommodationId: otherAccommodation.id.toString() }));
    this.subs.add(
      this.fBSrv.deleteOtherAccommodation(otherAccommodation.id.toString()).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
