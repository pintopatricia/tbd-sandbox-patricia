import { Receipt } from "../../entities";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import {
  NETWORK__FETCH_EXC_QUOTES_SUCCESS,
  FetchExchangeQuotesSuccessAction,
  UI__CASHOUT_BUTTON_TAP,
  CASHOUT__RESET_CONFIRMATION_STEP,
  CashoutResetConfirmationStepAction,
  CashoutButtonTapAction,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  NETWORK__CASHOUT_TAKE_FAILURE,
  TakeCashoutSuccessAction,
  TakeCashoutFailureAction,
  NETWORK__CASHOUT_TAKE_IN_PROGRESS,
  TakeCashoutInProgressAction,
  CASHOUT__RECEIPT_CLOSE_ALL,
  CashoutReceiptCloseAll,
} from "../../../actions/cashout";

import { UI__RECEIPT_CLOSE, ReceiptCloseAction } from "../../../actions/receipt";
import { ExchangeCashoutQuote, ExchangeCashouts } from "./ExchangeCashouts.types";
import { ExchangeCashoutQuoteStatus } from "../../../clients/catalogue/catalogue-response-types";
import { CashoutStep } from "../../constants";

const INITIAL_STATE: ExchangeCashouts = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | FetchExchangeQuotesSuccessAction
  | ReceiptCloseAction
  | CashoutButtonTapAction
  | CashoutResetConfirmationStepAction
  | TakeCashoutSuccessAction
  | TakeCashoutFailureAction
  | TakeCashoutInProgressAction
  | CashoutReceiptCloseAll;

const shouldResetToDisplayStep = (
  quoteStatus: ExchangeCashoutQuoteStatus,
  hasValueChanged: boolean,
  previousStep: CashoutStep,
): boolean =>
  // We should reset the step to "DISPLAY" when:
  // - the current step is "CONFIRM" and the quote value changes, for the new quote to be re-confirmed
  // - the current step is "RECEIPT" and the quote value changes, for the left over value to be visible
  // - the current step is "HIDE" and the status is not "UNAVAILABLE", for the new quotes to become visible
  (previousStep === CashoutStep.CONFIRM && hasValueChanged) ||
  (previousStep === CashoutStep.RECEIPT && hasValueChanged) ||
  (previousStep === CashoutStep.HIDE && quoteStatus !== ExchangeCashoutQuoteStatus.Unavailable);
const getNewQuoteStep = (
  quoteStatus: ExchangeCashoutQuoteStatus,
  hasValueChanged: boolean,
  previousStep?: CashoutStep,
): CashoutStep => {
  if (previousStep) {
    return shouldResetToDisplayStep(quoteStatus, hasValueChanged, previousStep) ? CashoutStep.DISPLAY : previousStep;
  }

  // If there's no previous Step, we should return "DISPLAY unless:"
  // - the quote status is UNAVAILABLE, then it should return "HIDE" to not show the unnecessary button
  return quoteStatus === ExchangeCashoutQuoteStatus.Unavailable ? CashoutStep.HIDE : CashoutStep.DISPLAY;
};

const hydrateNewQuotesState = (state: ExchangeCashouts, quotesUpdate: ExchangeCashoutQuote[]): ExchangeCashouts =>
  quotesUpdate.reduce((acc, excQuote: ExchangeCashoutQuote) => {
    const { step: previousStep, value: previousValue } = state[excQuote.urn] || {};
    // Quotes after cashout won't have value, we are not interested to trigger step changes
    const hasValueChanged = excQuote.value !== undefined && excQuote.value !== previousValue;

    return {
      ...acc,
      [excQuote.urn]: {
        ...acc[excQuote.urn],
        ...excQuote,
        step: getNewQuoteStep(excQuote.status, hasValueChanged, previousStep),
      },
    };
  }, state);

const updateQuoteWithReceiptData = (quote: ExchangeCashoutQuote | undefined, receipt: Receipt): ExchangeCashouts => {
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

const overrideQuoteStep = (quote: ExchangeCashoutQuote | undefined, step: CashoutStep): ExchangeCashouts => {
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

const setTakeCashoutCashingOutStep = (quote: ExchangeCashoutQuote | undefined): ExchangeCashouts => {
  if (!quote) {
    return {};
  }

  return overrideQuoteStep(quote, CashoutStep.CASHING_OUT);
};

const setTakeCashoutConfirmStep = (quote: ExchangeCashoutQuote | undefined): ExchangeCashouts => {
  if (!quote || quote.step !== CashoutStep.DISPLAY) {
    return {};
  }

  return overrideQuoteStep(quote, CashoutStep.CONFIRM);
};

const setResetConfirmStep = (quote: ExchangeCashoutQuote | undefined): ExchangeCashouts => {
  // We can only reset the confirmation step if we are on the confirm step
  if (quote?.step === CashoutStep.CONFIRM) {
    return overrideQuoteStep(quote, CashoutStep.DISPLAY);
  }

  return {};
};

const setDismissReceiptStep = (quote: ExchangeCashoutQuote | undefined): ExchangeCashouts => {
  // We can only hide cashed out quotes
  if (quote?.step === CashoutStep.RECEIPT) {
    return overrideQuoteStep(quote, CashoutStep.HIDE);
  }

  return {};
};

export default (currentState: undefined | ExchangeCashouts, action: ActionTypes): ExchangeCashouts => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS:
      return hydrateNewQuotesState(state, action.payload.data.ExchangeCashoutQuote || []);

    case NETWORK__FETCH_EXC_QUOTES_SUCCESS:
      return hydrateNewQuotesState(state, Object.values(action.payload));

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
    case NETWORK__CASHOUT_TAKE_FAILURE:
      return action.payload?.receipt
        ? {
            ...state,
            ...overrideQuoteStep(state[action.payload.receipt.entityURN], CashoutStep.DISPLAY),
          }
        : state;
    case CASHOUT__RECEIPT_CLOSE_ALL:
      return Object.keys(state).reduce(
        (acc, urn) => ({
          ...acc,
          [urn]: {
            ...state[urn],
            ...(state[urn].step === CashoutStep.RECEIPT ? { step: CashoutStep.HIDE } : {}),
          },
        }),
        {},
      );

    default:
      return state;
  }
};
