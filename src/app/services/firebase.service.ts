import { Injectable, OnDestroy } from '@angular/core';
import { IParticipant, IFBParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { map, tap, combineLatest, Subscription, filter, Observable, zip, withLatestFrom, take } from 'rxjs';
import { FetchedDataService } from './fetched-data.service';
import { ParticipantsService } from './participants.service';
import { AccommodationService } from './accommodation.service';

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
  partToUpdate: IFBParticipant;
  // updatedPart$: Observable<IParticipant>;

  accommodationsSnChngs$ = this.fireDb.list('Kwatery u Buzunów').snapshotChanges();
  accommodationsValChngs$ = this.fireDb.list('Kwatery u Buzunów').valueChanges();
  accommodationListWithFBKeys: any[] = [];

  otherAccommodationsSnChngs$ = this.fireDb.list('Kwatery obce').snapshotChanges();
  otherAccommodationsValChngs$ = this.fireDb.list('Kwatery obce').valueChanges();
  otherAccommodationListWithFBKeys: any[] = [];

  subs = new Subscription();

  constructor(
    private fireDb: AngularFireDatabase,
    private fDSrv: FetchedDataService,
    private partSrv: ParticipantsService,
    private accomSrv: AccommodationService) {}

  getParticipantList() {
    this.participantsRef = this.fireDb.list('Lista braci');
    return this.participantsRef.valueChanges().pipe(
      map(partList => {
        console.log('LIsta sprzed zmapowania!!!!!!!!!!!!!: ', partList)
        let list: IParticipant[] = this.fDSrv.mapParticipantList(partList);
        return list;
      }),
      tap((list) => console.log('To jest lista: ', list)),
      );
  }

  getAccommodationList(){
    this.accommodationsRef = this.fireDb.list('Kwatery u Buzunów');
    console.log('To jest accommodationsRef z firebaseSErveice: ', this.accommodationsRef )
    return this.accommodationsRef.valueChanges().pipe(
      // take(1),
      map(accomList => {
          let mappedList = this.fDSrv.mapAccommodationList(accomList);
          return mappedList.sort((a, b) => a.pokój.localeCompare(b.pokój));
      })
    );
  }

  getOtherAccommodationList(){
    this.otherAccommodationsRef = this.fireDb.list('Kwatery obce');
    return this.otherAccommodationsRef.valueChanges().pipe(
      filter(otherAccomList => !!otherAccomList),
      map(otherAccomList => this.fDSrv.mapOtherAccommodationList(otherAccomList).sort((a, b) => a.pokój.localeCompare(b.pokój)))
    );
  }

  supplyParticipantsWithFBKeys() {
    // nie ruszać combineLatest !! ;]
    return combineLatest([this.participantsSnChngs$, this.participantsValChngs$]).pipe(
      map(([sC, vC]) => {
        this.participantListWithFBKeys = [];
        vC.forEach((elem, index) => {
          let participantWithFBKey = {...{elem}, key: sC[+index]?.key};
          this.participantListWithFBKeys = [...this.participantListWithFBKeys, participantWithFBKey]
        })
        console.log('To jest partcipantListWithFbKeys: ', this.participantListWithFBKeys)
        return this.participantListWithFBKeys;
      })
    )
  }

  supplyAccommodationsWithFBKeys() {
    return combineLatest([this.accommodationsSnChngs$, this.accommodationsValChngs$]).pipe(
      map(([sC, vC]) => {
        this.accommodationListWithFBKeys = [];
        vC.forEach((elem, index) => {
          let accommodationWithFBKey = {...{elem}, key: sC[+index]?.key};
          this.accommodationListWithFBKeys = [...this.accommodationListWithFBKeys, accommodationWithFBKey];
        })
        console.log('To jest accommodationListWithFbKeys: ', this.accommodationListWithFBKeys)
        return this.accommodationListWithFBKeys;
      })
    )
  }

  supplyOtherAccommodationsWithFBKeys() {
    return zip([this.otherAccommodationsSnChngs$, this.otherAccommodationsValChngs$]).pipe(
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
        'id': p.id,
        'wspólnota': p.wspólnota,
        'obecność': p.obecność ?? '',
        'nazwisko': p.nazwisko,
        'przydział': p.przydział ?? '',
        'zakwaterowanie': p.zakwaterowanie ?? '',
        'samochód': p.samochód ?? '',
        'prezbiter': p.prezbiter ?? '',
        'małżeństwo': p.małżeństwo ?? '',
        'kobiety': p.kobiety ?? '',
        'mężczyźni': p.mężczyźni ?? '',
        'niemowlęta': p.niemowlęta ?? '',
        'dzieci': p.dzieci ?? '',
        'nianiaZRodziny': p.nianiaZRodziny ?? '',
        'nianiaObca': p.nianiaObca ?? '',
        'uwagi': p.uwagi ?? '',
        'wiek': p.wiek ?? '',
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
        'il tap 1-os': a['il tap 1-os'] ?? '',
        'można dostawić': a['można dostawić'],
        'wolne łóżka': a['wolne łóżka'],
        'przydział': a.przydział,
        'nazwiska': a.nazwiska,
        'pokój': a.pokój,
        'razem osób': a['razem osób'],
        'wspólnota': a.wspólnota,
      }).catch((error) => {
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
    // return this.supplyParticipantsWithFBKeys().pipe(
    //   tap((participantsWithKeys) => {
    //     let elemToUpdate = participantsWithKeys.find(p => (+p.elem['Id '] === +part.id || +p.elem.id === +part.id));
    //     // let elemToUpdate = this.participantListWithFBKeys.find(p => (+p.elem['Id '] === +part?.id || +p.elem?.id === +part?.id));
    //     this.participantRef = this.fireDb.object('Lista braci/' + elemToUpdate?.key);
    //     console.log('To jest part z metody updateParticipant ', part);
    //     this.participantRef.update({
    //       'wspólnota': part.wspólnota ?? '',
    //       'obecność': part.obecność ?? '',
    //       'nazwisko': part.nazwisko ?? '',
    //       'przydział': part.przydział ?? '',
    //       'zakwaterowanie': part.zakwaterowanie ?? '',
    //       'samochód': part.samochód ?? '',
    //       'prezbiter': part.prezbiter ?? null,
    //       'małżeństwo': part.małżeństwo ?? null,
    //       'kobiety': part.kobiety ?? null,
    //       'mężczyźni': part.mężczyźni ?? null,
    //       'niemowlęta': part.niemowlęta ?? null,
    //       'dzieci': part.dzieci ?? null,
    //       'nianiaZRodziny': part.nianiaZRodziny ?? null,
    //       'nianiaObca': part.nianiaObca ?? null,
    //       'uwagi': part.uwagi ?? '',
    //       'wiek': part.wiek ?? null,
    //     }).catch((error) => {
    //       this.errorMgmt(error);
    //     });
    //   }),
    // )
    return this.partSrv.getParticipantsWithFBKeys().pipe(
      tap((participantsWithKeys) => {
        console.log('updateParticipant zostało wywołane YYYY')
        // console.log('===================== To są participantsWithKeys: ', participantsWithKeys);
        this.partToUpdate = participantsWithKeys.filter(p => (+p.elem['Id '] === +part.id || +p.elem.id === +part.id))[0];
        // console.log('-----------------------To jest znaleziony partToUpdate: ', this.partToUpdate);
        if(this.partToUpdate) {
          this.participantRef = this.fireDb.object('Lista braci/' + this.partToUpdate.key);
          this.participantRef.update({
            // 'id': part.id,
            'wspólnota': part.wspólnota ?? '',
            'obecność': part.obecność ?? '',
            'nazwisko': part.nazwisko ?? '',
            'przydział': part.przydział ?? '',
            'zakwaterowanie': part.zakwaterowanie,
            'samochód': part.samochód ?? '',
            'prezbiter': part.prezbiter ?? null,
            'małżeństwo': part.małżeństwo ?? null,
            'kobiety': part.kobiety ?? null,
            'mężczyźni': part.mężczyźni ?? null,
            'niemowlęta': part.niemowlęta ?? null,
            'dzieci': part.dzieci ?? null,
            'nianiaZRodziny': part.nianiaZRodziny ?? null,
            'nianiaObca': part.nianiaObca ?? null,
            'uwagi': part.uwagi ?? '',
            'wiek': part.wiek ?? null,
            }).catch((error) => this.errorMgmt(error));
        }
      }),
    );
  }

  updateAccommodation(accom: IAccommodation) {
    return this.accomSrv.getAccommodationsWithFBKeys().pipe(
      tap((accommodationsWithKeys) => {
        let accomToUpdate = accommodationsWithKeys.filter(a => (+a.elem['Id '] === +accom.id || +a.elem.id === +accom.id))[0];
        if(accomToUpdate) {
          this.accommodationRef = this.fireDb.object('Kwatery u Buzunów/' + accomToUpdate.key);
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
        }
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
    // return this.supplyParticipantsWithFBKeys().pipe(
      // filter(fullList => !!fullList),
    return this.partSrv.getParticipantsWithFBKeys().pipe(
      tap((list) => {
        console.log('Lista braci zwracana z metody deleteParticipant z oberwabla getParticipantsWithFBKeys:  ', list)
        let elemToDelete = list.filter(p => (+p.elem['Id '] === +id || +p.elem.id === +id))[0];
        // console.log('Elem to delete: ', elemToDelete)
        this.participantRef = this.fireDb.object('Lista braci/' + elemToDelete?.key);
        // console.log('Participant Ref: ', this.participantRef)
        this.participantRef.remove().catch((error) => {
          this.errorMgmt(error);
        });
      })
    )
  }

  deleteAccommodation(id: string | number) {
    // return this.supplyAccommodationsWithFBKeys().pipe(
      // take(1),
    return this.accomSrv.getAccommodationsWithFBKeys().pipe(
      tap((list) => {
        console.log('Lista akomodacji zwracana z metody deleteAccommodation z oberwabla getAccommodationsWithFBKeys:  ', list)
        let elemToDelete = list.find(a => (+a.elem['id'] === +id));
        console.log('To jest element do usunięcia: ', elemToDelete);
        this.accommodationRef = this.fireDb.object('Kwatery u Buzunów/' + elemToDelete?.key);
        this.accommodationRef.remove().catch((error) => {
          this.errorMgmt(error);
        });
      })
    )
  }

  deleteOtherAccommodation(id: string | number) {
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
