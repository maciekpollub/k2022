import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as fromRoot from '../../reducer';
import * as fromAccommodations from '../accommodation.reducer';
import { IAccommodation } from '../../interfaces/accommodation';
import { map, Observable, Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { loadActiveAccommodationDataSuccess, supplyAccommodationsWithFBKeysRequest } from '../actions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeletionDialogComponent } from '../../deletion-dialog/deletion-dialog.component';
import { ParticipantsService } from '../../services/participants.service';
import { IOtherAccommodation } from '../../interfaces/other-accommodation';

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

  columnsToDisplay = ['pokój', 'il os zakwaterowana', 'wolne łóżka', 'nazwiska', 'wspólnota', 'przydzielony', 'akcje'];
  expandedElement: any;
  numericValueColumns = ['il os zakwaterowana', 'wolne łóżka', 'przydzielony'];

  constructor(
    private store: Store<fromRoot.IAppState>,
    private router: Router,
    private dialog: MatDialog,
    private partSrv: ParticipantsService) {

    }

  ngOnInit(): void {
    this.subs.add(
      this.store.select(fromAccommodations.getAccommodations).pipe(
        tap((accommodations) => {
          this.dataSource = new MatTableDataSource(accommodations);
        })
      ).subscribe()
    );
  }

  edit(accommodation: IAccommodation) {
    if(accommodation && accommodation.id) {
      this.store.dispatch(loadActiveAccommodationDataSuccess({accommodationId: accommodation.id.toString()}));
      this.router.navigate(['accommodation', 'buzun-list', 'edit', accommodation.id.toString()]);
    }
  }

  isSubjectToAboveAccom(accom: IAccommodation | IOtherAccommodation) {
    return this.partSrv.isSubjectToAboveAccom(accom);
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, element: any): void {
    this.dialog.open(DeletionDialogComponent, {
      data: element,
      width: '50%',
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
