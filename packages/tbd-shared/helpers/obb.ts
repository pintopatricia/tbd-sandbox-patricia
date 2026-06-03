import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { ExperimentVariant, OddsDisplayPreference, RichText } from "@ppb/tbd-store";
import { AlertType, Player } from "@ppb/the-wall-common/types";
import { Icons, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import {
  FootballPlayerSeasonStats,
  ObbFootballPlayer,
  ObbFormattedQuote,
  ObbLeg,
  ObbParticipant,
  ObbParticipantsWithStats,
  ObbPvpLegTemplateParams,
  ObbQuote,
  ObbQuoteError,
  ObbQuoteSuccess,
  SelectorObbLeg,
  SelectorObbLegTemplateParams,
  SelectorObbPvpLegTemplateParams,
  SelectorObbSquadBetLegTemplateParams,
  SelectorObbSquadVsSquadLegTemplateParams,
} from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { mapQuantifierEnumToSymbol } from "@ppb/tbd-store/helpers/obb-betting";

import { ObbSelectedParticipantStats } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import { hashObjectFnv1a } from "@ppb/tbd-store/helpers/hashing";

import { i18n } from "./i18n";
import {
  ObbXOfNLegParams,
  ObbLeg as ObbBettingLeg,
  Quantifier,
} from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";
import { areObjectsDeepEqual } from "@ppb/tbd-store/helpers/obj-deep-equal-comparator";
import { TranslationKey } from "../translations/keys";

export type SquadId = "1" | "2";

export type ParticipantQuotesMap = {
  [participantId: string]: string;
};

export type ObbMoreInfoDetailsProps = {
  moreInfoDetails: Array<RichText | null>;
  dispatchNavigateToTermsAndConditionsPage?: ((viewLink: ViewLink) => void) | undefined;
};

export type ObbMultipleDetails = { id: string; x: number };

export type PlayerWithJersey =
  | (Player & { urn: string; status: "loaded"; jersey: string | undefined })
  | { status: "loading" };

type ObbErrorMap = {
  [key: string]: {
    level: AlertType;
    hasDescription: boolean;
    dismissible: boolean;
  };
};

export type PlayerNames = { firstName?: string; lastName: string };
export type Jersey = string | undefined;

export const openEditSquadTaggingElement = {
  JERSEY: "jersey",
  PLUS_ICON: "plus icon",
};

export const errorCodes = {
  EVENT_SUSPENDED: "EVENT_SUSPENDED",
  BETTING_IN_PLAY_NOT_ALLOWED: "BETTING_IN_PLAY_NOT_ALLOWED",
  EVENT_NOT_FOUND: "EVENT_NOT_FOUND",
  OUTCOME_DEFINITION_SUSPENDED: "OUTCOME_DEFINITION_SUSPENDED",
  INVALID_BET_DEFINITION: "INVALID_BET_DEFINITION",
  GENERAL_FAILURE: "GENERAL_FAILURE",
  IMPOSSIBLE_OBB_CHOICE: "IMPOSSIBLE_OBB_CHOICE",
  OUTCOME_DEFINITION_NOT_FOUND: "OUTCOME_DEFINITION_NOT_FOUND",
} as const;

export const errorMap: ObbErrorMap = {
  EVENT_SUSPENDED: { level: AlertType.Error, hasDescription: false, dismissible: false },
  BETTING_IN_PLAY_NOT_ALLOWED: { level: AlertType.Error, hasDescription: true, dismissible: false },
  EVENT_NOT_FOUND: { level: AlertType.Error, hasDescription: false, dismissible: false },
  OUTCOME_DEFINITION_SUSPENDED: { level: AlertType.Error, hasDescription: false, dismissible: false },
  INVALID_BET_DEFINITION: { level: AlertType.Error, hasDescription: true, dismissible: false },
  GENERAL_FAILURE: { level: AlertType.Error, hasDescription: true, dismissible: false },
  IMPOSSIBLE_OBB_CHOICE: { level: AlertType.Error, hasDescription: true, dismissible: false },
  OUTCOME_DEFINITION_NOT_FOUND: { level: AlertType.Error, hasDescription: true, dismissible: false },
  PLAYER_REMOVED_FROM_LINEUP: { level: AlertType.Info, hasDescription: true, dismissible: true },
  SQUAD_BET_MAX_PARTICIPANTS_LIMIT_REACHED: { level: AlertType.Info, hasDescription: false, dismissible: false },
} as const;

export const splitName = (name: string): { firstName: string | undefined; lastName: string } => {
  if (!name) {
    return { firstName: "", lastName: "" };
  }

  const nameParts = name.trim().split(/\s+/);

  if (nameParts.length <= 1) {
    return { firstName: nameParts[0], lastName: "" };
  }

  const firstName = nameParts.shift();
  const lastName = nameParts.join(" ");

  return { firstName, lastName };
};

export const buildPlayer = (participant: ObbParticipant | undefined): PlayerWithJersey => {
  if (!participant) {
    return { status: "loading" };
  }

  const { firstName, lastName } = splitName(participant.player?.name || "") ?? { firstName: "", lastName: "" };

  return {
    urn: participant.urn,
    firstName: firstName ?? "",
    lastName,
    status: "loaded",
    jersey: participant.team?.jerseys?.[0]?.url || undefined,
  };
};

const incidentDataMapping: Record<string, { text: { key: keyof TranslationKey }; icon: Icons }> = {
  GOALS: { text: { key: "I18N.OBB.OUTCOME.INCIDENT.GOALS" }, icon: IconsList.GOALS },
  GOALS_TIME_ADJUSTED: { text: { key: "I18N.OBB.OUTCOME.INCIDENT.GOALS" }, icon: IconsList.GOALS },
  SHOTS: { text: { key: "I18N.OBB.OUTCOME.INCIDENT.SHOTS" }, icon: IconsList.PENALTY_SCORED },
  SHOTS_TIME_ADJUSTED: { text: { key: "I18N.OBB.OUTCOME.INCIDENT.SHOTS" }, icon: IconsList.PENALTY_SCORED },
  SHOTS_ON_TARGET: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.SHOTS_ON_TARGET" },
    icon: IconsList.PENALTY_SCORED,
  },
  SHOTS_ON_TARGET_TIME_ADJUSTED: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.SHOTS_ON_TARGET" },
    icon: IconsList.PENALTY_SCORED,
  },
  FOULS_COMMITTED_TIME_ADJUSTED: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.FOULS_COMMITTED" },
    icon: IconsList.FOULS,
  },
  FOULS_WON_TIME_ADJUSTED: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.FOULS_WON" },
    icon: IconsList.FOULS,
  },
  PASSES_TIME_ADJUSTED: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.PASSES" },
    icon: IconsList.ASSISTS,
  },
  ASSISTS_TIME_ADJUSTED: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.ASSISTS" },
    icon: IconsList.ASSISTS,
  },
  FOULS_COMMITTED: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.FOULS_COMMITTED" },
    icon: IconsList.FOULS,
  },
  FOULS_WON: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.FOULS_WON" },
    icon: IconsList.FOULS,
  },
  PASSES: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.PASSES" },
    icon: IconsList.ASSISTS,
  },
  ASSISTS: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.ASSISTS" },
    icon: IconsList.ASSISTS,
  },
  BOOKED: { text: { key: "I18N.OBB.OUTCOME.INCIDENT.BOOKED" }, icon: IconsList.CARDS },
  FOUL_INVOLVEMENTS: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.FOUL_INVOLVEMENTS" },
    icon: IconsList.FOULS,
  },
  FOUL_INVOLVEMENTS_TIME_ADJUSTED: {
    text: { key: "I18N.OBB.OUTCOME.INCIDENT.FOUL_INVOLVEMENTS" },
    icon: IconsList.FOULS,
  },
};

