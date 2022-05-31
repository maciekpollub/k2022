export interface IFirstDataPiece {
  'Katechiści': string;
  'Lp. ': string;
  'Nazwisko i imię (małżeństwa razem, dzieci osobno)': string;
  'Przydział': string;
  'Zakwaterowanie': string;
  'Środek transportu (własny samochód lub brak)': string;
  'Prezbiterzy'?: number;
  'Małżeństwa (il. osób)'?: number;
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
