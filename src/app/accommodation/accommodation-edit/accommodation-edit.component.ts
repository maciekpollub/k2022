import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import * as fromRoot from '../../reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from '../../services/firebase.service';
import { addAccommodationSuccess } from '../actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accommodation-edit',
  templateUrl: './accommodation-edit.component.html',
  styleUrls: ['./accommodation-edit.component.scss']
})
export class AccommodationEditComponent implements OnInit, OnDestroy {

  accommodationForm: FormGroup;
  accommodationUnit: FormControl;

  currentNumberOfAccommodations: number;

  subs = new Subscription();

  constructor(
    private fB: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private fBSrv: FirebaseService,
    private router: Router,
  ) {
    this.accommodationForm = this.fB.group({
      'pokój': ['', Validators.required],
      'il os zakwaterowana': [null],
      'il tap 1-os': [null],
      'można dostawić': [null],
      'wolne łóżka': [null],
      'przydział': [''],
      'nazwiska': [''],
      'razem osób': [null],
      'wspólnota': [''],
    })
   }

  ngOnInit(): void {
    this.accommodationUnit = this.accommodationForm.controls['pokój'] as FormControl;

    this.subs.add(
      this.fBSrv.getAccommodationList().valueChanges().pipe(
        tap(acmds => {
          this.currentNumberOfAccommodations = acmds.length;
        })
      ).subscribe()
    );
  }

  getErrorMessage(control: string) {
    if (control === 'pokój') {
      return this.accommodationUnit.hasError('required') ? 'Pole wymagane': '';
    };
    return;
  }

  save() {
    const newAccObj = {...this.accommodationForm.value, id: this.currentNumberOfAccommodations }
    this.store.dispatch(addAccommodationSuccess({newAccommodation: newAccObj}));
    this.fBSrv.addAccommodation(newAccObj);
    this.router.navigate(['accommodation', 'buzun-list']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
