import { Injectable } from '@angular/core';
import { IFirstDataPiece, ISecondDataPiece, IThirdDataPiece } from '../interfaces/data-piece';
import { IParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';
import * as XLSX from 'xlsx';
import { ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class FetchedDataService {

  constructor() { }

  // update_sheet_range(ws: any) {
  //   var range = {s:{r:20000000, c:20000000},e:{r:0,c:0}};
  //   Object.keys(ws).filter(function(x) { return x.charAt(0) != "!"; }).map(XLSX.utils.decode_cell).forEach(function(x) {
  //     range.s.c = Math.min(range.s.c, x.c); range.s.r = Math.min(range.s.r, x.r);
  //     range.e.c = Math.max(range.e.c, x.c); range.e.r = Math.max(range.e.r, x.r);
  //   });
  //   ws['!ref'] = XLSX.utils.encode_range(range);
  // }

  filterFetchedParticipants(list: any[]): IFirstDataPiece[] {
    let filteredList: IFirstDataPiece[];
    filteredList = list.filter((el: any) => el['Katechiści'] && el['Przydział'] && !el['Obecność']);
    return filteredList;
  }

  mapParticipantList(list: (IFirstDataPiece | IParticipant)[]): IParticipant[] {
    let mappedList: IParticipant[];
    mappedList = list.map((el: any) => {
      if (el.hasOwnProperty('id')) {
        return {...el};
      } else {
        return {
          'id': el['Id '],
          'wspólnota': el['Wspólnota'],
          'obecność': el['Obecność'],
          'nazwisko': el['Nazwisko i imię (małżeństwa razem, dzieci osobno)'],
          'przydział': el['Przydział'],
          'zakwaterowanie': el['Zakwaterowanie'] || el['zakwaterowanie'],
          'samochód': el['Środek transportu (własny samochód lub brak)'],
          'prezbiter': el['Prezbiterzy'] ?? '',
          'małżeństwo': el['Małżeństwa (il osób)'] ?? '',
          'kobiety': el['Kobiety (1)'] ?? '',
          'mężczyźni': el['Mężczyźni (1)'] ?? '',
          'niemowlęta': el['Niemowlęta i dzieci (bez dodatkowego łóżka i posiłku)'] ?? '',
          'dzieci': el['Dzieci większe (z łóżkiem i posiłkiem)'] ?? '',
          'nianiaZRodziny': el['Niania z rodziny - mieszkanie z rodziną'] ?? '',
          'nianiaObca': el['Niania obca lub z rodziny - mieszkanie osobne'] ?? '',
          'uwagi': el['Uwagi, niepełnosprawność, diety'] ?? '',
          'wiek': el['Wiek jedynek, nianiek np 40+'] ?? ''
        }
      }
    })
    console.log('Teraz mamy zmapowaną liste uczestników z fetchedDataServce: ', mappedList);
    return mappedList;
  }

  mapAccommodationList(list: (ISecondDataPiece | IAccommodation)[]): IAccommodation[] {
    let mappedList: IAccommodation[];
    let tempRoom = '';
    mappedList = list.map((el: any) => {
      if (el.hasOwnProperty('nazwiska')) {
        return el;
      } else {
        if (el['kondygnacja – nr pokoju lub il pokoi']) {tempRoom = el['kondygnacja – nr pokoju lub il pokoi']};
        return {
          'id': el.id,
          'il os zakwaterowana': el['ilość os zakwaterowana'],
          'il tap 1-os': el['ilość tapczanów 1-os'],
          'można dostawić': el['można dostawić'],
          'wolne łóżka': el['wolne łóżka'],
          'przydział': el.przydział,
          'nazwiska': el['nazwiska zakwaterowanych'] ?? '',
          'pokój': tempRoom,
          'razem osób': el['razem il osób'] ?? '',
          'wspólnota': el.wspólnota ?? ''
        }
      }
    })
    return mappedList;
  }

  mapOtherAccommodationList(list: (IThirdDataPiece | IOtherAccommodation)[]): IOtherAccommodation[] {
    let mappedList: IOtherAccommodation[];
    let tempRoom = '';
    mappedList = list.map((el: any) => {
      if (el.hasOwnProperty('nazwiska')) {
        return el;
      } else {
        if (el['kondygnacja - nr pokoju lub il pokoi']) {tempRoom = el['kondygnacja - nr pokoju lub il pokoi']};
        return {
          'id': el.id,
          'łóżko pojed': el['łóżko pojedyncze'],
          'il tap 2-os': el['ilość tapczanów 2-os'],
          'łóżko duże': el['łóżko duże'],
          'przydział': el.przydział,
          'il os zakwaterowana': el['ilość os zakwaterowana'],
          'wolne łóżka': el['wolne łóżka'],
          'nazwiska': el['nazwiska zakwaterowanych'] ?? '',
          'pokój': tempRoom,
          'max il osób': el['max il osób w pokoju'] ?? '',
          'wspólnota': el.wspólnota ?? ''
        }
      }
    })
    return mappedList;
  }
}
