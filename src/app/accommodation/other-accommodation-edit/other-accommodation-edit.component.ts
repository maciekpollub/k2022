import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import * as fromRoot from '../../reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from '../../services/firebase.service';
import { addOtherAccommodationSuccess } from '../actions';

@Component({
  selector: 'app-other-accommodation-edit',
  templateUrl: './other-accommodation-edit.component.html',
  styleUrls: ['./other-accommodation-edit.component.scss']
})
export class OtherAccommodationEditComponent implements OnInit {

  otherAccommodationForm: FormGroup;
  otherAccommodationUnit: FormControl;

  currentNumberOfOtherAccommodations: number;

  subs = new Subscription();

  constructor(
    private fB: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private fBSrv: FirebaseService
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

    this.subs.add(
      this.fBSrv.getOtherAccommodationList().valueChanges().pipe(
        tap(othAcmds => {
          this.currentNumberOfOtherAccommodations = othAcmds.length;
        })
      ).subscribe()
    );
  }

  getErrorMessage(control: string) {
    if (control === 'pokój') {
      return this.otherAccommodationUnit.hasError('required') ? 'Pole wymagane': '';
    };
    return;
  }

  save() {
    const newOthAccObj = {...this.otherAccommodationForm.value, id: this.currentNumberOfOtherAccommodations + 1 }
    this.store.dispatch(addOtherAccommodationSuccess({newOtherAccommodation: newOthAccObj}));
    this.fBSrv.addOtherAccommodation(newOthAccObj);
  }

}
