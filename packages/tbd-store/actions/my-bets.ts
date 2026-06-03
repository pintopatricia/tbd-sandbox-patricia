import { createAction } from "@reduxjs/toolkit";
import { ExchangeBetTransactionErrorCode } from "../state/betting/ExchangeBetTransactionError.types";
import { Receipt } from "../state/entities";
import URN from "../state/layout/URN";
import { ViewLink } from "../state/layout/views/ViewLink.types";
import { ADD_SELECTION_PAYLOAD } from "./betting";
import { ExchangeSide } from "../state/betting/exchange-bets/ExchangeBet.types";
import { BetsResultServiceResponse } from "../services/bet-live-hypotheticals-service";
import { BetEligibilityResponse } from "../clients/__generated__/bme";

export const UI__MY_BETS_ORDER_TYPE_FILTER_CLICK = "UI/MY_BETS_ORDER_TYPE_FILTER_CLICK";
export const UI__MY_BETS_ORDER_STATUS_FILTER_CLICK = "UI/MY_BETS_ORDER_STATUS_FILTER_CLICK";
export const UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK = "UI/MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK";
export const UI__MY_BETS_HERITAGE_INFO_LABEL_CLICK = "UI/MY_BETS_HERITAGE_INFO_LABEL_CLICK";

export const UI__MY_BETS_ON_ACCORDION_TOGGLE = "UI/MY_BETS_ON_ACCORDION_TOGGLE";

export const UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS = "UI/MY_BETS_CANCEL_ALL_UNMATCHED_PRESS";
export const UI__MY_BETS_EXC_EDIT_BET_PRESS = "UI/MY_BETS_EXC_EDIT_BET_PRESS";
export const UI__MY_BETS_EXC_EDIT_BET_CLOSE = "UI/MY_BETS_EXC_EDIT_BET_CLOSE";
export const UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS = "UI/MY_BETS_CANCEL_UNMATCHED_BET_PRESS";

export const UI__MY_BETS_COPY_BET_ID = "UI/MY_BETS_COPY_BET_ID";
export const UI__MY_BETS_COPY_REGULATOR_BET_ID = "UI/MY_BETS_COPY_REGULATOR_BET_ID";
export const UI__MY_BETS_COPY_DEVICE_ID = "UI/MY_BETS_COPY_DEVICE_ID";
export const UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK = "UI/MY_BETS_SBK_RE_USE_SELECTIONS_CLICK";

export const UI_NAVIGATE_SETTLEMENT_LINK = "UI/NAVIGATE_SETTLEMENT_LINK";

export const NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS =
  "NETWORK/MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS";
export const NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS = "NETWORK/MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS";
export const NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS =
  "NETWORK/MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS";
export const NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE =
  "NETWORK/MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE";
export const NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE = "NETWORK/MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE";

export const MY_BETS_SUBSCRIBE_CARD_UPDATES = "MY_BETS_SUBSCRIBE_CARD_UPDATES";
export const MY_BETS_UNSUBSCRIBE_CARD_UPDATES = "MY_BETS_UNSUBSCRIBE_CARD_UPDATES";

export const MY_BETS_UPDATE_VIEW_CURSOR = "MY_BETS_UPDATE_VIEW_CURSOR";

export const MY_BETS_RESET_FILTERS = "MY_BETS_RESET_FILTERS";

export const UI__MY_BETS_HEADER_TOOLTIP_TOGGLE = "UI/MY_BETS_HEADER_TOOLTIP_TOGGLE";

export const UI__MY_BETS_EXC_ORDER_STATUS_SWITCH = "UI/MY_BETS_EXC_ORDER_STATUS_SWITCH";

export const UI__MY_BETS_BET_SHARING_PREVIEW_TAP = "UI/MY_BETS_BET_SHARING_PREVIEW_TAP";

export const UI__MY_BETS_BET_SHARING_DISMISS_TAP = "UI/MY_BETS_BET_SHARING_DISMISS_TAP";

export const UI__MY_BETS_BET_SHARING_SHARE_BET_TAP = "UI/MY_BETS_BET_SHARING_SHARE_BET_TAP";

export const UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP = "UI/MY_BETS_BET_SHARING_SHARE_IMAGE_TAP";

export const SUBSCRIBE_BET_RESULT = "SUBSCRIBE_BET_RESULT";
export const UNSUBSCRIBE_BET_RESULT = "UNSUBSCRIBE_BET_RESULT";

export const NETWORK__FETCH_BETS_RESULT_SUCCESS = "NETWORK/FETCH_BETS_RESULT_SUCCESS";
export const NETWORK__FETCH_BETS_RESULT_FAILURE = "NETWORK/FETCH_BETS_RESULT_FAILURE";

