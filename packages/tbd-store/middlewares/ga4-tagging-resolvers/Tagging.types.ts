import {
  AccountEvent,
  AddedSelectionEvent,
  BannerEvent,
  BetPlacedFailEvent,
  BetslipEvent,
  ClickSearchResultsEvent,
  DepositFlowEvent,
  DepositSuccessEvent,
  FirstDepositSuccessEvent,
  GameInteractionsEvent,
  GameLaunchEvent,
  InterfaceEvent,
  MyBetsEvent,
  NavigationEvent,
  NotificationEvent,
  PlacedBetEvent,
  PlacedBetSelectionEvent,
  PromotionEvent,
  SearchEvent,
  VideoSawEvent,
} from "tagging-library";
import {
  BetslipAccordionHeaderClick,
  BetslipSportsbookTabSwitchAction,
  BetslipBetBuilderAddSelectionsAction,
  BetslipBetBuilderRemoveSelectionsAction,
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
  BetslipExchangeUnmatchedPriceNudgeDownClickAction,
  BetslipExchangeUnmatchedPriceNudgeUpClickAction,
  BetslipExchangeUnmatchedUpdateClickAction,
  BetslipExcRemovePotentialSelectionAction,
  BetslipHeaderClickAction,
  BetslipOpenAction,
  BetslipSbkRemovePotentialSelectionAction,
  BetslipSportsbookAccaInsuranceToggleAction,
  BetslipSportsbookCastBetChange,
  BetslipSportsbookCastBetOrderChange,
  BetslipSportsbookEachWayToggleAction,
  BetslipSportsbookIncrementStakeAction,
  BetslipSportsbookLoginToPlaceBetClickAction,
  BetslipSportsbookMaxPayoutNotificationUrlClickAction,
  BetslipSportsbookMultipleBetTypeClick,
  BetslipSportsbookNotificationShownAction,
  BetslipObbNotificationShownAction,
  BetslipSportsbookPlaceBetsClick,
  BetslipSportsbookConfirmBetsClick,
  BetslipSportsbookEditBetsClick,
  BetslipSportsbookPriceBoostToggleAction,
  BetslipSportsbookReAddSelectionsClickAction,
  BetslipSportsbookRemoveLegClick,
  BetslipSportsbookRemoveSelectionsClick,
  PlaceExchangeBetFailureAction,
  PlaceExchangeBetSuccessAction,
  PlaceSportsbookBetSuccessAction,
  UpdateExchangeBetFailureAction,
  UpdateExchangeBetSuccessAction,
  PlaceObbBetSuccessAction,
} from "../../actions/betslip";
import {
  FavouriteMarketsLimitReachedMessageCloseAction,
  FavouriteMarketsToggleFavouriteAction,
  FavouriteMarketsTooltipCloseAction,
} from "../../actions/favourite-markets";
import {
  AzSwitchClickAction,
  ContentSummaryCollapseEvent,
  FilterApplyAction,
  FilterCloseAction,
  FilterOpenAction,
  FilterResetClickAction,
  GenerosityWalletButtonAction,
  GenerosityWalletCloseClickAction,
  FreeBetsWalletToggleAction,
  GenerosityWalletPebbleClickAction,
  JackpotMerchandiseView,
  MarketGraphSelectGraphAction,
  MarketGraphSelectViewAction,
  MarketRulesModalToggleAction,
  MyAccountIconClickAction,
  NavigationTabClickAction,
  NextRacesFilterClickAction,
  NextRacesRaceClick,
  PebbleItemSelectionAction,
  PromoDescriptionToggleAction,
  PromotionCallToActionClickAction,
  RaceReplaysToggleAction,
  SawCardAction,
  StatisticsItemClickAction,
  StatisticsModalToggleAction,
  SwitcherOpen,
  ToggleExpandableCardGroupAction,
  ToggleGraphAction,
  ToggleMarketBlurbExpandClick,
  ToggleRecentRaceAction,
  ToggleRunnerInfo,
  ToggleShowMoreRunnersAction,
  ToggleTimeformCard,
  UserLogoutClickAction,
  GenerosityWalletApplyButtonClickAction,
  BetslipSliderInteractionAction,
  BetslipSliderDisplayedAction,
} from "../../actions/interface";
import { UpdateMarketDepth, SwitchProductPreferenceAction } from "../../actions/preferences";
import {
  UserProfileBudgetLinkClickAction,
  UserProfileMenuEyeIconClickAction,
  UserProfileMenuLinkClickAction,
  UserProfileQuickLinkClickAction,
  UserProfileToggleCashBalancesViewClickAction,
} from "../../actions/user-profile";
import {
  MyBetsCancelExchangeBetFailureAction,
  MyBetsCancelExchangeBetSuccessAction,
  MyBetsExchangeBetEditCloseAction,
  MyBetsExchangeBetEditPressAction,
  MyBetsExchangeOrderStatusSwitch,
  MyBetsHeaderTooltipToggleAction,
  MyBetsHeritageInfoLabelClick,
  MyBetsHeritageToggleFilterClick,
  MyBetsOnAccordionToggle,
  MyBetsOrderTypeFilterClick,
  MyBetsSportsbookAddPreviousSelectionsClickAction,
} from "../../actions/my-bets";
import { BetMutationAccaFreezeSelectedAction, BetMutationFreezeLegAction } from "../../actions/bet-mutation";
import {
  BackButtonClickAction,
  BetslipBetBuilderNavigateToEventAction,
  BottomBarClickAction,
  CardGroupViewAllLinkTapAction,
  CouponPrimaryMarketPress,
  FooterLinkClickAction,
  LaunchGame,
  LaunchGameFromGameInfoPage,
  LaunchGameFromPN,
  LaunchGameFromWidget,
  LoadPlayNew,
  LogoClickAction,
  MarketBlurbFAQAction,
  MarketBlurbLinkClick,
  NavigateFromContentSummaryLinkAction,
  NavigateFromNotFoundViewAction,
  NavigateToAllCompetitionsViewFromQuickLink,
  NavigateToAllMarketsFromAllMarketsLink,
  NavigateToCategoryUsingSeeAllButton,
  NavigateToCompetitionView,
  NavigateToDiscountRateExplained,
  NavigateToEventFromSport,
  NavigateToGameCategoryView,
  NavigateToGameInfoView,
  NavigateToMarketView,
  NavigateToSeeAllPromotions,
  NavigateToSwitcherOptionClick,
  NavigateToView,
  NavigateViewFromFavouritesClick,
  NotFoundViewLoadedAction,
  PlayNewClickToMoreInfoButtonAction,
  PlayNewClickToPlayNowButtonAction,
  QuickLinkClickAction,
  RaceViewLinksLinkClick,
  PopularBetBuilderNavigateToBetBuilderAction,
  GenerosityWalletHelpAction,
  GenerosityPageNavigationAction,
  ObbCreatedBetsLinkClickAction,
  SettlementLinkNavigationAction,
  NavigateToEventFromMarketScoreboard,
  LaunchGameFromPromo,
} from "../../actions/navigation";
import { AcceptPromotion, InteractCancelPromotionModal, RefreshPromotion } from "../../actions/promotion";
import {
  PNInteraction,
  PNPartialSubscribeEventsSuccessAction,
  PNSubscribeEventsAction,
  PNSubscribeEventsSuccessAction,
  PNUnsubscribeEventsAction,
  PNUnsupportedSubscribeEventsSuccessAction,
  PNMyBetsSinglesBellClickAction,
  PNMyBetsMultiplesBellClickAction,
  PNMyBetsNotificationsCloseAction,
  PNMyBetsSaveClickAction,
  PNEventPageNotificationsToggleAction,
} from "../../actions/push-notifications";
import { BottomBarPushAction, ExternalPushAction } from "../../actions";
import { ApplicationState } from "../../state";
import {
  BettingObbPlaceFailedUpdateAction,
  BettingObbSbkClearAction,
  BettingObbSbkKeepAction,
  BettingObbToggleLegAction,
  BettingObbToggleMultipleLegAction,
  BettingSportsbookAddSelectionTaggingAction,
  BettingSportsbookBonusToggleAction,
  BettingSportsbookGenerosityWalletBetAction,
  BettingSportsbookPlaceFailedUpdateAction,
  MarketExchangeBetButtonClickAction,
} from "../../actions/betting";
import {
  SearchAzLinkClickAction,
  SearchBarFocusAction,
  SearchCancelAction,
  SearchClearResultsAction,
  SearchLinkClickAction,
  SearchTabClickAction,
} from "../../actions/browse";
import { ClosedSbkBetButtonCLickAction, SuspendedSbkBetButtonCLickAction } from "../../actions/sportsbook-markets";
import {
  BroadcastsAndStatisticsCardMediaPlayerLoadedAction,
  BroadcastsAndStatisticsCardToggleAction,
  BroadcastsCardToggleAction,
  MediaPlayerLoadedAction,
  RaceReplaysMediaPlayerLoadedAction,
  TimeFormBroadCastsCardMediaPlayerAction,
  TimeFormBroadCastsCardToggleAction,
} from "../../actions/media";
import {
  CashoutButtonTapAction,
  CashoutButtonTapActionAutoConfirm,
  TakeCashoutFailureAction,
  TakeCashoutFailureSbkAction,
  TakeCashoutSuccessAction,
} from "../../actions/cashout";
import { DepositFlowAction, DepositSuccessAction, FirstDepositSuccessAction } from "../../actions/deposit";
import { URLBetslipDeeplinkAction } from "../../actions/commands";
import {
  ObbCardGroupLayoutSelectionAction,
  ObbCardGroupSectionToggledAction,
  ObbCardGroupShowMoreClickedAction,
  ObbClosePlayerPickerModalAction,
  ObbEnhancedTrackingPlayerCounterAction,
  ObbEventPopularsShowMoreAction,
  ObbOnboardingCardsCardGroupNavigationAction,
  ObbOnboardingCardsCardGroupDisplayedAction,
  ObbEventSelectionAction,
  ObbGetEventParticipantsStateAction,
  ObbSquadBetPlayerPickerBetButtonClickAction,
  ObbSquadBetPlayerPickerOpenAction,
  ObbSquadBetPlayerPickerRemoveSquadParticipantAction,
  ObbSquadVsSquadTogglePlayersTooltipAction,
  ObbToggleSquadBetPlayerPickerSquadParticipantAction,
} from "../../actions/obb";
import { ConfirmationAction } from "../../actions/confirmation";
import { BottomBarGameLaunchAction } from "../../actions/game-launch";
import {
  FetchGamingSearchResultsSuccessAction,
  GamingSearchBarInputFocusAction,
  GamingSearchCancelAction,
  GamingSearchResultsClearAction,
  GamingSearchHistoryPebbleAction,
} from "../../actions/gaming-search";
import { LoadedPageContent } from "../../actions/game-interactions";
import { AddUserFavouriteGameAction, RemoveUserFavouriteGameAction } from "../../actions/user-favourite-games";
import type {
  SmartAppBannerClickAction,
  SmartAppBannerCloseAction,
  SmartAppBannerDisplayAction,
} from "../../actions/notification";
import { SportsFilterClickAction, SearchHistoryClickAction } from "../../actions/search-bar-state";

