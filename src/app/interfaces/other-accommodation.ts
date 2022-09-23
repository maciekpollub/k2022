
export interface IOtherAccommodation {
  'id': number | string;
  'pokój': string;
  'łóżko pojed': number;
  'il tap 2-os': number | string;
  'łóżko duże': number;
  'max il osób': number | null;
  'przydział': number;
  'nazwiska': string | null;
  'il os zakwaterowana': number;
  'wolne łóżka': number;
  'wspólnota': string | null;
}

export interface IFBOtherAccommodation {
  key: string | null;
  elem: IOtherAccommodation;
}
