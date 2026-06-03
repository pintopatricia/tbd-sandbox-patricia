import { codecs } from "@ppb/tbd-urn-codecs";
import { GenericEvent } from "../../state/tagging/Event.types";
import {
  BetslipActivateBonus,
  BetslipCastBetChangeEvent,
  BetslipCastBetOrderChangeEvent,
  BetslipEachWayToggle,
  MarketDepthClickEvent,
  MarketGraphSelectGraphEvent,
  MarketGraphSelectViewEvent,
  MarketRulesToggleModalEvent,
  MarketTemplatePebbleSelection,
  NavigationTabClickEvent,
  ToggleRunnerInfoEvent,
  ToggleTimeFormEvent,
  SwitcherEvent,
  BetslipAccaInsuranceToggle,
  ToggleExpandableCardGroupEvent,
  ToggleMarketGraphEvent,
  ToggleRecentRacesEvent,
  NextRacesRaceClickEvent,
  StatisticsModalToggleEvent,
  ToggleRaceReplaysEvent,
} from "../../state/tagging/Interface.types";
import { MarketSwitch, ContentSummary } from "../../state/tagging/Navigation.types";
import { Competition, ExchangeMarket, Sport, SportEvent, SportsbookMarket, Race, Meeting } from "../../state/entities";
import { ApplicationState } from "../../state/ApplicationState.types";
import { Product } from "../../state/entities/user-preferences/UserPreferences.types";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";
import { TaggingAction, TaggingCategory, YesNo } from "./AnalyticsConstants";
import { getSportsbookBettingState } from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSportsbookMarketById } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { formatTime } from "../../helpers/dates";
import { getProductLabelByProductType, getProductLabelByProductTypeFilterItem } from "../../helpers/tagging";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { MarketCards, RaceMarketCards } from "../../state/layout/cards/Card.types";
import { MY_BETS_MODULE_NAME, ProductTypeFilterItem } from "../../state/layout/cards/MyBets.types";
import URN from "../../state/layout/URN";
import { BetslipSubType } from "../../state/betslip";
import { RaceStatus } from "../../clients/sca/sports-content-api-response-types";
import { BETSLIP_TYPE_TAG } from "./betslip";

const getExchangeMarketByURN = createExchangeMarketSelector();

export const getMarketSwitchEvent = (
  product: Product,
  market: ExchangeMarket | SportsbookMarket,
  event: SportEvent | null,
  competition: Competition | null,
  sport: Sport,
  itemVerticalPositionOnPage: number | undefined,
): MarketSwitch => ({
  event: "ga_event",
  action: TaggingAction.CLICKED,
  category: TaggingCategory.INTERFACE,
  label: product,
  [APPLICATION.MODULE]: "market module product switcher",
  [BUSINESS.SPORT_ID]: sport.sportId,
  [BUSINESS.SPORT_NAME]: sport.name,
  [BUSINESS.EVENT_ID]: event?.eventId ?? null,
  [BUSINESS.EVENT_NAME]: event?.name ?? null,
  [BUSINESS.MARKET_ID]: market.marketId,
  [BUSINESS.MARKET_NAME]: market.name,
  [BUSINESS.COMPETITION_ID]: competition?.competitionId ?? null,
  [BUSINESS.COMPETITION_NAME]: competition?.name ?? null,
  [DEVICE.POSITION]: itemVerticalPositionOnPage !== undefined ? itemVerticalPositionOnPage : null,
});

export const getMyAccountMenuToggleEvent = (opened: boolean): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: opened ? TaggingAction.OPENED : TaggingAction.CLOSED,
  label: "my account",
  [APPLICATION.MODULE]: "header",
});

export const getClickEvent = (label: string, moduleName: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: `${moduleName}`,
});

export const getLogoutClickEvent = (): GenericEvent => {
  const label = "my account - logout";
  const moduleName = "header";

  return getClickEvent(label, moduleName);
};

