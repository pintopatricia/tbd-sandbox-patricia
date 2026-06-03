import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import {
  ObbClearSquadBetModalErrorAction,
  ObbClosePlayerPickerModalAction,
  ObbEventSelectionAction,
  ObbResetSquadBetModalStateAction,
  ObbSquadBetPlayerPickerBetButtonClickAction,
  ObbSquadBetPlayerPickerRemoveSquadParticipantAction,
  ObbToggleSquadBetModalParticipantAction,
  ObbToggleSquadBetPlayerPickerSquadParticipantAction,
} from "@ppb/tbd-store/actions/obb";
import { ObbIncidentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ObbFormattedQuote, ObbParticipantsWithStats } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { ObbLegMap } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ObbPositionType } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import { BettingObbToggleMultipleLegAction, ObbBetButtonClickAction } from "@ppb/tbd-store/actions/betting";
import { PlayerWithJersey } from "../../helpers/obb";
import { Player } from "../../hooks/useSortedObbPlayersList";

type I18nLabels = {
  alertLabel: string;
  addToBetslipLabel: string;
  defaultEntryPointLabel: string;
  defaultParticipantInfoLabel: string;
};

export type ContainerProps = {
  urn: URN;
  position?: ObbPositionType;
  onDismiss: () => void;
};

export type ObbSquadBetPlayerPickerProps = {
  urn: URN;
  eventName: string;
  i18nLabels: I18nLabels;
  errorCode: string | null;
  eventParticipants: ObbParticipantsWithStats;
  modalParticipants: PlayerWithJersey[];
  title: string;
  participantInfo: string;
  statsLabel: string;
  outcomesLabel?: string;
  modalDefaultOutcomeIndex: number;
  incidentType: string;
  legsInBetslip: ObbLegMap;
  modalLegs: Array<SquadBetCardLeg>;
  modalIsLoadingQuotes: boolean;
  hasReachedSquadLimit: boolean;
  isAnimatedBetButton: boolean;
  position?: ObbPositionType;
  isPlayerSelected: (player: Player) => boolean;
  isPlayerDisabled: (playerIncidentTypes: { [id: string]: ObbIncidentType }) => boolean;
  onDismiss: () => void;
};

export type SquadBetCardLeg = {
  id: string;
  quote?: ObbFormattedQuote;
  outcome: string;
  status: SportsbookBetButtonStatus;
};

export type StateProps = ObbSquadBetPlayerPickerProps | Record<string, never>;

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

export type DispatchActions =
  | ObbResetSquadBetModalStateAction
  | ObbToggleSquadBetModalParticipantAction
  | ObbToggleSquadBetPlayerPickerSquadParticipantAction
  | ObbClosePlayerPickerModalAction
  | ObbClearSquadBetModalErrorAction
  | BettingObbToggleMultipleLegAction
  | ObbBetButtonClickAction
  | ObbSquadBetPlayerPickerBetButtonClickAction
  | ObbSquadBetPlayerPickerRemoveSquadParticipantAction
  | ObbEventSelectionAction;

export type DispatchProps = {
  dispatchToggleObbSquadBetModalParticipant: (cardUrn: URN, participantUrn: URN) => void;
  dispatchToggleObbSquadBetModalParticipantAnalytics: (
    cardUrn: string,
    eventName: string,
    incidentType: string,
    participantUrn: URN,
    playerName?: string | null,
  ) => void;
  dispatchAddToBetslip: (selectedLegIds: string[], urn: URN, eventName: string, position?: ObbPositionType) => void;
  dispatchClearSquadBetModalError: (cardUrn: URN) => void;
  dispatchPlayerPickerClose: (cardUrn: string, eventName: string, incidentType: string) => void;
  dispatchSquadBetBetButtonClickAnalytics: (
    eventName: string,
    incidentType: string,
    buttonStatus: string,
    buttonLabel: string,
  ) => void;
  dispatchTaggingInteractionClick: (
    element: "player" | "bet button",
    direction: "previous" | "next",
    urn?: string,
    eventName?: string,
  ) => void;
  dispatchToggleObbSquadBetModalRemoveParticipantAnalytics: (eventName: string, urn: URN, incidentType: string) => void;
};
