import { ImplyResponse } from "@ppb/betslip-core";
import { CombinationResult } from "@flutter-global/uki-channels-http-clients/src/clients/BetCombinationEngineService/BetCombinationEngineService";
import {
  BetslipExchangeReport,
  BetslipSportsbookReport,
  BetslipExchangeEdit,
  BetslipStep,
  BetslipSubType,
  BetslipObbReport,
  BetslipObbQuotes,
  BetslipObbImplyBetsResponse,
  BetslipObbPlaceBetResponseData,
} from "../state/betslip/Betslip.types";
import { ExchangePersistenceType, Product } from "../state/entities";
import {
  BettingSportsbookUpdateCombinationStakeAction,
  BettingSportsbookIncrementStakeAction,
  BettingExchangeIncrementSizeAction,
  BettingSportsbookRemoveLegAction,
} from "./betting";
import { SportsbookTransactionalError } from "../services/sportsbook-bet-service";
import { SportsbookOdds } from "../state/entities/SportsbookOdds.types";
import URN from "../state/layout/URN";
import type { CardTrackingMetadata } from "../state/layout/cards/Card.types";
import { ExchangeBetTransactionError } from "../state/betting/ExchangeBetTransactionError.types";
import { ExchangeMarketBonus } from "../state/betting/exchange-betting-bonus/ExchangeBettingBonus.types";
import { ExchangeSide } from "../state/betting/exchange-bets/ExchangeBet.types";

export const UI__BETSLIP_EXC_PRICE_NUDGE_UP = "UI/BETSLIP_EXC_PRICE_NUDGE_UP";
export const UI__BETSLIP_EXC_PRICE_NUDGE_DOWN = "UI/BETSLIP_EXC_PRICE_NUDGE_DOWN";
export const UI__BETSLIP_EXC_PRICE_INPUT_CHANGE = "UI/BETSLIP_EXC_PRICE_INPUT_CHANGE";
export const UI__BETSLIP_EXC_PRICE_INPUT_BLUR = "UI/BETSLIP_EXC_PRICE_INPUT_BLUR";
export const UI__BETSLIP_EXC_SIZE_INPUT_CHANGE = "UI/BETSLIP_EXC_SIZE_INPUT_CHANGE";
export const UI__BETSLIP_EXC_BONUS_CHANGE = "UI/BETSLIP_EXC_BONUS_CHANGE";
export const UI__BETSLIP_EXC_PLACE_BET_CLICK = "UI/BETSLIP_EXC_PLACE_BET_CLICK";
export const UI__BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM = "UI/BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM";
export const UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK = "UI/BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK";
export const UI__BETSLIP_SBK_REMOVE_LEG_CLICK = "UI/BETSLIP_SBK_REMOVE_LEG_CLICK";
export const UI__BETSLIP_SBK_REMOVE_BOOSTED_COMBINATION_CLICK = "UI/BETSLIP_SBK_REMOVE_BOOSTED_COMBINATION_CLICK";
export const UI__BETSLIP_SBK_PLACE_BETS_CLICK = "UI/BETSLIP_SBK_PLACE_BETS_CLICK";
export const UI__BETSLIP_SBK_PLACE_BETS_CLICK_AUTO_CONFIRM = "UI/BETSLIP_SBK_PLACE_BETS_CLICK_AUTO_CONFIRM";
export const UI__BETSLIP_SBK_STAKE_INPUT_CHANGE = "UI/BETSLIP_SBK_STAKE_INPUT_CHANGE";
export const UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK = "UI/BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK";
export const UI__BETSLIP_SBK_CAST_BET_CHANGE = "UI/BETSLIP_SBK_CAST_BET_CHANGE";
export const UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE = "UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE";
export const UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE = "UI/BETSLIP_SBK_CAST_BET_ORDER_CHANGE";
export const UI__BETSLIP_SBK_MULTIPLES_REMOVE_SELECTIONS = "UI/BETSLIP_SBK_MULTIPLES_REMOVE_SELECTIONS";
export const UI__BETSLIP_SBK_REMOVE_SELECTIONS = "UI/BETSLIP_SBK_REMOVE_SELECTIONS";
export const UI__BETSLIP_HEADER_CLICK = "UI/BETSLIP_HEADER_CLICK";
export const UI__BETSLIP_ACCORDION_HEADER_CLICK = "UI/BETSLIP_ACCORDION_HEADER_CLICK";
export const UI__BETSLIP_SBK_TAB_SWITCH = "UI/BETSLIP_SBK_TAB_SWITCH";
export const UI__BETSLIP_SBK_CONFIRM_BETS_CLICK = "UI/BETSLIP_SBK_CONFIRM_BETS_CLICK";
export const UI__BETSLIP_SBK_EDIT_BETS_CLICK = "UI/BETSLIP_SBK_EDIT_BETS_CLICK";
export const UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK = "UI/BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK";
export const UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY = "UI/BETSLIP_SBK_RECEIPT_BET_ID_COPY";
export const UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY = "UI/BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY";
export const UI__BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK = "UI/BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK";
export const UI__BETSLIP_OBB_NOTIFICATION_SHOWN = "UI/BETSLIP_OBB_NOTIFICATION_SHOWN";
export const UI__BETSLIP_OBB_MAX_PAYOUT_NOTIFICATION_URL_CLICK = "UI/BETSLIP_OBB_MAX_PAYOUT_NOTIFICATION_URL_CLICK";
export const UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK = "UI/BETSLIP_EXC_REPORT_EDIT_BET_CLICK";
export const UI__BETSLIP_EXC_CONFIRM_BET_CLICK = "UI/BETSLIP_EXC_CONFIRM_BET_CLICK";
export const UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK = "UI/BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK";
export const UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION = "UI/BETSLIP_EXC_INCREMENT_SIZE_ACTION";
export const UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION = "UI/BETSLIP_SBK_INCREMENT_STAKE_ACTION";
export const UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE = "UI/BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE";
export const UI__BETSLIP_SBK_EACH_WAY_TOGGLE = "UI/BETSLIP_SBK_EACH_WAY_TOGGLE";
export const UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE = "UI/BETSLIP_SBK_PRICE_BOOST_TOGGLE";
export const UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE = "UI/BETSLIP_SBK_ACCA_INSURANCE_TOGGLE";
export const UI__BETSLIP_CLOSE_CLICK = "UI/BETSLIP_CLOSE_CLICK";
export const UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK = "UI/BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK";
export const UI__BETSLIP_SBK_NOTIFICATION_SHOWN = "UI/BETSLIP_SBK_NOTIFICATION_SHOWN";
export const UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK = "UI/BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK";
export const UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK = "UI/BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK";
export const UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK = "UI/BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK";
export const UI__BETSLIP_SBK_DEPOSIT_TO_CONFIRM_BET_CLICK = "UI/BETSLIP_SBK_DEPOSIT_TO_CONFIRM_BET_CLICK";
export const UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK = "UI/BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK";
export const UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED = "UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED";