export const getOpenBetslipEvent = (product: Product): GenericEvent => ({
  event: "ga_event",
  action: TaggingAction.OPENED,
  category: TaggingCategory.INTERFACE,
  label: `${getProductLabelByProductType(product)} betslip`,
  [APPLICATION.MODULE]: "auto-open",
});

export const getSearchTabClickEvent = (title: string): GenericEvent => {
  const label = `market module product switcher - ${title}`;
  const moduleName = "search menu";

  return getClickEvent(label, moduleName);
};

export const getSearchBarFocusEvent = (preferredModuleName?: string): GenericEvent => {
  const label = "search box";
  const moduleName = preferredModuleName || "search menu";

  return getClickEvent(label, moduleName);
};

export const getNextRacesRaceClickEvent = (
  pageType: string | null,
  itemVerticalPositionOnPage: number | undefined,
  label: string,
): NextRacesRaceClickEvent => ({
  ...getClickEvent(label, `${pageType} - ${label}`),
  [DEVICE.POSITION]: itemVerticalPositionOnPage !== undefined ? itemVerticalPositionOnPage : null,
});

export const getSearchCancelClickEvent = (text: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CANCELLED,
  label: `search text - ${text}`,
  [APPLICATION.MODULE]: "search",
});

export const getSearchClearClickEvent = (labelText: string, moduleName?: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLEARED,
  label: labelText,
  [APPLICATION.MODULE]: moduleName || "search",
});

export const getToggleRunnerInfoEvent = (
  opened: boolean,
  runnerName: string,
  pageType: string | null,
  marketName: string,
): ToggleRunnerInfoEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: opened ? TaggingAction.OPENED : TaggingAction.CLOSED,
  label: `runner info - ${runnerName}`,
  [APPLICATION.MODULE]: `${pageType} - ${marketName}`,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getToggleRunnerInfoTabsEvent = (isDetailsTab: boolean): ToggleRunnerInfoEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: isDetailsTab ? "details" : "market graphs",
  [APPLICATION.MODULE]: !isDetailsTab ? "details" : "market graphs",
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getToggleRecentRacesEvent = (
  state: ApplicationState,
  pageType: string | null,
  cardUrn: string,
  runnerName: string,
  isClosed: boolean,
): ToggleRecentRacesEvent | null => {
  const getRaceMarketCard = createCardByURNSelector<RaceMarketCards, URN>();
  const getMarketCard = createCardByURNSelector<MarketCards, URN>();
  const card =
    getRaceMarketCard(state.layouts.cards.racemarkets, cardUrn) ?? getMarketCard(state.layouts.cards.markets, cardUrn);

  if (!card) {
    return null;
  }

  const cardType = card.typename.toLowerCase();

  return {
    event: "ga_event",
    category: TaggingCategory.INTERFACE,
    action: isClosed ? TaggingAction.CLOSED : TaggingAction.OPENED,
    label: `recent races - ${runnerName}`,
    [APPLICATION.MODULE]: `${pageType} - ${cardType}`,
    [DEVICE.POSITION]: null,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  };
};

