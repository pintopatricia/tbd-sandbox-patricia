import {
  NETWORK__CANCEL_EXC_BET_FAILURE,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__PLACE_EXC_BET_FAILURE,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_FAILURE,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
  UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS,
  UI__BETSLIP_EXC_BONUS_CHANGE,
  UI__BETSLIP_EXC_CONFIRM_BET_CLICK,
  UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
  UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_EXC_PLACE_BET_CLICK,
  UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
  UI__BETSLIP_EXC_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
  UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK,
  UI__BETSLIP_HEADER_CLICK,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE,
  UI__BETSLIP_SBK_CAST_BET_CHANGE,
  UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE,
  UI__BETSLIP_SBK_EACH_WAY_TOGGLE,
  UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
  UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
  UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK,
  UI__BETSLIP_SBK_NOTIFICATION_SHOWN,
  UI__BETSLIP_SBK_PLACE_BETS_CLICK,
  UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE,
  UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
  UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
  UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
  UI__BETSLIP_SBK_REMOVE_SELECTIONS,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
} from "../actions/betslip";
import {
  BETTING__SBK_BONUS_TOGGLE_ACTION,
  BETTING__SBK_PLACE_FAILED_UPDATE,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "../actions/betting";
import {
  UI__CLEAR_SEARCH_RESULTS,
  UI__SEARCH_AZ_LINK_CLICK,
  UI__SEARCH_BAR_FOCUS,
  UI__SEARCH_BAR_LINK_CLICK,
  UI__SEARCH_CANCEL_CLICK,
  UI__SEARCH_LINK_CLICK,
  UI__SEARCH_TAB_CLICK,
} from "../actions/browse";
import {
  NETWORK__CASHOUT_TAKE_FAILURE,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  UI__CASHOUT_BUTTON_TAP,
  NETWORK__CASHOUT_TAKE_FAILURE_SBK,
} from "../actions/cashout";
import { URL__BETSLIP_DEEPLINK } from "../actions/commands";
import {
  SAW_CARD,
  UI__AZ_SWITCH_CLICK,
  UI__CLICK_MARKET_GRAPH_MODE_SELECTOR,
  UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR,
  UI__CLICK_PEBBLE_ITEM,
  UI__CLICK_PROMOTION_CALL_TO_ACTION,
  UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS,
  UI__CONTENT_SUMMARY_COLLAPSE_EVENT,
  UI__FILTERS_RESET_CLICK,
  UI__FILTER_APPLY,
  UI__FILTER_CLOSE,
  UI__FILTER_OPEN,
  UI__GRAPH_TOGGLE,
  UI__JACKPOT_MERCHANDISE_VIEW,
  UI__MARKET_BLURB_EXPAND_CLICK,
  UI__MARKET_RULES_MODAL_TOGGLE,
  UI__MARKET_SWITCH_CLICK,
  UI__MY_ACCOUNT_ICON_CLICK,
  UI__NAVIGATION_TAB_CLICK,
  UI__NEXT_RACES_RACE_CLICK,
  UI__NEXT_RACES_RACE_FILTER_CLICK,
  UI__PROMO_DESCRIPTION_TOGGLE,
  UI__RACE_REPLAYS_TOGGLE,
  UI__RECENT_RACE_TOGGLE,
  UI__STATISTICS_ITEM_CLICK,
  UI__STATISTICS_MODAL_TOGGLE,
  UI__SWITCHER_OPEN,
  UI__TOGGLE_EXPANDABLE_CARDGROUP,
  UI__TOGGLE_RUNNER_INFO,
  UI__TOGGLE_RUNNER_INFO_TABS,
  UI__TOGGLE_SHOW_MORE_RUNNERS,
  UI__TOGGLE_TIMEFORM_CARD,
  UI__USER_LOGOUT_CLICK,
} from "../actions/interface";
import {
  UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE,
  UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED,
  UI__BROADCASTS_CARD_TOGGLE,
  UI__MEDIA_PLAYER_LOADED,
  UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED,
  UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT,
  UI__TIME_FORM_BROADCASTS_CARD_TOGGLE,
} from "../actions/media";
import {
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
  UI__MY_BETS_ACCA_FREEZE_OPENED,
  UI__MY_BETS_ACCA_FREEZE_CLOSED,
  UI__MY_BETS_BET_SHARING_DISMISS_TAP,
  UI__MY_BETS_BET_SHARING_PREVIEW_TAP,
  UI__MY_BETS_BET_SHARING_SHARE_BET_TAP,
  UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP,
  UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
  UI__MY_BETS_EXC_EDIT_BET_CLOSE,
  UI__MY_BETS_EXC_EDIT_BET_PRESS,
  UI__MY_BETS_EXC_ORDER_STATUS_SWITCH,
  UI__MY_BETS_ON_ACCORDION_TOGGLE,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
} from "../actions/my-bets";
import {
  UI__BET_MUTATION_ACCA_FREEZE_SELECTED,
  UI__BET_MUTATION_ACCA_FREEZE_DESELECTED,
  NETWORK__FREEZE_BET,
} from "../actions/bet-mutation";
import {
  UI_NAVIGATE_VIEW_FROM_FAVOURITES,
  UI__BACK_BUTTON_CLICK,
  UI__BOTTOM_BAR_CLICK,
  UI__CARDGROUP_VIEW_ALL_LINK_TAP,
  UI__CLICK_ALLMARKETS_LINK,
  UI__FOOTER_LINK_CLICK,
  UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK,
  UI__NAVIGATE_FROM_NOT_FOUND_VIEW,
  UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER,
  UI__NAVIGATE_TO_COMPETITION_VIEW,
  UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED,
  UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER,
  UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET,
  UI__NAVIGATE_TO_EVENT_FROM_SPORT,
  UI__NAVIGATE_TO_FAQ_PAGE,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL,
  UI__NAVIGATE_TO_MOBILE_WEB,
  UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS,
  UI__NOT_FOUND_VIEW_LOADED,
  UI__PLAY_NEW_LOADED,
  UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK,
  UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK,
  UI__QUICK_LINK_CLICK,
  UI__RACE_VIEW_LINKS_LINK_CLICK,
  UI__TAP_ALL_COMPETITIONS_LINK,
} from "../actions/navigation";
import { UI__SWITCH_PRODUCT_PREFERENCE, UPDATE_MARKET_DEPTH } from "../actions/preferences";
import { ACCEPT_PROMOTION, INTERACT_CANCEL_PROMOTION_MODAL, REFRESH_PROMOTION } from "../actions/promotion";
import {
  PN_INTERACTION_EVENT,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_SUBSCRIBE_EVENTS,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
} from "../actions/push-notifications";
import { BOTTOM_BAR_PUSH, EXTERNAL_PUSH } from "../actions/router";
import { UI__SETTINGS_TABS_CLICK } from "../actions/settings-page";
import { UI__CLOSED_SBK_CLICK, UI__SUSPENDED_SBK_CLICK } from "../actions/sportsbook-markets";
import {
  UI__USER_PROFILE_BUDGET_LINK_CLICK,
  UI__USER_PROFILE_EYE_ICON_CLICK,
  UI__USER_PROFILE_MENU_LINK_CLICK,
  UI__USER_PROFILE_QUICK_LINK_CLICK,
  UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK,
} from "../actions/user-profile";
import { UI__PAGE_CONTENT_LOADED } from "../actions/game-interactions";
import { getBetslipExchangeContext, getBetslipVisibilityState } from "../state/betslip/betslip-card-selectors";
import { getSportsbookBettingCombinations } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ExchangeSide } from "../state/constants";
import { getCompetitionByURN } from "../state/entities/competitions/competition-selectors";
import { getSportEventByURN } from "../state/entities/sport-events/sport-event-selectors";
import { getSportByURN } from "../state/entities/sports/sport-selectors";
import { Product } from "../state/entities/user-preferences/UserPreferences.types";
import { MY_BETS_MODULE_NAME } from "../state/layout/cards/MyBets.types";
import { getLayoutMetadata } from "../state/layout-snapshot";
import { getViewbyURN } from "../state/layout/views/event-view/event-view-selectors";
import { getViewZoneByItemUrn } from "../state/layout/viewzones/viewzone-selectors";
import { createLegacyTaggingMiddleware } from "./legacy-tagging";
import {
  getAcceptPromotionEvent,
  getAllCompetitionsLinkClickEvent,
  getAllMarketsLinkClickEvent,
  getAutoConfirmCashoutClickEvent,
  getAutoConfirmSportsbookBetClickEvent,
  getAzSwitchToggleEvent,
  getBackButtonClickEvent,
  getBetReceiptExchangeDoneClickEvent,
  getBetReceiptSuccessMessageSaw,
  getBetReceiptToggleClickEvent,
  getBetslipAccaInsuranceToggleEvent,
  getBetslipAccordionHeaderClickEvent,
  getBetslipBetBuilderAddSelections,
  getBetslipBetBuilderNavigateToEvent,
  getBetslipBetBuilderRemoveSelections,
  getBetslipBonusActivationEvent,
  getBetslipCancelBetClickEvent,
  getBetslipCastBetChangeEvent,
  getBetslipCastBetOrderChangeEvent,
  getBetslipDeeplinkEvent,
  getBetslipEachWayToggleEvent,
  getBetslipExchangeLoginToPlaceBetClickEvent,
  getBetslipExchangeRemoveSelectionEvent,
  getBetslipHeaderClickEvent,
  getBetslipMyOddsBoostToggleEvent,
  getBetslipSbkMaxPayoutNotificationUrlClickEvent,
  getBetslipSbkNotificationShownEvent,
  getBetslipSbkReAddSelectionsEvent,
  getBetslipSbkRemoveAllEvent,
  getBetslipSportsbookLoginToPlaceBetClickEvent,
  getBetslipSportsbookMultipleBetTypeClickEvent,
  getBetslipSportsbookRemoveSelectionEvent,
  getBottomBarClickEvent,
  getBroadcastsAndStatisticsCardMediaPlayerEvent,
  getBroadcastsAndStatisticsToggleEvent,
  getBroadcastsToggleEvent,
  getCancelBetClickEvent,
  getCancelPromotionEvent,
  getCashoutClickEvent,
  getCashoutFailureEvent,
  getCashoutSuccessEvent,
  getCategoryFromMultifunctionalClickEvent,
  getChangePersistenceTypeClickEvent,
  getCompetitionLinkClickEvent,
  getContentSummaryCollapseEvent,
  getCopyBetIdToClipboardEvent,
  getCouponViewCardClickEvent,
  getDontUpdateBetClickEvent,
  getExcIncrementSizeEvent,
  getExchangeAddSelectionToBetslip,
  getExchangeAutoConfirmedBetClickEvent,
  getExchangeBetEditSuccessfull,
  getExchangeConfirmBetClickEvent,
  getExchangeFailedPlaceBetEvent,
  getExchangeOnClickEdit,
  getExchangePriceChangeEvent,
  getExchangeSuccessPlaceBetEvent,
  getExchangeSuccessPlaceBetSelectionEvent,
  getFilterApplyEvent,
  getFilterCloseEvent,
  getFilterOpenEvent,
  getFilterResetClickEvent,
  getGameLaunchFromGameInfoEvent,
  getGameTileClickEvent,
  getJackpotMerchandiseViewEvent,
  getLinkClickEvent,
  getLoadedNotFoundView,
  getLogoutClickEvent,
  getMarketDepthClickEvent,
  getMarketGraphSelectGraphEvent,
  getMarketGraphSelectViewEvent,
  getMarketBlurbExpandableEvent,
  getMarketBlurbFAQEvent,
  getMarketRulesLinkClickEvent,
  getMarketRulesToggleModalEvent,
  getMarketSnackBarEvent,
  getMarketSwitchEvent,
  getMarketTemplatePebbleSelectionEvent,
  getMaxPayoutAcceptMessageClickEvent,
  getMediaPlayerLoadedEvent,
  getMoreInfoPlayNewClickEvent,
  getMyAccountEyeIconEvent,
  getMyAccountMenuLinkEvent,
  getMyAccountMenuToggleEvent,
  getMyAccountQuickLinkEvent,
  getMyAccountToggleCashBalancesViewEvent,
  getMyBetsBetSharingDismissOnTapEvent,
  getMyBetsBetSharingPreviewOnTapEvent,
  getMyBetsBetSharingShareBetOnTapEvent,
  getMyBetsBetSharingShareImageOnTapEvent,
  getMyBetsAccaFreezeOpenedEvent,
  getMyBetsAccaFreezeClosedEvent,
  getBetMutationAccaFreezeSelectedEvent,
  getBetMutationAccaFreezeDeselectedEvent,
  getBetMutationAccaFreezeConfirmEvent,
  getMyBetsCancelAllEvent,
  getMyBetsEditBottomSheetCloseEvent,
  getMyBetsEditClickEvent,
  getMyBetsExchangeOrderStatusClickEvent,
  getMyBetsOrderTypePressEvent,
  getMyBetsSbkAddPreviousSelectionsEvent,
  getNavigateFromNotFoundView,
  getNavigateToEvent,
  getNavigateToEventFromSport,
  getNavigateToGameCategoryEvent,
  getNavigateToGameInfoEvent,
  getNavigateToMarketViewEvent,
  getNavigateToMobileWebEvent,
  getNavigationSeeAllPromotionsEvent,
  getNavigationTabClickEvent,
  getNextRacesFilterClickEvent,
  getNextRacesRaceClickEvent,
  getOpenBetslipEvent,
  getOpenPersistenceTypeMenuEvent,
  getPNInteractionClickEvent,
  getPlaceExchangeBetClickEvent,
  getPlaceSportsbookBetClickEvent,
  getPlayNowPlayNewClickEvent,
  getPromoDescriptionToggleEvent,
  getPromotionClickEvent,
  getRaceReplaysMediaPlayerEvent,
  getRaceReplaysToggleEvent,
  getRaceViewLinksLinkClickEvent,
  getSawCardEvent,
  getSbkIncrementStakeEvent,
  getSearchAzLinkClickEvent,
  getSearchBarFocusEvent,
  getSearchCancelClickEvent,
  getSearchClearClickEvent,
  getSearchLinkClickEvent,
  getSearchTabClickEvent,
  getSeeAllLinkClickEvent,
  getSettingsTabSelectEvent,
  getSportsbookAddSelectionToBetslip,
  getSportsbookFailedPlaceBetEvent,
  getSportsbookSuccessPlaceBetsEvent,
  getSportsbookSuccessPlaceSelectionsEvent,
  getStatisticsItemClickEvent,
  getStatisticsModalToggleEvent,
  getSwitchProductEvent,
  getSwitcherEvent,
  getTimeFormBroadCastsMediaPlayerEvent,
  getTimeFormBroadCastsToggleEvent,
  getToggleAccordionEvent,
  getToggleExpandableCardGroupEvent,
  getToggleMarketGraphEvent,
  getToggleRecentRacesEvent,
  getToggleRunnerInfoEvent,
  getToggleRunnerInfoTabsEvent,
  getToggleShowMoreEvent,
  getToggleTimeFormEvent,
  getUpdateBetClickEvent,
  getUpdateBetFailureEvent,
  getViewAllTapEvent,
  getViewFromFavouritesClickEvent,
  loadPlayNew,
} from "./tagging-resolvers";
import { getLoadedPageContentEvent } from "./ga4-tagging-resolvers/game-interactions";
import { TaggingAction } from "./tagging-resolvers/AnalyticsConstants";

jest.mock("../state/layout/views/event-view/event-view-selectors");

jest.mock("../state/application-state-selectors", () => ({
  createGetSwimlaneUrnByCardUrnSelector: jest.fn(jest.fn),
}));

jest.mock("../state/layout/views/browse-view/browse-view-selectors", () => ({
  createGetGamingSearchInputSelector: jest.fn(() => jest.fn(() => "gameSearchInput")),
}));

jest.mock("../state/layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors", () => {
  const getHydratedPebbleCardGroupByURN = jest.fn(() => ({
    selectedItemUrn: "pebbleURN",
    items: [{ urn: "pebbleURN", name: "pebbleTitle" }],
  }));
  return {
    createGetHydratedPebbleCardGroupByURNSelector: jest.fn(() => getHydratedPebbleCardGroupByURN),
  };
});

const metadataMock = {
  cardGroupTitle: "pebbleCardGroup",
  pebbleCardGroupTitle: "pebbleCardGroup",
  tabName: "tab",
  horizontalPosition: 1,
  verticalPosition: 2,
  viewZoneTitle: "viewZoneTitle",
};

jest.mock("../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => metadataMock),
}));

jest.mock("../state/layout/layout-selectors", () => ({
  createCardParentTitlesByURNSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      groupTitle: "groupTitle",
      tabTitle: "tabTitle",
      groupUrn: "ppb:group:card:urn",
    }),
  ),
  createViewTypeSelector: jest.fn(() => jest.fn().mockReturnValue("VIEW_TYPE")),
  isDesktopAppKeyTypeSelector: jest.fn(() => jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)),
}));

jest.mock("../state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors", () => ({
  createGetCouponCardGroupParentTitlesSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      viewType: "VIEW_TYPE",
      groupTitle: "filteredCouponTitle",
      tabTitle: "tabTitle",
    }),
  ),
}));

jest.mock("../state/layout/viewzones/viewzone-selectors", () => ({
  getViewZoneByItemUrn: jest.fn().mockReturnValue({
    viewZone: {},
  }),
}));

jest.mock("../state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => jest.fn().mockImplementation((market) => market)),
}));

jest.mock("../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => jest.fn((market) => market)),
  getExchangeMarketRunnerByURN: jest.fn(() => ({
    name: "runner name",
  })),
}));

jest.mock("../state/betslip/betslip-card-selectors");
jest.mock("../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingCombinations: jest.fn(() => ({ "C:1": { betType: "betType" } })),
  getSportsbookRunnerTree: jest.fn(),
  getMarketRunnerIdAssociation: jest.fn().mockReturnValue({ marketId: 1, selectionId: 123 }),
}));

jest.mock("./tagging-resolvers/page-load", () => ({
  getPageLoadEvent: jest.fn(() => {}),
}));

jest.mock("../state/layout/cardgroups/cardgroups-selectors", () => {
  const getHydratedPebbleCardGroupByURN = jest.fn(() => ({
    selectedItemUrn: "pebbleURN",
    items: [{ urn: "pebbleURN", name: "pebbleTitle" }],
  }));
  return {
    createCardGroupByURNSelector: jest.fn(() => getHydratedPebbleCardGroupByURN),
  };
});

jest.mock("../state/layout/cards/cards-selectors", () => {
  const getPopularMultiplesBetBuilderCardByURN = jest.fn(() => ({
    popularbettingopportunity: "popularbettingopportunityUrn",
    title: "popular multiples title",
  }));

  return {
    getEventMarketCardByURN: jest.fn(() => ({
      fixture: "fixtureUrn",
      title: "label",
    })),
    createCardByURNSelector: jest.fn(() => getPopularMultiplesBetBuilderCardByURN),
  };
});

jest.mock("../state/layout/cards/event-viewlinks/event-view-link-cards-selectors", () => ({
  getEventViewLinkCardByURN: jest.fn(() => ({
    eventview: "event:view:urn",
  })),
}));

jest.mock("../state/layout/views/event-view/event-view-selectors", () => ({
  getViewbyURN: jest.fn(() => ({
    sportevent: "sportevent:urn",
  })),
}));

jest.mock("../state/entities/entities-selectors", () => ({
  getEntities: jest.fn(() => ({
    footballfixtures: [],
  })),
}));

jest.mock("../state/entities/sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn(() => ({
    eventId: 11111,
    name: "event name",
    competition: "competitionUrn",
  })),
}));

jest.mock("../state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => ({
    name: "sport name",
    sportId: 1,
  })),
}));

jest.mock("../state/entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn(() => ({
    competitionId: "competitionId",
    name: "competition name",
    sport: "sportUrn",
  })),
}));

jest.mock("../state/entities/games/game-selectors", () => ({
  getGameByURN: jest.fn(() => ({
    name: "Ted",
    provider: {
      name: "Gaming Platform - Blueprint",
    },
    launchId: "launchId",
  })),
}));

