import { BUSINESS, DEVICE } from "./AnalyticsDimensions";
import { BetDirection, BetTypeGroup, CashoutType, YesNo } from "./AnalyticsConstants";
import { GenericEvent } from "./Event.types";
import { BetResponse, MarketHierarchyMetrics } from "./Betting.types";
import { BetType } from "../constants";

export type SportsbookRemoveSelection = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: BetDirection.Back;
};

export type ExchangeRemoveSelection = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: BetDirection;
};

export type ExchangePlaceBet = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: BetDirection;
};

export type ExchangeSuccessPlaceBet = GenericEvent & {
  [BUSINESS.CURRENCY_CODE]: string;
  [BUSINESS.BET_ID]: string;
  [BUSINESS.BET_TYPE_GROUP]: string;
  [BUSINESS.BET_TYPE]: string;
  [BUSINESS.CONFIRM_BETS_INDICATOR]: YesNo;
};

export type ExchangeSuccessPlaceBetSelection = GenericEvent &
  MarketHierarchyMetrics & {
    [BUSINESS.CURRENCY_CODE]: string;
    [BUSINESS.BET_ID]: string;
    [BUSINESS.SPORT_ID]: number;
    [BUSINESS.SPORT_NAME]: string;
    [BUSINESS.MARKET_ID]: string;
    [BUSINESS.MARKET_NAME]: string;
    [BUSINESS.SELECTION_ID]: number;
    [BUSINESS.SELECTION_NAME]: string;
    [BUSINESS.ANTEPOST_FLAG]: string;
    [BUSINESS.BET_DIRECTION]: string;
    [BUSINESS.BET_RESPONSE]: BetResponse | undefined;
    [BUSINESS.PRICE_AT_BET]: number | undefined;
    [BUSINESS.IN_PLAY_INDICATOR]: YesNo;
    [BUSINESS.EACHWAY_INDICATOR]: YesNo;
    [BUSINESS.SELECTION_UNIQUE_ID]: string;
  };

export type ExchangeFailedPlaceBet = ExchangePlaceBet & {
  [BUSINESS.ERROR_CODE]: string;
};

export type SportsbookPlaceBet = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: BetDirection.Back;
};

export type SportsbookSuccessPlaceBet = GenericEvent & {
  [BUSINESS.CURRENCY_CODE]: string;
  [BUSINESS.BET_ID]: string;
  [BUSINESS.BET_RECEIPT]: string;
  [BUSINESS.BET_TYPE_GROUP]: BetTypeGroup;
  [BUSINESS.BET_TYPE]: string;
  [BUSINESS.CONFIRM_BETS_INDICATOR]: YesNo;
  [BUSINESS.ACCEPT_ODDS_INDICATOR]: YesNo;
  [BUSINESS.ACCA_EDGE_INDICATOR]: YesNo;
};

export type SportsbookFailedPlaceBet = SportsbookPlaceBet & {
  [BUSINESS.ERROR_CODE]: string;
};

export type SportsbookSuccessPlaceSelection = SportsbookPlaceBet &
  MarketHierarchyMetrics & {
    [BUSINESS.CURRENCY_CODE]: string;
    [BUSINESS.SPORT_ID]: number;
    [BUSINESS.SPORT_NAME]: string;
    [BUSINESS.MARKET_ID]: string;
    [BUSINESS.MARKET_NAME]: string;
    [BUSINESS.SELECTION_ID]: number;
    [BUSINESS.SELECTION_NAME]: string;
    [BUSINESS.ANTEPOST_FLAG]: YesNo;
    [BUSINESS.IN_PLAY_INDICATOR]: YesNo;
    [BUSINESS.BET_ID]: string;
    [BUSINESS.BET_RECEIPT]: string;
    [BUSINESS.BET_RESPONSE]: string;
    [BUSINESS.EACHWAY_INDICATOR]: YesNo;
    [BUSINESS.PRICE_AT_BET]: number;
    [BUSINESS.ACCA_EDGE_INDICATOR]: YesNo;
    [BUSINESS.EW_EDGE_INDICATOR]: YesNo;
    [BUSINESS.PRICE_BOOST_INDICATOR]: YesNo;
    [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: YesNo;
    [BUSINESS.SELECTION_UNIQUE_ID]: string;
    [BUSINESS.STAKE_AMOUNT]: number;
  };

export type NavigateToSearchLink = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number;
};
export type NavigateFromAzSearchLink = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
};