// Exchange Edit Unmatched
export const UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP = "UI/BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP";
export const UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN = "UI/BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN";
export const UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE = "UI/BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE";
export const UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR = "UI/BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR";
export const UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE = "UI/BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE";
export const UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK = "UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK";
export const UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK = "UI/BETSLIP_EXC_UNMATCHED_DONE_CLICK";
export const UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK = "UI/BETSLIP_EXC_UNMATCHED_UPDATE_CLICK";
export const UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK = "UI/BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK";
export const UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK = "UI/BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK";

export const UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION =
  "BETSLIP/DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION";

export const UI__BETSLIP_SET_COLLAPSE_ACTION = "BETSLIP/SET_COLLAPSE_ACTION";
export const UI__BETSLIP_COLLAPSE_ACTION = "BETSLIP/COLLAPSE_ACTION";
export const UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE = "BETSLIP/SET_LAST_SUCCESSFUL_STAKE";
export const UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS = "BETSLIP/PP_BET_BUILDER_ADD_SELECTIONS";
export const UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS = "BETSLIP/PP_BET_BUILDER_REMOVE_SELECTIONS";

export const NETWORK__PLACE_EXC_BET_IN_PROGRESS = "NETWORK/PLACE_EXC_BET_IN_PROGRESS";
export const NETWORK__PLACE_EXC_BET_SUCCESS = "NETWORK/PLACE_EXC_BET_SUCCESS";

