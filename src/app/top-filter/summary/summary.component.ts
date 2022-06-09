import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IParticipantSummary } from '../../interfaces/participant-summary';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

  dataSource: MatTableDataSource<IParticipantSummary>;
  displayedColumns: string[] = ['razem bracia', 'razem niemowlęta i dzieci', 'razem niańki', 'razem na salę gimn.', 'razem do wyżywienia', 'razem do zakwaterowania'];

  constructor(public dialogRef: MatDialogRef<SummaryComponent>) { }

}
