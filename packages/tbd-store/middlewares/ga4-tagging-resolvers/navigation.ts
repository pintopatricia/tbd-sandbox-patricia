import { buildNavigationEvent, NavigationEvent } from "tagging-library";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";

import {
  BottomBarClickAction,
  BetslipBetBuilderNavigateToEventAction,
  FooterLinkClickAction,
  NavigateToAllCompetitionsViewFromQuickLink,
  NavigateToAllMarketsFromAllMarketsLink,
  NavigateToCategoryUsingSeeAllButton,
  LogoClickAction,
  CouponPrimaryMarketPress,
  MarketBlurbFAQAction,
  NavigateFromNotFoundViewAction,
  NavigateToCompetitionView,
  NavigateToDiscountRateExplained,
  NavigateToEventFromSport,
  NavigateToGameCategoryView,
  NavigateToGameInfoView,
  NavigateToMarketView,
  NavigateToSwitcherOptionClick,
  NavigateToView,
  NavigateToSeeAllPromotions,
  PlayNewClickToMoreInfoButtonAction,
  PlayNewClickToPlayNowButtonAction,
  QuickLinkClickAction,
  NavigateFromContentSummaryLinkAction,
  RaceViewLinksLinkClick,
  CardGroupViewAllLinkTapAction,
  NavigateViewFromFavouritesClick,
  PopularBetBuilderNavigateToBetBuilderAction,
  GenerosityWalletHelpAction,
  MarketBlurbLinkClick,
  GenerosityPageNavigationAction,
  ObbCreatedBetsLinkClickAction,
  SettlementLinkNavigationAction,
  NavigateToEventFromMarketScoreboard,
} from "../../actions/navigation";
import { ApplicationState, IMS_PROMOTION_MODULE_NAME } from "../../state";
import { createCardParentTitlesByURNSelector, createViewTypeSelector } from "../../state/layout/layout-selectors";
import { MAX_URL_LENGTH_FOR_TAGGING, TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { BetslipSportsbookMaxPayoutNotificationUrlClickAction } from "../../actions/betslip";
import {
  UserProfileBudgetLinkClickAction,
  UserProfileMenuLinkClickAction,
  UserProfileQuickLinkClickAction,
} from "../../actions/user-profile";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { SearchAzLinkClickAction } from "../../actions/browse";
import { BottomBarPushAction, ExternalPushAction } from "../../actions";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { createGetCouponCardGroupParentTitlesSelector } from "../../state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { PopularMultiplesBetBuilderCards } from "../../state/layout/cards/Card.types";
import URN from "../../state/layout/URN";
import { getSportsbookMarketByURN } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { isCompetitionEventHierarchy, isEventHierarchy } from "../../helpers/markets";
import { getLayoutMetadata } from "../../state/layout-snapshot";
import { getGameByURN } from "../../state/entities/games/game-selectors";
import { MyBetsHeritageInfoLabelClick } from "../../actions/my-bets";
import { MY_BETS_MODULE_NAME } from "../../state/layout/cards/MyBets.types";
import {
  createGamingSearchInterfaceSelector,
  getGamingSearchGamePositionByURN,
} from "../../state/layout/gaming-search/gaming-search-selectors";
import { getModuleData } from "./helpers";

const getViewTypeSelector = createViewTypeSelector();
const getCardParentTitlesByURN = createCardParentTitlesByURNSelector();
const getCouponCardGroupParentTitles = createGetCouponCardGroupParentTitlesSelector();
const getPopularMultiplesBetBuilderCardByURN = createCardByURNSelector<PopularMultiplesBetBuilderCards, URN>();

const MY_ACCOUNT_MODULE_NAME = "my account";

export const getLinkClickEvent = (
  action: FooterLinkClickAction | UserProfileBudgetLinkClickAction | NavigateFromContentSummaryLinkAction,
): NavigationEvent => {
  const { text, url, module } = action.payload;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: text || "null",
    module,
    destinationUrl: url?.slice(0, MAX_URL_LENGTH_FOR_TAGGING) || "null",
    moduleDisplayOrder: "null",
    position: "null",
  });
};

