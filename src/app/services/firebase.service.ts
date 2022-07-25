import { Injectable } from '@angular/core';
import { IParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  participantsRef: AngularFireList<any>;
  participantRef: AngularFireObject<any>;

  accommodationsRef: AngularFireList<any>;
  accommodationRef: AngularFireObject<any>;

  otherAccommodationsRef: AngularFireList<any>;
  otherAccommodationRef: AngularFireObject<any>;

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

  updateParticipant(id: string, participant: IParticipant) {
    this.participantRef
      .update({
        // book_name: book.book_name,
        // isbn_10: book.isbn_10,
        // author_name: book.author_name,
        // publication_date: book.publication_date,
        // binding_type: book.binding_type,
        // in_stock: book.in_stock,
        // languages: book.languages,
      })
      .catch((error) => {
        this.errorMgmt(error);
      });
  }

  deleteParticipant(id: string) {
    this.participantRef = this.fireDb.object('Lista braci/' + id);
    this.participantRef.remove().catch((error) => {
      this.errorMgmt(error);
    });
  }

  private errorMgmt(error: any) {
    console.log(error);
  }
}