export const NETWORK__PLACE_EXC_BET_FAILURE = "NETWORK/PLACE_EXC_BET_FAILURE";
export const NETWORK__PLACE_EXC_BET_AUTH_FAILURE = "NETWORK/PLACE_EXC_BET_AUTH_FAILURE";

export const NETWORK__UPDATE_EXC_BET_IN_PROGRESS = "NETWORK/UPDATE_EXC_BET_IN_PROGRESS";
export const NETWORK__UPDATE_EXC_BET_SUCCESS = "NETWORK/UPDATE_EXC_BET_SUCCESS";
export const NETWORK__UPDATE_EXC_BET_FAILURE = "NETWORK/UPDATE_EXC_BET_FAILURE";

export const NETWORK__PLACE_SBK_BET_IN_PROGRESS = "NETWORK/PLACE_SBK_BET_IN_PROGRESS";
export const NETWORK__PLACE_SBK_BET_SUCCESS = "NETWORK/PLACE_SBK_BET_SUCCESS";
export const NETWORK__PLACE_SBK_BET_FAILURE = "NETWORK/PLACE_SBK_BET_FAILURE";
export const NETWORK__PLACE_SBK_BET_AUTH_FAILURE = "NETWORK/PLACE_SBK_BET_AUTH_FAILURE";

export const NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS = "NETWORK/COMBINE_SBK_BET_IN_PROGRESS";
export const NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS = "NETWORK/COMBINE_SBK_BET_SUCCESS";
export const NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE = "NETWORK/COMBINE_SBK_BET_FAILURE";
export const NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE = "NETWORK/COMBINE_SBK_BET_AUTH_FAILURE";

export const NETWORK__OBB_PLACE_BET_IN_PROGRESS = "NETWORK/OBB_PLACE_BET_IN_PROGRESS";
export const NETWORK__OBB_PLACE_BET_FAILURE = "NETWORK/OBB_PLACE_BET_FAILURE";
export const NETWORK__OBB_PLACE_BET_SUCCESS = "NETWORK/OBB_PLACE_BET_SUCCESS";
export const NETWORK__OBB_PLACE_BET_REQUEST_FAILURE = "NETWORK/OBB_PLACE_BET_REQUEST_FAILURE";
export const NETWORK__OBB_QUOTES_UPDATE_IN_PROGRESS = "NETWORK/OBB_QUOTES_UPDATE_IN_PROGRESS";
export const NETWORK__OBB_IMPLY_BETS_IN_PROGRESS = "NETWORK/OBB_IMPLY_BETS_IN_PROGRESS";
export const NETWORK__OBB_IMPLY_BETS_SUCCESS = "NETWORK/OBB_IMPLY_BETS_SUCCESS";
export const NETWORK__OBB_IMPLY_BETS_REQUEST_FAILURE = "NETWORK/OBB_IMPLY_BETS_REQUEST_FAILURE";
export const NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS = "NETWORK/OBB_FETCH_LEG_QUOTES_SUCCESS";
export const NETWORK__OBB_FETCH_LEG_QUOTES_FAILURE = "NETWORK/OBB_FETCH_LEG_QUOTES_FAILURE";

export const NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS = "NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS";
export const NETWORK__SEARCH_EXC_ORDERS_SUCCESS = "NETWORK/SEARCH_EXC_ORDERS_SUCCESS";
export const NETWORK__SEARCH_EXC_ORDERS_FAILURE = "NETWORK/SEARCH_EXC_ORDERS_FAILURE";

export const NETWORK__CANCEL_EXC_BET_IN_PROGRESS = "NETWORK/CANCEL_EXC_BET_IN_PROGRESS";
export const NETWORK__CANCEL_EXC_BET_SUCCESS = "NETWORK/CANCEL_EXC_BET_SUCCESS";
export const NETWORK__CANCEL_EXC_BET_FAILURE = "NETWORK/CANCEL_EXC_BET_FAILURE";
export const NETWORK__CANCEL_EXC_BET_AUTH_FAILURE = "NETWORK/CANCEL_EXC_BET_AUTH_FAILURE";

