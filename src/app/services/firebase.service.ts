import { Injectable, OnDestroy } from '@angular/core';
import { IParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { map, tap, combineLatest, Subscription, filter } from 'rxjs';
import { FetchedDataService } from './fetched-data.service';

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

  constructor(private fireDb: AngularFireDatabase, private fDSrv: FetchedDataService) {}

  getParticipantList() {
    this.participantsRef = this.fireDb.list('Lista braci');
    return this.participantsRef.valueChanges().pipe(
      filter(partList => !!partList),
      map(partList => this.fDSrv.mapParticipantList(partList).sort((a, b) => a.wspólnota.localeCompare(b.wspólnota))),
    );
  }

  getAccommodationList(){
    this.accommodationsRef = this.fireDb.list('Kwatery u Buzunów');
    return this.accommodationsRef.valueChanges().pipe(
      filter(accomList => !!accomList),
      map(accomList => this.fDSrv.mapAccommodationList(accomList).sort((a, b) => a.pokój.localeCompare(b.pokój)))
    );
  }

  getOtherAccommodationList(){
    this.otherAccommodationsRef = this.fireDb.list('Kwatery obce');
    return this.otherAccommodationsRef.valueChanges().pipe(
      filter(otherAccomList => !!otherAccomList),
      map(otherAccomList => this.fDSrv.mapOtherAccommodationList(otherAccomList).sort((a, b) => a.pokój.localeCompare(b.pokój)))
    );
  }

  supplyAccommodationsWithFBKeys() {
    return combineLatest([this.accommodationsSnChngs$, this.accommodationsValChngs$]).pipe(
      map(([sC, vC]) => {
        vC.forEach((elem, index) => {
          let accommodationWithFBKey = {...{elem}, key: sC[index]?.key}
          this.accommodationListWithFBKeys.push(accommodationWithFBKey);
        })
      })
    )
  }

  supplyOtherAccommodationsWithFBKeys() {
    return combineLatest([this.otherAccommodationsSnChngs$, this.otherAccommodationsValChngs$]).pipe(
      map(([sC, vC]) => {
        vC.forEach((elem, index) => {
          let otherAccommodationWithFBKey = {...{elem}, key: sC[index]?.key};
          this.otherAccommodationListWithFBKeys.push(otherAccommodationWithFBKey);
        })
      })
    )
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
        this.participantRef = this.fireDb.object('Lista braci/' + elemToUpdate?.key);
        this.participantRef.update({
          wspólnota: part.wspólnota ?? '',
          obecność: part.obecność ?? '',
          nazwisko: part.nazwisko ?? '',
          przydział: part.przydział ?? '',
          zakwaterowanie: part.zakwaterowanie ?? '',
          samochód: part.samochód ?? '',
          prezbiter: part.prezbiter ?? null,
          małżeństwo: part.małżeństwo ?? null,
          kobiety: part.kobiety ?? null,
          mężczyźni: part.mężczyźni ?? null,
          niemowlęta: part.niemowlęta ?? null,
          dzieci: part.dzieci ?? null,
          nianiaZRodziny: part.nianiaZRodziny ?? null,
          nianiaObca: part.nianiaObca ?? null,
          uwagi: part.uwagi ?? '',
          wiek: part.wiek ?? null,
        }).catch((error) => {
          this.errorMgmt(error);
        });
      })
    )
  }

  updateAccommodation(accom: IAccommodation) {
    return this.supplyAccommodationsWithFBKeys().pipe(
      tap(() => {
        let elemToUpdate = this.accommodationListWithFBKeys.find(a => (+a.elem['Id '] === +accom.id || +a.elem.id === +accom.id));
        this.accommodationRef = this.fireDb.object('Kwatery u Buzunów/' + elemToUpdate?.key);
        this.accommodationRef.update({
        'il os zakwaterowana': accom['il os zakwaterowana'] ?? null,
        'il tap 1-os': accom['il tap 1-os'] ?? null,
        'można dostawić': accom['można dostawić'] ?? null,
        'wolne łóżka': accom['wolne łóżka'] ?? null,
        'przydział': accom.przydział ?? null,
        'nazwiska': accom.nazwiska ?? '',
        'pokój': accom['pokój'] ?? '',
        'razem osób': accom['razem osób'] ?? null,
        'wspólnota': accom['wspólnota'] ?? '',
        }).catch((error) => {
          this.errorMgmt(error);
        });
      }),
    )
  }

  updateOtherAccommodation(othAccom: IOtherAccommodation) {
    return this.supplyOtherAccommodationsWithFBKeys().pipe(
      tap(() => {
        let elemToUpdate = this.otherAccommodationListWithFBKeys.find(a => (+a.elem['Id '] === +othAccom.id || +a.elem.id === +othAccom.id));
        this.otherAccommodationRef = this.fireDb.object('Kwatery obce/' + elemToUpdate?.key);
        this.otherAccommodationRef.update({
          'il os zakwaterowana': othAccom['il os zakwaterowana'] ?? null,
          'il tap 2-os': othAccom['il tap 2-os'] ?? null,
          'łóżko pojed': othAccom['łóżko pojed'] ?? null,
          'łóżko duże': othAccom['łóżko duże'] ?? null,
          'wolne łóżka': othAccom['wolne łóżka'] ?? null,
          'przydział': othAccom.przydział ?? null,
          'nazwiska': othAccom['nazwiska'] ?? '',
          'pokój': othAccom['pokój'] ?? '',
          'max il osób': othAccom['max il osób'] ?? null,
          'wspólnota': othAccom['wspólnota'] ?? '',
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
    return this.supplyAccommodationsWithFBKeys().pipe(
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
    return this.supplyOtherAccommodationsWithFBKeys().pipe(
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
    console.log('Coś się zespsuło....: ', error);
  }

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }
}
