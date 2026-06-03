import { PromotionStatus } from "../../clients/catalogue/catalogue-response-types";
import { IMS_PROMOTION_MODULE_NAME, ImsPromotionViewEventsClick } from "../../state/entities";
import { Metadata } from "../../state/layout-snapshot";
import { GenericEvent } from "../../state/tagging/Event.types";
import { NavigateFromAzSearchLink, NavigateToSearchLink } from "../../state/tagging/Interface.types";
import {
  BetslipPopularBetBuilderNavigationAction,
  BottomBarNavigation,
  ClickLink,
  ClickLinkEvent,
  GenericPressNavigationTo,
  LaunchPrizeMachine,
  NavigateFromMarketRules,
  NavigateToCategoryUsingMultifunctional,
  NavigateToCategoryUsingSeeAllButton,
  NavigateToEventFromSport,
  NavigateToGameCategoryView,
  NavigateToGameInfoView,
  NavigateToMarketView,
  NavigateToView,
  TAndCPrizeMachine,
} from "../../state/tagging/Navigation.types";
import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";

type LoadedNotFoundView = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string | null;
  [DEVICE.POSITION]: number | null;
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: number | null;
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: number | null;
};

type NavigateFromNotFoundView = LoadedNotFoundView;

export const getLinkClickEvent = (
  label?: string,
  appModule?: string,
  destinationURL?: string,
  position?: number,
): ClickLinkEvent => ({
  event: "ga_event",
  action: TaggingAction.NAVIGATED_TO,
  category: TaggingCategory.NAVIGATION,
  label: label || "",
  [APPLICATION.MODULE]: appModule || "",
  [BUSINESS.DESTINATION_URL]: destinationURL || "",
  [DEVICE.POSITION]: position || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getNavigateToEventFromSport = (
  label: string,
  eventId: number | undefined,
  eventName: string,
  sportId: number,
  sportName: string,
  href: string,
  competitionId: number | undefined,
  competitionName: string,
  inPlay: boolean,
  type: "primary swimlane" | "secondary swimlane",
  metadata: Metadata,
): NavigateToEventFromSport => ({
  event: "ga_event",
  action: TaggingAction.NAVIGATED_TO,
  category: TaggingCategory.NAVIGATION,
  label,
  [APPLICATION.MODULE]: `sport - ${type} - ${metadata.cardGroupTitle} - ${label} - ${metadata.tabName}`,
  [BUSINESS.DESTINATION_URL]: href,
  [BUSINESS.SPORT_ID]: sportId,
  [BUSINESS.SPORT_NAME]: sportName,
  [BUSINESS.EVENT_ID]: eventId,
  [BUSINESS.EVENT_NAME]: eventName,
  [BUSINESS.COMPETITION_ID]: competitionId,
  [BUSINESS.COMPETITION_NAME]: competitionName,
  [BUSINESS.ANTEPOST_FLAG]: null,
  [BUSINESS.IN_PLAY_INDICATOR]: inPlay ? "yes" : "no",
  [DEVICE.POSITION]: metadata.verticalPosition || null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: metadata.horizontalPosition || null,
});

export const getNavigateToView = (
  label: string,
  pageType: string | null,
  module: string,
  href: string,
  metadata: Metadata,
): NavigateToView => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${module} - ${metadata.cardGroupTitle} - ${label} - ${metadata.tabName}`,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: metadata.verticalPosition || null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: metadata.horizontalPosition || null,
});

export const launchPrizeMachine = (
  viewLink: string,
  itemVerticalPositionOnPage: number | undefined,
  hasJackpot: boolean,
  jackpotState: string,
  isPlus: string,
): LaunchPrizeMachine => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: hasJackpot ? `prize machine -${isPlus} active jackpot - ${jackpotState}` : `prize machine${isPlus}`,
  [APPLICATION.MODULE]: "prize machine",
  [BUSINESS.GAME_NAME]: "prize pinball",
  [BUSINESS.GAME_ID]: "prize pinball",
  [BUSINESS.GAME_PROVIDER]: "ppb-internal",
  [BUSINESS.DESTINATION_URL]: viewLink,
  [DEVICE.POSITION]: null,
  [BUSINESS.GAME_STATE]: null,
  [BUSINESS.CMS_CARD_TITLE]: null,
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
  [BUSINESS.CMS_COUPON_NAME]: null,
  [BUSINESS.PERSONALIZED]: null,
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  [BUSINESS.DECISION_MODEL_NAME]: null,
  [BUSINESS.DECISION_MODEL_VARIANT]: null,
});

export const getTCPrizeMachineClickEvent = (
  viewLink: string,
  itemVerticalPositionOnPage: number | undefined,
): TAndCPrizeMachine => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: "terms & conditions",
  [APPLICATION.MODULE]: "prize machine",
  [BUSINESS.GAME_NAME]: "prize pinball",
  [BUSINESS.GAME_ID]: "prize pinball",
  [BUSINESS.GAME_PROVIDER]: "ppb-internal",
  [BUSINESS.DESTINATION_URL]: viewLink,
  [BUSINESS.GAME_STATE]: null,
  [BUSINESS.CMS_CARD_TITLE]: null,
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
  [BUSINESS.CMS_COUPON_NAME]: null,
  [BUSINESS.PERSONALIZED]: null,
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  [BUSINESS.DECISION_MODEL_NAME]: null,
  [BUSINESS.DECISION_MODEL_VARIANT]: null,
});

export const getNavigateToMarketViewEvent = (
  label: string | undefined,
  pageType: string | null,
  type: "MarketCard" | "MarketViewLinkCard" | "MarketExtendedCard" | "QuickLinksCard",
  href: string,
  metadata: Metadata,
): NavigateToMarketView => {
  let module;

  const { cardGroupTitle, tabName } = metadata;

  switch (type) {
    case "QuickLinksCard":
      module = `${pageType} - QuickLinksCard`;
      break;
    case "MarketCard":
      module = `${pageType} - primary swimlane - ${cardGroupTitle} - ${label || null} - ${tabName}`;
      break;
    default:
      module = `${pageType} - secondary swimlane - ${cardGroupTitle} - ${label || null} - ${tabName}`;
      break;
  }
  return {
    event: "ga_event",
    category: TaggingCategory.NAVIGATION,
    action: TaggingAction.NAVIGATED_TO,
    label: label || "",
    [APPLICATION.MODULE]: module,
    [BUSINESS.DESTINATION_URL]: href,
    [DEVICE.POSITION]: metadata.verticalPosition || null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: metadata.horizontalPosition || null,
  };
};

export const getSearchAzLinkClickEvent = (text: string, url: string): NavigateFromAzSearchLink => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: text,
  [APPLICATION.MODULE]: "search menu",
  [BUSINESS.DESTINATION_URL]: url,
});

export const getSearchLinkClickEvent = (
  labelText: string,
  url: string,
  order: number,
  moduleName?: string,
): NavigateToSearchLink => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: labelText,
  [APPLICATION.MODULE]: moduleName || "search results",
  [BUSINESS.DESTINATION_URL]: url,
  [DEVICE.POSITION]: order,
});

export const getMarketRulesLinkClickEvent = (text: string, url: string): NavigateFromMarketRules => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: text,
  [APPLICATION.MODULE]: "market rules",
  [BUSINESS.DESTINATION_URL]: url,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getAllMarketsLinkClickEvent = (destinationUrl: string): ClickLink => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: "view all markets",
  [APPLICATION.MODULE]: `event - all markets quicklink`,
  [BUSINESS.DESTINATION_URL]: destinationUrl,
});

export const getCompetitionLinkClickEvent = (
  label: string,
  pageType: string | null,
  module: string,
  href: string,
  itemVerticalPositionOnPage: number | null,
  itemPositionInSwimlane: number | null,
  groupTitle: string | null,
  tabTitle: string | null,
): GenericPressNavigationTo => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${module} - ${groupTitle} - ${label} - ${tabTitle}`,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: itemVerticalPositionOnPage || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: itemPositionInSwimlane || null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: itemPositionInSwimlane || null,
});

