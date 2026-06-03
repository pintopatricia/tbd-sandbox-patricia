import { Middleware } from "redux";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import {
  CancelBet,
  ClickEdit,
  EditSuccessfull,
  MyBetsEditClick,
  PriceChange,
  UpdateBet,
} from "../state/tagging/Betting.types";
import { NavigateFromUserProfileLink, SettingsTabsNavigation } from "../state/tagging/Interface.types";
import URN from "../state/layout/URN";
import { PopularMultiplesBetBuilderCards } from "../state/layout/cards/Card.types";
import { SportsbookMarket, ExchangeMarket } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import { Product } from "../state/entities/user-preferences/UserPreferences.types";
import { EXTERNAL_PUSH, ExternalPushAction, BOTTOM_BAR_PUSH, BottomBarPushAction } from "../actions/router";
import {
  BetslipAccordionHeaderClick,
  BetslipExchangeBonusChangeAction,
  BetslipExchangeConfirmBetsClickAction,
  BetslipExchangeIncrementSizeAction,
  BetslipExchangeLoginToPlaceBetClickAction,
  BetslipExchangeMatchedPanelDoneClickAction,
  BetslipExchangePlaceBetClickAction,
  BetslipExchangePriceNudgeDownClickAction,
  BetslipExchangePriceNudgeUpClickAction,
  BetslipExchangeRemovePotentialBetClickAction,
  BetslipExchangeReportBetEditClickAction,
  BetslipExchangeUnmatchedCancelClickAction,
  BetslipExchangeUnmatchedDoneClickAction,
  BetslipExchangeUnmatchedPersistenceItemClickAction,
  BetslipExchangeUnmatchedPersistenceListClickAction,
  BetslipExchangeUnmatchedPriceInputChangeAction,
  BetslipExchangeUnmatchedPriceNudgeDownClickAction,
  BetslipExchangeUnmatchedPriceNudgeUpClickAction,
  BetslipExchangeUnmatchedUpdateClickAction,
  BetslipHeaderClickAction,
  BetslipSportsbookIncrementStakeAction,
  BetslipSportsbookLoginToPlaceBetClickAction,
  BetslipSportsbookMultipleBetTypeClick,
  BetslipSportsbookPlaceBetsClick,
  BetslipSportsbookRemoveLegClick,
  BetslipSportsbookRemoveSelectionsClick,
  BetslipSportsbookEachWayToggleAction,
  BetslipSportsbookCastBetChange,
  BetslipSportsbookCastBetOrderChange,
  BetslipSportsbookAccaInsuranceToggleAction,
  BetslipSportsbookPriceBoostToggleAction,
  BetslipSportsbookReAddSelectionsClickAction,
  BetslipSportsbookNotificationShownAction,
  CancelExchangeBetFailureAction,
  CancelExchangeBetSuccessAction,
  NETWORK__CANCEL_EXC_BET_FAILURE,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__PLACE_EXC_BET_FAILURE,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_FAILURE,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  PlaceExchangeBetFailureAction,
  PlaceExchangeBetSuccessAction,
  PlaceSportsbookBetFailureAction,
  PlaceSportsbookBetSuccessAction,
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_EXC_BONUS_CHANGE,
  UI__BETSLIP_EXC_CONFIRM_BET_CLICK,
  UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
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
  UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_HEADER_CLICK,
  UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
  UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK,
  UI__BETSLIP_SBK_PLACE_BETS_CLICK,
  UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
  UI__BETSLIP_SBK_REMOVE_SELECTIONS,
  UI__BETSLIP_SBK_EACH_WAY_TOGGLE,
  UI__BETSLIP_SBK_CAST_BET_CHANGE,
  UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE,
  UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE,
  UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
  UI__BETSLIP_SBK_NOTIFICATION_SHOWN,
  UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
  UpdateExchangeBetFailureAction,
  UpdateExchangeBetSuccessAction,
  UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
  BetslipBetBuilderAddSelectionsAction,
  BetslipBetBuilderRemoveSelectionsAction,
  UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS,
  UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
  BetslipSportsbookMaxPayoutNotificationUrlClickAction,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  BetslipMaxPayoutNotificationAcceptedAction,
  UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
  UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
  BetslipSportsbookReceiptBetIdCopyAction,
  BetslipSportsbookReceiptRegulatorBetIdCopyAction,
} from "../actions/betslip";
import {
  BETTING__SBK_BONUS_TOGGLE_ACTION,
  BETTING__SBK_PLACE_FAILED_UPDATE,
  BettingSportsbookBonusToggleAction,
  BettingSportsbookPlaceFailedUpdateAction,
  MarketExchangeBetButtonClickAction,
  MarketSportsbookBetButtonClickAction,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "../actions/betting";
import {
  SearchAzLinkClickAction,
  SearchBarFocusAction,
  SearchCancelAction,
  SearchClearResultsAction,
  SearchLinkClickAction,
  SearchTabClickAction,
  UI__CLEAR_SEARCH_RESULTS,
  UI__SEARCH_AZ_LINK_CLICK,
  UI__SEARCH_BAR_FOCUS,
  UI__SEARCH_BAR_LINK_CLICK,
  UI__SEARCH_CANCEL_CLICK,
  UI__SEARCH_LINK_CLICK,
  UI__SEARCH_TAB_CLICK,
} from "../actions/browse";
import {
  UPDATE_MARKET_DEPTH,
  UpdateMarketDepth,
  UI__SWITCH_PRODUCT_PREFERENCE,
  SwitchProductPreferenceAction,
} from "../actions/preferences";
import {
  MarketGraphSelectGraphAction,
  MarketGraphSelectViewAction,
  MarketRulesModalToggleAction,
  MarketSwitchAction,
  PebbleItemSelectionAction,
  MyAccountIconClickAction,
  NavigationTabClickAction,
  PromotionCallToActionClickAction,
  PromotionTermsAndConditionsClickAction,
  ToggleRunnerInfo,
  ToggleRunnerInfoTabs,
  ToggleExpandableCardGroupAction,
  JackpotMerchandiseView,
  FilterOpenAction,
  FilterCloseAction,
  FilterApplyAction,
  FilterResetClickAction,
  UI__CLICK_MARKET_GRAPH_MODE_SELECTOR,
  UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR,
  UI__CLICK_PEBBLE_ITEM,
  UI__CLICK_PROMOTION_CALL_TO_ACTION,
  UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS,
  UI__MARKET_RULES_MODAL_TOGGLE,
  UI__MARKET_SWITCH_CLICK,
  UI__MY_ACCOUNT_ICON_CLICK,
  UI__NAVIGATION_TAB_CLICK,
  UI__TOGGLE_RUNNER_INFO,
  UI__TOGGLE_RUNNER_INFO_TABS,
  UI__USER_LOGOUT_CLICK,
  UI__JACKPOT_MERCHANDISE_VIEW,
  UserLogoutClickAction,
  ToggleTimeformCard,
  UI__TOGGLE_TIMEFORM_CARD,
  SwitcherOpen,
  UI__SWITCHER_OPEN,
  UI__FILTER_OPEN,
  UI__FILTER_CLOSE,
  UI__FILTER_APPLY,
  UI__FILTERS_RESET_CLICK,
  SawCardAction,
  SAW_CARD,
  UI__TOGGLE_EXPANDABLE_CARDGROUP,
  UI__GRAPH_TOGGLE,
  ToggleGraphAction,
  UI__RECENT_RACE_TOGGLE,
  ToggleRecentRaceAction,
  UI__TOGGLE_SHOW_MORE_RUNNERS,
  ToggleShowMoreRunnersAction,
  UI__MARKET_BLURB_EXPAND_CLICK,
  ToggleMarketBlurbExpandClick,
  NextRacesRaceClick,
  UI__NEXT_RACES_RACE_CLICK,
  UI__STATISTICS_MODAL_TOGGLE,
  StatisticsModalToggleAction,
  StatisticsItemClickAction,
  UI__STATISTICS_ITEM_CLICK,
  UI__NEXT_RACES_RACE_FILTER_CLICK,
  NextRacesFilterClickAction,
  AzSwitchClickAction,
  UI__AZ_SWITCH_CLICK,
  UI__PROMO_DESCRIPTION_TOGGLE,
  PromoDescriptionToggleAction,
  UI__RACE_REPLAYS_TOGGLE,
  RaceReplaysToggleAction,
  UI__CONTENT_SUMMARY_COLLAPSE_EVENT,
  ContentSummaryCollapseEvent,
} from "../actions/interface";
import {
  BroadcastsCardToggleAction,
  MediaPlayerLoadedAction,
  TimeFormBroadCastsCardToggleAction,
  TimeFormBroadCastsCardMediaPlayerAction,
  UI__BROADCASTS_CARD_TOGGLE,
  UI__MEDIA_PLAYER_LOADED,
  UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT,
  UI__TIME_FORM_BROADCASTS_CARD_TOGGLE,
  UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE,
  BroadcastsAndStatisticsCardToggleAction,
  UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED,
  BroadcastsAndStatisticsCardMediaPlayerLoadedAction,
  UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED,
  RaceReplaysMediaPlayerLoadedAction,
} from "../actions/media";
import {
  BackButtonClickAction,
  BottomBarClickAction,
  FooterLinkClickAction,
  LaunchGame,
  LaunchGameFromGameInfoPage,
  LogoClickAction,
  NavigateFromContentSummaryLinkAction,
  NavigateToAllCompetitionsViewFromQuickLink,
  NavigateToAllMarketsFromAllMarketsLink,
  NavigateToCategoryUsingMultifunctional,
  NavigateToCategoryUsingSeeAllButton,
  NavigateToCompetitionView,
  NavigateToDiscountRateExplained,
  NavigateToEventFromMarket,
  NavigateToEventFromMarketScoreboard,
  NavigateToEventFromSport,
  NavigateToGameCategoryView,
  NavigateToGameInfoView,
  NavigateToMarketView,
  NavigateToRaceFromMarket,
  NavigateToView,
  NavigateToSwitcherOptionClick,
  RaceViewLinksLinkClick,
  LoadPlayNew,
  PlayNewClickToMoreInfoButtonAction,
  PlayNewClickToPlayNowButtonAction,
  CardGroupViewAllLinkTapAction,
  NavigateToSeeAllPromotions,
  NotFoundViewLoadedAction,
  UI__BACK_BUTTON_CLICK,
  UI__BOTTOM_BAR_CLICK,
  UI__CARDGROUP_VIEW_ALL_LINK_TAP,
  UI__CLICK_ALLMARKETS_LINK,
  UI__FOOTER_LINK_CLICK,
  UI__LAUNCH_GAME,
  UI__LAUNCH_GAME_FROM_GAME_INFO,
  UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK,
  UI__PLAY_NEW_LOADED,
  UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK,
  UI__LOGO_CLICK,
  UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK,
  UI__NAVIGATE_TO_COMPETITION_VIEW,
  UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED,
  UI__NAVIGATE_TO_EVENT_FROM_MARKET,
  UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD,
  UI__NAVIGATE_TO_EVENT_FROM_SPORT,
  UI__NAVIGATE_TO_GAME_INFO_VIEW,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON,
  UI__NAVIGATE_TO_MARKET_VIEW,
  UI__NAVIGATE_TO_RACE_FROM_MARKET,
  UI__NAVIGATE_TO_VIEW,
  UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK,
  UI__TAP_ALL_COMPETITIONS_LINK,
  UI__RACE_VIEW_LINKS_LINK_CLICK,
  UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS,
  UI__NOT_FOUND_VIEW_LOADED,
  UI__NAVIGATE_FROM_NOT_FOUND_VIEW,
  NavigateFromNotFoundViewAction,
  UI_NAVIGATE_VIEW_FROM_FAVOURITES,
  NavigateViewFromFavouritesClick,
  UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET,
  CouponPrimaryMarketPress,
  UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER,
  BetslipBetBuilderNavigateToEventAction,
  UI__QUICK_LINK_CLICK,
  QuickLinkClickAction,
  UI__NAVIGATE_TO_MOBILE_WEB,
  NavigateToMobileWeb,
  UI__NAVIGATE_TO_FAQ_PAGE,
  MarketBlurbFAQAction,
  UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER,
  PopularBetBuilderNavigateToBetBuilderAction,
} from "../actions/navigation";
import {
  UI__USER_PROFILE_BUDGET_LINK_CLICK,
  UI__USER_PROFILE_EYE_ICON_CLICK,
  UI__USER_PROFILE_MENU_LINK_CLICK,
  UI__USER_PROFILE_QUICK_LINK_CLICK,
  UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK,
  UserProfileBudgetLinkClickAction,
  UserProfileMenuEyeIconClickAction,
  UserProfileMenuLinkClickAction,
  UserProfileQuickLinkClickAction,
  UserProfileToggleCashBalancesViewClickAction,
} from "../actions/user-profile";
import {
  CashoutButtonTapAction,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  NETWORK__CASHOUT_TAKE_FAILURE,
  TakeCashoutFailureAction,
  TakeCashoutSuccessAction,
  UI__CASHOUT_BUTTON_TAP,
  NETWORK__CASHOUT_TAKE_FAILURE_SBK,
  TakeCashoutFailureSbkAction,
} from "../actions/cashout";
import {
  ACCEPT_PROMOTION,
  AcceptPromotion,
  INTERACT_CANCEL_PROMOTION_MODAL,
  InteractCancelPromotionModal,
  REFRESH_PROMOTION,
  RefreshPromotion,
} from "../actions/promotion";
import { getCompetitionByURN } from "../state/entities/competitions/competition-selectors";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import {
  createViewTypeSelector,
  createCardParentTitlesByURNSelector,
  isDesktopAppKeyTypeSelector,
} from "../state/layout/layout-selectors";
import { getSportEventByURN } from "../state/entities/sport-events/sport-event-selectors";
import { getSportByURN } from "../state/entities/sports/sport-selectors";
import { getSportsbookBettingCombinations } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createSportsbookMarketByURNSelector } from "../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { getViewbyURN } from "../state/layout/views/event-view/event-view-selectors";
import { getBetslipExchangeContext, getBetslipVisibilityState } from "../state/betslip/betslip-card-selectors";
import { SettingsNavigationAction, UI__SETTINGS_TABS_CLICK } from "../actions/settings-page";
import { isRaceHierarchy, isCompetitionEventHierarchy, isEventHierarchy } from "../helpers/markets";
import {
  getBetslipDeeplinkEvent,
  getBackButtonClickEvent,
  getContentSummaryCollapseEvent,
  getExchangeSuccessPlaceBetSelectionEvent,
  getGameLaunchFromGameInfoEvent,
  getRaceViewLinksLinkClickEvent,
  getDontUpdateBetClickEvent,
  getOpenPersistenceTypeMenuEvent,
  getUpdateBetClickEvent,
  getCancelBetClickEvent,
  getChangePersistenceTypeClickEvent,
  getPlaceExchangeBetClickEvent,
  getPlaceSportsbookBetClickEvent,
  getAutoConfirmSportsbookBetClickEvent,
  getBetReceiptExchangeDoneClickEvent,
  getMarketSwitchEvent,
  getMyAccountMenuToggleEvent,
  getLogoutClickEvent,
  getOpenBetslipEvent,
  getNavigateToView,
  getBetslipExchangeRemoveSelectionEvent,
  getBetslipSportsbookRemoveSelectionEvent,
  getExchangeAddSelectionToBetslip,
  getSportsbookAddSelectionToBetslip,
  getSearchLinkClickEvent,
  getSearchAzLinkClickEvent,
  getLinkClickEvent,
  getSbkIncrementStakeEvent,
  getExcIncrementSizeEvent,
  getExchangeOnClickEdit,
  getExchangeBetEditSuccessfull,
  getExchangePriceChangeEvent,
  getNavigateToMarketViewEvent,
  getNavigateToGameCategoryEvent,
  getNavigateToGameInfoEvent,
  getMarketRulesToggleModalEvent,
  getMarketRulesLinkClickEvent,
  getAllMarketsLinkClickEvent,
  getSeeAllLinkClickEvent,
  getCategoryFromMultifunctionalClickEvent,
  getGameTileClickEvent,
  loadPlayNew,
  getMoreInfoPlayNewClickEvent,
  getPlayNowPlayNewClickEvent,
  getExchangeFailedPlaceBetEvent,
  getSportsbookFailedPlaceBetEvent,
  getCompetitionLinkClickEvent,
  getAllCompetitionsLinkClickEvent,
  getMarketGraphSelectViewEvent,
  getMarketGraphSelectGraphEvent,
  getExchangeSuccessPlaceBetEvent,
  getSportsbookSuccessPlaceBetsEvent,
  getSportsbookSuccessPlaceSelectionsEvent,
  getExchangeAutoConfirmedBetClickEvent,
  getExchangeConfirmBetClickEvent,
  getMarketDepthClickEvent,
  getBottomBarClickEvent,
  getMyAccountEyeIconEvent,
  getMyAccountToggleCashBalancesViewEvent,
  getMarketTemplatePebbleSelectionEvent,
  getBetslipHeaderClickEvent,
  getBetslipAccordionHeaderClickEvent,
  getBetslipSportsbookMultipleBetTypeClickEvent,
  getBetslipSbkRemoveAllEvent,
  getPromotionClickEvent,
  getSearchBarFocusEvent,
  getSearchCancelClickEvent,
  getToggleRunnerInfoEvent,
  getToggleRunnerInfoTabsEvent,
  getToggleExpandableCardGroupEvent,
  getSearchClearClickEvent,
  getSearchTabClickEvent,
  getBetslipBonusActivationEvent,
  getSettingsTabSelectEvent,
  getJackpotMerchandiseViewEvent,
  getBroadcastsToggleEvent,
  getTimeFormBroadCastsToggleEvent,
  getMediaPlayerLoadedEvent,
  getTimeFormBroadCastsMediaPlayerEvent,
  getBetslipEachWayToggleEvent,
  getBetslipAccaInsuranceToggleEvent,
  getBetslipMyOddsBoostToggleEvent,
  getBetslipCastBetChangeEvent,
  getBetslipCastBetOrderChangeEvent,
  getBetslipSbkReAddSelectionsEvent,
  getBetslipSbkNotificationShownEvent,
  getBetslipSbkMaxPayoutNotificationUrlClickEvent,
  getToggleTimeFormEvent,
  getSwitcherEvent,
  getNavigationTabClickEvent,
  getViewAllTapEvent,
  getViewFromFavouritesClickEvent,
  getMyAccountQuickLinkEvent,
  getMyAccountMenuLinkEvent,
  getAcceptPromotionEvent,
  getCancelPromotionEvent,
  getNavigationSeeAllPromotionsEvent,
  getNavigateToEvent,
  getNavigateToEventFromSport,
  getLoadedNotFoundView,
  getNavigateFromNotFoundView,
  getBetslipCancelBetClickEvent,
  getMyBetsEditClickEvent,
  getMyBetsEditBottomSheetCloseEvent,
  getCashoutClickEvent,
  getCashoutFailureEvent,
  getCashoutSuccessEvent,
  getAutoConfirmCashoutClickEvent,
  getFilterOpenEvent,
  getFilterCloseEvent,
  getFilterApplyEvent,
  getFilterResetClickEvent,
  getSawCardEvent,
  getSwitchProductEvent,
  getMyBetsCancelAllEvent,
  getPNInteractionClickEvent,
  getCouponViewCardClickEvent,
  getToggleMarketGraphEvent,
  getToggleRecentRacesEvent,
  getToggleShowMoreEvent,
  getBetslipBetBuilderAddSelections,
  getBetslipBetBuilderNavigateToEvent,
  getBetslipBetBuilderRemoveSelections,
  getNextRacesRaceClickEvent,
  getStatisticsModalToggleEvent,
  getStatisticsItemClickEvent,
  getNextRacesFilterClickEvent,
  getBroadcastsAndStatisticsToggleEvent,
  getBroadcastsAndStatisticsCardMediaPlayerEvent,
  getMarketSnackBarEvent,
  getAzSwitchToggleEvent,
  getMyBetsOrderTypePressEvent,
  getPromoDescriptionToggleEvent,
  getBetslipSportsbookLoginToPlaceBetClickEvent,
  getBetslipExchangeLoginToPlaceBetClickEvent,
  getToggleAccordionEvent,
  getCopyBetIdToClipboardEvent,
  getNavigateToMobileWebEvent,
  getMarketBlurbExpandableEvent,
  getMarketBlurbFAQEvent,
  getRaceReplaysToggleEvent,
  getRaceReplaysMediaPlayerEvent,
  getMaxPayoutAcceptMessageClickEvent,
  getMyBetsExchangeOrderStatusClickEvent,
  getMyBetsSbkAddPreviousSelectionsEvent,
  getMyBetsBetSharingPreviewOnTapEvent,
  getMyBetsBetSharingDismissOnTapEvent,
  getMyBetsBetSharingShareBetOnTapEvent,
  getMyBetsBetSharingShareImageOnTapEvent,
  getMyBetsAccaFreezeOpenedEvent,
  getMyBetsAccaFreezeClosedEvent,
  getBetMutationAccaFreezeSelectedEvent,
  getBetMutationAccaFreezeDeselectedEvent,
  getBetMutationAccaFreezeConfirmEvent,
  getBetReceiptToggleClickEvent,
  getBetReceiptSuccessMessageSaw,
  getUpdateBetFailureEvent,
} from "./tagging-resolvers";
import { createRaceByURNSelector } from "../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../state/entities/meetings/meeting-selectors";
import {
  MyBetsCancelAllExchangeBetFailureAction,
  MyBetsCancelAllExchangeBetsSuccessAction,
  MyBetsCancelExchangeBetFailureAction,
  MyBetsCancelExchangeBetSuccessAction,
  MyBetsCopyBetId,
  MyBetsCopyRegulatorBetId,
  MyBetsExchangeBetEditPressAction,
  MyBetsExchangeBetEditCloseAction,
  MyBetsOnCancelAllPressAction,
  MyBetsOrderTypeFilterClick,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
  UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
  UI__MY_BETS_EXC_EDIT_BET_PRESS,
  UI__MY_BETS_EXC_EDIT_BET_CLOSE,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  UI__MY_BETS_ON_ACCORDION_TOGGLE,
  UI__MY_BETS_EXC_ORDER_STATUS_SWITCH,
  MyBetsOnAccordionToggle,
  MyBetsExchangeOrderStatusSwitch,
  UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
  MyBetsSportsbookAddPreviousSelectionsClickAction,
  UI__MY_BETS_BET_SHARING_DISMISS_TAP,
  UI__MY_BETS_BET_SHARING_PREVIEW_TAP,
  MyBetsBetSharingPreviewTapAction,
  MyBetsBetSharingDismissTapAction,
  UI__MY_BETS_BET_SHARING_SHARE_BET_TAP,
  UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP,
  UI__MY_BETS_ACCA_FREEZE_OPENED,
  UI__MY_BETS_ACCA_FREEZE_CLOSED,
  MyBetsBetSharingShareBetTapAction,
  MyBetsAccaFreezeOpenedAction,
  MyBetsAccaFreezeClosedAction,
  MyBetsBetSharingShareImageTapAction,
} from "../actions/my-bets";
import {
  UI__BET_MUTATION_ACCA_FREEZE_SELECTED,
  BetMutationAccaFreezeSelectedAction,
  UI__BET_MUTATION_ACCA_FREEZE_DESELECTED,
  BetMutationAccaFreezeDeselectedAction,
  NETWORK__FREEZE_BET,
  FreezeLegAction,
} from "../actions/bet-mutation";
import { createGetHydratedPebbleCardGroupByURNSelector } from "../state/layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";
import {
  ClosedSbkBetButtonCLickAction,
  SuspendedSbkBetButtonCLickAction,
  UI__CLOSED_SBK_CLICK,
  UI__SUSPENDED_SBK_CLICK,
} from "../actions/sportsbook-markets";
import { createGetCouponCardGroupParentTitlesSelector } from "../state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors";
import { createCardByURNSelector } from "../state/layout/cards/cards-selectors";
import { MY_BETS_MODULE_NAME } from "../state/layout/cards/MyBets.types";

