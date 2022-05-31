import { NgModule } from '@angular/core';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: AccommodationListComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AccommodationRouting {

}
