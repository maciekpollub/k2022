
export interface IAccommodation {
  'id': number | string;
  'il os zakwaterowana': number;
  'il tap 1-os': number;
  'można dostawić': number;
  'wolne łóżka': number;
  'przydział': number | string;
  'nazwiska': string | null;
  'pokój': string;
  'razem osób': number | null;
  'wspólnota': string | null;
}

export interface IFBAccommodation {
  key: string | null;
  elem: IAccommodation;
}