export const getToggleExpandableCardGroupEvent = (
  isExpanded: boolean,
  title: string | undefined,
  viewTitle: string | null | undefined,
  viewType: string | null,
  itemVerticalPositionOnPage: number | undefined,
): ToggleExpandableCardGroupEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isExpanded ? TaggingAction.EXPAND : TaggingAction.COLLAPSE,
  label: title || "",
  [APPLICATION.MODULE]: `${viewType} - ${viewTitle}`,
  [DEVICE.POSITION]: itemVerticalPositionOnPage !== undefined ? itemVerticalPositionOnPage : null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getToggleTimeFormEvent = (
  isExpanded: boolean,
  race?: Race,
  meeting?: Meeting,
  sport?: Sport,
): ToggleTimeFormEvent => ({
  event: "ga_event",
  category: TaggingCategory.TEXT_MEDIA,
  action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
  label: "race verdict",
  [APPLICATION.MODULE]: "racecard",
  [BUSINESS.SPORT_ID]: sport?.sportId,
  [BUSINESS.SPORT_NAME]: sport?.name,
  [BUSINESS.RACE_ID]: race?.raceId,
  [BUSINESS.RACE_NAME]: race && meeting ? `${formatTime(race.startTime)} ${meeting.venue}` : undefined,
  [BUSINESS.MEETING_ID]: meeting?.meetingId,
  [BUSINESS.MEETING_NAME]: meeting?.entityName,
  // TODO: review this when adding post racing
  [BUSINESS.ANTEPOST_FLAG]: YesNo.No,
  [BUSINESS.IN_PLAY_INDICATOR]:
    race?.details?.status && [RaceStatus.UNDER_ORDERS, RaceStatus.OFF].includes(race.details.status)
      ? YesNo.Yes
      : YesNo.No,
  [BUSINESS.BET_DIRECTION]: null,
  [BUSINESS.CMS_CARD_TITLE]: null,
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
  [BUSINESS.CMS_COUPON_NAME]: null,
  [BUSINESS.PROVIDER_NAME]: "timeform",
});

export const getMarketRulesToggleModalEvent = (
  opened: boolean,
  pageType: string | null,
): MarketRulesToggleModalEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: opened ? TaggingAction.OPENED : TaggingAction.CLOSED,
  label: "market rules",
  [APPLICATION.MODULE]: `${pageType} - market rules`,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getToggleMarketGraphEvent = (
  pageType: string | null,
  runnerName: string,
  marketName: string,
  isClosed: boolean,
): ToggleMarketGraphEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isClosed ? TaggingAction.CLOSED : TaggingAction.OPENED,
  label: isClosed ? "market graphs" : `${runnerName} - market graphs`,
  [APPLICATION.MODULE]: `${pageType} - ${marketName}`,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getMarketGraphSelectViewEvent = (label: string): MarketGraphSelectViewEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: "market graphs",
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getMarketGraphSelectGraphEvent = (label: string): MarketGraphSelectGraphEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: "market graphs",
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getMarketDepthClickEvent = (
  state: ApplicationState,
  urn: string,
  isActive: boolean,
): MarketDepthClickEvent => {
  const {
    entities: { exchangemarkets },
  } = state;
  const market = getExchangeMarketByURN(exchangemarkets, urn);
  const label = `${market?.name} - market depth`;
  return {
    event: "ga_event",
    category: TaggingCategory.INTERFACE,
    action: isActive ? TaggingAction.OPENED : TaggingAction.CLOSED,
    label,
    [APPLICATION.MODULE]: "market - market depth",
    [DEVICE.POSITION]: null,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  };
};

export const getMyAccountToggleCashBalancesViewEvent = (
  jurisdiction: string,
  showLessToggle: boolean,
): GenericEvent => {
  const label = showLessToggle ? "show less" : "show more";
  const moduleName = `my_account_${jurisdiction.toLowerCase()}_mobile`;

  return getClickEvent(label, moduleName);
};

export const getMarketTemplatePebbleSelectionEvent = (label = ""): MarketTemplatePebbleSelection => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: "market - market pebbles",
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  [DEVICE.POSITION]: null,
});

export const getBetslipHeaderClickEvent = (action: TaggingAction, type: BetslipSubType): GenericEvent => ({
  action,
  label: BETSLIP_TYPE_TAG[type],
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  [APPLICATION.MODULE]: "betslip",
});

export const getBetslipAccordionHeaderClickEvent = (action: TaggingAction): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action,
  label: "selections",
  [APPLICATION.MODULE]: "betslip",
});

export const getBetslipSportsbookMultipleBetTypeClickEvent = (label: string): GenericEvent =>
  getClickEvent(label, "betslip");