import {
  PNInteraction,
  PNPartialSubscribeEventsSuccessAction,
  PNSubscribeEventsAction,
  PNSubscribeEventsSuccessAction,
  PNUnsubscribeEventsAction,
  PNUnsupportedSubscribeEventsSuccessAction,
  PN_INTERACTION_EVENT,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_SUBSCRIBE_EVENTS,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
} from "../actions/push-notifications";
import { GenericEvent } from "./tagging-resolvers/Event.types";
import { TaggingAction } from "./tagging-resolvers/AnalyticsConstants";
import { FootballMatchStatus } from "../state/constants";
import { URL__BETSLIP_DEEPLINK, URLBetslipDeeplinkAction } from "../actions/commands";
import { getLayoutMetadata } from "../state/layout-snapshot";
import { getGameByURN } from "../state/entities/games/game-selectors";
import { createGetGamingSearchInputSelector } from "../state/layout/views/browse-view/browse-view-selectors";
import { LoadedPageContent } from "../actions/game-interactions";

type ActionTypes =
  | AcceptPromotion
  | AzSwitchClickAction
  | BackButtonClickAction
  | BettingSportsbookBonusToggleAction
  | BettingSportsbookPlaceFailedUpdateAction
  | BetslipAccordionHeaderClick
  | BetslipBetBuilderAddSelectionsAction
  | BetslipBetBuilderNavigateToEventAction
  | BetslipBetBuilderRemoveSelectionsAction
  | BetslipExchangeBonusChangeAction
  | BetslipExchangeConfirmBetsClickAction
  | BetslipExchangeLoginToPlaceBetClickAction
  | BetslipExchangeIncrementSizeAction
  | BetslipExchangeMatchedPanelDoneClickAction
  | BetslipExchangePlaceBetClickAction
  | BetslipExchangePriceNudgeDownClickAction
  | BetslipExchangePriceNudgeUpClickAction
  | BetslipExchangeReportBetEditClickAction
  | BetslipExchangeRemovePotentialBetClickAction
  | BetslipExchangeUnmatchedCancelClickAction
  | BetslipExchangeUnmatchedDoneClickAction
  | BetslipExchangeUnmatchedPersistenceItemClickAction
  | BetslipExchangeUnmatchedPersistenceListClickAction
  | BetslipExchangeUnmatchedPriceInputChangeAction
  | BetslipExchangeUnmatchedPriceNudgeDownClickAction
  | BetslipExchangeUnmatchedPriceNudgeUpClickAction
  | BetslipExchangeUnmatchedUpdateClickAction
  | BetslipHeaderClickAction
  | BetslipMaxPayoutNotificationAcceptedAction
  | BetslipSportsbookAccaInsuranceToggleAction
  | BetslipSportsbookCastBetChange
  | BetslipSportsbookCastBetOrderChange
  | BetslipSportsbookEachWayToggleAction
  | BetslipSportsbookIncrementStakeAction
  | BetslipSportsbookLoginToPlaceBetClickAction
  | BetslipSportsbookNotificationShownAction
  | BetslipSportsbookMultipleBetTypeClick
  | BetslipSportsbookPlaceBetsClick
  | BetslipSportsbookPriceBoostToggleAction
  | BetslipSportsbookMaxPayoutNotificationUrlClickAction
  | BetslipSportsbookReAddSelectionsClickAction
  | BetslipSportsbookReceiptBetIdCopyAction
  | BetslipSportsbookReceiptRegulatorBetIdCopyAction
  | BetslipSportsbookRemoveLegClick
  | BetslipSportsbookRemoveSelectionsClick
  | BottomBarClickAction
  | BottomBarPushAction
  | BroadcastsAndStatisticsCardMediaPlayerLoadedAction
  | BroadcastsAndStatisticsCardToggleAction
  | BroadcastsCardToggleAction
  | CancelExchangeBetFailureAction
  | CancelExchangeBetSuccessAction
  | CardGroupViewAllLinkTapAction
  | CashoutButtonTapAction
  | ClosedSbkBetButtonCLickAction
  | ContentSummaryCollapseEvent
  | CouponPrimaryMarketPress
  | ExternalPushAction
  | FilterApplyAction
  | FilterCloseAction
  | FilterOpenAction
  | FilterResetClickAction
  | FooterLinkClickAction
  | InteractCancelPromotionModal
  | JackpotMerchandiseView
  | LaunchGame
  | LaunchGameFromGameInfoPage
  | LoadPlayNew
  | LoadedPageContent
  | LogoClickAction
  | MarketExchangeBetButtonClickAction
  | MarketGraphSelectGraphAction
  | MarketGraphSelectViewAction
  | MarketBlurbFAQAction
  | MarketRulesModalToggleAction
  | MarketSportsbookBetButtonClickAction
  | MarketSwitchAction
  | PebbleItemSelectionAction
  | MediaPlayerLoadedAction
  | MyAccountIconClickAction
  | MyBetsBetSharingPreviewTapAction
  | MyBetsBetSharingDismissTapAction
  | MyBetsBetSharingShareBetTapAction
  | MyBetsBetSharingShareImageTapAction
  | MyBetsAccaFreezeOpenedAction
  | MyBetsAccaFreezeClosedAction
  | MyBetsCancelAllExchangeBetFailureAction
  | MyBetsCancelAllExchangeBetsSuccessAction
  | MyBetsCancelExchangeBetFailureAction
  | MyBetsCancelExchangeBetSuccessAction
  | MyBetsExchangeBetEditCloseAction
  | MyBetsExchangeBetEditPressAction
  | MyBetsExchangeOrderStatusSwitch
  | MyBetsOnAccordionToggle
  | MyBetsOnCancelAllPressAction
  | MyBetsOrderTypeFilterClick
  | MyBetsCopyBetId
  | MyBetsCopyRegulatorBetId
  | BetMutationAccaFreezeSelectedAction
  | BetMutationAccaFreezeDeselectedAction
  | FreezeLegAction
  | NavigateFromContentSummaryLinkAction
  | NavigateFromNotFoundViewAction
  | NavigateToAllCompetitionsViewFromQuickLink
  | NavigateToAllMarketsFromAllMarketsLink
  | NavigateToCategoryUsingMultifunctional
  | NavigateToCategoryUsingSeeAllButton
  | NavigateToCompetitionView
  | NavigateToDiscountRateExplained
  | NavigateToEventFromMarket
  | NavigateToEventFromMarketScoreboard
  | NavigateToEventFromSport
  | NavigateToGameCategoryView
  | NavigateToGameInfoView
  | NavigateToMarketView
  | NavigateToMobileWeb
  | NavigateToRaceFromMarket
  | NavigateToSeeAllPromotions
  | NavigateToSwitcherOptionClick
  | NavigateToView
  | NavigationTabClickAction
  | NavigateViewFromFavouritesClick
  | NextRacesFilterClickAction
  | NextRacesRaceClick
  | NotFoundViewLoadedAction
  | PlaceExchangeBetFailureAction
  | PlaceExchangeBetSuccessAction
  | PlaceSportsbookBetFailureAction
  | PlaceSportsbookBetSuccessAction
  | PlayNewClickToMoreInfoButtonAction
  | PlayNewClickToPlayNowButtonAction
  | PNInteraction
  | PromoDescriptionToggleAction
  | PromotionCallToActionClickAction
  | PromotionTermsAndConditionsClickAction
  | QuickLinkClickAction
  | RaceReplaysMediaPlayerLoadedAction
  | RaceReplaysToggleAction
  | RaceViewLinksLinkClick
  | RefreshPromotion
  | SawCardAction
  | SearchAzLinkClickAction
  | SearchBarFocusAction
  | SearchCancelAction
  | SearchClearResultsAction
  | SearchLinkClickAction
  | SearchTabClickAction
  | SettingsNavigationAction
  | StatisticsItemClickAction
  | StatisticsModalToggleAction
  | SuspendedSbkBetButtonCLickAction
  | SwitchProductPreferenceAction
  | SwitcherOpen
  | TakeCashoutFailureAction
  | TakeCashoutSuccessAction
  | TimeFormBroadCastsCardMediaPlayerAction
  | TimeFormBroadCastsCardToggleAction
  | ToggleExpandableCardGroupAction
  | ToggleGraphAction
  | ToggleMarketBlurbExpandClick
  | ToggleRecentRaceAction
  | ToggleRunnerInfo
  | ToggleRunnerInfoTabs
  | ToggleShowMoreRunnersAction
  | ToggleTimeformCard
  | UpdateExchangeBetFailureAction
  | UpdateExchangeBetSuccessAction
  | URLBetslipDeeplinkAction
  | UserLogoutClickAction
  | UpdateMarketDepth
  | UserProfileBudgetLinkClickAction
  | UserProfileMenuEyeIconClickAction
  | UserProfileMenuLinkClickAction
  | UserProfileQuickLinkClickAction
  | UserProfileToggleCashBalancesViewClickAction
  | MyBetsSportsbookAddPreviousSelectionsClickAction
  | PNSubscribeEventsAction
  | PNSubscribeEventsSuccessAction
  | PNPartialSubscribeEventsSuccessAction
  | PNUnsupportedSubscribeEventsSuccessAction
  | PNUnsubscribeEventsAction
  | PopularBetBuilderNavigateToBetBuilderAction
  | TakeCashoutFailureSbkAction;

