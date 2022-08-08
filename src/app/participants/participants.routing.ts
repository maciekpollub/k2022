import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ParticipantListComponent } from './main/participant-list/participant-list.component';
import { ParticipantEditComponent } from './main/participant-edit/participant-edit.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: ParticipantListComponent},
    {path: 'new', component: ParticipantEditComponent},
    {path: 'edit/:id', component: ParticipantEditComponent},
  ]},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ParticipantsRouting {

}