jest.mock("./tagging-resolvers", () => ({
  getBetslipDeeplinkEvent: jest.fn().mockReturnValue("getBetslipDeeplinkEvent"),
  getBackButtonClickEvent: jest.fn().mockReturnValue("backButtonEvent"),
  getPageLoadEvent: jest.fn(),
  getPlaceExchangeBetClickEvent: jest.fn(),
  getPlaceSportsbookBetClickEvent: jest.fn(),
  getAutoConfirmSportsbookBetClickEvent: jest.fn(),
  getBetslipExchangeRemoveSelectionEvent: jest.fn(),
  getBetslipSportsbookRemoveSelectionEvent: jest.fn(),
  getLinkClickEvent: jest.fn(),
  getDontUpdateBetClickEvent: jest.fn(),
  getUpdateBetClickEvent: jest.fn(),
  getBetslipCancelBetClickEvent: jest.fn(),
  getCancelBetClickEvent: jest.fn(),
  getUpdateBetFailureEvent: jest.fn(),
  getChangePersistenceTypeClickEvent: jest.fn(),
  launchPrizeMachine: jest.fn((...args) => args),
  loadPrizeMachine: jest.fn((...args) => args),
  loadPlayNew: jest.fn((...args) => args),
  getMoreInfoPlayNewClickEvent: jest.fn((...args) => args),
  getPlayNowPlayNewClickEvent: jest.fn((...args) => args),
  getTCPrizeMachineClickEvent: jest.fn((...args) => args),
  getMarketSwitchEvent: jest.fn().mockReturnValue("marketSwitchEvent"),
  getMyAccountMenuToggleEvent: jest.fn().mockReturnValue("myAccountMenuToggleEvent"),
  getLogoutClickEvent: jest.fn().mockReturnValue("logoutClickEvent"),
  getOpenPersistenceTypeMenuEvent: jest.fn(),
  getOpenBetslipEvent: jest.fn().mockReturnValue("getOpenBetslipEvent"),
  getNavigateToEventFromSport: jest.fn().mockReturnValue("getNavigateToEventFromSport"),
  getNavigateToMarketViewEvent: jest.fn().mockReturnValue("getNavigateToMarketViewEvent"),
  getNavigateToGameCategoryEvent: jest.fn((...args) => args),
  getNavigateToGameInfoEvent: jest.fn((...args) => args),
  getGameLaunchFromGameInfoEvent: jest.fn((...args) => args),
  getSeeAllLinkClickEvent: jest.fn((...args) => args),
  getCategoryFromMultifunctionalClickEvent: jest.fn((...args) => args),
  getExchangeAddSelectionToBetslip: jest.fn(),
  getSportsbookAddSelectionToBetslip: jest.fn(),
  getExchangeOnClickEdit: jest.fn(),
  getSearchLinkClickEvent: jest.fn().mockReturnValue("getSearchLinkClickEvent"),
  getSearchAzLinkClickEvent: jest.fn().mockReturnValue("getSearchAzLinkClickEvent"),
  getSbkIncrementStakeEvent: jest.fn().mockReturnValue("getSbkIncrementStakeEvent"),
  getExcIncrementSizeEvent: jest.fn().mockReturnValue("getExcIncrementSizeEvent"),
  getMarketRulesToggleModalEvent: jest.fn().mockReturnValue("getMarketRulesToggleModalEvent"),
  getMarketRulesLinkClickEvent: jest.fn().mockReturnValue("getMarketRulesLinkClickEvent"),
  getAllMarketsLinkClickEvent: jest.fn().mockReturnValue("getAllMarketsLinkClickEvent"),
  getCompetitionLinkClickEvent: jest.fn().mockReturnValue("getCompetitionLinkClickEvent"),
  getAllCompetitionsLinkClickEvent: jest.fn().mockReturnValue("getAllCompetitionsLinkClickEvent"),
  getBetReceiptExchangeDoneClickEvent: jest.fn().mockReturnValue("getBetReceiptExchangeDoneClickEvent"),
  getExchangeBetEditSuccessfull: jest.fn().mockReturnValue("getExchangeBetEditSuccessfull"),
  getExchangeFailedPlaceBetEvent: jest.fn().mockReturnValue("getExchangeFailedPlaceBetEvent"),
  getSportsbookFailedPlaceBetEvent: jest.fn(),
  getMarketGraphOpenEvent: jest.fn().mockReturnValue("getMarketGraphOpenEvent"),
  getGameTileClickEvent: jest.fn().mockReturnValue("getGameTileClickEvent"),
  getMarketGraphCloseEvent: jest.fn().mockReturnValue("getMarketGraphCloseEvent"),
  getMarketGraphSelectViewEvent: jest.fn().mockReturnValue("getMarketGraphSelectViewEvent"),
  getMarketGraphSelectGraphEvent: jest.fn().mockReturnValue("getMarketGraphSelectGraphEvent"),
  getExchangeSuccessPlaceBetEvent: jest.fn().mockReturnValue("getExchangeSuccessPlaceBetEvent"),
  getExchangeSuccessPlaceBetSelectionEvent: jest.fn().mockReturnValue("getExchangeSuccessPlaceBetSelectionEvent"),
  getSportsbookSuccessPlaceBetsEvent: jest
    .fn()
    .mockReturnValue(["getSportsbookSuccessPlaceBetsEvent1", "getSportsbookSuccessPlaceBetsEvent2"]),
  getSportsbookSuccessPlaceSelectionsEvent: jest
    .fn()
    .mockReturnValue(["getSportsbookSuccessPlaceSelectionsEvent1", "getSportsbookSuccessPlaceSelectionsEvent2"]),
  getExchangeAutoConfirmedBetClickEvent: jest.fn().mockReturnValue("getExchangeAutoConfirmedBetClickEvent"),
  getExchangeConfirmBetClickEvent: jest.fn().mockReturnValue("getExchangeConfirmBetClickEvent"),
  getMarketDepthClickEvent: jest.fn().mockReturnValue("getMarketDepthClickEvent"),
  getBottomBarClickEvent: jest.fn().mockReturnValue("getBottomBarClickEvent"),
  getMyAccountEyeIconEvent: jest.fn().mockReturnValue("getMyAccountEyeIconEvent"),
  getMyAccountToggleCashBalancesViewEvent: jest.fn().mockReturnValue("getMyAccountToggleCashBalancesViewEvent"),
  getMarketTemplatePebbleSelectionEvent: jest.fn().mockReturnValue("getMarketTemplatePebbleSelectionEvent"),
  getToggleRunnerInfoEvent: jest.fn().mockReturnValue("getToggleRunnerInfoEvent"),
  getToggleShowMoreEvent: jest.fn().mockReturnValue("getToggleShowMoreEvent"),
  getMarketBlurbExpandableEvent: jest.fn().mockReturnValue("getMarketBlurbExpandableEvent"),
  getMarketBlurbFAQEvent: jest.fn().mockReturnValue("getMarketBlurbFAQEvent"),
  getToggleRunnerInfoTabsEvent: jest.fn().mockReturnValue("getToggleRunnerInfoTabsEvent"),
  getToggleExpandableCardGroupEvent: jest.fn().mockReturnValue("getToggleExpandableCardGroupEvent"),
  getExchangePriceChangeEvent: jest.fn().mockReturnValue("getExchangePriceChangeEvent"),
  getBetslipHeaderClickEvent: jest.fn().mockReturnValue("getBetslipHeaderClickEvent"),
  getBetslipAccordionHeaderClickEvent: jest.fn().mockReturnValue("getBetslipAccordionHeaderClickEvent"),
  getBetslipSportsbookMultipleBetTypeClickEvent: jest
    .fn()
    .mockReturnValue("getBetslipSportsbookMultipleBetTypeClickEvent"),
  getBetslipSbkRemoveAllEvent: jest.fn().mockReturnValue("getBetslipSbkRemoveAllEvent"),
  getBetslipSbkReAddSelectionsEvent: jest.fn().mockReturnValue("getBetslipSbkReAddSelectionsEvent"),
  getMyBetsSbkAddPreviousSelectionsEvent: jest.fn().mockReturnValue("getMyBetsSbkAddPreviousSelectionsEvent"),
  getBetslipSbkNotificationShownEvent: jest.fn().mockReturnValue("getBetslipSbkNotificationShownEvent"),
  getBetslipSbkMaxPayoutNotificationUrlClickEvent: jest
    .fn()
    .mockReturnValue("getBetslipSbkMaxPayoutNotificationUrlClickEvent"),
  getPromotionClickEvent: jest.fn().mockReturnValue("getPromotionClickEvent"),
  getCardClickEventLabel: jest.fn().mockReturnValue("getCardClickEventLabel"),
  getSearchBarFocusEvent: jest.fn().mockReturnValue("getSearchBarFocusEvent"),
  getSearchCancelClickEvent: jest.fn().mockReturnValue("getSearchCancelClickEvent"),
  getSearchClearClickEvent: jest.fn().mockReturnValue("getSearchClearClickEvent"),
  getSearchTabClickEvent: jest.fn().mockReturnValue("getSearchTabClickEvent"),
  getBetslipBonusActivationEvent: jest.fn().mockReturnValue("getBetslipBonusActivationEvent"),
  getSettingsTabSelectEvent: jest.fn().mockReturnValue("getSettingsTabSelectEvent"),
  getContentSummaryCollapseEvent: jest.fn().mockReturnValue("getContentSummaryCollapseEvent"),
  getRaceViewLinksLinkClickEvent: jest.fn().mockReturnValue("getRaceViewLinksLinkClickEvent"),
  getJackpotMerchandiseViewEvent: jest.fn().mockReturnValue("getJackpotMerchandiseViewEvent"),
  getLoadedPageContentEvent: jest.fn().mockReturnValue("getLoadedPageContentEvent"),
  getBroadcastsToggleEvent: jest.fn().mockReturnValue("getBroadcastsToggleEvent"),
  getMediaPlayerLoadedEvent: jest.fn().mockReturnValue("getMediaPlayerLoadedEvent"),
  getTimeFormBroadCastsToggleEvent: jest.fn().mockReturnValue("getTimeFormBroadCastsToggleEvent"),
  getTimeFormBroadCastsMediaPlayerEvent: jest.fn().mockReturnValue("getTimeFormBroadCastsMediaPlayerEvent"),
  getBroadcastsAndStatisticsToggleEvent: jest.fn().mockReturnValue("getBroadcastsAndStatisticsToggleEvent"),
  getBroadcastsAndStatisticsCardMediaPlayerEvent: jest
    .fn()
    .mockReturnValue("getBroadcastsAndStatisticsCardMediaPlayerEvent"),
  getBetslipEachWayToggleEvent: jest.fn().mockReturnValue("getBetslipEWToggleEvent"),
  getBetslipAccaInsuranceToggleEvent: jest.fn().mockReturnValue("getBetslipAccaInsuranceToggleEvent"),
  getBetslipMyOddsBoostToggleEvent: jest.fn().mockReturnValue("getBetslipMyOddsBoostToggleEvent"),
  getSwitcherEvent: jest.fn().mockReturnValue("getSwitcherEvent"),
  getBetslipCastBetChangeEvent: jest.fn(),
  getBetslipCastBetOrderChangeEvent: jest.fn(),
  getToggleTimeFormEvent: jest.fn(),
  getNavigationTabClickEvent: jest.fn().mockReturnValue("getNavigationTabClickEvent"),
  getViewAllTapEvent: jest.fn().mockReturnValue("getViewAllTapEvent"),
  getMyAccountQuickLinkEvent: jest.fn().mockReturnValue("getMyAccountQuickLinkEvent"),
  getMyAccountMenuLinkEvent: jest.fn().mockReturnValue("getMyAccountMenuLinkEvent"),
  getNavigationSeeAllPromotionsEvent: jest.fn().mockReturnValue("getNavigationSeeAllPromotionsEvent"),
  getAcceptPromotionEvent: jest.fn().mockReturnValue("getAcceptPromotionEvent"),
  getCancelPromotionEvent: jest.fn().mockReturnValue("getCancelPromotionEvent"),
  getNavigateToEvent: jest.fn().mockReturnValue("getNavigateToEvent"),
  getLoadedNotFoundView: jest.fn().mockReturnValue("getLoadedNotFoundView"),
  getNavigateFromNotFoundView: jest.fn().mockReturnValue("getNavigateFromNotFoundView"),
  getMyBetsEditClickEvent: jest.fn().mockReturnValue("getMyBetsEditClickEvent"),
  getMyBetsEditBottomSheetCloseEvent: jest.fn().mockReturnValue("getMyBetsEditBottomSheetCloseEvent"),
  getMyBetsBetSharingPreviewOnTapEvent: jest.fn().mockReturnValue("getMyBetsBetSharingPreviewOnTapEvent"),
  getMyBetsBetSharingDismissOnTapEvent: jest.fn().mockReturnValue("getMyBetsBetSharingDismissOnTapEvent"),
  getMyBetsBetSharingShareBetOnTapEvent: jest.fn().mockReturnValue("getMyBetsBetSharingShareBetOnTapEvent"),
  getMyBetsBetSharingShareImageOnTapEvent: jest.fn().mockReturnValue("getMyBetsBetSharingShareImageOnTapEvent"),
  getMyBetsAccaFreezeOpenedEvent: jest.fn().mockReturnValue("getMyBetsAccaFreezeOpenedEvent"),
  getMyBetsAccaFreezeClosedEvent: jest.fn().mockReturnValue("getMyBetsAccaFreezeClosedEvent"),
  getBetMutationAccaFreezeSelectedEvent: jest.fn().mockReturnValue("getBetMutationAccaFreezeSelectedEvent"),
  getBetMutationAccaFreezeDeselectedEvent: jest.fn().mockReturnValue("getBetMutationAccaFreezeDeselectedEvent"),
  getBetMutationAccaFreezeConfirmEvent: jest.fn().mockReturnValue("getBetMutationAccaFreezeConfirmEvent"),
  getCashoutClickEvent: jest.fn(),
  getCashoutSuccessEvent: jest.fn(),
  getCashoutFailureEvent: jest.fn(),
  getAutoConfirmCashoutClickEvent: jest.fn(),
  getFilterOpenEvent: jest.fn().mockReturnValue("getFilterOpenEvent"),
  getFilterCloseEvent: jest.fn().mockReturnValue("getFilterCloseEvent"),
  getFilterApplyEvent: jest.fn().mockReturnValue("getFilterApplyEvent"),
  getFilterResetClickEvent: jest.fn().mockReturnValue("getFilterResetClickEvent"),
  getSawCardEvent: jest.fn().mockReturnValue("getSawCardEvent"),
  getMyBetsCancelAllEvent: jest.fn().mockReturnValue("getMyBetsCancelAllEvent"),
  getViewFromFavouritesClickEvent: jest.fn().mockReturnValue("getViewFromFavouritesClickEvent"),
  getPNInteractionClickEvent: jest.fn().mockReturnValue("getPNInteractionClickEvent"),
  getCouponViewCardClickEvent: jest.fn(() => "getCouponViewCardClickEvent"),
  getSwitchProductEvent: jest.fn().mockReturnValue("getSwitchProductEvent"),
  getToggleRecentRacesEvent: jest.fn().mockReturnValue("getToggleRecentRacesEvent"),
  getToggleMarketGraphEvent: jest.fn().mockReturnValue("getToggleMarketGraphEvent"),
  getBetslipBetBuilderAddSelections: jest.fn().mockReturnValue("getBetslipBetBuilderAddSelections"),
  getBetslipBetBuilderNavigateToEvent: jest.fn().mockReturnValue("getBetslipBetBuilderNavigateToEvent"),
  getBetslipBetBuilderRemoveSelections: jest.fn().mockReturnValue("getBetslipBetBuilderRemoveSelections"),
  getBetslipBetBuilderSwipedEvent: jest.fn().mockReturnValue("getBetslipBetBuilderSwipedEvent"),
  getNextRacesRaceClickEvent: jest.fn().mockReturnValue("getNextRacesRaceClickEvent"),
  getStatisticsModalToggleEvent: jest.fn().mockReturnValue("getStatisticsModalToggleEvent"),
  getStatisticsItemClickEvent: jest.fn().mockReturnValue("getStatisticsItemClickEvent"),
  getNextRacesFilterClickEvent: jest.fn().mockReturnValue("getNextRacesFilterClickEvent"),
  getMarketSnackBarEvent: jest.fn().mockReturnValue("getMarketSnackBarEvent"),
  getAzSwitchToggleEvent: jest.fn().mockReturnValue("getAzSwitchToggleEvent"),
  getMyBetsOrderTypePressEvent: jest.fn().mockReturnValue("getMyBetsOrderTypePressEvent"),
  getPromoDescriptionToggleEvent: jest.fn().mockReturnValue("getPromoDescriptionToggleEvent"),
  getBetslipExchangeLoginToPlaceBetClickEvent: jest.fn().mockReturnValue("getBetslipExchangeLoginToPlaceBetClickEvent"),
  getBetslipSportsbookLoginToPlaceBetClickEvent: jest
    .fn()
    .mockReturnValue("getBetslipSportsbookLoginToPlaceBetClickEvent"),
  getToggleAccordionEvent: jest.fn().mockReturnValue("getToggleAccordionEvent"),
  getCopyBetIdToClipboardEvent: jest.fn().mockReturnValue("getCopyBetIdToClipboardEvent"),
  getNavigateToMobileWebEvent: jest.fn().mockReturnValue("getNavigateToMobileWebEvent"),
  getRaceReplaysMediaPlayerEvent: jest.fn().mockReturnValue("getRaceReplaysMediaPlayerEvent"),
  getRaceReplaysToggleEvent: jest.fn().mockReturnValue("getRaceReplaysToggleEvent"),
  getMaxPayoutAcceptMessageClickEvent: jest.fn().mockReturnValue("getMaxPayoutAcceptMessageClickEvent"),
  getLoyaltyPromotionOptInTapEvent: jest.fn().mockReturnValue("getLoyaltyPromotionOptInTapEvent"),
  getLoyaltyPromotionCTATapEvent: jest.fn().mockReturnValue("getLoyaltyPromotionCTATapEvent"),
  getLoyaltyPromotionBottomSheetOpenEvent: jest.fn().mockReturnValue("getLoyaltyPromotionBottomSheetOpenEvent"),
  getLoyaltyPromotionBottomSheetCloseEvent: jest.fn().mockReturnValue("getLoyaltyPromotionBottomSheetCloseEvent"),
  getMyBetsExchangeOrderStatusClickEvent: jest.fn().mockReturnValue("getMyBetsExchangeOrderStatusClickEvent"),
  getBetReceiptToggleClickEvent: jest.fn().mockReturnValue("getBetReceiptToggleClickEvent"),
  getBetReceiptSuccessMessageSaw: jest.fn().mockReturnValue("getBetReceiptSuccessMessageSaw"),
}));

jest.mock("../state/betting/sportsbook-cashouts/sportsbook-cashout-selectors", () => ({
  getQuoteByURN: jest.fn(),
}));

jest.mock("../state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => jest.fn().mockImplementation((bet) => bet)),
}));

jest.mock("../helpers/betting", () => ({
  getUniqueId: jest.fn(() => "uniqueId"),
}));

jest.mock("./ga4-tagging-resolvers/game-interactions", () => ({
  getLoadedPageContentEvent: jest.fn(() => "getLoadedPageContentEvent"),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    event: {
      decode: jest.fn(() => "decodedEventId"),
    },
    gaming: {
      game: {
        encode: jest.fn(),
      },
    },
  },
  EntityType: {
    GenericViewLinkCard: "ppb:tbd:card:genericViewLink:generic",
  },
}));

async function setup(sendEvent, getState, actionType, nextSpy, payload) {
  let action;
  if (payload !== undefined) {
    action = {
      type: actionType,
      payload,
    };
  } else {
    action = {
      type: actionType,
    };
  }
  return createLegacyTaggingMiddleware(sendEvent)({ getState })(nextSpy || jest.fn())(action);
}

