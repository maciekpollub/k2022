export interface IParticipant {
  'id': number | string;
  'wspólnota': string;
  'obecność': string;
  'nazwisko': string;
  'przydział': string;
  'zakwaterowanie': string;
  'samochód': string;
  'prezbiter': number | null;
  'małżeństwo': number | null;
  'kobiety': number | null;
  'mężczyźni': number | null;
  'niemowlęta': number | null;
  'dzieci': number | null;
  'nianiaZRodziny': number |  null;
  'nianiaObca': number | null;
  'uwagi': string | null;
  'wiek': string | null;
}

export interface IExpandedParticipant {
  'zakwaterowanie': string | null;
  'samochód': string | null;
  'przydział': string | null;
}

export interface IFBParticipant {
  key: string | null;
  elem: IParticipant;
}
