import { ProductsOption } from "../state/entities";
import { PlatformType } from "../middlewares/tagging-resolvers/AnalyticsConstants";
import { ViewLink } from "../state/layout/views/ViewLink.types";
import URN from "../state/layout/URN";
import { ViewAllLink } from "../state/layout/views/ViewAll.types";

export const UI__FOOTER_LINK_CLICK = "UI__FOOTER_LINK_CLICK";
export const UI__QUICK_LINK_CLICK = "UI__QUICK_LINK_CLICK";
export const UI__BACK_TO_CURRENT_CHANNEL_SELECTION = "UI__BACK_TO_CURRENT_CHANNEL_SELECTION";
export const UI__BACK_BUTTON_CLICK = "UI__BACK_BUTTON_CLICK";
export const UI__GAMING_BACK_BUTTON_CLICK = "UI__GAMING_BACK_BUTTON_CLICK";
export const UI__CARDGROUP_VIEW_ALL_LINK_TAP = "UI__CARDGROUP_VIEW_ALL_LINK_TAP";
export const UI__NAVIGATE_TO_EVENT_FROM_SPORT = "UI__NAVIGATE_TO_EVENT_FROM_SPORT";
export const UI__LOGO_CLICK = "UI__LOGO_CLICK";
export const UI__NAVIGATE_TO_EVENT_FROM_MARKET = "UI__NAVIGATE_TO_EVENT_FROM_MARKET";
export const UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD = "UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD";
export const UI__NAVIGATE_TO_UPPER_LEVEL_FROM_MY_BETS = "UI__NAVIGATE_TO_UPPER_LEVEL_FROM_MY_BETS";
export const UI__NAVIGATE_TO_RACE_FROM_MARKET = "UI__NAVIGATE_TO_RACE_FROM_MARKET";
export const UI__NAVIGATE_TO_VIEW = "UI__NAVIGATE_TO_VIEW";
export const UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED = "UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED";
export const UI__NAVIGATE_TO_MARKET_VIEW = "UI__NAVIGATE_TO_MARKET_VIEW";
export const UI__NAVIGATE_TO_COMPETITION_VIEW = "UI__NAVIGATE_TO_COMPETITION_VIEW";
export const UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK = "UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK";
export const UI__CLICK_ALLMARKETS_LINK = "UI__CLICK_ALLMARKETS_LINK";
export const UI__TAP_ALL_COMPETITIONS_LINK = "UI__TAP_ALL_COMPETITIONS_LINK";
export const UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD =
  "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD";
export const UI__BOTTOM_BAR_CLICK = "UI__BOTTOM_BAR_CLICK";
export const UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON =
  "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON";
export const UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL =
  "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL";