export const NETWORK__IMPLY_EXC_BET_IN_PROGRESS = "NETWORK/IMPLY_EXC_BET_IN_PROGRESS";
export const NETWORK__IMPLY_EXC_BET_SUCCESS = "NETWORK/IMPLY_EXC_BET_SUCCESS";
export const NETWORK__IMPLY_EXC_BET_FAILURE = "NETWORK/IMPLY_EXC_BET_FAILURE";
export const NETWORK__IMPLY_EXC_BET_AUTH_FAILURE = "NETWORK/IMPLY_EXC_BET_AUTH_FAILURE";

export const NETWORK__EXC_BY_MARKET_AUTH_FAILURE = "NETWORK/EXC_BY_MARKET_AUTH_FAILURE";

export const UI__OPEN_COMBINATIONS_LIST = "UI/OPEN_COMBINATIONS_LIST";
export const NETWORK__FETCH_COMBINATIONS_LIST_IN_PROGRESS = "NETWORK/FETCH_COMBINATIONS_LIST_IN_PROGRESS";
export const NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS = "NETWORK/FETCH_COMBINATIONS_LIST_SUCCESS";
export const NETWORK__FETCH_COMBINATIONS_LIST_FAILURE = "NETWORK/FETCH_COMBINATIONS_LIST_FAILURE";

export const UI__BETSLIP_OPEN = "UI/BETSLIP_OPEN";
export const UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION = "UI/BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION";
export const UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION = "UI/BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION";

export type SportsbookImplyError = "TECHNICAL" | "GENERAL";

export type BetslipBetBuilderAddSelectionsAction = {
  type: typeof UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS;
  payload: {
    cardUrn: URN;
    selection: { marketUrn: string; runnerUrn: string; uniqueId: string };
    odds?: SportsbookOdds;
    cardMetadata?: CardTrackingMetadata;
  };
};

export type BetslipBetBuilderRemoveSelectionsAction = {
  type: typeof UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS;
  payload: { cardUrn: URN; selection: { marketUrn: string; runnerUrn: string } };
};

export type BetslipExchangePriceNudgePayload = {
  runner: URN;
  side: ExchangeSide;
};

export type BetslipIncrementByQuickStakePayload = {
  increment: number;
  currencySymbol?: string;
};

export type BetslipExchangeBonusPayload = {
  isFreeBetsSelected: boolean;
  product: Product;
};

type PotentialBetChangePayload = {
  runner: URN;
  side: ExchangeSide;
  price?: number;
  size?: number;
};

export type BetslipExchangePriceInputChangeAction = {
  type: typeof UI__BETSLIP_EXC_PRICE_INPUT_CHANGE;
  payload: PotentialBetChangePayload;
};

export type BetslipExchangePriceInputBlurAction = {
  type: typeof UI__BETSLIP_EXC_PRICE_INPUT_BLUR;
  payload: PotentialBetChangePayload;
};

export type BetslipExchangeSizeInputChangeAction = {
  type: typeof UI__BETSLIP_EXC_SIZE_INPUT_CHANGE;
  payload: PotentialBetChangePayload;
};

export type BetslipExchangeBonusChangeAction = {
  type: typeof UI__BETSLIP_EXC_BONUS_CHANGE;
  payload: BetslipExchangeBonusPayload;
};

export type BetslipExchangePriceNudgeUpClickAction = {
  type: typeof UI__BETSLIP_EXC_PRICE_NUDGE_UP;
  payload: BetslipExchangePriceNudgePayload;
};

export type BetslipExchangePriceNudgeDownClickAction = {
  type: typeof UI__BETSLIP_EXC_PRICE_NUDGE_DOWN;
  payload: BetslipExchangePriceNudgePayload;
};

export type BetslipExchangePlaceBetClickAction = {
  type: typeof UI__BETSLIP_EXC_PLACE_BET_CLICK;
  payload: { runner: URN; confirmFirst: boolean };
};

export type BetslipExchangePlaceBetClickAutoConfirm = {
  type: typeof UI__BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM;
  payload: { runner: URN };
};

export type BetslipExchangeIncrementSizeAction = {
  type: typeof UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION;
  payload: BetslipIncrementByQuickStakePayload;
};

export type BetslipSportsbookIncrementStakeAction = {
  type: typeof UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION;
  payload: BetslipIncrementByQuickStakePayload;
};

export type BetslipExchangeRemovePotentialBetClickAction = {
  type: typeof UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK;
  payload: { runner: URN };
};