export const getIncidentDataMapping = (incident: string): { text: string; icon: Icons } | null => {
  if (incident in incidentDataMapping) {
    return {
      text: i18n(incidentDataMapping[incident].text),
      icon: incidentDataMapping[incident].icon,
    };
  }

  return null;
};

const statsLabels: Record<string, { key: keyof TranslationKey }> = {
  GOALS: { key: "I18N.OBB.STATS.GOALS" },
  GOALS_TIME_ADJUSTED: { key: "I18N.OBB.STATS.GOALS" },
  SHOTS: { key: "I18N.OBB.STATS.SHOTS" },
  SHOTS_TIME_ADJUSTED: { key: "I18N.OBB.STATS.SHOTS" },
  SHOTS_ON_TARGET: { key: "I18N.OBB.STATS.SHOTS_ON_TARGET" },
  SHOTS_ON_TARGET_TIME_ADJUSTED: { key: "I18N.OBB.STATS.SHOTS_ON_TARGET" },
  FOULS_COMMITTED_TIME_ADJUSTED: { key: "I18N.OBB.STATS.FOULS_COMMITTED" },
  FOULS_WON_TIME_ADJUSTED: { key: "I18N.OBB.STATS.FOULS_WON" },
  PASSES_TIME_ADJUSTED: { key: "I18N.OBB.STATS.PASSES" },
  ASSISTS_TIME_ADJUSTED: { key: "I18N.OBB.STATS.ASSISTS" },
  FOULS_COMMITTED: { key: "I18N.OBB.STATS.FOULS_COMMITTED" },
  FOULS_WON: { key: "I18N.OBB.STATS.FOULS_WON" },
  PASSES: { key: "I18N.OBB.STATS.PASSES" },
  ASSISTS: { key: "I18N.OBB.STATS.ASSISTS" },
  FOUL_INVOLVEMENTS: { key: "I18N.OBB.STATS.FOUL_INVOLVEMENTS" },
  FOUL_INVOLVEMENTS_TIME_ADJUSTED: { key: "I18N.OBB.STATS.FOUL_INVOLVEMENTS" },
};