export const UI__LAUNCH_GAME = "UI__LAUNCH_GAME";
export const UI__LAUNCH_GAME_FROM_GAME_INFO = "UI__LAUNCH_GAME_FROM_GAME_INFO";
export const UI__LAUNCH_GAME_FROM_PN = "UI__LAUNCH_GAME_FROM_PN";
export const UI__LAUNCH_GAME_FROM_PROMO = "UI__LAUNCH_GAME_FROM_PROMO";
export const UI__LAUNCH_GAME_FROM_WIDGET = "UI__LAUNCH_GAME_FROM_WIDGET";
export const UI__NAVIGATE_TO_GAME_INFO_VIEW = "UI__NAVIGATE_TO_GAME_INFO_VIEW";
export const UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK = "UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK";
export const UI__CONTENT_SUMMARY_COLLAPSE_CLICK = "UI__CONTENT_SUMMARY_COLLAPSE_CLICK";
export const UI__RACE_VIEW_LINKS_LINK_CLICK = "UI__RACE_VIEW_LINKS_LINK_CLICK";
export const UI__PLAY_NEW_LOADED = "UI__PLAY_NEW_LOADED";
export const UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK = "UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK";
export const UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK = "UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK";
export const UI_NAVIGATE_VIEW_FROM_FAVOURITES = "UI_NAVIGATE_VIEW_FROM_FAVOURITES";
export const UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS = "UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS";
export const UI__NOT_FOUND_VIEW_LOADED = "UI__NOT_FOUND_VIEW_LOADED";
export const UI__NAVIGATE_FROM_NOT_FOUND_VIEW = "UI__NAVIGATE_FROM_NOT_FOUND_VIEW";
export const UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET = "UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET";
export const UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER = "BETSLIP/PP_BET_BUILDER_NAVIGATE_TO_EVENT";
export const UI__NAVIGATE_TO_EVENT_FIRST_TIME = "UI__NAVIGATE_TO_EVENT_FIRST_TIME";
export const UI__MAINTENANCE_TO_PRODUCT = "UI__MAINTENANCE_TO_PRODUCT";
export const UI__NAVIGATE_TO_MOBILE_WEB = "UI__NAVIGATE_TO_MOBILE_WEB";
export const UI__NAVIGATE_TO_FAQ_PAGE = "UI__NAVIGATE_TO_FAQ_PAGE";
export const UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER = "UI/PP_BET_BUILDER_NAVIGATE_TO_EVENT_BET_BUILDER";
export const UI__NAVIGATE_GENEROSITY_WALLET_HELP = "UI__NAVIGATE_GENEROSITY_WALLET_HELP";
export const UI__NAVIGATE_GENEROSITY_PAGE = "UI__NAVIGATE_GENEROSITY_PAGE";
export const UI__MARKET_BLURB_LINK_CLICK = "UI__MARKET_BLURB_LINK_CLICK";
export const UI__OBB_CREATED_BETS_LINK_CLICKED = "UI__OBB_CREATED_BETS_LINK_CLICKED";
export const UI__NAVIGATE_SETTLEMENTLINK = "UI__NAVIGATE_SETTLEMENTLINK";

export type MaintenanceToProduct = {
  type: typeof UI__MAINTENANCE_TO_PRODUCT;
  payload: {
    product: ProductsOption;
    viewLink: ViewLink;
  };
};

export type PopularBetBuilderNavigateToBetBuilderAction = {
  type: typeof UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER;
  payload: { urn: URN; url: string; runnerUrn: URN };
};

export type BetslipBetBuilderNavigateToEventAction = {
  type: typeof UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER;
  payload: { urn: URN; url: string; runnerUrn: URN };
};

export type NavigateToEventViewFirstTime = {
  type: typeof UI__NAVIGATE_TO_EVENT_FIRST_TIME;
};

export type BackButtonClickAction = {
  type: typeof UI__BACK_BUTTON_CLICK;
  payload: {
    url: string;
    module: string;
    text?: string;
  };
};

export type GamingBackButtonClickAction = {
  type: typeof UI__GAMING_BACK_BUTTON_CLICK;
};

export type CardGroupViewAllLinkTapAction = {
  type: typeof UI__CARDGROUP_VIEW_ALL_LINK_TAP;
  payload: {
    title: string;
    viewAllLink: ViewAllLink;
    cardgroupURN: URN;
  };
};

export type FooterLinkClickAction = {
  type: typeof UI__FOOTER_LINK_CLICK;
  payload: {
    module: string;
    text?: string;
    url?: string;
  };
};

export type QuickLinkClickAction = {
  type: typeof UI__QUICK_LINK_CLICK;
  payload: {
    label: string;
    url: string;
    cardUrn: string;
  };
};

export type NavigateToEventFromSport = {
  type: typeof UI__NAVIGATE_TO_EVENT_FROM_SPORT;
  payload: {
    cardUrn: string;
    href: string;
    sportEventURN: URN;
    type: "primary swimlane" | "secondary swimlane";
    fixtureURN?: URN;
    elementText?: string;
  };
};

export type NavigateToViewLinkFromMyBets = {
  type: typeof UI__NAVIGATE_TO_UPPER_LEVEL_FROM_MY_BETS;
  payload: {
    url: string;
    text: string;
  };
};

