import { createSelector } from "reselect";

import {
  BET_TYPES,
  BettingState,
  CLOSED_RUNNER_FAILURE_CODES,
  COMBINABLE_LEG_TYPES_LIST,
  COMBINATION_FAILURE_CODES,
  generateLegId,
  generateRunnerId,
  INVALID_SGM_COMBINATIONS_RUNNER_FAILURE_CODES,
  isCastLeg,
  LEG_TYPES,
  RUNNER_FAILURE_CODES,
  SUSPENDED_RUNNER_FAILURE_CODES,
  VALIDATION_SEVERITIES,
  VALIDATION_TYPES,
  Validations,
} from "@ppb/betslip-core";

import {
  ApplicationState,
  BetslipSportsbookConfirmationBet,
  CountryCode,
  Hierarchy,
  Meeting,
  Race,
  RaceRunners,
  GreyhoundRaceRunner,
  SportsbookOdds,
  UserDetails,
  OfflineUserDetails,
} from "../state";
import {
  MetadataType,
  RacingBettingMetadata,
  RunnersMetadata,
  SportsbookBettingState,
} from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import { Result as BLHResult, ResultType } from "../clients/blh/bet-live-hypotheticals-response-types";
import { Jurisdiction } from "../config/Jurisdiction";
import { Jurisdiction as JurisdictionMap, Result } from "../state/constants";

import { isRaceHierarchy } from "./markets";

const MALFORMED_DEFINITION_ERRORS = [
  RUNNER_FAILURE_CODES.INVALID_GLOBAL_MARKET_ID,
  RUNNER_FAILURE_CODES.INVALID_SELECTION_ID,
  RUNNER_FAILURE_CODES.BET_TYPE_NOT_SUPPORTED,
  RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
  RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
  RUNNER_FAILURE_CODES.SELECTION_NOT_AVAILABLE_INPLAY,
  RUNNER_FAILURE_CODES.PREPLAY_EVENT_STARTED,
  RUNNER_FAILURE_CODES.REQUESTED_HANDICAP_NOT_AVAILABLE,
  RUNNER_FAILURE_CODES.INVALID_COMBINATION,
  RUNNER_FAILURE_CODES.DUPLICATE_RUNNER,
  RUNNER_FAILURE_CODES.PRICE_BOOST_PRICE_NOT_AVAILABLE,
  RUNNER_FAILURE_CODES.EVENT_BLOCKED_FOR_USER_JURISDICTION,
];

export type MultipleCombinations = {
  oneLineCombination?: BettingState.Combination;
  multiLinesCombinations: BettingState.Combination[];
};

type ValidationTerritory = {
  countries: CountryCode[];
  jurisdictions: Jurisdiction[];
};

type ValidationsMap = {
  [k in VALIDATION_TYPES]?: {
    ImplyBets: ValidationTerritory;
    Config: ValidationTerritory;
  };
};

/**
 * Whitelisted validations go here
 *
 * If a validation is specific for a given jurisdiction,
 * add to Jurisdiction array
 */
const VALIDATIONS: ValidationsMap = {
  [VALIDATION_TYPES.ABOVE_MAX_PAYOUT]: {
    ImplyBets: {
      countries: [],
      jurisdictions: [JurisdictionMap.ITALY],
    },
    Config: {
      countries: [CountryCode.UNITED_KINGDOM, CountryCode.IRELAND],
      jurisdictions: [JurisdictionMap.BRAZIL],
    },
  },
};

type ResultMapping = Record<string, Result | undefined>;
type ResultTypeMapping = Record<string, ResultMapping>;
const resultMappings: ResultTypeMapping = {
  [BLHResult.LOSE]: {
    [ResultType.CONFIRMED]: Result.LOST,
    [ResultType.POTENTIAL]: Result.LOSING,
  },
  [BLHResult.WIN]: {
    [ResultType.CONFIRMED]: Result.WON,
    [ResultType.POTENTIAL]: Result.WINNING,
  },
  [BLHResult.VOID]: {
    [ResultType.CONFIRMED]: Result.VOID,
  },
};

// Used to convert the entity tuple for price boost
export function convertEntityTupleToLegId(marketId: string, selectionId: number, group?: string): string {
  const runnerTuple = [generateRunnerId({ marketId, selectionId })];

  return generateLegId(LEG_TYPES.SIMPLE_SELECTION, runnerTuple, group);
}