export type BetslipSportsbookRemoveLegClick = {
  type: typeof UI__BETSLIP_SBK_REMOVE_LEG_CLICK;
  payload: {
    legId: string;
    runnerUrn: string;
  };
};

export type BetslipSportsbookRemoveBoostedCombinationClick = {
  type: typeof UI__BETSLIP_SBK_REMOVE_BOOSTED_COMBINATION_CLICK;
  payload: {
    legIds: string[];
  };
};

export type BetslipSportsbookPlaceBetsClick = {
  type: typeof UI__BETSLIP_SBK_PLACE_BETS_CLICK;
};

export type BetslipSportsbookPlaceBetsAutoConfirm = {
  type: typeof UI__BETSLIP_SBK_PLACE_BETS_CLICK_AUTO_CONFIRM;
};

export type BetslipSportsbookStakeInputChange = {
  type: typeof UI__BETSLIP_SBK_STAKE_INPUT_CHANGE;
  payload: {
    combinationId: string;
    stake?: number;
  };
};

export type BetslipSportsbookMultipleBetTypeClick = {
  type: typeof UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK;
  payload: {
    combinationId: string;
  };
};

export type BetslipSportsbookCastBetChange = {
  type: typeof UI__BETSLIP_SBK_CAST_BET_CHANGE;
  payload: {
    castId: string;
    combinationId: string;
  };
};

export type BetslipSportsbookConfirmCastBetChange = {
  type: typeof UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE;
  payload: {
    castId: string;
    combinationId: string;
  };
};

export type BetslipSportsbookCastBetOrderChange = {
  type: typeof UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE;
  payload: {
    combinationId: string;
    updatedRunnerId: string;
  };
};

export type BetslipSportsbookMultiplesRemoveSelectionsClick = {
  type: typeof UI__BETSLIP_SBK_MULTIPLES_REMOVE_SELECTIONS;
};

export type BetslipSportsbookRemoveSelectionsClick = {
  type: typeof UI__BETSLIP_SBK_REMOVE_SELECTIONS;
};

export type BetslipHeaderClickAction = {
  type: typeof UI__BETSLIP_HEADER_CLICK;
  payload: {
    isCollapsed: boolean;
    betslipSubType: BetslipSubType;
  };
};

export type BetslipBetBuilderMultisDismissNotificationAction = {
  type: typeof UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION;
};

export type BetslipCollapseToggleAction = {
  type: typeof UI__BETSLIP_SET_COLLAPSE_ACTION;
  payload: {
    collapse: boolean;
  };
};

export type BetslipCollapseAction = {
  type: typeof UI__BETSLIP_COLLAPSE_ACTION;
};

export type BetslipSetLastSuccessfulStakeAction = {
  type: typeof UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE;
  payload: {
    stake: number;
  };
};

export type BetslipCloseAction = {
  type: typeof UI__BETSLIP_CLOSE_CLICK;
};

export type BetslipAccordionHeaderClick = {
  type: typeof UI__BETSLIP_ACCORDION_HEADER_CLICK;
  payload: { isExpanded: boolean };
};

export type BetslipSportsbookTabSwitchAction = {
  type: typeof UI__BETSLIP_SBK_TAB_SWITCH;
  payload: { tabName: string };
};

export type BetslipSportsbookConfirmBetsClick = {
  type: typeof UI__BETSLIP_SBK_CONFIRM_BETS_CLICK;
};

export type BetslipSportsbookEditBetsClick = {
  type: typeof UI__BETSLIP_SBK_EDIT_BETS_CLICK;
};

export type BetslipExchangeMatchedPanelDoneClickAction = {
  type: typeof UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK;
};

export type BetslipExchangeReportBetEditClickAction = {
  type: typeof UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK;
  payload: {
    betId: string;
    isPersistenceTypeMenuExpanded: boolean;
    betOriginURL: string;
  };
};

// EXC Confirm Panel
export type BetslipExchangeConfirmBetsClickAction = {
  type: typeof UI__BETSLIP_EXC_CONFIRM_BET_CLICK;
  payload: {
    runner: URN;
  };
};

export type BetslipExchangeConfirmPanelBackClickAction = {
  type: typeof UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK;
};

// Edit unmatched bet types
export type BetslipExchangeRemoveUnmatchedBetPayload = {
  side: ExchangeSide;
};

