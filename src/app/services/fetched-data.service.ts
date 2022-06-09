import { Injectable } from '@angular/core';
import { IFirstDataPiece, ISecondDataPiece, IThirdDataPiece } from '../interfaces/data-piece';
import { IParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';
import { IOtherAccommodation } from '../interfaces/other-accommodation';

@Injectable({
  providedIn: 'root'
})
export class FetchedDataService {

  constructor() { }

  filterFetchedParticipants(list: any[]): IFirstDataPiece[] {
    let filteredList: IFirstDataPiece[];
    filteredList = list.filter((el: any) => el['Katechiści'] && el['Przydział'] && !el['Obecność']);
    return filteredList;
  }

  mapParticipantList(list: IFirstDataPiece[]): IParticipant[] {
    let mappedList: IParticipant[];
    mappedList = list.map((el: IFirstDataPiece) => {
      return {
        'wspólnota': el.Katechiści,
        'lp': el['Lp. '],
        'nazwisko': el['Nazwisko i imię (małżeństwa razem, dzieci osobno)'],
        'przydział': el.Przydział,
        'zakwaterowanie': el.Zakwaterowanie,
        'samochód': el['Środek transportu (własny samochód lub brak)'],
        'prezbiter': el.Prezbiterzy ?? null,
        'małżeństwo': el['Małżeństwa (il. osób)'] ?? null,
        'wiek': el['Wiek jedynek, nianiek np. 40+'] ?? null
      }
    })
    return mappedList;
  }

  mapAccommodationList(list: ISecondDataPiece[]): IAccommodation[] {
    let mappedList: IAccommodation[];
    mappedList = list.map((el: ISecondDataPiece) => {
      return {
        'il. os. zakwaterowana': el['ilość os. zakwaterowana'],
        'il. tap. 1-os.': el['ilość tapczanów 1-os.'],
        'można dostawić': el['można dostawić'],
        'wolne łóżka': el['wolne łóżka'],
        'przydział': el.przydział,
        'nazwiska': el['nazwiska zakwaterowanych'] ?? null,
        'pokój': el['kondygnacja – nr pokoju/il. pokoi'] ?? null,
        'razem osób': el['razem il. osób'] ?? null,
        'wspólnota': el.wspólnota ?? null
      }
    })
    return mappedList;
  }

  mapOtherAccommodationList(list: IThirdDataPiece[]): IOtherAccommodation[] {
    let mappedList: IOtherAccommodation[];
    mappedList = list.map((el: IThirdDataPiece) => {
      return {
        'łóżko pojed.': el['łóżko pojedyncze'],
        'il. tap. 2-os.': el['ilość tapczanów 2-os.'],
        'łóżko duże': el['łóżko duże'],
        'przydział': el.przydział,
        'il. os. zakwaterowana': el['ilość os. zakwaterowana'],
        'wolne łóżka': el['wolne łóżka'],
        'nazwiska': el['nazwiska zakwaterowanych'] ?? null,
        'pokój': el['kondygnacja - nr pokoju/il. pokoi'] ?? null,
        'max il. osób': el['max il. osób w pokoju'] ?? null,
        'wspólnota': el.wspólnota ?? null
      }
    })
    return mappedList;
  }
}
