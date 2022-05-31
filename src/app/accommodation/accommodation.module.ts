import { NgModule } from '@angular/core';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AccommodationRouting } from './accommodation.routing';

@NgModule({
  declarations: [
    AccommodationListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccommodationRouting
  ],
})
export class AccommodationModule { }
