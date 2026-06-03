import { createSelector, Selector } from "reselect";

import { PlaceResult } from "@ppb/betslip-core";

import { SizeValidation, PriceValidation } from "../entities";
import { ApplicationState } from "../ApplicationState.types";
import { getSportsbookBettingState } from "../betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUnmatchedBets } from "../betting/exchange-betting/exchange-betting-selectors";
import { createExcRunnerPotentialBetsByRunnerURNSelector } from "../entities/entities-selectors";
import { getExchangeOrder } from "../betting/exchange-orders/exchange-order-selectors";
import { BettingGroup } from "../betting/sportsbook-betting/SportsbookBetting.types";
import { PersistenceType } from "../betting/exchange-orders/ExchangeOrder.types";
import URN from "../layout/URN";
import { ExchangeSide } from "../betting/exchange-bets/ExchangeBet.types";
import { createShallowEqualSelector } from "../../helpers/selectors";
import { isBetBuilder } from "../../helpers/sportsbook-betting";

import {
  BetslipCastContext,
  BetslipExchangeContext,
  BetslipExchangeEdit,
  BetslipState,
  BetslipStep,
  BetslipSportsbookConfirmationBet,
  BetslipSportsbookReport,
  PlacedBetValues,
  OrderEdit,
  BetslipObbReport,
  RequestStatus,
} from "./Betslip.types";

export const getBetslipCard = (appState: ApplicationState): BetslipState | undefined => appState.betslip;

export const getCurrentMultipleContext = (appState: ApplicationState): string | undefined =>
  appState.betslip?.sportsbookMultipleContext;

export const getBetslipExchangeContext = (appState: ApplicationState): BetslipExchangeContext | undefined =>
  appState.betslip?.exchangeContext;

export const getBetslipExchangeEdit = (appState: ApplicationState): BetslipExchangeEdit | undefined =>
  appState.betslip?.exchangeEdit;

export const getBetslipExchangeReportUnmatched = (appState: ApplicationState): PlacedBetValues | undefined =>
  appState.betslip?.exchangeReport?.unmatched;

export const getSportsbookConfirmation = (appState: ApplicationState): BetslipSportsbookConfirmationBet | undefined =>
  appState.betslip?.sportsbookConfirmation;

export const getSportsbookConfirmationCombinations = (
  appState: ApplicationState,
): BetslipSportsbookConfirmationBet["combinations"] => getSportsbookConfirmation(appState)?.combinations || {};

export const getSportsbookConfirmationIgnoredBets = (
  appState: ApplicationState,
): BetslipSportsbookConfirmationBet["ignoredBets"] => getSportsbookConfirmation(appState)?.ignoredBets || [];

export const getSportsbookConfirmationAvailability = (
  appState: ApplicationState,
): BetslipSportsbookConfirmationBet["availabilityChanged"] =>
  getSportsbookConfirmation(appState)?.availabilityChanged || false;

export const getSportsbookConfirmationFailures = (
  appState: ApplicationState,
): BetslipSportsbookConfirmationBet["failures"] => getSportsbookConfirmation(appState)?.failures || {};

export const getSportsbookConfirmationLegs = (appState: ApplicationState): BetslipSportsbookConfirmationBet["legs"] =>
  getSportsbookConfirmation(appState)?.legs || {};

export const getSportsbookConfirmationRunners = (
  appState: ApplicationState,
): BetslipSportsbookConfirmationBet["runners"] => getSportsbookConfirmation(appState)?.runners || {};

export const getSportsbookPlacedCombinations = (
  appState: ApplicationState,
): PlaceResult.PlacedCombinationsMap | undefined => appState.betslip?.sportsbookReport?.result?.combinations;

export const getSportsbookReport = (appState: ApplicationState): BetslipSportsbookReport | undefined =>
  appState.betslip?.sportsbookReport;

export const getObbReport = (appState: ApplicationState): BetslipObbReport | undefined => appState.betslip?.obbReport;

export const getBetslipStep = (appState: ApplicationState): BetslipStep | undefined => appState.betslip?.step;

export const getBetslipPlaceStatus = (appState: ApplicationState): RequestStatus | undefined =>
  appState.betslip?.placeStatus;

