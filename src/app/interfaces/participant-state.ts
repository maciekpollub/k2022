import { IParticipant } from './participant';
export interface IParticipantsState {
  participants: IParticipant[];
  activeParticipant: IParticipant | undefined;
  relievedActiveParticipantRoom: string;
  saveParticipantButtonRecentlyClicked: boolean;
}
