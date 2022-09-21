import { IParticipant, IFBParticipant } from './participant';
export interface IParticipantsState {
  participants: IParticipant[];
  participantsWithFBKeys: any[];
  activeParticipant: IParticipant | undefined;
  relievedActiveParticipantRoom: string;
  saveParticipantButtonRecentlyClicked: boolean;
}
