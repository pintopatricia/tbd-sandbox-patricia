import i18n from "i18next";
import {
  BetslipObbQuotes,
  CountryCode,
  Throttles,
  UserDetails,
  createGetThrottleSelector,
  BetslipObbReport,
  BetslipObbReportBetMap,
  BetPlacementResult,
  BetslipObbReportBet,
  BetslipObbPlaceBetResponseData,
  ObbLegTaggingMetadata,
} from "../state";
import {
  BetFailure,
  FailuresMap,
  ObbBetslipValidations,
  ObbBettingState,
  ObbLeg,
  ObbLegMetadata,
  ObbPotentialBetMap,
  ObbPotentialBetsValidations,
  BelowMinStakeValidation,
  AboveMaxStakeValidation,
  IncrementOutOfRangeValidation,
  AboveMaxPayoutValidation,
  ObbLegMap,
  ObbValidationTypes,
  ObbValidationSeverities,
  ObbPvpLegParams,
  ObbPrice,
  ObbPotentialBet,
  ObbXOfNLegParams,
  ObbSquadBetLegParams,
  Quantifier,
  BaseBet,
  ObbLegParams,
  ObbSquadVsSquadBetLegParams,
} from "../state/betting/obb-betting/ObbBetting.types";
import { Jurisdiction as JurisdictionMap, ObbLegTemplateIds, BetType } from "../state/constants";
import { getRemainder, round } from "./math";
import { Jurisdiction } from "../config/Jurisdiction";
import {
  BET_LEVEL_NOTIFICATIONS_BLOCKLIST,
  BETSLIP_LEVEL_NOTIFICATIONS_BLOCKLIST,
  ERRORS_TRIGGERING_QUOTES_UPDATE,
  LEG_LEVEL_NOTIFICATIONS_BLOCKLIST,
  QUOTES_FAILURES_BLOCKLIST,
  SUSPENDED_FAILURE_CODES,
} from "../state/betting/obb-betting/obb-betting.constants";
import {
  ObbFootballPlayer,
  SelectorObbLeg,
  SelectorObbPvpLegTemplateParams,
  SelectorObbSquadBetLegTemplateParams,
  SelectorObbSquadVsSquadLegTemplateParams,
} from "../state/entities/obb-legs/ObbLegs.types";
import {
  ExpressionParamsInput,
  ToQuote,
  CombinedBetDefinitionResult,
  CombinedBetLegsDefinitionResult,
  BetDefinitionResult,
  PlaceBetDefinitionInput,
  Supplier,
  BetPlacementDetails as CatalogBetPlacementDetails,
  BetDetails,
  BaseExpressionTemplateDefinitions,
  OutcomeBasedLegDefinition,
} from "../clients/catalogue/catalogue-response-types";
import { hashObjectFnv1a } from "./hashing";
import { OBB_MAX_LEGS } from "../config/common-config";
import { areObjectsDeepEqual } from "./obj-deep-equal-comparator";

type ValidationHandler = (state: ObbBettingState, validation: ObbPotentialBetsValidations) => ObbBettingState;
type Validators = {
  [type: string]: ValidationHandler;
};
type ValidationTerritory = {
  countries: CountryCode[];
  jurisdictions: Jurisdiction[];
};

type ValidationsMap = {
  [k in ObbValidationTypes]?: {
    ImplyBets: ValidationTerritory;
    Config: ValidationTerritory;
  };
};

const quantifierSymbolsEnum: Record<Quantifier.AT_LEAST, string> = {
  [Quantifier.AT_LEAST]: "+",
};

export const mapQuantifierEnumToSymbol = (quantifier: Quantifier.AT_LEAST): string =>
  quantifierSymbolsEnum[quantifier] ?? "-";

export const obbTemplateIds: Record<string, string> = {
  [ObbLegTemplateIds.PARTICIPANTS_COMBINED]: "Squad Bet",
  [ObbLegTemplateIds.SQUAD_VS_SQUAD]: "Mash Ups",
  [ObbLegTemplateIds.PLAYER_VS_PLAYER]: "Build Ups",
};

/**
 * Whitelisted validations go here
 *
 * If a validation is specific for a given jurisdiction,
 * add to Jurisdiction array
 */
