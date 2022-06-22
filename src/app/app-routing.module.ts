import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ParticipantListComponent } from './participants/main/participant-list/participant-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'participants',
    loadChildren: () => import('./participants/participants.module').then(m => m.ParticipantsModule)
  },
// { path: 'participant-list', component: ParticipantListComponent},
  { path: 'accommodation',
    loadChildren: () => import('./accommodation/accommodation.module').then(m => m.AccommodationModule)
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
