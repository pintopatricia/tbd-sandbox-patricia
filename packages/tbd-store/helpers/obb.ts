import { ObbQuotesQuery, ToQuote } from "../clients/catalogue/catalogue-response-types";
import { NormalizedObbCreatedBetsCard } from "../services/catalogue/normalizer/cards/obb-created-bets-card/ObbCreatedBetsCard.types";
import { NormalizedObbEventPopularsCard } from "../services/catalogue/normalizer/cards/obb-event-populars-card/ObbEventPopularsCard.types";
import { NormalizedObbPvpCard } from "../services/catalogue/normalizer/cards/obb-pvp-card/ObbPvpCard.types";
import { NormalizedObbSquadBetCard } from "../services/catalogue/normalizer/cards/obb-squad-bet-card/ObbSquadBetCard.types";
import { NormalizedObbSquadVsSquadCard } from "../services/catalogue/normalizer/cards/obb-squad-vs-squad-card/ObbSquadVsSquadCard.types";
import {
  ObbFootballPlayer,
  ObbLeg,
  ObbLegTemplateId,
  ObbParticipant,
  ObbPvpLegTemplateParams,
  ObbSquadVsSquadTemplateParams,
  ObbQuote,
  ObbSportEvent,
} from "../state/entities/obb-legs/ObbLegs.types";
import { ObbParticipants } from "../state/entities/obb-participants/ObbParticipants.types";
import { hashObjectFnv1a } from "./hashing";

export function mapUnquotedLegsByEvent(unquotedLegs: ObbLeg[]): Record<string, ObbLeg[]> {
  return unquotedLegs.reduce<Record<string, ObbLeg[]>>((acc, leg) => {
    const { eventId } = leg.event;

    if (!acc[eventId]) {
      acc[eventId] = [];
    }

    acc[eventId].push(leg);

    return acc;
  }, {});
}

export function buildCardQuoteInputPvpLeg(legsToQuote: Array<ObbLeg>, stateParticipants: ObbParticipants): ToQuote[] {
  return legsToQuote.reduce<ToQuote[]>((acc, leg) => {
    const { templateId, id } = leg;
    const templateParams = leg.templateParams as ObbPvpLegTemplateParams;

    const { participantIdA, participantIdB } = templateParams;

    const stateFirstParticipantId = stateParticipants[participantIdA]?.player?.id;
    const stateSecondParticipantId = stateParticipants[participantIdB]?.player?.id;

    if (!stateFirstParticipantId || !stateSecondParticipantId) {
      return acc;
    }

    const legExpressionParams = {
      ...templateParams,
      participantIdA: stateFirstParticipantId,
      participantIdB: stateSecondParticipantId,
    };

    const toQuote = {
      id,
      expressionTemplateId: templateId,
      expressionParams: legExpressionParams,
    } as ToQuote;

    acc.push(toQuote);
    return acc;
  }, []);
}

export function buildCardQuoteInputSquadVsSquadLegs(
  legsToQuote: ObbLeg[],
  stateParticipants: ObbFootballPlayer[],
): ToQuote[] {
  const participantIdMap = stateParticipants.reduce<Map<string, string>>((map, p) => {
    const playerId = p.player?.id;
    if (playerId) map.set(p.urn, playerId);
    return map;
  }, new Map());

  return legsToQuote.map<ToQuote>((leg) => {
    const { id, templateId, templateParams } = leg;
    const params = templateParams as ObbSquadVsSquadTemplateParams;

    const mapParticipantIds = (participantIds: string[]): string[] =>
      participantIds
        .map((participantId) => participantIdMap.get(participantId))
        .filter((participantId): participantId is string => !!participantId);

    const legExpressionParams = {
      ...params,
      squadAParticipantIds: mapParticipantIds(params.squadAParticipantIds),
      squadBParticipantIds: mapParticipantIds(params.squadBParticipantIds),
      baseBets: null,
      outcomeId: null,
      participantIdA: null,
      participantIdB: null,
      participantIds: null,
      value: null,
      x: null,
    };

    return {
      id,
      expressionTemplateId: templateId,
      expressionParams: legExpressionParams,
      baseExpressionTemplateDefinitions: null,
    };
  });
}

export function buildValuesRange(participants: ObbParticipant[], incidentType: string) {
  const incidentTypeRange = participants.reduce(
    (acc, participant) => {
      if (!participant) {
        return acc;
      }

      const { incidentTypes } = participant;

      const currentIncidentType = incidentTypes[incidentType];

      if (currentIncidentType && "min" in currentIncidentType.resultType) {
        const { min, max } = currentIncidentType.resultType;

        acc.min += min;
        acc.max += max;
      }

      return acc;
    },
    { min: 0, max: 0 },
  );

  if (incidentTypeRange.min <= 0) {
    incidentTypeRange.min = 1;
  }

  if (incidentTypeRange.max < incidentTypeRange.min) {
    incidentTypeRange.max = incidentTypeRange.min;
  }

  return incidentTypeRange;
}

