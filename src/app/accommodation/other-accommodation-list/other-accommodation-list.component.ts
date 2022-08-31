import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IOtherAccommodation } from '../../interfaces/other-accommodation';
import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromOtherAccommodations from '../other-accommodation.reducer';
import { MatTableDataSource } from '@angular/material/table';
import { loadActiveOtherAccommodationDataSuccess } from '../actions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeletionDialogComponent } from '../../deletion-dialog/deletion-dialog.component';
import { IAccommodation } from '../../interfaces/accommodation';
import { ParticipantsService } from '../../services/participants.service';

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

  columnsToDisplay = ['pokój', 'max il osób', 'il os zakwaterowana','nazwiska', 'wspólnota', 'przydzielony','akcje'];
  expandedElement: any;
  numericValueColumns = ['max il osób', 'il os zakwaterowana', 'przydzielony'];

  constructor(
    private store: Store<fromRoot.IAppState>,
    private router: Router,
    private dialog: MatDialog,
    private partSrv: ParticipantsService) { }

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

  isSubjectToAboveOthAccom(accom: IAccommodation | IOtherAccommodation) {
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