export const getBetslipSbkRemoveAllEvent = (): GenericEvent => getClickEvent("remove all selections", "betslip");

export const getBetslipBonusActivationEvent = (product: string): BetslipActivateBonus => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.TOGGLE_ON,
  label: `use elegible bonus ${product}`,
  [APPLICATION.MODULE]: "betslip",
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  [DEVICE.POSITION]: null,
});

export const getJackpotMerchandiseViewEvent = (label: string, name: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.SHOW,
  label,
  [APPLICATION.MODULE]: name,
});

export const getBetslipEachWayToggleEvent = ({ isSelected }: { isSelected: boolean }): BetslipEachWayToggle => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
  label: "each way",
  [APPLICATION.MODULE]: "betslip",
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getBetslipAccaInsuranceToggleEvent = ({
  isSelected,
}: {
  isSelected: boolean;
}): BetslipAccaInsuranceToggle => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
  label: "acca insurance",
  [APPLICATION.MODULE]: "betslip",
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getBetslipMyOddsBoostToggleEvent = ({
  isSelected,
}: {
  isSelected: boolean;
}): BetslipAccaInsuranceToggle => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
  label: "my odds boost",
  [APPLICATION.MODULE]: "betslip",
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getBetslipCastBetChangeEvent = (
  state: ApplicationState,
  combinationId: string,
): BetslipCastBetChangeEvent | null => {
  // Cast bet combinations have only one leg, with legId equal to combinationId
  const { combinations, legs } = getSportsbookBettingState(state);
  const [legId] = combinations[combinationId].legs;
  const leg = legs[legId];
  if (!leg) {
    return null;
  }

  return {
    event: "ga_event",
    category: TaggingCategory.INTERFACE,
    action: TaggingAction.CLICKED,
    label: leg.legType,
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
    [DEVICE.POSITION]: null,
  };
};

export const getBetslipCastBetOrderChangeEvent = (
  state: ApplicationState,
  combinationId: string,
  updatedRunnerId: string,
): BetslipCastBetOrderChangeEvent | null => {
  const { combinations, legs, runners } = getSportsbookBettingState(state);
  const [legId] = combinations[combinationId].legs;
  const leg = legs[legId];
  if (!leg) {
    return null;
  }

  const runner = runners[updatedRunnerId];
  if (!runner) {
    return null;
  }

  const { marketId, selectionId } = runner;
  const { sportsbookmarkets } = state.entities;
  const market = getSportsbookMarketById(sportsbookmarkets, marketId);
  if (!market) {
    return null;
  }

  const { runners: marketRunners = [] } = market;
  const selection = marketRunners.find((r) => r.selectionId === selectionId);
  if (!selection) {
    return null;
  }

  return {
    event: "ga_event",
    category: TaggingCategory.INTERFACE,
    action: TaggingAction.REPOSITIONED,
    label: `${leg.legType} - ${selection.name}`,
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
    [DEVICE.POSITION]: null,
  };
};

export const getSwitcherEvent = (payload: { label: string; pageType: string }): SwitcherEvent => {
  const TYPE_CONFIG: { [key: string]: string } = {
    GenericSwitcherCard: "generic",
    RaceSwitcherCard: "race",
  };

  const type = TYPE_CONFIG[payload.pageType];

  return {
    event: "ga_event",
    action: TaggingAction.OPENED,
    category: TaggingCategory.INTERFACE,
    label: payload.label,
    [APPLICATION.MODULE]: `${type} - power nav`,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
    [DEVICE.POSITION]: null,
  };
};

export const getNavigationTabClickEvent = (
  label: string,
  pageType: string | null,
  itemVerticalPositionOnPage: number | undefined,
): NavigationTabClickEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: `${pageType} - market ribbon`,
  [DEVICE.POSITION]: itemVerticalPositionOnPage !== undefined ? itemVerticalPositionOnPage : null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getFilterOpenEvent = (label: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.OPENED,
  label,
  [APPLICATION.MODULE]: "filter",
});

