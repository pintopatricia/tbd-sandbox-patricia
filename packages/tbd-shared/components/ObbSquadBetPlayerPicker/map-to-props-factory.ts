import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createObbSquadBetCardWithModalFieldsByURNSelector } from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { ObbIncidentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import {
  OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
  OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
  ObbClearSquadBetModalErrorAction,
  ObbToggleSquadBetModalParticipantAction,
  ObbToggleSquadBetPlayerPickerSquadParticipantAction,
  UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
  ObbClosePlayerPickerModalAction,
  UI__CLOSE_PLAYER_PICKER_MODAL,
  UI__SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK,
  ObbSquadBetPlayerPickerBetButtonClickAction,
  ObbEventSelectionAction,
  OBB_CARD__EVENT_SELECTION,
  UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT,
  ObbSquadBetPlayerPickerRemoveSquadParticipantAction,
} from "@ppb/tbd-store/actions/obb";
import { getObbBettingLegs } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { mapQuantifierEnumToSymbol } from "@ppb/tbd-store/helpers/obb-betting";
import { SelectorObbSquadBetLegTemplateParams } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { Quantifier } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";
import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { ObbPositionType } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import {
  BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
  BettingObbToggleMultipleLegAction,
  ObbBetButtonClickAction,
  UI__OBB_BET_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/betting";
import { Player } from "../../hooks/useSortedObbPlayersList";
import { i18n } from "../../helpers/i18n";
import {
  formatQuote,
  buildPlayer,
  getSquadAverageStatByIncidentType,
  getStatsByIncidentType,
  getStatsLabels,
} from "../../helpers/obb";
import { ContainerProps, DispatchActions, DispatchProps, StateProps } from "./props";

const MAX_SQUAD_PARTICIPANTS = 20;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbSquadBetCardByURN = createObbSquadBetCardWithModalFieldsByURNSelector();
  const getObbLegById = createObbLegByIdSelector();
  const getSportsbookDisplayOddsPreferences = createSportsbookDisplayOddsPreferencesSelector();

  return (state: ApplicationState, { urn, position, onDismiss }: ContainerProps): StateProps => {
    const obbSquadBetCard = getObbSquadBetCardByURN(state, urn);
    const format = getSportsbookDisplayOddsPreferences(state.entities.preferences);
    const animated = state.entities.brandSettings?.SPORTSBOOK_BET_BUTTON_ANIMATION ?? true;

    if (
      !obbSquadBetCard ||
      obbSquadBetCard.typename !== "ObbSquadBetCard" ||
      !obbSquadBetCard.eventParticipants ||
      !obbSquadBetCard.modalParticipants ||
      !obbSquadBetCard.incidentType ||
      !obbSquadBetCard.modalLegs
    ) {
      return {};
    }

    const i18nLabels = {
      alertLabel: i18n({ key: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS" }),
      addToBetslipLabel: i18n({ key: "I18N.BETSLIP.ADD_TO_BETSLIP" }),
      defaultEntryPointLabel: i18n({ key: "I18N.OBB.SQUADBET.MODAL_ENTRY_POINT" }),
      defaultParticipantInfoLabel: i18n({ key: "I18N.OBB.MODAL_PARTICIPANT_INFO" }),
    };

    const {
      modalParticipants,
      eventParticipants,
      incidentType,
      participantInfo: prismicParticipantInfo,
      entryPointLabel: prismicEntryPointLabel,
      modalError: errorCode,
    } = obbSquadBetCard;
    const obbBettingLegs = getObbBettingLegs(state);

    const modalLegs: StateProps["modalLegs"] = obbSquadBetCard.modalLegs.map((leg) => {
      const obbLeg = getObbLegById(state, leg);
      const { value, quantifier } = obbLeg?.templateParams as SelectorObbSquadBetLegTemplateParams;
      const isLegOnBetslip = !!(obbLeg?.id && obbBettingLegs[obbLeg.id]);

      return {
        id: obbLeg?.id ?? "",
        quote: obbLeg ? formatQuote(obbLeg.quote, format) : undefined,
        outcome: `${value}${mapQuantifierEnumToSymbol(quantifier as Quantifier.AT_LEAST)}`,
        status: (isLegOnBetslip ? "selected" : "default") as SportsbookBetButtonStatus,
      };
    });

    const entryPointLabel = prismicEntryPointLabel || i18nLabels.defaultEntryPointLabel;
    const participantInfo = prismicParticipantInfo || i18nLabels.defaultParticipantInfoLabel;

    const incidentTypeLabel = getStatsLabels(incidentType) || "";
    const title = `${entryPointLabel} - ${incidentTypeLabel}`;

    const participantsWithStats = eventParticipants.map((participant) => ({
      ...participant,
      stats: getStatsByIncidentType([incidentType], participant.player?.seasonStats),
    }));

    const isPlayerSelected = (participant: Player): boolean =>
      modalParticipants.some((squadParticipant) => {
        if (!squadParticipant?.player?.id || !participant?.player?.id) {
          return false;
        }

        return squadParticipant.player.id === participant.player.id;
      });

    const isPlayerDisabled = (playerIncidentTypes: { [id: string]: ObbIncidentType }): boolean =>
      playerIncidentTypes ? !playerIncidentTypes[incidentType] : true;

    const hasReachedSquadLimit = modalParticipants.length >= MAX_SQUAD_PARTICIPANTS;

    const averageSquadStatByIncidentType = getSquadAverageStatByIncidentType(modalParticipants, incidentType) || "-";
    const statsLabel = `${averageSquadStatByIncidentType} ${obbSquadBetCard.statsLabel}`;

    return {
      urn,
      eventName: obbSquadBetCard.sportevent.name,
      eventParticipants: participantsWithStats,
      modalParticipants: modalParticipants.map((participant) => buildPlayer(participant)),
      legsInBetslip: obbBettingLegs,
      title,
      participantInfo,
      statsLabel,
      outcomesLabel: obbSquadBetCard.outcomesLabel,
      modalDefaultOutcomeIndex: obbSquadBetCard.modalDefaultOutcomeIndex,
      modalLegs,
      i18nLabels,
      modalIsLoadingQuotes: obbSquadBetCard.modalIsLoadingQuotes,
      incidentType: obbSquadBetCard.incidentType,
      errorCode,
      hasReachedSquadLimit,
      isAnimatedBetButton: animated,
      position,
      isPlayerSelected,
      isPlayerDisabled,
      onDismiss,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchToggleObbSquadBetModalParticipant(cardUrn: URN, participantUrn: URN) {
    dispatch<ObbToggleSquadBetModalParticipantAction>({
      type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
      payload: {
        cardUrn,
        participantUrn,
      },
    });
  },
  dispatchClearSquadBetModalError(cardUrn: URN) {
    dispatch<ObbClearSquadBetModalErrorAction>({
      type: OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
      payload: {
        cardUrn,
      },
    });
  },
  dispatchToggleObbSquadBetModalParticipantAnalytics: (
    cardUrn: string,
    eventName: string,
    incidentType: string,
    participantUrn: URN,
    playerName?: string | null,
  ) => {
    dispatch<ObbToggleSquadBetPlayerPickerSquadParticipantAction>({
      type: UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
      payload: {
        cardUrn,
        eventName,
        incidentType,
        participantUrn,
        playerName,
      },
    });
  },
  dispatchTaggingInteractionClick: (
    element: "player" | "bet button",
    direction: "previous" | "next",
    urn?: string,
    eventName?: string,
  ) => {
    dispatch<ObbEventSelectionAction>({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: `${element} - ${direction}`,
          module: {
            card: "player picker",
          },
        },
        urn,
        eventName,
      },
    });
  },
  dispatchAddToBetslip(selectedLegIds: string[], urn: URN, eventName: string, position?: ObbPositionType) {
    if (selectedLegIds.length > 0) {
      dispatch<BettingObbToggleMultipleLegAction>({
        type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
        payload: {
          legIds: selectedLegIds,
          cardUrn: urn,
          eventName,
          position,
        },
      });
      dispatch<ObbBetButtonClickAction>({
        type: UI__OBB_BET_BUTTON_CLICK,
      });
    }
  },
  dispatchPlayerPickerClose: (cardUrn: string, eventName: string, incidentType: string) => {
    dispatch<ObbClosePlayerPickerModalAction>({
      type: UI__CLOSE_PLAYER_PICKER_MODAL,
      payload: {
        cardUrn,
        eventName,
        incidentType,
      },
    });
  },
  dispatchSquadBetBetButtonClickAnalytics: (
    eventName: string,
    incidentType: string,
    buttonStatus: string,
    buttonLabel: string,
  ) => {
    dispatch<ObbSquadBetPlayerPickerBetButtonClickAction>({
      type: UI__SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK,
      payload: {
        eventName,
        incidentType,
        buttonStatus,
        buttonLabel,
      },
    });
  },
  dispatchToggleObbSquadBetModalRemoveParticipantAnalytics: (eventName: string, urn: URN, incidentType: string) => {
    dispatch<ObbSquadBetPlayerPickerRemoveSquadParticipantAction>({
      type: UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT,
      payload: {
        eventName,
        cardUrn: urn,
        incidentType,
        moduleName: "player picker",
      },
    });
  },
});
