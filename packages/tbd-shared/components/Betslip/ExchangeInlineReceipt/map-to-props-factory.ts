import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import { Dispatch } from "redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  BetslipExchangeMatchedPanelDoneClickAction,
  BetslipExchangeUnmatchedCancelClickAction,
  BetslipExchangeReportBetEditClickAction,
  UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import URN from "@ppb/tbd-store/state/layout/URN";
import { getExchangeOrder } from "@ppb/tbd-store/state/betting/exchange-orders/exchange-order-selectors";
import { getExchangeRunnerTree } from "@ppb/tbd-store/state/entities/entities-selectors";

import { ExchangeOrder } from "@ppb/tbd-store/state/betting/exchange-orders/ExchangeOrder.types";
import type { ExchangeInlineReceiptPanelProps } from "./snowflakes/ExchangeInlineReceiptPanel/ExchangeInlineReceiptPanel.types";
import { buildExchangeInlineReceipt } from "./exchange-inline-receipt-mapper";

type CardProps = {
  receipt?: ExchangeInlineReceiptPanelProps;
  order: ExchangeOrder | null;
  runner?: URN;
};

export type StateProps = CardProps | Record<string, never>;

export type DispatchProps = {
  dispatchPanelDone: () => void;
  dispatchPanelEdit: (betId: string, betOriginURL: string) => void;
  dispatchPanelCancel: (betId: string, runner: URN) => void;
};
export type ContainerProps = {};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> =
  () =>
  (appState: ApplicationState): StateProps => {
    const { betslip } = appState;

    if (!betslip) {
      return {};
    }

    const { exchangeReport } = betslip;

    if (!exchangeReport) {
      return {
        order: null,
      };
    }

    const { runner: runnerUrn, betIds } = exchangeReport;

    const runnerTree = getExchangeRunnerTree(appState.entities, runnerUrn);
    const order = runnerTree && betIds ? getExchangeOrder(appState, runnerTree.market.urn, betIds[0]) : null;
    const receipt = buildExchangeInlineReceipt(appState);

    return {
      runner: runnerUrn,
      order,
      receipt,
    };
  };

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchPanelDone: () => {
    dispatch<BetslipExchangeMatchedPanelDoneClickAction>({
      type: UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
    });
  },
  dispatchPanelEdit: (betId: string, betOriginURL: string) => {
    dispatch<BetslipExchangeReportBetEditClickAction>({
      type: UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
      payload: {
        betId,
        isPersistenceTypeMenuExpanded: false,
        betOriginURL,
      },
    });
  },
  dispatchPanelCancel: (betId: string, runner: URN) => {
    dispatch<BetslipExchangeUnmatchedCancelClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
      payload: {
        instructions: { betIds: [betId], runner },
      },
    });
  },
});
