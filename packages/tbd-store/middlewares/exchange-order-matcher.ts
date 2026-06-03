import { Middleware } from "redux";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  PlaceExchangeBetSuccessPayload,
  NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
  SearchExchangeOrdersSuccessAction,
} from "../actions/betslip";
import { BetslipExchangeReport } from "../state/betslip/Betslip.types";
import { ExchangeSide } from "../state/betting/exchange-bets/ExchangeBet.types";

type Calculations = {
  profit?: number;
  liability?: number;
  size?: number;
  totalBonusUsed?: number;
};

type CalculationsPayload = {
  bettingType: string;
  marketType: string;
  side: ExchangeSide;
  price: number;
  size: number;
  bonusUsed?: number;
};

async function buildCalculations(payload: CalculationsPayload): Promise<Calculations> {
  const { calc } = await import(/* webpackChunkName: "BetEngine", webpackPreload: true */ "@ppb/bet-engine");

  const { side, price, size, bonusUsed, bettingType, marketType } = payload;
  const hasPriceAndSize = price && size;
  const profit = hasPriceAndSize ? calc.profit(side, size, price, bettingType, marketType) : undefined;
  const totalBonusUsed = bonusUsed ? calc.liability(side, bonusUsed, price, bettingType, marketType) : 0;
  const liability = hasPriceAndSize
    ? calc.liability(side, size, price, bettingType, marketType, { bonus: totalBonusUsed })
    : undefined;

  return { profit, liability, size, totalBonusUsed };
}

async function addCalculationsToReport(report: BetslipExchangeReport): Promise<BetslipExchangeReport> {
  const {
    metadata: { runnerTree },
  } = report;
  const {
    market: { bettingType, marketType },
  } = runnerTree;
  const matchedProfitAndLiability = report.matched
    ? {
        matched: {
          ...report.matched,
          ...(await buildCalculations({
            bettingType,
            marketType,
            side: report.side,
            price: report.matched.price,
            size: report.matched.size,
            bonusUsed: report.matched.totalBonusUsed || 0,
          })),
        },
      }
    : {};

  const unmatchedProfitAndLiability = report.unmatched
    ? {
        unmatched: {
          ...report.unmatched,
          ...(await buildCalculations({
            bettingType,
            marketType,
            side: report.side,
            price: report.unmatched.price,
            size: report.unmatched.size,
            bonusUsed: report.unmatched.totalBonusUsed || 0,
          })),
        },
      }
    : {};

  const cancelledProfitAndLiability = report.cancelled
    ? {
        cancelled: {
          ...report.cancelled,
          ...(await buildCalculations({
            bettingType,
            marketType,
            side: report.side,
            price: report.cancelled.price,
            size: report.cancelled.size,
          })),
        },
      }
    : {};

  return {
    ...report,
    ...matchedProfitAndLiability,
    ...unmatchedProfitAndLiability,
    ...cancelledProfitAndLiability,
  };
}

export const exchangeOrderMatcher: Middleware<Record<string, never>, ApplicationState> =
  (store) => (next) => async (action: SearchExchangeOrdersSuccessAction) => {
    const { type, payload } = action;
    const { betslip } = store.getState();

    if (type === NETWORK__SEARCH_EXC_ORDERS_SUCCESS && betslip) {
      const { step, exchangeReport, exchangeEdit, exchangePlaceError } = betslip;
      const { report } = payload as PlaceExchangeBetSuccessPayload;
      const actionReport = await addCalculationsToReport(report);

      const reportUnmatchedSize = actionReport?.unmatched?.size;
      const reportMatchedSize = actionReport?.matched?.size;
      const storeUnmatchedSize = exchangeReport?.unmatched?.size;
      const storeMatchedSize = exchangeReport?.matched?.size;

      const hasChanges = storeMatchedSize !== reportMatchedSize || storeUnmatchedSize !== reportUnmatchedSize;

      const hasPlaceError = exchangePlaceError && exchangePlaceError.errorCode;

      const shouldShowReceipt = hasChanges && !hasPlaceError;

      return next<SearchExchangeOrdersSuccessAction>({
        type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
        payload: {
          report: actionReport,
          step: shouldShowReceipt ? "REPORT" : step,
          exchangeEdit: shouldShowReceipt ? undefined : exchangeEdit,
        },
      });
    }

    return next(action);
  };
