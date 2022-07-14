import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IOtherAccommodationSummary } from '../../interfaces/other-accommodation-summary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOtherAccommodation } from '../../interfaces/other-accommodation';

@Component({
  selector: 'app-summary-other-accommodation',
  templateUrl: './summary-other-accommodation.component.html',
  styleUrls: ['./summary-other-accommodation.component.scss']
})
export class SummaryOtherAccommodationComponent implements OnInit {
  dataSource: MatTableDataSource<IOtherAccommodationSummary>;
  displayedColumns: string[] = [
  'ilość pokoi', 'ilość łóżek pojed.', 'ilość tapczanów 2-os.', 'ilość łóżek dużych','max il. osób',
  'ilość przydziałów', 'ilość osób zakwaterowanych', 'ilość wolnych łóżek', 'zakwaterowani minus max il. osób'
  ];

  rooms = 0;
  singleBeds = 0;
  doubleDivans = 0;
  bigBads = 0;
  maxNumberOfPeople = 0;
  allocations = 0;
  accommodated = 0;
  spareBeds = 0;
  differrence = 0;
  otherAccommodationSummary: IOtherAccommodationSummary;

  constructor(
    public MatDialogRef: MatDialogRef<SummaryOtherAccommodationComponent>,
    @Inject(MAT_DIALOG_DATA) public filteredDataSource: MatTableDataSource<any>
  ) { }

  ngOnInit(): void {
    if (this.filteredDataSource) {
      let roomArray: string[] = [];
      this.filteredDataSource.filteredData.forEach((el: IOtherAccommodation) => {
        roomArray.push(el.pokój);
        this.singleBeds = this.singleBeds + (Number(el['łóżko pojed']) || 0);
        this.doubleDivans = this.doubleDivans + (Number(el['il tap 2-os']) || 0);
        this.bigBads = this.bigBads + (Number(el['łóżko duże']) || 0);
        this.maxNumberOfPeople = this.maxNumberOfPeople + (Number(el['max il osób']) || 0);
        this.allocations = this.allocations + (Number(el.przydział) || 0);
        this.accommodated = this.accommodated + (Number(el['il os zakwaterowana']) || 0);
        this.spareBeds = this.spareBeds + (Number(el['wolne łóżka']) || 0);
      });
      this.rooms = new Set(roomArray).size;
      this.differrence = this.accommodated - this.maxNumberOfPeople;

      this.otherAccommodationSummary = {
        'ilość pokoi': this.rooms,
        'ilość łóżek pojed.': this.singleBeds,
        'ilość tapczanów 2-os.': this.doubleDivans,
        'ilość łóżek dużych': this.bigBads,
        'max il. osób': this.maxNumberOfPeople,
        'ilość przydziałów': this.allocations,
        'ilość osób zakwaterowanych': this.accommodated,
        'ilość wolnych łóżek': this.spareBeds,
        'zakwaterowani minus max il. osób': this.differrence,
      };

      this.dataSource = new MatTableDataSource<any>([this.otherAccommodationSummary]);
    }
  }

}
