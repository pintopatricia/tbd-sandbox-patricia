import { CountriesFilterOption } from "../clients/catalogue/catalogue-response-types";
import { PlatformType, TaggingAction } from "../middlewares/tagging-resolvers/AnalyticsConstants";
import { Product } from "../state/entities/user-preferences/UserPreferences.types";
import { Layouts } from "../state/layout";
import {
  CompetitionOption,
  DateRangeFilterOption,
  FilteredGroupSort,
  MarketTypeFilterOption,
} from "../state/layout/cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import { MonthFilterOption } from "../state/layout/cardgroups/future-racing-cardgroups/FutureRacingCardgroups.types";
import URN from "../state/layout/URN";
import { ViewLink } from "../state/layout/views/ViewLink.types";
import { UI__LAUNCH_GAME } from "./navigation";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

export const APP_VISIBILITY_CHANGE = "APP_VISIBILITY_CHANGE";
export const UI__MARKET_SWITCH_CLICK = "UI__MARKET_SWITCH_CLICK";
export const UI__USER_LOGOUT_CLICK = "UI__USER_LOGOUT_CLICK";
export const UI__MY_ACCOUNT_ICON_CLICK = "UI__MY_ACCOUNT_ICON_CLICK";
export const UI__CLICK_SWIMLANE = "UI__CLICK_SWIMLANE";
export const UI__MARKET_RULES_MODAL_TOGGLE = "UI__MARKET_RULES_MODAL_TOGGLE";
export const UI__TOGGLE_RUNNER_INFO = "UI__TOGGLE_RUNNER_INFO";
export const UI__TOGGLE_RUNNER_INFO_TABS = "UI__TOGGLE_RUNNER_INFO_TABS";
export const UI__TOGGLE_TIMEFORM_CARD = "UI__TOGGLE_TIMEFORM_CARD";
export const UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR = "UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR";
export const UI__CLICK_MARKET_GRAPH_MODE_SELECTOR = "UI__CLICK_MARKET_GRAPH_MODE_SELECTOR";
export const UI__CLICK_PEBBLE_ITEM = "UI__CLICK_PEBBLE_ITEM";
export const UI__CLICK_PROMOTION_CALL_TO_ACTION = "UI/CLICK_PROMOTION_CALL_TO_ACTION";
export const UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS = "UI/CLICK_PROMOTION_TERMS_AND_CONDITIONS";
export const UI__JACKPOT_MERCHANDISE_VIEW = "UI__JACKPOT_MERCHANDISE_VIEW";
export const UI__SWITCHER_OPEN = "UI__SWITCHER_OPEN";
export const UI__NAVIGATION_TAB_CLICK = "UI__NAVIGATION_TAB_CLICK";
export const UI__TOGGLE_RUNNERSLIST_CARD = "UI__TOGGLE_RUNNERSLIST_CARD";
export const UI__TOGGLE_EXPANDABLE_CARDGROUP = "UI__TOGGLE_EXPANDABLE_CARDGROUP";
export const UI__FILTER_OPEN = "UI__FILTER_OPEN";
export const UI__FILTER_CLOSE = "UI__FILTER_CLOSE";
export const UI__FILTER_APPLY = "UI__FILTER_APPLY";
export const UI__FILTERS_RESET_CLICK = "UI__FILTERS_RESET_CLICK";
export const UI__SELECTED_MARKET_SWITCHER = "UI__SELECTED_MARKET_SWITCHER";
export const UI__SELECTED_DATE_RANGE_FILTER_CHANGED = "UI__SELECTED_DATE_RANGE_FILTER_CHANGED";
export const UI__SELECTED_SORT_FILTER_CHANGED = "UI__SELECTED_SORT_FILTER_CHANGED";
export const UI__SELECTED_COMPETITIONS_FILTER_CHANGED = "UI__SELECTED_COMPETITIONS_FILTER_CHANGED";
export const UI__SELECTED_MONTH_FILTER_CHANGED = "UI__SELECTED_MONTH_FILTER_CHANGED";
export const UI__SELECTED_COUNTRIES_FILTER_CHANGED = "UI__SELECTED_COUNTRIES_FILTER_CHANGED";
export const SAW_CARD = "SAW_CARD";
export const UI__GRAPH_TOGGLE = "UI__GRAPH_TOGGLE";
export const UI__RECENT_RACE_TOGGLE = "UI__RECENT_RACE_TOGGLE";
export const UI__TOGGLE_SHOW_MORE_RUNNERS = "UI__TOGGLE_SHOW_MORE_RUNNERS";
export const UI__MARKET_BLURB_EXPAND_CLICK = "UI__MARKET_BLURB_EXPAND_CLICK";
export const UI__NEXT_RACES_RACE_CLICK = "UI__NEXT_RACES_RACE_CLICK";
export const UI__NEXT_RACES_RACE_FILTER_CLICK = "UI__NEXT_RACES_RACE_FILTER_CLICK";
export const UI__STATISTICS_MODAL_TOGGLE = "UI__STATISTICS_MODAL_TOGGLE";
export const UI__STATISTICS_ITEM_CLICK = "UI__STATISTICS_ITEM_CLICK";
export const UI__AZ_SWITCH_CLICK = "UI/AZ_SWITCH_CLICK";
export const UI__PROMO_DESCRIPTION_TOGGLE = "UI__PROMO_DESCRIPTION_TOGGLE";
export const UI__RACE_REPLAYS_TOGGLE = "UI__RACE_REPLAYS_TOGGLE";
export const UI__CONTENT_SUMMARY_COLLAPSE_EVENT = "UI__CONTENT_SUMMARY_COLLAPSE_EVENT";
export const UI__GENEROSITY_WALLET_BUTTON_CLICK = "UI__GENEROSITY_WALLET_BUTTON_CLICK";
export const UI__GENEROSITY_WALLET_CLOSE_CLICK = "UI__GENEROSITY_WALLET_CLOSE_CLICK";
export const UI__FREE_BETS_WALLET_TOGGLE_CLICK = "UI__FREE_BETS_WALLET_TOGGLE_CLICK";
export const UI__GENEROSITY_WALLET_PEBBLE_CLICK = "UI__GENEROSITY_WALLET_PEBBLE_CLICK";
export const HAMBURGER_MENU_OPEN = "HamburgerMenu/open";
export const HAMBURGER_MENU_CLOSE = "HamburgerMenu/close";
export const UI__GENEROSITY_WALLET_APPLY_BUTTON_CLICK = "UI__GENEROSITY_WALLET_APPLY_BUTTON_CLICK";
export const UI__BETSLIP_SLIDER_INTERACTION = "UI__BETSLIP_SLIDER_INTERACTION";
export const UI__BETSLIP_SLIDER_DISPLAYED = "UI__BETSLIP_SLIDER_DISPLAYED";