export const getCompetitionLinkClickEvent = (
  action: NavigateToCompetitionView,
  state: ApplicationState,
): NavigationEvent => {
  const { cardUrn, cardType, href, text } = action.payload;
  const viewType = getViewTypeSelector(state);

  const { horizontalPosition, verticalPosition } = getLayoutMetadata(cardUrn);
  const { groupTitle, tabTitle } = getCardParentTitlesByURN(state.layouts, cardUrn);

  return buildNavigationEvent({
    elementText: text,
    action: TaggingAction.NAVIGATED_TO,
    module: `${viewType} - ${cardType} - ${groupTitle} - ${text} - ${tabTitle}`,
    destinationUrl: href,
    position: verticalPosition?.toString() || "null",
    moduleDisplayOrder: horizontalPosition?.toString() || "null",
  });
};

export const getNavigateToGameCategoryEvent = (action: NavigateToGameCategoryView): NavigationEvent => {
  const { module = "", href, categoryName = "", cardUrn } = action.payload;
  const metadata = getLayoutMetadata(cardUrn);

  return buildNavigationEvent({
    elementText: categoryName,
    module,
    action: TaggingAction.NAVIGATED_TO,
    position: "",
    moduleDisplayOrder: metadata.verticalPosition?.toString() || "null",
    destinationUrl: href?.slice(0, MAX_URL_LENGTH_FOR_TAGGING) || "",
  });
};

export const getNavigateToGameInfoEvent = (
  action: NavigateToGameInfoView,
  state: ApplicationState,
): NavigationEvent => {
  const getGamingSearchInterface = createGamingSearchInterfaceSelector();
  const { href, gameUrn, cardUrn } = action.payload;

  const metadata = getLayoutMetadata(cardUrn);
  const game = getGameByURN(state.entities.games, gameUrn);
  const { results, inputSearchTerm } = getGamingSearchInterface(
    state,
    codecs.card.gaming.masterConfigElement.encode("search", 0).uid,
  );
  const gamePositionByUrnInSearchResults = getGamingSearchGamePositionByURN(
    state.layouts.gamingSearch,
    codecs.card.gaming.masterConfigElement.encode("search", 0).uid,
    cardUrn,
  );

  const zoneTitle = metadata?.viewZoneTitle || "";
  const gameName = game?.name || "";
  const gameProvider = game?.provider.name || "";
  const launchId = game?.launchId || "";
  const gamePosition =
    gamePositionByUrnInSearchResults === -1 ? metadata.horizontalPosition : gamePositionByUrnInSearchResults;
  const verticalPosition = metadata?.verticalPosition;
  const gamingSearchResultsLength = results.length;

  return buildNavigationEvent({
    elementText: gameName ? `${gameName} game info` : "game info",
    module: gamingSearchResultsLength > 0 ? "games search" : zoneTitle || "",
    action: TaggingAction.NAVIGATED_TO,
    gameName: gameName || "",
    gameId: launchId || "",
    gameProvider: gameProvider || "",
    position: gamePosition !== undefined ? (gamePosition + 1).toString() : "null",
    moduleDisplayOrder: verticalPosition?.toString() || "null",
    destinationUrl: href?.slice(0, MAX_URL_LENGTH_FOR_TAGGING) || "",
    gameFilter:
      gamingSearchResultsLength > 0 ? `${gamingSearchResultsLength} results for ${inputSearchTerm}` : undefined,
  });
};

type LaunchPrizeMachineEventProps = {
  urn: URN;
  viewLink: string;
  hasJackpot: boolean;
  guaranteedPrize: boolean;
  jackpotState: string;
};

