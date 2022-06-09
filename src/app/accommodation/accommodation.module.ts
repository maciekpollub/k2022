import { NgModule } from '@angular/core';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AccommodationRouting } from './accommodation.routing';
import { OtherAccommodationListComponent } from './other-accommodation-list/other-accommodation-list.component';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [
    AccommodationListComponent,
    OtherAccommodationListComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccommodationRouting
  ],
})
export class AccommodationModule { }
