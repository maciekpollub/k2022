import { NgModule } from '@angular/core';
import { ParticipantListComponent } from './main/participant-list/participant-list.component';
import { ParticipantsRouting } from './participants.routing';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { ParticipantEditComponent } from './main/participant-edit/participant-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { ParticipantsEffects } from './effects';

@NgModule({
  declarations: [
    ParticipantListComponent,
    MainComponent,
    ParticipantEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParticipantsRouting,
    ReactiveFormsModule,
    EffectsModule.forFeature([ParticipantsEffects])
  ],
})
export class ParticipantsModule { }