export const getAllCompetitionsLinkClickEvent = (
  label: string,
  pageType: string,
  module: string,
  href: string,
  itemVerticalPositionOnPage: number | null,
): GenericPressNavigationTo => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${module}`,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: itemVerticalPositionOnPage || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getNavigateToGameCategoryEvent = (
  module: string,
  label: string,
  href: string,
  itemVerticalPositionOnPage: number | undefined,
  itemPositionInSwimlane: number | null,
): NavigateToGameCategoryView => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: module,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: null,
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: itemPositionInSwimlane,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: itemPositionInSwimlane,
});

export const getNavigateToGameInfoEvent = (
  zoneTitle: string | undefined,
  gameName: string | undefined,
  href: string | undefined,
  gameProvider: string | undefined,
  gameId: string | undefined,
  gamePosition: number | undefined,
  itemVerticalPositionOnPage: number | undefined,
  itemPositionInSwimlane: number | undefined,
): NavigateToGameInfoView => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: `${gameName || ""} game info`,
  [APPLICATION.MODULE]: zoneTitle || "",
  [BUSINESS.GAME_ID]: gameId || "",
  [BUSINESS.GAME_NAME]: gameName || "",
  [BUSINESS.GAME_PROVIDER]: gameProvider || "",
  [BUSINESS.GAME_STATE]: undefined,
  [DEVICE.POSITION]: gamePosition !== undefined ? gamePosition + 1 : undefined,
  [BUSINESS.DESTINATION_URL]: href || "",
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: itemPositionInSwimlane,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: itemPositionInSwimlane,
});

export const getSeeAllLinkClickEvent = (
  label: string | undefined,
  zoneTitle: string | undefined,
  href: string,
  itemVerticalPositionOnPage: number | null,
): NavigateToCategoryUsingSeeAllButton | null => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: label || "",
  [APPLICATION.MODULE]: zoneTitle || "",
  [BUSINESS.DESTINATION_URL]: href,
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage || null,
});

export const getCategoryFromMultifunctionalClickEvent = (
  href: string,
  zoneTitle: string,
  categoryName: string,
): NavigateToCategoryUsingMultifunctional | null => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  [APPLICATION.MODULE]: zoneTitle,
  label: categoryName,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: undefined,
  [BUSINESS.GAME_ID]: undefined,
  [BUSINESS.GAME_NAME]: undefined,
});

export const getBottomBarClickEvent = (
  pageType: string | null,
  tileName: string,
  href: string,
): BottomBarNavigation | null => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: tileName,
  [APPLICATION.MODULE]: `${pageType || ""} - bottom ribbon`,
  [BUSINESS.DESTINATION_URL]: href,
});

export const getRaceViewLinksLinkClickEvent = (
  pageType: string | null,
  href: string,
  itemVerticalPositionOnPage: number | null,
  itemPositionInSwimlane: number | null,
  label: string,
): GenericPressNavigationTo => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${label}`,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: itemVerticalPositionOnPage,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: itemPositionInSwimlane || null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: itemPositionInSwimlane || null,
});

