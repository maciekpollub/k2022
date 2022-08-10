import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as fromRoot from '../../reducer';
import * as fromOtherAccommodations from '../other-accommodation.reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from '../../services/firebase.service';
import { addOtherAccommodationSuccess, updateOtherAccommodationSuccess, relieveActiveOtherAccommodationData } from '../actions';
import { Router } from '@angular/router';
import { IOtherAccommodation } from '../../interfaces/other-accommodation';
import { BehaviorSubject, map, of, Subscription, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-other-accommodation-edit',
  templateUrl: './other-accommodation-edit.component.html',
  styleUrls: ['./other-accommodation-edit.component.scss']
})
export class OtherAccommodationEditComponent implements OnInit, OnDestroy {

  otherAccommodationForm: FormGroup;
  otherAccommodationUnit: FormControl;

  editMode = false;
  activeOtherAccommodation: IOtherAccommodation | undefined = undefined;
  buttonText = 'Zapisz';
  headerText = 'Nowa kwatera (inna)';

  disabled = new BehaviorSubject(true);
  disabled$ = this.disabled.asObservable();

  subs = new Subscription();

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

    this.subs.add(
      this.store.select(fromOtherAccommodations.getActiveOtherAccommodation).pipe(
        map((otherAccommodation) => {
          if(otherAccommodation) {
            this.editMode = true;
            this.activeOtherAccommodation = otherAccommodation,
            this.otherAccommodationForm.patchValue(otherAccommodation);
            this.buttonText = 'Aktualizuj';
            this.headerText = 'Edytuj kwaterę (inną)';
          }
        })
      ).subscribe()
    );
    this.subs.add(
      this.otherAccommodationForm.statusChanges.pipe(
        withLatestFrom(this.store.select(fromOtherAccommodations.getActiveOtherAccommodation)),
        map(([status, activeOthAccom]) => {
          if(activeOthAccom) {
            this.disabled$ = of(this.otherAccommodationForm.pristine);
          } else {
            this.disabled$ = (status === 'INVALID') ? of(true) : of(false);
          }
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
    if(!this.editMode) {
      const newOthAccObj = {...this.otherAccommodationForm.value, id: Date.now()}
      this.store.dispatch(addOtherAccommodationSuccess({newOtherAccommodation: newOthAccObj}));
      this.fBSrv.addOtherAccommodation(newOthAccObj);
      this.router.navigate(['accommodation', 'other-list']);
    } else {
      const updatedOthAccomObj = {...this.otherAccommodationForm.value, id: this.activeOtherAccommodation?.id};
      this.store.dispatch(updateOtherAccommodationSuccess({otherAccommodation: updatedOthAccomObj}));
      this.subs.add(
        this.fBSrv.updateOtherAccommodation(updatedOthAccomObj).subscribe(() => this.router.navigate(['accommodation', 'other-list']))
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.store.dispatch(relieveActiveOtherAccommodationData());
  }
}