export const getLaunchPrizeMachineEvent = (params: LaunchPrizeMachineEventProps): NavigationEvent => {
  const { viewLink, urn, hasJackpot, jackpotState, guaranteedPrize } = params;
  const metadata = getLayoutMetadata(urn);
  let isPlus = "";

  if (guaranteedPrize) {
    if (hasJackpot) {
      isPlus = " plus -";
    } else {
      isPlus = " - plus";
    }
  }

  return buildNavigationEvent({
    elementText: hasJackpot ? `prize machine -${isPlus} active jackpot - ${jackpotState}` : `prize machine${isPlus}`,
    module: "prize machine",
    action: TaggingAction.NAVIGATED_TO,
    gameName: "prize pinball",
    gameId: "prize pinball",
    gameProvider: "ppb-internal",
    position: "",
    moduleDisplayOrder: metadata.verticalPosition?.toString() || "",
    destinationUrl: viewLink,
  });
};

type TCPrizeMachineClickEventPArams = {
  urn: URN;
  viewLink: string;
};
export const getTCPrizeMachineClickEvent = (params: TCPrizeMachineClickEventPArams): NavigationEvent => {
  const { viewLink, urn } = params;
  const { verticalPosition } = getLayoutMetadata(urn);

  return buildNavigationEvent({
    elementText: "terms & conditions",
    module: "prize machine",
    action: TaggingAction.NAVIGATED_TO,
    gameName: "prize pinball",
    gameId: "prize pinball",
    gameProvider: "ppb-internal",
    position: "",
    moduleDisplayOrder: verticalPosition?.toString() || "",
    destinationUrl: viewLink,
  });
};

export const getMoreInfoPlayNewClickEvent = (action: PlayNewClickToMoreInfoButtonAction): NavigationEvent => {
  const { viewLink, urn, isStaticPromo } = action.payload;
  const metadata = getLayoutMetadata(urn);

  return buildNavigationEvent({
    elementText: isStaticPromo ? "terms & conditions - hype building state" : "terms & conditions - active state",
    action: TaggingAction.NAVIGATED_TO,
    module: "spin until you win",
    position: "",
    moduleDisplayOrder: metadata.verticalPosition?.toString() || "",
    destinationUrl: viewLink || "",
  });
};

export const getPlayNowPlayNewClickEvent = (action: PlayNewClickToPlayNowButtonAction): NavigationEvent => {
  const { viewLink, urn } = action.payload;
  const metadata = getLayoutMetadata(urn);

  return buildNavigationEvent({
    elementText: "play now - active state",
    module: "spin until you win",
    action: TaggingAction.NAVIGATED_TO,
    position: "",
    moduleDisplayOrder: metadata.verticalPosition?.toString() || "",
    destinationUrl: viewLink || "",
  });
};