export const getBackButtonClickEvent = (href: string): GenericPressNavigationTo => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: "back",
  [APPLICATION.MODULE]: "header",
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getViewAllTapEvent = (
  label: string,
  title: string,
  url: string,
  viewType: string | null,
  itemVerticalPositionOnPage: number | undefined,
  swimlaneIndex: number | undefined,
): ClickLinkEvent => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: `${viewType} - ${title}`,
  [BUSINESS.DESTINATION_URL]: url,
  [DEVICE.POSITION]: itemVerticalPositionOnPage || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: swimlaneIndex || null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getViewFromFavouritesClickEvent = (
  sportName: string | undefined,
  pageType: string | null,
  href: string,
  itemVerticalPositionOnPage: number | undefined,
  swimlaneIndex: number | null,
): GenericPressNavigationTo => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: sportName || "",
  [APPLICATION.MODULE]: `${pageType} - favourites`,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: itemVerticalPositionOnPage || null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: swimlaneIndex || null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: swimlaneIndex || null,
});

export const getAcceptPromotionEvent = (
  urn: string,
  label: string,
  name: string,
  promoStatus: string,
  userStatus: PromotionStatus,
): ImsPromotionViewEventsClick => ({
  event: "ga_event",
  category: TaggingCategory.PROMOTIONS,
  action: TaggingAction.ACCEPT_PROMOTION,
  label,
  [APPLICATION.MODULE]: IMS_PROMOTION_MODULE_NAME,
  [BUSINESS.DESTINATION_URL]: null,
  [DEVICE.POSITION]: null,
  [BUSINESS.PROMOTION_ID]: urn,
  [BUSINESS.PROMOTION_NAME]: name,
  [BUSINESS.PROMOTION_STATUS]: promoStatus,
  [BUSINESS.PROMOTION_USER_STATUS]: userStatus,
});

