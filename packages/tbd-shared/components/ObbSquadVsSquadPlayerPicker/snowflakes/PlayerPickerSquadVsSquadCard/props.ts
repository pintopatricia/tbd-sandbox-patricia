import { Jersey, PlayerNames } from "../../../../helpers/obb";

export type PlayerPickerSquadVsSquadCardProps = {
  cardUrn: string;
  eventName: string;
  firstSquadJerseys: Jersey[];
  secondSquadJerseys: Jersey[];
  firstSquadParticipantsNames: PlayerNames[];
  secondSquadParticipantsNames: PlayerNames[];
  firstSquadStatValue: string;
  secondSquadStatValue: string;
  contextualStatsText: string;
  saveChangesLabel: string;
  firstSquadOdds: string;
  secondSquadOdds: string;
  firstSquadLabel: string;
  secondSquadLabel: string;
  alertLabel: string;
  oddsLabel: string;
  isSaveChangesDisabled: boolean;
  modalLegs: string[];
  outcomeLabel: string | undefined;
  isExperimentActive: boolean;
  onSaveChanges: () => void;
  onBetButtonClick: (legId: string, cardUrn: string, eventName?: string) => void;
};