export const getFilterCloseEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLOSED,
  label: "cancel",
  [APPLICATION.MODULE]: "filter",
});

export const getFilterApplyEvent = (label: string): GenericEvent => getClickEvent(label, "filter");

export const getFilterResetClickEvent = (label: string): GenericEvent => getClickEvent(label, "filter");

export const getSawCardEvent = (label: string, moduleName: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.SAW,
  label,
  [APPLICATION.MODULE]: `${moduleName}`,
});

export const getContentSummaryCollapseEvent = (title: string, collapsed: boolean): ContentSummary | null => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: !collapsed ? TaggingAction.EXPAND : TaggingAction.COLLAPSE,
  label: title,
  [APPLICATION.MODULE]: "seo footer",
  [BUSINESS.CMS_CARD_TITLE]: null,
  [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
  [BUSINESS.CMS_COUPON_NAME]: null,
});

export const getMyBetsCancelAllEvent = (): GenericEvent => getClickEvent("cancel all", "my bets");

export const getBetslipSbkReAddSelectionsEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
  label: "full receipt",
  [APPLICATION.MODULE]: "bet receipt",
});

export const getMyBetsSbkAddPreviousSelectionsEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
  label: "re-use selections",
  [APPLICATION.MODULE]: "my bets",
});

export const getBetslipSbkNotificationShownEvent = (label: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.SAW,
  label,
  [APPLICATION.MODULE]: "betslip",
});

export const getPNInteractionClickEvent = (label: string, module: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: module,
});

export const getSwitchProductEvent = (label: string, pageType: string | null): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.SWITCH_PRODUCT,
  label,
  [APPLICATION.MODULE]: `${pageType} - bottom ribbon`,
});

export const getToggleShowMoreEvent = (
  pageType: string | null,
  tab: string | null,
  market: string | null,
  label: string,
): ToggleRecentRacesEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${tab} - ${market}`,
  [DEVICE.POSITION]: null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
});

export const getMarketBlurbExpandableEvent = (
  pageType: string | null,
  tab: string | null,
  market: string | null,
  open: boolean | null,
): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: open ? "view more" : "view less",
  [APPLICATION.MODULE]: `${pageType} - ${tab} - ${market}`,
});

export const getStatisticsModalToggleEvent = (
  pageType: string | null,
  itemVerticalPositionOnPage: number | undefined,
  label: string,
  isOpen: boolean,
): StatisticsModalToggleEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
  label,
  [APPLICATION.MODULE]: `${pageType} - stats and viz`,
  [DEVICE.POSITION]: itemVerticalPositionOnPage !== undefined ? itemVerticalPositionOnPage : null,
});

export const getStatisticsItemClickEvent = (label: string): GenericEvent => ({
  ...getClickEvent(label, "statistics"),
});

export const getNextRacesFilterClickEvent = (label: string, moduleName: string): GenericEvent => ({
  ...getClickEvent(label, moduleName),
});

export const getMarketSnackBarEvent = (label: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.SAW,
  label,
  [APPLICATION.MODULE]: "market snack bar",
});

export const getAzSwitchToggleEvent = (label: string, isToggleOn: boolean): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isToggleOn ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
  label,
  [APPLICATION.MODULE]: "sort",
});

export const getMyBetsOrderTypePressEvent = (
  productType: string,
  orderType: string,
  moduleName: string,
): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: `${getProductLabelByProductTypeFilterItem(productType as ProductTypeFilterItem)} - ${orderType} bets`,
  [APPLICATION.MODULE]: moduleName,
});

export const getPromoDescriptionToggleEvent = (
  pageType: string | null,
  module: string,
  label: string,
  isOpen: boolean,
): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${module}`,
});

export const getToggleAccordionEvent = (module: string, isOpen: boolean): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: isOpen ? TaggingAction.SHOW : TaggingAction.HIDE,
  [APPLICATION.MODULE]: module,
});

