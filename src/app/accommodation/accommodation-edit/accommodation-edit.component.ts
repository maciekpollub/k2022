import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as fromRoot from '../../reducer';
import * as fromAccommodations from '../accommodation.reducer';
import { Store } from '@ngrx/store';
import { FirebaseService } from '../../services/firebase.service';
import { relieveActiveAccommodationData, updateAccommodationRequest, markSaveAccommodationBtnClicked,
        markSaveOtherAccommodationBtnUnClicked, relieveActiveAccommodationOccupier, addAccommodationRequest } from '../actions';
import { Router } from '@angular/router';
import { IAccommodation } from '../../interfaces/accommodation';
import { BehaviorSubject, map, of, Subscription, withLatestFrom } from 'rxjs';
import { markSaveParticipantBtnUnClicked } from '../../participants/actions';

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
  ) {
    this.accommodationForm = this.fB.group({
      'pokój': ['', Validators.required],
      'il os zakwaterowana': [],
      'il tap 1-os': [],
      'można dostawić': [],
      'wolne łóżka': [],
      'przydział': [''],
      'nazwiska': [''],
      'razem osób': [],
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
    );
  }

  getErrorMessage(control: string) {
    if (control === 'pokój') {
      return this.accommodationUnit.hasError('required') ? 'Pole wymagane': '';
    };
    return;
  }

  relieveOccupier(e: Event) {
    e.stopPropagation();
    this.store.dispatch(relieveActiveAccommodationOccupier());
    this.disabled$ = of(false);
  }

  save() {
    this.store.dispatch(markSaveAccommodationBtnClicked());
    this.store.dispatch(markSaveOtherAccommodationBtnUnClicked());
    this.store.dispatch(markSaveParticipantBtnUnClicked());
    if(!this.editMode) {
      const newAccObj = {...this.accommodationForm.value, id: Date.now()}
      this.store.dispatch(addAccommodationRequest({ newAccommodation: newAccObj }));
    } else {
      const updatedAccomObj = {...this.accommodationForm.value, id: this.activeAccommodation?.id};
      this.store.dispatch(updateAccommodationRequest({ accommodation: updatedAccomObj, updatePart: true }));
    }
      }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.store.dispatch(relieveActiveAccommodationData());
  }
}