export const getBetslipSbkMaxPayoutNotificationUrlClickEvent = (
  action: BetslipSportsbookMaxPayoutNotificationUrlClickAction,
): NavigationEvent => {
  const { url } = action.payload;

  return buildNavigationEvent({
    elementText: "I18N.BETSLIP.VALIDATION_SEE_TC_FOR_MORE_INFO",
    action: TaggingAction.NAVIGATED_TO,
    module: "betslip",
    destinationUrl: url,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getNavigationSeeAllPromotionsEvent = (action: NavigateToSeeAllPromotions): NavigationEvent => {
  const { viewUrl } = action.payload;

  return buildNavigationEvent({
    elementText: "see all our promotions",
    action: TaggingAction.NAVIGATED_TO,
    module: IMS_PROMOTION_MODULE_NAME,
    destinationUrl: viewUrl,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getMarketRulesLinkClickEvent = (action: NavigateToDiscountRateExplained): NavigationEvent => {
  const { text, url } = action.payload;

  return buildNavigationEvent({
    elementText: text,
    action: TaggingAction.NAVIGATED_TO,
    module: "market rules",
    destinationUrl: url,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getNavigateToEvent = (action: ExternalPushAction): NavigationEvent | null => {
  const { gtmData, viewUrl } = action.payload;

  if (!gtmData) return null;

  return buildNavigationEvent({
    elementText: gtmData?.label || "null",
    action: TaggingAction.NAVIGATED_TO,
    module: gtmData?.moduleName || "null",
    destinationUrl: viewUrl,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getNavigateToEventFromSportEvent = (
  action: NavigateToEventFromSport,
  state: ApplicationState,
): NavigationEvent | null => {
  const { cardUrn, href, sportEventURN, type, elementText } = action.payload;
  const sportEvent = getSportEventByURN(state.entities.sportevents, sportEventURN);

  if (!sportEvent) {
    return null;
  }

  const viewType = getViewTypeSelector(state);
  const metadata = getLayoutMetadata(cardUrn);

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: elementText || sportEvent.name,
    module: `${viewType} - ${type} - ${metadata.cardGroupTitle} - ${sportEvent.name} - ${metadata.tabName}`,
    destinationUrl: href,
    position: metadata.horizontalPosition?.toString() || "null",
    moduleDisplayOrder: metadata.verticalPosition?.toString() || "null",
  });
};


export const getAllMarketsLinkClickEvent = (action: NavigateToAllMarketsFromAllMarketsLink): NavigationEvent => {
  const { destinationUrl } = action.payload;

  return buildNavigationEvent({
    elementText: "view all markets",
    action: TaggingAction.NAVIGATED_TO,
    module: "event - all markets quicklink",
    destinationUrl,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getBottomBarPushEvent = (action: BottomBarPushAction, state: ApplicationState): NavigationEvent => {
  const { viewUrl, gtmData } = action.payload;
  const label = gtmData?.label || "";

  const viewType = getViewTypeSelector(state);

  return buildNavigationEvent({
    elementText: label,
    action: TaggingAction.NAVIGATED_TO,
    module: `${viewType || ""} - bottom ribbon`,
    destinationUrl: viewUrl,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getNavigateFromNotFoundView = (action: NavigateFromNotFoundViewAction): NavigationEvent => {
  const { label, destinationUrl } = action.payload;

  return buildNavigationEvent({
    elementText: label,
    action: TaggingAction.NAVIGATED_TO,
    module: "404 page - quicklink",
    destinationUrl,
    position: "1",
    moduleDisplayOrder: "null",
  });
};

export const getAllCompetitionsLinkClickEvent = (
  action: NavigateToAllCompetitionsViewFromQuickLink,
  state: ApplicationState,
): NavigationEvent => {
  const { cardUrn, href, text } = action.payload;
  const pageType = getViewTypeSelector(state) || "competition";
  const { verticalPosition } = getLayoutMetadata(cardUrn);

  return buildNavigationEvent({
    elementText: text,
    action: TaggingAction.NAVIGATED_TO,
    module: `${pageType} - quicklink`,
    destinationUrl: href,
    position: "null",
    moduleDisplayOrder: verticalPosition?.toString() || "null",
  });
};

export const getMyAccountMenuLinkEvent = (action: UserProfileMenuLinkClickAction): NavigationEvent => {
  const { menuText, href } = action.payload;

  return buildNavigationEvent({
    elementText: menuText,
    action: TaggingAction.NAVIGATED_TO,
    module: MY_ACCOUNT_MODULE_NAME,
    destinationUrl: href,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getMyAccountQuickLinkEvent = (action: UserProfileQuickLinkClickAction): NavigationEvent => {
  const { title, href } = action.payload;

  return buildNavigationEvent({
    elementText: `${title} quicklink`,
    action: TaggingAction.NAVIGATED_TO,
    module: MY_ACCOUNT_MODULE_NAME,
    destinationUrl: href,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getBottomBarClickEvent = (
  action: BottomBarClickAction,
  state: ApplicationState,
): NavigationEvent | null => {
  const { path, tile } = action.payload;
  const {
    router,
    layouts: { views },
  } = state;
  const viewUrn = router.currentUrn;
  if (!viewUrn) {
    return null;
  }

  const view = getViewbyURN(views, viewUrn);
  if (!view) {
    return null;
  }

  return buildNavigationEvent({
    elementText: tile,
    action: TaggingAction.NAVIGATED_TO,
    module: `${view.typename || ""} - bottom ribbon`,
    destinationUrl: path,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getSeeAllLinkClickEvent = (action: NavigateToCategoryUsingSeeAllButton): NavigationEvent => {
  const { href, label, zoneTitle, cardUrn } = action.payload;
  const { verticalPosition } = getLayoutMetadata(cardUrn);

  return buildNavigationEvent({
    elementText: label || "null",
    action: TaggingAction.NAVIGATED_TO,
    module: zoneTitle || "null",
    destinationUrl: href,
    position: "null",
    moduleDisplayOrder: verticalPosition?.toString() || "null",
  });
};

export const getSearchAzLinkClickEvent = (
  action: SearchAzLinkClickAction,
  state: ApplicationState,
): NavigationEvent => {
  const module = state.hamburgerMenu.isOpen ? "burger menu" : "search menu";
  const elementText = action.payload.title ? `${action.payload.title} - ${action.payload.text}` : action.payload.text;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText,
    module,
    destinationUrl: action.payload.url,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getLogoClickEvent = (action: LogoClickAction): NavigationEvent =>
  buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: "bf logo",
    module: "header",
    destinationUrl: action.payload.path,
    position: "null",
    moduleDisplayOrder: "null",
  });

export const getNavigateToMarketViewEvent = (
  action: NavigateToMarketView,
  state: ApplicationState,
): NavigationEvent => {
  const { marketName, cardType, href, cardUrn: urn } = action.payload;
  const viewType = getViewTypeSelector(state);
  const metadata = getLayoutMetadata(urn);

  let module;

  const { cardGroupTitle } = metadata;
  const tabTitle = metadata.tabName;

  switch (cardType) {
    case "QuickLinksCard":
      module = `${viewType} - QuickLinksCard`;
      break;
    case "MarketCard":
      module = `${viewType} - primary swimlane - ${cardGroupTitle} - ${marketName || null} - ${tabTitle}`;
      break;
    default:
      module = `${viewType} - secondary swimlane - ${cardGroupTitle} - ${marketName || null} - ${tabTitle}`;
      break;
  }

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: marketName || "",
    module,
    destinationUrl: href,
    moduleDisplayOrder: `${metadata.verticalPosition}`,
    position: `${metadata.horizontalPosition}`,
  });
};

export const getNavigateToSwitcherOptionClickEvent = (action: NavigateToSwitcherOptionClick): NavigationEvent => {
  const { url, label, pageType } = action.payload;
  const TYPE_CONFIG: { [key: string]: string } = {
    GenericSwitcherCard: "generic",
    RaceSwitcherCard: "race",
  };
  const type = TYPE_CONFIG[pageType];

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: label,
    module: `${type} - power nav`,
    destinationUrl: url,
    moduleDisplayOrder: "null",
    position: "null",
  });
};

export const getNavigateToView = (action: NavigateToView, state: ApplicationState): NavigationEvent => {
  const { url, cardURN: urn, module, label } = action.payload;
  const viewType = getViewTypeSelector(state);
  const metadata = getLayoutMetadata(urn);

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: label,
    module: `${viewType} - ${module} - ${metadata.cardGroupTitle} - ${label} - ${metadata.tabName}`,
    destinationUrl: url,
    moduleDisplayOrder: `${metadata.verticalPosition}`,
    position: `${metadata.horizontalPosition}`,
  });
};

export const getCouponViewCardClickEvent = (
  action: CouponPrimaryMarketPress,
  state: ApplicationState,
): NavigationEvent | null => {
  const { couponCardGroupUrn, sporteventURN, href } = action.payload;

  const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);

  if (!sportEvent) return null;

  const { groupTitle, tabTitle, viewType } = getCouponCardGroupParentTitles(state, couponCardGroupUrn);

  return buildNavigationEvent({
    elementText: sportEvent?.name || "null",
    action: TaggingAction.NAVIGATED_TO,
    module: `${viewType} - coupon - ${groupTitle} - ${sportEvent?.name} - ${tabTitle}`,
    destinationUrl: href,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getMarketBlurbFAQEvent = (action: MarketBlurbFAQAction, state: ApplicationState): NavigationEvent => {
  const { cardUrn, filter, href, gaModuleSuffix = "" } = action.payload;
  const pageType = getViewTypeSelector(state);

  const metadata = getLayoutMetadata(cardUrn);
  const { tabName, cardGroupTitle } = metadata;

  return buildNavigationEvent({
    elementText: "faqs",
    action: TaggingAction.NAVIGATED_TO,
    module: `${pageType} - ${tabName} - ${filter || cardGroupTitle} ${gaModuleSuffix}`.trim(),
    destinationUrl: href,
    position: "null",
    moduleDisplayOrder: "null",
  });
};

export const getBetslipBetBuilderNavigateToEvent = (
  action: BetslipBetBuilderNavigateToEventAction,
  state: ApplicationState,
): NavigationEvent | null => {
  const {
    entities: { sportevents, sportsbookmarkets },
  } = state;
  const { runnerUrn, urn, url } = action.payload;

  const market = getSportsbookMarketByURN(sportsbookmarkets, runnerUrn);
  if (!market) {
    return null;
  }

  let eventName = "";
  if (isEventHierarchy(market.hierarchy) || isCompetitionEventHierarchy(market.hierarchy)) {
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
    if (!event?.name) {
      return null;
    }
    eventName = event.name;
  }

  const metadata = getLayoutMetadata(urn);
  const pageType = getViewTypeSelector(state);
  const popularMultiplesBetBuilderCard = getPopularMultiplesBetBuilderCardByURN(
    state.layouts.cards.popularmultiplesbetbuilders,
    urn,
  );
  const popularMultiplesTitle = popularMultiplesBetBuilderCard?.title || null;

  const { verticalPosition, horizontalPosition, cardGroupTitle, tabName } = metadata;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: eventName,
    module: `${pageType} - primary swimlane - ${cardGroupTitle} | ${popularMultiplesTitle} - ${market.name} - ${tabName}`,
    destinationUrl: url,
    moduleDisplayOrder: `${verticalPosition}`,
    position: `${horizontalPosition}`,
  });
};

export const getPopularBetBuildNavigateToEventBetBuild = (
  action: PopularBetBuilderNavigateToBetBuilderAction,
  state: ApplicationState,
): NavigationEvent | null => {
  const {
    entities: { sportevents, sportsbookmarkets },
  } = state;
  const { runnerUrn, urn, url } = action.payload;

  const market = getSportsbookMarketByURN(sportsbookmarkets, runnerUrn);
  if (!market) {
    return null;
  }

  if (isEventHierarchy(market.hierarchy) || isCompetitionEventHierarchy(market.hierarchy)) {
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
    if (!event?.name) {
      return null;
    }
  }

  const metadata = getLayoutMetadata(urn);
  const pageType = getViewTypeSelector(state);

  const { verticalPosition, horizontalPosition, cardGroupTitle, tabName } = metadata;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    module: `${pageType} - primary swimlane - ${cardGroupTitle} | null - ${market.name} - ${tabName}`,
    destinationUrl: url,
    moduleDisplayOrder: `${verticalPosition}`,
    position: `${horizontalPosition}`,
    elementText: "build your own",
  });
};

export const getRaceViewLinksLinkClickEvent = (
  action: RaceViewLinksLinkClick,
  state: ApplicationState,
): NavigationEvent => {
  const { cardUrn, href, isRaceClosed } = action.payload;
  const { verticalPosition, horizontalPosition } = getLayoutMetadata(cardUrn);
  const pageType = getViewTypeSelector(state);
  const label = isRaceClosed ? "resulted race time selector" : "race time selector";

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: label,
    module: `${pageType} - ${label}`,
    destinationUrl: href,
    moduleDisplayOrder: `${verticalPosition}`,
    position: `${horizontalPosition}`,
  });
};

export const getQuickLinkClickEvent = (action: QuickLinkClickAction, state: ApplicationState): NavigationEvent => {
  const { label, url, cardUrn } = action.payload;
  const pageType = getViewTypeSelector(state);
  const isHamburgerMenuOpen = state.hamburgerMenu.isOpen;

  let module;
  if (isHamburgerMenuOpen) {
    module = "burger menu";
  } else if (cardUrn.includes(EntityType.GenericViewLinkCard)) {
    module = "sport - popular - coupons";
  } else {
    module = `${pageType} - quicklinks`;
  }

  const { verticalPosition } = getLayoutMetadata(cardUrn);

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: label,
    module,
    destinationUrl: url,
    moduleDisplayOrder: `${verticalPosition}`,
    position: "null",
  });
};

export const getViewAllTapEvent = (action: CardGroupViewAllLinkTapAction, state: ApplicationState): NavigationEvent => {
  const { title, viewAllLink, cardgroupURN } = action.payload;
  const viewType = getViewTypeSelector(state);
  const { verticalPosition, horizontalPosition } = getLayoutMetadata(cardgroupURN);

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: viewAllLink?.label,
    module: `${viewType} - ${title}`,
    destinationUrl: viewAllLink?.viewLink?.viewUrl,
    moduleDisplayOrder: `${verticalPosition}`,
    position: `${horizontalPosition}`,
  });
};

export const getViewFromFavouritesClickEvent = (
  action: NavigateViewFromFavouritesClick,
  state: ApplicationState,
): NavigationEvent => {
  const { cardUrn, href, label } = action.payload;
  const pageType = getViewTypeSelector(state);
  const { verticalPosition, horizontalPosition } = getLayoutMetadata(cardUrn);

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: label,
    module: `${pageType} - favourites`,
    destinationUrl: href,
    moduleDisplayOrder: `${verticalPosition}`,
    position: `${horizontalPosition}`,
  });
};

export const getGenerosityWalletHelpClickEvent = (action: GenerosityWalletHelpAction): NavigationEvent | null => {
  const { destinationUrl, currentPebble, isFromBetslip } = action.payload;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl,
    elementText: "help",
    module: `${isFromBetslip ? "betslip - " : ""}generosity wallet - ${currentPebble}`,
    moduleDisplayOrder: "null",
    position: "null",
  });
};

export const getGenerosityPageNavigation = (action: GenerosityPageNavigationAction): NavigationEvent => {
  const { destinationUrl, currentPebble } = action.payload;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl,
    elementText: "my generosity page",
    module: `generosity wallet - ${currentPebble}`,
    moduleDisplayOrder: "null",
    position: "null",
  });
};

export const getHeritageInfoLabelClickEvent = (action: MyBetsHeritageInfoLabelClick): NavigationEvent => {
  const { viewLink, label } = action.payload;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl: viewLink.viewUrl,
    elementText: label,
    module: MY_BETS_MODULE_NAME,
    moduleDisplayOrder: "null",
    position: "null",
  });
};

export const getMarketBlurbLinkClickEvent = (action: MarketBlurbLinkClick): NavigationEvent => {
  const { destinationUrl, elementText, variant } = action.payload;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl,
    elementText,
    module: `market blurb - ${variant}`,
    moduleDisplayOrder: "null",
    position: "null",
  });
};

