import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as fromRoot from '../../reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from '../../services/firebase.service';
import { addOtherAccommodationSuccess } from '../actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-other-accommodation-edit',
  templateUrl: './other-accommodation-edit.component.html',
  styleUrls: ['./other-accommodation-edit.component.scss']
})
export class OtherAccommodationEditComponent implements OnInit {

  otherAccommodationForm: FormGroup;
  otherAccommodationUnit: FormControl;

  constructor(
    private fB: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private fBSrv: FirebaseService,
    private router: Router,
  ) {
    this.otherAccommodationForm = this.fB.group({
      'pokój': ['', Validators.required],
      'il os zakwaterowana': [null],
      'łóżko pojed': [null],
      'il tap 2-os': [null],
      'łóżko duże': [null],
      'max il osób': [null],
      'wolne łóżka': [null],
      'przydział': [''],
      'nazwiska': [''],
      'wspólnota': [''],
    })
  }

  ngOnInit(): void {
    this.otherAccommodationUnit = this.otherAccommodationForm.controls['pokój'] as FormControl;
  }

  getErrorMessage(control: string) {
    if (control === 'pokój') {
      return this.otherAccommodationUnit.hasError('required') ? 'Pole wymagane': '';
    };
    return;
  }

  save() {
    const newOthAccObj = {...this.otherAccommodationForm.value, id: Date.now()}
    this.store.dispatch(addOtherAccommodationSuccess({newOtherAccommodation: newOthAccObj}));
    this.fBSrv.addOtherAccommodation(newOthAccObj);
    this.router.navigate(['accommodation', 'other-list']);
  }

}
