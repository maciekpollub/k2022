import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as fromRoot from '../../reducer';
import * as fromAccommodations from '../accommodation.reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from '../../services/firebase.service';
import { addAccommodationSuccess, updateAccommodationSuccess, relieveActiveAccommodationData } from '../actions';
import { Router } from '@angular/router';
import { IAccommodation } from '../../interfaces/accommodation';
import { BehaviorSubject, map, of, Subscription, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-accommodation-edit',
  templateUrl: './accommodation-edit.component.html',
  styleUrls: ['./accommodation-edit.component.scss']
})
export class AccommodationEditComponent implements OnInit, OnDestroy {

  accommodationForm: FormGroup;
  accommodationUnit: FormControl;

  editMode = false;
  activeAccommodation: IAccommodation | undefined = undefined;
  buttonText = 'Zapisz';
  headerText = 'Nowa kwatera u Buzuna';

  disabled = new BehaviorSubject(true);
  disabled$ = this.disabled.asObservable();

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
      this.store.select(fromAccommodations.getActiveAccommodation).pipe(
        map((accommodation) => {
          if(accommodation) {
            this.editMode = true;
            this.activeAccommodation = accommodation;
            this.accommodationForm.patchValue(accommodation);
            this.buttonText = 'Aktualizuj';
            this.headerText = 'Edytuj kwaterę u Buzuna'
          }
        })
      ).subscribe()
    );
    this.subs.add(
      this.accommodationForm.statusChanges.pipe(
        withLatestFrom(this.store.select(fromAccommodations.getActiveAccommodation)),
        map(([status, activeAccom]) => {
          if (activeAccom) {
            this.disabled$ = of(this.accommodationForm.pristine);
          } else {
            this.disabled$ = (status === 'INVALID') ? of(true) : of(false);
          }
        })
      ).subscribe()
    )
  }

  getErrorMessage(control: string) {
    if (control === 'pokój') {
      return this.accommodationUnit.hasError('required') ? 'Pole wymagane': '';
    };
    return;
  }

  save() {
    if (!this.editMode) {
      const newAccObj = {...this.accommodationForm.value, id: Date.now()}
      this.store.dispatch(addAccommodationSuccess({newAccommodation: newAccObj}));
      this.fBSrv.addAccommodation(newAccObj);
      this.router.navigate(['accommodation', 'buzun-list']);
    } else {
      const updatedAccomObj = {...this.accommodationForm.value, id: this.activeAccommodation?.id};
      this.store.dispatch(updateAccommodationSuccess({accommodation: updatedAccomObj}));
      this.subs.add(
        this.fBSrv.updateAccommodation(updatedAccomObj).subscribe(() => this.router.navigate(['accommodation', 'buzun-list']))
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.store.dispatch(relieveActiveAccommodationData());
  }
}