export const getObbCreatedBetsLinkClickEvent = (
  action: ObbCreatedBetsLinkClickAction,
  state: ApplicationState,
): NavigationEvent => {
  const { urn, label, viewUrl, cardIndex, event } = action.payload;
  const pageType = getViewTypeSelector(state);
  const swimlane = "null";
  const { title, cardGroupTitle, tabName, verticalPosition } = getLayoutMetadata(urn);

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl: viewUrl,
    eventContext: event,
    elementText: label,
    module: getModuleData(pageType, swimlane, cardGroupTitle, title, tabName),
    position: verticalPosition?.toString() || "",
    moduleDisplayOrder: cardIndex != null ? (cardIndex + 1).toString() : "",
  });
};

export const getSettlementLinkNavigation = (action: SettlementLinkNavigationAction): NavigationEvent => {
  const { destinationUrl, currentTab } = action.payload;

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl,
    elementText: "need help",
    module: `my bets - ${currentTab}`,
    moduleDisplayOrder: "null",
    position: "null",
  });
};

export const getNavigateToEventFromPlayerPage = (
  action: NavigateToEventFromMarketScoreboard,
  state: ApplicationState,
): NavigationEvent => {
  const { text, url } = action.payload;
  const viewType = getViewTypeSelector(state);

  return buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: text,
    module: `${viewType} - ${text}`,
    destinationUrl: url,
    position: "null",
    moduleDisplayOrder: "null",
  });
};
