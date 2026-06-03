import { EntityType } from "@ppb/tbd-urn-codecs";
import {
  CashoutBaseEvents,
  ExcCashoutEvent,
  SbkCashoutEvent,
  ExcMarketCashoutEvents,
} from "../../state/tagging/Interface.types";

import URN from "../../state/layout/URN";
import { ApplicationState } from "../../state/ApplicationState.types";
import { BetTypeGroup, CashoutType, TaggingAction, TaggingCategory, YesNo } from "./AnalyticsConstants";
import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createSportsbookCashoutQuoteSelector } from "../../state/betting/sportsbook-cashouts/sportsbook-cashout-selectors";
import { createExchangeCashoutQuoteSelector } from "../../state/betting/exchange-cashouts/exchange-cashout-selectors";
import { createSportsbookBetSelector } from "../../state/betting/sportsbook-bets/sportsbook-bets-selectors";
import { createExchangeMarketBetSelector } from "../../state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { isRaceHierarchy } from "../../helpers/markets";
import { createCardGroupByURNSelector } from "../../state/layout/cardgroups/cardgroups-selectors";
import { BetCardGroups } from "../../state/layout/cardgroups/CardGroup.types";
import { SportsbookCashoutQuote } from "../../state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import { BetType, CashoutStep } from "../../state/constants";

const getExchangeMarketByURN = createExchangeMarketSelector();
const getBetCardGroupByURN = createCardGroupByURNSelector<BetCardGroups, URN>();
const getExchangeMarketBetByURN = createExchangeMarketBetSelector();
const getExchangeCashoutQuoteByURN = createExchangeCashoutQuoteSelector();
const getSportsbookCashoutQuoteByURN = createSportsbookCashoutQuoteSelector();

const getCashoutBaseDimensions = (
  action: TaggingAction,
  viewTypename: string,
  errorCode?: string,
): CashoutBaseEvents => ({
  event: "ga_event",
  category: TaggingCategory.CASHOUT,
  action,
  label: errorCode || action,
  [APPLICATION.MODULE]: viewTypename,
  [BUSINESS.CASHOUT_INDICATOR]: YesNo.Yes,
});

const getCashoutSbkDimensions = (
  state: ApplicationState,
  sbkQuote: SportsbookCashoutQuote,
  action?: TaggingAction,
  errorCode?: string,
): SbkCashoutEvent | null => {
  const getSportsbookBetByURN = createSportsbookBetSelector();
  const bet = getSportsbookBetByURN(state.betting.sportsbookbets, sbkQuote.betUrn);
  if (!bet) {
    return null;
  }

  const taggingAction =
    action ||
    (sbkQuote.step === CashoutStep.CONFIRM ? TaggingAction.CONFIRMED_CASHOUT : TaggingAction.ATTEMPTED_CASHOUT);

  const baseDimensions = getCashoutBaseDimensions(taggingAction, "my bets", errorCode);

  return {
    ...baseDimensions,
    [BUSINESS.BET_ID]: bet.betId,
    [BUSINESS.BET_RECEIPT]: bet.betReceiptId,
    [BUSINESS.BET_TYPE]: bet.betType,
    [BUSINESS.BET_TYPE_GROUP]: bet.betType === BetType.SGL ? BetTypeGroup.Single : BetTypeGroup.Multiple,
    [BUSINESS.CASHOUT_TYPE]: CashoutType.Full, // Until we don't have partial or auto cashout this should be used with full
    [BUSINESS.STAKE_AMOUNT]: sbkQuote.stake,
    [BUSINESS.NUMBER_OF_LEGS]: bet.legs.length,
    [BUSINESS.NUMBER_OF_SELECTIONS]: bet.numLines,
    [BUSINESS.CASHOUT_AMOUNT]: sbkQuote.quote,
  };
};

const getCashoutExcMarketDimensions = (state: ApplicationState, marketURN: string): ExcMarketCashoutEvents | null => {
  const excMarket = getExchangeMarketByURN(state.entities.exchangemarkets, marketURN);
  if (!excMarket || !excMarket.marketId) {
    return null;
  }

  if (isRaceHierarchy(excMarket.hierarchy)) {
    const race = state.entities.races[excMarket.hierarchy.race];
    return {
      [BUSINESS.MARKET_ID]: excMarket.marketId,
      [BUSINESS.MARKET_NAME]: excMarket.name,
      [BUSINESS.EVENT_ID]: race.raceId,
      [BUSINESS.EVENT_NAME]: race.name,
    };
  }

  return {
    [BUSINESS.MARKET_ID]: excMarket.marketId,
    [BUSINESS.MARKET_NAME]: excMarket.name,
    [BUSINESS.EVENT_ID]: String(state.entities.sportevents[excMarket.hierarchy.sportevent].eventId),
    [BUSINESS.EVENT_NAME]: state.entities.sportevents[excMarket.hierarchy.sportevent].name,
  };
};