export const SUBSCRIBE_BET_MUTATION_ELIGIBILITY = "SUBSCRIBE_BET_MUTATION_ELIGIBILITY";
export const UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY = "UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY";

export const NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS = "NETWORK/FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS";
export const NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_FAILURE = "NETWORK/FETCH_BETS_MUTATION_ELIGIBILITY_FAILURE";

export const UI__MY_BETS_ACCA_FREEZE_OPENED = "UI/ACCA_FREEZE_OPENED";
export const UI__MY_BETS_ACCA_FREEZE_CLOSED = "UI/ACCA_FREEZE_CLOSED";

export const MY_BETS_EXC_BOTTOM_SHEET_OPEN = "MY_BETS_EXC_BOTTOM_SHEET_OPEN";
export const MY_BETS_EXC_BOTTOM_SHEET_CLOSE = "MY_BETS_EXC_BOTTOM_SHEET_CLOSE";

export type MyBetsOrderTypeFilterClick = {
  type: typeof UI__MY_BETS_ORDER_TYPE_FILTER_CLICK;
  payload: {
    filter: {
      orderType: string;
      productType: string;
      isHeritageView: boolean;
    };
    viewUrn: URN;
  };
};

export const myBetsOrderTypeFilterClickAction = createAction<
  MyBetsOrderTypeFilterClick["payload"],
  typeof UI__MY_BETS_ORDER_TYPE_FILTER_CLICK
>(UI__MY_BETS_ORDER_TYPE_FILTER_CLICK);

export type MyBetsOrderStatusFilterClick = {
  type: typeof UI__MY_BETS_ORDER_STATUS_FILTER_CLICK;
  payload: {
    filter: {
      orderStatus: string;
    };
    viewUrn: URN;
  };
};

export const myBetsOrderStatusFilterClickAction = createAction<
  MyBetsOrderStatusFilterClick["payload"],
  typeof UI__MY_BETS_ORDER_STATUS_FILTER_CLICK
>(UI__MY_BETS_ORDER_STATUS_FILTER_CLICK);

export type MyBetsHeritageToggleFilterClick = {
  type: typeof UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK;
  payload: {
    filter: {
      isHeritageView: boolean;
      label: string;
    };
    viewUrn: URN;
  };
};

export type MyBetsHeritageInfoLabelClick = {
  type: typeof UI__MY_BETS_HERITAGE_INFO_LABEL_CLICK;
  payload: {
    viewLink: ViewLink;
    label: string;
  };
};

export const myBetsHeritageToggleFilterClickAction = createAction<
  MyBetsHeritageToggleFilterClick["payload"],
  typeof UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK
>(UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK);

export type MyBetsOnAccordionToggle = {
  type: typeof UI__MY_BETS_ON_ACCORDION_TOGGLE;
  payload: {
    isExpanded: boolean;
  };
};

export type MyBetsSubscribeCardUpdatesAction = {
  type: typeof MY_BETS_SUBSCRIBE_CARD_UPDATES;
  payload: {
    urn: URN;
  };
};

export type MyBetsUnsubscribeCardUpdatesAction = {
  type: typeof MY_BETS_UNSUBSCRIBE_CARD_UPDATES;
  payload: {
    urn: URN;
  };
};

export type MyBetsOnCancelAllPressAction = {
  type: typeof UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS;
  payload: {
    marketId: string;
    marketName: string;
    numberOfBets: number;
    event?: string;
    marketBetCardGroupURN: URN[];
  };
};

export type MyBetsCancelExchangeBetSuccessAction = {
  type: typeof NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS;
  payload: {
    selectionName: string;
    side: ExchangeSide;
    betId: string;
  };
};

export type MyBetsCancelAllExchangeBetsSuccessAction = {
  type: typeof NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS;
  payload: {
    marketName: string;
    numberOfBets: number;
    event?: string;
  };
};

export type MyBetsCancelExchangeBetInProgressAction = {
  type: typeof NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_IN_PROGRESS;
};

export type MyBetsCancelExchangeBetFailureAction = {
  type: typeof NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE;
  payload: {
    errorCode: ExchangeBetTransactionErrorCode;
    side: ExchangeSide;
    betId: string;
    selectionName: string;
    receipt: Receipt;
  };
};

export type MyBetsCancelAllExchangeBetFailureAction = {
  type: typeof NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE;
  payload: {
    errorCode: ExchangeBetTransactionErrorCode;
    receipt: Receipt;
  };
};

export type MyBetsUpdateCursorAction = {
  type: typeof MY_BETS_UPDATE_VIEW_CURSOR;
  payload: {
    viewURN: URN;
    cursor: string;
  };
};

