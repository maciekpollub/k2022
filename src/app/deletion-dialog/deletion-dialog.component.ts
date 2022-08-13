import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IParticipant } from '../interfaces/participant';
import { ParticipantsService } from '../services/participants.service';

@Component({
  selector: 'app-deletion-dialog',
  templateUrl: './deletion-dialog.component.html',
  styleUrls: ['./deletion-dialog.component.scss']
})
export class DeletionDialogComponent implements OnInit {

  elemToDelete: IParticipant;

  constructor(
    public dialogRef: MatDialogRef<DeletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public element: IParticipant,
    private partsSrv: ParticipantsService) { }

  ngOnInit(): void {
    this.elemToDelete = this.element;
  }

  delete() {
    this.partsSrv.delete(this.elemToDelete);
  }

}
