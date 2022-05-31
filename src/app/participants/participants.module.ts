import { NgModule } from '@angular/core';
import { ParticipantListComponent } from './participant-list/participant-list.component';
import { ParticipantsRouting } from './participants.routing';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ParticipantListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParticipantsRouting
  ]
})
export class ParticipantsModule { }
