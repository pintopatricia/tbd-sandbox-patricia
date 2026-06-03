import { BUSINESS, DEVICE } from "./AnalyticsDimensions";
import { GenericEvent } from "./Event.types";

export type ClickLink = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
};

export type ClickLinkEvent = ClickLink & {
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

export type ClickNavigateToChannel = ClickLink & {
  [BUSINESS.DESTINATION_URL]: "/sport" | "/exchange";
};

export type MarketSwitch = GenericEvent & {
  [BUSINESS.SPORT_ID]: number | undefined;
  [BUSINESS.SPORT_NAME]: string;
  [BUSINESS.EVENT_ID]: number | null;
  [BUSINESS.EVENT_NAME]: string | null;
  [BUSINESS.MARKET_ID]: string;
  [BUSINESS.MARKET_NAME]: string;
  [BUSINESS.COMPETITION_ID]: number | null;
  [BUSINESS.COMPETITION_NAME]: string | null;
  [DEVICE.POSITION]: number | null;
};

export type NavigateToEventFromSport = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.SPORT_ID]: number | undefined;
  [BUSINESS.SPORT_NAME]: string;
  [BUSINESS.EVENT_ID]: number | undefined;
  [BUSINESS.EVENT_NAME]: string;
  [BUSINESS.COMPETITION_ID]: number | undefined;
  [BUSINESS.COMPETITION_NAME]: string;
  [BUSINESS.ANTEPOST_FLAG]: null;
  [BUSINESS.IN_PLAY_INDICATOR]: "yes" | "no";
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

export type NavigateFromMarketRules = ClickLink & {
  [DEVICE.POSITION]: null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null;
};

export type NavigateToMarketView = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

export type NavigateToView = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

export type NavigateToGameCategoryView = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: null;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

export type LaunchPrizeMachine = GenericEvent & {
  [BUSINESS.GAME_ID]: string | null;
  [BUSINESS.GAME_NAME]: string | null;
  [BUSINESS.GAME_PROVIDER]: string;
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number | null;
  [BUSINESS.GAME_STATE]: string | null;
  [BUSINESS.CMS_CARD_TITLE]: string | null;
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: string | null;
  [BUSINESS.CMS_COUPON_NAME]: string | null;
  [BUSINESS.PERSONALIZED]: string | null;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
  [BUSINESS.DECISION_MODEL_VARIANT]: string | null;
  [BUSINESS.DECISION_MODEL_NAME]: string | null;
};

export type LoadPrizeMachine = GenericEvent & {
  [BUSINESS.GAME_ID]: string | null;
  [BUSINESS.GAME_NAME]: string | null;
  [BUSINESS.ERROR_CODE]: string | null;
  [BUSINESS.GAME_PROVIDER]: string;
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number | null;
  [BUSINESS.DECISION_MODEL_VARIANT]: string | null;
  [BUSINESS.DECISION_MODEL_NAME]: string | null;
  [BUSINESS.SEARCH_TEXT]: string | null;
  [BUSINESS.GAME_STATE]: string | null;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

export type TAndCPrizeMachine = GenericEvent & {
  [BUSINESS.GAME_ID]: string | null;
  [BUSINESS.GAME_NAME]: string | null;
  [BUSINESS.GAME_PROVIDER]: string;
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.GAME_STATE]: string | null;
  [BUSINESS.CMS_CARD_TITLE]: string | null;
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: string | null;
  [BUSINESS.CMS_COUPON_NAME]: string | null;
  [BUSINESS.PERSONALIZED]: string | null;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
  [BUSINESS.DECISION_MODEL_VARIANT]: string | null;
  [BUSINESS.DECISION_MODEL_NAME]: string | null;
};

export type LoadPlayNew = GenericEvent & {
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
};

export type PlayNewClickToMoreInfoButtonAction = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string | undefined;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
};

export type PlayNewClickToPlayNowButtonAction = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string | undefined;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
};

export type NavigateToGameInfoView = GenericEvent & {
  [BUSINESS.GAME_ID]: string;
  [BUSINESS.GAME_NAME]: string;
  [BUSINESS.GAME_PROVIDER]: string;
  [BUSINESS.GAME_STATE]: undefined;
  [DEVICE.POSITION]: number | undefined;
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | undefined;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | undefined;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | undefined;
};

export type NavigateToCategoryUsingSeeAllButton = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | null;
};

export type NavigateToCategoryUsingMultifunctional = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number | undefined;
  [BUSINESS.GAME_ID]: undefined;
  [BUSINESS.GAME_NAME]: undefined;
};

export type LaunchGame = GenericEvent & {
  [BUSINESS.GAME_ID]: string;
  [BUSINESS.GAME_NAME]: string;
  [BUSINESS.GAME_PROVIDER]: string;
  [BUSINESS.GAME_STATE]: undefined;
  [DEVICE.POSITION]: number | undefined;
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | undefined;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | undefined;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | undefined;
  [BUSINESS.DATA_BRIDGE_PLATFORM]: string;
  [BUSINESS.DATA_BRIDGE_PROJECT]: string;
};

export type LaunchGameFromGameInfo = GenericEvent & {
  [BUSINESS.GAME_ID]: string;
  [BUSINESS.GAME_NAME]: string;
  [BUSINESS.GAME_PROVIDER]: string;
  [BUSINESS.GAME_STATE]: undefined;
  [DEVICE.POSITION]: number | undefined;
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | undefined;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | undefined;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | undefined;
  [BUSINESS.DATA_BRIDGE_PLATFORM]: string;
  [BUSINESS.DATA_BRIDGE_PROJECT]: string;
};

export type LaunchGameFromPN = GenericEvent & {
  [BUSINESS.GAME_ID]: string;
  [BUSINESS.GAME_NAME]: string;
  [BUSINESS.GAME_PROVIDER]: string;
  [BUSINESS.GAME_STATE]: undefined;
  [DEVICE.POSITION]: number | undefined;
  [BUSINESS.DESTINATION_URL]: string;
  [BUSINESS.ZONE_DISPLAY_ORDER]: number | undefined;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | undefined;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | undefined;
  [BUSINESS.DATA_BRIDGE_PLATFORM]: string;
  [BUSINESS.DATA_BRIDGE_PROJECT]: string;
};

export type BottomBarNavigation = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
};

export type ContentSummary = GenericEvent & {
  [BUSINESS.CMS_CARD_TITLE]: null;
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null;
  [BUSINESS.CMS_COUPON_NAME]: null;
};

export type GenericPressNavigationTo = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

export type BetslipPopularBetBuilderNavigationAction = ContentSummary & {
  [BUSINESS.DESTINATION_URL]: string;
  [DEVICE.POSITION]: number | null;
};