export const getCancelPromotionEvent = (
  urn: string,
  label: string,
  name: string,
  promoStatus: string,
  userStatus: PromotionStatus,
): ImsPromotionViewEventsClick => ({
  event: "ga_event",
  category: TaggingCategory.PROMOTIONS,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: IMS_PROMOTION_MODULE_NAME,
  [BUSINESS.DESTINATION_URL]: null,
  [DEVICE.POSITION]: null,
  [BUSINESS.PROMOTION_ID]: urn,
  [BUSINESS.PROMOTION_NAME]: name,
  [BUSINESS.PROMOTION_STATUS]: promoStatus,
  [BUSINESS.PROMOTION_USER_STATUS]: userStatus,
});

export const getNavigationSeeAllPromotionsEvent = (
  currentViewUrl: string | "",
  label: string,
): GenericPressNavigationTo => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: IMS_PROMOTION_MODULE_NAME,
  [BUSINESS.DESTINATION_URL]: currentViewUrl,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getNavigateToEvent = (label: string, moduleName: string, viewUrl: string): ClickLink => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: moduleName,
  [BUSINESS.DESTINATION_URL]: viewUrl,
});

export const getLoadedNotFoundView = (label: string): LoadedNotFoundView => ({
  event: "ga_event",
  category: TaggingCategory.ERROR_MESSAGES,
  action: TaggingAction.RESOURCE_NOT_FOUND,
  label,
  [APPLICATION.MODULE]: "error",
  [BUSINESS.DESTINATION_URL]: null,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getNavigateFromNotFoundView = (label: string, destinationUrl: string): NavigateFromNotFoundView => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: "404 page - quicklink",
  [BUSINESS.DESTINATION_URL]: destinationUrl,
  [DEVICE.POSITION]: 1,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getCouponViewCardClickEvent = (
  label: string,
  pageType: string | null,
  href: string,
  groupTitle: string | null,
  tabTitle: string | null,
): GenericPressNavigationTo => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: `${pageType} - coupon - ${groupTitle} - ${label} - ${tabTitle}`,
  [BUSINESS.DESTINATION_URL]: href,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getBetslipBetBuilderNavigateToEvent = (
  eventName: string,
  module: string,
  url: string,
): BetslipPopularBetBuilderNavigationAction | null => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: eventName,
  [APPLICATION.MODULE]: module,
  [BUSINESS.DESTINATION_URL]: url,
  [BUSINESS.CMS_CARD_TITLE]: null,
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
  [BUSINESS.CMS_COUPON_NAME]: null,
  [DEVICE.POSITION]: null,
});

export const getPopularBetBuilderNavigateToEventBetBuilder = (
  eventName: string,
  module: string,
  url: string,
): BetslipPopularBetBuilderNavigationAction | null => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: eventName,
  [APPLICATION.MODULE]: module,
  [BUSINESS.DESTINATION_URL]: url,
  [BUSINESS.CMS_CARD_TITLE]: null,
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
  [BUSINESS.CMS_COUPON_NAME]: null,
  [DEVICE.POSITION]: null,
});

export const getBetslipSbkMaxPayoutNotificationUrlClickEvent = (url: string): ClickLinkEvent => ({
  event: "ga_event",
  action: TaggingAction.NAVIGATED_TO,
  category: TaggingCategory.NAVIGATION,
  label: "I18N.BETSLIP.VALIDATION_SEE_TC_FOR_MORE_INFO",
  [APPLICATION.MODULE]: "betslip",
  [BUSINESS.DESTINATION_URL]: url,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getNavigateToMobileWebEvent = (label: string, url: string): ClickLink => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label,
  [APPLICATION.MODULE]: "product link",
  [BUSINESS.DESTINATION_URL]: url,
});

export const getMarketBlurbFAQEvent = (
  pageType: string | null,
  tab: string | null,
  market: string | null,
  href: string,
): ClickLink => ({
  event: "ga_event",
  action: TaggingAction.NAVIGATED_TO,
  category: TaggingCategory.NAVIGATION,
  label: "faqs",
  [APPLICATION.MODULE]: `${pageType} - ${tab} - ${market}`,
  [BUSINESS.DESTINATION_URL]: `${href}`,
});