export const getStatsLabels = (stat: string): string | null => {
  if (stat in statsLabels) {
    return i18n(statsLabels[stat]);
  }

  return null;
};

export const getStatsByIncidentType = (
  incidentTypes: string[],
  stats?: FootballPlayerSeasonStats | null,
): ObbSelectedParticipantStats => {
  if (!stats || stats.matchesPlayed === 0) {
    return incidentTypes.map((incidentType) => ({
      id: incidentType,
      label: getStatsLabels(incidentType) || "",
      value: null,
    }));
  }

  const { totalShots, shotsOnTarget, goals, fouls, foulsWon, assists, passes, foulInvolvements } = stats.averages;

  const statToOutcomeMapping: Partial<Record<string, number | null>> = {
    SHOTS: totalShots,
    SHOTS_TIME_ADJUSTED: totalShots,
    SHOTS_ON_TARGET: shotsOnTarget,
    SHOTS_ON_TARGET_TIME_ADJUSTED: shotsOnTarget,
    GOALS: goals,
    GOALS_TIME_ADJUSTED: goals,
    FOULS_COMMITTED: fouls,
    FOULS_COMMITTED_TIME_ADJUSTED: fouls,
    FOULS_WON: foulsWon,
    FOULS_WON_TIME_ADJUSTED: foulsWon,
    PASSES: passes,
    PASSES_TIME_ADJUSTED: passes,
    ASSISTS: assists,
    ASSISTS_TIME_ADJUSTED: assists,
    FOUL_INVOLVEMENTS: foulInvolvements,
    FOUL_INVOLVEMENTS_TIME_ADJUSTED: foulInvolvements,
  };

  return incidentTypes.map((incidentType) => {
    const statByOutcome = statToOutcomeMapping[incidentType];
    return {
      id: incidentType,
      label: getStatsLabels(incidentType) || "",
      value: statByOutcome != null && statByOutcome !== undefined ? statByOutcome : null,
    };
  });
};

export function formatQuote(
  quote?: ObbQuote,
  oddsFormat: OddsDisplayPreference = OddsDisplayPreference.Decimal,
): ObbFormattedQuote {
  if (!quote) {
    return { odds: null };
  }

  if (quote?.typename === "ObbQuoteError") {
    return { odds: null, quoteError: (quote as ObbQuoteError).errorCode };
  }

  const { price } = quote as ObbQuoteSuccess;

  return { odds: formatOdds(price, oddsFormat) };
}