export type MyBetsExchangeBetEditPressAction = {
  type: typeof UI__MY_BETS_EXC_EDIT_BET_PRESS;
  payload: {
    betId: string;
    marketUrn: string;
    runner: string;
    side: ExchangeSide;
    exchangeLightMarketViewLink: ViewLink;
  };
};

export type MyBetsExchangeBetEditCloseAction = {
  type: typeof UI__MY_BETS_EXC_EDIT_BET_CLOSE;
  payload: {
    wasCloseButtonPressed: boolean;
  };
};

export type MyBetsOnCancelUnmatchedBetPressAction = {
  type: typeof UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS;
  payload: {
    marketId: string;
    betId: string;
    selectionName: string;
    side: ExchangeSide;
    marketBetCardGroupURN: URN;
  };
};

export type MyBetsCopyBetId = {
  type: typeof UI__MY_BETS_COPY_BET_ID;
};

export type MyBetsCopyRegulatorBetId = {
  type: typeof UI__MY_BETS_COPY_REGULATOR_BET_ID;
};

export type MyBetsCopyDeviceId = {
  type: typeof UI__MY_BETS_COPY_DEVICE_ID;
};

export type MyBetsResetFilters = {
  type: typeof MY_BETS_RESET_FILTERS;
  payload?: {
    viewUrn: URN;
  };
};

export const myBetsResetFiltersAction = createAction<MyBetsResetFilters["payload"], typeof MY_BETS_RESET_FILTERS>(
  MY_BETS_RESET_FILTERS,
);

export type MyBetsExchangeOrderStatusSwitch = {
  type: typeof UI__MY_BETS_EXC_ORDER_STATUS_SWITCH;
  payload: {
    orderStatusFilterLabel: string;
  };
};

export type MyBetsSportsbookAddPreviousSelectionsClickAction = {
  type: typeof UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK;
  payload: ADD_SELECTION_PAYLOAD & { source: "open" | "settled" };
};

export type MyBetsBetSharingPreviewTapAction = {
  type: typeof UI__MY_BETS_BET_SHARING_PREVIEW_TAP;
};

export type MyBetsBetSharingDismissTapAction = {
  type: typeof UI__MY_BETS_BET_SHARING_DISMISS_TAP;
};

export type MyBetsBetSharingShareBetTapAction = {
  type: typeof UI__MY_BETS_BET_SHARING_SHARE_BET_TAP;
};

export type MyBetsBetSharingShareImageTapAction = {
  type: typeof UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP;
};

export type MyBetsAccaFreezeOpenedAction = {
  type: typeof UI__MY_BETS_ACCA_FREEZE_OPENED;
};

export type MyBetsAccaFreezeClosedAction = {
  type: typeof UI__MY_BETS_ACCA_FREEZE_CLOSED;
};
export type MyBetsHeaderTooltipToggleAction = {
  type: typeof UI__MY_BETS_HEADER_TOOLTIP_TOGGLE;
  payload: { isTooltipOpen: boolean };
};

export type SubscribeBetResultActionPayload = {
  urn: URN;
};

export type UnsubscribeBetResultActionPayload = {
  urn: URN;
};

export type SubscribeBetResultAction = {
  type: typeof SUBSCRIBE_BET_RESULT;
  payload: SubscribeBetResultActionPayload;
};

export type UnsubscribeBetResultAction = {
  type: typeof UNSUBSCRIBE_BET_RESULT;
  payload: UnsubscribeBetResultActionPayload;
};

export type FetchBetsResultSuccessAction = {
  type: typeof NETWORK__FETCH_BETS_RESULT_SUCCESS;
  payload: { bets: BetsResultServiceResponse; legsMapper: Map<URN, { [key: number]: string }> };
};

export type FetchBetsResultFailureAction = {
  type: typeof NETWORK__FETCH_BETS_RESULT_FAILURE;
  error: string;
};

export type SubscribeBetMutationEligibilityAction = {
  type: typeof SUBSCRIBE_BET_MUTATION_ELIGIBILITY;
  payload: {
    urn: URN;
  };
};

export type UnsubscribeBetMutationEligibilityAction = {
  type: typeof UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY;
  payload: {
    urn: URN;
  };
};

export type FetchBetsMutationEligibilitySuccessAction = {
  type: typeof NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS;
  payload: BetEligibilityResponse;
};

export type FetchBetsMutationEligibilityFailureAction = {
  type: typeof NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_FAILURE;
  error: string;
};

export type MyBetsExchangeOpenBottomSheetAction = {
  type: typeof MY_BETS_EXC_BOTTOM_SHEET_OPEN;
  payload: {
    contentUrn: string;
    title?: string;
  };
};

export type MyBetsExchangeCloseBottomSheetAction = {
  type: typeof MY_BETS_EXC_BOTTOM_SHEET_CLOSE;
};