export type BetslipExchangeUnmatchedNudgePayload = {
  runner: URN;
  betId: string;
  side: ExchangeSide;
};

export type BetslipExchangeCancelUnmatchedBetPayload = {
  instructions: {
    betIds: string[];
    runner: URN;
  };
};

type UnmatchedBetChangePayload = {
  runner: URN;
  side: ExchangeSide;
  price?: number;
  size?: number;
};

export type BetslipExchangeUnmatchedPriceInputChangeAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE;
  payload: UnmatchedBetChangePayload;
};

export type BetslipExchangeUnmatchedPriceInputBlurAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR;
  payload: UnmatchedBetChangePayload;
};

export type BetslipExchangeUnmatchedSizeInputChangeAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE;
  payload: UnmatchedBetChangePayload;
};

export type BetslipExchangeUnmatchedPriceNudgeUpClickAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP;
  payload: BetslipExchangeUnmatchedNudgePayload;
};

export type BetslipExchangeUnmatchedPriceNudgeDownClickAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN;
  payload: BetslipExchangeUnmatchedNudgePayload;
};

export type BetslipExchangeUnmatchedCancelClickAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK;
  payload: BetslipExchangeCancelUnmatchedBetPayload;
};

export type BetslipExchangeUnmatchedDoneClickAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK;
};

export type BetslipExchangeUnmatchedUpdateClickAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK;
  payload: {
    betId: string;
    market: URN;
    runner: URN;
    betOriginURL: string | null;
  };
};

export type BetslipExchangeUnmatchedPersistenceListClickAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK;
  payload: {
    betId: string;
    isPersistenceTypeMenuExpanded: boolean;
  };
};

export type BetslipExchangeUnmatchedPersistenceItemClickAction = {
  type: typeof UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK;
  payload: {
    betId: string;
    persistenceType: ExchangePersistenceType;
  };
};

export type BetslipSportsbookReceiptBetIdCopyAction = {
  type: typeof UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY;
};

export type BetslipSportsbookReceiptRegulatorBetIdCopyAction = {
  type: typeof UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY;
};

export type BetslipObbReceiptPanelDoneClickAction = {
  type: typeof UI__BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK;
};

export type BetslipObbNotificationShownAction = {
  type: typeof UI__BETSLIP_OBB_NOTIFICATION_SHOWN;
  payload: {
    label: string;
  };
};

export type BetslipObbMaxPayoutNotificationUrlClickAction = {
  type: typeof UI__BETSLIP_OBB_MAX_PAYOUT_NOTIFICATION_URL_CLICK;
  payload: {
    url: string;
  };
};

export type PlaceSportsbookBetSuccessPayload = {
  report: BetslipSportsbookReport;
};

export type PlaceSportsbookBetSuccessAction = {
  type: typeof NETWORK__PLACE_SBK_BET_SUCCESS;
  payload: PlaceSportsbookBetSuccessPayload;
};

export type PlaceObbBetSuccessAction = {
  type: typeof NETWORK__OBB_PLACE_BET_SUCCESS;
  payload: BetslipObbReport;
};

export type PlaceObbBetInProgressAction = {
  type: typeof NETWORK__OBB_PLACE_BET_IN_PROGRESS;
};

export type PlaceObbBetFailureAction = {
  type: typeof NETWORK__OBB_PLACE_BET_FAILURE;
  payload: {
    betPlacementResponse: BetslipObbPlaceBetResponseData;
  };
};

export type ImplyObbBetsInProgressAction = {
  type: typeof NETWORK__OBB_IMPLY_BETS_IN_PROGRESS;
};

export type ImplyObbBetsSuccessAction = {
  type: typeof NETWORK__OBB_IMPLY_BETS_SUCCESS;
  payload: {
    implyBetsResponse: BetslipObbImplyBetsResponse;
  };
};

export type PlaceSportsbookBetInProgressAction = {
  type: typeof NETWORK__PLACE_SBK_BET_IN_PROGRESS;
};

export type PlaceSportsbookBetFailureAction = {
  type: typeof NETWORK__PLACE_SBK_BET_FAILURE;
  payload: {
    isTechnical: boolean;
    error: SportsbookTransactionalError;
  };
};

