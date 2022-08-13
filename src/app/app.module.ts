import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducers } from './reducer';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

import { HomeComponent } from './home/home.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';

import { FirebaseService } from './services/firebase.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { AccommodationModule } from './accommodation/accommodation.module';
import { ParticipantsModule } from './participants/participants.module';
import { SummaryParticipantsComponent } from './top-filter/summary-participants/summary-participants.component';
import { SummaryAccommodationComponent } from './top-filter/summary-accommodation/summary-accommodation.component';
import { SummaryOtherAccommodationComponent } from './top-filter/summary-other-accommodation/summary-other-accommodation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { ParticipantsEffects } from './participants/effects';
import { DeletionDialogComponent } from './deletion-dialog/deletion-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SideMenuComponent,
    SummaryParticipantsComponent,
    SummaryAccommodationComponent,
    SummaryOtherAccommodationComponent,
    DeletionDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ParticipantsEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    AppRoutingModule,
    AccommodationModule,
    ParticipantsModule,
    MatSidenavModule,
    MatMenuModule,
    EffectsModule.forRoot([]),
  ],
  exports: [
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
