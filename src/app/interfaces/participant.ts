export interface IParticipant {
  'wspólnota': string;
  'lp': string;
  'nazwisko': string;
  'przydział': string;
  'zakwaterowanie': string;
  'samochód': string;
  'prezbiter': number | null;
  'małżeństwo': number | null;
  'wiek': string | null;
}

export interface IExpandedParticipant {
  'zakwaterowanie': string | null;
  'samochód': string | null;
  'przydział': string | null;
}