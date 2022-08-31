import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as fromRoot from './.././../../reducer';
import { Store } from '@ngrx/store';
import { addParticipantSuccess, relieveActiveParticpantData,
      relieveActiveParticipantRoom, updateParticipantRequest,
      markSaveParticipantBtnClicked } from '../../actions';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router';
import { Subscription, map, withLatestFrom, of, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import * as fromParticipants from '../../participants.reducer';
import * as fromAccommodations from '../../../accommodation/accommodation.reducer';
import * as fromOtherAccommodations from '../../../accommodation/other-accommodation.reducer';
import { IParticipant } from '../../../interfaces/participant';
import { IOtherAccommodation } from '../../../interfaces/other-accommodation';
import { IAccommodation } from '../../../interfaces/accommodation';
import { markSaveAccommodationBtnUnClicked, markSaveOtherAccommodationBtnUnClicked } from '../../../accommodation/actions';
import { ParticipantsService } from '../../../services/participants.service';

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
    private fBSrv: FirebaseService,
    private router: Router,
    private partSrv: ParticipantsService) {
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
            this.participantForm.patchValue(participant);
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

  save() {
    if (!this.editMode) {
      const newPartObj = {...this.participantForm.value, id: Date.now() };
      this.store.dispatch(addParticipantSuccess({newParticipant: newPartObj}));
      this.fBSrv.addParticipant(newPartObj);
      this.router.navigate(['participants', 'list']);
    } else {
      const updatedPartObj: IParticipant = {...this.participantForm.value, id: this.activeParticipant?.id};
      console.log('To są dane participanta updateowane podczas savea.:', updatedPartObj);
      this.store.dispatch(updateParticipantRequest({ participant: updatedPartObj, updateAcmd: true }));
    }
    this.store.dispatch(markSaveParticipantBtnClicked());
    this.store.dispatch(markSaveAccommodationBtnUnClicked());
    this.store.dispatch(markSaveOtherAccommodationBtnUnClicked());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.store.dispatch(relieveActiveParticpantData());
  }

}