// Used for price boost, betting opportunities and virtual markets
export function isLegInState(legId: string, legs: BettingState.LegsMap): boolean {
  return !!legs[legId];
}

// Used in the GA for add selection events and in the sportsbook market selectors for state check
export function isSingleLegInState(sportsbookBetting: SportsbookBettingState, selectionTuple: string[]) {
  const simpleLegId = generateLegId(LEG_TYPES.SIMPLE_SELECTION, selectionTuple);
  const oneLineLegId = generateLegId(LEG_TYPES.ONE_LINE_BET, selectionTuple);

  return !!sportsbookBetting.legs[simpleLegId] || !!sportsbookBetting.legs[oneLineLegId];
}

export function getUniqueFailedSGMCombinationGroups(failures: BettingState.ImplyRunnerFailuresMap): number[] {
  const allFailedCombinationGroups = Object.keys(failures)
    .filter((failedRunnerId) =>
      failures[failedRunnerId].some(({ failureCode }) =>
        INVALID_SGM_COMBINATIONS_RUNNER_FAILURE_CODES.includes(failureCode),
      ),
    )
    .reduce<number[]>((previousCombinationGroups, failedRunnerId) => {
      const flatRunnerCombinationGroups = failures[failedRunnerId].reduce<number[]>(
        (flatCombinationGroups, runnerFail) => [...flatCombinationGroups, ...runnerFail.combinationGroups],
        [],
      );

      return [...previousCombinationGroups, ...flatRunnerCombinationGroups];
    }, []);

  return [...new Set(allFailedCombinationGroups)];
}

export const processAllUniqueRunnersFailures = (
  failures: BettingState.PlaceRunnerFailuresMap,
): RUNNER_FAILURE_CODES[] => {
  const runnerLevelFailures = Object.values(failures)
    .reduce<BettingState.PlaceRunnerFailure[]>(
      (allRunnerFailures, runnerFailures) => [...allRunnerFailures, ...runnerFailures],
      [],
    )
    .map<RUNNER_FAILURE_CODES>(({ failureCode }) => failureCode);

  return [...new Set<RUNNER_FAILURE_CODES>(runnerLevelFailures)];
};

export const processAllUniqueCombinationsFailures = (
  failures: BettingState.PlaceCombinationFailuresMap,
): COMBINATION_FAILURE_CODES[] => {
  const combinationLevelFailures = Object.values(failures)
    .map(({ failureCode }) => failureCode)
    .filter((failureCode) => failureCode !== COMBINATION_FAILURE_CODES.OTHER_FAILURE_IN_REQUEST);

  return [...new Set(combinationLevelFailures)];
};

export const getSbkPlaceImportantErrorCode = ({
  operationalFailure,
  uniqueRunnersFailures,
  uniqueCombinationsFailures,
}: {
  operationalFailure: BettingState.PlaceOperationFailure;
  uniqueRunnersFailures: RUNNER_FAILURE_CODES[];
  uniqueCombinationsFailures: COMBINATION_FAILURE_CODES[];
}): string => {
  const [runnerFailureCode] = uniqueRunnersFailures;
  const isMalformedDefinitionError = MALFORMED_DEFINITION_ERRORS.includes(runnerFailureCode);
  if (uniqueRunnersFailures.length === 1 && !isMalformedDefinitionError) {
    return runnerFailureCode;
  }

  if (uniqueCombinationsFailures.length === 1) {
    const [combinationFailureCode] = uniqueCombinationsFailures;
    return combinationFailureCode;
  }

  return operationalFailure.failureCode;
};

export const getSbkDisplayTransactionalError = (failureGroup: BettingState.PlaceFailureGroup): string | null => {
  if (!failureGroup.operational) {
    return null;
  }

  const uniqueRunnersFailures = processAllUniqueRunnersFailures(failureGroup.runners);
  const uniqueCombinationsFailures = processAllUniqueCombinationsFailures(failureGroup.combinations);
  return getSbkPlaceImportantErrorCode({
    operationalFailure: failureGroup.operational,
    uniqueRunnersFailures,
    uniqueCombinationsFailures,
  });
};