export type NavigateFromUserProfileLink = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
};

export type MarketRulesToggleModalEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type ToggleRunnerInfoEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type ToggleRunnerInfoTabsEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type ToggleExpandableCardGroupEvent = GenericEvent & {
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type ToggleTimeFormEvent = GenericEvent & {
  [BUSINESS.SPORT_ID]: number | undefined;
  [BUSINESS.SPORT_NAME]: string | undefined;
  [BUSINESS.RACE_ID]: string | undefined;
  [BUSINESS.RACE_NAME]: string | undefined;
  [BUSINESS.MEETING_ID]: string | undefined;
  [BUSINESS.MEETING_NAME]: string | undefined;
  [BUSINESS.ANTEPOST_FLAG]: YesNo;
  [BUSINESS.IN_PLAY_INDICATOR]: YesNo;
  [BUSINESS.BET_DIRECTION]: null;
  [BUSINESS.CMS_CARD_TITLE]: null;
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null;
  [BUSINESS.CMS_COUPON_NAME]: null;
  [BUSINESS.PROVIDER_NAME]: string;
};

export type MarketGraphSelectViewEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type MarketGraphSelectGraphEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type MarketDepthClickEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type MarketTemplatePebbleSelection = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type BetslipSbkConfirmRemoveAllSelections = GenericEvent & {
  [BUSINESS.BET_DIRECTION]: "back" | "lay";
  [BUSINESS.ERROR_CODE]: null;
};

export type PromotionClickEvent = GenericEvent & {
  [DEVICE.POSITION]: number | null;
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
  [BUSINESS.CMS_CARD_TITLE]: string | null;
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: number | null;
  [BUSINESS.CMS_BADGE]: string | null;
};

export type LoyaltyPromotionOptInTapEvent = GenericEvent & {
  [BUSINESS.PROMOTION_ID]: string | null;
  [BUSINESS.PROMOTION_NAME]: string | null;
};

export type LoyaltyPromotionCTATapEvent = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
};

export type BetslipActivateBonus = GenericEvent & {
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
  [DEVICE.POSITION]: null;
};

export type SettingsTabsNavigation = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
};

export type BetslipEachWayToggle = GenericEvent & {
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
  [DEVICE.POSITION]: null;
};

export type BetslipAccaInsuranceToggle = GenericEvent & {
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
  [DEVICE.POSITION]: null;
};

export type BetslipCastBetChangeEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type BetslipCastBetOrderChangeEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type SwitcherEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type NavigationTabClickEvent = GenericEvent & {
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type CashoutBaseEvents = GenericEvent & {
  [BUSINESS.CASHOUT_INDICATOR]: YesNo;
};

export type ExcMarketCashoutEvents = {
  [BUSINESS.MARKET_ID]: string;
  [BUSINESS.MARKET_NAME]: string | null;
  [BUSINESS.EVENT_ID]: string;
  [BUSINESS.EVENT_NAME]: string;
};

export type SbkCashoutEvent = CashoutBaseEvents & {
  [BUSINESS.BET_ID]: string;
  [BUSINESS.BET_RECEIPT]: string;
  [BUSINESS.BET_TYPE_GROUP]: BetTypeGroup;
  [BUSINESS.BET_TYPE]: BetType;
  [BUSINESS.CASHOUT_TYPE]: CashoutType;
  [BUSINESS.CASHOUT_AMOUNT]: number | undefined;
  [BUSINESS.NUMBER_OF_LEGS]: number;
  [BUSINESS.NUMBER_OF_SELECTIONS]: number;
  [BUSINESS.STAKE_AMOUNT]: number | undefined;
};

export type ExcCashoutEvent = CashoutBaseEvents &
  ExcMarketCashoutEvents & {
    [BUSINESS.CASHOUT_TYPE]: CashoutType;
    [BUSINESS.CASHOUT_AMOUNT]: number | undefined;
    [BUSINESS.CASHOUT_PROFIT_AMOUNT]: number | undefined;
  };

export type ToggleMarketGraphEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type ToggleRecentRacesEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type ToggleRaceReplaysEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type ToggleShowMoreEvent = GenericEvent & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type NextRacesRaceClickEvent = GenericEvent & {
  [DEVICE.POSITION]: number | null;
};

export type StatisticsModalToggleEvent = GenericEvent & {
  [DEVICE.POSITION]: number | null;
};