const getCashoutMyBetsExcDimensions = (
  state: ApplicationState,
  marketBetURN: string,
): ExcMarketCashoutEvents | null => {
  const excMarketBet = getExchangeMarketBetByURN(state, marketBetURN);

  if (!excMarketBet || !excMarketBet.betCardGroupURN) {
    return null;
  }

  const betCardGroup = getBetCardGroupByURN(state.layouts.cardgroups.betcardgroups, excMarketBet.betCardGroupURN);

  if (!betCardGroup) {
    return null;
  }

  return {
    [BUSINESS.MARKET_ID]: excMarketBet.marketId,
    [BUSINESS.MARKET_NAME]: excMarketBet.description || null,
    [BUSINESS.EVENT_ID]: betCardGroup.aggregatorId || "",
    [BUSINESS.EVENT_NAME]: betCardGroup.aggregatorDesc || "",
  };
};

const getCashoutEvent = (
  state: ApplicationState,
  cashoutUrn: string | undefined,
  action?: TaggingAction,
  errorCode?: string,
): SbkCashoutEvent | ExcCashoutEvent | null => {
  if (!cashoutUrn) {
    return null;
  }

  /**
   * Sportsbook cashout
   */
  const sbkQuote = getSportsbookCashoutQuoteByURN(state.betting.sportsbookcashouts, cashoutUrn);

  if (sbkQuote) {
    return getCashoutSbkDimensions(state, sbkQuote, action, errorCode);
  }

  /**
   * Exchange cashout
   */
  const {
    layouts: { views },
    router,
  } = state;

  const viewUrn = router.currentUrn;
  if (!viewUrn) {
    return null;
  }

  const view = getViewbyURN(views, viewUrn);
  if (!view) {
    return null;
  }

  const quote = getExchangeCashoutQuoteByURN(state.betting.exchangecashouts, cashoutUrn);
  if (!quote) {
    return null;
  }

  const taggingAction =
    action || (quote.step === CashoutStep.CONFIRM ? TaggingAction.CONFIRMED_CASHOUT : TaggingAction.ATTEMPTED_CASHOUT);

  let taggingViewTypename: string;

  const isMarketView = state.router.currentView === EntityType.MarketView;

  let exchangeMarkerDimensions: ExcMarketCashoutEvents | null;

  // Check if the user are on marketView or my bets
  if (isMarketView) {
    taggingViewTypename = "market view - cashout";
    exchangeMarkerDimensions = getCashoutExcMarketDimensions(state, quote.marketURN);
  } else {
    taggingViewTypename = "my bets";
    exchangeMarkerDimensions = getCashoutMyBetsExcDimensions(state, quote.marketBetURN);
  }

  if (!exchangeMarkerDimensions) {
    return null;
  }

  const baseDimensions = getCashoutBaseDimensions(taggingAction, taggingViewTypename, errorCode);

  return {
    ...baseDimensions,
    [BUSINESS.CASHOUT_TYPE]: CashoutType.Full, // Until we don't have partial or auto cashout this should be used with full
    [BUSINESS.CASHOUT_AMOUNT]: quote.value,
    [BUSINESS.CASHOUT_PROFIT_AMOUNT]: quote.profit,
    ...exchangeMarkerDimensions,
  };
};

export const getCashoutClickEvent = (
  state: ApplicationState,
  cashoutUrn: string,
): SbkCashoutEvent | ExcCashoutEvent | null => getCashoutEvent(state, cashoutUrn);

export const getAutoConfirmCashoutClickEvent = (
  state: ApplicationState,
  cashoutUrn: string,
): SbkCashoutEvent | ExcCashoutEvent | null => getCashoutEvent(state, cashoutUrn, TaggingAction.AUTO_CONFIRMED_CASHOUT);

export const getCashoutSuccessEvent = (
  state: ApplicationState,
  entityURN: string | undefined,
): SbkCashoutEvent | ExcCashoutEvent | null => getCashoutEvent(state, entityURN, TaggingAction.SUCCEEDED_CASHOUT);

export const getCashoutFailureEvent = (
  state: ApplicationState,
  entityURN: string | undefined,
  errorCode: string,
): SbkCashoutEvent | ExcCashoutEvent | null =>
  getCashoutEvent(state, entityURN, TaggingAction.FAILED_CASHOUT, errorCode);
