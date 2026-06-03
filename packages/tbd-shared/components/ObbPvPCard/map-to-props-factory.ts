import { Dispatch } from "redux";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  createObbCardByURNSelector,
  createObbCardPositionSelector,
} from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { BettingObbToggleLegAction, ObbBetButtonClickAction } from "@ppb/tbd-store/actions/betting";
import {
  OBB_CARD__CLEAN_CARD_LEGS_STATE,
  OBB_CARD__EVENT_SELECTION,
  OBB_CARD__UPDATE_SELECTED_LEGS_STATE,
  OBB_LEG_QUOTES_UPDATE_STATE,
  ObbCleanCardLegsAction,
  ObbEventSelectionAction,
  ObbLegQuotesUpdateStateAction,
  ObbSelectedLegsUpdateStateAction,
} from "@ppb/tbd-store/actions/obb";

import {
  ObbOutcomeDescription,
  ObbFootballTeams,
  ObbPositionType,
} from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import {
  ObbLeg,
  ObbParticipant,
  ObbParticipantsWithStats,
  SelectorObbLeg,
} from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import { ExperimentVariant } from "@ppb/tbd-store";
import { CategoryIcons, SystemIconName } from "@ppb/the-wall-icons";
import {
  ParticipantQuotesMap,
  formatQuote,
  getIncidentDataMapping,
  getStatsByIncidentType,
  isCardDisabled,
  isObbQuoteError,
  isToRemoveObbStatsLabel,
} from "../../helpers/obb";
import { StatsGroupProps } from "./snowflakes/StatsGroup/StatsGroup.types";
import { i18n } from "../../helpers/i18n";

export type BetButton = {
  quote: string;
  legId: string;
  formattedPlayerName: string;
  status: SportsbookBetButtonStatus;
};

export type ContainerProps = {
  urn: URN;
  layoutUrn?: string;
  cardGroupUrn?: string;
  itemIndex?: number;
};

export type ObbPvPCardProps = {
  urn: URN;
  title: string;
  firstLeg: SelectorObbLeg;
  secondLeg: SelectorObbLeg;
  participants?: ObbParticipantsWithStats;
  firstParticipant?: ObbParticipant;
  secondParticipant?: ObbParticipant;
  outcomeDescription?: ObbOutcomeDescription;
  incidentText?: string;
  quoteError?: string;
  participantInfo: string;
  eventName: string;
  betButtons: string[];
  disabledState: boolean;
  teams: ObbFootballTeams;
  statsGroupProps: StatsGroupProps;
  position?: ObbPositionType;
  getParticipantQuotes: (
    playerParticipantIndex: number,
    firstParticipantId: string,
    secondParticipantId: string,
  ) => ParticipantQuotesMap;
  updateSelectedLegs: (newPlayerId: string, otherSelectedPlayerId: string) => string[];
  playerSelectionIconVariant?: CategoryIcons;
  removeObbStatsLabel: boolean;
};

export type StateProps = ObbPvPCardProps | Record<string, never>;

function getPlayerSelectionIconVariant(experiment: ExperimentVariant | undefined): CategoryIcons | undefined {
  switch (experiment?.variant) {
    case "exp-variant-chevron-down":
      return SystemIconName.CHEVRON_DOWN;

    case "exp-variant-edit":
      return SystemIconName.EDIT;
    default:
      // return the default
      return undefined;
  }
}