export enum FILTER_TYPE {
  SORT = "sortFilter",
  DATE_RANGE = "dateRangeFilter",
  MARKET_TYPE = "marketTypeFilter",
  COMPETITION = "competitionFilter",
  MONTHS = "monthFilter",
  COUNTRIES = "countriesFilter",
}

export type AppVisibilityChangeAction = {
  type: typeof APP_VISIBILITY_CHANGE;
  payload: {
    visible: boolean;
  };
};

export type ClickCardInsideSwimlanePayload = {
  swimlaneUrn?: string;
  cardUrn: string;
  href: string;
};

export type ClickSwimlane = {
  type: typeof UI__CLICK_SWIMLANE;
  payload: {
    swimlaneUrn: URN;
  };
};

export type ToggleRunnerInfo = {
  type: typeof UI__TOGGLE_RUNNER_INFO;
  payload: {
    isOpening: boolean;
    runnerName: string;
    marketName: string;
  };
};

export type ToggleRunnerInfoTabs = {
  type: typeof UI__TOGGLE_RUNNER_INFO_TABS;
  payload: {
    isDetailsTab: boolean;
  };
};

export type ToggleExpandableCardGroupAction = {
  type: typeof UI__TOGGLE_EXPANDABLE_CARDGROUP;
  payload: {
    urn: URN;
    isExpanded: boolean;
    title?: string;
  };
};

export type ToggleTimeformCard = {
  type: typeof UI__TOGGLE_TIMEFORM_CARD;
  payload: {
    isExpanded: boolean;
    raceUrn: URN;
  };
};

export type MarketSwitchAction = {
  type: typeof UI__MARKET_SWITCH_CLICK;
  payload: {
    /** The currently selected product tab */
    product: Product;
    /** The currently selected tab urn (if available) */
    selectedTabUrn?: URN;
    /** URN of the currenty selected market card / card group */
    cardUrn: URN;
  };
};

export type UserLogoutClickAction = {
  type: typeof UI__USER_LOGOUT_CLICK;
};

export type MyAccountIconClickAction = {
  type: typeof UI__MY_ACCOUNT_ICON_CLICK;
  payload: boolean;
};

