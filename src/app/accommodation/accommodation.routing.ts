import { NgModule } from '@angular/core';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';
import { Routes, RouterModule } from '@angular/router';
import { OtherAccommodationListComponent } from './other-accommodation-list/other-accommodation-list.component';
import { MainComponent } from './main/main.component';
import { AccommodationEditComponent } from './accommodation-edit/accommodation-edit.component';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: '', redirectTo: 'buzun-list', pathMatch: 'full'},
    {path: 'buzun-list', component: AccommodationListComponent},
    {path: 'other-list', component: OtherAccommodationListComponent},
    {path: 'new-accommodation', component: AccommodationEditComponent},
  ]},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AccommodationRouting {

}