export type LogoClickAction = {
  type: typeof UI__LOGO_CLICK;
  payload: {
    path: string;
  };
};

export type NavigateToEventFromMarket = {
  type: typeof UI__NAVIGATE_TO_EVENT_FROM_MARKET;
  payload: {
    url: string;
    text: string;
  };
};

export type NavigateToEventFromMarketScoreboard = {
  type: typeof UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD;
  payload: {
    url: string;
    text: string;
  };
};

export type NavigateToRaceFromMarket = {
  type: typeof UI__NAVIGATE_TO_RACE_FROM_MARKET;
  payload: {
    url: string;
    text: string;
  };
};

export type NavigateToView = {
  type: typeof UI__NAVIGATE_TO_VIEW;
  payload: {
    url: string;
    cardURN: URN;
    module: string;
    label: string;
  };
};

export type NavigateToSwitcherOptionClick = {
  type: typeof UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK;
  payload: {
    url: string;
    label: string;
    pageType: string;
  };
};

export type RaceViewLinksLinkClick = {
  type: typeof UI__RACE_VIEW_LINKS_LINK_CLICK;
  payload: {
    cardUrn: URN;
    href: string;
    isRaceClosed?: boolean;
  };
};

export type NavigateViewFromFavouritesClick = {
  type: typeof UI_NAVIGATE_VIEW_FROM_FAVOURITES;
  payload: {
    cardUrn: URN;
    href: string;
    label: string;
  };
};

export type NavigateToDiscountRateExplained = {
  type: typeof UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED;
  payload: {
    url: string;
    text: string;
  };
};

export type NavigateToMarketView = {
  type: typeof UI__NAVIGATE_TO_MARKET_VIEW;
  payload: {
    cardType: "MarketViewLinkCard" | "MarketCard" | "MarketExtendedCard" | "QuickLinksCard";
    href: string;
    cardUrn: string;
    marketName?: string;
  };
};

export type NavigateToGameCategoryView = {
  type: typeof UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD;
  payload: {
    module?: string;
    cardType: "GamingLinkCard";
    href: string;
    viewUrn: string;
    cardUrn: string;
    categoryName: string;
  };
};

export type NavigateToGameInfoView = {
  type: typeof UI__NAVIGATE_TO_GAME_INFO_VIEW;
  payload: {
    href: string;
    gameUrn: string;
    cardUrn: string;
  };
};

export type NavigateToCategoryUsingSeeAllButton = {
  type: typeof UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON;
  payload: {
    href: string;
    viewUrn: string;
    label?: string;
    zoneTitle?: string;
    cardUrn: string;
  };
};

export type NavigateToCategoryUsingMultifunctional = {
  type: typeof UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL;
  payload: {
    href: string;
    categoryName: string;
    zoneTitle: string;
  };
};

export type LaunchGame = {
  type: typeof UI__LAUNCH_GAME;
  payload: {
    href: string;
    gameUrn: string;
    cardUrn: string;
    isSearchResult?: boolean;
    inputSearchTerm?: string;
    platformType: PlatformType;
  };
};

export type LaunchGameFromGameInfoPage = {
  type: typeof UI__LAUNCH_GAME_FROM_GAME_INFO;
  payload: {
    href: string;
    gameUrn: string;
    platformType: PlatformType;
    isDemo?: boolean;
  };
};

export type LaunchGameFromPN = {
  type: typeof UI__LAUNCH_GAME_FROM_PN;
  payload: {
    href: string;
    gameId: string;
    platformType: PlatformType;
  };
};
export type LaunchGameFromPromo = {
  type: typeof UI__LAUNCH_GAME_FROM_PROMO;
  payload: {
    viewUrl: string;
    urn: string;
  };
};

export type LaunchGameFromWidget = {
  type: typeof UI__LAUNCH_GAME_FROM_WIDGET;
  payload: {
    href: string;
    gameUrn: string;
    cardUrn: string;
    platformType: PlatformType;
  };
};

