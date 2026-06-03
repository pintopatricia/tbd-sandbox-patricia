import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createObbSquadVsSquadCardWithModalFieldsByURNSelector } from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { ObbIncidentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import {
  OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
  OBB_CARD__EVENT_SELECTION,
  OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION,
  OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
  ObbClearSquadVsSquadModalErrorAction,
  ObbClosePlayerPickerModalAction,
  ObbEventSelectionAction,
  ObbSaveSquadVsSquadModalAction,
  ObbToggleSquadBetPlayerPickerSquadParticipantAction,
  ObbToggleSquadVsSquadModalParticipantAction,
  UI__CLOSE_PLAYER_PICKER_MODAL,
  UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
} from "@ppb/tbd-store/actions/obb";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import { AlertType } from "@ppb/the-wall-common/types";
import URN from "@ppb/tbd-store/state/layout/URN";

import { Player } from "../../hooks/useSortedObbPlayersList";
import { i18n } from "../../helpers/i18n";
import {
  buildPlayer,
  buildMicroPlayerVm,
  getContextualStatsText,
  formatQuote,
  getSquadAverageStatByIncidentType,
  getStatsByIncidentType,
  errorMap,
  getIncidentDataMapping,
  getStatsLabels,
} from "../../helpers/obb";
import { ContainerProps, DispatchActions, DispatchProps, StateProps } from "./props";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import {
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BettingObbToggleLegAction,
  ObbBetButtonClickAction,
  UI__OBB_BET_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/betting";

const MAX_SELECTED_PARTICIPANTS = 20;

const containSameStrings = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;

  const setB = new Set(b);
  return a.every((value) => setB.has(value));
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbSquadVsSquadCardByURN = createObbSquadVsSquadCardWithModalFieldsByURNSelector();
  const getObbLegById = createObbLegByIdSelector();
  const getExperiment = createGetExperimentSelector();
  const getSportsbookDisplayOddsPreferences = createSportsbookDisplayOddsPreferencesSelector();

  return (
    state: ApplicationState,
    { urn, selectedSquadId, onDismiss, handleSquadChange }: ContainerProps,
  ): StateProps => {
    const obbSquadVsSquadCard = getObbSquadVsSquadCardByURN(state, urn);

    if (!obbSquadVsSquadCard) {
      return {};
    }

    const i18nLabels = {
      oddsLabel: i18n({ key: "I18N.OBB.ODDS" }),
      alertLabel: i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_MIN_PLAYERS" }),
      saveChangesLabel: i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_PRIMARY_BUTTON.LABEL" }),
      firstSquad: `${i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.BET_BUTTON.LABEL" })} 1`,
      secondSquad: `${i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.BET_BUTTON.LABEL" })} 2`,
      defaultEntryPointLabel: i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_ENTRY_POINT" }),
      defaultParticipantInfoLabel: i18n({ key: "I18N.OBB.MODAL_PARTICIPANT_INFO" }),
    };

    const {
      firstSquadParticipants,
      firstSquadModalParticipants,
      secondSquadParticipants,
      secondSquadModalParticipants,
      eventParticipants,
      incidentType,
      participantInfo: prismicParticipantInfo,
      entryPointLabel: prismicEntryPointLabel,
      modalError: errorCode,
      modalIsLoadingQuotes,
      outcomesLabel,
    } = obbSquadVsSquadCard;

    const entryPointLabel = prismicEntryPointLabel || i18nLabels.defaultEntryPointLabel;
    const participantInfo = prismicParticipantInfo || i18nLabels.defaultParticipantInfoLabel;

    const incidentTypeLabel = getStatsLabels(incidentType) || "";
    const title = `${entryPointLabel} - ${incidentTypeLabel}`;

    const participantsWithStats = eventParticipants.map((participant) => ({
      ...participant,
      stats: getStatsByIncidentType([incidentType], participant.player?.seasonStats),
    }));

    const isPlayerSelectedInSelectedSquad = (participant: Player): boolean => {
      const squadParticipants = selectedSquadId === "1" ? firstSquadModalParticipants : secondSquadModalParticipants;
      return squadParticipants.some((squadParticipant) => {
        if (!squadParticipant?.player?.id || !participant?.player?.id) {
          return false;
        }

        return squadParticipant.player.id === participant.player.id;
      });
    };

    const isPlayerSelected = (participant: Player): boolean =>
      [...firstSquadModalParticipants, ...secondSquadModalParticipants].some((squadParticipant) => {
        if (!squadParticipant.player?.id || !participant.player?.id) {
          return false;
        }
        return squadParticipant.player.id === participant.player.id;
      });

    const isPlayerDisabled = (playerIncidentTypes: { [id: string]: ObbIncidentType }): boolean =>
      playerIncidentTypes ? !playerIncidentTypes[incidentType] : true;

    const firstSquadModalParticipantsPlayers = firstSquadModalParticipants.map((participant) =>
      buildPlayer(participant),
    );
    const secondSquadModalParticipantsPlayers = secondSquadModalParticipants.map((participant) =>
      buildPlayer(participant),
    );

    const firstSquadMicroPlayerVm = buildMicroPlayerVm(firstSquadModalParticipantsPlayers);
    const secondSquadMicroPlayerVm = buildMicroPlayerVm(secondSquadModalParticipantsPlayers);

    const firstSquadAverageStat = getSquadAverageStatByIncidentType(
      obbSquadVsSquadCard.firstSquadModalParticipants,
      obbSquadVsSquadCard.incidentType,
    );
    const secondSquadAverageStat = getSquadAverageStatByIncidentType(
      obbSquadVsSquadCard.secondSquadModalParticipants,
      obbSquadVsSquadCard.incidentType,
    );
    const statsLabel = getContextualStatsText(obbSquadVsSquadCard.statsLabel, obbSquadVsSquadCard.incidentType);

    const firstSquadStatValue = firstSquadAverageStat ?? "-";
    const secondSquadStatValue = secondSquadAverageStat ?? "-";

    const format = getSportsbookDisplayOddsPreferences(state.entities.preferences);

    const modalLegs = obbSquadVsSquadCard.modalLegs.map((legId) => getObbLegById(state, legId));

    const obbFirstSquadQuote = modalLegs?.[0] ? formatQuote(modalLegs?.[0].quote, format) : undefined;
    const obbSecondSquadQuote = modalLegs?.[1] ? formatQuote(modalLegs?.[1].quote, format) : undefined;

    const firstSquadCount = firstSquadModalParticipants.length;
    const secondSquadCount = secondSquadModalParticipants.length;
    const totalSelected = firstSquadCount + secondSquadCount;

    const hasReachedFirstSquadLimit =
      firstSquadCount >= MAX_SELECTED_PARTICIPANTS - 1 || totalSelected >= MAX_SELECTED_PARTICIPANTS;
    const hasReachedSecondSquadLimit =
      secondSquadCount >= MAX_SELECTED_PARTICIPANTS - 1 || totalSelected >= MAX_SELECTED_PARTICIPANTS;

    const hasFirstSquadChanges = !containSameStrings(
      firstSquadParticipants.map((participant) => participant.urn),
      firstSquadModalParticipants.map((participant) => participant.urn),
    );
    const hasSecondSquadChanges = !containSameStrings(
      secondSquadParticipants.map((participant) => participant.urn),
      secondSquadModalParticipants.map((participant) => participant.urn),
    );

    const blockingError = errorCode ? errorMap[errorCode].level === AlertType.Error : false;

    const oddsExist = !!obbFirstSquadQuote?.odds || !!obbSecondSquadQuote?.odds;

    const hasChanges = hasFirstSquadChanges || hasSecondSquadChanges;

    const isSaveChangesDisabled = !(oddsExist && hasChanges && !blockingError);

    const isObbSquadVsSquadPlayerPickerConsistencyVariantActive =
      getExperiment(state.entities.experiments, "sbg-cms-obb-squadvssquad-player-picker-consistency")?.variant ===
      "squad-vs-squad-player-picker-consistency-variant";

    const outcomeLabel =
      outcomesLabel ||
      i18n({
        key: "I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_OUTCOMES.LABEL",
        interpolationValues: {
          outcome: getIncidentDataMapping(obbSquadVsSquadCard.incidentType)?.text.toLowerCase() || "",
        },
      });

    return {
      urn,
      eventParticipants: participantsWithStats,
      firstSquadJerseys: firstSquadMicroPlayerVm.jerseys,
      secondSquadJerseys: secondSquadMicroPlayerVm.jerseys,
      firstSquadModalParticipantsNames: firstSquadMicroPlayerVm.players,
      secondSquadModalParticipantsNames: secondSquadMicroPlayerVm.players,
      firstSquadStatValue,
      secondSquadStatValue,
      statsLabel,
      title,
      participantInfo,
      i18nLabels,
      firstSquadOdds: obbFirstSquadQuote?.odds && !modalIsLoadingQuotes ? obbFirstSquadQuote.odds : "-",
      secondSquadOdds: obbSecondSquadQuote?.odds && !modalIsLoadingQuotes ? obbSecondSquadQuote.odds : "-",
      selectedSquadId,
      errorCode,
      hasReachedFirstSquadLimit,
      hasReachedSecondSquadLimit,
      isSaveChangesDisabled,
      incidentTypeLabel,
      eventName: obbSquadVsSquadCard.sportevent.name,
      outcomeLabel,
      modalLegs: obbSquadVsSquadCard.modalLegs,
      isObbSquadVsSquadPlayerPickerConsistencyVariantActive,
      isPlayerSelectedInSelectedSquad,
      isPlayerSelected,
      isPlayerDisabled,
      handleSquadChange,
      onDismiss,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchClearSquadBetModalError(cardUrn) {
    dispatch<ObbClearSquadVsSquadModalErrorAction>({
      type: OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
      payload: {
        cardUrn,
      },
    });
  },
  dispatchToggleObbSquadVsSquadModalParticipant(cardUrn, participantUrn, selectedSquadId) {
    dispatch<ObbToggleSquadVsSquadModalParticipantAction>({
      type: OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
      payload: {
        cardUrn,
        participantUrn,
        selectedSquadId,
      },
    });
  },
  dispatchSquadVsSquadSaveModalChanges(cardUrn) {
    dispatch<ObbSaveSquadVsSquadModalAction>({
      type: OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION,
      payload: {
        cardUrn,
      },
    });
  },
  dispatchAddLegToBetslip: (legId: string, cardUrn: string, eventName?: string) => {
    dispatch<BettingObbToggleLegAction>({
      type: BETTING__OBB_TOGGLE_LEG_ACTION,
      payload: { legId, cardUrn, eventName },
    });
    dispatch<ObbBetButtonClickAction>({
      type: UI__OBB_BET_BUTTON_CLICK,
    });
  },
  dispatchToggleObbSquadBetModalParticipantAnalytics: (
    cardUrn: string,
    eventName: string,
    incidentType: string,
    participantUrn: URN,
    playerName?: string | null,
    selectedSquadId?: "1" | "2",
  ) => {
    dispatch<ObbToggleSquadBetPlayerPickerSquadParticipantAction>({
      type: UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
      payload: {
        cardUrn,
        eventName,
        incidentType,
        participantUrn,
        playerName,
        selectedSquadId,
      },
    });
  },
  dispatchTaggingInteractionClick: (element: string, urn?: string, eventName?: string, incidentType?: string) => {
    dispatch<ObbEventSelectionAction>({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: element === "1" || element === "2" ? `edit squad ${element}` : element,
          module: {
            card: "player picker",
            group: incidentType,
          },
        },
        urn,
        eventName,
      },
    });
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
});
