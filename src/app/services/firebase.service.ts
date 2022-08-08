import { Injectable, OnDestroy } from '@angular/core';
import { IParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { map, tap, combineLatest, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnDestroy {
  participantsRef: AngularFireList<any>;
  participantRef: AngularFireObject<any>;

  accommodationsRef: AngularFireList<any>;
  accommodationRef: AngularFireObject<any>;

  otherAccommodationsRef: AngularFireList<any>;
  otherAccommodationRef: AngularFireObject<any>;

  participantsSnChngs$ = this.fireDb.list('Lista braci').snapshotChanges();
  participantsValChngs$ = this.fireDb.list('Lista braci').valueChanges();
  participantListWithFBKeys: any[] = [];

  accommodationsSnChngs$ = this.fireDb.list('Kwatery u Buzunów').snapshotChanges();
  accommodationsValChngs$ = this.fireDb.list('Kwatery u Buzunów').valueChanges();
  accommodationListWithFBKeys: any[] = [];

  otherAccommodationsSnChngs$ = this.fireDb.list('Kwatery obce').snapshotChanges();
  otherAccommodationsValChngs$ = this.fireDb.list('Kwatery obce').valueChanges();
  otherAccommodationListWithFBKeys: any[] = [];

  subs = new Subscription();

  constructor(private fireDb: AngularFireDatabase) {}

  getParticipantList() {
    this.participantsRef = this.fireDb.list('Lista braci');
    return this.participantsRef;
  }

  getAccommodationList(){
    this.accommodationsRef = this.fireDb.list('Kwatery u Buzunów');
    return this.accommodationsRef;
  }

  getOtherAccommodationList(){
    this.otherAccommodationsRef = this.fireDb.list('Kwatery obce');
    return this.otherAccommodationsRef;
  }

  addParticipant(p: IParticipant) {
    this.participantsRef
      .push({
        id: p.id,
        wspólnota: p.wspólnota,
        obecność: p.obecność,
        nazwisko: p.nazwisko,
        przydział: p.przydział,
        zakwaterowanie: p.zakwaterowanie,
        samochód: p.samochód,
        prezbiter: p.prezbiter,
        małżeństwo: p.małżeństwo,
        kobiety: p.kobiety,
        mężczyźni: p.mężczyźni,
        niemowlęta: p.niemowlęta,
        dzieci: p.dzieci,
        nianiaZRodziny: p.nianiaZRodziny,
        nianiaObca: p.nianiaObca,
        uwagi: p.uwagi,
        wiek: p.wiek,
      })
      .catch((error) => {
        this.errorMgmt(error);
      });
  }

  addAccommodation(a: IAccommodation) {
    this.accommodationsRef
      .push({
        'id': a.id,
        'il os zakwaterowana': a['il os zakwaterowana'],
        'il tap 1-os': a['il tap 1-os'],
        'można dostawić': a['można dostawić'],
        'wolne łóżka': a['wolne łóżka'],
        'przydział': a.przydział,
        'nazwiska': a.nazwiska,
        'pokój': a.pokój,
        'razem osób': a['razem osób'],
        'wspólnota': a.wspólnota,
      })
      .catch((error) => {
        this.errorMgmt(error);
      });
  }

  addOtherAccommodation(a: IOtherAccommodation) {
    this.otherAccommodationsRef
      .push({
        'id': a.id,
        'il os zakwaterowana': a['il os zakwaterowana'],
        'il tap 2-os': a['il tap 2-os'],
        'łóżko pojed': a['łóżko pojed'],
        'łóżko duże': a['łóżko duże'],
        'wolne łóżka': a['wolne łóżka'],
        'przydział': a.przydział,
        'nazwiska': a.nazwiska,
        'pokój': a.pokój,
        'max il osób': a['max il osób'],
        'wspólnota': a.wspólnota,
      })
      .catch((error) => {
        this.errorMgmt(error);
      });
  }

  getParticipant(id: string) {
    this.participantRef = this.fireDb.object('Lista braci/' + id);
    return this.participantRef;
  }

  updateParticipant(part: IParticipant) {
    return combineLatest([this.participantsSnChngs$, this.participantsValChngs$]).pipe(
      map(([sC, vC]) => {
        vC.forEach((elem, index) => {
          let participantWithFBKey = {...{elem}, key: sC[index]?.key}
          this.participantListWithFBKeys.push(participantWithFBKey);
        })
      }),
      tap(() => {
        let elemToUpdate = this.participantListWithFBKeys.find(p => (+p.elem['Id '] === +part.id || +p.elem.id === +part.id));
        console.log('To jest key:', elemToUpdate?.key);
        this.participantRef = this.fireDb.object('Lista braci/' + elemToUpdate?.key);
        this.participantRef.update({
          wspólnota: part.wspólnota,
          obecność: part.obecność,
          nazwisko: part.nazwisko,
          przydział: part.przydział,
          zakwaterowanie: part.zakwaterowanie,
          samochód: part.samochód,
          prezbiter: part.prezbiter,
          małżeństwo: part.małżeństwo,
          kobiety: part.kobiety,
          mężczyźni: part.mężczyźni,
          niemowlęta: part.niemowlęta,
          dzieci: part.dzieci,
          nianiaZRodziny: part.nianiaZRodziny,
          nianiaObca: part.nianiaObca,
          uwagi: part.uwagi,
          wiek: part.wiek,
        }).catch((error) => {
          this.errorMgmt(error);
        });
      })
    )
  }

  deleteParticipant(id: string) {
    return combineLatest([this.participantsSnChngs$, this.participantsValChngs$]).pipe(
      map(([sC, vC]) => {
        vC.forEach((elem, index) => {
          let participantWithFBKey = {...{elem}, key: sC[index]?.key}
          this.participantListWithFBKeys.push(participantWithFBKey);
        })
      }),
      tap(() => {
        let elemToDelete = this.participantListWithFBKeys.find(p => (+p.elem['Id '] === +id || +p.elem.id === +id));
        this.participantRef = this.fireDb.object('Lista braci/' + elemToDelete?.key);
        this.participantRef.remove().catch((error) => {
          this.errorMgmt(error);
        });
      })
    )
  }

  deleteAccommodation(id: string) {
    return combineLatest([this.accommodationsSnChngs$, this.accommodationsValChngs$]).pipe(
      map(([sC, vC]) => {
        vC.forEach((elem, index) => {
          let accommodationWithFBKey = {...{elem}, key: sC[index]?.key}
          this.accommodationListWithFBKeys.push(accommodationWithFBKey);
        })
      }),
      tap(() => {
        let elemToDelete = this.accommodationListWithFBKeys.find(a => (+a.elem['id'] === +id));
        this.accommodationRef = this.fireDb.object('Kwatery u Buzunów/' + elemToDelete?.key);
        this.accommodationRef.remove().catch((error) => {
          this.errorMgmt(error);
        });
      })
    )
  }

  deleteOtherAccommodation(id: string) {
    return combineLatest([this.otherAccommodationsSnChngs$, this.otherAccommodationsValChngs$]).pipe(
      map(([sC, vC]) => {
        vC.forEach((elem, index) => {
          let otherAccommodationWithFBKey = {...{elem}, key: sC[index]?.key}
          this.otherAccommodationListWithFBKeys.push(otherAccommodationWithFBKey);
        })
      }),
      tap(() => {
        let elemToDelete = this.otherAccommodationListWithFBKeys.find(a => (+a.elem['id'] === +id));
        this.otherAccommodationRef = this.fireDb.object('Kwatery obce/' + elemToDelete?.key);
        this.otherAccommodationRef.remove().catch((error) => {
          this.errorMgmt(error);
        });
      })
    )
  }

  private errorMgmt(error: any) {
    console.log(error);
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }
}
