import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from './.././../../reducer';
import { Store } from '@ngrx/store';
import { addParticipant } from '../../actions';
import { DataBaseService } from '../../../services/data-base.service';

import { FetchedDataService } from '../../../services/fetched-data.service';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.scss']
})
export class ParticipantEditComponent implements OnInit {

  participantForm: FormGroup;
  community: FormControl;
  surname: FormControl;

  fValue$: Observable<any>;


  participantsWorkSheet: any;

  constructor(
    private fB: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private dBSrv: DataBaseService,
    private fDSrv: FetchedDataService) {
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
  }

  getErrorMessage(control: string) {
    if (control === 'community') {
      return this.community.hasError('required') ? 'Pole wymagane': '';
    } else {
      return this.surname.hasError('required') ? 'Pole wymagane': '';
    }
  }

  save() {
    this.store.dispatch(addParticipant({newParticipant: this.participantForm.value}));

    console.log('To jest formValue:', this.participantForm.value);
  }

}
