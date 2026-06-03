import { GenericEvent } from "./Event.types";
import { BUSINESS, DEVICE } from "./AnalyticsDimensions";
import { ExchangeBetTransactionErrorCode } from "../betting/ExchangeBetTransactionError.types";
import { YesNo } from "./AnalyticsConstants";

type BetDirection = "back" | "lay";
export type BetResponse = "unmatched" | "matched" | "partially-matched" | "sp";

export type Selection = {
  [BUSINESS.SELECTION_ID]: number;
  [BUSINESS.SELECTION_NAME]: string;
  [BUSINESS.SELECTION_SOURCE_URL]: string | null;
  [BUSINESS.ANTEPOST_FLAG]: YesNo;
  [BUSINESS.IN_PLAY_INDICATOR]: YesNo;
  [BUSINESS.BET_DIRECTION]: BetDirection;
  [BUSINESS.PRICE_AT_SELECTION]: number | null;
};

export type RunnerMetrics = MarketHierarchyMetrics & {
  [BUSINESS.SELECTION_ID]: number;
  [BUSINESS.SELECTION_NAME]: string;
  [BUSINESS.ANTEPOST_FLAG]: YesNo;
  [BUSINESS.IN_PLAY_INDICATOR]: YesNo;
  [BUSINESS.MARKET_ID]: string;
  [BUSINESS.MARKET_NAME]: string;
  [BUSINESS.SPORT_ID]: number;
  [BUSINESS.SPORT_NAME]: string;
};

export type MarketHierarchyMetrics = RacingHierarchyMetrics | EventCompetitionHierarchyMetrics | EventHierarchyMetrics;

export type EventCompetitionHierarchyMetrics = {
  [BUSINESS.EVENT_ID]: number | string;
  [BUSINESS.EVENT_NAME]: string;
  [BUSINESS.COMPETITION_ID]: number | string;
  [BUSINESS.COMPETITION_NAME]: string;
};

export type RacingHierarchyMetrics = {
  [BUSINESS.RACE_ID]: number | string;
  [BUSINESS.RACE_NAME]: string;
  [BUSINESS.MEETING_ID]: number | string;
  [BUSINESS.MEETING_NAME]: string;
};

export type EventHierarchyMetrics = {
  [BUSINESS.EVENT_ID]: number | string;
  [BUSINESS.EVENT_NAME]: string;
  [BUSINESS.COMPETITION_ID]: number | string | null;
  [BUSINESS.COMPETITION_NAME]: string | null;
};

export type BetMetrics = RunnerMetrics &
  Selection & {
    [BUSINESS.CURRENCY_CODE]: string;
    [BUSINESS.BET_ID]: string | undefined;
    [BUSINESS.BET_RESPONSE]: BetResponse | undefined;
  };

type AddSelection = GenericEvent &
  MarketHierarchyMetrics &
  Selection & {
    [BUSINESS.MARKET_ID]: string;
    [BUSINESS.MARKET_NAME]: string;
    [DEVICE.POSITION]?: number | null;
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]?: number | null;
    [BUSINESS.TRANS_CASHOUT_INDICATOR]?: number | null;
    [BUSINESS.SELECTION_UNIQUE_ID]: string;
  };

export type ClickEdit = Omit<AddSelection, BUSINESS.SELECTION_UNIQUE_ID> & {
  [BUSINESS.CURRENCY_CODE]: string;
  [BUSINESS.SPORT_ID]: number;
  [BUSINESS.SPORT_NAME]: string;
  [BUSINESS.BET_ID]: string;
  [BUSINESS.BET_RESPONSE]: string;
  [BUSINESS.MODULE_OF_SELECTION]: string;
};

export type UpdateBet = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: BetDirection;
  [BUSINESS.ERROR_CODE]?: ExchangeBetTransactionErrorCode;
};

export type EditSuccessfull = ClickEdit & {
  [BUSINESS.PRICE_AT_BET]: number;
  [BUSINESS.CASHOUT_INDICATOR]: boolean;
  [BUSINESS.STAKE_AMOUNT]: number;
};

export type CancelBet = GenericEvent & {
  [BUSINESS.BET_DIRECTION]?: BetDirection;
  [BUSINESS.ERROR_CODE]?: ExchangeBetTransactionErrorCode;
};

export type ConfirmBet = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: BetDirection;
};

export type LoginToPlaceBetEvent = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: BetDirection;
  [BUSINESS.ERROR_CODE]: string | null;
};

export type MyBetsEditClick = ConfirmBet;

export type PriceChange = GenericEvent &
  Omit<RunnerMetrics, BUSINESS.ANTEPOST_FLAG> & {
    [BUSINESS.BET_TYPE]: string;
    [BUSINESS.CASHOUT_INDICATOR]: YesNo;
    [BUSINESS.BET_TYPE_GROUP]: string;
    [BUSINESS.CONFIRM_BETS_INDICATOR]: YesNo;
    [BUSINESS.BET_DIRECTION]: BetDirection;
  };

type CMSType = {
  [BUSINESS.CMS_CARD_TITLE]: string | null;
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: string | null;
  [BUSINESS.CMS_COUPON_NAME]: string | null;
};

export type BetslipPopularBetBuilderAddSelectionAction = GenericEvent &
  AddSelection &
  CMSType & {
    [BUSINESS.MODULE_OF_SELECTION]: string | null;
  };
