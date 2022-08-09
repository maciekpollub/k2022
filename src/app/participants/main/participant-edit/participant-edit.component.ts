import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as fromRoot from './.././../../reducer';
import { Store } from '@ngrx/store';
import { addParticipantSuccess, relieveActiveParticpantData, updateParticipantSuccess } from '../../actions';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router';
import { Subscription, map, withLatestFrom, of, BehaviorSubject } from 'rxjs';
import * as fromParticipants from '../../participants.reducer';
import { IParticipant } from '../../../interfaces/participant';

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

  subs = new Subscription();

  constructor(
    private fB: FormBuilder,
    private store: Store<fromRoot.IAppState>,
    private fBSrv: FirebaseService,
    private router: Router) {
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
    )
  }

  getErrorMessage(control: string) {
    if (control === 'community') {
      return this.community.hasError('required') ? 'Pole wymagane': '';
    } else {
      return this.surname.hasError('required') ? 'Pole wymagane': '';
    }
  }

  save() {
    if (!this.editMode) {
      const newPartObj = {...this.participantForm.value, id: Date.now() };
      this.store.dispatch(addParticipantSuccess({newParticipant: newPartObj}));
      this.fBSrv.addParticipant(newPartObj);
      this.router.navigate(['participants', 'list']);
    } else {
      const updatedPartObj = {...this.participantForm.value, id: this.activeParticipant?.id};
      this.store.dispatch(updateParticipantSuccess({participant: updatedPartObj}));
      this.subs.add(
        this.fBSrv.updateParticipant(updatedPartObj).subscribe(() => this.router.navigate(['participants', 'list']))
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.store.dispatch(relieveActiveParticpantData());
  }

}