export const getRacingMetadata = (
  race: Race,
  meeting: Meeting,
  raceSelectionId: number,
  raceRunners?: RaceRunners,
  greyhoundRunner?: GreyhoundRaceRunner,
): RacingBettingMetadata => {
  const racingRunner =
    raceRunners && Object.values(raceRunners).find(({ selectionId }) => selectionId === raceSelectionId);

  return {
    urn: race.urn,
    time: race.startTime,
    saddleCloth: racingRunner?.details.saddleCloth,
    venue: meeting.venue,
    runnerVisual: racingRunner?.details.silk,
    trap: greyhoundRunner?.trap,
    meetingCountry: meeting.country,
  };
};

export const getMetadataType = (hierarchy: Hierarchy): MetadataType => {
  if (isRaceHierarchy(hierarchy)) {
    return "RACING";
  }

  return "GENERIC";
};

export const mapSportsbookOddsToOdds = (sportsbookOdds?: SportsbookOdds): BettingState.Odds | null =>
  sportsbookOdds
    ? {
        decimalOdds: sportsbookOdds.decimal,
        fractionalOdds: sportsbookOdds.fractional && {
          numerator: sportsbookOdds.fractional.numerator,
          denominator: sportsbookOdds.fractional.denominator,
        },
        americanOdds: sportsbookOdds.american,
      }
    : null;

export type CastGroup = {
  id: string;
  combinations: BettingState.Combination[];
  metadataRunnerId: string;
};

export type CastGroupMap = {
  [marketId: string]: CastGroup;
};

type LegsMapLikeEntity = {
  [legId: string]: {
    legType: LEG_TYPES;
  };
};

type CombinationLikeEntity = {
  betType: BET_TYPES;
  legs: string[];
  // Represents a bet builder bet
  isSgm?: boolean;
  isSgmMultiple?: boolean;
  isBoosted: boolean;
};

export const isTerritoryApplicableValidation = (
  validationType: VALIDATION_TYPES,
  userDetails: UserDetails | OfflineUserDetails,
): boolean => {
  switch (validationType) {
    case VALIDATION_TYPES.ABOVE_MAX_PAYOUT: {
      const isOnlineUserDetails = "jurisdiction" in userDetails;

      return !!(
        VALIDATIONS[validationType]?.ImplyBets.countries.includes(userDetails.countryCode) ||
        (isOnlineUserDetails &&
          VALIDATIONS[validationType]?.ImplyBets.jurisdictions.includes(
            userDetails.jurisdiction.jurisdiction as Jurisdiction,
          ))
      );
    }
    default:
      return true;
  }
};

export const hasSpecialValidation = (
  validationType: VALIDATION_TYPES,
  userDetails: UserDetails,
  hasAboveMaxStakeValidation: boolean,
): boolean => {
  switch (validationType) {
    case VALIDATION_TYPES.ABOVE_MAX_PAYOUT:
      return (
        !hasAboveMaxStakeValidation &&
        !!(
          VALIDATIONS[validationType]?.Config.countries.includes(userDetails.countryCode) ||
          VALIDATIONS[validationType]?.Config.jurisdictions.includes(
            userDetails.jurisdiction.jurisdiction as Jurisdiction,
          )
        )
      );
    default:
      return false;
  }
};

export const isLotteries = <U extends CombinationLikeEntity, T extends LegsMapLikeEntity>(
  combination: U,
  legs: T,
): boolean =>
  combination.legs.length !== 0 && combination.legs.every((legId) => legs[legId].legType === LEG_TYPES.ONE_LINE_BET);

export const isSingle = <U extends CombinationLikeEntity, T extends LegsMapLikeEntity>(
  combination: U,
  legs: T,
): boolean => {
  const isSingleBetType = combination.betType === BET_TYPES.SINGLE;
  const hasSimpleSelectionOnly =
    combination.legs.length !== 0 &&
    combination.legs.every((legId) => legs[legId].legType === LEG_TYPES.SIMPLE_SELECTION);

  return isSingleBetType && hasSimpleSelectionOnly;
};

export const isSingleLike = <U extends CombinationLikeEntity, T extends LegsMapLikeEntity>(
  combination: U,
  legs: T,
): boolean => isSingle(combination, legs) || isLotteries(combination, legs);