export const buildUnquotedLegsForPvP = (
  selectedParticipants: ObbParticipant[],
  selectedLeg: SelectorObbLeg,
  participants: ObbParticipantsWithStats,
  index: number,
): ObbLeg[] => {
  const defaultUnquotedParticipantsLeg = selectedParticipants.map((selectedParticipant) => ({
    id: selectedParticipant.player?.id ?? "",
    urn: selectedParticipant.urn,
    type: selectedParticipant.typename,
  }));

  return participants.flatMap((participant) => {
    const { player, typename, urn } = participant;
    const { templateParams: currentTemplateParams, event, templateId } = selectedLeg;

    const unquotedParticipants = [...defaultUnquotedParticipantsLeg];

    unquotedParticipants[index] = { id: player?.id ?? "", urn, type: typename };

    if (!currentTemplateParams) {
      return [];
    }
    const templateParamsAvB = <ObbPvpLegTemplateParams>{
      ...currentTemplateParams,
      participantIdA: unquotedParticipants[0].urn,
      participantIdB: unquotedParticipants[1].urn,
    };

    const templateParamsBvA = <ObbPvpLegTemplateParams>{
      ...currentTemplateParams,
      participantIdA: unquotedParticipants[1].urn,
      participantIdB: unquotedParticipants[0].urn,
    };

    const templateParamsList = [templateParamsAvB, templateParamsBvA];

    return templateParamsList.reduce<ObbLeg[]>((acc, templateParams) => {
      const unquotedLeg = {
        id: hashObjectFnv1a({
          event,
          templateId,
          templateParams,
        }),
        templateId,
        event,
        templateParams,
      };

      acc.push({
        ...unquotedLeg,
      });

      return acc;
    }, []);
  });
};

export function isObbQuoteError(quote: ObbQuoteSuccess | ObbQuoteError): quote is ObbQuoteError {
  return quote && "errorCode" in quote && typeof quote.errorCode === "string";
}

export function isToRemoveObbStatsLabel(experiment: ExperimentVariant | undefined): boolean {
  switch (experiment?.variant) {
    case "exp-variant-without-stats-label":
      return true;
    default:
      // return the default
      return false;
  }
}

export function isCardDisabled(quoteError: string | undefined) {
  return quoteError === errorCodes.EVENT_NOT_FOUND || quoteError === errorCodes.BETTING_IN_PLAY_NOT_ALLOWED;
}

export const groupMoreInfoDetails = (moreInfoDetails: Array<RichText | null>): Array<Array<RichText>> =>
  moreInfoDetails.reduce(
    (acc, moreInfoDetail) => {
      if (!moreInfoDetail) return acc;
      if (moreInfoDetail.type.includes("heading") || moreInfoDetail.type === "url_link") {
        acc.push([moreInfoDetail]);
        return acc;
      }

      const lastElementOfTheArray = acc.slice(-1)[0];

      if (!lastElementOfTheArray) {
        acc.push([moreInfoDetail]);
        return acc;
      }

      lastElementOfTheArray.push(moreInfoDetail);
      acc[acc.length - 1] = lastElementOfTheArray;
      return acc;
    },
    [] as Array<Array<RichText>>,
  );

export const formatName = (fullName?: string | null): string => {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;

  const [first, ...rest] = parts;
  return `${first[0]}. ${rest.join(" ")}`;
};

export const getSquadAverageStatByIncidentType = (
  squad: Array<ObbFootballPlayer>,
  incidentType: string,
): string | null => {
  // Filter out participants without valid seasonStats or with zero matches played
  const participantsWithValidStats = squad.filter(
    (participant: ObbFootballPlayer) =>
      participant.player?.seasonStats && participant.player.seasonStats.matchesPlayed > 0,
  );

  if (participantsWithValidStats.length === 0) {
    return null;
  }

  // Calculate the sum of the relevant stat values
  const total = participantsWithValidStats.reduce((avg: number, squadPlayer: ObbFootballPlayer) => {
    const stat = getStatsByIncidentType([incidentType], squadPlayer.player?.seasonStats)[0].value || 0;
    return avg + stat;
  }, 0);

  return total.toFixed(1);
};

export const getMicroPlayerBorderRadius = (
  index: number,
  totalParticipants: number,
): "middle" | "first" | "last" | undefined => {
  if (totalParticipants === 1) {
    return "middle";
  }

  if (index === 0) {
    return "first";
  }

  if (index === totalParticipants - 1) {
    return "last";
  }

  return undefined;
};

export const getSquadBetParticipantName = (participant: Player) => {
  if (participant.status === "loaded") {
    return {
      firstName: participant.lastName ? participant.firstName : undefined,
      lastName: participant.lastName || participant.firstName,
    };
  }
  return { firstName: undefined, lastName: undefined };
};

export const formatPlayerStat = (stat: number | null): string => (stat ?? 0).toFixed(1);