export const getCopyBetIdToClipboardEvent = (module: string | null): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: "copy to clipboard",
  [APPLICATION.MODULE]: `${module}`,
});

export const getRaceReplaysToggleEvent = (
  state: ApplicationState,
  pageType: string | null,
  cardUrn: string,
  isClosed: boolean,
  label: string,
): ToggleRaceReplaysEvent | null => {
  const getRaceMarketCard = createCardByURNSelector<RaceMarketCards, URN>();
  const getMarketCard = createCardByURNSelector<MarketCards, URN>();
  const card =
    getRaceMarketCard(state.layouts.cards.racemarkets, cardUrn) ?? getMarketCard(state.layouts.cards.markets, cardUrn);

  if (!card) {
    return null;
  }

  const cardType = card.typename.toLowerCase();

  return {
    event: "ga_event",
    category: TaggingCategory.INTERFACE,
    action: isClosed ? TaggingAction.CLOSED : TaggingAction.OPENED,
    label,
    [APPLICATION.MODULE]: `${pageType} - ${cardType}`,
    [DEVICE.POSITION]: null,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  };
};

export const getMaxPayoutAcceptMessageClickEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: `accept - warningI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT`,
  [APPLICATION.MODULE]: "betslip",
});

export const getLoyaltyPromotionBottomSheetOpenEvent = (pageType: string | null, label: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.OPENED,
  label,
  [APPLICATION.MODULE]: `${pageType} - banner details`,
});

export const getLoyaltyPromotionBottomSheetCloseEvent = (pageType: string | null, label: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLOSED,
  label,
  [APPLICATION.MODULE]: `${pageType} - banner details`,
});

export const getMyBetsBetSharingPreviewOnTapEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.OPENED,
  label: "bet sharing - preview button",
  [APPLICATION.MODULE]: MY_BETS_MODULE_NAME,
});

export const getMyBetsBetSharingDismissOnTapEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLOSED,
  label: "bet sharing - dismiss button",
  [APPLICATION.MODULE]: MY_BETS_MODULE_NAME,
});

export const getMyBetsBetSharingShareBetOnTapEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: "share your bet button",
  [APPLICATION.MODULE]: "share your bet popup",
});

export const getMyBetsBetSharingShareImageOnTapEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: "share image button",
  [APPLICATION.MODULE]: "share your bet popup",
});

export const getMyBetsAccaFreezeOpenedEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.OPENED,
  label: "acca freeze available",
  [APPLICATION.MODULE]: "my bets",
});

export const getMyBetsAccaFreezeClosedEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLOSED,
  label: "acca freeze bottom sheet",
  [APPLICATION.MODULE]: "acca freeze bottom sheet",
});

export const getBetMutationAccaFreezeSelectedEvent = (eventUrn: URN): GenericEvent => {
  const eventId = codecs.event.decode(eventUrn);
  return {
    event: "ga_event",
    category: TaggingCategory.INTERFACE,
    action: TaggingAction.SELECTED,
    label: `card - ${eventId}`,
    [APPLICATION.MODULE]: "acca freeze bottom sheet",
  };
};

export const getBetMutationAccaFreezeDeselectedEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.DESELECTED,
  label: "card",
  [APPLICATION.MODULE]: "acca freeze bottom sheet",
});

export const getBetMutationAccaFreezeConfirmEvent = (
  eventName: string,
  matchScore: string,
  timeFrozen: string,
): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: `confirm freeze - ${eventName} - ${matchScore} - ${timeFrozen}`,
  [APPLICATION.MODULE]: "my bets",
});

export enum PNLabelsEnum {
  ON = "notification on",
  OFF = "notification off",
  CLOSE = "close",
}

export enum PNModulesEnum {
  NOTIFICATION = "notifications",
  CONFIRMATION = "notifications confirmation",
}
