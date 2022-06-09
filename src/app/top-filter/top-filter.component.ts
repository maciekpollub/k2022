import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-top-filter',
  templateUrl: './top-filter.component.html',
  styleUrls: ['./top-filter.component.scss']
})
export class TopFilterComponent implements OnInit {
  @Input() dataSource_: MatTableDataSource<any>;
  filteredDataSource: MatTableDataSource<any>;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(this.dataSource_) {
      this.dataSource_.filter = filterValue.trim().toLowerCase();
      this.filteredDataSource = this.dataSource_;
      console.log('To jest filteredDataSource: ', this.filteredDataSource);
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SummaryComponent, {
      width: '250px',
    });
  }

}