export const buildMicroPlayerVm = (participants: PlayerWithJersey[]): { jerseys: Jersey[]; players: PlayerNames[] } =>
  participants.reduce<{ jerseys: Array<Jersey>; players: Array<PlayerNames> }>(
    (acc, player) => {
      if (player.status !== "loaded") {
        return acc;
      }

      acc.jerseys.push(player.jersey);
      acc.players.push({ firstName: player.firstName, lastName: player.lastName || "" });

      return acc;
    },
    { jerseys: [], players: [] },
  );

export const getContextualStatsText = (cardStatsLabel: string | undefined, incidentType: string): string =>
  cardStatsLabel ||
  i18n({
    key: "I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_STATS.LABEL",
    interpolationValues: {
      outcome: getStatsLabels(incidentType)?.toLowerCase() || "",
    },
  });

export const isCombinedPotentialBet = (potentialBetLegs: ObbBettingLeg[]): boolean => {
  return potentialBetLegs.some((leg) => "baseBets" in leg.params);
};

export const hasSameBaseBets = (potentialBetLegs: ObbBettingLeg[], multipleLegs: ObbBettingLeg[]): boolean => {
  return Object.values(potentialBetLegs).some((leg) =>
    Object.values(multipleLegs).some((multipleLeg) =>
      areObjectsDeepEqual(
        { baseBets: (leg.params as ObbXOfNLegParams).baseBets },
        { baseBets: (multipleLeg.params as ObbXOfNLegParams).baseBets },
      ),
    ),
  );
};

function formatParticipants(participants: ObbFootballPlayer[]) {
  return participants
    .map((participant) => participant.player.name)
    .filter(Boolean)
    .join(", ")
    .replace(/, ([^,]*)$/, " & $1");
}

const buildSquadVsSquadLegDescription = (leg: SelectorObbLeg) => {
  if (!leg.templateParams || leg.templateId !== "squadVsSquad") {
    return null;
  }

  const templateParams = <SelectorObbSquadVsSquadLegTemplateParams>leg.templateParams;
  const { squadAParticipantIds, squadBParticipantIds, quantifier, outcomeIds } = templateParams;

  const squadAParticipantsDescription = formatParticipants(squadAParticipantIds);

  const squadBParticipantsDescription = formatParticipants(squadBParticipantIds);

  const isGreater = quantifier === Quantifier.GREATER_THAN;
  const selectedSquadDescription = isGreater ? squadAParticipantsDescription : squadBParticipantsDescription;
  const opposingSquadDescription = isGreater ? squadBParticipantsDescription : squadAParticipantsDescription;

  const outcome = outcomeIds[0] ?? "";

  const outcomeDescription = i18n({
    key: "I18N.OBB.SQUADVSSQUAD.BET.DESCRIPTION",
    interpolationValues: {
      incidentType: outcome,
      operator: Quantifier.GREATER_THAN,
      playersName: opposingSquadDescription,
      count: 2,
    },
  });

  return {
    legDescription: `${selectedSquadDescription} ${outcomeDescription}`,
    participantsDescription: selectedSquadDescription,
    outcomeDescription,
  };
};

export function buildParticipantsCombinedLegDescription(leg: SelectorObbLeg) {
  if (!leg.templateParams || leg.templateId !== "participantsCombined") {
    return null;
  }

  const templateParams = <SelectorObbSquadBetLegTemplateParams>leg.templateParams;

  const { participantIds, outcomeIds, quantifier, value } = templateParams;
  const outcomeDescription = i18n({
    key: "I18N.OBB.SQUADBET.BET.DESCRIPTION",
    interpolationValues: {
      incidentType: outcomeIds[0],
      stat: `${value}${mapQuantifierEnumToSymbol(quantifier as Quantifier.AT_LEAST)}`,
      count: 2,
    },
  });

  const participantsDescription = formatParticipants(participantIds);

  return {
    legDescription: `${participantsDescription} ${outcomeDescription}`,
    participantsDescription,
    outcomeDescription,
  };
}