const VALIDATIONS: ValidationsMap = {
  [ObbValidationTypes.ABOVE_MAX_PAYOUT]: {
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

function buildAboveMaxPayoutValidation(
  currentPayout: number,
  max: number,
  severity: ObbValidationSeverities,
): AboveMaxPayoutValidation {
  return {
    type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
    data: {
      currentPayout,
      max,
    },
    severity,
  };
}

function buildBelowMinStakeValidation(stake: number, minStake: number): BelowMinStakeValidation {
  return {
    type: ObbValidationTypes.BELOW_MIN_STAKE,
    data: {
      currentStake: stake,
      min: minStake,
    },
    severity: ObbValidationSeverities.ERROR,
  };
}

function buildAboveMaxStakeValidation(stake: number, maxStake: number): AboveMaxStakeValidation {
  return {
    type: ObbValidationTypes.ABOVE_MAX_STAKE,
    data: {
      currentStake: stake,
      max: maxStake,
    },
    severity: ObbValidationSeverities.ERROR,
  };
}

function buildIncrementOutOfRangeValidation(
  currentStake: number,
  minStake: number,
  maxStake: number,
  closest: number,
): IncrementOutOfRangeValidation {
  return {
    type: ObbValidationTypes.INCREMENT_OUT_OF_RANGE,
    data: {
      currentStake,
      closest: Math.min(Math.max(closest, minStake), maxStake),
    },
    severity: ObbValidationSeverities.ERROR,
  };
}

/**
 * Validates the betslip total potential returns against the max payout limits.
 *
 * @param {ObbBettingState} state - The current state of bets, including individual bet details.
 * @returns {ObbBetslipValidations[]} - An array of betslip validation objects.
 */
function obbValidateBetslip(state: ObbBettingState): ObbBetslipValidations[] {
  const { totalPotentialReturns, maxPayoutLimits } = state;
  const validations: ObbBetslipValidations[] = [];

  if (totalPotentialReturns !== null && maxPayoutLimits.warning && maxPayoutLimits.error) {
    if (totalPotentialReturns > maxPayoutLimits.warning && totalPotentialReturns <= maxPayoutLimits.error) {
      validations.push(
        buildAboveMaxPayoutValidation(totalPotentialReturns, maxPayoutLimits.error, ObbValidationSeverities.WARNING),
      );
    }
    if (totalPotentialReturns > maxPayoutLimits.error) {
      validations.push(
        buildAboveMaxPayoutValidation(totalPotentialReturns, maxPayoutLimits.error, ObbValidationSeverities.ERROR),
      );
    }
  }

  return validations;
}

/**
 * Validates the potential bets against stake and payout restrictions.
 *
 * @param {ObbBettingState} state - The current state of bets, including individual bet details.
 * @returns {Record<string, ObbPotentialBetsValidations[]>} - An object containing an array of potential bet validation objects indexed by potential bet urn.
 */
function validateObbPotentialBets(state: ObbBettingState): Record<string, ObbPotentialBetsValidations[]> {
  const { potentialBets } = state;
  const validations: Record<string, ObbPotentialBetsValidations[]> = {};

  Object.entries(potentialBets).forEach(([potentialBetId, potentialBet]) => {
    const { stake, potentialReturns, maxPayout, maxStake, minStake, minStakeIncrement } = potentialBet;

    validations[potentialBetId] = [];

    if (stake) {
      if (maxStake !== null && stake > maxStake) {
        validations[potentialBetId].push(buildAboveMaxStakeValidation(stake, maxStake));
      }

      if (minStake !== null && stake < minStake) {
        validations[potentialBetId].push(buildBelowMinStakeValidation(stake, minStake));
      }

      if (
        maxStake !== null &&
        minStake !== null &&
        minStakeIncrement !== null &&
        getRemainder(stake, minStakeIncrement) !== 0
      ) {
        const remainder = getRemainder(stake, minStakeIncrement);
        const closest = stake - remainder;
        const roundedClosest = round(closest, 2);

        validations[potentialBetId].push(buildIncrementOutOfRangeValidation(stake, minStake, maxStake, roundedClosest));
      }

      if (maxPayout !== null && potentialReturns && potentialReturns > maxPayout) {
        validations[potentialBetId].push(
          buildAboveMaxPayoutValidation(potentialReturns, maxPayout, ObbValidationSeverities.ERROR),
        );
      }
    }
  });

  return validations;
}

/**
 * Validates the current state of bets against stake and payout restrictions.
 *
 * @param {ObbBettingState} state - The current state of bets, including individual bet details.
 * @returns {ObbBettingState} - A new betting state object with updated validations.
 */
function validate(state: ObbBettingState): ObbBettingState {
  const betslipValidations = obbValidateBetslip(state);
  const potentialBetsValidations = validateObbPotentialBets(state);

  return {
    ...state,
    validations: {
      betslip: betslipValidations,
      potentialBets: potentialBetsValidations,
    },
  };
}

/**
 * Updates the total stake and potential returns in the betting state.
 *
 * @param {ObbBettingState} newState - The current state of bets, including individual bet details.
 * @return {ObbBettingState}  - A new betting state object with updated total stake and potential returns, and validated.
 */
function calculate(state: ObbBettingState): ObbBettingState {
  const { totalStake, totalPotentialReturns } = Object.values(state.potentialBets).reduce(
    (acc, cur) => {
      acc.totalStake += cur.stake || 0;
      acc.totalPotentialReturns += cur.potentialReturns || 0;
      return acc;
    },
    { totalStake: 0, totalPotentialReturns: 0 },
  );

  return {
    ...state,
    totalStake,
    totalPotentialReturns,
  };
}

function verify(state: ObbBettingState): ObbBettingState {
  return validate(calculate(state));
}

/**
 * Updates the stake value for a specific leg in the ObbBettingState.
 * If `isIncrement` is true, the stake value is incremented by the provided stake amount.
 * If the leg is not found in the potential bets, the state remains unchanged.
 *
 * @param state The current ObbBettingState object.
 * @param potentialBetId The ID of the potentialBet for which the stake value is updated.
 * @param stakeData An object containing the stake amount and an optional flag to indicate increment.
 *
 * @returns The updated ObbBettingState object.
 */
function updatePotentialBetStake(
  state: ObbBettingState,
  potentialBetId: string,
  stakeData: { stake: number | null; isIncrement?: boolean },
): ObbBettingState {
  const { stake, isIncrement = false } = stakeData;
  const potentialBet = state.potentialBets[potentialBetId];

  if (!potentialBet) {
    return state;
  }

  let newStakeValue = stake;
  if (isIncrement && newStakeValue !== null) {
    newStakeValue += potentialBet.stake || 0;
  }

  const potentialBets = {
    ...state.potentialBets,
    [potentialBetId]: {
      ...potentialBet,
      stake: newStakeValue,
      potentialReturns: potentialBet?.quote?.price?.decimal
        ? potentialBet.quote.price.decimal * (newStakeValue || 0)
        : 0,
    },
  };

  return verify({ ...state, potentialBets });
}

/**
 * Transfers the stake from an old potential bet to a new potential bet and resets the old bet's stake.
 * Also updates all potential bets with the same base bets.
 *
 * @param state The current ObbBettingState object.
 * @param oldPotentialBetId The ID of the potential bet to transfer stake from.
 * @param newPotentialBetId The ID of the potential bet to transfer stake to.
 *
 * @returns The updated ObbBettingState object.
 */
function transferPotentialBetStake(
  state: ObbBettingState,
  oldPotentialBetId: string,
  newPotentialBetId: string,
): ObbBettingState {
  const oldBet = state.potentialBets[oldPotentialBetId];
  const newBet = state.potentialBets[newPotentialBetId];

  if (!oldBet || !newBet) return state;

  if (oldBet.stake === null) return state;

  const potentialBets = {
    ...state.potentialBets,
    [oldPotentialBetId]: {
      ...oldBet,
      stake: null,
      potentialReturns: 0,
    },
    [newPotentialBetId]: {
      ...newBet,
      stake: oldBet.stake,
      potentialReturns: newBet?.quote?.price?.decimal ? newBet.quote.price.decimal * (oldBet.stake || 0) : 0,
    },
  };

  return verify({ ...state, potentialBets });
}

function removeLeg(obbBettingState: ObbBettingState, legId: string): ObbBettingState {
  const { legs, potentialBets } = obbBettingState;

  if (!legs[legId]) {
    return obbBettingState;
  }

  const remainingLegs = Object.entries(legs).reduce<ObbLegMap>((acc, [id, leg]) => {
    if (legId === id) return acc;

    const { params } = leg;

    // Checking if there is a combined leg that has the removed leg as one of its baseBets
    if (
      "baseBets" in params &&
      params.baseBets.find((baseBet) =>
        areObjectsDeepEqual(baseBet, { templateId: legs[legId].templateId, params: legs[legId].params }),
      )
    ) {
      const { baseBets } = params;

      /*
       * if the combined leg has only two base legs, we remove the combined leg entirely
       * otherwise if we remove the leg from the base legs, we get a combined leg with only one base leg
       * which is not valid and will create a layout shift in the betslip
       */
      if (baseBets.length === 2) {
        return acc;
      }

      // otherwise, if it has more than two base legs, we remove the leg object from the baseBets
      acc[id] = {
        ...leg,
        params: {
          ...params,
          baseBets: baseBets.filter(
            (baseBet) =>
              !areObjectsDeepEqual(baseBet, { templateId: legs[legId].templateId, params: legs[legId].params }),
          ),
        },
      };

      return acc;
    }

    acc[id] = leg;

    return acc;
  }, {});

  // If a potential bet has a leg that is not in the remainingLegs, we remove it from the potential bets
  const remainingPotentialBets: ObbPotentialBetMap = Object.fromEntries(
    Object.entries(potentialBets).filter(([, potentialBet]) => potentialBet.legs.some((leg) => !!remainingLegs[leg])),
  );

  return verify({
    ...obbBettingState,
    legs: remainingLegs,
    potentialBets: remainingPotentialBets,
  });
}

function formatParticipants(participants: ObbFootballPlayer[]) {
  return participants
    .map((participant) => participant.player?.name)
    .filter(Boolean)
    .join(", ")
    .replace(/, ([^,]*)$/, " & $1");
}

function buildPvpLegMetadata(leg: SelectorObbLeg): ObbLegMetadata {
  const templateParams = leg.templateParams as SelectorObbPvpLegTemplateParams;

  const { outcomeId, timePeriodId, participantIdA, participantIdB } = templateParams;

  const outcomeDescription = i18n.t("I18N.OBB.DESCRIPTION.BETSLIP.PVP", {
    incidentType: outcomeId,
    operator: "MORE",
    playerName: participantIdB?.player?.name,
    period: timePeriodId,
    count: 2, // to force plural translation
  });

  const participantsDescription = participantIdA?.player?.name || "";

  return {
    legTypeDescription: i18n.t(`I18N.OBB.BETTYPE.${leg.templateId}`),
    legDescription: `${participantsDescription} ${outcomeDescription}`,
    participantsDescription,
    outcomeDescription,
  };
}

function buildParticipantsCombinedLegMetadata(leg: SelectorObbLeg): ObbLegMetadata {
  const templateParams = leg.templateParams as SelectorObbSquadBetLegTemplateParams;

  const { participantIds, outcomeIds, quantifier, value } = templateParams;
  const outcomeDescriptionWithoutValue = i18n.t("I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET", {
    incidentType: outcomeIds[0],
    count: 2,
  });
  const outcomeDescriptionWithValue = `${value}${mapQuantifierEnumToSymbol(
    quantifier as Quantifier.AT_LEAST,
  )} ${outcomeDescriptionWithoutValue}`;

  const participantsDescription = formatParticipants(participantIds);

  return {
    legTypeDescription: i18n.t(`I18N.OBB.OUTCOME.INCIDENT.${templateParams.outcomeIds[0]}`),
    legDescription: `${participantsDescription} ${outcomeDescriptionWithValue}`,
    participantsDescription,
    outcomeDescription: outcomeDescriptionWithValue,
  };
}

function buildXOfNLegMetadata(
  leg: CombinedBetLegsDefinitionResult,
  obbBettingLegs: ObbLegMap,
  combinedBetObbTaggingMetadata: { [leg: string]: ObbLegTaggingMetadata | null },
): ObbLegMetadata {
  const { expressionTemplateId, betDefinitions } = leg;

  const {
    legDescriptions,
    participantsDescriptions,
    outcomeDescriptions,
    quotes,
    eventNames,
    eventIds,
    competitionIds,
    competitionNames,
    sportIds,
    sportNames,
  } = betDefinitions.reduce(
    (acc, baseLegId) => {
      const obbBettingLeg = obbBettingLegs[baseLegId];
      const legObbTaggingMetadata = combinedBetObbTaggingMetadata[baseLegId];

      acc.legDescriptions.push(obbBettingLeg.metadata.legDescription);
      acc.participantsDescriptions.push(obbBettingLeg.metadata.participantsDescription);
      acc.outcomeDescriptions.push(obbBettingLeg.metadata.outcomeDescription);
      acc.quotes.push(obbBettingLeg.quote?.price.decimal.toString());
      acc.eventNames.push(obbBettingLeg.event.name);
      acc.eventIds.push(obbBettingLeg.event.eventId.toString());
      acc.competitionIds.push(legObbTaggingMetadata?.competitionId);
      acc.competitionNames.push(legObbTaggingMetadata?.competition);
      acc.sportIds.push(legObbTaggingMetadata?.sportId);
      acc.sportNames.push(legObbTaggingMetadata?.sport);

      return acc;
    },
    {
      legDescriptions: [],
      participantsDescriptions: [],
      outcomeDescriptions: [],
      quotes: [],
      eventNames: [],
      eventIds: [],
      competitionIds: [],
      competitionNames: [],
      sportIds: [],
      sportNames: [],
    } as Record<string, Array<string | undefined>>,
  );
  const maxChars = 500;

  const legDescription = legDescriptions.join(" | ").slice(0, maxChars);
  const participantsDescription = participantsDescriptions.join(" | ").slice(0, maxChars);
  const outcomeDescription = outcomeDescriptions.join(" | ").slice(0, maxChars);
  const obbBettingLegsQuotes = quotes.join(" | ").slice(0, maxChars);
  const eventsNames = eventNames.join(" | ").slice(0, maxChars);
  const eventsIds = eventIds.join(" | ").slice(0, maxChars);
  const competitionIdDescription = competitionIds.join(" | ").slice(0, maxChars);
  const competitionNameDescription = competitionNames.join(" | ").slice(0, maxChars);
  const sportsIds = sportIds.join(" | ").slice(0, maxChars);
  const sportsNames = sportNames.join(" | ").slice(0, maxChars);

  const tabName = combinedBetObbTaggingMetadata[betDefinitions[0]]?.tabName;

  const layout = combinedBetObbTaggingMetadata[betDefinitions[0]]?.layout;

  const card = combinedBetObbTaggingMetadata[betDefinitions[0]]?.card;

  return {
    legTypeDescription: i18n.t(`I18N.OBB.BETTYPE.${expressionTemplateId}`),
    legDescription: `${i18n.t("I18N.BETSLIP.OBB.X_OF_N.SELECTIONS_TO_WIN", {
      x: leg.expressionParams?.x,
      n: betDefinitions.length,
    })}: ${legDescription}`,
    participantsDescription,
    outcomeDescription,
    obbBettingLegsQuotes,
    eventsNames,
    eventsIds,
    competitionIds: competitionIdDescription,
    competitionNames: competitionNameDescription,
    sportsIds,
    sportsNames,
    tabName,
    layout,
    card,
  };
}

function buildSquadVsSquadLegMetadata(leg: SelectorObbLeg): ObbLegMetadata {
  const templateParams = leg.templateParams as SelectorObbSquadVsSquadLegTemplateParams;
  const { squadAParticipantIds, squadBParticipantIds, quantifier, outcomeIds } = templateParams;

  const squadAParticipantsDescription = formatParticipants(squadAParticipantIds);

  const squadBParticipantsDescription = formatParticipants(squadBParticipantIds);

  const isGreater = quantifier === Quantifier.GREATER_THAN;
  const selectedSquadDescription = isGreater ? squadAParticipantsDescription : squadBParticipantsDescription;
  const opposingSquadDescription = isGreater ? squadBParticipantsDescription : squadAParticipantsDescription;

  const outcome = outcomeIds[0] ?? "";

  const outcomeDescription = i18n.t("I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD", {
    incidentType: outcome,
    operator: Quantifier.GREATER_THAN,
    playersName: opposingSquadDescription,
    count: 2, // to force plural translation
  });

  return {
    legTypeDescription: i18n.t(`I18N.OBB.OUTCOME.INCIDENT.${outcome}`),
    legDescription: `${selectedSquadDescription} ${outcomeDescription}`,
    participantsDescription: selectedSquadDescription,
    outcomeDescription,
  };
}

function buildPvpLegParams(leg: SelectorObbLeg): ObbPvpLegParams {
  const templateParams = leg.templateParams as SelectorObbPvpLegTemplateParams;

  const { outcomeId, timePeriodId, participantIdA, participantIdB } = templateParams;

  return {
    outcomeId,
    timePeriodId,
    participantIdA: participantIdA?.player?.id || "",
    participantIdB: participantIdB?.player?.id || "",
  };
}

function buildSquadBetLegParams(leg: SelectorObbLeg): ObbSquadBetLegParams {
  const templateParams = leg.templateParams as SelectorObbSquadBetLegTemplateParams;

  const { outcomeIds, timePeriodId, participantIds, value, quantifier } = templateParams;

  return {
    outcomeIds,
    timePeriodId,
    participantIds: participantIds.map((participant) => participant.player?.id || ""),
    value,
    quantifier,
  };
}

function buildXOfNLegParams(leg: CombinedBetLegsDefinitionResult): ObbXOfNLegParams {
  const { expressionParams, baseExpressionTemplateDefinitions } = leg;

  // Since the bff response comes with __typename, we need to filter it out
  const filteredBaseExpressionTemplateDefinitions = baseExpressionTemplateDefinitions?.reduce<
    BaseExpressionTemplateDefinitions[]
  >((acc, templateDefinition) => {
    if ("__typename" in templateDefinition) {
      const { __typename, ...definition } = templateDefinition;
      acc.push(definition);
    } else {
      acc.push(templateDefinition);
    }
    return acc;
  }, []);

  const baseBets = expressionParams?.baseBets?.reduce<BaseBet[]>((acc, baseBet) => {
    if (baseBet) {
      const { templateId, params } = baseBet;

      const filteredParams: ObbLegParams = Object.fromEntries(
        Object.entries(params).filter(([key, value]) => value !== null && key !== "__typename"),
      ) as ObbLegParams;

      acc.push({ templateId, params: filteredParams });
    }
    return acc;
  }, []);

  return {
    x: expressionParams?.x || 0,
    baseExpressionTemplateDefinitions: filteredBaseExpressionTemplateDefinitions,
    baseBets,
  } as ObbXOfNLegParams;
}

function buildSquadVsSquadLegParams(leg: SelectorObbLeg): ObbSquadVsSquadBetLegParams {
  const templateParams = leg.templateParams as SelectorObbSquadVsSquadLegTemplateParams;

  const { squadAParticipantIds, squadBParticipantIds, outcomeIds, timePeriodId, quantifier } = templateParams;
  return {
    outcomeIds,
    timePeriodId,
    squadAParticipantIds: squadAParticipantIds.map((participant) => participant.player?.id || ""),
    squadBParticipantIds: squadBParticipantIds.map((participant) => participant.player?.id || ""),
    quantifier,
  };
}

const legMetadataBuilder = {
  [ObbLegTemplateIds.PLAYER_VS_PLAYER]: buildPvpLegMetadata,
  [ObbLegTemplateIds.PARTICIPANTS_COMBINED]: buildParticipantsCombinedLegMetadata,
  [ObbLegTemplateIds.X_OF_N]: buildXOfNLegMetadata,
  [ObbLegTemplateIds.SQUAD_VS_SQUAD]: buildSquadVsSquadLegMetadata,
};

const legParamsBuilder = {
  [ObbLegTemplateIds.PLAYER_VS_PLAYER]: buildPvpLegParams,
  [ObbLegTemplateIds.X_OF_N]: buildXOfNLegParams,
  [ObbLegTemplateIds.PARTICIPANTS_COMBINED]: buildSquadBetLegParams,
  [ObbLegTemplateIds.SQUAD_VS_SQUAD]: buildSquadVsSquadLegParams,
};

function addLeg(obbBettingState: ObbBettingState, obbLeg: SelectorObbLeg): ObbBettingState {
  if (!obbLeg.quote || "errorCode" in obbLeg.quote) {
    return obbBettingState;
  }

  const { legs, potentialBets } = obbBettingState;
  const { templateId, id: legId, quote, event } = obbLeg;

  if (!("price" in quote)) {
    return obbBettingState;
  }

  const {
    price: {
      fractional: { numerator, denominator },
      decimal,
    },
  } = quote;

  const { urn, name, eventId } = event;

  const newLeg: ObbLeg = {
    id: legId,
    templateId,
    event: { urn, name, eventId },
    quote: { price: { decimal, fractional: { numerator, denominator } } },
    metadata: legMetadataBuilder[templateId](obbLeg),
    params: legParamsBuilder[templateId](obbLeg),
  };

  const potentialBetId = `SINGLE:[${legId}]`;

  const newPotentialBet: ObbPotentialBet = {
    id: potentialBetId,
    betType: BetType.SGL,
    legs: [legId],
    stake: null,
    potentialReturns: null,
    quote: {
      price: {
        fractional: { numerator, denominator },
        decimal,
      },
    },
    maxStake: null,
    minStake: null,
    maxPayout: null,
    minStakeIncrement: null,
  };

  const newObbBettingState = {
    ...obbBettingState,
    legs: { ...legs, [legId]: newLeg },
    potentialBets: { ...potentialBets, [potentialBetId]: newPotentialBet },
  };

  return newObbBettingState;
}

function createCombinedLegs(
  legs: ObbLegMap,
  combinedBetDefinition: CombinedBetDefinitionResult,
  combinedBetObbTaggingMetadata: { [leg: string]: ObbLegTaggingMetadata | null },
): ObbLegMap {
  const { details } = combinedBetDefinition;
  return combinedBetDefinition.legs.reduce<ObbLegMap>((acc, combinedLeg) => {
    const { expressionTemplateId, betDefinitions } = combinedLeg;

    const params = expressionTemplateId === "xOfN" && legParamsBuilder[expressionTemplateId](combinedLeg);
    const metadata =
      expressionTemplateId === "xOfN" &&
      legMetadataBuilder[expressionTemplateId](combinedLeg, legs, combinedBetObbTaggingMetadata);

    if (params && metadata) {
      const { event } = legs[betDefinitions[0]];

      const legId = hashObjectFnv1a({
        templateId: expressionTemplateId,
        event,
        params,
      });

      const quote = details?.price && {
        price: {
          decimal: details.price.decimal,
          fractional: {
            numerator: details.price.fractional.numerator,
            denominator: details.price.fractional.denominator,
          },
        },
      };

      acc[legId] = {
        id: legId,
        event,
        templateId: expressionTemplateId,
        quote,
        metadata,
        params,
      };
    }

    return acc;
  }, {});
}

function createCombinedPotentialBet(
  combinedLegs: ObbLegMap,
  combinedBetDefinition: CombinedBetDefinitionResult,
  potentialBets: ObbPotentialBetMap,
): ObbPotentialBetMap {
  const { details } = combinedBetDefinition;

  const legIds = Object.keys(combinedLegs);
  const potentialBetId = `SINGLE:[${legIds.join(",")}]`;

  const stake = potentialBets[potentialBetId]?.stake || null;
  const potentialReturns = potentialBets[potentialBetId]?.potentialReturns || null;

  const quote = details?.price && {
    price: {
      decimal: details.price.decimal,
      fractional: {
        numerator: details.price.fractional.numerator,
        denominator: details.price.fractional.denominator,
      },
    },
  };

  return {
    [potentialBetId]: {
      id: potentialBetId,
      betType: BetType.SGL,
      legs: legIds,
      stake,
      potentialReturns,
      quote,
      maxStake: details?.maxStake ?? null,
      minStake: details?.minStake ?? null,
      maxPayout: details?.maxPayout ?? null,
      minStakeIncrement: details?.minStakeIncrement ?? null,
    },
  };
}

function updatePotentialBetsQuotes(
  legsQuotes: BetslipObbQuotes,
  potentialBets: ObbPotentialBetMap,
): ObbPotentialBetMap {
  return legsQuotes.reduce((acc, legQuote) => {
    const { id: legId, price, result } = legQuote;

    if (!price || result.resultCode !== "SUCCESS") {
      return acc;
    }

    const potentialBetId = Object.keys(potentialBets).find(
      (id) => potentialBets[id].betType === BetType.SGL && potentialBets[id].legs.includes(legId),
    );

    if (!potentialBetId) {
      return acc;
    }

    const {
      decimal,
      fractional: { numerator, denominator },
    } = price;

    const currentPotentialBet = acc[potentialBetId];

    acc[potentialBetId] = {
      ...currentPotentialBet,
      quote: { price: { decimal, fractional: { numerator, denominator } } },
    };

    return acc;
  }, potentialBets);
}

function updateLegsQuotes(legsQuotes: BetslipObbQuotes, legs: ObbLegMap): ObbLegMap {
  return legsQuotes.reduce((acc, legQuote) => {
    const { id: legId, price, result } = legQuote;

    if (!price || result.resultCode !== "SUCCESS") {
      return acc;
    }

    const leg = legs[legId];

    if (!leg) {
      return acc;
    }

    const {
      decimal,
      fractional: { numerator, denominator },
    } = price;

    acc[legId] = {
      ...leg,
      quote: { price: { decimal, fractional: { numerator, denominator } } },
    };

    return acc;
  }, legs);
}

function shouldImplyBets(legsQuotes: BetslipObbQuotes, potentialBets: ObbPotentialBetMap): boolean {
  return legsQuotes.some(({ id: legId, price, result }) => {
    const potentialBetId = Object.keys(potentialBets).find(
      (id) => potentialBets[id].betType === BetType.SGL && potentialBets[id].legs.includes(legId),
    );

    if (!potentialBetId || !price || result.resultCode !== "SUCCESS") {
      return false;
    }

    const potentialBet = potentialBets[potentialBetId];

    const quotePrice = price.decimal;
    const betPrice = potentialBet.quote?.price.decimal;

    return (
      quotePrice !== betPrice ||
      (potentialBet.maxStake && potentialBet.minStake && potentialBet.maxPayout && potentialBet.minStakeIncrement) ===
        null
    );
  });
}

/**
 * Returns whether the daily payout limit throttle is active or not.
 *
 * @param {Throttles} throttles - The throttles state object.
 * @returns {boolean} - A boolean indicating whether the daily payout limit throttle is active or not.
 */
function isDailyPayoutLimitActive(throttles: Throttles) {
  const getThrottle = createGetThrottleSelector();
  const dailyPayoutLimitThrottle = getThrottle(throttles, "DAILY_PAYOUT_LIMIT");

  return dailyPayoutLimitThrottle?.isActive === true;
}

function getObbValidators(potentialBetId: string): Validators {
  const { BELOW_MIN_STAKE, ABOVE_MAX_STAKE, INCREMENT_OUT_OF_RANGE } = ObbValidationTypes;

  return {
    [BELOW_MIN_STAKE]: (state: ObbBettingState, validation: ObbPotentialBetsValidations) => {
      const castValidation = validation as BelowMinStakeValidation;

      return updatePotentialBetStake(state, potentialBetId, { stake: castValidation.data.min });
    },
    [ABOVE_MAX_STAKE]: (state: ObbBettingState, validation: ObbPotentialBetsValidations) => {
      const castValidation = validation as AboveMaxStakeValidation;

      return updatePotentialBetStake(state, potentialBetId, { stake: castValidation.data.max });
    },
    [INCREMENT_OUT_OF_RANGE]: (state: ObbBettingState, validation: ObbPotentialBetsValidations) => {
      const castValidation = validation as IncrementOutOfRangeValidation;

      return updatePotentialBetStake(state, potentialBetId, {
        stake: castValidation.data.closest,
      });
    },
  };
}

const isTerritoryApplicableValidation = (validationType: ObbValidationTypes, userDetails: UserDetails): boolean => {
  switch (validationType) {
    case ObbValidationTypes.ABOVE_MAX_PAYOUT:
      return !!(
        VALIDATIONS[validationType]?.ImplyBets.countries.includes(userDetails.countryCode) ||
        VALIDATIONS[validationType]?.ImplyBets.jurisdictions.includes(
          userDetails.jurisdiction.jurisdiction as Jurisdiction,
        )
      );
    default:
      return true;
  }
};

const isStakeValid = (userDetails: UserDetails, validations?: ObbPotentialBetsValidations[]): boolean => {
  if (!validations) {
    return true;
  }

  return !validations
    .filter((validation) => isTerritoryApplicableValidation(validation.type, userDetails))
    .filter((validation) =>
      "severity" in validation ? validation.severity === ObbValidationSeverities.ERROR : !!validation,
    ).length;
};

function createPotentialBetFailuresMap(
  betFailures: BetFailure[],
  errorCodesBlockList: Array<string>,
): FailuresMap["potentialBets"] {
  return betFailures.reduce((betFailuresAcc, betFailure) => {
    const { potentialBetId, betResult } = betFailure;

    if (errorCodesBlockList.includes(betResult)) {
      return betFailuresAcc;
    }

    return {
      ...betFailuresAcc,
      [potentialBetId]: betResult,
    };
  }, {});
}

function createLegsFailuresMap(betFailures: BetFailure[]): FailuresMap["legs"] {
  return betFailures.reduce((betFailuresAcc, betFailure) => {
    const { legResults } = betFailure;
    const betLegFailures = legResults.reduce((legFailuresAcc, legResult) => {
      const { id, result } = legResult;
      return {
        ...legFailuresAcc,
        [id]: result,
      };
    }, {});

    return {
      ...betFailuresAcc,
      ...betLegFailures,
    };
  }, {});
}

function mapBetFailures(obbBettingState: ObbBettingState, betResults: BetPlacementResult[]): BetFailure[] {
  return betResults.map((betResult) => {
    const { result, id } = betResult;

    // assuming that this legs array will always have only one leg
    const legId = obbBettingState.potentialBets[id].legs[0];

    return {
      potentialBetId: id,
      betResult: result.resultCode,
      legResults: result.legResults.map((legResult) => ({
        id: legId,
        result: legResult.resultCode,
      })),
    };
  });
}

function updateFailures(
  obbBettingState: ObbBettingState,
  errorCode: string,
  betResults: BetPlacementResult[],
  errorCodesBlockList: Array<string>,
): ObbBettingState {
  const betFailures = mapBetFailures(obbBettingState, betResults);
  const betslipFailure = errorCodesBlockList.includes(errorCode) ? null : errorCode;
  const potentialBetsFailures = createPotentialBetFailuresMap(betFailures, errorCodesBlockList);
  const legsFailures = createLegsFailuresMap(betFailures);

  return {
    ...obbBettingState,
    failures: {
      betslip: betslipFailure,
      potentialBets: potentialBetsFailures,
      legs: legsFailures,
    },
  };
}

function updateQuoteFailures(legsQuotes: BetslipObbQuotes): FailuresMap["legs"] {
  return legsQuotes.reduce((acc, legQuote) => {
    const { id, price, result } = legQuote;

    if (!price && !result?.resultCode) {
      return {
        ...acc,
        [id]: "REQUESTED_PRICE_NOT_AVAILABLE",
      };
    }

    if (result.resultCode !== "SUCCESS") {
      if (QUOTES_FAILURES_BLOCKLIST.includes(result.resultCode)) {
        return acc;
      }

      return {
        ...acc,
        [id]: result.resultCode,
      };
    }

    return acc;
  }, {});
}

/**
 * Clears all the place failures to an empty state
 *
 * @param obbBettingState The whole obb betting state
 * @returns The updated obb betting state
 */
function clearPlaceFailures(obbBetting: ObbBettingState): ObbBettingState {
  return {
    ...obbBetting,
    failures: {
      betslip: null,
      potentialBets: {},
      legs: {},
    },
  };
}

function hasAnyObbSuspendedFailure(failures: FailuresMap["legs"], legsIds: string[]): boolean {
  return legsIds.some((legId) => failures[legId] && SUSPENDED_FAILURE_CODES.includes(failures[legId]));
}

function hasSpecialValidation(
  validationType: ObbValidationTypes,
  userDetails: UserDetails,
  hasAboveMaxStakeValidation: boolean,
): boolean {
  switch (validationType) {
    case ObbValidationTypes.ABOVE_MAX_PAYOUT:
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
}

function getAllUniquePotentialBetFailures(failures: FailuresMap["potentialBets"]): string[] {
  return [...new Set(Object.values(failures))];
}

function getAllUniqueLegFailures(failures: FailuresMap["legs"]): string[] {
  return [...new Set(Object.values(failures))];
}

function getObbErrorCode({
  betslipFailure,
  uniquePotentialBetFailures,
  uniqueLegFailures,
}: {
  betslipFailure: string | null;
  uniquePotentialBetFailures: string[];
  uniqueLegFailures: string[];
}): string[] | null {
  if (uniqueLegFailures.length) {
    return uniqueLegFailures;
  }

  if (uniquePotentialBetFailures.length) {
    return uniquePotentialBetFailures;
  }

  return betslipFailure ? [betslipFailure] : null;
}

const getObbFailureError = (state: ObbBettingState): string | null => {
  const potentialBetsFailures = Object.fromEntries(
    Object.entries(state.failures.potentialBets).filter(
      ([, failure]) => !BET_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(failure),
    ),
  );

  const legFailures = Object.fromEntries(
    Object.entries(state.failures.legs).filter(([, failure]) => !LEG_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(failure)),
  );

  const betslipFailure =
    state.failures.betslip && !BETSLIP_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(state.failures.betslip)
      ? state.failures.betslip
      : null;

  const errorCodes = getObbErrorCode({
    betslipFailure,
    uniquePotentialBetFailures: getAllUniquePotentialBetFailures(potentialBetsFailures),
    uniqueLegFailures: getAllUniqueLegFailures(legFailures),
  });

  if (!errorCodes) {
    return null;
  }
  return errorCodes[0] || null;
};

function mapObbBettingLegsByEvent(obbBettingLegs: ObbLegMap): Record<string, ObbLeg[]> {
  return Object.keys(obbBettingLegs).reduce<Record<string, ObbLeg[]>>((acc, legId) => {
    const leg = obbBettingLegs[legId];

    const { eventId } = leg.event;

    const eventIdString = eventId.toString();

    if (!acc[eventIdString]) {
      acc[eventIdString] = [];
    }

    acc[eventIdString].push(leg);
    return acc;
  }, {});
}

function buildBetslipQuoteInputLegs(legsToQuote: ObbLeg[]): ToQuote[] {
  return legsToQuote.reduce<ToQuote[]>((acc, leg) => {
    if (Object.values(ObbLegTemplateIds).includes(leg.templateId as ObbLegTemplateIds)) {
      const { params, templateId, id } = leg;

      const baseExpressionTemplateDefinitions =
        "baseExpressionTemplateDefinitions" in params
          ? (params.baseExpressionTemplateDefinitions as BaseExpressionTemplateDefinitions[])
          : null;

      const expressionParams =
        "x" in params ? { x: params.x, baseBets: params.baseBets } : (params as ExpressionParamsInput);

      acc.push({
        id,
        expressionTemplateId: templateId,
        expressionParams,
        baseExpressionTemplateDefinitions,
      } as ToQuote);
    }
    return acc;
  }, []);
}

function buildObbReportBet(result: BetPlacementResult, obbBettingState: ObbBettingState): BetslipObbReportBet | null {
  const { betDetails, id: potentialBetId } = result;

  const {
    id: betId,
    receiptId,
    price: betPrice,
    potentialPayout,
    stake,
    stakePerLine,
    betType,
    currency,
  } = betDetails as BetDetails;

  const [legId] = obbBettingState.potentialBets[potentialBetId].legs;

  const { metadata, event, quote, params } = obbBettingState.legs[legId];

  if (!quote) {
    return null;
  }

  const reportLeg = {
    legId: legId,
    event,
    metadata,
    price: quote.price,
  };

  return {
    betId,
    currency,
    receiptId,
    price: betPrice,
    potentialPayout: potentialPayout ?? 0,
    stake,
    betType,
    legs: [reportLeg],
    stakePerLine,
    numberOfBaseBets: "baseBets" in params ? params.baseBets.length : 1,
    selectionsToWin: "baseBets" in params ? params.x : undefined,
  };
}

function buildObbReport(result: BetslipObbPlaceBetResponseData, obbBettingState: ObbBettingState): BetslipObbReport {
  const bets = result.betPlacementsResult
    .map((betPlacementResult) => buildObbReportBet(betPlacementResult, obbBettingState))
    .filter((bet): bet is BetslipObbReportBet => bet !== null)
    .reduce((acc: BetslipObbReportBetMap, bet) => {
      acc[bet.betId] = bet;
      return acc;
    }, {});

  return { bets };
}

function buildRequestInputBet(
  id: string,
  betType: string,
  betPrice: ObbPrice,
  potentialBetLegs: string[],
  legs: ObbLegMap,
  stake: number,
): PlaceBetDefinitionInput | null {
  if (
    potentialBetLegs.some(
      (legId) => !Object.values(ObbLegTemplateIds).includes(legs[legId].templateId as ObbLegTemplateIds),
    )
  ) {
    return null;
  }

  return {
    id,
    betType,
    expectedPrice: betPrice.fractional,
    stakePerLine: stake,
    outcomeBasedLegDefinitions: potentialBetLegs.reduce<OutcomeBasedLegDefinition[]>((acc, potentialBetLegId) => {
      const { metadata, params, templateId, quote, event } = legs[potentialBetLegId];

      if (!quote) return acc;

      const { fractional } = quote.price;
      const expressionParams =
        "x" in params
          ? ({ x: params.x, baseBets: params.baseBets } as ExpressionParamsInput)
          : (params as ExpressionParamsInput);

      acc.push({
        expectedPrice: fractional,
        legDescription: metadata.legDescription,
        templateName: metadata.legTypeDescription,
        expressionTemplateId: templateId,
        baseExpressionTemplateDefinitions:
          "baseExpressionTemplateDefinitions" in params
            ? (params.baseExpressionTemplateDefinitions as BaseExpressionTemplateDefinitions[])
            : null,
        expressionParams,
        eventId: {
          id: event.eventId.toString(),
          supplier: "SPORTEX" as Supplier,
        },
      });

      return acc;
    }, []),
  };
}

function checkIfQuotesShouldBeUpdated(betPlacementsResult: CatalogBetPlacementDetails[]): boolean {
  return betPlacementsResult.some(
    (potentialBet) =>
      ERRORS_TRIGGERING_QUOTES_UPDATE.includes(potentialBet.result.resultCode) ||
      potentialBet.result.legResults.some((legResult) =>
        ERRORS_TRIGGERING_QUOTES_UPDATE.includes(legResult.resultCode),
      ),
  );
}

function hasReachedLegLimit(obbBetting: ObbBettingState, legsNumber: number): boolean {
  const numberOfPrimeLegs = Object.keys(obbBetting.legs).filter(
    (legId) => !("baseBets" in obbBetting.legs[legId].params),
  ).length;

  return numberOfPrimeLegs + legsNumber > OBB_MAX_LEGS;
}

function updateLegQuoteImply(baseLeg: ObbLeg, betDefinition: BetDefinitionResult): ObbLegMap {
  const { id: legId, details } = betDefinition;

  if (!details) {
    return {};
  }

  const { metadata, params, event, templateId } = baseLeg;

  const {
    decimal,
    fractional: { numerator, denominator },
  } = details.price;

  const quote = { price: { decimal, fractional: { numerator, denominator } } };

  return {
    [legId]: {
      id: legId,
      quote,
      metadata,
      params,
      event,
      templateId,
    },
  };
}

function updatePotentialBetDetailsImply(
  basePotentialBet: ObbPotentialBet,
  betDefinition: BetDefinitionResult,
): ObbPotentialBetMap {
  const { details } = betDefinition;

  if (!details) {
    return {};
  }

  const { price, maxStake, minStake, maxPayout, minStakeIncrement } = details;

  const {
    decimal,
    fractional: { numerator, denominator },
  } = price;

  const quote = { price: { decimal, fractional: { numerator, denominator } } };

  return {
    [basePotentialBet.id]: {
      quote,
      id: basePotentialBet.id,
      betType: basePotentialBet.betType,
      legs: basePotentialBet.legs,
      stake: basePotentialBet.stake,
      potentialReturns: basePotentialBet.potentialReturns,
      maxStake,
      minStake,
      maxPayout,
      minStakeIncrement,
    },
  };
}

function updateImplyLegFailure(
  legs: ObbLegMap,
  betDefinition: BetDefinitionResult,
  failuresBlockList: string[],
): FailuresMap["legs"] {
  const { id: legId, result } = betDefinition;

  if (!legs[legId] || failuresBlockList.includes(result.resultCode)) {
    return {};
  }

  return {
    [legId]: result.resultCode,
  };
}

function updateCombinedPotentialBetFailuresImply(
  combinedPotentialBet: ObbPotentialBetMap,
  combinedBetDefinition: CombinedBetDefinitionResult,
  failuresBlockList: string[],
): FailuresMap["potentialBets"] {
  const { result } = combinedBetDefinition;

  const potentialBetId = Object.values(combinedPotentialBet)[0].id;

  if (failuresBlockList.includes(result.resultCode)) {
    return {};
  }

  return {
    [potentialBetId]: result.resultCode,
  };
}

function updateCombinedLegsFailuresImply(
  combinedLegs: ObbLegMap,
  combinedBetDefinition: CombinedBetDefinitionResult,
  stateLegs: ObbLegMap,
  failuresBlockList: string[],
): FailuresMap["legs"] {
  const { legs } = combinedBetDefinition;

  return legs.reduce<FailuresMap["legs"]>((acc, combinedLeg) => {
    const { expressionTemplateId, betDefinitions, result } = combinedLeg;

    if (failuresBlockList.includes(result.resultCode)) {
      return acc;
    }

    const { event } = stateLegs[betDefinitions[0]];

    const params = expressionTemplateId === "xOfN" && legParamsBuilder[expressionTemplateId](combinedLeg);

    if (params) {
      const legId = hashObjectFnv1a({
        templateId: expressionTemplateId,
        event,
        params,
      });

      if (combinedLegs[legId]) {
        acc[legId] = result.resultCode;
      }
    }

    return acc;
  }, {});
}

export {
  updatePotentialBetStake,
  transferPotentialBetStake,
  removeLeg,
  addLeg,
  isDailyPayoutLimitActive,
  shouldImplyBets,
  updatePotentialBetsQuotes,
  getObbValidators,
  isTerritoryApplicableValidation,
  isStakeValid,
  verify,
  updateFailures,
  updateQuoteFailures,
  clearPlaceFailures,
  hasAnyObbSuspendedFailure,
  hasSpecialValidation,
  getAllUniquePotentialBetFailures,
  getAllUniqueLegFailures,
  getObbErrorCode,
  updateLegsQuotes,
  getObbFailureError,
  mapObbBettingLegsByEvent,
  buildBetslipQuoteInputLegs,
  buildObbReport,
  buildRequestInputBet,
  checkIfQuotesShouldBeUpdated,
  hasReachedLegLimit,
  createCombinedLegs,
  createCombinedPotentialBet,
  updateImplyLegFailure,
  updateLegQuoteImply,
  updatePotentialBetDetailsImply,
  updateCombinedPotentialBetFailuresImply,
  updateCombinedLegsFailuresImply,
};
