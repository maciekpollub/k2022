export interface IFirstDataPiece {
  'Katechiści': string;
  'Obecność': string;
  'Nazwisko i imię (małżeństwa razem, dzieci osobno)': string;
  'Przydział': string;
  'Zakwaterowanie': string;
  'Środek transportu (własny samochód lub brak)': string;
  'Prezbiterzy'?: number;
  'Małżeństwa (il. osób)'?: number;
  'Kobiety (1)'?: number;
  'Mężczyźni (1)'?: number;
  'Niemowlęta i dzieci (bez dodatkowego łóżka i posiłku)'?: number;
  'Dzieci większe (z łóżkiem i posiłkiem)'?: number;
  'Niania z rodziny - mieszkanie z rodziną'?: number;
  'Niania obca lub z rodziny - mieszkanie osobne'?: number;
  'Uwagi, niepełnosprawność, diety'?: string;
  'Wiek jedynek, nianiek np. 40+'?: string;
}

export interface ISecondDataPiece {
  'ilość os. zakwaterowana': number;
  'ilość tapczanów 1-os.': number;
  'można dostawić': number;
  'wolne łóżka': number;
  'przydział': number;
  'nazwiska zakwaterowanych'?: string;
  'kondygnacja – nr pokoju/il. pokoi'?: string;
  'razem il. osób'?: number;
  'wspólnota'?: string;
}

export interface IThirdDataPiece {
  'łóżko pojedyncze': number;
  'ilość tapczanów 2-os.': number;
  'łóżko duże': number;
  'przydział': number;
  'ilość os. zakwaterowana': number;
  'wolne łóżka': number;
  'kondygnacja - nr pokoju/il. pokoi'?: string;
  'max il. osób w pokoju'?: number;
  'nazwiska zakwaterowanych'?: string;
  'wspólnota'?: string;
}