export type ActionTypes =
  | AcceptPromotion
  | AddUserFavouriteGameAction
  | AzSwitchClickAction
  | BackButtonClickAction
  | BetslipAccordionHeaderClick
  | BetslipSportsbookTabSwitchAction
  | BetslipBetBuilderAddSelectionsAction
  | BetslipBetBuilderNavigateToEventAction
  | BetslipBetBuilderRemoveSelectionsAction
  | BetslipExchangeBonusChangeAction
  | BetslipExchangeConfirmBetsClickAction
  | BetslipExchangeIncrementSizeAction
  | BetslipExchangeLoginToPlaceBetClickAction
  | BetslipExchangeMatchedPanelDoneClickAction
  | BetslipExchangePlaceBetClickAction
  | BetslipExchangePriceNudgeDownClickAction
  | BetslipExchangePriceNudgeUpClickAction
  | BetslipExchangeRemovePotentialBetClickAction
  | BetslipExchangeReportBetEditClickAction
  | BetslipExchangeUnmatchedCancelClickAction
  | BetslipExchangeUnmatchedDoneClickAction
  | BetslipExchangeUnmatchedPersistenceItemClickAction
  | BetslipExchangeUnmatchedPersistenceListClickAction
  | BetslipExchangeUnmatchedPriceNudgeDownClickAction
  | BetslipExchangeUnmatchedPriceNudgeUpClickAction
  | BetslipExchangeUnmatchedUpdateClickAction
  | BetslipExcRemovePotentialSelectionAction
  | BetslipHeaderClickAction
  | BetslipOpenAction
  | BetslipSbkRemovePotentialSelectionAction
  | BetslipSportsbookAccaInsuranceToggleAction
  | BetslipSportsbookCastBetChange
  | BetslipSportsbookCastBetOrderChange
  | BetslipSportsbookEachWayToggleAction
  | BetslipSportsbookIncrementStakeAction
  | BetslipSportsbookLoginToPlaceBetClickAction
  | BetslipSportsbookMaxPayoutNotificationUrlClickAction
  | BetslipSportsbookMultipleBetTypeClick
  | BetslipSportsbookNotificationShownAction
  | BetslipObbNotificationShownAction
  | BetslipSportsbookPlaceBetsClick
  | BetslipSportsbookConfirmBetsClick
  | BetslipSportsbookEditBetsClick
  | BetslipSportsbookPriceBoostToggleAction
  | BetslipSportsbookReAddSelectionsClickAction
  | BetslipSportsbookRemoveLegClick
  | BetslipSportsbookRemoveSelectionsClick
  | BettingSportsbookAddSelectionTaggingAction
  | BettingSportsbookBonusToggleAction
  | BettingSportsbookPlaceFailedUpdateAction
  | BottomBarClickAction
  | BottomBarGameLaunchAction
  | BottomBarPushAction
  | BroadcastsAndStatisticsCardMediaPlayerLoadedAction
  | BroadcastsAndStatisticsCardToggleAction
  | BroadcastsCardToggleAction
  | CardGroupViewAllLinkTapAction
  | CashoutButtonTapAction
  | CashoutButtonTapActionAutoConfirm
  | ClosedSbkBetButtonCLickAction
  | ContentSummaryCollapseEvent
  | CouponPrimaryMarketPress
  | DepositFlowAction
  | DepositSuccessAction
  | ExternalPushAction
  | FavouriteMarketsLimitReachedMessageCloseAction
  | FavouriteMarketsToggleFavouriteAction
  | FavouriteMarketsTooltipCloseAction
  | FilterApplyAction
  | FilterCloseAction
  | FilterOpenAction
  | FilterResetClickAction
  | FirstDepositSuccessAction
  | FooterLinkClickAction
  | GenerosityWalletButtonAction
  | GenerosityWalletCloseClickAction
  | GenerosityWalletHelpAction
  | FreeBetsWalletToggleAction
  | GamingSearchBarInputFocusAction
  | GamingSearchCancelAction
  | GamingSearchHistoryPebbleAction
  | GamingSearchResultsClearAction
  | FetchGamingSearchResultsSuccessAction
  | InteractCancelPromotionModal
  | JackpotMerchandiseView
  | LaunchGame
  | LaunchGameFromGameInfoPage
  | LaunchGameFromPN
  | LaunchGameFromPromo
  | LaunchGameFromWidget
  | LoadPlayNew
  | LogoClickAction
  | LoadedPageContent
  | MarketExchangeBetButtonClickAction
  | MarketGraphSelectGraphAction
  | MarketGraphSelectViewAction
  | MarketBlurbFAQAction
  | MarketBlurbLinkClick
  | MarketRulesModalToggleAction
  | PebbleItemSelectionAction
  | MediaPlayerLoadedAction
  | MyAccountIconClickAction
  | MyBetsCancelExchangeBetFailureAction
  | MyBetsCancelExchangeBetSuccessAction
  | MyBetsExchangeBetEditCloseAction
  | MyBetsExchangeBetEditPressAction
  | MyBetsExchangeOrderStatusSwitch
  | MyBetsOnAccordionToggle
  | MyBetsOrderTypeFilterClick
  | MyBetsHeaderTooltipToggleAction
  | MyBetsSportsbookAddPreviousSelectionsClickAction
  | NavigateFromContentSummaryLinkAction
  | NavigateFromNotFoundViewAction
  | NavigateToAllCompetitionsViewFromQuickLink
  | NavigateToAllMarketsFromAllMarketsLink
  | NavigateToCategoryUsingSeeAllButton
  | NavigateToCompetitionView
  | NavigateToDiscountRateExplained
  | NavigateToEventFromSport
  | NavigateToEventFromMarketScoreboard
  | NavigateToGameCategoryView
  | NavigateToGameInfoView
  | NavigateToMarketView
  | NavigateToSeeAllPromotions
  | NavigateToSwitcherOptionClick
  | NavigateToView
  | NavigateViewFromFavouritesClick
  | NavigationTabClickAction
  | NextRacesFilterClickAction
  | NextRacesRaceClick
  | NotFoundViewLoadedAction
  | PlaceExchangeBetFailureAction
  | PlaceExchangeBetSuccessAction
  | PlaceSportsbookBetSuccessAction
  | PlayNewClickToMoreInfoButtonAction
  | PlayNewClickToPlayNowButtonAction
  | PNInteraction
  | PNPartialSubscribeEventsSuccessAction
  | PNSubscribeEventsAction
  | PNSubscribeEventsSuccessAction
  | PNUnsubscribeEventsAction
  | PNUnsupportedSubscribeEventsSuccessAction
  | PNMyBetsSinglesBellClickAction
  | PNMyBetsMultiplesBellClickAction
  | PNMyBetsNotificationsCloseAction
  | PNMyBetsSaveClickAction
  | PNEventPageNotificationsToggleAction
  | PromoDescriptionToggleAction
  | PromotionCallToActionClickAction
  | QuickLinkClickAction
  | RaceReplaysMediaPlayerLoadedAction
  | RaceReplaysToggleAction
  | RaceViewLinksLinkClick
  | RefreshPromotion
  | RemoveUserFavouriteGameAction
  | SawCardAction
  | SearchAzLinkClickAction
  | SearchBarFocusAction
  | SearchCancelAction
  | SearchClearResultsAction
  | SearchLinkClickAction
  | SearchTabClickAction
  | SmartAppBannerClickAction
  | SmartAppBannerCloseAction
  | SmartAppBannerDisplayAction
  | SportsFilterClickAction
  | SearchHistoryClickAction
  | StatisticsItemClickAction
  | StatisticsModalToggleAction
  | SuspendedSbkBetButtonCLickAction
  | SwitcherOpen
  | SwitchProductPreferenceAction
  | TakeCashoutFailureAction
  | TakeCashoutFailureSbkAction
  | TakeCashoutSuccessAction
  | TimeFormBroadCastsCardMediaPlayerAction
  | TimeFormBroadCastsCardToggleAction
  | ToggleExpandableCardGroupAction
  | ToggleGraphAction
  | ToggleMarketBlurbExpandClick
  | ToggleRecentRaceAction
  | ToggleRunnerInfo
  | ToggleShowMoreRunnersAction
  | ToggleTimeformCard
  | UpdateExchangeBetFailureAction
  | UpdateExchangeBetSuccessAction
  | UpdateMarketDepth
  | URLBetslipDeeplinkAction
  | UserLogoutClickAction
  | UserProfileBudgetLinkClickAction
  | UserProfileMenuEyeIconClickAction
  | UserProfileMenuLinkClickAction
  | UserProfileQuickLinkClickAction
  | UserProfileToggleCashBalancesViewClickAction
  | PopularBetBuilderNavigateToBetBuilderAction
  | ObbEventSelectionAction
  | BettingObbToggleLegAction
  | BettingObbToggleMultipleLegAction
  | MyBetsHeritageToggleFilterClick
  | MyBetsHeritageInfoLabelClick
  | PlaceObbBetSuccessAction
  | ConfirmationAction
  | BettingObbSbkClearAction
  | BettingObbSbkKeepAction
  | BettingSportsbookGenerosityWalletBetAction
  | PlaceObbBetSuccessAction
  | BettingObbPlaceFailedUpdateAction
  | BetMutationAccaFreezeSelectedAction
  | BetMutationFreezeLegAction
  | ObbGetEventParticipantsStateAction
  | ObbClosePlayerPickerModalAction
  | ObbToggleSquadBetPlayerPickerSquadParticipantAction
  | ObbSquadBetPlayerPickerRemoveSquadParticipantAction
  | ObbSquadBetPlayerPickerOpenAction
  | ObbSquadBetPlayerPickerBetButtonClickAction
  | ObbEnhancedTrackingPlayerCounterAction
  | ObbCardGroupSectionToggledAction
  | ObbCardGroupLayoutSelectionAction
  | ObbCardGroupShowMoreClickedAction
  | GenerosityWalletPebbleClickAction
  | GenerosityPageNavigationAction
  | GenerosityWalletApplyButtonClickAction
  | ObbCreatedBetsLinkClickAction
  | ObbSquadVsSquadTogglePlayersTooltipAction
  | BetslipSliderInteractionAction
  | BetslipSliderDisplayedAction
  | SettlementLinkNavigationAction
  | ObbEventPopularsShowMoreAction
  | ObbOnboardingCardsCardGroupNavigationAction
  | ObbOnboardingCardsCardGroupDisplayedAction;

export type TaggingTypes =
  | (PlacedBetEvent | PlacedBetSelectionEvent)[]
  | AccountEvent
  | AddedSelectionEvent
  | AddedSelectionEvent[]
  | BannerEvent
  | BetPlacedFailEvent
  | BetslipEvent
  | ClickSearchResultsEvent
  | DepositFlowEvent
  | DepositSuccessEvent
  | FirstDepositSuccessEvent
  | GameInteractionsEvent
  | GameLaunchEvent
  | InterfaceEvent
  | MyBetsEvent
  | NavigationEvent
  | PromotionEvent
  | VideoSawEvent
  | PlacedBetEvent
  | PlacedBetSelectionEvent
  | SearchEvent
  | NotificationEvent;

export type TaggingBuilder = (action: ActionTypes, state: ApplicationState) => TaggingTypes;

export type ActionTaggingMapper = Record<string, TaggingBuilder>;
