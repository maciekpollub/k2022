import { Injectable } from '@angular/core';
import { IFirstDataPiece, ISecondDataPiece } from '../interfaces/data-piece';
import { IParticipant } from '../interfaces/participant';
import { IAccommodation } from '../interfaces/accommodation';

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
}