export type NavigateToAllMarketsFromAllMarketsLink = {
  type: typeof UI__CLICK_ALLMARKETS_LINK;
  payload: {
    destinationUrl: string;
  };
};

export type NavigateToCompetitionView = {
  type: typeof UI__NAVIGATE_TO_COMPETITION_VIEW;
  payload: {
    text: string;
    href: string;
    cardUrn: string;
    cardType: "CompetitionViewLinkCard" | "QuickLinksCard" | "CompetitionRegionCard";
  };
};

export type NavigateToAllCompetitionsViewFromQuickLink = {
  type: typeof UI__TAP_ALL_COMPETITIONS_LINK;
  payload: {
    href: string;
    text: string;
    cardUrn: string;
  };
};

export type BottomBarClickAction = {
  type: typeof UI__BOTTOM_BAR_CLICK;
  payload: {
    path: string;
    tile: string;
  };
};

export type NavigateFromContentSummaryLinkAction = {
  type: typeof UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK;
  payload: {
    text?: string;
    url?: string;
    module: string;
  };
};

export type ContentSummaryCollapseClick = {
  type: typeof UI__CONTENT_SUMMARY_COLLAPSE_CLICK;
  payload: {
    collapsed: boolean;
  };
};

export type LoadPlayNew = {
  type: typeof UI__PLAY_NEW_LOADED;
  payload: {
    urn: URN;
    isStaticPromo: boolean;
  };
};

export type PlayNewClickToMoreInfoButtonAction = {
  type: typeof UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK;
  payload: {
    viewLink: string;
    urn: URN;
    isStaticPromo: boolean;
  };
};

export type PlayNewClickToPlayNowButtonAction = {
  type: typeof UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK;
  payload: {
    viewLink: string;
    urn: URN;
  };
};

export type NavigateToSeeAllPromotions = {
  type: typeof UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS;
  payload: ViewLink;
};

export type NotFoundViewLoadedAction = {
  type: typeof UI__NOT_FOUND_VIEW_LOADED;
};

export type NavigateFromNotFoundViewAction = {
  type: typeof UI__NAVIGATE_FROM_NOT_FOUND_VIEW;
  payload: {
    label: string;
    destinationUrl: string;
  };
};

export type CouponPrimaryMarketPress = {
  type: typeof UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET;
  payload: {
    couponCardGroupUrn: URN;
    sporteventURN: URN;
    href: string;
  };
};

export type NavigateToMobileWeb = {
  type: typeof UI__NAVIGATE_TO_MOBILE_WEB;
  payload: {
    label: string;
    url: string;
  };
};

export type MarketBlurbFAQAction = {
  type: typeof UI__NAVIGATE_TO_FAQ_PAGE;
  payload: {
    cardUrn: URN;
    filter?: string;
    href: string;
    gaModuleSuffix?: string;
  };
};

export type GenerosityWalletHelpAction = {
  type: typeof UI__NAVIGATE_GENEROSITY_WALLET_HELP;
  payload: {
    destinationUrl: string;
    currentPebble: string;
    isFromBetslip: boolean;
  };
};

export type GenerosityPageNavigationAction = {
  type: typeof UI__NAVIGATE_GENEROSITY_PAGE;
  payload: {
    destinationUrl: string;
    currentPebble: string;
  };
};

export type MarketBlurbLinkClick = {
  type: typeof UI__MARKET_BLURB_LINK_CLICK;
  payload: {
    destinationUrl: string;
    elementText: string;
    variant: string;
  };
};

export type ObbCreatedBetsLinkClickAction = {
  type: typeof UI__OBB_CREATED_BETS_LINK_CLICKED;
  payload: {
    urn: URN;
    label: string;
    viewUrl: string;
    cardIndex?: number;
    verticalPosition?: number;
    event?: string;
  };
};

export type SettlementLinkNavigationAction = {
  type: typeof UI__NAVIGATE_SETTLEMENTLINK;
  payload: {
    destinationUrl: string;
    currentTab: string;
  };
};
