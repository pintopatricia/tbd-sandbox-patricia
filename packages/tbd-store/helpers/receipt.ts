import URN from "../state/layout/URN";
import { Receipt } from "../state/entities";
import { TranslatableText } from "../state/layout/cards/Card.types";
import { BetType } from "../state/constants";

const labels = {
  title: "I18N.CASHOUT.TITLE",
  successTitle: "I18N.CASHOUT.SUCCESS_TITLE",
  profit: "I18N.CASHOUT.PROFIT",
  close: "I18N.CASHOUT.RECEIPT.CLOSE",
};

const genericErrorMessage = "I18N.CASHOUT.MESSAGES.CASHOUT_FAILED";
const generalFailureMessage = "I18N.CASHOUT.MESSAGES.GENERAL_FAILURE";

const genericErrorMessageStates = [
  "ALL_UNMATCHED",
  "BAD_REQUOTE",
  "CANCEL_FAILURE",
  "CASHOUT_FAILED",
  "FORBIDDEN",
  "GENERIC",
  "NOT_ELIGIBLE",
  "NOT_OPEN",
  "NULL",
  "ODD_MOVEMENT",
  "PARTIAL_SUCCESS",
  "PLACEMENT_FAILURE",
  "SUSPENDED",
  "TIMEOUT",
  "UNEXPECTED",
];

const generalFailureMessageStates = [
  "GENERAL_FAILURE",
  "GEOGRAPHICAL_RESTRICTION",
  "INVALID_BET_DEFINITIONS",
  "INVALID_RUNNER_SIZE",
  "FEATURE_NOT_SUPPORTED",
  "REQUESTED_PRICE_NOT_AVAILABLE",
  "COUNTRY_OF_RESIDENCE_RESTRICTION",
  "PRICE_TYPE_NOT_AVAILABLE",
  "REGULATOR_CLOSED",
];

function getMultipleTranslatedKey(betType: BetType, numLines: number, isSGM: boolean): TranslatableText {
  const prefix = isSGM ? "BET_BUILDER" : "MULTIPLE";

  return {
    translate: { key: `I18N.MY_BETS.SBK.${prefix}.${betType}_LINES`, interpolationValues: { numLines: `${numLines}` } },
  };
}

export const getErrorMessageTranslatedKey = (entityStatus: string): TranslatableText => {
  if (genericErrorMessageStates.includes(entityStatus)) {
    return { translate: { key: genericErrorMessage } };
  }

  if (generalFailureMessageStates.includes(entityStatus)) {
    return { translate: { key: generalFailureMessage } };
  }

  return { translate: { key: `I18N.CASHOUT.MESSAGES.${entityStatus}` } };
};

export const buildQuoteReceipt = (
  cashoutUrn: URN,
  quoteStatus: string,
  eventDescription?: string,
  marketDescription?: string,
  cashedOutQuote?: number,
  profit?: number,
  betType?: BetType,
  numLines?: number,
  isSGM?: boolean,
): Receipt => {
  const isCashoutSuccessful = quoteStatus === "SUCCESS";
  const receiptTitle = {
    translate: { key: isCashoutSuccessful ? labels.successTitle : labels.title },
  };

  if (!isCashoutSuccessful) {
    return {
      entityURN: cashoutUrn,
      receiptTitle,
      errorMessage: getErrorMessageTranslatedKey(quoteStatus),
    };
  }

  const isSbkMultiple = betType && numLines && betType !== BetType.SGL;

  return {
    entityURN: cashoutUrn,
    receiptTitle,
    detailTitle: isSbkMultiple
      ? getMultipleTranslatedKey(betType as BetType, numLines as number, isSGM as boolean)
      : { translated: eventDescription },
    detailSubtitle: { translated: isSbkMultiple ? "" : marketDescription },
    segmentLeftLabel: {
      translate: { key: labels.title },
    },
    segmentLeftValue: {
      value: cashedOutQuote || 0,
      decimalPlaces: 2,
    },
    segmentRightLabel: {
      translate: { key: labels.profit },
    },
    segmentRightValue: {
      value: profit || 0,
      decimalPlaces: 2,
    },
  };
};