export type PlaceSportsbookBetAuthFailureAction = {
  type: typeof NETWORK__PLACE_SBK_BET_AUTH_FAILURE;
};

export type SportsbookCombinationsUpdateInProgressAction = {
  type: typeof NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS;
};

export type SportsbookCombinationsUpdateSuccessAction = {
  type: typeof NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS;
  payload: {
    combinations: ImplyResponse.ImplyBetsResult[];
  };
};

export type SportsbookCombinationsUpdateAuthFailureAction = {
  type: typeof NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE;
};

export type SportsbookCombinationsUpdateFailureAction = {
  type: typeof NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE;
  payload: {
    error: SportsbookImplyError;
  };
};

export type BetslipRemoveSelectionAction = BetslipSportsbookRemoveLegClick | BettingSportsbookRemoveLegAction;

export type BetslipIncrementByQuickStakeAction =
  | BetslipSportsbookIncrementStakeAction
  | BetslipExchangeIncrementSizeAction
  | BettingSportsbookIncrementStakeAction
  | BettingExchangeIncrementSizeAction;

export type BetslipSportsbookStakeChangeAction =
  | BetslipSportsbookStakeInputChange
  | BettingSportsbookUpdateCombinationStakeAction;

export type BetslipSportsbookOddsMovementPrefChange = {
  type: typeof UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE;
  payload: {
    isOddsMovementAccepted: boolean;
  };
};

export type BetslipSportsbookEachWayToggleAction = {
  type: typeof UI__BETSLIP_SBK_EACH_WAY_TOGGLE;
  payload: {
    isSelected: boolean;
  };
};

export type BetslipSportsbookAccaInsuranceToggleAction = {
  type: typeof UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE;
  payload: {
    isSelected: boolean;
  };
};

export type BetslipSportsbookPriceBoostToggleAction = {
  type: typeof UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE;
  payload: {
    isSelected: boolean;
  };
};

export type BetslipSportsbookReAddSelectionsClickAction = {
  type: typeof UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK;
  payload: {
    numberOfSelections: number;
  };
};

export type BetslipSportsbookNotificationShownAction = {
  type: typeof UI__BETSLIP_SBK_NOTIFICATION_SHOWN;
  payload: {
    label: string;
  };
};

export type BetslipSportsbookMaxPayoutNotificationUrlClickAction = {
  type: typeof UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK;
  payload: {
    url: string;
  };
};

export type BetslipSportsbookLoginToPlaceBetClickAction = {
  type: typeof UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK;
};

export type BetslipSportsbookDepositToConfirmBetClick = {
  type: typeof UI__BETSLIP_SBK_DEPOSIT_TO_CONFIRM_BET_CLICK;
};

export type BetslipSportsbookDepositToPlaceBetClick = {
  type: typeof UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK;
};

export type BetslipExchangeLoginToPlaceBetClickAction = {
  type: typeof UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK;
  payload: {
    side: ExchangeSide;
  };
};

export type BetslipMaxPayoutNotificationAcceptedAction = {
  type: typeof UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED;
};

export type PlaceExchangeBetSuccessPayload = {
  report: BetslipExchangeReport;
  betId?: string;
};

export type UpdateExchangeBetSuccessPayload = {
  report: BetslipExchangeReport;
  betOriginURL: string | null;
};

export type PlaceExchangeBetSuccessAction = {
  type: typeof NETWORK__PLACE_EXC_BET_SUCCESS;
  payload: PlaceExchangeBetSuccessPayload;
};

export type PlaceExchangeBetInProgressAction = {
  type: typeof NETWORK__PLACE_EXC_BET_IN_PROGRESS;
};

export type PlaceExchangeBetFailureAction = {
  type: typeof NETWORK__PLACE_EXC_BET_FAILURE;
  payload: {
    error: ExchangeBetTransactionError;
    side: ExchangeSide;
  };
};

export type PlaceExchangeBetAuthFailureAction = {
  type: typeof NETWORK__PLACE_EXC_BET_AUTH_FAILURE;
};

export type SearchExchangeOrdersInProgressAction = {
  type: typeof NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS;
};

export type SearchExchangeOrdersSuccessAction = {
  type: typeof NETWORK__SEARCH_EXC_ORDERS_SUCCESS;
  payload: {
    report: BetslipExchangeReport;
    step?: BetslipStep;
    exchangeEdit?: BetslipExchangeEdit;
  };
};