export const getBetslipGroup = (appState: ApplicationState): BettingGroup | undefined => appState.betslip?.group;

export const getLastSuccessfulStake = (appState: ApplicationState): number | undefined =>
  appState.betslip?.lastSuccessfulStake;

export const getIsFreeBetsSelected = (appState: ApplicationState): boolean => !!appState.betslip?.isFreeBetsSelected;

export const getSportsbookPlacedCombination = (
  report: BetslipSportsbookReport | undefined,
  combinationId: string,
): PlaceResult.PlacedCombination | undefined => report?.result.combinations[combinationId];

/**
 * Selector to get the betslip visibility (opened or closed)
 *
 * @param state Application state
 * @returns {boolean} `true` if opened, `false` if closed
 */
export const getBetslipVisibilityState = (state: ApplicationState): boolean => {
  const { combinations } = getSportsbookBettingState(state);
  const betslipExchangeContext = getBetslipExchangeContext(state);
  let potentialBet;

  if (betslipExchangeContext) {
    [potentialBet] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, betslipExchangeContext.runner);
  }

  return !(!potentialBet && !Object.values(combinations).length);
};

export const getCastContext = (betslip: BetslipState): BetslipCastContext | undefined => betslip.sportsbookCastContext;

export const getSportsbookConfirmationCastContext = (appState: ApplicationState): BetslipCastContext | undefined =>
  getSportsbookConfirmation(appState)?.castContext;

function isEditStateValid(order: OrderEdit | undefined): boolean {
  if (order === undefined) {
    return true;
  }

  if (order.validations.price || order.validations.size) {
    return false;
  }

  return order.price !== null && order.size !== null;
}

const getDisplayValue = (current: undefined | number | null, initial: number): number | undefined => {
  if (current === undefined) {
    return initial;
  }
  const currentOrEmpty = current ?? undefined;
  return currentOrEmpty;
};

export type EditingBetState = {
  price?: number;
  originalPrice?: number;
  size?: number;
  originalSize?: number;
  side: ExchangeSide;
  profit?: number;
  liability?: number;
  payout?: number;
  persistenceType: PersistenceType;
  isValid: boolean;
  priceValidation?: PriceValidation;
  sizeValidation?: SizeValidation;
  hasPriceChanged: boolean;
  hasSizeChanged: boolean;
  hasPersistenceTypeChanged: boolean;
};

export const getEditingBetState = (state: ApplicationState, market: URN): EditingBetState | null => {
  const edit = getBetslipExchangeEdit(state);
  if (!edit) {
    return null;
  }

  const { betId, order: orderEdit } = edit;

  const [unmatchedBet] = getUnmatchedBets(state, market, [betId]);
  const order = getExchangeOrder(state, market, betId);

  if (!unmatchedBet || !order) {
    return null;
  }

  const isValid = isEditStateValid(orderEdit);

  const originalPrice = order.price;
  const originalSize = unmatchedBet.size;
  const originalPersistence = order.persistenceType;

  const price = getDisplayValue(orderEdit?.price, originalPrice);
  const size = getDisplayValue(orderEdit?.size, originalSize);
  const persistenceType = orderEdit?.persistenceType || originalPersistence;

  const profit = isValid ? unmatchedBet.profit : undefined;
  const liability = isValid ? unmatchedBet.liability : undefined;
  const payout = isValid ? unmatchedBet.payout : undefined;

  return {
    price,
    originalPrice,
    size,
    originalSize,
    side: order.side,
    persistenceType,
    profit,
    liability,
    payout,
    isValid,
    priceValidation: orderEdit?.validations.price?.data || undefined,
    sizeValidation: orderEdit?.validations.size?.data || undefined,
    hasPriceChanged: price !== originalPrice,
    hasSizeChanged: size !== originalSize,
    hasPersistenceTypeChanged: persistenceType !== originalPersistence,
  };
};

export const createGetBetBuilderConfirmationCombinationIdsSelector = (): Selector<ApplicationState, string[]> =>
  createShallowEqualSelector(
    createSelector([getSportsbookConfirmationCombinations], (combinations) =>
      Object.values(combinations)
        .filter((combination) => isBetBuilder(combination))
        .map(({ id }) => id),
    ),
    (combinationIds: string[]) => combinationIds,
  );