export function buildUnquotedLegsForSquadVsSquad(
  firstSquadParticipants: ObbFootballPlayer[],
  secondSquadParticipants: ObbFootballPlayer[],
  incidentType: string,
  quantifier: string,
  timePeriodId: string,
  templateId: ObbLegTemplateId,
  event: ObbSportEvent,
): ObbLeg {
  const normalizedTemplateParams = {
    squadAParticipantIds: firstSquadParticipants.map((participant) => participant.urn),
    squadBParticipantIds: secondSquadParticipants.map((participant) => participant.urn),
    outcomeIds: [incidentType],
    timePeriodId,
    quantifier,
  };

  const legId = hashObjectFnv1a({
    event,
    templateId,
    templateParams: normalizedTemplateParams,
  });

  return {
    id: legId,
    templateId,
    event,
    templateParams: normalizedTemplateParams,
  };
}

export const buildObbQuote = (quote: NonNullable<ObbQuotesQuery["obb"]>["quotes"]["prices"][number]): ObbQuote =>
  quote.result.resultCode === "SUCCESS" && quote.price
    ? {
        typename: "ObbQuoteSuccess",
        price: {
          decimal: quote.price.decimal,
          fractional: quote.price.fractional,
        },
      }
    : {
        typename: "ObbQuoteError",
        errorCode: quote.result.resultCode,
        errorDetails: quote.result.errorDetails,
      };

export enum ERROR_CODES {
  EVENT_NOT_FOUND = "EVENT_NOT_FOUND",
  BETTING_IN_PLAY_NOT_ALLOWED = "BETTING_IN_PLAY_NOT_ALLOWED",
  EVENT_SUSPENDED = "EVENT_SUSPENDED",
  OUTCOME_DEFINITION_NOT_FOUND = "OUTCOME_DEFINITION_NOT_FOUND",
  IMPOSSIBLE_OBB_CHOICE = "IMPOSSIBLE_OBB_CHOICE",
  OUTCOME_DEFINITION_SUSPENDED = "OUTCOME_DEFINITION_SUSPENDED",
  INVALID_BET_DEFINITION = "INVALID_BET_DEFINITION",
  GENERAL_FAILURE = "GENERAL_FAILURE",
  PLAYER_REMOVED_FROM_LINEUP = "PLAYER_REMOVED_FROM_LINEUP",
}

export const errorPriorityMap: { [key in keyof typeof ERROR_CODES]: number } = {
  EVENT_NOT_FOUND: 1,
  BETTING_IN_PLAY_NOT_ALLOWED: 2,
  EVENT_SUSPENDED: 3,
  OUTCOME_DEFINITION_NOT_FOUND: 4,
  IMPOSSIBLE_OBB_CHOICE: 5,
  OUTCOME_DEFINITION_SUSPENDED: 6,
  INVALID_BET_DEFINITION: 7,
  GENERAL_FAILURE: 8,
  PLAYER_REMOVED_FROM_LINEUP: 9,
};

export const getHighestPriorityError = (errorList: string[], currentError?: string | null): string => {
  if (currentError && !errorList.includes(currentError)) {
    errorList.push(currentError);
  }

  const sortedErrors = errorList
    .filter((error) => error in ERROR_CODES)
    .map((error) => ({ error, priority: errorPriorityMap[error as keyof typeof ERROR_CODES] }))
    .sort((a, b) => a.priority - b.priority);

  return sortedErrors[0]?.error ?? "";
};

export function buildMessageTitle(templateLegId?: ObbLegTemplateId) {
  switch (templateLegId) {
    case "playerVsPlayer": {
      return { key: "I18N.OBB.PVP.DISABLED.TITLE" };
    }
    case "squadVsSquad": {
      return { key: "I18N.OBB.SQUADVSSQUAD.DISABLED.TITLE" };
    }
    case "participantsCombined": {
      return { key: "I18N.OBB.SQUADBET.DISABLED.TITLE" };
    }
    default: {
      return { key: "I18N.OBB.GENERIC.DISABLED.TITLE" };
    }
  }
}

/**
 * Removes __typename from a GraphQL object
 * @param obj - The object to process
 * @returns A new object without the __typename property
 */
export function omitTypename<T extends Record<string, unknown>>(
  obj: T & { __typename?: string },
): Omit<T, "__typename"> {
  const { __typename, ...rest } = obj;
  return rest as Omit<T, "__typename">;
}

export function joinPlayerNames(participants: Array<string | null | undefined>): string {
  return participants
    .filter(Boolean)
    .join(", ")
    .replace(/, ([^,]*)$/, " & $1");
}

export const getParticipantsFromCard = (
  obbCard:
    | NormalizedObbPvpCard
    | NormalizedObbSquadBetCard
    | NormalizedObbCreatedBetsCard
    | NormalizedObbSquadVsSquadCard
    | NormalizedObbEventPopularsCard,
): ObbFootballPlayer[] => {
  switch (obbCard.typename) {
    case "ObbPvpCard":
      return obbCard.participants;

    case "ObbSquadBetCard":
    case "ObbSquadVsSquadCard":
      return obbCard.eventParticipants ?? [];

    case "ObbCreatedBetsCard":
      return obbCard.bettingOpportunities.flatMap((opportunity) => opportunity.participants);

    case "ObbEventPopularsCard":
      return obbCard.popularBettingOpportunities.flatMap((opportunity) => opportunity.participants);

    default:
      return [];
  }
};