export type SearchExchangeOrdersFailureAction = {
  type: typeof NETWORK__SEARCH_EXC_ORDERS_FAILURE;
};

export type CancelExchangeBetSuccessPayload = {
  report: BetslipExchangeReport;
};
export type CancelExchangeBetSuccessAction = {
  type: typeof NETWORK__CANCEL_EXC_BET_SUCCESS;
  payload: CancelExchangeBetSuccessPayload;
};

export type CancelExchangeBetInProgressAction = {
  type: typeof NETWORK__CANCEL_EXC_BET_IN_PROGRESS;
};

export type CancelExchangeBetFailureAction = {
  type: typeof NETWORK__CANCEL_EXC_BET_FAILURE;
  payload: {
    error: ExchangeBetTransactionError;
  };
};

export type CancelExchangeBetAuthFailureAction = {
  type: typeof NETWORK__CANCEL_EXC_BET_AUTH_FAILURE;
};

export type UpdateExchangeBetSuccessAction = {
  type: typeof NETWORK__UPDATE_EXC_BET_SUCCESS;
  payload: UpdateExchangeBetSuccessPayload;
};

export type UpdateExchangeBetInProgressAction = {
  type: typeof NETWORK__UPDATE_EXC_BET_IN_PROGRESS;
};

export type UpdateExchangeBetFailureAction = {
  type: typeof NETWORK__UPDATE_EXC_BET_FAILURE;
  payload: {
    error: ExchangeBetTransactionError;
  };
};

export type ImplyExchangeBetInProgressAction = {
  type: typeof NETWORK__IMPLY_EXC_BET_IN_PROGRESS;
};

export type ImplyExchangeBetSuccessAction = {
  type: typeof NETWORK__IMPLY_EXC_BET_SUCCESS;
  payload: ExchangeMarketBonus;
};

export type ImplyExchangeBetFailureAction = {
  type: typeof NETWORK__IMPLY_EXC_BET_FAILURE;
  payload: {
    error: ExchangeBetTransactionError;
  };
};

export type ImplyExchangeBetAuthFailureAction = {
  type: typeof NETWORK__IMPLY_EXC_BET_AUTH_FAILURE;
};

export type OpenCombinationsListAction = {
  type: typeof UI__OPEN_COMBINATIONS_LIST;
  payload: {
    combinationId: string;
    maxCombinations: number;
  };
};

export type FetchCombinationsListInProgressAction = {
  type: typeof NETWORK__FETCH_COMBINATIONS_LIST_IN_PROGRESS;
};

export type FetchCombinationsListSuccessAction = {
  type: typeof NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS;
  payload: {
    combinationId: string;
    response: CombinationResult;
  };
};

export type FetchCombinationsListFailureAction = {
  type: typeof NETWORK__FETCH_COMBINATIONS_LIST_FAILURE;
  payload: {
    error: string;
  };
};

export type FetchExchangeByMarketAuthFailure = {
  type: typeof NETWORK__EXC_BY_MARKET_AUTH_FAILURE;
};

export type BetslipOpenAction = {
  type: typeof UI__BETSLIP_OPEN;
  payload: {
    product: Product;
  };
};

export type BetslipExcRemovePotentialSelectionAction = {
  type: typeof UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION;
};

export type BetslipSbkRemovePotentialSelectionAction = {
  type: typeof UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION;
  payload: {
    urn: URN;
  };
};

export type ObbQuotesUpdateInProgressAction = {
  type: typeof NETWORK__OBB_QUOTES_UPDATE_IN_PROGRESS;
};

export type ObbQuotesUpdateSuccessAction = {
  type: typeof NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS;
  payload: {
    legsQuotes: BetslipObbQuotes;
    clearOnFailure?: boolean;
  };
};

export type ObbQuotesUpdateFailureAction = {
  type: typeof NETWORK__OBB_FETCH_LEG_QUOTES_FAILURE;
  payload: {
    error: any;
  };
};

export type ObbImplyBetsRequestFailureAction = {
  type: typeof NETWORK__OBB_IMPLY_BETS_REQUEST_FAILURE;
  payload: {
    error: any;
  };
};
