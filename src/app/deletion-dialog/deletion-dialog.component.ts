import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IParticipant } from '../interfaces/participant';
import { ParticipantsService } from '../services/participants.service';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import { AccommodationService } from '../services/accommodation.service';
import { OtherAccommodationService } from '../services/other-accommodation.service';

@Component({
  selector: 'app-deletion-dialog',
  templateUrl: './deletion-dialog.component.html',
  styleUrls: ['./deletion-dialog.component.scss']
})
export class DeletionDialogComponent implements OnInit {

  elemToDelete: any;

  constructor(
    public dialogRef: MatDialogRef<DeletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public element: IParticipant | IAccommodation | IOtherAccommodation,
    private partsSrv: ParticipantsService,
    private accomSrv: AccommodationService,
    private othAccomSrv: OtherAccommodationService) { }

  ngOnInit(): void {
    this.elemToDelete = this.element;
  }

  delete() {
    if(this.elemToDelete.hasOwnProperty('nazwisko')) {
      this.partsSrv.delete(this.elemToDelete);
    } else if(this.elemToDelete.hasOwnProperty('il tap 1-os')) {
      this.accomSrv.delete(this.elemToDelete);
    } else {
      this.othAccomSrv.delete(this.elemToDelete);
    }
  }

}
