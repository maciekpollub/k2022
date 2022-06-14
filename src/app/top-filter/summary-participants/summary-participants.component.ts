import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IParticipantSummary } from '../../interfaces/participant-summary';
import { IParticipant } from '../../interfaces/participant';

@Component({
  selector: 'app-summary-participants',
  templateUrl: './summary-participants.component.html',
  styleUrls: ['./summary-participants.component.scss']
})
export class SummaryParticipantsComponent implements OnInit {

  dataSource: MatTableDataSource<IParticipantSummary>;
  displayedColumns: string[] = ['razem bracia', 'razem niemowlęta i dzieci', 'razem niańki', 'razem na salę gimn.', 'razem do wyżywienia', 'razem do zakwaterowania'];
  brothers = 0;
  allChildren = 0;
  allNannies = 0;
  allAtTheHall = 0;
  participantSummary: IParticipantSummary;

  constructor(
    public dialogRef: MatDialogRef<SummaryParticipantsComponent>,
    @Inject(MAT_DIALOG_DATA) public filteredDataSource: MatTableDataSource<any>
  ) {}

  ngOnInit(): void {
    if (this.filteredDataSource) {
      this.filteredDataSource.filteredData.forEach((el: IParticipant) => {
        this.brothers = this.brothers + (Number(el.prezbiter) || 0) + (Number(el.małżeństwo) || 0) + (Number(el.kobiety) || 0) + (Number(el['mężczyźni']) || 0);
        this.allChildren = this.allChildren + (Number(el.dzieci) || 0) + (Number(el.niemowlęta) || 0);
        this.allNannies = this.allNannies + (Number(el.nianiaObca) || 0) + (Number(el.nianiaZRodziny) || 0);
        this.allAtTheHall = this.allAtTheHall + (Number(el.dzieci) || 0);
      });

      this.allAtTheHall = this.allAtTheHall + this.brothers + this.allNannies

      this.participantSummary = {
        'razem bracia (bez niemowląt, dzieci i nianiek)': this.brothers,
        'razem niemowlęta i dzieci': this.allChildren,
        'razem niańki': this.allNannies,
        'razem na salę gimn. (krzesła - z nianiami i dziećmi)': this.allAtTheHall,
        'razem do wyżywienia (z  dziećmi)': this.allAtTheHall,
        'razem do zakwaterowania (z dziećmi)': this.allAtTheHall
      };

      this.dataSource = new MatTableDataSource<any>([this.participantSummary]);
      console.log('To jest liczba braci:', this.brothers)
    }
  }

}