const getHydratedPebbleCardGroupByURN = createGetHydratedPebbleCardGroupByURNSelector();
const getPopularMultiplesBetBuilderCardByURN = createCardByURNSelector<PopularMultiplesBetBuilderCards, URN>();
const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
const getExchangeMarketByURN = createExchangeMarketSelector();
const getRaceByURN = createRaceByURNSelector();
const getMeetingByURN = createMeetingByURNSelector();
const getCardParentTitlesByURN = createCardParentTitlesByURNSelector();
const getViewTypeSelector = createViewTypeSelector();
const isDesktopAppKey = isDesktopAppKeyTypeSelector();
const getCouponCardGroupParentTitles = createGetCouponCardGroupParentTitlesSelector();
const getGamingSearchInput = createGetGamingSearchInputSelector();

export const createLegacyTaggingMiddleware =
  (sendEvent: (event: unknown) => void): Middleware<Record<string, never>, ApplicationState> =>
  ({ getState }) =>
  (next) =>
  async (action: ActionTypes) => {
    switch (action.type) {
      case URL__BETSLIP_DEEPLINK: {
        const { isBetSharing } = action.payload;

        sendEvent(getBetslipDeeplinkEvent(isBetSharing));
        break;
      }

      case UI__FOOTER_LINK_CLICK: {
        const { text: label, url: destinationURL } = action.payload;
        const appModule = "footer";
        const event: GenericEvent = getLinkClickEvent(label, appModule, destinationURL);
        sendEvent(event);
        break;
      }

      case UI__MARKET_SWITCH_CLICK: {
        let market: ExchangeMarket | SportsbookMarket | undefined;
        const { product, selectedTabUrn, cardUrn } = action.payload;

        if (!selectedTabUrn) {
          break;
        }

        const state = getState();
        const {
          entities: { exchangemarkets, sportsbookmarkets, sportevents, sports, competitions },
        } = state;
        if (product === Product.Exchange) {
          market = getExchangeMarketByURN(exchangemarkets, selectedTabUrn);
        } else {
          market = getSportsbookMarketByURN(sportsbookmarkets, selectedTabUrn);
        }

        if (!market) {
          break;
        }

        const sportUrn = market.sport;
        const sport = getSportByURN(sports, sportUrn);

        const metadata = getLayoutMetadata(cardUrn);

        let gtmEvent;
        if (isRaceHierarchy(market.hierarchy)) {
          if (!sport) {
            break;
          }

          gtmEvent = getMarketSwitchEvent(product, market, null, null, sport, metadata.verticalPosition);
        } else if (isCompetitionEventHierarchy(market.hierarchy)) {
          const eventUrn = market.hierarchy.sportevent;
          const competitionUrn = market.hierarchy.competition;

          const event = getSportEventByURN(sportevents, eventUrn);
          const competition = getCompetitionByURN(competitions, competitionUrn);

          if (!event || !competition || !sport) {
            break;
          }

          gtmEvent = getMarketSwitchEvent(product, market, event, competition, sport, metadata.verticalPosition);
        } else {
          const eventUrn = market.hierarchy.sportevent;
          const event = getSportEventByURN(sportevents, eventUrn);

          if (!event || !sport) {
            break;
          }

          gtmEvent = getMarketSwitchEvent(product, market, event, null, sport, metadata.verticalPosition);
        }

        sendEvent(gtmEvent);

        break;
      }
      case UI__MY_ACCOUNT_ICON_CLICK: {
        const event: GenericEvent = getMyAccountMenuToggleEvent(action.payload);
        sendEvent(event);

        break;
      }
      case UI__USER_LOGOUT_CLICK: {
        const event: GenericEvent = getLogoutClickEvent();
        sendEvent(event);

        break;
      }
      case UI__BETSLIP_HEADER_CLICK: {
        const { isCollapsed, betslipSubType } = action.payload;

        const taggingAction = isCollapsed ? TaggingAction.CLOSED : TaggingAction.OPENED;

        const event: GenericEvent = getBetslipHeaderClickEvent(taggingAction, betslipSubType);
        sendEvent(event);

        break;
      }
      case UI__BETSLIP_ACCORDION_HEADER_CLICK: {
        const { isExpanded } = action.payload;
        const eventAction = isExpanded ? TaggingAction.EXPAND : TaggingAction.COLLAPSE;

        const event: GenericEvent = getBetslipAccordionHeaderClickEvent(eventAction);
        sendEvent(event);

        break;
      }
      case UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK: {
        const event: GenericEvent = getDontUpdateBetClickEvent();
        sendEvent(event);

        break;
      }

      case UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK: {
        const betslipContext = getBetslipExchangeContext(getState());

        if (betslipContext) {
          const event: UpdateBet = getUpdateBetClickEvent(betslipContext.side);
          sendEvent(event);
        }
        break;
      }

      case UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK: {
        const label = "cancel bet";
        const event: CancelBet | null = getBetslipCancelBetClickEvent(getState(), TaggingAction.EDITED_BET, label);

        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP:
      case UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN:
      case UI__BETSLIP_EXC_PRICE_NUDGE_UP:
      case UI__BETSLIP_EXC_PRICE_NUDGE_DOWN: {
        const event: PriceChange | null = getExchangePriceChangeEvent(getState(), action.payload);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case NETWORK__CANCEL_EXC_BET_SUCCESS: {
        const label = "cancelled unmatched bet";
        const event: CancelBet | null = getBetslipCancelBetClickEvent(
          getState(),
          TaggingAction.CANCELLED_BET_SUCCESS,
          label,
        );

        if (event) {
          sendEvent(event);
        }
        break;
      }

      case NETWORK__CANCEL_EXC_BET_FAILURE: {
        const { errorCode } = action.payload.error;
        const label = errorCode.toLowerCase();

        const event: CancelBet | null = getBetslipCancelBetClickEvent(
          getState(),
          TaggingAction.CANCELLED_BET_FAILURE,
          label,
          errorCode,
        );

        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK: {
        const { betId, betOriginURL } = action.payload;
        const event: ClickEdit | null = getExchangeOnClickEdit(getState(), betId, betOriginURL);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case NETWORK__UPDATE_EXC_BET_SUCCESS: {
        const { report, betOriginURL } = action.payload;
        if (!report) {
          return null;
        }
        const event: EditSuccessfull | null = getExchangeBetEditSuccessfull(getState(), report, betOriginURL);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case NETWORK__UPDATE_EXC_BET_FAILURE: {
        const { errorCode } = action.payload.error;

        const event: UpdateBet | null = getUpdateBetFailureEvent(getState(), errorCode);

        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK: {
        const event: UpdateBet | null = getChangePersistenceTypeClickEvent(getState(), action.payload.persistenceType);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK: {
        const event: GenericEvent = getOpenPersistenceTypeMenuEvent();
        sendEvent(event);

        break;
      }

      case UI__MARKET_EXC_BET_BUTTON_CLICK: {
        const state = getState();

        if (!getBetslipVisibilityState(state)) {
          const event: GenericEvent = getOpenBetslipEvent(Product.Exchange);
          sendEvent(event);
        }

        const excSelectionRemoveEvent = getBetslipExchangeRemoveSelectionEvent(state);

        if (excSelectionRemoveEvent) {
          sendEvent(excSelectionRemoveEvent);
        }

        // Any sportsbook legs get removed during any EXC Button click
        const sbkSelectionRemovedEvent = getBetslipSportsbookRemoveSelectionEvent(state, {
          runnerUrn: action.payload.urn,
        });

        if (sbkSelectionRemovedEvent) {
          sendEvent(sbkSelectionRemovedEvent);
        }

        const metadata = getLayoutMetadata(action.payload.cardUrn);
        const addSelectionEvent = getExchangeAddSelectionToBetslip(state, action, metadata);
        if (addSelectionEvent) {
          sendEvent(addSelectionEvent);
        }

        break;
      }
      case UI__MARKET_SBK_BET_BUTTON_CLICK: {
        const state = getState();

        if (!getBetslipVisibilityState(state)) {
          const event: GenericEvent = getOpenBetslipEvent(Product.Sportsbook);
          sendEvent(event);
        }

        const sbkSelectionRemovedEvent = getBetslipSportsbookRemoveSelectionEvent(state, {
          runnerUrn: action.payload.urn,
        });

        if (sbkSelectionRemovedEvent) {
          sendEvent(sbkSelectionRemovedEvent);
        }

        // Any exchange potential bets get removed during any SBK Button click
        const excSelectionRemovedEvent = getBetslipExchangeRemoveSelectionEvent(state);

        if (excSelectionRemovedEvent) {
          sendEvent(excSelectionRemovedEvent);
        }

        const { cardUrn } = action.payload;
        const metadata = getLayoutMetadata(cardUrn);
        const addSelectionEvent = getSportsbookAddSelectionToBetslip(state, action, metadata);
        if (addSelectionEvent) {
          sendEvent(addSelectionEvent);
        }

        break;
      }
      case UI__BETSLIP_EXC_PLACE_BET_CLICK: {
        const event = getPlaceExchangeBetClickEvent(getState());
        if (event !== null) {
          sendEvent(event);
        }

        if (!action.payload.confirmFirst) {
          const autoConfirmEvent = getExchangeAutoConfirmedBetClickEvent(getState());
          if (autoConfirmEvent !== null) {
            sendEvent(autoConfirmEvent);
          }
        }
        break;
      }

      case UI__BETSLIP_EXC_CONFIRM_BET_CLICK: {
        const event = getExchangeConfirmBetClickEvent(getState());
        if (event !== null) {
          sendEvent(event);
        }
        break;
      }

      case NETWORK__PLACE_EXC_BET_SUCCESS: {
        const { payload } = action as PlaceExchangeBetSuccessAction;
        const placeEvent = getExchangeSuccessPlaceBetEvent(getState(), payload);
        if (placeEvent !== null) {
          sendEvent(placeEvent);
        }
        const selectionPlaceEvent = getExchangeSuccessPlaceBetSelectionEvent(getState(), payload);
        if (selectionPlaceEvent !== null) {
          sendEvent(selectionPlaceEvent);
        }
        break;
      }

      case NETWORK__PLACE_EXC_BET_FAILURE: {
        const { payload } = action;
        const event = getExchangeFailedPlaceBetEvent(getState(), payload.error, payload.side);
        if (event !== null) {
          sendEvent(event);
        }
        break;
      }

      case UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK: {
        const combinations = getSportsbookBettingCombinations(getState());

        const { combinationId } = action.payload;
        const { betType } = combinations[combinationId];

        const event = getBetslipSportsbookMultipleBetTypeClickEvent(betType);
        sendEvent(event);

        break;
      }

      case UI__BETSLIP_SBK_PLACE_BETS_CLICK: {
        sendEvent(getPlaceSportsbookBetClickEvent());
        sendEvent(getAutoConfirmSportsbookBetClickEvent());

        break;
      }

      case NETWORK__PLACE_SBK_BET_SUCCESS: {
        const { payload } = action as PlaceSportsbookBetSuccessAction;

        getSportsbookSuccessPlaceBetsEvent(getState(), payload).forEach((event) => sendEvent(event));
        getSportsbookSuccessPlaceSelectionsEvent(getState(), payload).forEach((event) => sendEvent(event));

        break;
      }

      case BETTING__SBK_PLACE_FAILED_UPDATE: {
        const betslipGroup = action.payload.state;
        const event = getSportsbookFailedPlaceBetEvent(betslipGroup.failures.place);
        if (event !== null) {
          sendEvent(event);
        }

        break;
      }
      case UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK: {
        const event = getBetReceiptExchangeDoneClickEvent();
        sendEvent(event);

        break;
      }
      case UI__SEARCH_TAB_CLICK: {
        const event: GenericEvent = getSearchTabClickEvent(action.payload);
        sendEvent(event);

        break;
      }
      case UI__SEARCH_AZ_LINK_CLICK: {
        const event: GenericEvent = getSearchAzLinkClickEvent(action.payload.text, action.payload.url);
        sendEvent(event);

        break;
      }
      case UI__SEARCH_LINK_CLICK: {
        const event: GenericEvent = getSearchLinkClickEvent(
          `search text - ${action.payload.text}`,
          action.payload.url,
          action.payload.order,
        );
        sendEvent(event);

        break;
      }

      case UI__SEARCH_BAR_LINK_CLICK: {
        const state = getState();
        const viewType = getViewTypeSelector(state);
        const event: GenericEvent = getSearchLinkClickEvent(
          action.payload.text,
          action.payload.url,
          action.payload.order,
          `${viewType} - search`,
        );

        sendEvent(event);

        break;
      }
      case UI__SEARCH_BAR_FOCUS: {
        const state = getState();
        let event: GenericEvent;

        if (isDesktopAppKey(state)) {
          const viewType = getViewTypeSelector(state);
          const moduleName = `${viewType} - search`;

          event = getSearchBarFocusEvent(moduleName);
        } else {
          event = getSearchBarFocusEvent();
        }

        sendEvent(event);

        break;
      }
      case UI__SEARCH_CANCEL_CLICK: {
        const event: GenericEvent = getSearchCancelClickEvent(action.payload.text);
        sendEvent(event);

        break;
      }

      case UI__CLEAR_SEARCH_RESULTS: {
        const state = getState();
        let event: GenericEvent;

        if (isDesktopAppKey(state)) {
          const viewType = getViewTypeSelector(state);
          const moduleName = `${viewType} - search`;
          const labelText = action.payload.text;

          event = getSearchClearClickEvent(labelText, moduleName);
        } else {
          event = getSearchClearClickEvent(`search text - ${action.payload.text}`);
        }

        sendEvent(event);

        break;
      }
      case UI__NAVIGATE_TO_EVENT_FROM_SPORT: {
        const { href, fixtureURN, sportEventURN, type, cardUrn } = action.payload;
        const state = getState();
        const metadata = getLayoutMetadata(cardUrn);
        let inplay = false;

        // Get football fixture
        if (fixtureURN) {
          const footballFixture = state.entities.footballfixtures[fixtureURN];

          if (footballFixture && footballFixture.duration) {
            const { status } = footballFixture.duration;
            inplay = status !== FootballMatchStatus.PRE_MATCH && status !== FootballMatchStatus.END;
          }
        }

        // Get sport event
        const sportEvent = getSportEventByURN(state.entities.sportevents, sportEventURN);
        if (!sportEvent) {
          return null;
        }

        // Get competition
        const competition = getCompetitionByURN(state.entities.competitions, sportEvent.competition);
        if (!competition) {
          return null;
        }

        // Get sport
        const sport = getSportByURN(state.entities.sports, competition.sport);
        if (!sport) {
          return null;
        }

        const event = getNavigateToEventFromSport(
          sportEvent.name,
          sportEvent.eventId,
          sportEvent.name,
          sport.sportId,
          sport.name,
          href,
          competition.competitionId,
          competition.name,
          inplay,
          type,
          metadata,
        );

        sendEvent(event);

        break;
      }
      case UI__LOGO_CLICK: {
        const label = "bf logo";
        const appModule = "header";
        const { path } = action.payload;

        const event: GenericEvent = getLinkClickEvent(label, appModule, path);
        sendEvent(event);

        break;
      }
      case UI__NAVIGATE_TO_EVENT_FROM_MARKET: {
        const { url, text } = action.payload;
        const module = "market - event quicklink";
        const event = getLinkClickEvent(`back to ${text}`, module, url);
        sendEvent(event);

        break;
      }

      case UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD: {
        const { url, text } = action.payload;
        const module = "market - scoreboard";
        const event = getLinkClickEvent(`back to ${text}`, module, url);
        sendEvent(event);

        break;
      }

      case UI__NAVIGATE_TO_RACE_FROM_MARKET: {
        const { url, text } = action.payload;
        const module = "market - race quicklink";
        const event = getLinkClickEvent(`back to ${text}`, module, url);
        sendEvent(event);

        break;
      }

      case UI__NAVIGATE_TO_MARKET_VIEW: {
        const { marketName, cardType, href, cardUrn: urn } = action.payload;
        const state = getState();
        const viewType = getViewTypeSelector(state);
        const metadata = getLayoutMetadata(urn);

        const event = getNavigateToMarketViewEvent(marketName, viewType, cardType, href, metadata);
        sendEvent(event);

        break;
      }

      case UI__NAVIGATE_TO_SWITCHER_OPTION_CLICK: {
        const { url, label, pageType } = action.payload;
        const TYPE_CONFIG: { [key: string]: string } = {
          GenericSwitcherCard: "generic",
          RaceSwitcherCard: "race",
        };
        const type = TYPE_CONFIG[pageType];
        const module = `${type} - power nav`;

        const event = getLinkClickEvent(label, module, url);

        sendEvent(event);

        break;
      }

      case UI__TOGGLE_RUNNER_INFO: {
        const { runnerName, marketName, isOpening } = action.payload;

        const state = getState();

        const event = getToggleRunnerInfoEvent(isOpening, runnerName, getViewTypeSelector(state), marketName);
        sendEvent(event);

        break;
      }
      case UI__TOGGLE_RUNNER_INFO_TABS: {
        const { isDetailsTab } = action.payload;

        const event = getToggleRunnerInfoTabsEvent(isDetailsTab);
        sendEvent(event);

        break;
      }
      case UI__TOGGLE_EXPANDABLE_CARDGROUP: {
        const { isExpanded, urn, title } = action.payload;

        const state = getState();
        const {
          layouts: { views },
          router: { currentUrn: currentViewUrn },
        } = state;

        const viewType = getViewTypeSelector(state);
        const viewTitle = currentViewUrn && getViewbyURN(views, currentViewUrn)?.title;
        const metadata = getLayoutMetadata(urn);

        const event = getToggleExpandableCardGroupEvent(
          isExpanded,
          title,
          viewTitle,
          viewType,
          metadata.verticalPosition,
        );
        if (event) {
          sendEvent(event);
        }

        break;
      }
      case UI__TOGGLE_TIMEFORM_CARD: {
        const state: ApplicationState = getState();
        const { isExpanded, raceUrn } = action.payload;
        const race = getRaceByURN(state.entities.races, raceUrn);
        const meeting = getMeetingByURN(state.entities.meetings, race?.meeting);
        const sport = getSportByURN(state.entities.sports, meeting?.sportUrn);

        const event = getToggleTimeFormEvent(isExpanded, race, meeting, sport);
        sendEvent(event);

        break;
      }
      case UI__NAVIGATE_TO_VIEW: {
        const { url, cardURN: urn, module, label } = action.payload;
        const state = getState();
        const viewType = getViewTypeSelector(state);
        const metadata = getLayoutMetadata(urn);

        const event = getNavigateToView(label, viewType, module, url, metadata);
        sendEvent(event);

        break;
      }
      case UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD: {
        const { module, href, categoryName, cardUrn } = action.payload;
        const metadata = getLayoutMetadata(cardUrn);

        const { horizontalPosition = null, verticalPosition } = metadata;
        const event = getNavigateToGameCategoryEvent(
          module ?? "",
          categoryName ?? "",
          href,
          verticalPosition,
          horizontalPosition,
        );
        sendEvent(event);

        break;
      }

      case UI__PLAY_NEW_LOADED: {
        const { urn, isStaticPromo } = action.payload;
        const metadata = getLayoutMetadata(urn);

        const event = loadPlayNew(metadata.verticalPosition, isStaticPromo);
        sendEvent(event);
        break;
      }

      case UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK: {
        const { viewLink, urn, isStaticPromo } = action.payload;
        const metadata = getLayoutMetadata(urn);

        const event = getMoreInfoPlayNewClickEvent(viewLink, metadata.verticalPosition, isStaticPromo);
        sendEvent(event);
        break;
      }

      case UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK: {
        const { viewLink, urn } = action.payload;
        const metadata = getLayoutMetadata(urn);

        const event = getPlayNowPlayNewClickEvent(viewLink, metadata.verticalPosition);
        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_TO_GAME_INFO_VIEW: {
        const state = getState();
        const { href, gameUrn, cardUrn } = action.payload;

        const game = getGameByURN(state.entities.games, gameUrn);

        const metadata = getLayoutMetadata(cardUrn);

        const zoneTitle = metadata?.viewZoneTitle ?? "";
        const gameName = game?.name ?? "";
        const gameProvider = game?.provider.name ?? "";
        const launchId = game?.launchId ?? "";
        const gamePosition = metadata?.horizontalPosition;
        const verticalPosition = metadata?.verticalPosition;
        const horizontalPosition = metadata?.horizontalPosition;

        const event = getNavigateToGameInfoEvent(
          zoneTitle,
          gameName,
          href,
          gameProvider,
          launchId,
          gamePosition,
          verticalPosition,
          horizontalPosition,
        );

        sendEvent(event);

        break;
      }

      case UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION: {
        const { increment, currencySymbol } = action.payload;
        const event: GenericEvent = getSbkIncrementStakeEvent(increment, currencySymbol);

        sendEvent(event);

        break;
      }

      case UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION: {
        const { increment, currencySymbol } = action.payload;
        const event: GenericEvent = getExcIncrementSizeEvent(increment, currencySymbol);

        sendEvent(event);

        break;
      }

      case UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK: {
        const event = getBetslipExchangeRemoveSelectionEvent(getState());
        sendEvent(event);

        break;
      }

      case UI__BETSLIP_SBK_REMOVE_LEG_CLICK: {
        const { legId } = action.payload;

        const event = getBetslipSportsbookRemoveSelectionEvent(getState(), { legId });
        sendEvent(event);

        break;
      }

      case UI__BETSLIP_SBK_REMOVE_SELECTIONS: {
        const event = getBetslipSbkRemoveAllEvent();
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK: {
        const event = getBetslipSbkReAddSelectionsEvent();
        sendEvent(event);
        break;
      }

      case UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK: {
        const event = getMyBetsSbkAddPreviousSelectionsEvent();
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_NOTIFICATION_SHOWN: {
        const { label } = action.payload;
        const event = getBetslipSbkNotificationShownEvent(label);
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK: {
        const { url } = action.payload;
        const event = getBetslipSbkMaxPayoutNotificationUrlClickEvent(url);
        sendEvent(event);
        break;
      }

      case UI__MARKET_RULES_MODAL_TOGGLE: {
        const state = getState();
        const pageType = getViewTypeSelector(state);

        const { open } = action.payload;
        const event = getMarketRulesToggleModalEvent(open, pageType);

        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED: {
        const { text, url } = action.payload;
        const event = getMarketRulesLinkClickEvent(text, url);

        sendEvent(event);
        break;
      }

      case UI__CLICK_ALLMARKETS_LINK: {
        const { destinationUrl } = action.payload;
        const event = getAllMarketsLinkClickEvent(destinationUrl);

        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_TO_COMPETITION_VIEW: {
        const { cardUrn, cardType, href, text } = action.payload;
        const state = getState();

        const viewType = getViewTypeSelector(state);

        const { horizontalPosition = null, verticalPosition = null } = getLayoutMetadata(cardUrn);
        const { groupTitle, tabTitle } = getCardParentTitlesByURN(state.layouts, cardUrn);

        const event = getCompetitionLinkClickEvent(
          text,
          viewType,
          cardType,
          href,
          verticalPosition,
          horizontalPosition,
          groupTitle,
          tabTitle,
        );

        sendEvent(event);

        break;
      }

      case UI__TAP_ALL_COMPETITIONS_LINK: {
        const { cardUrn, href, text } = action.payload;

        const state = getState();
        const pageType = getViewTypeSelector(state) ?? "competition";
        const { verticalPosition = null } = getLayoutMetadata(cardUrn);

        const event = getAllCompetitionsLinkClickEvent(text, pageType, "quicklink", href, verticalPosition);

        sendEvent(event);

        break;
      }

      case UI__GRAPH_TOGGLE: {
        const state = getState();
        const { runnerName, marketName, isClosed } = action.payload;
        const pageType = getViewTypeSelector(state);
        const event = getToggleMarketGraphEvent(pageType, runnerName, marketName, isClosed);

        sendEvent(event);
        break;
      }

      case UI__RECENT_RACE_TOGGLE: {
        const state = getState();
        const pageType = getViewTypeSelector(state);
        const { runnerName, cardUrn, isClosed } = action.payload;
        const event = getToggleRecentRacesEvent(state, pageType, cardUrn, runnerName, isClosed);

        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__CLICK_MARKET_GRAPH_TAB_VIEW_SELECTOR: {
        const { label } = action.payload;
        const event = getMarketGraphSelectViewEvent(label);

        sendEvent(event);
        break;
      }

      case UI__CLICK_MARKET_GRAPH_MODE_SELECTOR: {
        const { label } = action.payload;
        const event = getMarketGraphSelectGraphEvent(label);

        sendEvent(event);
        break;
      }
      case UI__USER_PROFILE_MENU_LINK_CLICK: {
        const { menuText, href, jurisdiction } = action.payload;
        const event: NavigateFromUserProfileLink = getMyAccountMenuLinkEvent(menuText, href, jurisdiction);

        sendEvent(event);
        break;
      }
      case UI__USER_PROFILE_QUICK_LINK_CLICK: {
        const { title, href, jurisdiction } = action.payload;
        const event: NavigateFromUserProfileLink = getMyAccountQuickLinkEvent(title, href, jurisdiction);

        sendEvent(event);
        break;
      }

      case UI__USER_PROFILE_EYE_ICON_CLICK: {
        const { showBalances, jurisdiction } = action.payload;
        const event = getMyAccountEyeIconEvent(showBalances, jurisdiction);

        sendEvent(event);
        break;
      }

      case UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK: {
        const { showLessToggle, jurisdiction } = action.payload;
        const event = getMyAccountToggleCashBalancesViewEvent(jurisdiction, showLessToggle);

        sendEvent(event);
        break;
      }

      case UI__USER_PROFILE_BUDGET_LINK_CLICK: {
        const { url: destinationURL, jurisdiction } = action.payload;
        const appModule = `my_account_${jurisdiction.toLowerCase()}_mobile`;
        const label = "my budget";

        const event: GenericEvent = getLinkClickEvent(label, appModule, destinationURL);

        sendEvent(event);

        break;
      }

      case UPDATE_MARKET_DEPTH: {
        const { isActive, urn } = action.payload;
        const event = getMarketDepthClickEvent(getState(), urn, isActive);

        sendEvent(event);
        break;
      }

      case UI__BOTTOM_BAR_CLICK: {
        const { path, tile } = action.payload;
        const {
          router,
          layouts: { views },
        } = getState();

        const viewUrn = router.currentUrn;
        if (!viewUrn) {
          return null;
        }

        const view = getViewbyURN(views, viewUrn);
        if (!view) {
          return null;
        }

        const event = getBottomBarClickEvent(view.typename, tile, path);

        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON: {
        const { href, label, zoneTitle, cardUrn } = action.payload;

        const { verticalPosition = null } = getLayoutMetadata(cardUrn);

        const event = getSeeAllLinkClickEvent(label, zoneTitle, href, verticalPosition);
        sendEvent(event);
        break;
      }

      case UI__CLICK_PEBBLE_ITEM: {
        const state = getState();
        const { cardGroupURN, pebbleURN } = action.payload;
        const cardGroup = getHydratedPebbleCardGroupByURN(state.layouts.cardgroups.pebblecardgroups, cardGroupURN);

        const pebbleTitle = cardGroup?.items.find((item) => item.urn === pebbleURN)?.name ?? undefined;

        const event = getMarketTemplatePebbleSelectionEvent(pebbleTitle);

        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL: {
        const { href, categoryName, zoneTitle } = action.payload;
        const event = getCategoryFromMultifunctionalClickEvent(href, zoneTitle, categoryName);
        sendEvent(event);
        break;
      }

      case UI__LAUNCH_GAME: {
        const state = getState();
        const { href, gameUrn, cardUrn, platformType } = action.payload;

        const metadata = getLayoutMetadata(cardUrn);
        const game = getGameByURN(state.entities.games, gameUrn);
        const inputSearchTerm = getGamingSearchInput(state);

        let label = "";
        let zoneTitle = "";

        const viewZoneTitle = metadata?.viewZoneTitle ?? "";
        const gameName = game?.name ?? "";
        const gameProvider = game?.provider.name ?? "";
        const launchId = game?.launchId ?? "";
        const gamePosition = metadata?.horizontalPosition;
        const verticalPosition = metadata?.verticalPosition;
        const horizontalPosition = metadata?.horizontalPosition;

        if (inputSearchTerm) {
          zoneTitle = "search results";
          label = `search text - ${inputSearchTerm}`;
        } else if (viewZoneTitle) {
          zoneTitle = `${viewZoneTitle} - ${metadata.cardGroupTitle}`;
        } else if (metadata.cardGroupTitle) {
          zoneTitle = metadata.cardGroupTitle;
        }

        const event = getGameTileClickEvent(
          zoneTitle,
          label,
          gameName,
          href,
          gameProvider,
          launchId,
          gamePosition,
          verticalPosition,
          horizontalPosition,
          horizontalPosition,
          platformType,
        );
        sendEvent(event);
        break;
      }

      case UI__LAUNCH_GAME_FROM_GAME_INFO: {
        const state = getState();
        const { href, gameUrn, platformType } = action.payload;

        const game = getGameByURN(state.entities.games, gameUrn);

        const gameName = game?.name ?? "";
        const gameProvider = game?.provider.name ?? "";
        const launchId = game?.launchId ?? "";

        const event = getGameLaunchFromGameInfoEvent(gameName, href, gameProvider, launchId, platformType);
        sendEvent(event);
        break;
      }

      case UI__CLICK_PROMOTION_CALL_TO_ACTION: {
        const event = getPromotionClickEvent(action.payload, getState(), TaggingAction.CLICKED_BANNER_CTA);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS: {
        const event = getPromotionClickEvent(
          action.payload,
          getState(),
          TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS,
        );
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__BETSLIP_EXC_BONUS_CHANGE: {
        const { isFreeBetsSelected } = action.payload;

        if (!isFreeBetsSelected) {
          break;
        }

        const event = getBetslipBonusActivationEvent(Product.Exchange);
        sendEvent(event);
        break;
      }

      case BETTING__SBK_BONUS_TOGGLE_ACTION: {
        const { isFreeBetsSelected } = action.payload;

        if (!isFreeBetsSelected) {
          break;
        }

        const event = getBetslipBonusActivationEvent(Product.Sportsbook);
        sendEvent(event);
        break;
      }

      case UI__SETTINGS_TABS_CLICK: {
        const { menuText, moduleName, destinationURL } = action.payload;
        const event: SettingsTabsNavigation = getSettingsTabSelectEvent(menuText, moduleName, destinationURL);

        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK: {
        const { text: label, url: destinationURL } = action.payload;
        const appModule = "seo footer links";
        const event: GenericEvent = getLinkClickEvent(label, appModule, destinationURL);

        sendEvent(event);

        break;
      }

      case UI__CONTENT_SUMMARY_COLLAPSE_EVENT: {
        const { collapsed, title } = action.payload;
        const event = getContentSummaryCollapseEvent(title, collapsed);

        sendEvent(event);

        break;
      }

      case UI__RACE_VIEW_LINKS_LINK_CLICK: {
        const { cardUrn, href, isRaceClosed } = action.payload;
        const state = getState();
        const { verticalPosition = null, horizontalPosition = null } = getLayoutMetadata(cardUrn);

        const label = isRaceClosed ? "resulted race time selector" : "race time selector";

        const event = getRaceViewLinksLinkClickEvent(
          getViewTypeSelector(state),
          href,
          verticalPosition,
          horizontalPosition,
          label,
        );
        sendEvent(event);

        break;
      }

      case UI__NEXT_RACES_RACE_CLICK: {
        const { cardUrn } = action.payload;
        const state = getState();
        const pageType = getViewTypeSelector(state);
        const { verticalPosition } = getLayoutMetadata(cardUrn);
        const label = "race time selector";
        const event = getNextRacesRaceClickEvent(pageType, verticalPosition, label);

        sendEvent(event);

        break;
      }

      case UI__JACKPOT_MERCHANDISE_VIEW: {
        const { state, name } = action.payload;
        const event = getJackpotMerchandiseViewEvent(state, name);
        sendEvent(event);
        break;
      }

      case UI__BROADCASTS_CARD_TOGGLE: {
        const { isExpanded, cardUrn } = action.payload;
        const event = getBroadcastsToggleEvent(getState(), isExpanded, cardUrn);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__TIME_FORM_BROADCASTS_CARD_TOGGLE: {
        const { isExpanded, cardUrn, raceUrn } = action.payload;
        const event = getTimeFormBroadCastsToggleEvent(getState(), isExpanded, cardUrn, raceUrn);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__MEDIA_PLAYER_LOADED: {
        const { label, cardUrn } = action.payload;
        const event = getMediaPlayerLoadedEvent(getState(), label, cardUrn);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT: {
        const { label, raceUrn } = action.payload;
        const event = getTimeFormBroadCastsMediaPlayerEvent(getState(), label, raceUrn);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE: {
        const { isExpanded, cardUrn } = action.payload;
        const event = getBroadcastsAndStatisticsToggleEvent(getState(), isExpanded, cardUrn);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED: {
        const { label, cardUrn } = action.payload;
        const event = getBroadcastsAndStatisticsCardMediaPlayerEvent(getState(), label, cardUrn);
        if (event) {
          sendEvent(event);
        }
        break;
      }

      case UI__BACK_BUTTON_CLICK: {
        const { url } = action.payload;
        const event = getBackButtonClickEvent(url);
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_EACH_WAY_TOGGLE: {
        const event = getBetslipEachWayToggleEvent(action.payload);
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE: {
        const event = getBetslipAccaInsuranceToggleEvent(action.payload);
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE: {
        const event = getBetslipMyOddsBoostToggleEvent(action.payload);
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_CAST_BET_CHANGE: {
        const { combinationId } = action.payload;

        const event = getBetslipCastBetChangeEvent(getState(), combinationId);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE: {
        const { combinationId, updatedRunnerId } = action.payload;

        const event = getBetslipCastBetOrderChangeEvent(getState(), combinationId, updatedRunnerId);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__SWITCHER_OPEN: {
        const event = getSwitcherEvent(action.payload);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__CASHOUT_BUTTON_TAP: {
        const { cashoutUrn, confirmCashout } = action.payload;

        const event = getCashoutClickEvent(getState(), cashoutUrn);
        if (event) {
          sendEvent(event);
        }

        if (!confirmCashout) {
          const confirmCashoutEvent = getAutoConfirmCashoutClickEvent(getState(), cashoutUrn);
          if (confirmCashoutEvent) {
            sendEvent(confirmCashoutEvent);
          }
        }

        break;
      }

      case NETWORK__CASHOUT_TAKE_SUCCESS: {
        const event = getCashoutSuccessEvent(getState(), action.payload.receipt?.entityURN);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case NETWORK__CASHOUT_TAKE_FAILURE: {
        const event = getCashoutFailureEvent(getState(), action.payload.receipt?.entityURN, action.payload.errorCode);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case NETWORK__CASHOUT_TAKE_FAILURE_SBK: {
        const event = getCashoutFailureEvent(getState(), action.payload.entityURN, action.payload.errorCode);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__NAVIGATION_TAB_CLICK: {
        const { label, urn } = action.payload;
        const state = getState();

        const { verticalPosition } = getLayoutMetadata(urn);

        const event = getNavigationTabClickEvent(label, getViewTypeSelector(state), verticalPosition);
        sendEvent(event);

        break;
      }

      case UI__CARDGROUP_VIEW_ALL_LINK_TAP: {
        const { title, viewAllLink, cardgroupURN } = action.payload;

        const state = getState();

        const viewType = getViewTypeSelector(state);
        const { verticalPosition, horizontalPosition } = getLayoutMetadata(cardgroupURN);

        const event = getViewAllTapEvent(
          viewAllLink?.label,
          title,
          viewAllLink?.viewLink?.viewUrl,
          viewType,
          verticalPosition,
          horizontalPosition ?? undefined,
        );
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI_NAVIGATE_VIEW_FROM_FAVOURITES: {
        const { cardUrn, href, label } = action.payload;
        const state = getState();

        const { verticalPosition, horizontalPosition = null } = getLayoutMetadata(cardUrn);

        const event = getViewFromFavouritesClickEvent(
          label,
          getViewTypeSelector(state),
          href,
          verticalPosition,
          horizontalPosition,
        );
        sendEvent(event);

        break;
      }

      case UI__FILTER_OPEN: {
        const { label } = action.payload;
        const event = getFilterOpenEvent(label);

        sendEvent(event);
        break;
      }

      case UI__FILTER_CLOSE: {
        const event = getFilterCloseEvent();

        sendEvent(event);
        break;
      }

      case UI__FILTER_APPLY: {
        const { selectedOptions } = action.payload;
        const filteredOptions = selectedOptions.filter(Boolean);
        const event = getFilterApplyEvent(filteredOptions.join(", "));

        sendEvent(event);
        break;
      }

      case UI__FILTERS_RESET_CLICK: {
        const { label } = action.payload;
        const event = getFilterResetClickEvent(label);
        sendEvent(event);

        break;
      }

      case ACCEPT_PROMOTION: {
        const { urn, name, promoStatus, userStatus } = action.payload;
        const event = getAcceptPromotionEvent(urn, "accept", name, promoStatus, userStatus);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case REFRESH_PROMOTION:
      case INTERACT_CANCEL_PROMOTION_MODAL: {
        const { urn, name, promoStatus, userStatus, label } = action.payload;
        const event = getCancelPromotionEvent(urn, label, name, promoStatus, userStatus);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS: {
        const { viewUrl } = action.payload;
        const event = getNavigationSeeAllPromotionsEvent(viewUrl, "see all our promotions");
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case EXTERNAL_PUSH: {
        const { gtmData, viewUrl } = action.payload;

        if (gtmData) {
          const event = getNavigateToEvent(gtmData.label, gtmData.moduleName, viewUrl);

          if (event) {
            sendEvent(event);
          }
        }

        break;
      }

      case BOTTOM_BAR_PUSH: {
        const { viewUrl, gtmData } = action.payload;
        const label = gtmData?.label ?? "";

        const state = getState();
        const viewType = getViewTypeSelector(state);

        const event = getBottomBarClickEvent(viewType, label, viewUrl);
        sendEvent(event);
        break;
      }

      case SAW_CARD: {
        const { label, moduleName } = action.payload;
        const event = getSawCardEvent(label, moduleName);
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__NOT_FOUND_VIEW_LOADED:
        {
          const state: ApplicationState = getState();
          const { currentUrl } = state.router;

          const label = currentUrl ?? "";
          const event = getLoadedNotFoundView(label);
          sendEvent(event);
        }
        break;

      case UI__NAVIGATE_FROM_NOT_FOUND_VIEW:
        {
          const { label, destinationUrl } = action.payload;
          const event = getNavigateFromNotFoundView(label, destinationUrl);
          sendEvent(event);
        }
        break;

      case UI__SWITCH_PRODUCT_PREFERENCE: {
        const { productSwitcherPreference } = action.payload;
        const state = getState();

        const event = getSwitchProductEvent(productSwitcherPreference, getViewTypeSelector(state));

        if (event) {
          sendEvent(event);
        }

        break;
      }

      case NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS: {
        const { side } = action.payload;
        const label = "cancelled unmatched bet";
        const event: CancelBet = getCancelBetClickEvent(
          TaggingAction.CANCELLED_BET_SUCCESS,
          label,
          MY_BETS_MODULE_NAME,
          side,
        );

        sendEvent(event);

        break;
      }

      case NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE: {
        const { side, errorCode } = action.payload;
        const label = "cancelled unmatched bet";
        const event: CancelBet = getCancelBetClickEvent(
          TaggingAction.CANCELLED_BET_FAILURE,
          label,
          MY_BETS_MODULE_NAME,
          side,
          errorCode,
        );

        sendEvent(event);

        break;
      }

      case UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS: {
        const event: GenericEvent = getMyBetsCancelAllEvent();
        sendEvent(event);

        break;
      }

      case NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS: {
        const label = "cancelled unmatched bet";
        const event: CancelBet = getCancelBetClickEvent(
          TaggingAction.CANCELLED_ALL_BETS_SUCCESS,
          label,
          MY_BETS_MODULE_NAME,
        );

        sendEvent(event);
        break;
      }

      case NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE: {
        const { errorCode } = action.payload;
        const label = "cancelled unmatched bet";
        const event: CancelBet = getCancelBetClickEvent(
          TaggingAction.CANCELLED_ALL_BETS_FAILURE,
          label,
          MY_BETS_MODULE_NAME,
          undefined,
          errorCode,
        );

        sendEvent(event);

        break;
      }

      case UI__MY_BETS_EXC_EDIT_BET_PRESS: {
        const { side } = action.payload;
        const event: MyBetsEditClick = getMyBetsEditClickEvent(side);

        sendEvent(event);

        break;
      }

      case UI__MY_BETS_EXC_EDIT_BET_CLOSE: {
        const { wasCloseButtonPressed } = action.payload;

        if (wasCloseButtonPressed) {
          const event: GenericEvent = getMyBetsEditBottomSheetCloseEvent();
          sendEvent(event);
        }

        break;
      }

      case UI__MY_BETS_BET_SHARING_PREVIEW_TAP: {
        sendEvent(getMyBetsBetSharingPreviewOnTapEvent());

        break;
      }

      case UI__MY_BETS_BET_SHARING_DISMISS_TAP: {
        sendEvent(getMyBetsBetSharingDismissOnTapEvent());

        break;
      }

      case UI__MY_BETS_BET_SHARING_SHARE_BET_TAP: {
        sendEvent(getMyBetsBetSharingShareBetOnTapEvent());

        break;
      }

      case UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP: {
        sendEvent(getMyBetsBetSharingShareImageOnTapEvent());

        break;
      }

      case UI__MY_BETS_ACCA_FREEZE_OPENED: {
        sendEvent(getMyBetsAccaFreezeOpenedEvent());

        break;
      }

      case UI__MY_BETS_ACCA_FREEZE_CLOSED: {
        sendEvent(getMyBetsAccaFreezeClosedEvent());

        break;
      }

      case UI__BET_MUTATION_ACCA_FREEZE_SELECTED: {
        const { eventUrn } = action.payload;
        const eventId = codecs.event.decode(eventUrn);
        if (eventId === undefined) break;

        sendEvent(getBetMutationAccaFreezeSelectedEvent(eventId));

        break;
      }

      case UI__BET_MUTATION_ACCA_FREEZE_DESELECTED: {
        sendEvent(getBetMutationAccaFreezeDeselectedEvent());
        break;
      }

      case NETWORK__FREEZE_BET: {
        const { eventName, matchScore, timeFrozen } = action.payload;
        sendEvent(getBetMutationAccaFreezeConfirmEvent(eventName, matchScore, timeFrozen));
        break;
      }

      case PN_INTERACTION_EVENT: {
        const { label, module } = action.payload;

        const event = getPNInteractionClickEvent(label.toLowerCase(), module.toLowerCase());

        sendEvent(event);

        break;
      }

      case UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET: {
        const { couponCardGroupUrn, sporteventURN, href } = action.payload;
        const state = getState();

        const sportEventName = getSportEventByURN(state.entities.sportevents, sporteventURN)?.name;

        if (!sportEventName) {
          break;
        }

        const { groupTitle, tabTitle, viewType } = getCouponCardGroupParentTitles(state, couponCardGroupUrn);

        sendEvent(getCouponViewCardClickEvent(sportEventName, viewType, href, groupTitle, tabTitle));
        break;
      }

      case UI__TOGGLE_SHOW_MORE_RUNNERS: {
        const state = getState();
        const { cardUrn, showMore } = action.payload;
        const pageType = getViewTypeSelector(state);

        const metadata = getLayoutMetadata(cardUrn);
        const { pebbleCardGroupTitle = null, tabName = null } = metadata;

        const event = getToggleShowMoreEvent(
          pageType,
          tabName,
          pebbleCardGroupTitle,
          showMore ? "Show More" : "Show Less",
        );

        sendEvent(event);
        break;
      }

      case UI__MARKET_BLURB_EXPAND_CLICK: {
        const state = getState();
        const { cardUrn, isOpen, filter } = action.payload;
        const pageType = getViewTypeSelector(state);

        const metadata = getLayoutMetadata(cardUrn);
        const { pebbleCardGroupTitle = null, tabName = null } = metadata;

        const event = getMarketBlurbExpandableEvent(pageType, tabName, filter ?? pebbleCardGroupTitle, isOpen);

        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_TO_FAQ_PAGE: {
        const state = getState();
        const { cardUrn, filter, href } = action.payload;
        const pageType = getViewTypeSelector(state);

        const metadata = getLayoutMetadata(cardUrn);
        const { pebbleCardGroupTitle = null, tabName = null } = metadata;

        const event = getMarketBlurbFAQEvent(pageType, tabName, filter ?? pebbleCardGroupTitle, href);

        sendEvent(event);
        break;
      }

      case UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS: {
        const state = getState();
        const { cardUrn, selection } = action.payload;
        const metadata = getLayoutMetadata(cardUrn);
        const event = getBetslipBetBuilderAddSelections(state, action, metadata, selection.uniqueId);

        sendEvent(event);
        break;
      }

      case UI__BETSLIP_BET_BUILDER_REMOVE_SELECTIONS: {
        const state = getState();
        const { cardUrn } = action.payload;
        const metadata = getLayoutMetadata(cardUrn);
        const event = getBetslipBetBuilderRemoveSelections(state, metadata, action);
        sendEvent(event);
        break;
      }

      case UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK: {
        const event = getBetslipSportsbookLoginToPlaceBetClickEvent();
        sendEvent(event);

        break;
      }

      case UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK: {
        const { side } = action.payload;

        const event = getBetslipExchangeLoginToPlaceBetClickEvent(side);
        sendEvent(event);

        break;
      }

      case UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER: {
        const state = getState();
        const {
          entities: { sportevents, sportsbookmarkets },
        } = state;
        const { runnerUrn, urn, url } = action.payload;
        const metadata = getLayoutMetadata(urn);
        const pageType = getViewTypeSelector(state);
        const popularMultiplesBetBuilderCard = getPopularMultiplesBetBuilderCardByURN(
          state.layouts.cards.popularmultiplesbetbuilders,
          urn,
        );
        const popularMultiplesTitle = popularMultiplesBetBuilderCard?.title ?? null;

        const { cardGroupTitle, tabName } = metadata;

        const market = getSportsbookMarketByURN(sportsbookmarkets, runnerUrn);

        if (!market) {
          break;
        }

        let eventName = "";
        if (isEventHierarchy(market.hierarchy) || isCompetitionEventHierarchy(market.hierarchy)) {
          const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
          if (!event?.name) {
            break;
          }
          eventName = event.name;
        }
        const module = `${pageType} - primary swimlane - ${cardGroupTitle} | ${popularMultiplesTitle} - ${market.name} - ${tabName}`;
        const event = getBetslipBetBuilderNavigateToEvent(eventName, module, url);
        sendEvent(event);
        break;
      }

      case UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER: {
        const state = getState();
        const {
          entities: { sportsbookmarkets, sportevents },
        } = state;
        const { runnerUrn, urn, url } = action.payload;
        const metadata = getLayoutMetadata(urn);
        const pageType = getViewTypeSelector(state);

        const { cardGroupTitle, tabName } = metadata;

        const market = getSportsbookMarketByURN(sportsbookmarkets, runnerUrn);
        if (!market) {
          break;
        }
        if (isEventHierarchy(market.hierarchy) || isCompetitionEventHierarchy(market.hierarchy)) {
          const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
          if (!event?.name) {
            break;
          }
        }

        const module = `${pageType} - primary swimlane - ${cardGroupTitle} | null - ${market.name} - ${tabName}`;
        const event = getBetslipBetBuilderNavigateToEvent("build your own", module, url);
        sendEvent(event);
        break;
      }

      case UI__QUICK_LINK_CLICK: {
        const { label, url: destinationURL, cardUrn } = action.payload;
        const state = getState();
        const pageType = getViewTypeSelector(state);
        const metadata = getLayoutMetadata(cardUrn);

        // hi. you've stumbled upon a mega prego. this is a fix to another previous prego, which created a bug
        // TLDR, there is no way to distinguish GenericViewLinkCards from the ones inside Popular Coupons, which (prolly) only exist on the sports page.
        // As such, to avoid affecting other cards on different sections, it was included the extra parent verification, to hopefully fix this
        const module = `${pageType} - ${
          cardUrn.includes(EntityType.GenericViewLinkCard) && metadata.viewUrn?.includes("sport")
            ? "popular - coupons"
            : "quicklinks"
        }`;

        const event: GenericEvent = getLinkClickEvent(label, module, destinationURL, metadata.verticalPosition);

        sendEvent(event);
        break;
      }

      case UI__STATISTICS_MODAL_TOGGLE: {
        const { cardUrn, label, isOpen } = action.payload;
        const state = getState();
        const pageType = getViewTypeSelector(state);
        const { verticalPosition } = getLayoutMetadata(cardUrn);
        const event = getStatisticsModalToggleEvent(pageType, verticalPosition, label, isOpen);

        sendEvent(event);

        break;
      }

      case UI__STATISTICS_ITEM_CLICK: {
        const { label } = action.payload;
        const event = getStatisticsItemClickEvent(label);

        sendEvent(event);

        break;
      }

      case UI__NEXT_RACES_RACE_FILTER_CLICK: {
        const { label } = action.payload;
        const state = getState();
        const pageType = getViewTypeSelector(state);
        const event = getNextRacesFilterClickEvent(label, `${pageType} - race region switcher`);

        sendEvent(event);

        break;
      }

      case UI__CLOSED_SBK_CLICK: {
        const event = getMarketSnackBarEvent("closed");
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__SUSPENDED_SBK_CLICK: {
        const event = getMarketSnackBarEvent("suspended");
        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__AZ_SWITCH_CLICK: {
        const { label, isToggleOn } = action.payload;
        const event = getAzSwitchToggleEvent(label, isToggleOn);

        sendEvent(event);

        break;
      }

      case UI__MY_BETS_ORDER_TYPE_FILTER_CLICK: {
        const { productType, orderType } = action.payload.filter;
        const event = getMyBetsOrderTypePressEvent(productType, orderType, MY_BETS_MODULE_NAME);

        sendEvent(event);

        break;
      }

      case UI__PROMO_DESCRIPTION_TOGGLE: {
        const { title, isOpen } = action.payload;
        const state = getState();
        const pageType = getViewTypeSelector(state);
        const label = `${title} info`;
        const module = "marketcard";
        const event = getPromoDescriptionToggleEvent(pageType, module, label, isOpen);

        sendEvent(event);

        break;
      }

      case UI__MY_BETS_ON_ACCORDION_TOGGLE: {
        const { isExpanded } = action.payload;
        const event = getToggleAccordionEvent("my bets", isExpanded);

        sendEvent(event);

        break;
      }

      case UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY:
      case UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY: {
        sendEvent(getCopyBetIdToClipboardEvent("bet receipt"));

        break;
      }

      case UI__MY_BETS_COPY_BET_ID:
      case UI__MY_BETS_COPY_REGULATOR_BET_ID: {
        sendEvent(getCopyBetIdToClipboardEvent(MY_BETS_MODULE_NAME));

        break;
      }

      case UI__NAVIGATE_TO_MOBILE_WEB: {
        const { label, url } = action.payload;
        const event = getNavigateToMobileWebEvent(label, url);

        sendEvent(event);

        break;
      }

      case UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED: {
        const { marketUrn } = action.payload;
        const label = "race replay";
        const event = getRaceReplaysMediaPlayerEvent(getState(), label, marketUrn);

        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__RACE_REPLAYS_TOGGLE: {
        const { selection, isClosed, cardUrn } = action.payload;
        const state = getState();
        const pageType = getViewTypeSelector(state);
        const label = `recent races video - ${selection}`;
        const event = getRaceReplaysToggleEvent(state, pageType, cardUrn, isClosed, label);

        if (event) {
          sendEvent(event);
        }

        break;
      }

      case UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED: {
        const event = getMaxPayoutAcceptMessageClickEvent();
        sendEvent(event);

        break;
      }

      case UI__MY_BETS_EXC_ORDER_STATUS_SWITCH: {
        const { orderStatusFilterLabel } = action.payload;
        const event: GenericEvent = getMyBetsExchangeOrderStatusClickEvent(orderStatusFilterLabel, MY_BETS_MODULE_NAME);

        sendEvent(event);

        break;
      }
      case PN_SUBSCRIBE_EVENTS: {
        const event = getBetReceiptToggleClickEvent(true);

        sendEvent(event);

        break;
      }

      case PN_UNSUBSCRIBE_EVENTS: {
        const event = getBetReceiptToggleClickEvent(false);

        sendEvent(event);
        break;
      }

      case PN_SUBSCRIBE_EVENTS_SUCCESS: {
        const label = "enabled live alerts";
        const event = getBetReceiptSuccessMessageSaw(label);

        sendEvent(event);

        break;
      }

      case PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS: {
        const label = "partial live alerts";
        const event = getBetReceiptSuccessMessageSaw(label);

        sendEvent(event);

        break;
      }

      case PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS: {
        const label = "there are no notifications available";
        const event = getBetReceiptSuccessMessageSaw(label);

        sendEvent(event);

        break;
      }

      default:
        break;
    }

    return next(action);
  };
