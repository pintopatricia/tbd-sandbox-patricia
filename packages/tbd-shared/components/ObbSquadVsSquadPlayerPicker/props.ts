import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import {
  ObbClearSquadVsSquadModalErrorAction,
  ObbClosePlayerPickerModalAction,
  ObbEventSelectionAction,
  ObbSaveSquadVsSquadModalAction,
  ObbToggleSquadBetPlayerPickerSquadParticipantAction,
  ObbToggleSquadVsSquadModalParticipantAction,
} from "@ppb/tbd-store/actions/obb";
import { ObbIncidentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ObbParticipantsWithStats } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { Jersey, PlayerNames, SquadId } from "../../helpers/obb";
import { Player } from "../../hooks/useSortedObbPlayersList";
import { BettingObbToggleLegAction, ObbBetButtonClickAction } from "@ppb/tbd-store/actions/betting";

type I18nLabels = {
  alertLabel: string;
  oddsLabel: string;
  firstSquad: string;
  saveChangesLabel: string;
  secondSquad: string;
};

export type ContainerProps = {
  urn: URN;
  selectedSquadId: SquadId;
  onDismiss: () => void;
  handleSquadChange: (squadId: SquadId) => void;
};

export type ObbSquadVsSquadPlayerPickerProps = {
  urn: string;
  i18nLabels: I18nLabels;
  eventParticipants: ObbParticipantsWithStats;
  firstSquadJerseys: Jersey[];
  secondSquadJerseys: Jersey[];
  firstSquadModalParticipantsNames: PlayerNames[];
  secondSquadModalParticipantsNames: PlayerNames[];
  firstSquadStatValue: string;
  secondSquadStatValue: string;
  firstSquadOdds: string;
  secondSquadOdds: string;
  statsLabel: string;
  title: string;
  participantInfo: string;
  selectedSquadId: SquadId;
  errorCode: string | null;
  hasReachedFirstSquadLimit: boolean;
  hasReachedSecondSquadLimit: boolean;
  isSaveChangesDisabled: boolean;
  incidentTypeLabel: string;
  eventName: string;
  outcomeLabel: string;
  modalLegs: string[];
  isObbSquadVsSquadPlayerPickerConsistencyVariantActive: boolean;
  isPlayerSelectedInSelectedSquad: (player: Player) => boolean;
  isPlayerSelected: (player: Player) => boolean;
  isPlayerDisabled: (playerIncidentTypes: { [id: string]: ObbIncidentType }) => boolean;
  handleSquadChange: (squadId: SquadId) => void;
  onDismiss: () => void;
};

export type SquadVsSquadCardLeg = {
  id: string;
  quote:
    | {
        odds: string | null;
        quoteError?: string;
      }
    | undefined;
  outcome: string;
  status: SportsbookBetButtonStatus;
};

export type StateProps = ObbSquadVsSquadPlayerPickerProps | Record<string, never>;

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

export type DispatchActions =
  | ObbClearSquadVsSquadModalErrorAction
  | ObbToggleSquadVsSquadModalParticipantAction
  | ObbSaveSquadVsSquadModalAction
  | BettingObbToggleLegAction
  | ObbBetButtonClickAction
  | ObbToggleSquadBetPlayerPickerSquadParticipantAction
  | ObbEventSelectionAction
  | ObbClosePlayerPickerModalAction;

export type DispatchProps = {
  dispatchClearSquadBetModalError: (cardUrn: URN) => void;
  dispatchToggleObbSquadVsSquadModalParticipant: (cardUrn: URN, participantUrn: URN, selectedSquadId: SquadId) => void;
  dispatchSquadVsSquadSaveModalChanges: (cardUrn: URN) => void;
  dispatchAddLegToBetslip: (legId: string, urn: string, eventName?: string) => void;
  dispatchToggleObbSquadBetModalParticipantAnalytics: (
    cardUrn: string,
    eventName: string,
    incidentType: string,
    participantUrn: URN,
    playerName?: string | null,
    selectedSquadId?: "1" | "2",
  ) => void;
  dispatchTaggingInteractionClick: (element: string, urn?: string, eventName?: string, incidentType?: string) => void;
  dispatchPlayerPickerClose: (cardUrn: string, eventName: string, incidentType: string) => void;
};