export const isCast = <U extends CombinationLikeEntity, T extends LegsMapLikeEntity>(
  combination: U,
  legs: T,
): boolean => {
  const isSingleBetType = combination.betType === BET_TYPES.SINGLE;
  const hasCastOnly =
    combination.legs.length !== 0 && combination.legs.every((legId) => isCastLeg(legs[legId].legType));

  return isSingleBetType && hasCastOnly;
};

export const isMultiple = <U extends CombinationLikeEntity>(combination: U): boolean => {
  const isSingleBetType = combination.betType === BET_TYPES.SINGLE;
  const hasOneLineBetLegOnly =
    "legs" in combination &&
    combination.legs.length !== 0 &&
    combination.legs.every((legId) => legId.includes(LEG_TYPES.ONE_LINE_BET));

  return (
    !isSingleBetType &&
    !hasOneLineBetLegOnly &&
    !combination.isSgm &&
    !combination.isSgmMultiple &&
    !combination.isBoosted
  );
};

export const isBoostedMultiple = <U extends CombinationLikeEntity>(combination: U): boolean =>
  combination.betType !== BET_TYPES.SINGLE && !combination.isSgm && !combination.isSgmMultiple && combination.isBoosted;

export const isMultiBetBuilder = <U extends CombinationLikeEntity>(combination: U): boolean =>
  !!combination.isSgmMultiple;

export function findSingleCombinationFromLegId(
  combinations: BettingState.CombinationsMap,
  legId: string,
): BettingState.Combination | undefined {
  return Object.values(combinations).find(
    (combination) =>
      combination.legs.length === 1 &&
      combination.legs[0] === legId &&
      combination.betType === BET_TYPES.SINGLE &&
      !combination.isBoosted,
  );
}

export const createGetMultiBetBuilderSelector = (
  selectorCallback: (state: ApplicationState) => BettingState.CombinationsMap,
) =>
  createSelector([selectorCallback], (combinations) =>
    Object.values(combinations).find((combination) => isMultiBetBuilder(combination)),
  );

export const isBetBuilder = <U extends CombinationLikeEntity>(combination: U): boolean =>
  !!combination.isSgm && !combination.isSgmMultiple && !combination.isBoosted;

export const isOrderableCast = (combination: BettingState.Combination, legs: BettingState.LegsMap): boolean => {
  const [legId] = combination.legs;
  const leg = legs[legId];

  return [LEG_TYPES.FORECAST, LEG_TYPES.TRICAST].includes(leg.legType);
};

export const isStakeValid = (
  userDetails: UserDetails | OfflineUserDetails,
  validations?: Validations.CombinationsValidations[],
): boolean => {
  if (!validations) {
    return true;
  }

  return !validations
    .filter((validation) => isTerritoryApplicableValidation(validation.type, userDetails))
    .filter((validation) =>
      "severity" in validation ? validation.severity === VALIDATION_SEVERITIES.ERROR : !!validation,
    ).length;
};

export const isSimpleSelection = (leg: BettingState.Leg): boolean => COMBINABLE_LEG_TYPES_LIST.includes(leg.legType);

export const getSimpleSelectionLegs = (legs: BettingState.LegsMap): BettingState.LegsMap =>
  Object.values(legs)
    .filter((leg) => isSimpleSelection(leg))
    .reduce(
      (simpleSelectionLegsMap, leg) => ({
        ...simpleSelectionLegsMap,
        [leg.id]: leg,
      }),
      {},
    );

const groupCombinationByMarketId = (
  groupedCasts: CastGroupMap,
  combination: BettingState.Combination,
  legs: BettingState.LegsMap,
  runners: BettingState.RunnersMap,
): CastGroupMap => {
  const {
    legs: [legId],
  } = combination;
  const [runnerId] = legs[legId].runners;
  const { marketId } = runners[runnerId];
  const castGroup = groupedCasts[marketId] || { id: marketId, metadataRunnerId: runnerId, combinations: [] };
  const hasCombination = castGroup.combinations && !!castGroup.combinations.find(({ id }) => id === combination.id);

  if (hasCombination) {
    return groupedCasts;
  }

  const groupedCombinations = castGroup.combinations || [];

  return {
    ...groupedCasts,
    [marketId]: { ...castGroup, combinations: [...groupedCombinations, combination] },
  };
};