export type MarketRulesModalToggleAction = {
  type: typeof UI__MARKET_RULES_MODAL_TOGGLE;
  payload: {
    open: boolean;
  };
};

export type MarketGraphSelectViewAction = {
  type: typeof UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR;
  payload: {
    label: string;
  };
};

export type MarketGraphSelectGraphAction = {
  type: typeof UI__CLICK_MARKET_GRAPH_MODE_SELECTOR;
  payload: {
    label: string;
  };
};

export type PebbleItemSelectionAction = {
  type: typeof UI__CLICK_PEBBLE_ITEM;
  payload: {
    cardGroupURN: URN;
    pebbleURN: URN;
    pebbleTypename: URN;
  };
};

export type PromotionClickPayload = {
  viewLink?: ViewLink;
  title: string;
  promotionUrn: URN;
  taggingAction: TaggingAction;
  isImsPromo?: boolean;
};

export type PromotionLaunchGameClickPayload = {
  href: string;
  gameUrn: string;
  cardUrn: string;
  platformType: PlatformType;
};

export type PromotionCallToActionClickAction = {
  type: typeof UI__CLICK_PROMOTION_CALL_TO_ACTION;
  payload: PromotionClickPayload;
};

export type PromotionTermsAndConditionsClickAction = {
  type: typeof UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS;
  payload: PromotionClickPayload;
};

export type PromotionLaunchGameClickAction = {
  type: typeof UI__LAUNCH_GAME;
  payload: PromotionLaunchGameClickPayload;
};

export type JackpotMerchandiseView = {
  type: typeof UI__JACKPOT_MERCHANDISE_VIEW;
  payload: {
    state: string;
    name: string;
    urn: URN;
    layouts: Layouts;
    elementText: string;
  };
};

export type SwitcherOpen = {
  type: typeof UI__SWITCHER_OPEN;
  payload: {
    label: string;
    pageType: string;
  };
};

export type NavigationTabClickAction = {
  type: typeof UI__NAVIGATION_TAB_CLICK;
  payload: {
    label: string;
    urn: string;
  };
};

export type FilterOpenAction = {
  type: typeof UI__FILTER_OPEN;
  payload: {
    label: string;
  };
};

export type FilterCloseAction = {
  type: typeof UI__FILTER_CLOSE;
};

export type FilterApplyAction = {
  type: typeof UI__FILTER_APPLY;
  payload: {
    selectedOptions: (string | undefined)[];
    module: "pebbles" | "filter";
  };
};

export type FilterResetClickAction = {
  type: typeof UI__FILTERS_RESET_CLICK;
  payload: {
    label: string;
  };
};

export type SelectedMarketSwitcherPayload = {
  urn: URN;
  selectedOption: MarketTypeFilterOption;
};

export type SelectedMarketSwitcherAction = {
  type: typeof UI__SELECTED_MARKET_SWITCHER;
  payload: SelectedMarketSwitcherPayload;
};

export type SelectedDateRangeFilterChangedPayload = {
  urn: URN;
  selectedOption: DateRangeFilterOption;
};

export type SelectedDateRangeFilterChangedAction = {
  type: typeof UI__SELECTED_DATE_RANGE_FILTER_CHANGED;
  payload: SelectedDateRangeFilterChangedPayload;
};

export type SelectedSortFilterChangedPayload = {
  urn: URN;
  selectedOption?: FilteredGroupSort;
};

export type SelectedSortFilterChangedAction = {
  type: typeof UI__SELECTED_SORT_FILTER_CHANGED;
  payload: SelectedSortFilterChangedPayload;
};

export type SelectedCompetitionsFilterChangedPayload = {
  urn: URN;
  selectedOptions: CompetitionOption[];
};

export type SelectedCompetitionsFilterChangedAction = {
  type: typeof UI__SELECTED_COMPETITIONS_FILTER_CHANGED;
  payload: SelectedCompetitionsFilterChangedPayload;
};

export type SelectedMonthFilterChangedPayload = {
  urn: URN;
  selectedOptions: MonthFilterOption[];
};

export type SelectedMonthFilterChangedAction = {
  type: typeof UI__SELECTED_MONTH_FILTER_CHANGED;
  payload: SelectedMonthFilterChangedPayload;
};

export type SelectedCountriesFilterChangedPayload = {
  urn: URN;
  selectedOptions: CountriesFilterOption[];
};

export type SelectedCountriesFilterChangedAction = {
  type: typeof UI__SELECTED_COUNTRIES_FILTER_CHANGED;
  payload: SelectedCountriesFilterChangedPayload;
};

