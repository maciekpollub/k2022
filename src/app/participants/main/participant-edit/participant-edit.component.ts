import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, tap, Subscription } from 'rxjs';
import * as fromRoot from './.././../../reducer';
import { Store } from '@ngrx/store';
import { addParticipantSuccess } from '../../actions';
import { DataBaseService } from '../../../services/data-base.service';

import { FetchedDataService } from '../../../services/fetched-data.service';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.scss']
})
export class ParticipantEditComponent implements OnInit, OnDestroy {

  participantForm: FormGroup;
  community: FormControl;
  surname: FormControl;

  fValue$: Observable<any>;

  currentNumberOfParticipants: number;

  subs = new Subscription();

  constructor(
    private fB: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private dBSrv: DataBaseService,
    private fDSrv: FetchedDataService,
    private fBSrv: FirebaseService) {
    this.participantForm = this.fB.group({
      'wspólnota': ['', Validators.required],
      'obecność': [''],
      'nazwisko': ['', Validators.required],
      'przydział': [''],
      'zakwaterowanie': [''],
      'samochód': [''],
      'prezbiter': [null],
      'małżeństwo': [null],
      'kobiety': [null],
      'mężczyźni': [null],
      'niemowlęta': [null],
      'dzieci': [null],
      'nianiaZRodziny': [null],
      'nianiaObca': [null],
      'uwagi': [null],
      'wiek': [null],
    })
  }

  ngOnInit(): void {
    this.community = this.participantForm.controls['wspólnota'] as FormControl;
    this.surname = this.participantForm.controls['nazwisko'] as FormControl;

    this.fValue$= this.participantForm.valueChanges;

    this.subs.add(
      this.fBSrv.getParticipantList().valueChanges().pipe(
        tap(pts => {
          this.currentNumberOfParticipants = pts.length;
          console.log('liczba uczestnikó: ',this.currentNumberOfParticipants )
        })
      ).subscribe()
    );

  }

  getErrorMessage(control: string) {
    if (control === 'community') {
      return this.community.hasError('required') ? 'Pole wymagane': '';
    } else {
      return this.surname.hasError('required') ? 'Pole wymagane': '';
    }
  }

  save() {
    const newPartObj = {...this.participantForm.value, id: this.currentNumberOfParticipants }
    console.log('To jest dodany nowy udzestnik:', newPartObj);
    this.store.dispatch(addParticipantSuccess({newParticipant: newPartObj}));
    this.fBSrv.addParticipant(newPartObj);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