export const groupCombinationsByMarketId = (
  bettingState?: BettingState.Group | BetslipSportsbookConfirmationBet,
): CastGroupMap => {
  if (!bettingState) {
    return {};
  }

  const { combinations, legs, runners } = bettingState;

  return Object.values(combinations)
    .filter((combination) => isCast(combination, legs))
    .reduce<CastGroupMap>(
      (groupedCasts, combination) => groupCombinationByMarketId(groupedCasts, combination, legs, runners),
      {},
    );
};

export const groupCombinationsByMultiLineTypes = (
  combinations: BettingState.CombinationsMap = {},
): MultipleCombinations => {
  const [lowestLineCombination, ...rest] = Object.values(combinations)
    .filter((combination) => isMultiple(combination))
    .sort((combinationA, combinationB) => combinationA.numLines - combinationB.numLines);

  return {
    oneLineCombination: lowestLineCombination,
    multiLinesCombinations: rest || [],
  };
};

export const getResultFromResultType = (result: BLHResult, type: ResultType): Result | undefined =>
  resultMappings[result]?.[type];

export const generateCastRunnersIds = (
  combinations: BettingState.CombinationsMap,
  legs: BettingState.LegsMap,
  runners: BettingState.RunnersMap,
  combinationId?: string,
): string[] => {
  if (!combinationId || !combinations[combinationId]) {
    return [];
  }

  const [anyLeg] = combinations[combinationId].legs;
  const runnerIds = legs[anyLeg].runners;

  return [...runnerIds].sort((runnerIdA, runnerIdB) => {
    const runnerA = runners[runnerIdA];
    const runnerB = runners[runnerIdB];

    if (!runnerA?.order || !runnerB?.order) {
      return 0;
    }

    return runnerA.order - runnerB.order;
  });
};

export const generateCastGroupIds = (castGroups: CastGroupMap, runnersMetadata: RunnersMetadata) =>
  Object.values(castGroups)
    .sort((castGroupOne, castGroupTwo) => {
      // Since all runners have the same parent race we just use one of the runners
      const { metadataRunnerId: metadataRunnerIdOne } = castGroupOne;
      const { metadataRunnerId: metadataRunnerIdTwo } = castGroupTwo;
      let combinationOneRacing;
      let combinationTwoRacing;
      const metadataOne = runnersMetadata[metadataRunnerIdOne];
      const metadataTwo = runnersMetadata[metadataRunnerIdTwo];

      if (metadataOne.type === "RACING") {
        combinationOneRacing = metadataOne.racing;
      }
      if (metadataTwo.type === "RACING") {
        combinationTwoRacing = metadataTwo.racing;
      }

      if (!combinationOneRacing || !combinationTwoRacing) {
        return 0;
      }

      return new Date(combinationOneRacing.time).getTime() - new Date(combinationTwoRacing.time).getTime();
    })
    .map(({ id }) => id);

/**
 * Checks if the given array of `failures` contains an invalid combination.
 *
 * @param runnerFailures - An array of `BettingState.ImplyRunnerFailure` objects representing failures.
 * @returns A boolean indicating whether an invalid combination exists in the `failures` array.
 */
export const hasAnyInvalidCombinationFailure = (runnerFailures: BettingState.ImplyRunnerFailure[]): boolean =>
  runnerFailures.some((failure) => failure.failureCode === RUNNER_FAILURE_CODES.INVALID_COMBINATION);

/**
 * Checks if any market has a closed failure.
 *
 * @param runnerFailures - An array of runner failures.
 * @returns A boolean indicating if any market has a closed failure.
 */
export const hasAnyMarketClosedFailure = (runnerFailures: BettingState.ImplyRunnerFailure[]): boolean =>
  runnerFailures.some((failure) => CLOSED_RUNNER_FAILURE_CODES.includes(failure.failureCode));

/**
 * Checks if any market has a suspended failure.
 * @param runnerFailures - An array of runner failures.
 * @returns A boolean indicating if any market has a suspended failure.
 */
export const hasAnyMarketSuspendedFailure = (runnerFailures: BettingState.ImplyRunnerFailure[]): boolean =>
  runnerFailures.some((failure) => SUSPENDED_RUNNER_FAILURE_CODES.includes(failure.failureCode));