export type SawCardAction = {
  type: typeof SAW_CARD;
  payload: {
    label: string;
    moduleName: string;
  };
};

export type ToggleGraphAction = {
  type: typeof UI__GRAPH_TOGGLE;
  payload: {
    runnerName: string;
    marketName: string;
    isClosed: boolean;
  };
};

export type ToggleRecentRaceAction = {
  type: typeof UI__RECENT_RACE_TOGGLE;
  payload: {
    runnerName: string;
    cardUrn: URN;
    isClosed: boolean;
  };
};

export type ToggleShowMoreRunnersAction = {
  type: typeof UI__TOGGLE_SHOW_MORE_RUNNERS;
  payload: {
    cardUrn: URN;
    showMore: boolean;
    gaModuleSuffix?: string;
  };
};

export type ToggleMarketBlurbExpandClick = {
  type: typeof UI__MARKET_BLURB_EXPAND_CLICK;
  payload: {
    cardUrn: URN;
    isOpen: boolean;
    filter?: string;
    gaModuleSuffix?: string;
  };
};

export type NextRacesRaceClick = {
  type: typeof UI__NEXT_RACES_RACE_CLICK;
  payload: {
    cardUrn: URN;
  };
};

export type StatisticsModalToggleAction = {
  type: typeof UI__STATISTICS_MODAL_TOGGLE;
  payload: {
    cardUrn: string;
    label: string;
    isOpen: boolean;
  };
};

export type StatisticsItemClickAction = {
  type: typeof UI__STATISTICS_ITEM_CLICK;
  payload: {
    label: string;
  };
};

export type NextRacesFilterClickAction = {
  type: typeof UI__NEXT_RACES_RACE_FILTER_CLICK;
  payload: {
    label: string;
  };
};

export type AzSwitchClickAction = {
  type: typeof UI__AZ_SWITCH_CLICK;
  payload: {
    /** The A-Z Switch text label */
    label: string;
    /** The A-Z Switch current status */
    isToggleOn: boolean;
  };
};

export type PromoDescriptionToggleAction = {
  type: typeof UI__PROMO_DESCRIPTION_TOGGLE;
  payload: {
    title: string;
    isOpen: boolean;
    variant: string;
  };
};

export type RaceReplaysToggleAction = {
  type: typeof UI__RACE_REPLAYS_TOGGLE;
  payload: {
    selection: string;
    isClosed: boolean;
    cardUrn: URN;
  };
};

export type ContentSummaryCollapseEvent = {
  type: typeof UI__CONTENT_SUMMARY_COLLAPSE_EVENT;
  payload: {
    collapsed: boolean;
    title: string;
  };
};

export type GenerosityWalletButtonAction = {
  type: typeof UI__GENEROSITY_WALLET_BUTTON_CLICK;
  payload: {
    module: string;
  };
};

export type GenerosityWalletCloseClickAction = {
  type: typeof UI__GENEROSITY_WALLET_CLOSE_CLICK;
  payload: {
    isFromBetslip: boolean;
    currentPebble: string;
  };
};

export type FreeBetsWalletToggleAction = {
  type: typeof UI__FREE_BETS_WALLET_TOGGLE_CLICK;
  payload: {
    isSelected: boolean;
    walletDescription: string;
    value: number | undefined;
    totalAmount: number | string | undefined;
    currentPebble: string;
    numberOfPlaces: number | undefined;
    walletType: WalletTypes;
  };
};

export type GenerosityWalletPebbleClickAction = {
  type: typeof UI__GENEROSITY_WALLET_PEBBLE_CLICK;
  payload: {
    isFromBetslip: boolean;
    currentPebble: string;
    toPebble: string;
  };
};

export type GenerosityWalletApplyButtonClickAction = {
  type: typeof UI__GENEROSITY_WALLET_APPLY_BUTTON_CLICK;
  payload: {
    walletDescription: string | undefined;
    value: number | undefined;
    totalAmount: number | string;
    currentPebble: string;
    numberOfPlaces: number | undefined;
    walletType: WalletTypes;
  };
};

export type BetslipSliderInteractionActionPayload = {
  eventName: string;
  source: "selector" | "button";
  direction: "increase" | "decrease";
};

export type BetslipSliderInteractionAction = {
  type: typeof UI__BETSLIP_SLIDER_INTERACTION;
  payload: BetslipSliderInteractionActionPayload;
};

export type BetslipSliderDisplayedAction = {
  type: typeof UI__BETSLIP_SLIDER_DISPLAYED;
  payload: {
    eventName: string;
  };
};
