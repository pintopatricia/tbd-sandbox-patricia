import { MyBetsEvent, buildMyBetsEvent } from "tagging-library";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { ApplicationState } from "../../state/ApplicationState.types";
import { CashoutType } from "../../state/tagging/AnalyticsConstants";
import { createSportsbookCashoutQuoteSelector } from "../../state/betting/sportsbook-cashouts/sportsbook-cashout-selectors";
import { createSportsbookBetSelector } from "../../state/betting/sportsbook-bets/sportsbook-bets-selectors";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createExchangeCashoutQuoteSelector } from "../../state/betting/exchange-cashouts/exchange-cashout-selectors";
import { SportsbookCashoutQuote } from "../../state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import {
  CashoutButtonTapAction,
  CashoutButtonTapActionAutoConfirm,
  TakeCashoutFailureAction,
  TakeCashoutFailureSbkAction,
  TakeCashoutSuccessAction,
} from "../../actions/cashout";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { CashoutStep } from "../../state/constants";

const getExchangeCashoutQuoteByURN = createExchangeCashoutQuoteSelector();
const getSportsbookCashoutQuoteByURN = createSportsbookCashoutQuoteSelector();

const getCashoutSbkDimensions = (
  state: ApplicationState,
  sbkQuote: SportsbookCashoutQuote,
  action?: TaggingAction,
): MyBetsEvent | null => {
  const getSportsbookBetByURN = createSportsbookBetSelector();
  const bet = getSportsbookBetByURN(state.betting.sportsbookbets, sbkQuote.betUrn);
  if (!bet) {
    return null;
  }

  const taggingAction =
    action ||
    (sbkQuote.step === CashoutStep.CONFIRM ? TaggingAction.CONFIRMED_CASHOUT : TaggingAction.ATTEMPTED_CASHOUT);

  return buildMyBetsEvent({
    cashoutType: CashoutType.Full, // Until we don't have partial or auto cashout this should be used with full
    cashoutPosition: taggingAction,
    module: "my bets",
    betId: bet.betId,
    cashoutAmount: sbkQuote?.quote?.toString() || "",
    progressBar: "null",
  });
};

const getCashoutEvent = (
  state: ApplicationState,
  cashoutUrn: string | undefined,
  action?: TaggingAction,
): MyBetsEvent | null => {
  if (!cashoutUrn) {
    return null;
  }

  /**
   * Sportsbook cashout
   */
  const sbkQuote = getSportsbookCashoutQuoteByURN(state.betting.sportsbookcashouts, cashoutUrn);
  if (sbkQuote) {
    return getCashoutSbkDimensions(state, sbkQuote, action);
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

  let taggingViewTypename: string = "my bets";

  // Check if the user are on marketView or my bets
  const isMarketView = state.router.currentView === EntityType.MarketView;
  if (isMarketView) {
    taggingViewTypename = "market view - cashout";
  }

  const taggingAction =
    action || (quote.step === CashoutStep.CONFIRM ? TaggingAction.CONFIRMED_CASHOUT : TaggingAction.ATTEMPTED_CASHOUT);

  return buildMyBetsEvent({
    cashoutType: CashoutType.Full, // Until we don't have partial or auto cashout this should be used with full
    cashoutPosition: taggingAction,
    module: taggingViewTypename,
    betId: "null",
    cashoutAmount: quote.value?.toString() || "",
    progressBar: "null",
  });
};

export const getCashoutClickEvent = (action: CashoutButtonTapAction, state: ApplicationState): MyBetsEvent | null =>
  getCashoutEvent(state, action.payload.cashoutUrn);

export const getAutoConfirmCashoutClickEvent = (
  action: CashoutButtonTapActionAutoConfirm,
  state: ApplicationState,
): MyBetsEvent | null => getCashoutEvent(state, action.payload.cashoutUrn, TaggingAction.AUTO_CONFIRMED_CASHOUT);

export const getCashoutSuccessEvent = (action: TakeCashoutSuccessAction, state: ApplicationState): MyBetsEvent | null =>
  getCashoutEvent(state, action.payload.receipt?.entityURN, TaggingAction.SUCCEEDED_CASHOUT);

export const getCashoutFailureEvent = (action: TakeCashoutFailureAction, state: ApplicationState): MyBetsEvent | null =>
  getCashoutEvent(state, action.payload.receipt?.entityURN, TaggingAction.FAILED_CASHOUT);

export const getCashoutFailureSbkEvent = (
  action: TakeCashoutFailureSbkAction,
  state: ApplicationState,
): MyBetsEvent | null => getCashoutEvent(state, action.payload.entityURN, TaggingAction.FAILED_CASHOUT);
