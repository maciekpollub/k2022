import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IAccommodationSummary } from '../../interfaces/accommodation-summary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAccommodation } from '../../interfaces/accommodation';

@Component({
  selector: 'app-summary-accommodation',
  templateUrl: './summary-accommodation.component.html',
  styleUrls: ['./summary-accommodation.component.scss']
})
export class SummaryAccommodationComponent implements OnInit {
  dataSource: MatTableDataSource<IAccommodationSummary>;
  displayedColumns: string[] = ['ilość pokoi', 'ilość tapczanów 1-os.', 'ile można dostawić', 'ilość osób',
    'ilość przydziałów', 'ilość osób zakwaterowanych', 'ilość wolnych łóżek', 'zakwaterowani minus ilość osób'
  ];
    rooms = 0;
    singleDivans = 0;
    toSupply = 0
    people = 0;
    allocations = 0;
    accommodated = 0;
    spareBeds = 0;
    differrence = 0;
    accommodationSummary: IAccommodationSummary;

  constructor(
    public dialogRef: MatDialogRef<SummaryAccommodationComponent>,
    @Inject(MAT_DIALOG_DATA) public filteredDataSource: MatTableDataSource<any>
  ) {}

  ngOnInit(): void {
    if (this.filteredDataSource) {
      let roomArray: string[] = [];
      this.filteredDataSource.filteredData.forEach((el: IAccommodation) => {
        roomArray.push(el.pokój);
        this.singleDivans = this.singleDivans + (Number(el['il. tap. 1-os.']) || 0);
        this.toSupply = this.toSupply + (Number(el['można dostawić']) || 0);
        this.people = this.people + (Number(el['razem osób']) || 0);
        this.allocations = this.allocations + (Number(el.przydział) || 0);
        this.accommodated = this.accommodated + (Number(el['il. os. zakwaterowana']) || 0);
        this.spareBeds = this.spareBeds + (Number(el['wolne łóżka']) || 0);
      });
      this.rooms = new Set(roomArray).size;
      this.differrence = this.accommodated - this.people;

      this.accommodationSummary = {
        'ilość pokoi': this.rooms,
        'ilość tapczanów 1-os.': this.singleDivans,
        'ile można dostawić': this.toSupply,
        'ilość osób': this.people,
        'ilość przydziałów': this.allocations,
        'ilość osób zakwaterowanych': this.accommodated,
        'ilość wolnych łóżek': this.spareBeds,
        'zakwaterowani minus ilość osób': this.differrence,
      };

      this.dataSource = new MatTableDataSource<any>([this.accommodationSummary]);
    }
  }

}
