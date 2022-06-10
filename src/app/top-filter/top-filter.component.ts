import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IParticipant } from '../interfaces/participant';
import { SummaryParticipantsComponent } from './summary-participants/summary-participants.component';

@Component({
  selector: 'app-top-filter',
  templateUrl: './top-filter.component.html',
  styleUrls: ['./top-filter.component.scss']
})
export class TopFilterComponent implements OnInit {
  @Input() dataSource_: MatTableDataSource<any>;
  filteredDataSource: MatTableDataSource<any>;

  entryDataSource: MatTableDataSource<IParticipant>;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.dataSource_) {
      this.entryDataSource= this.dataSource_;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_.filter = filterValue.trim().toLowerCase();
    this.filteredDataSource = this.dataSource_;
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SummaryParticipantsComponent, {
      data: this.filteredDataSource,
      width: '90%',
    });
  }

}