const getParticipantJerseyColor = (participantUrn: string, participants: ObbParticipant[]) => {
  const participant = participants.find((participant) => participant.urn === participantUrn);
  if (!participant) {
    return null;
  }

  return participant.team.color;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbPvPCardByURN = createObbCardByURNSelector();
  const getObbLegById = createObbLegByIdSelector();
  const getSportsbookDisplayOddsPreferences = createSportsbookDisplayOddsPreferencesSelector();
  const getObbCardPositionByLayout = createObbCardPositionSelector();
  const getExperiment = createGetExperimentSelector();

  return (state: ApplicationState, { urn, layoutUrn, cardGroupUrn, itemIndex }: ContainerProps): StateProps => {
    const card = getObbPvPCardByURN(state, urn);
    if (!card || card.typename !== "ObbPvpCard") {
      return {};
    }

    // Default Legs
    const firstLeg = getObbLegById(state, card.selectedLegs[0]);
    const secondLeg = getObbLegById(state, card.selectedLegs[1]);
    // type guard to narrow into pvp leg
    if (!(firstLeg && firstLeg.templateParams && "participantIdA" in firstLeg.templateParams)) {
      return {};
    }
    if (!(secondLeg && secondLeg.templateParams && "participantIdA" in secondLeg.templateParams)) {
      return {};
    }

    // Participants and Stats
    const firstParticipantSeasonStats = firstLeg.templateParams.participantIdA.player?.seasonStats;
    const firstSelectedParticipantStats = getStatsByIncidentType([card.incidentType], firstParticipantSeasonStats);
    const firstSelectedParticipantWithStats = {
      ...firstLeg.templateParams.participantIdA,
      stats: firstSelectedParticipantStats,
    };

    const secondParticipantSeasonStats = secondLeg.templateParams.participantIdA.player?.seasonStats;
    const secondSelectedParticipantStats = getStatsByIncidentType([card.incidentType], secondParticipantSeasonStats);
    const secondSelectedParticipantWithStats = {
      ...secondLeg.templateParams.participantIdA,
      stats: secondSelectedParticipantStats,
    };

    const participantsWithOutcomeStats = card.participants.map((participant) => {
      const stats = getStatsByIncidentType([card.incidentType], participant.player?.seasonStats);
      return { ...participant, stats };
    });

    // Quotes and Errors
    const firstLegError = firstLeg.quote && isObbQuoteError(firstLeg.quote) ? firstLeg.quote.errorCode : undefined;
    const secondLegError = secondLeg.quote && isObbQuoteError(secondLeg.quote) ? secondLeg.quote.errorCode : undefined;
    const quoteError = firstLegError || secondLegError;

    const updateSelectedLegs = (newPlayerId: string, otherSelectedPlayerId: string) =>
      card.legs.reduce<string[]>((acc, legId) => {
        const obbLeg = getObbLegById(state, legId);
        if (!(obbLeg && obbLeg.templateParams && "participantIdA" in obbLeg.templateParams)) {
          return acc;
        }

        const firstParticipantId = obbLeg.templateParams.participantIdA.player?.id;
        const secondParticipantId = obbLeg.templateParams.participantIdB.player?.id;

        const areDifferentPlayersSelected =
          (firstParticipantId === newPlayerId || secondParticipantId === newPlayerId) &&
          (firstParticipantId === otherSelectedPlayerId || secondParticipantId === otherSelectedPlayerId) &&
          newPlayerId !== otherSelectedPlayerId;

        if (areDifferentPlayersSelected) {
          acc.push(obbLeg.id);
        }
        return acc;
      }, []);

    const getParticipantQuotes = (
      participantIndex: number,
      firstParticipantId: string,
      secondParticipantId: string,
    ): ParticipantQuotesMap =>
      card.legs.reduce<ParticipantQuotesMap>((acc, legId) => {
        const obbLeg = getObbLegById(state, legId);
        if (!(obbLeg && obbLeg.templateParams && "participantIdA" in obbLeg.templateParams)) {
          return acc;
        }
        if (!obbLeg.templateParams.participantIdA.player?.id || !obbLeg.templateParams.participantIdB.player?.id) {
          return acc;
        }

        const price = formatQuote(obbLeg.quote, getSportsbookDisplayOddsPreferences(state.entities.preferences));
        if (!price.odds) {
          return acc;
        }

        if (
          (participantIndex === 0 && obbLeg.templateParams.participantIdB.player.id === secondParticipantId) ||
          (participantIndex === 1 && obbLeg.templateParams.participantIdB.player.id === firstParticipantId)
        ) {
          acc[obbLeg.templateParams.participantIdA.player.id] = price.odds;
        }

        return acc;
      }, {});

    // Stats Group
    const disabledState = isCardDisabled(quoteError);
    const firstPlayerMatchesPlayed = firstLeg.templateParams.participantIdA.player?.seasonStats?.matchesPlayed || 0;
    const secondPlayerMatchesPlayed = secondLeg.templateParams.participantIdA.player?.seasonStats?.matchesPlayed || 0;
    const statsGroupProps: StatsGroupProps = {
      label: getIncidentDataMapping(card.incidentType)?.text || "",
      secondaryLabel: i18n({ key: "I18N.OBB.STATS.PER_GAME" }),
      left: {
        color: getParticipantJerseyColor(firstLeg.templateParams.participantIdA.urn, card.participants),
        value: firstPlayerMatchesPlayed > 0 ? firstSelectedParticipantStats[0].value : null,
      },
      right: {
        color: getParticipantJerseyColor(secondLeg.templateParams.participantIdA.urn, card.participants),
        value: secondPlayerMatchesPlayed > 0 ? secondSelectedParticipantStats[0].value : null,
      },
      maxValue:
        participantsWithOutcomeStats.length > 0
          ? Math.max(...participantsWithOutcomeStats.map((p) => p.stats[0]?.value ?? 0))
          : 0,
      disabled: disabledState,
    };

    const bfObpRemoveStatsLabelExperiment = getExperiment(
      state.entities.experiments,
      "exp-bf-sport-obp-remove-stats-label",
    );
    const sbgObpRemoveStatsLabelExperiment = getExperiment(
      state.entities.experiments,
      "exp-sbg-sport-obp-remove-stats-label",
    );
    const removeObbStatsLabel = isToRemoveObbStatsLabel(
      bfObpRemoveStatsLabelExperiment || sbgObpRemoveStatsLabelExperiment,
    );

    return {
      urn,
      title: card.title,
      firstLeg,
      secondLeg,
      participants: participantsWithOutcomeStats,
      firstParticipant: firstSelectedParticipantWithStats,
      secondParticipant: secondSelectedParticipantWithStats,
      quoteError,
      participantInfo: card.participantInfo?.name ?? i18n({ key: "I18N.OBB.MODAL_PARTICIPANT_INFO" }),
      eventName: card.sportevent.name,
      betButtons: [firstLeg.id, secondLeg.id],
      disabledState,
      teams: card.teams,
      statsGroupProps,
      position:
        (layoutUrn && itemIndex && getObbCardPositionByLayout(state, layoutUrn, itemIndex, cardGroupUrn)) || undefined,
      getParticipantQuotes,
      updateSelectedLegs,
      playerSelectionIconVariant: getPlayerSelectionIconVariant(
        getExperiment(state.entities.experiments, "exp-bf-sport-obb-playerselector-icon"),
      ),
      removeObbStatsLabel,
    };
  };
};

