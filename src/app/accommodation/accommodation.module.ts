import { NgModule } from '@angular/core';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AccommodationRouting } from './accommodation.routing';
import { OtherAccommodationListComponent } from './other-accommodation-list/other-accommodation-list.component';
import { MainComponent } from './main/main.component';
import { AccommodationEditComponent } from './accommodation-edit/accommodation-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OtherAccommodationEditComponent } from './other-accommodation-edit/other-accommodation-edit.component';


@NgModule({
  declarations: [
    AccommodationListComponent,
    OtherAccommodationListComponent,
    MainComponent,
    AccommodationEditComponent,
    OtherAccommodationEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccommodationRouting,
    ReactiveFormsModule,
  ],
})
export class AccommodationModule { }