function buildPvpLegDescription(leg: SelectorObbLeg) {
  if (!leg.templateParams || leg.templateId !== "playerVsPlayer") {
    return null;
  }

  const templateParams = <SelectorObbPvpLegTemplateParams>leg.templateParams;

  const { outcomeId, participantIdA, participantIdB } = templateParams;

  const outcomeDescription = i18n({
    key: "I18N.OBB.PVP.BET.DESCRIPTION",
    interpolationValues: {
      incidentType: outcomeId,
      operator: "MORE",
      playerName: participantIdB.player.name || "",
      count: 2,
    },
  });

  const participantsDescription = participantIdA.player.name || "";

  return {
    legDescription: `${participantsDescription} ${outcomeDescription}`,
    participantsDescription,
    outcomeDescription,
  };
}

export function buildObbLegDescription(leg: SelectorObbLeg) {
  switch (leg.templateId) {
    case "participantsCombined": {
      return buildParticipantsCombinedLegDescription(leg);
    }
    case "squadVsSquad": {
      return buildSquadVsSquadLegDescription(leg);
    }
    case "playerVsPlayer": {
      return buildPvpLegDescription(leg);
    }
    default: {
      return null;
    }
  }
}

function buildParticipantsCombinedAvgStatsDescription(leg: SelectorObbLeg, participants: ObbFootballPlayer[]) {
  const { templateParams } = leg;
  const { outcomeIds } = templateParams as SelectorObbSquadBetLegTemplateParams;
  const incidentType = outcomeIds[0];

  const averageSquadStat = getSquadAverageStatByIncidentType(participants, incidentType);

  return averageSquadStat && !!getIncidentDataMapping(incidentType)?.text
    ? `${averageSquadStat} ${i18n({
        key: "I18N.OBB.SQUADBET.STATS.LABEL_ABBREV",
        interpolationValues: { outcome: getIncidentDataMapping(incidentType)?.text.toLowerCase() || "" },
      })}`
    : null;
}

function buildPvpAvgStatsDescription(leg: SelectorObbLeg) {
  const { templateParams } = leg;
  const { participantIdA, participantIdB, outcomeId } = templateParams as SelectorObbPvpLegTemplateParams;

  const playersWithStats = [participantIdA, participantIdB].reduce<string[]>((acc, participant) => {
    if (participant.player.name) {
      const stat = (getStatsByIncidentType([outcomeId], participant.player.seasonStats)[0].value || 0).toFixed(1);

      const name = formatName(participant.player.name);

      acc.push(`${name}: ${stat}`);
    }

    return acc;
  }, []);

  return getIncidentDataMapping(outcomeId)?.text
    ? i18n({
        key: "I18N.OBB.PVP.STATS.LABEL_ABBREV",
        interpolationValues: {
          outcome: getIncidentDataMapping(outcomeId)?.text.toLowerCase() || "",
          playersStats: playersWithStats.join(" | "),
        },
      })
    : null;
}

export function buildObbAvgStatsDescription(leg: SelectorObbLeg, participants: ObbFootballPlayer[]) {
  switch (leg.templateId) {
    case "participantsCombined": {
      return buildParticipantsCombinedAvgStatsDescription(leg, participants);
    }
    case "squadVsSquad": {
      return null;
    }
    case "playerVsPlayer": {
      return buildPvpAvgStatsDescription(leg);
    }
    default: {
      return null;
    }
  }
}

export const buildObbBetButtonSecondaryLabel = (
  templateId: string,
  templateParams: SelectorObbLegTemplateParams,
  showSquadBetExtendedLabelExperiment?: boolean,
): string | undefined => {
  switch (templateId) {
    case "participantsCombined": {
      const { quantifier, value } = templateParams as SelectorObbSquadBetLegTemplateParams;

      if (showSquadBetExtendedLabelExperiment) {
        return i18n({
          key: "I18N.OBB.SQUADBET.BET_BUTTON.EXTENDED_LABEL",
          interpolationValues: { value },
        });
      }

      return `${value}${mapQuantifierEnumToSymbol(quantifier as Quantifier.AT_LEAST)}`;
    }
    case "playerVsPlayer": {
      const { participantIdA } = templateParams as SelectorObbPvpLegTemplateParams;

      return formatName(participantIdA.player?.name);
    }
    case "squadVsSquad": {
      const params = templateParams as SelectorObbSquadVsSquadLegTemplateParams;
      const squadNumber = params.quantifier === Quantifier.GREATER_THAN ? 1 : 2;

      return `${i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.BET_BUTTON.LABEL" })} ${squadNumber}`;
    }
    default:
      return undefined;
  }
};
