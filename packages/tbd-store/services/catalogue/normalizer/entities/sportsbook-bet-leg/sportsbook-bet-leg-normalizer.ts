import type {
  OutcomeDefinition as GQLOutcomeDefinition,
  OutcomeDefinitionExp as GQLOutcomeDefinitionExp,
  Participant as GQLParticipant,
  PeriodDefinition as GQLPeriodDefinition,
  QueryDefinition as GQLQueryDefinition,
  SportsbookBetLegFragment,
  StatsThresholdDefinition as GQLStatsThresholdDefinition,
  OutcomeBasedDetailsFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import type {
  BetLeg,
  OutcomeDefinition,
  OutcomeDefinitionEntry,
  OutcomeDefinitionExp,
  Participant,
  PeriodDefinition,
  Query,
  SportsbookOdds,
  StatsThresholdDef,
  OutcomeBasedDetails,
} from "../../../../../state";
import {
  Comparison,
  LegType,
  Outcome,
  OutcomeDefinitionOperator,
  OutcomeDefinitionType,
  Result,
  ResultType,
  ParticipantSide,
  ParticipantType,
} from "../../../../../state/constants";
import type { TransformedFragment } from "../../Normalizer.types";

const transformGQLParticipantToParticipant = ({
  side,
  type,
  participantId,
}: GQLParticipant): Participant | undefined => {
  const result = {
    side: side ? ParticipantSide[side] : undefined,
    type: ParticipantType[type],
    participantId: participantId ?? undefined,
  };

  return result.type ? result : undefined;
};

const transformGQLParticipantsToParticipants = (
  participants: (GQLParticipant | null)[] | null,
): Participant[] | undefined => {
  if (!participants) {
    return undefined;
  }

  return participants
    .map((participant): Participant | undefined =>
      participant ? transformGQLParticipantToParticipant(participant) : undefined,
    )
    .filter((participant): participant is Participant => !!participant);
};

const transformGQLPeriodDefinitionToPeriodDefinition = ({
  period,
  periodStatus,
}: GQLPeriodDefinition): PeriodDefinition => ({
  period: period ?? undefined,
  periodStatus: periodStatus ?? undefined,
});

const transformGQLQueryDefinitionToQuery = ({
  outcome,
  participant,
  periodDefinition,
  sport,
}: GQLQueryDefinition): Query | undefined => {
  const transformedParticipant = transformGQLParticipantToParticipant(participant);

  if (!transformedParticipant) {
    return undefined;
  }

  const result = {
    outcome: Outcome[outcome as keyof typeof Outcome],
    participant: transformedParticipant,
    periodDefinition: transformGQLPeriodDefinitionToPeriodDefinition(periodDefinition),
    sport,
  };

  return result.outcome ? result : undefined;
};

const transformGQLStatsThresholdDefinitionToStatsThresholdDef = ({
  threshold,
  comparison,
}: GQLStatsThresholdDefinition): StatsThresholdDef => ({
  threshold,
  comparison: comparison ? Comparison[comparison] : undefined,
});

const transformGQLOutcomeDefinitionToOutcomeDefinition = (
  outcomeDefinition: GQLOutcomeDefinition | null,
): OutcomeDefinition | undefined => {
  if (!outcomeDefinition) {
    return undefined;
  }

  const transformedQuery = transformGQLQueryDefinitionToQuery(outcomeDefinition.query);

  if (!transformedQuery) {
    return undefined;
  }

  return {
    query: transformedQuery,
    statsThresholdDef: transformGQLStatsThresholdDefinitionToStatsThresholdDef(outcomeDefinition.statsThresholdDef),
  };
};

const transformGQLOutcomeBasedDetailsToOutcomeBasedDetails = (
  details: OutcomeBasedDetailsFragment | null,
): OutcomeBasedDetails | null => {
  if (!details) return null;

  return {
    expressionInfo: {
      ...details.expressionInfo,
      result: details.expressionInfo.result ? Result[details.expressionInfo.result as keyof typeof Result] : undefined,
      subExpressionInfos: (details.expressionInfo.subExpressionInfos ?? []).map((expression) => ({
        ...expression,
        subExpressionInfos: [],
        result: expression.result ? Result[expression.result as keyof typeof Result] : undefined,
      })),
    },
  };
};

const transformGQLOutcomeDefinitionExpToOutcomeDefinitionExp = (
  outcomeDefinitionExp: GQLOutcomeDefinitionExp | null,
): OutcomeDefinitionExp | undefined => {
  if (!outcomeDefinitionExp) {
    return undefined;
  }

  const outcomeDefinitionEntries = outcomeDefinitionExp.outcomeDefinitionEntries.reduce(
    (acc, { outcomeDefinitionType, operator, outcomeDefinition }) => {
      if (OutcomeDefinitionType[outcomeDefinitionType] === OutcomeDefinitionType.OPERATOR) {
        if (operator) {
          acc.push({
            outcomeDefinitionType: OutcomeDefinitionType.OPERATOR,
            operator: OutcomeDefinitionOperator[operator],
          });
        }
        return acc;
      }
      const outcomeDefinitionValue = transformGQLOutcomeDefinitionToOutcomeDefinition(outcomeDefinition);
      if (!outcomeDefinitionValue) {
        return acc;
      }
      acc.push({
        outcomeDefinitionType: OutcomeDefinitionType.OPERAND,
        outcomeDefinition: outcomeDefinitionValue,
      });
      return acc;
    },
    [] as OutcomeDefinitionEntry[],
  );

  return !outcomeDefinitionEntries.length
    ? undefined
    : {
        outcomeDefinitionEntries,
      };
};

type SportsbookOddsFragment = NonNullable<
  SportsbookBetLegFragment["parts"][number]["price"] | SportsbookBetLegFragment["parts"][number]["originalPrice"]
>;

const transformGQLSportsbookOddsToSportsbookOdds = ({
  decimal,
  fractional,
}: SportsbookOddsFragment): SportsbookOdds => ({
  decimal,
  fractional: fractional || undefined,
});

const normalizeSportsbookBetLegFragmentIntoSportsbookBetLeg = ({
  urn,
  type,
  result: legResult,
  resultType: legResultType,
  parts = [], // on bet level, we are not requesting parts, so this can be undefined
  legNumber,
  mutations,
  __typename,
  outcomeBasedDetails,
}: SportsbookBetLegFragment): TransformedFragment<BetLeg> => ({
  data: {
    urn,
    typename: __typename,
    type: LegType[type],
    result: legResult ? Result[legResult] : undefined,
    resultType: legResultType ? ResultType[legResultType] : undefined,
    legNumber,
    mutations,
    outcomeBasedDetails: transformGQLOutcomeBasedDetailsToOutcomeBasedDetails(outcomeBasedDetails),
    parts: parts.map(
      ({
        marketBetUrn,
        marketId,
        sportId,
        eventUrn,
        eventDescription,
        eventMarketDescription,
        marketType,
        selectionId,
        selectionName,
        price,
        originalPrice,
        priceType,
        handicap,
        eachwayPlaces,
        eachwayFactor,
        rule4Deductions,
        deadHeatWinDeductions,
        deadHeatEachwayDeductions,
        outcomeDefinitionExp,
        participants,
        isSuperSub,
        raceRunner,
        raceRunnerKind,
        raceUrn,
      }) => ({
        marketBetUrn: marketBetUrn ?? undefined,
        marketId: marketId ?? undefined,
        sportId: sportId ?? undefined,
        eventUrn: eventUrn ?? undefined,
        eventDescription,
        eventMarketDescription,
        marketType: marketType ?? undefined,
        selectionId: selectionId ?? undefined,
        selectionName,
        price: price && transformGQLSportsbookOddsToSportsbookOdds(price),
        originalPrice: originalPrice && transformGQLSportsbookOddsToSportsbookOdds(originalPrice),
        priceType: priceType ?? undefined,
        handicap: handicap ?? undefined,
        eachwayFactor: eachwayFactor ?? undefined,
        eachwayPlaces: eachwayPlaces ?? undefined,
        rule4Deductions: rule4Deductions ?? undefined,
        deadHeatWinDeductions: deadHeatWinDeductions ?? undefined,
        deadHeatEachwayDeductions: deadHeatEachwayDeductions ?? undefined,
        outcomeDefinitionExp: transformGQLOutcomeDefinitionExpToOutcomeDefinitionExp(outcomeDefinitionExp),
        participants: transformGQLParticipantsToParticipants(participants),
        isSuperSub: isSuperSub ?? false,
        silkUrl: raceRunner?.details.silk ?? undefined,
        raceRunnerKindUrn: raceRunnerKind?.urn ?? undefined,
        raceUrn: raceUrn ?? undefined,
      }),
    ),
  },
});

export default normalizeSportsbookBetLegFragmentIntoSportsbookBetLeg;
