import { Receipt } from "../../entities";
import {
  CASHOUT__RESET_CONFIRMATION_STEP,
  CashoutResetConfirmationStepAction,
  TakeCashoutFailureAction,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  TakeCashoutSuccessAction,
  UI__CASHOUT_BUTTON_TAP,
  CashoutButtonTapAction,
  NETWORK__FETCH_SBK_QUOTES_SUCCESS,
  FetchSportsbookQuotesSuccessAction,
  TakeCashoutInProgressAction,
  NETWORK__CASHOUT_TAKE_IN_PROGRESS,
  NETWORK__CASHOUT_TAKE_FAILURE_SBK,
  TakeCashoutFailureSbkAction,
} from "../../../actions/cashout";

import { UI__RECEIPT_CLOSE, ReceiptCloseAction } from "../../../actions/receipt";

import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { SportsbookCashoutQuote, SportsbookCashouts } from "./SportsbookCashouts.types";
import { SportsbookCashoutQuoteStatus } from "../../../clients/catalogue/catalogue-response-types";
import { CashoutStep } from "../../constants";

const INITIAL_STATE: SportsbookCashouts = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | ReceiptCloseAction
  | CashoutButtonTapAction
  | CashoutResetConfirmationStepAction
  | TakeCashoutSuccessAction
  | TakeCashoutFailureAction
  | TakeCashoutInProgressAction
  | FetchSportsbookQuotesSuccessAction
  | TakeCashoutFailureSbkAction;

const shouldResetToDisplayStep = (
  quoteStatus: SportsbookCashoutQuoteStatus,
  hasValueChanged: boolean,
  previousStep: CashoutStep,
): boolean =>
  // We should reset the step to "DISPLAY" when:
  // - the current step is "CONFIRM" and the quote value changes, for the new quote to be re-confirmed
  // - the current step is "RECEIPT" and the quote value changes, for the left over value to be visible
  // - the current step is "HIDE" and the status is not "NOT_ELIGIBLE", for the new quotes to become visible
  (previousStep === CashoutStep.CONFIRM && hasValueChanged) ||
  (previousStep === CashoutStep.RECEIPT && hasValueChanged) ||
  (previousStep === CashoutStep.HIDE && quoteStatus !== SportsbookCashoutQuoteStatus.NotEligible);
const getNewQuoteStep = (
  quoteStatus: SportsbookCashoutQuoteStatus,
  hasValueChanged: boolean,
  previousStep?: CashoutStep,
): CashoutStep => {
  if (previousStep) {
    return shouldResetToDisplayStep(quoteStatus, hasValueChanged, previousStep) ? CashoutStep.DISPLAY : previousStep;
  }

  // If there's no previous Step, we should return "DISPLAY unless:"
  // - the quote status is "NotEligible", then it should return "HIDE" to not show the unnecessary button
  return quoteStatus === SportsbookCashoutQuoteStatus.NotEligible ? CashoutStep.HIDE : CashoutStep.DISPLAY;
};

const hydrateNewQuotesState = (state: SportsbookCashouts, quotesUpdate: SportsbookCashoutQuote[]): SportsbookCashouts =>
  quotesUpdate.reduce((acc, sbkQuote: SportsbookCashoutQuote) => {
    const { step: previousStep, quote: previousQuote } = state[sbkQuote.urn] || {};
    // Quotes after cashout won't have value, we are not interested to trigger step changes
    const hasQuoteChanged = sbkQuote.quote !== undefined && sbkQuote.quote !== previousQuote;

    return {
      ...acc,
      [sbkQuote.urn]: {
        ...acc[sbkQuote.urn],
        ...sbkQuote,
        step: getNewQuoteStep(sbkQuote.status, hasQuoteChanged, previousStep),
      },
    };
  }, state);

const overrideQuoteStep = (quote: SportsbookCashoutQuote | undefined, step: CashoutStep): SportsbookCashouts => {
  if (quote) {
    return {
      [quote.urn]: {
        ...quote,
        step,
      },
    };
  }

  return {};
};

const updateQuoteWithReceiptData = (
  quote: SportsbookCashoutQuote | undefined,
  receipt: Receipt,
): SportsbookCashouts => {
  if (!quote) {
    return {};
  }

  // In case of error it should reset to display mode
  if (!receipt || receipt.errorMessage) {
    return {
      [quote.urn]: {
        ...quote,
        step: CashoutStep.DISPLAY,
      },
    };
  }

  return {
    [quote.urn]: {
      ...quote,
      step: CashoutStep.RECEIPT,
      cashedOutProfit: receipt?.segmentRightValue?.value || 0,
    },
  };
};

const setTakeCashoutCashingOutStep = (quote: SportsbookCashoutQuote | undefined): SportsbookCashouts => {
  if (!quote) {
    return {};
  }

  return overrideQuoteStep(quote, CashoutStep.CASHING_OUT);
};

const setTakeCashoutConfirmStep = (quote: SportsbookCashoutQuote | undefined): SportsbookCashouts => {
  if (!quote || quote.step !== CashoutStep.DISPLAY) {
    return {};
  }

  return overrideQuoteStep(quote, CashoutStep.CONFIRM);
};

const setResetConfirmStep = (quote: SportsbookCashoutQuote | undefined): SportsbookCashouts => {
  // We can only reset the confirmation step if we are on the confirm step
  if (quote?.step === CashoutStep.CONFIRM) {
    return overrideQuoteStep(quote, CashoutStep.DISPLAY);
  }

  return {};
};

const setDismissReceiptStep = (quote: SportsbookCashoutQuote | undefined): SportsbookCashouts => {
  // We can only hide cashed out quotes
  if (quote?.step === CashoutStep.RECEIPT) {
    return overrideQuoteStep(quote, CashoutStep.HIDE);
  }

  return {};
};

export default (currentState: undefined | SportsbookCashouts, action: ActionTypes): SportsbookCashouts => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS:
      return hydrateNewQuotesState(state, action.payload.data.SportsbookCashoutQuote || []);
    case UI__RECEIPT_CLOSE:
      return {
        ...state,
        ...setDismissReceiptStep(state[action.payload.entityURN]),
      };
    case NETWORK__CASHOUT_TAKE_IN_PROGRESS:
      return {
        ...state,
        ...setTakeCashoutCashingOutStep(state[action.payload.cashoutUrn]),
      };
    case UI__CASHOUT_BUTTON_TAP:
      if (!action.payload.confirmCashout) {
        return state;
      }

      return {
        ...state,
        ...setTakeCashoutConfirmStep(state[action.payload.cashoutUrn]),
      };
    case CASHOUT__RESET_CONFIRMATION_STEP:
      return {
        ...state,
        ...setResetConfirmStep(state[action.payload.cashoutUrn]),
      };
    case NETWORK__CASHOUT_TAKE_SUCCESS: {
      const receipt = action.payload?.receipt;
      return receipt
        ? {
            ...state,
            ...updateQuoteWithReceiptData(state[receipt.entityURN], receipt),
          }
        : state;
    }
    case NETWORK__CASHOUT_TAKE_FAILURE_SBK:
      return action.payload?.entityURN
        ? {
            ...state,
            ...overrideQuoteStep(state[action.payload.entityURN], CashoutStep.DISPLAY),
          }
        : state;
    case NETWORK__FETCH_SBK_QUOTES_SUCCESS:
      return hydrateNewQuotesState(state, Object.values(action.payload));
    default:
      return state;
  }
};
