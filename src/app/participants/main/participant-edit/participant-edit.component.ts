import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as fromRoot from './.././../../reducer';
import { Store } from '@ngrx/store';
import { relieveActiveParticpantData, relieveActiveParticipantRoom, updateParticipantRequest,
      markSaveParticipantBtnClicked, 
      goToAssignedRoom} from '../../actions';
import { Subscription, map, withLatestFrom, of, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import * as fromParticipants from '../../participants.reducer';
import * as fromAccommodations from '../../../accommodation/accommodation.reducer';
import * as fromOtherAccommodations from '../../../accommodation/other-accommodation.reducer';
import { IParticipant } from '../../../interfaces/participant';
import { IOtherAccommodation } from '../../../interfaces/other-accommodation';
import { IAccommodation } from '../../../interfaces/accommodation';
import { markSaveAccommodationBtnUnClicked, markSaveOtherAccommodationBtnUnClicked, loadActiveAccommodationDataSuccess } from '../../../accommodation/actions';
import { ParticipantsService } from '../../../services/participants.service';
import { addParticipantRequest } from '../../actions';
import { AccommodationService } from '../../../services/accommodation.service';
import { OtherAccommodationService } from 'src/app/services/other-accommodation.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.scss']
})
export class ParticipantEditComponent implements OnInit, OnDestroy {

  participantForm: FormGroup;
  community: FormControl;
  surname: FormControl;

  editMode = false;
  activeParticipant: IParticipant | undefined = undefined;
  buttonText = 'Zapisz';
  headerText = 'Nowy uczestnik'

  disabled = new BehaviorSubject(true);
  disabled$ = this.disabled.asObservable();

  totalAccomList$: Observable<(IAccommodation | IOtherAccommodation)[]>;

  subs = new Subscription();

  constructor(
    private fB: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private partSrv: ParticipantsService,
    private accSrv: AccommodationService,
    private othAccSrv: OtherAccommodationService) {
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

    this.subs.add(
      this.store.select(fromParticipants.getActiveParticipant).pipe(
        map((participant) => {
          if(participant) {
            this.editMode = true;
            this.activeParticipant = participant;
            console.log('To jest aktywny participant: ', participant)
            this.participantForm.patchValue(participant);
            console.log('To jest partForm: ', this.participantForm.value)
            this.buttonText = 'Aktualizuj';
            this.headerText = 'Edytuj uczestnika'
          }
        }),
      ).subscribe()
    );
    this.subs.add(
      this.participantForm.statusChanges.pipe(
        withLatestFrom(this.store.select(fromParticipants.getActiveParticipant)),
        map(([status, activePart]) => {
          if (activePart) {
            this.disabled$ = of(this.participantForm.pristine);
          } else {
            this.disabled$ = (status === 'INVALID') ? of(true) : of(false);
          }
        })
      ).subscribe()
    );

    this.totalAccomList$ = combineLatest([
        this.store.select(fromAccommodations.getAccommodations),
        this.store.select(fromOtherAccommodations.getOtherAccommodations)
      ]).pipe(
        map(([accomList, otherAccomList]) => {
          return [...accomList, ...otherAccomList]
        })
      );
  }

  getErrorMessage(control: string) {
    if (control === 'community') {
      return this.community.hasError('required') ? 'Pole wymagane': '';
    } else {
      return this.surname.hasError('required') ? 'Pole wymagane': '';
    }
  }

  isTaken(accom: IAccommodation | IOtherAccommodation) {
    return this.partSrv.isTaken(accom);
  }

  relieveRoom(e: Event) {
    e.stopPropagation();
    this.store.dispatch(relieveActiveParticipantRoom());
    this.disabled$ = of(false);
  }

  goToRoom(e: Event) {
    e.stopPropagation();
    if(this.activeParticipant) {
      this.store.dispatch(goToAssignedRoom({ participant: this.activeParticipant}));
    }
  }

  save() {
    if (!this.editMode) {
      const newPartObj = {...this.participantForm.value, id: Date.now() };
      this.store.dispatch(addParticipantRequest({newParticipant: newPartObj}));
    } else {
      const updatedPartObj: IParticipant = {...this.participantForm.value, id: this.activeParticipant?.id};
      this.store.dispatch(updateParticipantRequest({ participant: updatedPartObj, updateAcmd: true }));
    }
    this.store.dispatch(markSaveParticipantBtnClicked());
    this.store.dispatch(markSaveAccommodationBtnUnClicked());
    this.store.dispatch(markSaveOtherAccommodationBtnUnClicked());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    // stop dipatching relieveActiveParticipantData in order to be able to come back to partEdition by 'Powrót' button
    // this.store.dispatch(relieveActiveParticpantData());
  }

}