describe("Legacy Tagging Middleware", () => {
  const sendEvent = jest.fn();
  let getState;
  let nextSpy;

  beforeEach(() => {
    getState = jest.fn().mockReturnValue({
      state: "mock",
    });
  });

  afterEach(jest.clearAllMocks);

  describe("and event is null", () => {
    it("should NOT send an event", async () => {
      getExchangeFailedPlaceBetEvent.mockReturnValue(null);
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, NETWORK__PLACE_EXC_BET_FAILURE, nextSpy, { error: "dummyError" });

      expect(sendEvent).not.toHaveBeenCalled();
    });
  });

  describe("and event is NOT null", () => {
    it("should send an event", async () => {
      getExchangeFailedPlaceBetEvent.mockReturnValue("theBestFailedPlaceBetEvent");
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, NETWORK__PLACE_EXC_BET_FAILURE, nextSpy, { error: "dummyError" });

      expect(sendEvent).toHaveBeenCalledWith("theBestFailedPlaceBetEvent");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when is an action not defined", () => {
    it("should propagate action", async () => {
      nextSpy = jest.fn();

      await setup(sendEvent, getState, "NOT_DEFINED", nextSpy);
      expect(nextSpy).toHaveBeenCalledWith({
        type: "NOT_DEFINED",
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__FOOTER_LINK_CLICK", () => {
    beforeEach(jest.clearAllMocks);
    it("should propagate action with url and text", async () => {
      getLinkClickEvent.mockReturnValue({
        mock: "getLinkClickEvent",
      });
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__FOOTER_LINK_CLICK, nextSpy, {
        url: "some url",
        text: "some text",
      });

      expect(nextSpy).toHaveBeenCalledWith({
        type: UI__FOOTER_LINK_CLICK,
        payload: {
          url: "some url",
          text: "some text",
        },
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should send analytics event", async () => {
      getLinkClickEvent.mockReturnValue({
        mock: "getLinkClickEvent",
      });
      await setup(sendEvent, getState, UI__FOOTER_LINK_CLICK, jest.fn(), {
        url: "some url",
        text: "some text",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__MY_ACCOUNT_ICON_CLICK", () => {
    beforeAll(async () => {
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
    });

    describe("and payload is 'false'", () => {
      beforeAll(async () => {
        await setup(sendEvent, getState, UI__MY_ACCOUNT_ICON_CLICK, nextSpy, false);
      });

      it("should send a toggle my account menu event with 'closed' action", () => {
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(getMyAccountMenuToggleEvent).toHaveBeenCalledWith(false);
        expect(sendEvent).toHaveBeenCalledWith("myAccountMenuToggleEvent");
      });
    });

    describe("and payload is 'true'", () => {
      beforeAll(async () => {
        await setup(sendEvent, getState, UI__MY_ACCOUNT_ICON_CLICK, nextSpy, true);
      });

      it("should send a toggle my account menu event with 'opened' action", () => {
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(getMyAccountMenuToggleEvent).toHaveBeenCalledWith(true);
        expect(sendEvent).toHaveBeenCalledWith("myAccountMenuToggleEvent");
      });
    });
  });

  describe("when action type is UI__USER_LOGOUT_CLICK", () => {
    beforeAll(async () => {
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__USER_LOGOUT_CLICK, nextSpy);
    });

    it("should send a LogoutClick event", () => {
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(getLogoutClickEvent).toHaveBeenCalledWith();
      expect(sendEvent).toHaveBeenCalledWith("logoutClickEvent");
    });
  });

  describe("when action type is UI__MARKET_EXC_BET_BUTTON_CLICK", () => {
    describe("GTM open betslip event", () => {
      const appState = { entities: { exchangePotentialBets: [] } };

      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => appState);
        getExchangeAddSelectionToBetslip.mockReturnValue(null);
        await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, {});
      });

      it("should call `getBetslipVisibilityState` API with app state", () => {
        expect(getBetslipVisibilityState).toHaveBeenCalledWith(appState);
        expect(getBetslipVisibilityState).toHaveBeenCalledTimes(1);
      });

      describe("and when `getBetslipVisibilityState` is false", () => {
        beforeEach(async () => {
          jest.clearAllMocks();
          getBetslipVisibilityState.mockReturnValue(false);
          await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, {});
        });

        it("should call `sendEvent` API", () => {
          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(getOpenBetslipEvent).toHaveBeenCalledWith(Product.Exchange);
          expect(sendEvent).toHaveBeenCalledWith("getOpenBetslipEvent");
        });
      });

      describe("and when `getBetslipVisibilityState` is true", () => {
        beforeEach(async () => {
          jest.clearAllMocks();
          getBetslipVisibilityState.mockReturnValue(true);
          await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, {});
        });

        it("should not call `sendEvent` API", () => {
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });

    describe("GTM remove selection event", () => {
      describe("when it is possible to create an event for ExchangeRemoveSelection but not sportsbook", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue(null);
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, {
            side: ExchangeSide.BACK,
            urn: "URN",
          });
        });

        it("should call getBetslipExchangeRemoveSelectionEvent", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
        });

        it("should call getBetslipSportsbookRemoveSelectionEvent", () => {
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { runnerUrn: "URN" });
        });

        it("should send a ExchangeRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
        });
      });

      describe("when it is possible to create an event for SportsbookRemoveSelection but not exchange", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue(null);
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, {
            side: ExchangeSide.BACK,
            urn: "URN",
          });
        });

        it("should call getBetslipExchangeRemoveSelectionEvent with the side from payload", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
        });

        it("should call getBetslipSportsbookRemoveSelectionEvent", () => {
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { runnerUrn: "URN" });
        });

        it("should send a SportsbookRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
        });
      });

      describe("when it is possible to create an event for both", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, {
            side: ExchangeSide.BACK,
            urn: "URN",
          });
        });
        it("should call getBetslipExchangeRemoveSelectionEvent", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
        });

        it("should call getBetslipSportsbookRemoveSelectionEvent", () => {
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { runnerUrn: "URN" });
        });

        it("should send a ExchangeRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
        });

        it("should send a SportsbookRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
        });
      });

      describe("when it is not possible to create any event", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue(null);
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue(null);
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, {
            side: ExchangeSide.BACK,
            uniqueId: "uniqueId",
          });
        });
        it("should call getBetslipExchangeRemoveSelectionEvent with the side from payload", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
        });

        it("should not send an event", () => {
          expect(sendEvent).not.toHaveBeenCalled();
        });

        it("should propagate the action", () => {
          expect(nextSpy).toHaveBeenCalledWith({
            type: UI__MARKET_EXC_BET_BUTTON_CLICK,
            payload: {
              side: ExchangeSide.BACK,
              uniqueId: "uniqueId",
            },
          });
        });
      });
    });

    describe("GTM add selection event", () => {
      const appState = {
        entities: {
          competitions: "competitions",
          exchangemarkets: "exchangemarkets",
          exchangerunners: "exchangerunners",
          sportevents: "sportevents",
          sports: "sports",
        },
        cards: { markets: "MarketCards" },
        layouts: { pages: "pages" },
        router: { pageUrn: "page:urn" },
      };
      const addSelectionSetup = async ({ payload = {}, getExchangeAddSelectionToBetslipReturn = null }) => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => appState);
        getBetslipVisibilityState.mockReturnValue(true);
        getBetslipExchangeRemoveSelectionEvent.mockReturnValue(false);
        getExchangeAddSelectionToBetslip.mockReturnValue(getExchangeAddSelectionToBetslipReturn);
        await setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, payload);
      };

      it("should call getExchangeAddSelectionToBetslip", async () => {
        const payload = { event: "yes", betOriginURL: "http://localhost/" };
        await addSelectionSetup({ payload });

        expect(getExchangeAddSelectionToBetslip).toHaveBeenCalledWith(
          appState,
          { type: UI__MARKET_EXC_BET_BUTTON_CLICK, payload },
          {
            pebbleCardGroupTitle: "pebbleCardGroup",
            cardGroupTitle: "pebbleCardGroup",
            tabName: "tab",
            horizontalPosition: 1,
            verticalPosition: 2,
            viewZoneTitle: "viewZoneTitle",
          },
        );
        expect(getExchangeAddSelectionToBetslip).toHaveBeenCalledTimes(1);
      });

      describe("when getExchangeAddSelectionToBetslip returns null", () => {
        it("should NOT call sendEvent", async () => {
          await addSelectionSetup({ payload: { event: "yes" }, getExchangeAddSelectionToBetslipReturn: null });
          setup(sendEvent, getState, UI__MARKET_EXC_BET_BUTTON_CLICK, nextSpy, { event: "yes" });

          expect(sendEvent).not.toHaveBeenCalled();
        });
      });

      describe("when getExchangeAddSelectionToBetslip returns an event", () => {
        it("should call sendEvent", async () => {
          await addSelectionSetup({
            payload: { event: "anything" },
            getExchangeAddSelectionToBetslipReturn: { event: "yes" },
          });

          expect(sendEvent).toHaveBeenCalledWith({ event: "yes" });
          expect(sendEvent).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("when action type is UI__MARKET_SBK_BET_BUTTON_CLICK", () => {
    describe("GTM open betslip event", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => "appState");
        await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, { urn: "urn" });
      });

      it("should call `getBetslipVisibilityState` API with app state", () => {
        expect(getBetslipVisibilityState).toHaveBeenCalledWith("appState");
        expect(getBetslipVisibilityState).toHaveBeenCalledTimes(1);
      });

      describe("and when `getBetslipVisibilityState` is false", () => {
        beforeEach(async () => {
          jest.clearAllMocks();
          getBetslipVisibilityState.mockReturnValue(false);
          await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, { urn: "urn" });
        });

        it("should call `sendEvent` API", () => {
          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(getOpenBetslipEvent).toHaveBeenCalledWith(Product.Sportsbook);
          expect(sendEvent).toHaveBeenCalledWith("getOpenBetslipEvent");
        });
      });

      describe("and when `getBetslipVisibilityState` is true", () => {
        beforeEach(async () => {
          jest.clearAllMocks();
          getBetslipVisibilityState.mockReturnValue(true);
          await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, { urn: "urn" });
        });

        it("should not call `sendEvent` API", () => {
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });

    describe("GTM remove selection event", () => {
      describe("when it is possible to create an event for ExchangeRemoveSelection but not sportsbook", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue(null);
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, { urn: "URN" });
        });

        it("should call getBetslipExchangeRemoveSelectionEvent with the side from payload", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
        });

        it("should call getBetslipSportsbookRemoveSelectionEvent", () => {
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { runnerUrn: "URN" });
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledTimes(1);
        });

        it("should send a ExchangeRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
          expect(sendEvent).toHaveBeenCalledTimes(1);
        });
      });

      describe("when it is possible to create an event for SportsbookRemoveSelection but not exchange", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue(null);
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, { urn: "URN" });
        });

        it("should call getBetslipExchangeRemoveSelectionEvent with the side from payload", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
        });

        it("should call getBetslipSportsbookRemoveSelectionEvent", () => {
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { runnerUrn: "URN" });
        });

        it("should send a SportsbookRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
        });
      });

      describe("when it is possible to create an event for both", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, { urn: "URN" });
        });

        it("should call getBetslipExchangeRemoveSelectionEvent with the side from payload", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
        });

        it("should call getBetslipSportsbookRemoveSelectionEvent", () => {
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { runnerUrn: "URN" });
        });

        it("should send a ExchangeRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipExchangeRemoveSelectionEvent",
          });
        });

        it("should send a SportsbookRemoveSelection event", () => {
          expect(sendEvent).toHaveBeenCalledWith({
            mock: "getBetslipSportsbookRemoveSelectionEvent",
          });
        });
      });

      describe("when it is not possible to create any event", () => {
        beforeEach(async () => {
          getBetslipExchangeRemoveSelectionEvent.mockReturnValue(null);
          getBetslipSportsbookRemoveSelectionEvent.mockReturnValue(null);
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, {
            urn: "URN",
            uniqueId: "uniqueId",
          });
        });

        it("should call getBetslipExchangeRemoveSelectionEvent with the side from payload", () => {
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalledWith(getState());
        });

        it("should call getBetslipSportsbookRemoveSelectionEvent", () => {
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledTimes(1);
          expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { runnerUrn: "URN" });
        });

        it("should not send an event", () => {
          expect(sendEvent).not.toHaveBeenCalled();
        });

        it("should propagate the action", () => {
          expect(nextSpy).toHaveBeenCalledWith({
            type: UI__MARKET_SBK_BET_BUTTON_CLICK,
            payload: {
              urn: "URN",
              uniqueId: "uniqueId",
            },
          });
        });
      });
    });

    describe("GTM add selection event", () => {
      const appState = {
        cards: { markets: "MarketCards" },
        layouts: { pages: "pages" },
        router: { pageUrn: "page:urn" },
      };
      const addSelectionSetup = async ({ payload = {}, getSportsbookAddSelectionToBetslipReturn = null }) => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => appState);
        getBetslipVisibilityState.mockReturnValue(true);
        getBetslipSportsbookRemoveSelectionEvent.mockReturnValue(false);
        getSportsbookAddSelectionToBetslip.mockReturnValue(getSportsbookAddSelectionToBetslipReturn);
        await setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, payload);
      };

      it("should call getSportsbookAddSelectionToBetslip", async () => {
        const payload = { event: "yes", betOriginURL: "http://localhost/" };
        await addSelectionSetup({ payload });

        expect(getSportsbookAddSelectionToBetslip).toHaveBeenCalledWith(
          appState,
          { type: UI__MARKET_SBK_BET_BUTTON_CLICK, payload },
          {
            pebbleCardGroupTitle: "pebbleCardGroup",
            cardGroupTitle: "pebbleCardGroup",
            tabName: "tab",
            horizontalPosition: 1,
            verticalPosition: 2,
            viewZoneTitle: "viewZoneTitle",
          },
        );
        expect(getSportsbookAddSelectionToBetslip).toHaveBeenCalledTimes(1);
      });

      describe("when getSportsbookAddSelectionToBetslip returns null", () => {
        it("should NOT call sendEvent", async () => {
          await addSelectionSetup({ payload: { event: "yes" }, getSportsbookAddSelectionToBetslipReturn: null });
          setup(sendEvent, getState, UI__MARKET_SBK_BET_BUTTON_CLICK, nextSpy, { event: "yes" });

          expect(sendEvent).not.toHaveBeenCalled();
        });
      });

      describe("when getSportsbookAddSelectionToBetslip returns an event", () => {
        it("should call sendEvent", async () => {
          await addSelectionSetup({
            payload: { event: "anything" },
            getSportsbookAddSelectionToBetslipReturn: { event: "yes" },
          });

          expect(sendEvent).toHaveBeenCalledWith({ event: "yes" });
          expect(sendEvent).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK", () => {
    beforeAll(async () => {
      getDontUpdateBetClickEvent.mockReturnValue({
        mock: "getDontUpdateBetClickEvent",
      });
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK, nextSpy);
    });

    it("should send a EditedBet event", () => {
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getDontUpdateBetClickEvent",
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK", () => {
    beforeAll(async () => {
      getOpenPersistenceTypeMenuEvent.mockReturnValue({
        mock: "getOpenPersistenceTypeMenuEvent",
      });
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK, nextSpy);
    });

    it("should send a SHOW event", () => {
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getOpenPersistenceTypeMenuEvent",
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK", () => {
    beforeEach(async () => {
      getUpdateBetClickEvent.mockReturnValue({
        mock: "getUpdateBetClickEvent",
      });
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn().mockReturnValue("appState");
      getBetslipExchangeContext.mockReturnValue({ side: ExchangeSide.BACK });

      await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK, nextSpy);
    });

    it("should get BetslipExchangeContext", () => {
      expect(getBetslipExchangeContext).toHaveBeenCalledWith("appState");
      expect(getBetslipExchangeContext).toHaveBeenCalledTimes(1);
    });

    it("should call getUpdateBetClickEvent with the correct parameters", () => {
      expect(getUpdateBetClickEvent).toHaveBeenCalledTimes(1);
      expect(getUpdateBetClickEvent).toHaveBeenCalledWith(ExchangeSide.BACK);
    });

    it("should send a Submitted Bet event", () => {
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getUpdateBetClickEvent",
      });
    });
  });

  describe("when action type is related  with cancelling an Unmatched Bet", () => {
    const betslipCancelUnmatchedBetSetup = async (
      actionType,
      getBetslipCancelBetClickEventReturn = null,
      payload = {},
    ) => {
      getBetslipCancelBetClickEvent.mockReturnValue(getBetslipCancelBetClickEventReturn);
      nextSpy.mockReturnValue("nextReturnValue");
      getState.mockReturnValue("appState");
      await setup(sendEvent, getState, actionType, nextSpy, payload);
    };

    describe("when action type is UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK", () => {
      it("should call getBetslipCancelBetClickEvent with the correct parameters", async () => {
        await betslipCancelUnmatchedBetSetup(
          UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
          "getBetslipCancelBetClickEventInProgress",
        );

        expect(getBetslipCancelBetClickEvent).toHaveBeenCalledTimes(1);
        expect(getBetslipCancelBetClickEvent).toHaveBeenCalledWith("appState", "edited bet", "cancel bet");
      });

      it("should send a `edited bet` event", async () => {
        await betslipCancelUnmatchedBetSetup(
          UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
          "getBetslipCancelBetClickEventInProgress",
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipCancelBetClickEventInProgress");
      });

      describe("when event is undefined", () => {
        it("should not send any event", async () => {
          getBetslipCancelBetClickEvent.mockReturnValueOnce(undefined);
          await betslipCancelUnmatchedBetSetup(
            UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
            "getBetslipCancelBetClickEventInProgress",
          );

          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });

    describe("when action type is NETWORK__CANCEL_EXC_BET_SUCCESS", () => {
      it("should call getBetslipCancelBetClickEvent with the correct parameters", async () => {
        await betslipCancelUnmatchedBetSetup(NETWORK__CANCEL_EXC_BET_SUCCESS, "getBetslipCancelBetClickEventSuccess");

        expect(getBetslipCancelBetClickEvent).toHaveBeenCalledTimes(1);
        expect(getBetslipCancelBetClickEvent).toHaveBeenCalledWith(
          "appState",
          "cancelled unmatched bet - success",
          "cancelled unmatched bet",
        );
      });

      it("should send a `cancelled unmatched bet - success` event", async () => {
        await betslipCancelUnmatchedBetSetup(NETWORK__CANCEL_EXC_BET_SUCCESS, "getBetslipCancelBetClickEventSuccess");

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipCancelBetClickEventSuccess");
      });

      describe("when event is undefined", () => {
        it("should not send any event", async () => {
          getBetslipCancelBetClickEvent.mockReturnValueOnce(undefined);
          await betslipCancelUnmatchedBetSetup(NETWORK__CANCEL_EXC_BET_SUCCESS, "getBetslipCancelBetClickEventSuccess");

          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });

    describe("when action type is NETWORK__CANCEL_EXC_BET_FAILURE", () => {
      const payload = { error: { errorCode: "ETX_ERROR_CODE_MOCK" } };

      it("should call getBetslipCancelBetClickEvent with the correct parameters", async () => {
        await betslipCancelUnmatchedBetSetup(
          NETWORK__CANCEL_EXC_BET_FAILURE,
          "getBetslipCancelBetClickEventFailure",
          payload,
        );

        expect(getBetslipCancelBetClickEvent).toHaveBeenCalledTimes(1);
        expect(getBetslipCancelBetClickEvent).toHaveBeenCalledWith(
          "appState",
          "cancelled unmatched bet - error",
          "etx_error_code_mock",
          "ETX_ERROR_CODE_MOCK",
        );
      });

      it("should send a `cancelled unmatched bet - error` event", async () => {
        await betslipCancelUnmatchedBetSetup(
          NETWORK__CANCEL_EXC_BET_FAILURE,
          "getBetslipCancelBetClickEventFailure",
          payload,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipCancelBetClickEventFailure");
      });

      describe("when event is undefined", () => {
        it("should not send any event", async () => {
          getBetslipCancelBetClickEvent.mockReturnValueOnce(undefined);
          await betslipCancelUnmatchedBetSetup(
            NETWORK__CANCEL_EXC_BET_FAILURE,
            "getBetslipCancelBetClickEventSuccess",
            payload,
          );

          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when action type is NETWORK__UPDATE_EXC_BET_FAILURE", () => {
    const editBetFailureSetup = async (getUpdateBetFailureEventReturn = null) => {
      getUpdateBetFailureEvent.mockReturnValue(getUpdateBetFailureEventReturn);
      const payload = { error: { errorCode: "ETX_ERROR_CODE_MOCK" } };

      nextSpy.mockReturnValue("nextReturnValue");
      getState.mockReturnValue("appState");
      await setup(sendEvent, getState, NETWORK__UPDATE_EXC_BET_FAILURE, nextSpy, payload);
    };

    it("should call getCancelBetClickEvent with the correct parameters", async () => {
      await editBetFailureSetup("getCancelBetClickEventFailure");

      expect(getUpdateBetFailureEvent).toHaveBeenCalledTimes(1);
      expect(getUpdateBetFailureEvent).toHaveBeenCalledWith("appState", "ETX_ERROR_CODE_MOCK");
    });

    it("should send a `cancelled unmatched bet - error` event", async () => {
      await editBetFailureSetup("getCancelBetClickEventFailure");

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCancelBetClickEventFailure");
    });

    it("should not trigger sendEvent, if there is no event", async () => {
      await editBetFailureSetup();

      expect(sendEvent).not.toHaveBeenCalled();
    });
  });

  describe("when action type is UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK", () => {
    const persistenceTypeChangeClickSetup = async (changePersistenceTypeEventReturn) => {
      getChangePersistenceTypeClickEvent.mockReturnValue(changePersistenceTypeEventReturn);
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn().mockReturnValue("appState");
      const payload = { persistenceType: "persistenceTypeMock" };
      await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK, nextSpy, payload);
    };
    it("should call getChangePersistenceTypeClickEvent with the correct parameters", async () => {
      await persistenceTypeChangeClickSetup();

      expect(getChangePersistenceTypeClickEvent).toHaveBeenCalledTimes(1);
      expect(getChangePersistenceTypeClickEvent).toHaveBeenCalledWith("appState", "persistenceTypeMock");
    });

    it("should send a Toggled On event when resolver returns a valid event", async () => {
      await persistenceTypeChangeClickSetup("getChangePersistenceTypeClickEvent");

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getChangePersistenceTypeClickEvent");
    });

    it("should not send event when resolver returns null", async () => {
      await persistenceTypeChangeClickSetup(null);

      expect(sendEvent).not.toHaveBeenCalled();
    });
  });

  describe("when action type is UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK", () => {
    describe("when the gtm event is complete", () => {
      beforeEach(async () => {
        const payload = { betId: "123", betOriginURL: "http://localhost/" };
        getExchangeOnClickEdit.mockReturnValue({
          mock: "getExchangeOnClickEdit",
        });
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK, nextSpy, payload);
      });
      it("should call getExchangeOnClickEdit with the correct parameters", () => {
        expect(getExchangeOnClickEdit).toHaveBeenCalledWith({ state: "mock" }, "123", "http://localhost/");
        expect(getExchangeOnClickEdit).toHaveBeenCalledTimes(1);
      });
      it("should send a getExchangeOnClickEdit event", () => {
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          mock: "getExchangeOnClickEdit",
        });
      });
    });
    describe("when the gtm event is null", () => {
      beforeEach(async () => {
        const payload = { betId: "123" };
        getExchangeOnClickEdit.mockReturnValue(null);
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK, nextSpy, payload);
      });
      it("should not send a getExchangeOnClickEdit event", () => {
        expect(sendEvent).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when action type is NETWORK__UPDATE_EXC_BET_SUCCESS", () => {
    describe("when there's no payload report", () => {
      it("should return null", async () => {
        const payload = { betOriginURL: "http://localhost/" };
        getExchangeBetEditSuccessfull.mockReturnValue({
          mock: "getExchangeBetEditSuccessfull",
        });
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        const result = await setup(sendEvent, getState, NETWORK__UPDATE_EXC_BET_SUCCESS, nextSpy, payload);

        expect(result).toBeNull();
        expect(getExchangeBetEditSuccessfull).not.toHaveBeenCalled();
      });
    });

    describe("when the gtm event is complete", () => {
      beforeEach(async () => {
        const payload = { report: "report", betOriginURL: "http://localhost/" };
        getExchangeBetEditSuccessfull.mockReturnValue({
          mock: "getExchangeBetEditSuccessfull",
        });
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, NETWORK__UPDATE_EXC_BET_SUCCESS, nextSpy, payload);
      });
      it("should call getExchangeBetEditSuccessfull with the correct parameters", () => {
        expect(getExchangeBetEditSuccessfull).toHaveBeenCalledWith({ state: "mock" }, "report", "http://localhost/");
        expect(getExchangeBetEditSuccessfull).toHaveBeenCalledTimes(1);
      });
      it("should send a getExchangeBetEditSuccessfull event", () => {
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          mock: "getExchangeBetEditSuccessfull",
        });
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_PLACE_BET_CLICK", () => {
    describe("getPlaceExchangeBetClickEvent", () => {
      describe("and event is not null", () => {
        it("should send a PlaceExchangeBet event", async () => {
          const sendEventSpy = jest.fn();

          getPlaceExchangeBetClickEvent.mockReturnValue({
            mock: "getPlaceExchangeBetClickEvent",
          });
          getExchangeAutoConfirmedBetClickEvent.mockReturnValue(null);
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEventSpy, getState, UI__BETSLIP_EXC_PLACE_BET_CLICK, nextSpy, {
            confirmFirst: false,
          });

          expect(getPlaceExchangeBetClickEvent).toHaveBeenCalledTimes(1);
          expect(getPlaceExchangeBetClickEvent).toHaveBeenCalledWith({
            state: "mock",
          });
          expect(sendEventSpy).toHaveBeenCalledTimes(1);
          expect(sendEventSpy).toHaveBeenCalledWith({
            mock: "getPlaceExchangeBetClickEvent",
          });
        });
      });
      describe("and event is null", () => {
        it("should not send an event", async () => {
          getPlaceExchangeBetClickEvent.mockReturnValue(null);
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEvent, getState, UI__BETSLIP_EXC_PLACE_BET_CLICK, nextSpy, {
            confirmFirst: false,
          });

          expect(sendEvent).toHaveBeenCalledTimes(0);
        });
      });
    });
    describe("getExchangeAutoConfirmedBetClickEvent", () => {
      describe("and confirmFirst is false", () => {
        describe("and event is not null", () => {
          it("should send a PlaceExchangeBet event", async () => {
            const sendEventSpy = jest.fn();

            getPlaceExchangeBetClickEvent.mockReturnValue(null);
            getExchangeAutoConfirmedBetClickEvent.mockReturnValue({
              mock: "getExchangeAutoConfirmedBetClickEvent",
            });

            nextSpy = jest.fn().mockReturnValue("nextReturnValue");
            await setup(sendEventSpy, getState, UI__BETSLIP_EXC_PLACE_BET_CLICK, nextSpy, {
              confirmFirst: false,
            });

            expect(getExchangeAutoConfirmedBetClickEvent).toHaveBeenCalledTimes(1);
            expect(getExchangeAutoConfirmedBetClickEvent).toHaveBeenCalledWith({
              state: "mock",
            });
            expect(sendEventSpy).toHaveBeenCalledTimes(1);
            expect(sendEventSpy).toHaveBeenCalledWith({
              mock: "getExchangeAutoConfirmedBetClickEvent",
            });
          });
        });
        describe("and event is null", () => {
          it("should not send an event", async () => {
            getPlaceExchangeBetClickEvent.mockReturnValue(null);
            getExchangeAutoConfirmedBetClickEvent.mockReturnValue(null);
            nextSpy = jest.fn().mockReturnValue("nextReturnValue");
            await setup(sendEvent, getState, UI__BETSLIP_EXC_PLACE_BET_CLICK, nextSpy, {
              confirmFirst: false,
            });

            expect(sendEvent).toHaveBeenCalledTimes(0);
          });
        });
      });
      describe("and confirmFirst is true", () => {
        it("should not send an event", async () => {
          const sendEventSpy = jest.fn();

          getExchangeAutoConfirmedBetClickEvent.mockReturnValue({
            mock: "getExchangeAutoConfirmedBetClickEvent",
          });
          nextSpy = jest.fn().mockReturnValue("nextReturnValue");
          await setup(sendEventSpy, getState, UI__BETSLIP_EXC_PLACE_BET_CLICK, nextSpy, {
            confirmFirst: true,
          });

          expect(getExchangeAutoConfirmedBetClickEvent).not.toHaveBeenCalled();
          expect(sendEventSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_CONFIRM_BET_CLICK", () => {
    describe("and event is not null", () => {
      it("should send a PlaceExchangeBet event", async () => {
        const sendEventSpy = jest.fn();

        getExchangeConfirmBetClickEvent.mockReturnValue({
          mock: "getExchangeConfirmBetClickEvent",
        });
        getExchangeAutoConfirmedBetClickEvent.mockReturnValue(null);
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEventSpy, getState, UI__BETSLIP_EXC_CONFIRM_BET_CLICK, nextSpy);

        expect(getExchangeConfirmBetClickEvent).toHaveBeenCalledTimes(1);
        expect(getExchangeConfirmBetClickEvent).toHaveBeenCalledWith({
          state: "mock",
        });
        expect(sendEventSpy).toHaveBeenCalledTimes(1);
        expect(sendEventSpy).toHaveBeenCalledWith({
          mock: "getExchangeConfirmBetClickEvent",
        });
      });
    });
    describe("and event is null", () => {
      it("should not send an event", async () => {
        getExchangeConfirmBetClickEvent.mockReturnValue(null);
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, UI__BETSLIP_EXC_PLACE_BET_CLICK, nextSpy, {
          confirmFirst: false,
        });

        expect(sendEvent).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when action type is NETWORK__PLACE_EXC_BET_SUCCESS", () => {
    beforeEach(async () => {
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState.mockReturnValue("appState");
      await setup(sendEvent, getState, NETWORK__PLACE_EXC_BET_SUCCESS, nextSpy, { betId: "some betId" });
    });
    it("should send 2 events", () => {
      expect(sendEvent).toHaveBeenCalledTimes(2);
    });
    it("should send a ExchangeSuccessPlaceBet event", () => {
      expect(getExchangeSuccessPlaceBetEvent).toHaveBeenCalledWith("appState", { betId: "some betId" });
      expect(getExchangeSuccessPlaceBetEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getExchangeSuccessPlaceBetEvent");
    });
    it("should send a ExchangeSuccessPlaceBetSelection event", () => {
      expect(getExchangeSuccessPlaceBetSelectionEvent).toHaveBeenCalledWith("appState", { betId: "some betId" });
      expect(getExchangeSuccessPlaceBetSelectionEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getExchangeSuccessPlaceBetEvent");
    });
  });

  describe("when action type is NETWORK__PLACE_EXC_BET_FAILURE", () => {
    it("should call getExchangeFailedPlaceBetEvent", async () => {
      getExchangeFailedPlaceBetEvent.mockReturnValue(null);
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, NETWORK__PLACE_EXC_BET_FAILURE, nextSpy, {
        error: "dummyError",
        side: ExchangeSide.BACK,
      });

      expect(getExchangeFailedPlaceBetEvent).toHaveBeenCalledWith(
        {
          state: "mock",
        },
        "dummyError",
        ExchangeSide.BACK,
      );
      expect(getExchangeFailedPlaceBetEvent).toHaveBeenCalledTimes(1);
    });

    describe("and event is null", () => {
      it("should NOT send an event", async () => {
        getExchangeFailedPlaceBetEvent.mockReturnValue(null);
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, NETWORK__PLACE_EXC_BET_FAILURE, nextSpy, { error: "dummyError" });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("and event is NOT null", () => {
      it("should send an event", async () => {
        getExchangeFailedPlaceBetEvent.mockReturnValue("theBestFailedPlaceBetEvent");
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, NETWORK__PLACE_EXC_BET_FAILURE, nextSpy, { error: "dummyError" });

        expect(sendEvent).toHaveBeenCalledWith("theBestFailedPlaceBetEvent");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is UI__BETSLIP_SBK_PLACE_BETS_CLICK", () => {
    it("should send both PlaceSportsbookEvent and ConfirmBet events", async () => {
      getPlaceSportsbookBetClickEvent.mockReturnValue("getPlaceSportsbookBetClickEvent");
      getAutoConfirmSportsbookBetClickEvent.mockReturnValue("getAutoConfirmSportsbookBetClickEvent");

      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__BETSLIP_SBK_PLACE_BETS_CLICK, nextSpy);

      expect(getPlaceSportsbookBetClickEvent).toHaveBeenCalledTimes(1);
      expect(getAutoConfirmSportsbookBetClickEvent).toHaveBeenCalledTimes(1);

      expect(sendEvent).toHaveBeenCalledTimes(2);
      expect(sendEvent).toHaveBeenCalledWith("getPlaceSportsbookBetClickEvent");
      expect(sendEvent).toHaveBeenCalledWith("getAutoConfirmSportsbookBetClickEvent");
    });
  });

  describe("when action type is NETWORK__PLACE_SBK_BET_SUCCESS", () => {
    beforeEach(async () => {
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState.mockReturnValue("appState");
      await setup(sendEvent, getState, NETWORK__PLACE_SBK_BET_SUCCESS, nextSpy, { some: "payload" });
    });
    it("should send a SportsbookSuccessPlaceBetEvent for each returned event", () => {
      expect(getSportsbookSuccessPlaceBetsEvent).toHaveBeenCalledWith("appState", { some: "payload" });
      expect(getSportsbookSuccessPlaceBetsEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent.mock.calls[0][0]).toBe("getSportsbookSuccessPlaceBetsEvent1");
      expect(sendEvent.mock.calls[1][0]).toBe("getSportsbookSuccessPlaceBetsEvent2");
    });
    it("should send a getSportsbookSuccessPlaceSelectionsEvent for each returned event", () => {
      expect(getSportsbookSuccessPlaceSelectionsEvent).toHaveBeenCalledWith("appState", { some: "payload" });
      expect(getSportsbookSuccessPlaceSelectionsEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent.mock.calls[2][0]).toBe("getSportsbookSuccessPlaceSelectionsEvent1");
      expect(sendEvent.mock.calls[3][0]).toBe("getSportsbookSuccessPlaceSelectionsEvent2");
    });
  });

  describe("when action type is BETTING__SBK_PLACE_FAILED_UPDATE", () => {
    it("should call getSportsbookFailedPlaceBetEvent", async () => {
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, BETTING__SBK_PLACE_FAILED_UPDATE, nextSpy, {
        state: { failures: { place: "dummy" } },
      });

      expect(getSportsbookFailedPlaceBetEvent).toHaveBeenCalledWith("dummy");
      expect(getSportsbookFailedPlaceBetEvent).toHaveBeenCalledTimes(1);
    });

    describe("and event is null", () => {
      it("should NOT send an event", async () => {
        getSportsbookFailedPlaceBetEvent.mockReturnValue(null);
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, BETTING__SBK_PLACE_FAILED_UPDATE, nextSpy, {
          state: { failures: { place: "dummy" } },
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("and event is NOT null", () => {
      it("should send an event", async () => {
        getSportsbookFailedPlaceBetEvent.mockReturnValue("theBestFailedPlaceBetEvent");
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, BETTING__SBK_PLACE_FAILED_UPDATE, nextSpy, {
          state: { failures: { place: "dummy" } },
        });

        expect(sendEvent).toHaveBeenCalledWith("theBestFailedPlaceBetEvent");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK", () => {
    it("should send an Exchange bet receipt dismiss event", async () => {
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK, nextSpy);

      expect(getBetReceiptExchangeDoneClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetReceiptExchangeDoneClickEvent");
    });
  });

  describe("when action type is UI__MARKET_SWITCH_CLICK", () => {
    beforeEach(() => {
      getState.mockReturnValue({
        entities: {
          exchangemarkets: {
            marketId: "exchangeMarkets",
            hierarchy: {
              competition: "competition",
              sportevent: "event",
            },
          },
          sportsbookmarkets: {
            marketId: "marketId",
            name: "market name",
            hierarchy: {
              competition: "competition",
              sportevent: "event",
            },
          },
          sportevents: "sportevents",
          sports: "sports",
          competitions: "competitions",
        },
        layouts: {
          views: {
            event: {
              fakeEventViewURN: {
                urn: "fakeEventViewURN",
              },
            },
          },
        },
      });
    });

    describe("when market hierarchy is racing", () => {
      it("should send event with competition and event as null", async () => {
        getState.mockReturnValue({
          entities: {
            exchangemarkets: {
              hierarchy: {
                race: "race",
                meeting: "meeting",
              },
            },
            sportsbookmarkets: undefined,
            sportevents: "sportevents",
            sports: "sports",
            competitions: "competitions",
          },
          layouts: {
            views: {
              event: {
                fakeEventViewURN: {
                  urn: "fakeEventViewURN",
                },
              },
            },
          },
        });

        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: Product.Exchange,
          selectedTabUrn: "marketUrn",
          cardUrn: "cardUrn",
        });

        expect(getMarketSwitchEvent).toHaveBeenCalledWith(
          "Exchange",
          { hierarchy: { meeting: "meeting", race: "race" } },
          null,
          null,
          { name: "sport name", sportId: 1 },
          2,
        );
        expect(sendEvent).toHaveBeenCalledWith("marketSwitchEvent");
      });
    });

    describe("when selectedTabUrn is undefined", () => {
      beforeEach(async () => {
        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: Product.Exchange,
          selectedTabUrn: undefined,
          cardUrn: "cardUrn",
        });
      });

      it("should not get sport event", () => {
        expect(getSportEventByURN).not.toHaveBeenCalled();
      });

      it("should not get sport", () => {
        expect(getSportByURN).not.toHaveBeenCalled();
      });

      it("should not get competition", () => {
        expect(getCompetitionByURN).not.toHaveBeenCalled();
      });

      it("should not send event", async () => {
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when market selected is Exchange", () => {
      it("should get Exchange market and send event", async () => {
        getState.mockReturnValue({
          entities: {
            exchangemarkets: {
              marketId: "exchangeMarkets",
              hierarchy: {
                competition: "competition",
                sportevent: "event",
              },
            },
            sportsbookmarkets: undefined,
            sportevents: "sportevents",
            sports: "sports",
            competitions: "competitions",
          },
          layouts: {
            views: {
              event: {
                fakeEventViewURN: {
                  urn: "fakeEventViewURN",
                },
              },
            },
          },
        });

        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: Product.Exchange,
          selectedTabUrn: "marketUrn",
          cardUrn: "cardUrn",
        });

        expect(getMarketSwitchEvent).toHaveBeenCalledWith(
          "Exchange",
          {
            marketId: "exchangeMarkets",
            hierarchy: {
              competition: "competition",
              sportevent: "event",
            },
          },
          { eventId: 11111, name: "event name", competition: "competitionUrn" },
          { competitionId: "competitionId", name: "competition name", sport: "sportUrn" },
          { name: "sport name", sportId: 1 },
          2,
        );
        expect(sendEvent).toHaveBeenCalledWith("marketSwitchEvent");
      });
    });

    describe("when market selected is Sportsbook", () => {
      it("should get sportsbook market and send event", async () => {
        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: Product.Sportsbook,
          selectedTabUrn: "pageUrn",
          cardUrn: "cardUrn",
        });

        expect(getMarketSwitchEvent).toHaveBeenCalledWith(
          "Sportsbook",
          {
            marketId: "marketId",
            name: "market name",
            hierarchy: { competition: "competition", sportevent: "event" },
          },
          { eventId: 11111, name: "event name", competition: "competitionUrn" },
          { competitionId: "competitionId", name: "competition name", sport: "sportUrn" },
          { name: "sport name", sportId: 1 },
          2,
        );
        expect(sendEvent).toHaveBeenCalledWith("marketSwitchEvent");
      });
    });

    describe("when there is no market", () => {
      beforeAll(async () => {
        getState.mockReturnValue({
          entities: {
            exchangemarkets: "exchangeMarkets",
            sportsbookmarkets: undefined,
            sportevents: "sportevents",
            sports: "sports",
            competitions: "competitions",
          },
          layouts: {
            views: {
              event: {
                fakeEventViewURN: {
                  urn: "fakeEventViewURN",
                },
              },
            },
          },
        });

        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: undefined,
          selectedTabUrn: "pageUrn",
          cardUrn: "cardUrn",
        });
      });

      it("should not get sport event", () => {
        expect(getSportEventByURN).not.toHaveBeenCalled();
      });

      it("should not get sport", () => {
        expect(getSportByURN).not.toHaveBeenCalled();
      });

      it("should not get competition", () => {
        expect(getCompetitionByURN).not.toHaveBeenCalled();
      });

      it("should not send event", async () => {
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when there is no event", () => {
      it("should get sport event and do not send event", async () => {
        getSportEventByURN.mockReturnValueOnce(undefined);
        getState.mockReturnValue({
          entities: {
            exchangemarkets: {
              hierarchy: {
                sportevent: "eventUrn",
                competition: "competition",
              },
            },
            sportevents: "sportevents",
          },
        });
        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: Product.Exchange,
          selectedTabUrn: "pageUrn",
          cardUrn: "cardUrn",
        });

        expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "eventUrn");
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when there is no competition", () => {
      afterAll(() => {
        getCompetitionByURN.mockReturnValue({
          competitionId: "competitionId",
          name: "competition name",
          sport: "sportUrn",
        });
      });

      it("should get competition and not send event", async () => {
        getCompetitionByURN.mockReturnValue(undefined);
        getState.mockReturnValue({
          entities: {
            exchangemarkets: {
              hierarchy: {
                sportevent: "eventUrn",
                competition: "competitionUrn",
              },
            },
            sportevents: "sportevents",
            sports: "sports",
            competitions: "competitions",
          },
        });
        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: Product.Exchange,
          selectedTabUrn: "pageUrn",
          cardUrn: "cardUrn",
        });

        expect(getCompetitionByURN).toHaveBeenCalledWith("competitions", "competitionUrn");
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when there is no sport", () => {
      afterAll(() => {
        getSportByURN.mockReturnValue({ name: "sport name", sportId: 1 });
      });

      it("should get sport and do not send event", async () => {
        getState.mockReturnValue({
          entities: {
            exchangemarkets: {
              sport: "sportUrn",
              hierarchy: {
                event: "eventUrn",
                competition: "competitionUrn",
              },
            },
            sportevents: "sportevents",
            sports: "sports",
            competitions: "competitions",
          },
        });
        getSportByURN.mockReturnValue(undefined);
        await setup(sendEvent, getState, UI__MARKET_SWITCH_CLICK, undefined, {
          product: Product.Exchange,
          selectedTabUrn: "pageUrn",
          cardUrn: "cardUrn",
        });

        expect(getSportByURN).toHaveBeenCalledWith("sports", "sportUrn");
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__SEARCH_TAB_CLICK", () => {
    beforeAll(async () => {
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__SEARCH_TAB_CLICK, undefined, "title");
    });

    it("should send a search tab click event", () => {
      expect(getSearchTabClickEvent).toHaveBeenCalledWith("title");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSearchTabClickEvent");
    });
  });

  describe("when action type is UI__SEARCH_LINK_CLICK", () => {
    it("should send a search link click event", async () => {
      await setup(sendEvent, getState, UI__SEARCH_LINK_CLICK, undefined, { text: "title", url: "url", order: 2 });
      expect(getSearchLinkClickEvent).toHaveBeenCalledWith("search text - title", "url", 2);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSearchLinkClickEvent");
    });
  });

  describe("when action type is UI__SEARCH_BAR_LINK_CLICK", () => {
    it("should send a search bar link click event", async () => {
      await setup(sendEvent, getState, UI__SEARCH_BAR_LINK_CLICK, undefined, { text: "title", url: "url", order: 4 });
      expect(getSearchLinkClickEvent).toHaveBeenCalledWith("title", "url", 4, "VIEW_TYPE - search");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSearchLinkClickEvent");
    });
  });

  describe("when action type is UI__SEARCH_AZ_LINK_CLICK", () => {
    it("should send a search link click event", async () => {
      await setup(sendEvent, getState, UI__SEARCH_AZ_LINK_CLICK, undefined, { text: "title", url: "url" });
      expect(getSearchAzLinkClickEvent).toHaveBeenCalledWith("title", "url");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSearchAzLinkClickEvent");
    });
  });

  describe("when action type is UI__SEARCH_BAR_FOCUS", () => {
    it("should send a search bar focus event", async () => {
      await setup(sendEvent, getState, UI__SEARCH_BAR_FOCUS, undefined, { text: "title", url: "url" });
      expect(getSearchBarFocusEvent).toHaveBeenCalledWith();
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSearchBarFocusEvent");
    });

    describe("when action type is UI__SEARCH_BAR_FOCUS comes from the desktop version", () => {
      it("should send a search bar focus event", async () => {
        await setup(sendEvent, getState, UI__SEARCH_BAR_FOCUS, undefined, { text: "title", url: "url" });
        expect(getSearchBarFocusEvent).toHaveBeenCalledWith("VIEW_TYPE - search");
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getSearchBarFocusEvent");
      });
    });
  });

  describe("when action type is UI__SEARCH_CANCEL_CLICK", () => {
    it("should send a search cancel event", async () => {
      await setup(sendEvent, getState, UI__SEARCH_CANCEL_CLICK, undefined, { text: "searchTerm" });
      expect(getSearchCancelClickEvent).toHaveBeenCalledWith("searchTerm");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSearchCancelClickEvent");
    });
  });

  describe("when action type is UI__CLEAR_SEARCH_RESULTS", () => {
    it("should send a search cancel event", async () => {
      await setup(sendEvent, getState, UI__CLEAR_SEARCH_RESULTS, undefined, { text: "searchTerm" });
      expect(getSearchClearClickEvent).toHaveBeenCalledWith("search text - searchTerm");
      expect(sendEvent).toHaveBeenCalledWith("getSearchClearClickEvent");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__NAVIGATE_TO_EVENT_FROM_SPORT", () => {
    const state = {
      layouts: {
        cards: {
          eventmarkets: {},
          eventviewlinks: {},
        },
        views: {},
      },
      entities: {
        sportevents: [],
      },
    };

    it("should send the correct GTM event", async () => {
      await setup(sendEvent, () => state, UI__NAVIGATE_TO_EVENT_FROM_SPORT, undefined, {
        type: "primary swimlane",
        href: "destination:url",
        footballFixture: { duration: { status: "PRE_MATCH" } },
        sportevent: {
          urn: "sportevent:urn",
          eventId: 11111,
          name: "event name",
          competition: "competitionId",
        },
      });

      expect(getNavigateToEventFromSport).toHaveBeenCalledWith(
        "event name",
        11111,
        "event name",
        1,
        "sport name",
        "destination:url",
        "competitionId",
        "competition name",
        false,
        "primary swimlane",
        {
          pebbleCardGroupTitle: "pebbleCardGroup",
          cardGroupTitle: "pebbleCardGroup",
          tabName: "tab",
          horizontalPosition: 1,
          verticalPosition: 2,
          viewZoneTitle: "viewZoneTitle",
        },
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getNavigateToEventFromSport");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_MARKET_VIEW", () => {
    beforeAll(async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        "UI__NAVIGATE_TO_MARKET_VIEW",
        undefined,
        {
          marketName: "market name",
          cardType: "MarketCard",
          href: "href.com",
          cardUrn: "card:urn",
        },
      );
    });

    it("should call sendEvent with the correct object", async () => {
      expect(getNavigateToMarketViewEvent).toHaveBeenCalledTimes(1);
      expect(getNavigateToMarketViewEvent).toHaveBeenCalledWith("market name", "VIEW_TYPE", "MarketCard", "href.com", {
        pebbleCardGroupTitle: "pebbleCardGroup",
        cardGroupTitle: "pebbleCardGroup",
        tabName: "tab",
        horizontalPosition: 1,
        verticalPosition: 2,
        viewZoneTitle: "viewZoneTitle",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getNavigateToMarketViewEvent");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_EVENT_FROM_MARKET", () => {
    beforeEach(jest.clearAllMocks);

    it("should call getLinkClickEvent", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_EVENT_FROM_MARKET", undefined, {
        url: "some url",
        text: "some text",
      });

      expect(getLinkClickEvent).toHaveBeenCalledWith("back to some text", "market - event quicklink", "some url");
    });

    it("should call sendEvent with the getLinkClickEvent return", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_EVENT_FROM_MARKET", undefined, {
        url: "some url",
        text: "some text",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD", () => {
    beforeEach(jest.clearAllMocks);

    it("should call getLinkClickEvent", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD", undefined, {
        url: "some url",
        text: "some text",
      });

      expect(getLinkClickEvent).toHaveBeenCalledWith("back to some text", "market - scoreboard", "some url");
    });

    it("should call sendEvent with the getLinkClickEvent return", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD", undefined, {
        url: "some url",
        text: "some text",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK", () => {
    it("should call getLinkClickEvent", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK", undefined, {
        url: "some url",
        label: "some label",
        pageType: "RaceSwitcherCard",
      });

      expect(getLinkClickEvent).toHaveBeenCalledWith("some label", "race - power nav", "some url");
    });

    it("should call sendEvent with getLinkClickEvent", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK", undefined, {
        url: "some url",
        label: "some label",
        pageType: "page",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__NAVIGATE_TO_RACE_FROM_MARKET", () => {
    beforeEach(jest.clearAllMocks);

    it("should call getLinkClickEvent", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_RACE_FROM_MARKET", undefined, {
        url: "some url",
        text: "some text",
      });

      expect(getLinkClickEvent).toHaveBeenCalledWith("back to some text", "market - race quicklink", "some url");
    });

    it("should call sendEvent with the getLinkClickEvent return", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_RACE_FROM_MARKET", undefined, {
        url: "some url",
        text: "some text",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__LOGO_CLICK", () => {
    beforeEach(jest.clearAllMocks);

    it("should call getLinkClickEvent with proper params", async () => {
      await setup(sendEvent, getState, "UI__LOGO_CLICK", undefined, {
        path: "some url",
      });

      expect(getLinkClickEvent).toHaveBeenCalledWith("bf logo", "header", "some url");
      expect(getLinkClickEvent).toHaveBeenCalledTimes(1);
    });

    it("should call sendEvent with the getLinkClickEvent return", async () => {
      await setup(sendEvent, getState, "UI__LOGO_CLICK", undefined, {
        url: "some url",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION", () => {
    it("should send a search link click event", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION, undefined, {
        increment: "increment",
        currencySymbol: "currencySymbol",
      });
      expect(getSbkIncrementStakeEvent).toHaveBeenCalledWith("increment", "currencySymbol");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSbkIncrementStakeEvent");
    });
  });

  describe("when action type is UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION", () => {
    it("should send a search link click event", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION, undefined, {
        increment: "increment",
        currencySymbol: "currencySymbol",
      });
      expect(getExcIncrementSizeEvent).toHaveBeenCalledWith("increment", "currencySymbol");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getExcIncrementSizeEvent");
    });
  });

  describe("when action type is UI__MARKET_RULES_MODAL_TOGGLE", () => {
    it("should call getMarketRulesToggleModalEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__MARKET_RULES_MODAL_TOGGLE, undefined, { open: true });
      expect(getMarketRulesToggleModalEvent).toHaveBeenCalledWith(true, "VIEW_TYPE");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMarketRulesToggleModalEvent");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED", () => {
    it("should call getMarketRulesLinkClickEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED, undefined, {
        text: "text",
        url: "url",
      });
      expect(getMarketRulesLinkClickEvent).toHaveBeenCalledWith("text", "url");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMarketRulesLinkClickEvent");
    });
  });

  describe("when action type is UI__CLICK_ALLMARKETS_LINK", () => {
    it("should call getAllMarketsLinkClickEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__CLICK_ALLMARKETS_LINK, undefined, { destinationUrl: "url" });
      expect(getAllMarketsLinkClickEvent).toHaveBeenCalledWith("url");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getAllMarketsLinkClickEvent");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_COMPETITION_VIEW", () => {
    it("should call getCompetitionLinkClickEvent and sendEvent with correct parameters", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__NAVIGATE_TO_COMPETITION_VIEW,
        undefined,
        {
          href: "url",
          cardUrn: "cardUrn",
          text: "competition",
          cardType: "CompetitionViewLinkCard",
        },
      );

      expect(getCompetitionLinkClickEvent).toHaveBeenCalledWith(
        "competition",
        "VIEW_TYPE",
        "CompetitionViewLinkCard",
        "url",
        2,
        1,
        "groupTitle",
        "tabTitle",
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCompetitionLinkClickEvent");
    });
  });

  describe("when action type is UI__TAP_ALL_COMPETITIONS_LINK", () => {
    beforeEach(() => {
      getState.mockReturnValue({
        router: {
          currentUrn: "view:urn",
        },
        entities: {
          games: {},
        },
        layouts: {
          views: {
            event: {
              fakeEventViewURN: {
                urn: "fakeEventViewURN",
              },
            },
          },
        },
      });
      getViewbyURN.mockReturnValue({
        typename: "SportView",
      });
    });

    it("should call getAllCompetitionsLinkClickEvent and sendEvent with correct parameters", async () => {
      await setup(sendEvent, getState, UI__TAP_ALL_COMPETITIONS_LINK, undefined, {
        href: "url",
        text: "competition",
        cardUrn: "cardUrn",
      });
      expect(getAllCompetitionsLinkClickEvent).toHaveBeenCalledWith("competition", "VIEW_TYPE", "quicklink", "url", 2);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getAllCompetitionsLinkClickEvent");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD", () => {
    it("should call getNavigateToGameCategoryEvent and sendEvent with the correct object", async () => {
      const actionPayload = {
        module: "module name",
        categoryName: "category name",
        href: "href.com",
        cardUrn: "card:urn",
      };

      await setup(
        sendEvent,
        getState,
        "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD",
        undefined,
        actionPayload,
      );

      expect(getNavigateToGameCategoryEvent).toHaveBeenCalledTimes(1);
      expect(getNavigateToGameCategoryEvent).toHaveBeenCalledWith("module name", "category name", "href.com", 2, 1);

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith(["module name", "category name", "href.com", 2, 1]);
    });
  });

  describe("when action type is UI__NAVIGATE_TO_GAME_INFO_VIEW", () => {
    beforeEach(() => {
      getState.mockReturnValue({
        router: {
          currentUrn: "view:urn",
        },
        entities: {
          games: {},
        },
      });
    });

    it("should send a game info button click event", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_GAME_INFO_VIEW", undefined, {
        href: "href",
        gameUrn: "ppb:game:1",
        cardUrn: "cardUrn",
        cardGroupUrn: "swimlane",
      });

      expect(getNavigateToGameInfoEvent).toHaveBeenCalledWith(
        "viewZoneTitle",
        "Ted",
        "href",
        "Gaming Platform - Blueprint",
        "launchId",
        1,
        2,
        1,
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith([
        "viewZoneTitle",
        "Ted",
        "href",
        "Gaming Platform - Blueprint",
        "launchId",
        1,
        2,
        1,
      ]);
    });
  });

  describe("when action type is UI__LAUNCH_GAME_FROM_GAME_INFO", () => {
    beforeEach(() => {
      getState.mockReturnValue({
        entities: {
          games: {
            "ppb:game:1": {
              urn: "ppb:game:1",
              name: "Ted",
              provider: {
                name: "Gaming Platform - Blueprint",
                uid: "gp-bp",
              },
              launchId: "launchId",
            },
          },
        },
      });
    });
    it("should call getGameLaunchFromGameInfoEvent and sendEvent", async () => {
      await setup(sendEvent, getState, "UI__LAUNCH_GAME_FROM_GAME_INFO", undefined, {
        gameUrn: "ppb:game:1",
        href: "href",
        platformType: "web",
      });
      expect(getGameLaunchFromGameInfoEvent).toHaveBeenCalledWith(
        "Ted",
        "href",
        "Gaming Platform - Blueprint",
        "launchId",
        "web",
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith(["Ted", "href", "Gaming Platform - Blueprint", "launchId", "web"]);
    });
  });

  describe("when action type is UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL", () => {
    it("should call getCategoryFromMultifunctionalClickEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL, undefined, {
        href: "href",
        categoryName: "categoryName",
        zoneTitle: "zoneTitle",
      });
      expect(getCategoryFromMultifunctionalClickEvent).toHaveBeenCalledWith("href", "zoneTitle", "categoryName");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith(["href", "zoneTitle", "categoryName"]);
    });
  });

  describe("when action type is UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON", () => {
    it("should send a see all button click event", async () => {
      await setup(sendEvent, getState, "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON", undefined, {
        label: "label",
        zoneTitle: "zoneTitle",
        href: "href",
        cardUrn: "cardUrn",
      });
      expect(getSeeAllLinkClickEvent).toHaveBeenCalledWith("label", "zoneTitle", "href", 2);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith(["label", "zoneTitle", "href", 2]);
    });
  });

  describe("when action type is UI__LAUNCH_GAME", () => {
    beforeEach(() => {
      getState.mockReturnValue({
        entities: {
          games: {
            "ppb:tbd:game:1": {
              urn: "ppb:tbd:card:game:1",
              name: "Ted",
              provider: {
                name: "Gaming Platform - Blueprint",
                uid: "gp-bp",
              },
              launchId: "launchId",
            },
          },
        },
        layouts: {
          cardgroups: {
            gamingcardgroups: {
              swimlane: {
                urn: "swimlane",
                game: "ppb:tbd:game:1",
                typename: "SwimlaneCardGroup",
                title: "Gaming Swimlane",
                items: [{ urn: "ppb:tbd:card:game:1", typename: "GameCard" }],
              },
            },
          },
        },
      });
      getViewZoneByItemUrn.mockReturnValue({
        viewZone: {},
      });
    });

    it("should send a game tile click event", async () => {
      await setup(sendEvent, getState, "UI__LAUNCH_GAME", undefined, {
        href: "href",
        gameUrn: "ppb:tbd:game:1",
        cardUrn: "ppb:tbd:card:game:1",
        cardGroupUrn: "swimlane",
        platformType: "web",
      });

      expect(getGameTileClickEvent).toHaveBeenCalledWith(
        "search results",
        "search text - gameSearchInput",
        "Ted",
        "href",
        "Gaming Platform - Blueprint",
        "launchId",
        1,
        2,
        1,
        1,
        "web",
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getGameTileClickEvent");
    });
  });

  describe("when action type is UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR", () => {
    it("should call getMarketGraphSelectViewEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR, undefined, { label: "label" });
      expect(getMarketGraphSelectViewEvent).toHaveBeenCalledWith("label");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMarketGraphSelectViewEvent");
    });
  });

  describe("when action type is UI__CLICK_MARKET_GRAPH_MODE_SELECTOR", () => {
    it("should call getMarketGraphSelectGraphEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__CLICK_MARKET_GRAPH_MODE_SELECTOR, undefined, { label: "label" });
      expect(getMarketGraphSelectGraphEvent).toHaveBeenCalledWith("label");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMarketGraphSelectGraphEvent");
    });
  });

  describe("when action type is UPDATE_MARKET_DEPTH", () => {
    beforeEach(() => {
      getState = jest.fn().mockReturnValue("appState");
    });
    describe("and market depth is active", () => {
      it("should call getMarketGraphSelectGraphEvent and sendEvent", async () => {
        await setup(sendEvent, getState, UPDATE_MARKET_DEPTH, undefined, { isActive: true, urn: "marketUrn" });
        expect(getMarketDepthClickEvent).toHaveBeenCalledWith("appState", "marketUrn", true);
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getMarketDepthClickEvent");
      });
    });

    describe("and market depth is inactive", () => {
      it("should call getMarketGraphSelectGraphEvent and sendEvent", async () => {
        await setup(sendEvent, getState, UPDATE_MARKET_DEPTH, undefined, { isActive: false, urn: "marketUrn" });
        expect(getMarketDepthClickEvent).toHaveBeenCalledWith("appState", "marketUrn", false);
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getMarketDepthClickEvent");
      });
    });
  });

  describe("when action type is UI__BOTTOM_BAR_CLICK", () => {
    const setupDependencies = () => {
      getState = jest.fn().mockReturnValue({
        layouts: {
          views: "views",
        },
        router: { currentUrn: "view:urn", currentUrl: "viewUrl" },
        entities: {
          sports: {
            "ppb:eventType:1": {
              urn: "ppb:eventType:1",
              sportId: 1,
              name: "Soccer",
            },
          },
        },
      });
      getViewbyURN.mockReturnValue({ typename: "EventView" });
    };

    beforeEach(jest.clearAllMocks);

    it("should call getBottomBarClickEvent and sendEvent", async () => {
      setupDependencies();

      await setup(sendEvent, getState, UI__BOTTOM_BAR_CLICK, undefined, { path: "path", tile: "tile" });

      expect(getBottomBarClickEvent).toHaveBeenCalledWith("EventView", "tile", "path");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBottomBarClickEvent");
    });

    describe("with missing data", () => {
      beforeEach(jest.clearAllMocks);

      describe("without current view", () => {
        it("should return null", async () => {
          setupDependencies();

          getState = jest.fn().mockReturnValue({
            router: {},
            layouts: {
              views: "views",
            },
          });

          await setup(sendEvent, getState, UI__BOTTOM_BAR_CLICK, undefined, { path: "path", tile: "tile" });
          expect(getBottomBarClickEvent).not.toHaveBeenCalled();
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });

      describe("without view", () => {
        it("should return null", async () => {
          setupDependencies();
          getViewbyURN.mockReturnValue(null);

          await setup(sendEvent, getState, UI__BOTTOM_BAR_CLICK, undefined, { path: "path", tile: "tile" });

          expect(getBottomBarClickEvent).not.toHaveBeenCalled();
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when action type is UI__USER_PROFILE_QUICK_LINK_CLICK", () => {
    it("should call getMyAccountQuickLinkEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__USER_PROFILE_QUICK_LINK_CLICK, undefined, {
        title: "title",
        href: "href",
        jurisdiction: "jurisdiction",
      });
      expect(getMyAccountQuickLinkEvent).toHaveBeenCalledWith("title", "href", "jurisdiction");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyAccountQuickLinkEvent");
    });
  });

  describe("when action type is UI__USER_PROFILE_MENU_LINK_CLICK", () => {
    it("should call getMyAccountMenuLinkEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__USER_PROFILE_MENU_LINK_CLICK, undefined, {
        menuText: "menu",
        href: "href",
        jurisdiction: "jurisdiction",
      });
      expect(getMyAccountMenuLinkEvent).toHaveBeenCalledWith("menu", "href", "jurisdiction");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyAccountMenuLinkEvent");
    });
  });

  describe("when action type is UI__USER_PROFILE_EYE_ICON_CLICK", () => {
    it("should call getMyAccountEyeIconEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__USER_PROFILE_EYE_ICON_CLICK, undefined, {
        showBalances: true,
        jurisdiction: "jurisdiction",
      });
      expect(getMyAccountEyeIconEvent).toHaveBeenCalledWith(true, "jurisdiction");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyAccountEyeIconEvent");
    });
  });

  describe("when action type is UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK", () => {
    it("should call getMyAccountToggleCashBalancesViewEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK, undefined, {
        showLessToggle: true,
        jurisdiction: "jurisdiction",
      });
      expect(getMyAccountToggleCashBalancesViewEvent).toHaveBeenCalledWith("jurisdiction", true);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyAccountToggleCashBalancesViewEvent");
    });
  });

  describe("when action type is UI__USER_PROFILE_BUDGET_LINK_CLICK", () => {
    it("should call getLinkClickEvent with correct parameters and sendEvent", async () => {
      getLinkClickEvent.mockReturnValue({
        mock: "getLinkClickEvent",
      });
      await setup(sendEvent, getState, UI__USER_PROFILE_BUDGET_LINK_CLICK, undefined, {
        jurisdiction: "international",
        url: "https://my-budget.betfair.com/?prod=90&showHeader=0",
      });
      const appModule = `my_account_international_mobile`;
      const label = "my budget";

      expect(getLinkClickEvent).toHaveBeenCalledWith(
        label,
        appModule,
        "https://my-budget.betfair.com/?prod=90&showHeader=0",
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__CLICK_PEBBLE_ITEM", () => {
    it("should call getMarketTemplatePebbleSelectionEvent and sendEvent", async () => {
      getState.mockReturnValue({
        layouts: {
          cardgroups: {
            pebblecardgroups: {
              cardGroupURN: { items: [{ urn: "pebbleURN", name: "pebbleTitle" }] },
            },
          },
        },
      });

      await setup(sendEvent, getState, UI__CLICK_PEBBLE_ITEM, undefined, {
        cardGroupURN: "cardGroupURN",
        pebbleURN: "pebbleURN",
      });
      expect(getMarketTemplatePebbleSelectionEvent).toHaveBeenCalledWith("pebbleTitle");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMarketTemplatePebbleSelectionEvent");
    });
  });

  describe("when action type is UI__TOGGLE_RUNNER_INFO", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn(() => ({
        layouts: {
          views: {
            "current:view": "view",
          },
        },
        router: {
          currentUrn: "current:view",
        },
      }));
    });

    it("should send the correct gtm event", async () => {
      await setup(sendEvent, getState, UI__TOGGLE_RUNNER_INFO, undefined, {
        runnerName: "runnerName",
        marketName: "marketName",
        isOpening: false,
      });
      expect(getToggleRunnerInfoEvent).toHaveBeenCalledWith(false, "runnerName", "VIEW_TYPE", "marketName");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getToggleRunnerInfoEvent");
    });
  });

  describe("when action type is UI__TOGGLE_RUNNER_INFO_TABS", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn(() => ({
        layouts: {
          views: {
            "current:view": "view",
          },
        },
        router: {
          currentUrn: "current:view",
        },
      }));
    });

    it("should send the correct gtm event", async () => {
      await setup(sendEvent, getState, UI__TOGGLE_RUNNER_INFO_TABS, undefined, {
        isDetailsTab: false,
      });
      expect(getToggleRunnerInfoTabsEvent).toHaveBeenCalledWith(false);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getToggleRunnerInfoTabsEvent");
    });
  });

  describe("when action type is UI__TOGGLE_EXPANDABLE_CARDGROUP", () => {
    beforeEach(async () => {
      getState = jest.fn(() => ({
        layouts: {
          views: {
            "current:view": "view",
          },
        },
        router: {
          currentUrn: "current:view",
        },
      }));
      getViewbyURN.mockReturnValue({ title: "viewTitle" });
    });

    it("should call getToggleExpandableCardGroupEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__TOGGLE_EXPANDABLE_CARDGROUP, undefined, {
        isExpanded: true,
        title: "title",
        cardUrn: "URN",
      });

      expect(getToggleExpandableCardGroupEvent).toHaveBeenCalledWith(true, "title", "viewTitle", "VIEW_TYPE", 2);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getToggleExpandableCardGroupEvent");
    });

    describe("when getToggleExpandableCardGroupEvent returns null", () => {
      it("should NOT send event", async () => {
        getToggleExpandableCardGroupEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__TOGGLE_EXPANDABLE_CARDGROUP, undefined, {
          isExpanded: true,
          title: "title",
          cardUrn: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP", () => {
    it("should call getExchangePriceChangeEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP, undefined, {
        runner: "runnerURN",
        side: "lay",
      });

      expect(getExchangePriceChangeEvent).toHaveBeenCalledWith({ state: "mock" }, { runner: "runnerURN", side: "lay" });
    });

    describe("when getExchangePriceChangeEvent returns null", () => {
      it("should NOT send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when getExchangePriceChangeEvent returns truthy value", () => {
      it("should send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue("some glorious event");
        await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).toHaveBeenCalledWith("some glorious event");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN", () => {
    it("should call getExchangePriceChangeEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN, undefined, {
        runner: "runnerURN",
        side: "lay",
      });

      expect(getExchangePriceChangeEvent).toHaveBeenCalledWith({ state: "mock" }, { runner: "runnerURN", side: "lay" });
    });

    describe("when getExchangePriceChangeEvent returns null", () => {
      it("should NOT send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when getExchangePriceChangeEvent returns truthy value", () => {
      it("should send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue("some glorious event");
        await setup(sendEvent, getState, UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).toHaveBeenCalledWith("some glorious event");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_PRICE_NUDGE_UP", () => {
    it("should call getExchangePriceChangeEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_EXC_PRICE_NUDGE_UP, undefined, {
        runner: "runnerURN",
        side: "lay",
      });

      expect(getExchangePriceChangeEvent).toHaveBeenCalledWith({ state: "mock" }, { runner: "runnerURN", side: "lay" });
    });

    describe("when getExchangePriceChangeEvent returns null", () => {
      it("should NOT send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BETSLIP_EXC_PRICE_NUDGE_UP, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when getExchangePriceChangeEvent returns truthy value", () => {
      it("should send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue("some glorious event");
        await setup(sendEvent, getState, UI__BETSLIP_EXC_PRICE_NUDGE_UP, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).toHaveBeenCalledWith("some glorious event");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_PRICE_NUDGE_DOWN", () => {
    it("should call getExchangePriceChangeEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_EXC_PRICE_NUDGE_DOWN, undefined, {
        runner: "runnerURN",
        side: "lay",
      });

      expect(getExchangePriceChangeEvent).toHaveBeenCalledWith({ state: "mock" }, { runner: "runnerURN", side: "lay" });
    });

    describe("when getExchangePriceChangeEvent returns null", () => {
      it("should NOT send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BETSLIP_EXC_PRICE_NUDGE_DOWN, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when getExchangePriceChangeEvent returns truthy value", () => {
      it("should send event", async () => {
        getExchangePriceChangeEvent.mockReturnValue("some glorious event");
        await setup(sendEvent, getState, UI__BETSLIP_EXC_PRICE_NUDGE_DOWN, undefined, {
          runner: "runnerURN",
          side: "lay",
        });

        expect(sendEvent).toHaveBeenCalledWith("some glorious event");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is UI__BETSLIP_HEADER_CLICK", () => {
    describe("when Betslip is collapsed", () => {
      it("should send a GenericEvent", async () => {
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, UI__BETSLIP_HEADER_CLICK, nextSpy, {
          isCollapsed: true,
          betslipSubType: "betslipSubType",
        });

        expect(getBetslipHeaderClickEvent).toHaveBeenCalledTimes(1);
        expect(getBetslipHeaderClickEvent).toHaveBeenCalledWith("closed", "betslipSubType");

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipHeaderClickEvent");
      });
    });

    describe("when Betslip is not collapsed", () => {
      it("should send a GenericEvent", async () => {
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        await setup(sendEvent, getState, UI__BETSLIP_HEADER_CLICK, nextSpy, {
          isCollapsed: false,
          betslipSubType: "betslipSubType",
        });

        expect(getBetslipHeaderClickEvent).toHaveBeenCalledTimes(1);
        expect(getBetslipHeaderClickEvent).toHaveBeenCalledWith("opened", "betslipSubType");

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipHeaderClickEvent");
      });
    });
  });

  describe("when action type is UI__BETSLIP_ACCORDION_HEADER_CLICK", () => {
    describe("when the Betslip accordion is expanded", () => {
      it("should call getBetslipAccordionHeaderClickEvent with 'expand' action and sendEvent", async () => {
        await setup(sendEvent, getState, UI__BETSLIP_ACCORDION_HEADER_CLICK, undefined, { isExpanded: true });

        expect(getBetslipAccordionHeaderClickEvent).toHaveBeenCalledWith(TaggingAction.EXPAND);

        expect(sendEvent).toHaveBeenCalledWith("getBetslipAccordionHeaderClickEvent");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the Betslip accordion is not expanded", () => {
      it("should call getBetslipAccordionHeaderClickEvent with 'collapse' action and sendEvent", async () => {
        await setup(sendEvent, getState, UI__BETSLIP_ACCORDION_HEADER_CLICK, undefined, { isExpanded: false });

        expect(getBetslipAccordionHeaderClickEvent).toHaveBeenCalledWith(TaggingAction.COLLAPSE);

        expect(sendEvent).toHaveBeenCalledWith("getBetslipAccordionHeaderClickEvent");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when action type is UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK", () => {
    it("should call getSportsbookBettingCombinations", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK, undefined, {
        combinationId: "C:1",
      });

      expect(getSportsbookBettingCombinations).toHaveBeenCalledWith({ state: "mock" });
    });

    it("should call getBetslipSportsbookMultipleBetTypeClickEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK, undefined, {
        combinationId: "C:1",
      });

      expect(getBetslipSportsbookMultipleBetTypeClickEvent).toHaveBeenCalledWith("betType");

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipSportsbookMultipleBetTypeClickEvent");
    });
  });

  describe("when action type is UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK", () => {
    it("should call getBetslipExchangeRemoveSelectionEvent and sendEvent", async () => {
      getBetslipExchangeRemoveSelectionEvent.mockReturnValue("getBetslipExchangeRemoveSelectionEvent");

      await setup(sendEvent, getState, UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK, undefined);

      expect(getBetslipExchangeRemoveSelectionEvent).toHaveBeenCalled();

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipExchangeRemoveSelectionEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_REMOVE_LEG_CLICK", () => {
    it("should call getBetslipSportsbookRemoveSelectionEvent and sendEvent", async () => {
      getBetslipSportsbookRemoveSelectionEvent.mockReturnValue("getBetslipSportsbookRemoveSelectionEvent");

      await setup(sendEvent, getState, UI__BETSLIP_SBK_REMOVE_LEG_CLICK, undefined, { legId: "legId" });

      expect(getBetslipSportsbookRemoveSelectionEvent).toHaveBeenCalledWith(getState(), { legId: "legId" });
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipSportsbookRemoveSelectionEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_REMOVE_SELECTIONS", () => {
    it("should call getBetslipSbkRemoveAllEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_REMOVE_SELECTIONS, undefined);

      expect(getBetslipSbkRemoveAllEvent).toHaveBeenCalled();
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipSbkRemoveAllEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK", () => {
    it("should call getBetslipSbkReAddSelectionsEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK, undefined);

      expect(getBetslipSbkReAddSelectionsEvent).toHaveBeenCalled();
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipSbkReAddSelectionsEvent");
    });
  });

  describe("when action type is UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK", () => {
    it("should call getMyBetsSbkAddPreviousSelectionsEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK, undefined);

      expect(getMyBetsSbkAddPreviousSelectionsEvent).toHaveBeenCalled();
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsSbkAddPreviousSelectionsEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_NOTIFICATION_SHOWN", () => {
    it("should call getBetslipSbkNotificationShownEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_NOTIFICATION_SHOWN, undefined, {
        label: "notification label",
      });

      expect(getBetslipSbkNotificationShownEvent).toHaveBeenCalledWith("notification label");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipSbkNotificationShownEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK", () => {
    it("should call getBetslipSbkMaxPayoutNotificationUrlClickEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK, undefined, {
        url: "url",
      });

      expect(getBetslipSbkMaxPayoutNotificationUrlClickEvent).toHaveBeenCalledWith("url");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipSbkMaxPayoutNotificationUrlClickEvent");
    });
  });

  describe("when action type is UI__CLICK_PROMOTION_CALL_TO_ACTION", () => {
    beforeEach(() => {
      getState.mockReturnValue({
        router: "router",
        entities: {
          exchangemarkets: "exchangeMarkets",
          sportsbookmarkets: "sportsbookMarkets",
          sportevents: "sportevents",
          sports: "sports",
          competitions: "competitions",
        },
        layouts: {
          views: {
            event: {
              fakeEventViewURN: {
                urn: "fakeEventViewURN",
              },
            },
          },
        },
      });
    });

    describe("with missing data", () => {
      beforeEach(() => {
        getPromotionClickEvent.mockReturnValue(null);
      });

      it("should return null", async () => {
        await setup(sendEvent, getState, UI__CLICK_PROMOTION_CALL_TO_ACTION, undefined, {
          viewLink: { viewUrl: "destination URL" },
          title: "Promotion Title",
          urn: "card:urn:1",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when there is all data", () => {
      beforeEach(() => {
        getPromotionClickEvent.mockReturnValue("getPromotionClickEvent");
      });

      it("should call getPromotionClickEvent and sendEvent", async () => {
        await setup(sendEvent, getState, UI__CLICK_PROMOTION_CALL_TO_ACTION, undefined, {
          viewLink: { viewUrl: "destination URL" },
          title: "Promotion Title",
          urn: "card:urn:1",
        });

        expect(getPromotionClickEvent).toHaveBeenCalledWith(
          {
            viewLink: { viewUrl: "destination URL" },
            title: "Promotion Title",
            urn: "card:urn:1",
          },
          getState(),
          TaggingAction.CLICKED_BANNER_CTA,
        );
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getPromotionClickEvent");
      });
    });
  });

  describe("when action type is UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS", () => {
    describe("with missing data", () => {
      beforeEach(() => {
        getPromotionClickEvent.mockReturnValue(null);
      });

      it("should return null", async () => {
        await setup(sendEvent, getState, UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS, undefined, {
          viewLink: { viewUrl: "destination URL" },
          title: "Promotion Title",
          urn: "card:urn:1",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when there is data", () => {
      beforeEach(() => {
        getPromotionClickEvent.mockReturnValue("getPromotionClickEvent");
      });

      it("should call getPromotionClickEvent and sendEvent", async () => {
        await setup(sendEvent, getState, UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS, undefined, {
          viewLink: { viewUrl: "destination URL" },
          title: "Promotion Title",
          urn: "card:urn:1",
        });

        expect(getPromotionClickEvent).toHaveBeenCalledWith(
          {
            viewLink: { viewUrl: "destination URL" },
            title: "Promotion Title",
            urn: "card:urn:1",
          },
          getState(),
          TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS,
        );
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getPromotionClickEvent");
      });
    });
  });

  describe("when action type is UI__BETSLIP_EXC_BONUS_CHANGE", () => {
    describe("and isFreeBetsSelected is true", () => {
      it("should call getBetslipBonusActivationEvent with correct product and sendEvent", async () => {
        await setup(sendEvent, getState, UI__BETSLIP_EXC_BONUS_CHANGE, undefined, { isFreeBetsSelected: true });

        expect(getBetslipBonusActivationEvent).toHaveBeenCalledWith("Exchange");
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipBonusActivationEvent");
      });
    });

    describe("and isFreeBetsSelected is false", () => {
      it("should not call getBetslipBonusActivationEvent neither sendEvent", async () => {
        await setup(sendEvent, getState, UI__BETSLIP_EXC_BONUS_CHANGE, undefined, { isFreeBetsSelected: false });

        expect(getBetslipBonusActivationEvent).not.toHaveBeenCalledWith("Exchange");
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is BETTING__SBK_BONUS_TOGGLE_ACTION", () => {
    describe("and isFreeBetsSelected is true", () => {
      it("should call getBetslipBonusActivationEvent with correct product and sendEvent", async () => {
        await setup(sendEvent, getState, BETTING__SBK_BONUS_TOGGLE_ACTION, undefined, { isFreeBetsSelected: true });

        expect(getBetslipBonusActivationEvent).toHaveBeenCalledWith("Sportsbook");
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipBonusActivationEvent");
      });
    });

    describe("and isFreeBetsSelected is false", () => {
      it("should not call getBetslipBonusActivationEvent neither sendEvent", async () => {
        await setup(sendEvent, getState, BETTING__SBK_BONUS_TOGGLE_ACTION, undefined, { isFreeBetsSelected: false });

        expect(getBetslipBonusActivationEvent).not.toHaveBeenCalled();
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__SETTINGS_TABS_CLICK", () => {
    it("should call getSettingsTabSelectEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__SETTINGS_TABS_CLICK, undefined, {
        menuText: "menuText",
        destinationURL: "destinationURL",
        moduleName: "moduleName",
      });
      expect(getSettingsTabSelectEvent).toHaveBeenCalledWith("menuText", "moduleName", "destinationURL");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSettingsTabSelectEvent");
    });
  });

  describe("when action type is UI__CONTENT_SUMMARY_COLLAPSE_EVENT", () => {
    it("should call getRelatedLinksCollapseEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__CONTENT_SUMMARY_COLLAPSE_EVENT, undefined, {
        collapsed: true,
        title: "Main title",
      });

      expect(getContentSummaryCollapseEvent).toHaveBeenCalledWith("Main title", true);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getContentSummaryCollapseEvent");
    });
  });

  describe("when action type is UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK", () => {
    it("should call getLinkClickEvent with correct parameters and sendEvent", async () => {
      getLinkClickEvent.mockReturnValue({
        mock: "getLinkClickEvent",
      });
      await setup(sendEvent, getState, UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK, undefined, {
        text: "Link label",
        url: "football/1",
      });
      const appModule = "seo footer links";

      expect(getLinkClickEvent).toHaveBeenCalledWith("Link label", appModule, "football/1");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });
  });

  describe("when action type is UI__RACE_VIEW_LINKS_LINK_CLICK", () => {
    it("should call getRaceViewLinksLinkClickEvent with correct parameters and sendEvent", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__RACE_VIEW_LINKS_LINK_CLICK,
        undefined,
        {
          cardUrn: "card:urn",
          href: "href.com",
          isRaceClosed: false,
        },
      );

      expect(getRaceViewLinksLinkClickEvent).toHaveBeenCalledWith("VIEW_TYPE", "href.com", 2, 1, "race time selector");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getRaceViewLinksLinkClickEvent");
    });

    it("should call getRaceViewLinksLinkClickEvent with a resulted race", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__RACE_VIEW_LINKS_LINK_CLICK,
        undefined,
        {
          cardUrn: "card:urn",
          href: "href.com",
          isRaceClosed: true,
        },
      );

      expect(getRaceViewLinksLinkClickEvent).toHaveBeenCalledWith(
        "VIEW_TYPE",
        "href.com",
        2,
        1,
        "resulted race time selector",
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getRaceViewLinksLinkClickEvent");
    });
  });

  describe("when action type is UI__NEXT_RACES_RACE_CLICK", () => {
    it("should call getNextRacesRaceClickEvent with correct parameters and sendEvent", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__NEXT_RACES_RACE_CLICK,
        undefined,
        {
          cardUrn: "card:urn",
        },
      );

      expect(getNextRacesRaceClickEvent).toHaveBeenCalledWith("VIEW_TYPE", 2, "race time selector");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getNextRacesRaceClickEvent");
    });
  });

  describe("when action type is UI__NEXT_RACES_RACE_FILTER_CLICK", () => {
    it("should call getStatisticsItemClickEvent with correct parameters and sendEvent", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__NEXT_RACES_RACE_FILTER_CLICK,
        undefined,
        {
          label: "all countries",
        },
      );

      expect(getNextRacesFilterClickEvent).toHaveBeenCalledWith("all countries", "VIEW_TYPE - race region switcher");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getNextRacesFilterClickEvent");
    });
  });

  describe("when action type is UI_NAVIGATE_VIEW_FROM_FAVOURITES", () => {
    it("should call getViewFromFavouritesClickEvent with correct parameters and sendEvent", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI_NAVIGATE_VIEW_FROM_FAVOURITES,
        undefined,
        {
          cardUrn: "card:urn",
          href: "href.com",
          label: "Football",
        },
      );

      expect(getViewFromFavouritesClickEvent).toHaveBeenCalledWith("Football", "VIEW_TYPE", "href.com", 2, 1);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getViewFromFavouritesClickEvent");
    });
  });

  describe("when action type is UI__PLAY_NEW_LOADED", () => {
    it("should call loadPlayNew and sendEvent", async () => {
      await setup(sendEvent, getState, UI__PLAY_NEW_LOADED, undefined, {
        urn: "urn",
        isStaticPromo: false,
      });
      expect(loadPlayNew).toHaveBeenCalledWith(2, false);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith([2, false]);
    });
  });

  describe("when action type is UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK", () => {
    it("should call getMoreInfoPlayNewClickEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK, undefined, {
        viewLink: "viewLink",
        urn: "urn",
        isStaticPromo: true,
      });
      expect(getMoreInfoPlayNewClickEvent).toHaveBeenCalledWith("viewLink", 2, true);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith(["viewLink", 2, true]);
    });
  });

  describe("when action type is UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK", () => {
    it("should call getPlayNowPlayNewClickEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK, undefined, {
        viewLink: "viewLink",
        urn: "urn",
      });
      expect(getPlayNowPlayNewClickEvent).toHaveBeenCalledWith("viewLink", 2);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith(["viewLink", 2]);
    });
  });

  describe("when action type is UI__JACKPOT_MERCHANDISE_VIEW", () => {
    it("should call getJackpotMerchandiseViewEvent with correct parameters and sendEvent", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__JACKPOT_MERCHANDISE_VIEW,
        undefined,
        {
          state: "normal",
          name: "jackpot",
        },
      );

      expect(getJackpotMerchandiseViewEvent).toHaveBeenCalledWith("normal", "jackpot");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getJackpotMerchandiseViewEvent");
    });
  });

  describe("when action type is UI__BROADCASTS_CARD_TOGGLE", () => {
    it("should call getBroadcastsToggleEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BROADCASTS_CARD_TOGGLE, undefined, {
        isExpanded: true,
        cardUrn: "URN",
      });

      expect(getBroadcastsToggleEvent).toHaveBeenCalledWith({ state: "mock" }, true, "URN");
    });

    describe("when getBroadcastsToggleEvent returns null", () => {
      it("should NOT send event", async () => {
        getBroadcastsToggleEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BROADCASTS_CARD_TOGGLE, undefined, {
          isExpanded: true,
          cardUrn: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__MEDIA_PLAYER_LOADED", () => {
    it("should call getMediaPlayerLoadedEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__MEDIA_PLAYER_LOADED, undefined, {
        label: "label",
        cardUrn: "URN",
      });

      expect(getMediaPlayerLoadedEvent).toHaveBeenCalledWith({ state: "mock" }, "label", "URN");
      expect(sendEvent).toHaveBeenCalledWith("getMediaPlayerLoadedEvent");
    });

    describe("when getMediaPlayerLoadedEvent returns null", () => {
      it("should not send event", async () => {
        getMediaPlayerLoadedEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__MEDIA_PLAYER_LOADED, undefined, {
          label: "label",
          cardUrn: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__TIME_FORM_BROADCASTS_CARD_TOGGLE", () => {
    it("should call getTimeFormBroadCastsToggleEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__TIME_FORM_BROADCASTS_CARD_TOGGLE, undefined, {
        isExpanded: true,
        cardUrn: "URN",
        raceUrn: "URN",
      });

      expect(getTimeFormBroadCastsToggleEvent).toHaveBeenCalledWith({ state: "mock" }, true, "URN", "URN");
    });

    describe("when getTimeFormBroadCastsToggleEvent returns null", () => {
      it("should NOT send event", async () => {
        getTimeFormBroadCastsToggleEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__TIME_FORM_BROADCASTS_CARD_TOGGLE, undefined, {
          isExpanded: true,
          cardUrn: "URN",
          raceUrn: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT", () => {
    it("should call getMediaPlayerLoadedEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT, undefined, {
        label: "label",
        raceUrn: "URN",
      });

      expect(getTimeFormBroadCastsMediaPlayerEvent).toHaveBeenCalledWith({ state: "mock" }, "label", "URN");
      expect(sendEvent).toHaveBeenCalledWith("getTimeFormBroadCastsMediaPlayerEvent");
    });

    describe("when getTimeFormBroadCastsMediaPlayerEvent returns null", () => {
      it("should not send event", async () => {
        getTimeFormBroadCastsMediaPlayerEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__MEDIA_PLAYER_LOADED, undefined, {
          label: "label",
          raceUrn: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE", () => {
    it("should call getBroadcastsAndStatisticsToggleEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE, undefined, {
        isExpanded: true,
        cardUrn: "URN",
      });

      expect(getBroadcastsAndStatisticsToggleEvent).toHaveBeenCalledWith({ state: "mock" }, true, "URN");
    });

    describe("when getBroadcastsAndStatisticsToggleEvent returns null", () => {
      it("should NOT send event", async () => {
        getBroadcastsAndStatisticsToggleEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE, undefined, {
          isExpanded: true,
          cardUrn: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED", () => {
    it("should call getBroadcastsAndStatisticsCardMediaPlayerEvent and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED, undefined, {
        label: "label",
        cardUrn: "URN",
      });

      expect(getBroadcastsAndStatisticsCardMediaPlayerEvent).toHaveBeenCalledWith({ state: "mock" }, "label", "URN");
      expect(sendEvent).toHaveBeenCalledWith("getBroadcastsAndStatisticsCardMediaPlayerEvent");
    });

    describe("when getBroadcastsAndStatisticsCardMediaPlayerEvent returns null", () => {
      it("should not send event", async () => {
        getBroadcastsAndStatisticsCardMediaPlayerEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED, undefined, {
          label: "label",
          cardUrn: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is URL__BETSLIP_DEEPLINK", () => {
    it("should call getBetslipDeeplinkEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, URL__BETSLIP_DEEPLINK, undefined, {
        isBetSharing: true,
      });

      expect(getBetslipDeeplinkEvent).toHaveBeenCalledWith(true);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipDeeplinkEvent");
    });
  });

  describe("when action type is UI__BACK_BUTTON_CLICK", () => {
    it("should call getBackButtonClickEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__BACK_BUTTON_CLICK, undefined, {
        url: "destinationUrl",
      });

      expect(getBackButtonClickEvent).toHaveBeenCalledWith("destinationUrl");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("backButtonEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_EACH_WAY_TOGGLE", () => {
    it("should call getBetslipEachWayToggleEvent with correct parameters and sendEvent", async () => {
      const isSelected = true;
      await setup(sendEvent, getState, UI__BETSLIP_SBK_EACH_WAY_TOGGLE, undefined, {
        isSelected,
      });

      expect(getBetslipEachWayToggleEvent).toHaveBeenCalledWith({ isSelected });
      expect(sendEvent).toHaveBeenCalledWith("getBetslipEWToggleEvent");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE", () => {
    it("should call getBetslipAccaInsuranceToggleEvent with correct parameters and sendEvent", async () => {
      const isSelected = true;
      await setup(sendEvent, getState, UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE, undefined, {
        isSelected,
      });

      expect(getBetslipAccaInsuranceToggleEvent).toHaveBeenCalledWith({ isSelected });
      expect(sendEvent).toHaveBeenCalledWith("getBetslipAccaInsuranceToggleEvent");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE", () => {
    it("should call getBetslipMyOddsBoostToggleEvent with correct parameters and sendEvent", async () => {
      const isSelected = true;
      await setup(sendEvent, getState, UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE, undefined, {
        isSelected,
      });

      expect(getBetslipMyOddsBoostToggleEvent).toHaveBeenCalledWith({ isSelected });
      expect(sendEvent).toHaveBeenCalledWith("getBetslipMyOddsBoostToggleEvent");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__BETSLIP_SBK_CAST_BET_CHANGE", () => {
    it("should call getBetslipCastBetChangeEvent with correct parameters", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_CAST_BET_CHANGE, undefined, {
        combinationId: "combinationId",
      });

      expect(getBetslipCastBetChangeEvent).toHaveBeenCalledWith({ state: "mock" }, "combinationId");
    });

    describe("when getBetslipCastBetChangeEvent returns a valid event", () => {
      it("should call sendEvent", async () => {
        getBetslipCastBetChangeEvent.mockReturnValue("getBetslipCastBetChangeEvent");
        await setup(sendEvent, getState, UI__BETSLIP_SBK_CAST_BET_CHANGE, undefined, {
          combinationId: "combinationId",
        });

        expect(sendEvent).toHaveBeenCalledWith("getBetslipCastBetChangeEvent");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });

    describe("when getBetslipCastBetChangeEvent returns null", () => {
      it("should not call sendEvent", async () => {
        getBetslipCastBetChangeEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BETSLIP_SBK_CAST_BET_CHANGE, undefined, {
          combinationId: "combinationId",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE", () => {
    it("should call getBetslipCastBetOrderChangeEvent with correct parameters", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE, undefined, {
        combinationId: "combinationId",
        updatedRunnerId: "updatedRunnerId",
      });

      expect(getBetslipCastBetOrderChangeEvent).toHaveBeenCalledWith(
        { state: "mock" },
        "combinationId",
        "updatedRunnerId",
      );
    });

    describe("when getBetslipCastBetOrderChangeEvent returns a valid event", () => {
      it("should call sendEvent", async () => {
        getBetslipCastBetOrderChangeEvent.mockReturnValue("getBetslipCastBetOrderChangeEvent");
        await setup(sendEvent, getState, UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE, undefined, {
          combinationId: "combinationId",
          updatedRunnerId: "updatedRunnerId",
        });

        expect(sendEvent).toHaveBeenCalledWith("getBetslipCastBetOrderChangeEvent");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });

    describe("when getBetslipCastBetOrderChangeEvent returns null", () => {
      it("should not call sendEvent", async () => {
        getBetslipCastBetOrderChangeEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE, undefined, {
          combinationId: "combinationId",
          updatedRunnerId: "updatedRunnerId",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__TOGGLE_TIMEFORM_CARD", () => {
    describe("when all data needed is in the store", () => {
      it("should get sport, call getToggleTimeFormEvent and send event", async () => {
        getState.mockReturnValue({
          entities: {
            races: {
              "ppb:race:30408598.1615": {
                typename: "Race",
                urn: "ppb:race:30408598.1615",
                raceId: "30408598.1615",
                meeting: "ppb:meeting:30408598",
                startTime: "2021-04-08T16:15:00.000Z",
                details: {
                  status: "OFF",
                },
              },
            },
            meetings: {
              "ppb:meeting:30408598": {
                urn: "ppb:meeting:30408598",
                venue: "Aintree",
                meetingId: "30408598",
                entityName: "Aintree 8th Apr",
                sportUrn: "ppb:eventType:7",
              },
            },
            sports: { "ppb:eventType:7": { urn: "ppb:eventType:7", name: "Horse Racing", sportId: 7 } },
          },
        });
        getToggleTimeFormEvent.mockReturnValue({
          mock: "getToggleTimeFormEvent",
        });
        await setup(sendEvent, getState, UI__TOGGLE_TIMEFORM_CARD, undefined, {
          isExpanded: false,
          raceUrn: "ppb:race:30408598.1615",
        });

        expect(getSportByURN).toHaveBeenCalledWith(
          { "ppb:eventType:7": { name: "Horse Racing", sportId: 7, urn: "ppb:eventType:7" } },
          "ppb:eventType:7",
        );
        expect(getToggleTimeFormEvent).toHaveBeenCalledWith(
          false,
          {
            details: { status: "OFF" },
            meeting: "ppb:meeting:30408598",
            raceId: "30408598.1615",
            startTime: "2021-04-08T16:15:00.000Z",
            typename: "Race",
            urn: "ppb:race:30408598.1615",
          },
          {
            entityName: "Aintree 8th Apr",
            meetingId: "30408598",
            sportUrn: "ppb:eventType:7",
            urn: "ppb:meeting:30408598",
            venue: "Aintree",
          },
          { name: "sport name", sportId: 1 },
        );
        expect(sendEvent).toHaveBeenCalledWith({
          mock: "getToggleTimeFormEvent",
        });
      });
    });

    describe("when there is no race in the store", () => {
      it("should call getToggleTimeFormEvent with race and meeting as undefined", async () => {
        getState.mockReturnValue({
          entities: {
            races: {},
            meetings: {
              "ppb:meeting:30408598": {
                urn: "ppb:meeting:30408598",
                venue: "Aintree",
                meetingId: "30408598",
                entityName: "Aintree 8th Apr",
                sportUrn: "ppb:eventType:7",
              },
            },
            sports: { "ppb:eventType:7": { urn: "ppb:eventType:7", name: "Horse Racing", sportId: 7 } },
          },
        });

        await setup(sendEvent, getState, UI__TOGGLE_TIMEFORM_CARD, undefined, {
          isExpanded: false,
          raceUrn: "ppb:race:30408598.1615",
        });

        expect(getToggleTimeFormEvent).toHaveBeenCalledWith(false, undefined, undefined, {
          name: "sport name",
          sportId: 1,
        });
      });
    });

    describe("when there is no meeting in the store", () => {
      it("should call getToggleTimeFormEvent with meeting as undefined", async () => {
        getState.mockReturnValue({
          entities: {
            races: {
              "ppb:race:30408598.1615": {
                urn: "ppb:race:30408598.1615",
                typename: "Race",
                raceId: "30408598.1615",
                meeting: "ppb:meeting:30408598",
                startTime: "2021-04-08T16:15:00.000Z",
                details: {
                  status: "OFF",
                },
              },
            },
            meetings: {},
            sports: { "ppb:eventType:7": { urn: "ppb:eventType:7", name: "Horse Racing", sportId: 7 } },
          },
        });

        await setup(sendEvent, getState, UI__TOGGLE_TIMEFORM_CARD, undefined, {
          isExpanded: false,
          raceUrn: "ppb:race:30408598.1615",
        });

        expect(getToggleTimeFormEvent).toHaveBeenCalledWith(
          false,
          {
            details: { status: "OFF" },
            meeting: "ppb:meeting:30408598",
            raceId: "30408598.1615",
            startTime: "2021-04-08T16:15:00.000Z",
            typename: "Race",
            urn: "ppb:race:30408598.1615",
          },
          undefined,
          {
            name: "sport name",
            sportId: 1,
          },
        );
      });
    });

    describe("when there is no sport in the store", () => {
      it("should call getToggleTimeFormEvent with sport as undefined", async () => {
        getSportByURN.mockReturnValue(undefined);
        getState.mockReturnValue({
          entities: {
            races: {
              "ppb:race:30408598.1615": {
                urn: "ppb:race:30408598.1615",
                typename: "Race",
                raceId: "30408598.1615",
                meeting: "ppb:meeting:30408598",
                startTime: "2021-04-08T16:15:00.000Z",
                details: {
                  status: "OFF",
                },
              },
            },
            meetings: {
              "ppb:meeting:30408598": {
                urn: "ppb:meeting:30408598",
                venue: "Aintree",
                meetingId: "30408598",
                entityName: "Aintree 8th Apr",
                sportUrn: "ppb:eventType:7",
              },
            },
            sports: {},
          },
        });

        await setup(sendEvent, getState, UI__TOGGLE_TIMEFORM_CARD, undefined, {
          isExpanded: false,
          raceUrn: "ppb:race:30408598.1615",
        });

        expect(getToggleTimeFormEvent).toHaveBeenCalledWith(
          false,
          {
            details: { status: "OFF" },
            meeting: "ppb:meeting:30408598",
            raceId: "30408598.1615",
            startTime: "2021-04-08T16:15:00.000Z",
            urn: "ppb:race:30408598.1615",
            typename: "Race",
          },
          {
            entityName: "Aintree 8th Apr",
            meetingId: "30408598",
            sportUrn: "ppb:eventType:7",
            urn: "ppb:meeting:30408598",
            venue: "Aintree",
          },
          undefined,
        );
      });
    });
  });
  describe("when action type is UI__SWITCHER_OPEN", () => {
    it("should call sendEvent", async () => {
      getSwitcherEvent.mockReturnValue("getSwitcherEvent");
      await setup(sendEvent, getState, UI__SWITCHER_OPEN, undefined, {});

      expect(sendEvent).toHaveBeenCalledWith("getSwitcherEvent");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__NAVIGATION_TAB_CLICK", () => {
    it("should call getNavigationTabClickEvent and sendEvent with correct parameters", async () => {
      const state = {
        layouts: { views: "views" },
        router: { currentUrn: "currentViewUrn" },
      };

      await setup(sendEvent, () => state, UI__NAVIGATION_TAB_CLICK, undefined, {
        label: "label",
        urn: "urn",
      });
      expect(getNavigationTabClickEvent).toHaveBeenCalledWith("label", "VIEW_TYPE", 2);
      expect(sendEvent).toHaveBeenCalledWith("getNavigationTabClickEvent");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__CARDGROUP_VIEW_ALL_LINK_TAP", () => {
    beforeEach(async () => {
      getState = jest.fn(() => ({
        layouts: {
          views: {
            "current:view": "view",
          },
        },
        router: {
          currentUrn: "current:view",
        },
      }));
    });

    it("should call getViewAllTapEvent and sendEvent with correct parameters", async () => {
      await setup(sendEvent, getState, UI__CARDGROUP_VIEW_ALL_LINK_TAP, undefined, {
        title: "title",
        viewAllLink: {
          label: "label",
          viewLink: {
            viewUrl: "viewUrl",
          },
        },
        cardgroupURN: "URN",
      });

      expect(getViewAllTapEvent).toHaveBeenCalledWith("label", "title", "viewUrl", "VIEW_TYPE", 2, 1);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getViewAllTapEvent");
    });

    describe("when getLayoutMetadata returns horizontalPosition = null", () => {
      it("should call getViewAllTapEvent with horizontalPosition undefined", async () => {
        await setup(sendEvent, getState, UI__CARDGROUP_VIEW_ALL_LINK_TAP, undefined, {
          title: "title",
          viewAllLink: {
            label: "label",
            viewLink: {
              viewUrl: "viewUrl",
            },
          },
          cardgroupURN: "URN",
        });

        expect(getViewAllTapEvent).toHaveBeenCalledWith("label", "title", "viewUrl", "VIEW_TYPE", 2, 1);
      });
    });

    describe("when getViewAllTapEvent returns null", () => {
      it("should NOT send event", async () => {
        getViewAllTapEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__CARDGROUP_VIEW_ALL_LINK_TAP, undefined, {
          title: "title",
          cardgroupURN: "URN",
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is UI__CASHOUT_BUTTON_TAP", () => {
    it("should call getCashoutClickEvent with correct parameters", async () => {
      await setup(sendEvent, getState, UI__CASHOUT_BUTTON_TAP, nextSpy, {
        cashoutUrn: "ppb:sbkCashoutQuote:1098374316",
        confirmCashout: true,
      });

      expect(getCashoutClickEvent).toHaveBeenCalledWith({ state: "mock" }, "ppb:sbkCashoutQuote:1098374316");
    });

    describe("when getCashoutClickEvent returns a valid event", () => {
      it("should call sendEvent", async () => {
        getCashoutClickEvent.mockReturnValue("getCashoutClickEvent");
        await setup(sendEvent, getState, UI__CASHOUT_BUTTON_TAP, undefined, {
          cashoutUrn: "ppb:sbkCashoutQuote:1098374316",
          confirmCashout: true,
        });

        expect(sendEvent).toHaveBeenCalledWith("getCashoutClickEvent");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });
    });

    describe("when getCashoutClickEvent returns null", () => {
      it("should not call sendEvent", async () => {
        getCashoutClickEvent.mockReturnValue(null);
        await setup(sendEvent, getState, UI__CASHOUT_BUTTON_TAP, undefined, {
          cashoutUrn: "ppb:sbkCashoutQuote:1098374316",
          confirmCashout: true,
        });

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when confirmCashout is false", () => {
      it("should call sendEvent for two times", async () => {
        getCashoutClickEvent.mockReturnValue("getCashoutClickEvent");
        getAutoConfirmCashoutClickEvent.mockReturnValue("getCashoutClickEvent");
        await setup(sendEvent, getState, UI__CASHOUT_BUTTON_TAP, nextSpy, {
          cashoutUrn: "ppb:sbkCashoutQuote:1098374316",
          confirmCashout: false,
        });

        expect(sendEvent).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("when action type is NETWORK__CASHOUT_TAKE_SUCCESS", () => {
    beforeEach(async () => {
      getState.mockReturnValue("appState");
      getCashoutSuccessEvent.mockReturnValue("getCashoutSuccessEvent");
      await setup(sendEvent, getState, NETWORK__CASHOUT_TAKE_SUCCESS, nextSpy, {
        receipt: {
          entityURN: "ppb:sbkCashoutQuote:1098374316",
        },
      });
    });

    it("should send a CashoutSuccessEvent event", () => {
      expect(getCashoutSuccessEvent).toHaveBeenCalledWith("appState", "ppb:sbkCashoutQuote:1098374316");
      expect(getCashoutSuccessEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCashoutSuccessEvent");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS", () => {
    beforeEach(async () => {
      getState.mockReturnValue("appState");
      getNavigationSeeAllPromotionsEvent.mockReturnValue("getNavigationSeeAllPromotionsEvent");
      await setup(sendEvent, getState, UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS, nextSpy, {
        viewUrl: "fakeViewUrl",
      });
    });

    it("should send a getNavigationSeeAllPromotionsEvent event", () => {
      expect(getNavigationSeeAllPromotionsEvent).toHaveBeenCalledWith("fakeViewUrl", "see all our promotions");
      expect(getNavigationSeeAllPromotionsEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getNavigationSeeAllPromotionsEvent");
    });
  });

  describe("when action type is ACCEPT_PROMOTION", () => {
    beforeEach(async () => {
      getState.mockReturnValue("appState");
      getAcceptPromotionEvent.mockReturnValue("getAcceptPromotionEvent");
      await setup(sendEvent, getState, ACCEPT_PROMOTION, nextSpy, {
        urn: "fakeUrn",
        name: "fakeName",
        promoStatus: "fakePromoStatus",
        userStatus: "fakeUserStatus",
      });
    });

    it("should send a getAcceptPromotionEvent event", () => {
      expect(getAcceptPromotionEvent).toHaveBeenCalledWith(
        "fakeUrn",
        "accept",
        "fakeName",
        "fakePromoStatus",
        "fakeUserStatus",
      );
      expect(getAcceptPromotionEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getAcceptPromotionEvent");
    });
  });

  describe("when action type is REFRESH_PROMOTION", () => {
    beforeEach(async () => {
      getState.mockReturnValue("appState");
      getCancelPromotionEvent.mockReturnValue("refreshPromotionEvent");
      await setup(sendEvent, getState, REFRESH_PROMOTION, nextSpy, {
        urn: "fakeUrn",
        name: "fakeName",
        promoStatus: "fakePromoStatus",
        userStatus: "fakeUserStatus",
        label: "refresh",
      });
    });

    it("should send a getCancelPromotionEvent event", () => {
      expect(getCancelPromotionEvent).toHaveBeenCalledWith(
        "fakeUrn",
        "refresh",
        "fakeName",
        "fakePromoStatus",
        "fakeUserStatus",
      );
      expect(getCancelPromotionEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("refreshPromotionEvent");
    });
  });

  describe("when action type is INTERACT_CANCEL_PROMOTION_MODAL", () => {
    beforeEach(async () => {
      getState.mockReturnValue("appState");
      getCancelPromotionEvent.mockReturnValue("cancelPromotionEvent");
      await setup(sendEvent, getState, INTERACT_CANCEL_PROMOTION_MODAL, nextSpy, {
        urn: "fakeUrn",
        name: "fakeName",
        promoStatus: "fakePromoStatus",
        userStatus: "fakeUserStatus",
        label: "cancel",
      });
    });

    it("should send a getCancelPromotionEvent event", () => {
      expect(getCancelPromotionEvent).toHaveBeenCalledWith(
        "fakeUrn",
        "cancel",
        "fakeName",
        "fakePromoStatus",
        "fakeUserStatus",
      );
      expect(getCancelPromotionEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("cancelPromotionEvent");
    });
  });

  describe("when action type is NETWORK__CASHOUT_TAKE_FAILURE", () => {
    beforeEach(async () => {
      getState.mockReturnValue("appState");
      getCashoutFailureEvent.mockReturnValue("getCashoutFailureEvent");
      await setup(sendEvent, getState, NETWORK__CASHOUT_TAKE_FAILURE, nextSpy, {
        receipt: { entityURN: "ppb:sbkCashoutQuote:1098374316" },
        errorCode: "errorCode",
      });
    });

    it("should send a CashoutFailureEvent event", () => {
      expect(getCashoutFailureEvent).toHaveBeenCalledWith("appState", "ppb:sbkCashoutQuote:1098374316", "errorCode");
      expect(getCashoutFailureEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCashoutFailureEvent");
    });
  });
  describe("when action type is NETWORK__CASHOUT_TAKE_FAILURE_SBK", () => {
    beforeEach(async () => {
      getState.mockReturnValue("appState");
      getCashoutFailureEvent.mockReturnValue("getCashoutFailureEvent");
      await setup(sendEvent, getState, NETWORK__CASHOUT_TAKE_FAILURE_SBK, nextSpy, {
        entityURN: "ppb:sbkCashoutQuote:1098374316",
        errorCode: "errorCode",
      });
    });

    it("should send a CashoutFailureEvent event", () => {
      expect(getCashoutFailureEvent).toHaveBeenCalledWith("appState", "ppb:sbkCashoutQuote:1098374316", "errorCode");
      expect(getCashoutFailureEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCashoutFailureEvent");
    });
  });

  describe("when action type is UI__FILTER_OPEN", () => {
    it("should call getFilterOpenEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__FILTER_OPEN, undefined, {
        label: "label",
      });

      expect(getFilterOpenEvent).toHaveBeenCalledWith("label");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getFilterOpenEvent");
    });
  });

  describe("when action type is UI__FILTER_CLOSE", () => {
    it("should call getFilterCloseEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__FILTER_CLOSE, undefined, undefined);

      expect(getFilterCloseEvent).toHaveBeenCalled();
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getFilterCloseEvent");
    });
  });

  describe("when action type is UI__FILTER_APPLY", () => {
    it("should call getFilterApplyEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__FILTER_APPLY, undefined, {
        selectedOptions: ["label 1", "label 2"],
      });

      expect(getFilterApplyEvent).toHaveBeenCalledWith("label 1, label 2");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getFilterApplyEvent");
    });
  });

  describe("when action type is UI__FILTERS_RESET_CLICK", () => {
    it("should call getFilterResetClickEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__FILTERS_RESET_CLICK, undefined, {
        label: "label",
      });

      expect(getFilterResetClickEvent).toHaveBeenCalledWith("label");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getFilterResetClickEvent");
    });
  });

  describe("when action type is SAW_CARD", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, SAW_CARD, undefined, {
        label: "label",
        moduleName: "moduleName",
      });
    });

    it("should send a getSawCardEvent event", () => {
      expect(getSawCardEvent).toHaveBeenCalledWith("label", "moduleName");
      expect(getSawCardEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getSawCardEvent");
    });
  });

  describe("when action type is EXTERNAL_PUSH", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, EXTERNAL_PUSH, undefined, {
        gtmData: {
          label: "label",
          moduleName: "moduleName",
        },
        viewUrl: "fakeUrl",
      });
    });

    it("should send a getNavigateToEvent event", () => {
      expect(getNavigateToEvent).toHaveBeenCalledWith("label", "moduleName", "fakeUrl");
      expect(getNavigateToEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getNavigateToEvent");
    });
  });

  describe("when action type is BOTTOM_BAR_PUSH", () => {
    beforeEach(jest.clearAllMocks);

    it("should call getBottomBarClickEvent and sendEvent", async () => {
      getState = jest.fn().mockReturnValue({
        router: {},
      });

      await setup(sendEvent, getState, BOTTOM_BAR_PUSH, undefined, {
        viewUrn: "ViewUrn",
        viewUrl: "ViewUrl",
        gtmData: {
          label: "label",
          moduleName: "moduleName",
        },
      });

      expect(getState).toHaveBeenCalledTimes(1);
      expect(getBottomBarClickEvent).toHaveBeenCalledWith("VIEW_TYPE", "label", "ViewUrl");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBottomBarClickEvent");
    });

    describe("with missing data", () => {
      beforeEach(jest.clearAllMocks);
      describe("without label", () => {
        beforeEach(async () => {
          await setup(sendEvent, getState, BOTTOM_BAR_PUSH, undefined, {
            viewUrn: "ViewUrn",
            viewUrl: "ViewUrl",
          });
        });
        it("should return empty label", async () => {
          expect(getState).toHaveBeenCalledTimes(1);
          expect(getBottomBarClickEvent).toHaveBeenCalledWith("VIEW_TYPE", "", "ViewUrl");
          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith("getBottomBarClickEvent");
        });
      });
    });
  });

  describe("when action type is UI__NOT_FOUND_VIEW_LOADED", () => {
    describe("when currentUrl is not defined in router", () => {
      beforeEach(async () => {
        getState = jest.fn().mockReturnValue({
          router: {
            currentUrl: null,
          },
        });
        await setup(sendEvent, getState, UI__NOT_FOUND_VIEW_LOADED, undefined, {});
      });

      it("should call getLoadedNotFoundView with correct params", () => {
        expect(getLoadedNotFoundView).toHaveBeenCalledWith("");
        expect(getLoadedNotFoundView).toHaveBeenCalledTimes(1);
      });

      it("should send a getLoadedNotFoundView event", () => {
        expect(sendEvent).toHaveBeenCalledWith("getLoadedNotFoundView");
      });
    });

    describe("when currentUrl is defined in router", () => {
      beforeEach(async () => {
        getState = jest.fn().mockReturnValue({
          router: {
            currentUrl: "fakeUrl",
          },
        });

        await setup(sendEvent, getState, UI__NOT_FOUND_VIEW_LOADED, undefined, {});
      });

      it("should call getLoadedNotFoundView with correct params", () => {
        expect(getLoadedNotFoundView).toHaveBeenCalledWith("fakeUrl");
        expect(getLoadedNotFoundView).toHaveBeenCalledTimes(1);
      });

      it("should send a getLoadedNotFoundView event", () => {
        expect(sendEvent).toHaveBeenCalledWith("getLoadedNotFoundView");
      });
    });
  });

  describe("when action type is UI__NAVIGATE_FROM_NOT_FOUND_VIEW", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__NAVIGATE_FROM_NOT_FOUND_VIEW, undefined, {
        label: "label",
        destinationUrl: "fakeUrl",
      });
    });

    it("should call getNavigateFromNotFoundView with correct params", () => {
      expect(getNavigateFromNotFoundView).toHaveBeenCalledWith("label", "fakeUrl");
    });

    it("should send a getNavigateFromNotFoundView event", () => {
      expect(sendEvent).toHaveBeenCalledWith("getNavigateFromNotFoundView");
    });
  });

  describe("when action type is NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS", () => {
    beforeEach(async () => {
      getCancelBetClickEvent.mockReturnValue("getCancelBetClickEventSuccess");
      await setup(sendEvent, getState, NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS, undefined, {
        side: "LAY",
      });
    });

    it("should send a getCancelBetClickEvent event", () => {
      expect(getCancelBetClickEvent).toHaveBeenCalledWith(
        "cancelled unmatched bet - success",
        "cancelled unmatched bet",
        "my bets",
        "LAY",
      );
      expect(getCancelBetClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCancelBetClickEventSuccess");
    });
  });

  describe("when action type is NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE", () => {
    beforeEach(async () => {
      getCancelBetClickEvent.mockReturnValue("getCancelBetClickEventFailure");
      await setup(sendEvent, getState, NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE, undefined, {
        side: "LAY",
        errorCode: "An error was returned with code 007",
      });
    });

    it("should send a getCancelBetClickEvent event", () => {
      expect(getCancelBetClickEvent).toHaveBeenCalledWith(
        "cancelled unmatched bet - error",
        "cancelled unmatched bet",
        "my bets",
        "LAY",
        "An error was returned with code 007",
      );
      expect(getCancelBetClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCancelBetClickEventFailure");
    });
  });

  describe("when action type is UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS);
    });
    it("should send a getMyBetsCancelAllEvent event", () => {
      expect(getMyBetsCancelAllEvent).toHaveBeenCalledWith();
      expect(getMyBetsCancelAllEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsCancelAllEvent");
    });
  });

  describe("when action type is NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BET_SUCCESS", () => {
    beforeEach(async () => {
      getCancelBetClickEvent.mockReturnValue("getCancelBetClickEventSuccess");
      await setup(sendEvent, getState, NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS, undefined, {
        side: "LAY",
      });
    });

    it("should send a getCancelBetClickEvent event", () => {
      expect(getCancelBetClickEvent).toHaveBeenCalledWith(
        "cancelled all unmatched bets - success",
        "cancelled unmatched bet",
        "my bets",
      );
      expect(getCancelBetClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCancelBetClickEventSuccess");
    });
  });

  describe("when action type is NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE", () => {
    beforeEach(async () => {
      getCancelBetClickEvent.mockReturnValue("getCancelBetClickEventFailure");
      await setup(sendEvent, getState, NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE, undefined, {
        side: "LAY",
        errorCode: "An error was returned with code 007",
      });
    });

    it("should send a getCancelBetClickEvent event", () => {
      expect(getCancelBetClickEvent).toHaveBeenCalledWith(
        "cancelled all unmatched bets - error",
        "cancelled unmatched bet",
        "my bets",
        undefined,
        "An error was returned with code 007",
      );
      expect(getCancelBetClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCancelBetClickEventFailure");
    });
  });

  describe("when action type is UI__MY_BETS_EXC_EDIT_BET_PRESS", () => {
    beforeEach(async () => {
      getMyBetsEditClickEvent.mockReturnValue("getMyBetsEditClickEvent");
      await setup(sendEvent, getState, UI__MY_BETS_EXC_EDIT_BET_PRESS, undefined, {
        side: "LAY",
      });
    });

    it("should send a getMyBetsEditClickEvent event", () => {
      expect(getMyBetsEditClickEvent).toHaveBeenCalledWith("LAY");
      expect(getMyBetsEditClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsEditClickEvent");
    });
  });

  describe("when action type is UI__MY_BETS_EXC_EDIT_BET_CLOSE", () => {
    describe("when payload has wasCloseButtonPressed as true", () => {
      beforeEach(async () => {
        getMyBetsEditBottomSheetCloseEvent.mockReturnValue("getMyBetsEditBottomSheetCloseEvent");
        await setup(sendEvent, getState, UI__MY_BETS_EXC_EDIT_BET_CLOSE, undefined, {
          wasCloseButtonPressed: true,
        });
      });

      it("should send a getMyBetsEditBottomSheetCloseEvent event", () => {
        expect(getMyBetsEditBottomSheetCloseEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getMyBetsEditBottomSheetCloseEvent");
      });
    });

    describe("when payload has wasCloseButtonPressed as false", () => {
      beforeEach(async () => {
        getMyBetsEditBottomSheetCloseEvent.mockReturnValue("getMyBetsEditBottomSheetCloseEvent");
        await setup(sendEvent, getState, UI__MY_BETS_EXC_EDIT_BET_CLOSE, undefined, {
          wasCloseButtonPressed: false,
        });
      });

      it("should not send a getMyBetsEditBottomSheetCloseEvent event", () => {
        expect(getMyBetsEditBottomSheetCloseEvent).toHaveBeenCalledTimes(0);
        expect(sendEvent).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when action type is UI__MY_BETS_BET_SHARING_PREVIEW_TAP", () => {
    it("should send a getMyBetsBetSharingPreviewOnTapEvent event", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_BET_SHARING_PREVIEW_TAP);

      expect(getMyBetsBetSharingPreviewOnTapEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsBetSharingPreviewOnTapEvent");
    });
  });

  describe("when action type is UI__MY_BETS_BET_SHARING_DISMISS_TAP", () => {
    it("should send a getMyBetsBetSharingDismissOnTapEvent event", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_BET_SHARING_DISMISS_TAP);

      expect(getMyBetsBetSharingDismissOnTapEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsBetSharingDismissOnTapEvent");
    });
  });

  describe("when action type is UI__MY_BETS_BET_SHARING_SHARE_BET_TAP", () => {
    it("should send a getMyBetsBetSharingShareBetOnTapEvent event", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_BET_SHARING_SHARE_BET_TAP);

      expect(getMyBetsBetSharingShareBetOnTapEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsBetSharingShareBetOnTapEvent");
    });
  });

  describe("when action type is UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP", () => {
    it("should send a getMyBetsBetSharingShareImageOnTapEvent event", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP);

      expect(getMyBetsBetSharingShareImageOnTapEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsBetSharingShareImageOnTapEvent");
    });
  });

  describe("when action type is UI__MY_BETS_ACCA_FREEZE_OPENED", () => {
    it("should send a getMyBetsAccaFreezeOpenedEvent event", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_ACCA_FREEZE_OPENED);

      expect(getMyBetsAccaFreezeOpenedEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsAccaFreezeOpenedEvent");
    });
  });

  describe("when action type is UI__MY_BETS_ACCA_FREEZE_CLOSED", () => {
    it("should send a getMyBetsAccaFreezeClosedEvent event", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_ACCA_FREEZE_CLOSED);

      expect(getMyBetsAccaFreezeClosedEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsAccaFreezeClosedEvent");
    });
  });

  describe("when action type is UI__BET_MUTATION_ACCA_FREEZE_SELECTED", () => {
    it("should send a getBetMutationAccaFreezeSelectedEvent event", async () => {
      await setup(sendEvent, getState, UI__BET_MUTATION_ACCA_FREEZE_SELECTED, undefined, {
        eventUrn: "bff:event:12345",
      });

      expect(getBetMutationAccaFreezeSelectedEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetMutationAccaFreezeSelectedEvent");
    });
  });

  describe("when action type is UI__BET_MUTATION_ACCA_FREEZE_DESELECTED", () => {
    it("should send a getBetMutationAccaFreezeDeselectedEvent event", async () => {
      await setup(sendEvent, getState, UI__BET_MUTATION_ACCA_FREEZE_DESELECTED);

      expect(getBetMutationAccaFreezeDeselectedEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetMutationAccaFreezeDeselectedEvent");
    });
  });

  describe("when action type is NETWORK__FREEZE_BET", () => {
    it("should send a getMyBetsAccaFreezeConfirmEvent event", async () => {
      await setup(sendEvent, getState, NETWORK__FREEZE_BET, undefined, {
        eventName: "eventName",
        matchScore: "1-2",
        frozenTime: "10'",
      });

      expect(getBetMutationAccaFreezeConfirmEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetMutationAccaFreezeConfirmEvent");
    });
  });

  describe("when action type is PN_INTERACTION_EVENT", () => {
    beforeAll(jest.clearAllMocks);

    describe("when there is no userDetails and oddsDisplay", () => {
      beforeEach(async () => {
        getPNInteractionClickEvent.mockReturnValue("getPNInteractionClickEvent");
        await setup(sendEvent, getState, PN_INTERACTION_EVENT, undefined, {
          label: "push notification title",
          module: "notifications",
        });
      });

      it("should send a getPNInteractionClickEvent event", () => {
        expect(getPNInteractionClickEvent).toHaveBeenCalledWith("push notification title", "notifications");
        expect(getPNInteractionClickEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getPNInteractionClickEvent");
      });
    });
  });

  describe("when action type is UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET", () => {
    nextSpy = jest.fn().mockReturnValue("nextReturnValue");
    beforeAll(jest.clearAllMocks);

    describe("when there's no sportEvent", () => {
      beforeEach(async () => {
        getSportEventByURN.mockReturnValueOnce(null);
        getState.mockReturnValueOnce({
          entities: { sportevents: "sportevents" },
        });
        await setup(sendEvent, getState, UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET, nextSpy, {
          couponCardGroupUrn: "couponCardGroupUrn",
          sporteventURN: "sporteventURN",
          href: "href",
        });
      });

      it("should not send any event", () => {
        expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sporteventURN");
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when there's a sportEvent", () => {
      beforeEach(async () => {
        getState.mockReturnValueOnce({
          entities: { sportevents: "sportevents" },
          layouts: {
            cardgroups: {
              couponcardgroups: "couponcardgroups",
              filteredcouponcardgroups: "filteredcouponcardgroups",
            },
          },
        });

        await setup(sendEvent, getState, UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET, nextSpy, {
          couponCardGroupUrn: "couponCardGroupUrn",
          sporteventURN: "sporteventURN",
          href: "href",
        });
      });

      it("should send the event with the expected values", () => {
        expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sporteventURN");
        expect(getCouponViewCardClickEvent).toHaveBeenCalledWith(
          "event name",
          "VIEW_TYPE",
          "href",
          "filteredCouponTitle",
          "tabTitle",
        );
        expect(sendEvent).toHaveBeenCalledWith("getCouponViewCardClickEvent");
      });
    });
  });

  describe("when action type is UI__SWITCH_PRODUCT_PREFERENCE", () => {
    describe("when event is not defined", () => {
      beforeEach(async () => {
        getSwitchProductEvent.mockReturnValueOnce(undefined);
        await setup(sendEvent, getState, UI__SWITCH_PRODUCT_PREFERENCE, undefined, {
          productSwitcherPreference: "label",
        });
      });

      it("should not send any event", () => {
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when event is defined", () => {
      beforeEach(async () => {
        await setup(sendEvent, getState, UI__SWITCH_PRODUCT_PREFERENCE, undefined, {
          productSwitcherPreference: "label",
        });
      });
      it("should send a getSwitchProductEvent event", () => {
        expect(getSwitchProductEvent).toHaveBeenCalledWith("label", "VIEW_TYPE");
        expect(getSwitchProductEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getSwitchProductEvent");
      });
    });
  });

  describe("when action type is UI__GRAPH_TOGGLE", () => {
    describe("when event is defined", () => {
      beforeEach(async () => {
        getState.mockReturnValueOnce({
          entities: { sportevents: "sportevents" },
        });

        await setup(sendEvent, getState, UI__GRAPH_TOGGLE, undefined, {
          runnerName: "runnerName",
          marketName: "marketName",
          isClosed: false,
        });
      });

      it("should send a getToggleMarketGraphEvent event", () => {
        expect(getToggleMarketGraphEvent).toHaveBeenCalledWith("VIEW_TYPE", "runnerName", "marketName", false);
        expect(sendEvent).toHaveBeenCalledWith("getToggleMarketGraphEvent");
      });
    });
  });

  describe("when action type is UI__RECENT_RACE_TOGGLE", () => {
    describe("when event is defined", () => {
      beforeEach(async () => {
        await setup(sendEvent, getState, UI__RECENT_RACE_TOGGLE, undefined, {
          runnerName: "runnerName",
          cardUrn: "cardUrn",
          isClosed: false,
        });
      });

      it("should send a getToggleRecentRacesEvent event", async () => {
        expect(getToggleRecentRacesEvent).toHaveBeenCalledWith(
          { state: "mock" },
          "VIEW_TYPE",
          "cardUrn",
          "runnerName",
          false,
        );
        expect(sendEvent).toHaveBeenCalledWith("getToggleRecentRacesEvent");
      });
    });
  });

  describe("when action type is UI__TOGGLE_SHOW_MORE_RUNNERS", () => {
    describe("when showMore is true", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => ({
          layouts: {
            views: {
              "current:view": "view",
            },
          },
          router: {
            currentUrn: "current:view",
          },
        }));
      });

      it("should send the correct gtm event", async () => {
        await setup(sendEvent, getState, UI__TOGGLE_SHOW_MORE_RUNNERS, undefined, {
          cardUrn: "card:urn",
          showMore: true,
        });
        expect(getToggleShowMoreEvent).toHaveBeenCalledWith("VIEW_TYPE", "tab", "pebbleCardGroup", "Show More");
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getToggleShowMoreEvent");
      });
    });

    describe("when showMore is false", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => ({
          layouts: {
            views: {
              "current:view": "view",
            },
          },
          router: {
            currentUrn: "current:view",
          },
        }));
      });

      it("should send the correct gtm event", async () => {
        await setup(sendEvent, getState, UI__TOGGLE_SHOW_MORE_RUNNERS, undefined, {
          cardUrn: "card:urn",
          showMore: false,
        });

        expect(getToggleShowMoreEvent).toHaveBeenCalledWith("VIEW_TYPE", "tab", "pebbleCardGroup", "Show Less");
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getToggleShowMoreEvent");
      });
    });
  });

  describe("when action type is UI__MARKET_BLURB_EXPAND_CLICK", () => {
    describe("when isOpen is true and has no filter", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => ({
          layouts: {
            views: {
              "current:view": "view",
            },
          },
          router: {
            currentUrn: "current:view",
          },
        }));
      });

      it("should send the correct gtm event", async () => {
        await setup(sendEvent, getState, UI__MARKET_BLURB_EXPAND_CLICK, undefined, {
          cardUrn: "card:urn",
          isOpen: true,
        });
        expect(getMarketBlurbExpandableEvent).toHaveBeenCalledWith("VIEW_TYPE", "tab", "pebbleCardGroup", true);
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getMarketBlurbExpandableEvent");
      });
    });

    describe("when isOpen is false and has filter", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => ({
          layouts: {
            views: {
              "current:view": "view",
            },
          },
          router: {
            currentUrn: "current:view",
          },
        }));
      });

      it("should send the correct gtm event", async () => {
        await setup(sendEvent, getState, UI__MARKET_BLURB_EXPAND_CLICK, undefined, {
          cardUrn: "card:urn",
          isOpen: false,
          filter: "market",
        });

        expect(getMarketBlurbExpandableEvent).toHaveBeenCalledWith("VIEW_TYPE", "tab", "market", false);
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getMarketBlurbExpandableEvent");
      });
    });
  });

  describe("when action type is UI__NAVIGATE_TO_FAQ_PAGE", () => {
    describe("when provided with market and no filter", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => ({
          layouts: {
            views: {
              "current:view": "view",
            },
          },
          router: {
            currentUrn: "current:view",
          },
        }));
      });

      it("should send the correct gtm event", async () => {
        await setup(sendEvent, getState, UI__NAVIGATE_TO_FAQ_PAGE, undefined, {
          cardUrn: "card:urn",
          href: "coisasfofas.pt",
        });
        expect(getMarketBlurbFAQEvent).toHaveBeenCalledWith("VIEW_TYPE", "tab", "pebbleCardGroup", "coisasfofas.pt");
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getMarketBlurbFAQEvent");
      });
    });

    describe("when provided with filter and no market", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        getState = jest.fn(() => ({
          layouts: {
            views: {
              "current:view": "view",
            },
          },
          router: {
            currentUrn: "current:view",
          },
        }));
      });

      it("should send the correct gtm event", async () => {
        await setup(sendEvent, getState, UI__NAVIGATE_TO_FAQ_PAGE, undefined, {
          cardUrn: "card:urn",
          filter: "market",
          href: "coisasfofas.pt",
        });

        expect(getMarketBlurbFAQEvent).toHaveBeenCalledWith("VIEW_TYPE", "tab", "market", "coisasfofas.pt");
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getMarketBlurbFAQEvent");
      });
    });
  });

  describe("when action type is UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS", () => {
    const state = {
      layouts: {
        views: {
          "current:view": "view",
        },
      },
      router: {
        currentUrn: "current:view",
      },
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn(() => state);
    });

    it("should send the correct gtm event", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS, undefined, {
        cardUrn: "card:urn",
        selection: { runnerUrn: "runner:urn", marketUrn: "market:urn", uniqueId: "id" },
        betOriginURL: "origin/url",
      });
      expect(getBetslipBetBuilderAddSelections).toHaveBeenCalledWith(
        state,
        {
          type: "BETSLIP/PP_BET_BUILDER_ADD_SELECTIONS",
          payload: {
            cardUrn: "card:urn",
            selection: { runnerUrn: "runner:urn", marketUrn: "market:urn", uniqueId: "id" },
            betOriginURL: "origin/url",
          },
        },
        {
          pebbleCardGroupTitle: "pebbleCardGroup",
          cardGroupTitle: "pebbleCardGroup",
          tabName: "tab",
          horizontalPosition: 1,
          verticalPosition: 2,
          viewZoneTitle: "viewZoneTitle",
        },
        "id",
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipBetBuilderAddSelections");
    });
  });

  describe("when action type is UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS", () => {
    const state = {
      layouts: {
        views: {
          "current:view": "view",
        },
      },
      router: {
        currentUrn: "current:view",
      },
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn(() => state);
    });

    it("should send the correct gtm event", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS, undefined, {
        cardUrn: "card:urn",
        selection: { runnerUrn: "runner:urn", marketUrn: "market:urn" },
      });
      expect(getBetslipBetBuilderRemoveSelections).toHaveBeenCalledWith(
        state,
        {
          pebbleCardGroupTitle: "pebbleCardGroup",
          cardGroupTitle: "pebbleCardGroup",
          tabName: "tab",
          horizontalPosition: 1,
          verticalPosition: 2,
          viewZoneTitle: "viewZoneTitle",
        },
        {
          type: "BETSLIP/PP_BET_BUILDER_REMOVE_SELECTIONS",
          payload: {
            cardUrn: "card:urn",
            selection: { runnerUrn: "runner:urn", marketUrn: "market:urn" },
          },
        },
      );
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipBetBuilderRemoveSelections");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER", () => {
    const state = {
      betting: {
        sportsbookBetting: {
          legs: {
            legId1: "some leg",
          },
        },
      },
      entities: {
        competitions: "competitions",
        sportevents: "sportevents",
        sportsbookmarkets: null,
      },
      layouts: {
        views: "views",
        cards: "cards",
      },
      router: {
        currentUrn: "ppb:tbd:view:event:123",
      },
    };

    const sportsbookmarkets = {
      sport: "sport:urn",
      hierarchy: {
        sportevent: "sportevent:urn",
        competition: "competition:urn",
        marketId: 1,
        name: "Match Odds",
        inplay: false,
      },
    };

    const entities = {
      competitions: "competitions",
      sportevents: "sportevents",
      sportsbookmarkets,
    };

    const entitiesMarket = { ...entities, sportsbookmarkets: { ...sportsbookmarkets, name: "Match Odds" } };

    beforeEach(async () => {
      jest.clearAllMocks();
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn(() => state);
    });

    describe("when data is missing", () => {
      describe("when getSportsbookMarketByURN is null", () => {
        beforeEach(async () => {
          await setup(sendEvent, getState, UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER, undefined, {
            urn: "card:urn",
            runnerUrn: "runner:urn",
            url: "football/benfica-porto/e-123",
          });
        });

        it("should not call sendEvent", () => {
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });

      describe("without event name", () => {
        beforeEach(async () => {
          getState = jest.fn(() => ({ ...state, entities }));
          getSportEventByURN.mockReturnValue({});
          await setup(sendEvent, getState, UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER, undefined, {
            urn: "card:urn",
            runnerUrn: "runner:urn",
            url: "football/benfica-porto/e-123",
          });
        });

        it("should not call sendEvent", () => {
          expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sportevent:urn");
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });

    describe("when has correct data", () => {
      beforeEach(async () => {
        getSportEventByURN.mockReturnValue({ name: "benfica v porto" });
        getState = jest.fn(() => ({ ...state, entities: entitiesMarket }));
        await setup(sendEvent, getState, UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER, undefined, {
          urn: "card:urn",
          url: "football/benfica-porto/e-123",
        });
      });

      it("should send the correct gtm event", async () => {
        expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sportevent:urn");
        expect(getBetslipBetBuilderNavigateToEvent).toHaveBeenCalledWith(
          "benfica v porto",
          "VIEW_TYPE - primary swimlane - pebbleCardGroup | popular multiples title - Match Odds - tab",
          "football/benfica-porto/e-123",
        );
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipBetBuilderNavigateToEvent");
      });
    });
  });

  describe("when action type is UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER", () => {
    const state = {
      betting: {
        sportsbookBetting: {
          legs: {
            legId1: "some leg",
          },
        },
      },
      entities: {
        competitions: "competitions",
        sportevents: "sportevents",
        sportsbookmarkets: null,
      },
      layouts: {
        views: "views",
        cards: "cards",
      },
      router: {
        currentUrn: "ppb:tbd:view:event:123",
      },
    };

    const sportsbookmarkets = {
      sport: "sport:urn",
      hierarchy: {
        sportevent: "sportevent:urn",
        competition: "competition:urn",
        marketId: 1,
        name: "Match Odds",
        inplay: false,
      },
    };

    const entities = {
      competitions: "competitions",
      sportevents: "sportevents",
      sportsbookmarkets,
    };

    const entitiesMarket = { ...entities, sportsbookmarkets: { ...sportsbookmarkets, name: "Match Odds" } };

    beforeEach(async () => {
      jest.clearAllMocks();
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      getState = jest.fn(() => state);
    });

    describe("when data is missing", () => {
      describe("when getSportsbookMarketByURN is null", () => {
        beforeEach(async () => {
          await setup(sendEvent, getState, UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER, undefined, {
            urn: "card:urn",
            runnerUrn: "runner:urn",
            url: "football/benfica-porto/e-123?tabId=encodedBetBuilder",
          });
        });

        it("should not call sendEvent", () => {
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });

      describe("without event", () => {
        beforeEach(async () => {
          getState = jest.fn(() => ({ ...state, entities }));
          getSportEventByURN.mockReturnValue({});
          await setup(sendEvent, getState, UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER, undefined, {
            urn: "card:urn",
            runnerUrn: "runner:urn",
            url: "football/benfica-porto/e-123?tabId=encodedBetBuilder",
          });
        });

        it("should not call sendEvent", () => {
          expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sportevent:urn");
          expect(sendEvent).not.toHaveBeenCalled();
        });
      });
    });

    describe("when has correct data", () => {
      beforeEach(async () => {
        getSportEventByURN.mockReturnValue({ name: "benfica v porto" });
        getState = jest.fn(() => ({ ...state, entities: entitiesMarket }));
        await setup(sendEvent, getState, UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER, undefined, {
          urn: "card:urn",
          url: "football/benfica-porto/e-123?tabId=encodedBetBuilder",
        });
      });

      it("should send the correct gtm event", async () => {
        expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sportevent:urn");
        expect(getBetslipBetBuilderNavigateToEvent).toHaveBeenCalledWith(
          "build your own",
          "VIEW_TYPE - primary swimlane - pebbleCardGroup | null - Match Odds - tab",
          "football/benfica-porto/e-123?tabId=encodedBetBuilder",
        );
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith("getBetslipBetBuilderNavigateToEvent");
      });
    });
  });

  describe("when action type is UI__QUICK_LINK_CLICK", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      getLayoutMetadata.mockReturnValue({
        viewUrn: "ppb:tbd:view:sport:1",
        horizontalPosition: 2,
        verticalPosition: 2,
      });
    });

    it("should propagate action with correct values", async () => {
      getLinkClickEvent.mockReturnValue({
        mock: "getLinkClickEvent",
      });
      nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup(sendEvent, getState, UI__QUICK_LINK_CLICK, nextSpy, {
        url: "some url",
        label: "some text",
        cardUrn: "cardUrn",
      });

      expect(nextSpy).toHaveBeenCalledWith({
        type: UI__QUICK_LINK_CLICK,
        payload: {
          url: "some url",
          label: "some text",
          cardUrn: "cardUrn",
        },
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should send analytics event", async () => {
      getLinkClickEvent.mockReturnValue({
        mock: "getLinkClickEvent",
      });
      await setup(sendEvent, getState, UI__QUICK_LINK_CLICK, jest.fn(), {
        url: "some url",
        label: "some text",
        cardUrn: "cardUrn",
      });

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        mock: "getLinkClickEvent",
      });
    });

    describe("and the card urn is of a GenericViewLinkCard", () => {
      it("should call getLinkClickEvent with the expected values", async () => {
        getLinkClickEvent.mockReturnValue({
          mock: "getLinkClickEvent",
        });

        await setup(sendEvent, getState, UI__QUICK_LINK_CLICK, jest.fn(), {
          url: "some url",
          label: "some text",
          cardUrn: "ppb:tbd:card:genericViewLink:generic:some:value",
        });

        expect(getLinkClickEvent).toHaveBeenCalledTimes(1);
        expect(getLinkClickEvent).toHaveBeenCalledWith("some text", "VIEW_TYPE - popular - coupons", "some url", 2);
      });
    });

    describe("and the card urn isn't of a GenericViewLinkCard", () => {
      it("should call getLinkClickEvent with the expected values", async () => {
        getLinkClickEvent.mockReturnValue({
          mock: "getLinkClickEvent",
        });
        await setup(sendEvent, getState, UI__QUICK_LINK_CLICK, jest.fn(), {
          url: "some url",
          label: "some text",
          cardUrn: "cardUrn",
        });

        expect(getLinkClickEvent).toHaveBeenCalledTimes(1);
        expect(getLinkClickEvent).toHaveBeenCalledWith("some text", "VIEW_TYPE - quicklinks", "some url", 2);
      });
    });
  });

  describe("when action type is UI__STATISTICS_MODAL_TOGGLE", () => {
    it("should call getStatisticsModalToggleEvent with correct parameters and sendEvent", async () => {
      getLayoutMetadata.mockReturnValue({
        verticalPosition: 2,
      });

      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__STATISTICS_MODAL_TOGGLE,
        undefined,
        {
          cardUrn: "card:urn",
          label: "statistics",
          isOpen: true,
        },
      );

      expect(getStatisticsModalToggleEvent).toHaveBeenCalledWith("VIEW_TYPE", 2, "statistics", true);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getStatisticsModalToggleEvent");
    });
  });

  describe("when action type is UI__STATISTICS_ITEM_CLICK", () => {
    it("should call getStatisticsItemClickEvent with correct parameters and sendEvent", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
          router: { currentUrn: "currentViewUrn" },
        }),
        UI__STATISTICS_ITEM_CLICK,
        undefined,
        {
          label: "statistics",
        },
      );

      expect(getStatisticsItemClickEvent).toHaveBeenCalledWith("statistics");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getStatisticsItemClickEvent");
    });
  });

  describe("when action type is UI__CLOSED_SBK_CLICK", () => {
    it("should call getStatisticsItemClickEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__CLOSED_SBK_CLICK, undefined);

      expect(getMarketSnackBarEvent).toHaveBeenCalledWith("closed");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMarketSnackBarEvent");
    });
  });

  describe("when action type is UI__SUSPENDED_SBK_CLICK", () => {
    it("should call getStatisticsItemClickEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__SUSPENDED_SBK_CLICK, undefined);

      expect(getMarketSnackBarEvent).toHaveBeenCalledWith("suspended");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMarketSnackBarEvent");
    });
  });

  describe("when action type is UI__AZ_SWITCH_CLICK", () => {
    it("should call getAzSwitchToggleEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__AZ_SWITCH_CLICK, undefined, {
        label: "label",
        isToggleOn: true,
      });

      expect(getAzSwitchToggleEvent).toHaveBeenCalledWith("label", true);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getAzSwitchToggleEvent");
    });
  });

  describe("when action type is UI__MY_BETS_ORDER_TYPE_FILTER_CLICK", () => {
    it("should call getMyBetsOrderTypePressEvent with correct parameters and sendEvent", async () => {
      await setup(sendEvent, getState, UI__MY_BETS_ORDER_TYPE_FILTER_CLICK, undefined, {
        filter: {
          productType: "productType",
          orderType: "orderType",
        },
      });

      expect(getMyBetsOrderTypePressEvent).toHaveBeenCalledWith("productType", "orderType", "my bets");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsOrderTypePressEvent");
    });
  });

  describe("when action type is UI__PROMO_DESCRIPTION_TOGGLE", () => {
    it("should call getPromoDescriptionToggleEvent with correct parameters and sendEvent", async () => {
      await setup(
        sendEvent,
        () => ({
          layouts: { views: "views" },
        }),
        UI__PROMO_DESCRIPTION_TOGGLE,
        undefined,
        {
          title: "extra places",
          isOpen: true,
        },
      );

      expect(getPromoDescriptionToggleEvent).toHaveBeenCalledWith("VIEW_TYPE", "marketcard", "extra places info", true);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getPromoDescriptionToggleEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK);
    });
    it("should send a getBetslipSportsbookLoginToPlaceBetClickEvent event", () => {
      expect(getBetslipSportsbookLoginToPlaceBetClickEvent).toHaveBeenCalledWith();
      expect(getBetslipSportsbookLoginToPlaceBetClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipSportsbookLoginToPlaceBetClickEvent");
    });
  });

  describe("when action type is UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK, undefined, {
        side: "lay",
      });
    });

    it("should send a getBetslipExchangeLoginToPlaceBetClickEvent event", () => {
      expect(getBetslipExchangeLoginToPlaceBetClickEvent).toHaveBeenCalledWith("lay");
      expect(getBetslipExchangeLoginToPlaceBetClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetslipExchangeLoginToPlaceBetClickEvent");
    });
  });

  describe("when action type is UI__MY_BETS_ON_ACCORDION_TOGGLE", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__MY_BETS_ON_ACCORDION_TOGGLE, undefined, { isExpanded: true });
    });
    it("should send a getToggleAccordionEvent event", () => {
      expect(getToggleAccordionEvent).toHaveBeenCalledWith("my bets", true);
      expect(getToggleAccordionEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getToggleAccordionEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY);
    });

    it("should send a getCopyBetIdToClipboardEvent event", () => {
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledTimes(1);
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledWith("bet receipt");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCopyBetIdToClipboardEvent");
    });
  });

  describe("when action type is UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY);
    });

    it("should send a getCopyBetIdToClipboardEvent event", () => {
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledTimes(1);
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledWith("bet receipt");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCopyBetIdToClipboardEvent");
    });
  });

  describe("when action type is UI__MY_BETS_COPY_BET_ID", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__MY_BETS_COPY_BET_ID);
    });

    it("should send a getCopyBetIdToClipboardEvent event", () => {
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledTimes(1);
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledWith(MY_BETS_MODULE_NAME);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCopyBetIdToClipboardEvent");
    });
  });

  describe("when action type is UI__MY_BETS_COPY_REGULATOR_BET_ID", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__MY_BETS_COPY_REGULATOR_BET_ID);
    });

    it("should send a getCopyBetIdToClipboardEvent event", () => {
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledTimes(1);
      expect(getCopyBetIdToClipboardEvent).toHaveBeenCalledWith(MY_BETS_MODULE_NAME);
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getCopyBetIdToClipboardEvent");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_MOBILE_WEB", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__NAVIGATE_TO_MOBILE_WEB, undefined, { label: "mobile web", url: "test.com" });
    });

    it("should send a getNavigateToMobileWebEvent event", () => {
      expect(getNavigateToMobileWebEvent).toHaveBeenCalledWith("mobile web", "test.com");
      expect(getNavigateToMobileWebEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getNavigateToMobileWebEvent");
    });
  });

  describe("when action type is UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED", () => {
    const urn = { marketUrn: "market:urn" };
    const state = { state: "mock" };
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED, undefined, urn);
    });

    it("should send a getRaceReplaysMediaPlayerEvent event", () => {
      expect(getRaceReplaysMediaPlayerEvent).toHaveBeenCalledWith(state, "race replay", urn.marketUrn);
      expect(getRaceReplaysMediaPlayerEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__RACE_REPLAYS_TOGGLE", () => {
    const cardUrn = "card:urn";
    const state = { state: "mock" };
    const selection = "horseName";
    const label = `recent races video - ${selection}`;
    const isClosed = true;
    const pageType = "VIEW_TYPE";
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__RACE_REPLAYS_TOGGLE, undefined, {
        selection,
        isClosed,
        cardUrn,
      });
    });

    it("should send a getRaceReplaysToggleEvent event", () => {
      expect(getRaceReplaysToggleEvent).toHaveBeenCalledWith(state, pageType, cardUrn, isClosed, label);
      expect(getRaceReplaysToggleEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED", () => {
    it("should send a getMaxPayoutAcceptMessageClickEvent event", async () => {
      await setup(sendEvent, getState, UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED, undefined);

      expect(getMaxPayoutAcceptMessageClickEvent).toHaveBeenCalled();
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMaxPayoutAcceptMessageClickEvent");
    });
  });

  describe("when action type is UI__MY_BETS_EXC_ORDER_STATUS_SWITCH", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, UI__MY_BETS_EXC_ORDER_STATUS_SWITCH, undefined, {
        orderStatusFilterLabel: "unmatched-mock",
      });
    });

    it("should send a getMyBetsExchangeOrderStatusClickEvent event", () => {
      expect(getMyBetsExchangeOrderStatusClickEvent).toHaveBeenCalledWith("unmatched-mock", "my bets");
      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getMyBetsExchangeOrderStatusClickEvent");
    });
  });

  describe("when action type is PN_SUBSCRIBE_EVENTS", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, PN_SUBSCRIBE_EVENTS);
    });
    it("should send a getBetReceiptToggleClickEvent event", () => {
      expect(getBetReceiptToggleClickEvent).toHaveBeenCalledWith(true);
      expect(getBetReceiptToggleClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetReceiptToggleClickEvent");
    });
  });

  describe("when action type is PN_UNSUBSCRIBE_EVENTS", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, PN_UNSUBSCRIBE_EVENTS);
    });
    it("should send a getBetReceiptToggleClickEvent event", () => {
      expect(getBetReceiptToggleClickEvent).toHaveBeenCalledWith(false);
      expect(getBetReceiptToggleClickEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetReceiptToggleClickEvent");
    });
  });

  describe("when action type is PN_SUBSCRIBE_EVENTS_SUCCESS", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, PN_SUBSCRIBE_EVENTS_SUCCESS);
    });
    it("should send a getBetReceiptSuccessMessageSaw event", () => {
      expect(getBetReceiptSuccessMessageSaw).toHaveBeenCalledWith("enabled live alerts");
      expect(getBetReceiptSuccessMessageSaw).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetReceiptSuccessMessageSaw");
    });
  });

  describe("when action type is PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS);
    });
    it("should send a getBetReceiptSuccessMessageSaw event", () => {
      expect(getBetReceiptSuccessMessageSaw).toHaveBeenCalledWith("partial live alerts");
      expect(getBetReceiptSuccessMessageSaw).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetReceiptSuccessMessageSaw");
    });
  });

  describe("when action type is PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS", () => {
    beforeEach(async () => {
      await setup(sendEvent, getState, PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS);
    });
    it("should send a getBetReceiptSuccessMessageSaw event", () => {
      expect(getBetReceiptSuccessMessageSaw).toHaveBeenCalledWith("there are no notifications available");
      expect(getBetReceiptSuccessMessageSaw).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("getBetReceiptSuccessMessageSaw");
    });
  });
});