export type DispatchActions =
  | BettingObbToggleLegAction
  | ObbLegQuotesUpdateStateAction
  | ObbSelectedLegsUpdateStateAction
  | ObbCleanCardLegsAction
  | ObbBetButtonClickAction
  | ObbEventSelectionAction;

export type DispatchProps = {
  dispatchUpdateLegs: (urn: URN, unquotedLegs: ObbLeg[]) => void;
  dispatchSetSelectedLegs: (urn: URN, selectedLegsId: string[]) => void;
  dispatchCleanCardLegs: (urn: URN) => void;
  dispatchObbEventSelection: (event: { module: string; elementText: string }, urn?: string, eventName?: string) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchUpdateLegs: (urn: URN, unquotedLegs: ObbLeg[]) => {
    dispatch<ObbLegQuotesUpdateStateAction>({
      type: OBB_LEG_QUOTES_UPDATE_STATE,
      payload: {
        urn,
        unquotedLegs,
      },
    });
  },
  dispatchSetSelectedLegs: (urn: string, selectedLegsId: string[]) => {
    dispatch<ObbSelectedLegsUpdateStateAction>({
      type: OBB_CARD__UPDATE_SELECTED_LEGS_STATE,
      payload: {
        urn,
        selectedLegsId,
      },
    });
  },
  dispatchCleanCardLegs: (urn: string) => {
    dispatch<ObbCleanCardLegsAction>({
      type: OBB_CARD__CLEAN_CARD_LEGS_STATE,
      payload: {
        urn,
      },
    });
  },
  dispatchObbEventSelection: (event: { module: string; elementText: string }, urn?: string, eventName?: string) => {
    dispatch<ObbEventSelectionAction>({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: event.elementText,
          module: {
            card: event.module,
          },
        },
        urn,
        eventName,
      },
    });
  },
});
