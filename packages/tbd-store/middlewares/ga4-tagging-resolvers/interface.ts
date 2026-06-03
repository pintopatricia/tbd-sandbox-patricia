import { buildInterfaceEvent, buildSearchEvent, InterfaceEvent, SearchEvent } from "tagging-library";
import { codecs } from "@ppb/tbd-urn-codecs";

import { ApplicationState } from "../../state";
import {
  MyBetsExchangeBetEditCloseAction,
  MyBetsExchangeOrderStatusSwitch,
  MyBetsHeaderTooltipToggleAction,
  MyBetsHeritageToggleFilterClick,
  MyBetsOnAccordionToggle,
  MyBetsOrderTypeFilterClick,
  MyBetsSportsbookAddPreviousSelectionsClickAction,
  MyBetsExchangeBetEditPressAction,
} from "../../actions/my-bets";
import { BetMutationAccaFreezeSelectedAction, BetMutationFreezeLegAction } from "../../actions/bet-mutation";
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
import {
  MarketGraphSelectGraphAction,
  MarketGraphSelectViewAction,
  MarketRulesModalToggleAction,
  MyAccountIconClickAction,
  ToggleGraphAction,
  ToggleRecentRaceAction,
  AzSwitchClickAction,
  NextRacesFilterClickAction,
  PromoDescriptionToggleAction,
  RaceReplaysToggleAction,
  StatisticsItemClickAction,
  StatisticsModalToggleAction,
  ToggleExpandableCardGroupAction,
  ToggleRunnerInfo,
  FilterApplyAction,
  FilterOpenAction,
  FilterResetClickAction,
  SawCardAction,
  ToggleShowMoreRunnersAction,
  ContentSummaryCollapseEvent,
  NextRacesRaceClick,
  SwitcherOpen,
  NavigationTabClickAction,
  ToggleTimeformCard,
  PebbleItemSelectionAction,
  GenerosityWalletButtonAction,
  GenerosityWalletCloseClickAction,
  FreeBetsWalletToggleAction,
  GenerosityWalletPebbleClickAction,
  GenerosityWalletApplyButtonClickAction,
  BetslipSliderInteractionAction,
  BetslipSliderDisplayedAction,
} from "../../actions/interface";
import {
  BetslipAccordionHeaderClick,
  BetslipExchangeBonusChangeAction,
  BetslipExchangeIncrementSizeAction,
  BetslipExchangeUnmatchedPersistenceItemClickAction,
  BetslipHeaderClickAction,
  BetslipOpenAction,
  BetslipSportsbookAccaInsuranceToggleAction,
  BetslipSportsbookCastBetChange,
  BetslipSportsbookCastBetOrderChange,
  BetslipSportsbookEachWayToggleAction,
  BetslipSportsbookIncrementStakeAction,
  BetslipSportsbookNotificationShownAction,
  BetslipObbNotificationShownAction,
  BetslipSportsbookMultipleBetTypeClick,
  BetslipSportsbookPriceBoostToggleAction,
  BetslipSportsbookTabSwitchAction,
} from "../../actions/betslip";
import {
  SearchCancelAction,
  SearchClearResultsAction,
  SearchTabClickAction,
  SportsFilterClickAction,
  SearchHistoryClickAction,
} from "../../actions/browse";
import { URLBetslipDeeplinkAction } from "../../actions/commands";
import { FavouriteMarketsToggleFavouriteAction } from "../../actions/favourite-markets";
import { NotFoundViewLoadedAction } from "../../actions/navigation";
import {
  BroadcastsAndStatisticsCardToggleAction,
  BroadcastsCardToggleAction,
  TimeFormBroadCastsCardToggleAction,
} from "../../actions/media";
import { UpdateMarketDepth, SwitchProductPreferenceAction } from "../../actions/preferences";
import { getProductLabelByProductType, getProductLabelByProductTypeFilterItem } from "../../helpers/tagging";
import { getBetslipVisibilityState } from "../../state/betslip/betslip-card-selectors";
import {
  getSportsbookBettingCombinations,
  getSportsbookBettingState,
} from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { LiveStreamBroadcastsOptions, ObbLegTemplateIds } from "../../state/constants";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { getSportsbookMarketById } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import {
  BroadcastsAndStatisticsCards,
  BroadcastsCards,
  MarketCards,
  RaceMarketCards,
  TimeFormBroadCastsCards,
} from "../../state/layout/cards/Card.types";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { MY_BETS_MODULE_NAME, ProductTypeFilterItem } from "../../state/layout/cards/MyBets.types";
import { createGetHydratedPebbleCardGroupByURNSelector } from "../../state/layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import URN from "../../state/layout/URN";
import { getLayoutMetadata } from "../../state/layout-snapshot";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { BETSLIP_TYPE_TAG } from "../tagging-resolvers/betslip";
import {
  getClearBetslipMetrics,
  getCurrentUrlOrViewType,
  getMappedBetslipTabName,
  getModuleData,
  getBetMetrics,
  swipedDirectionToTaggingAction,
} from "./helpers";
import {
  ObbClosePlayerPickerModalAction,
  ObbEventSelectionAction,
  ObbSquadBetPlayerPickerOpenAction,
  ObbToggleSquadBetPlayerPickerSquadParticipantAction,
  ObbSquadBetPlayerPickerBetButtonClickAction,
  ObbEnhancedTrackingPlayerCounterAction,
  ObbSquadVsSquadTogglePlayersTooltipAction,
  ObbCardGroupSectionToggledAction,
  ObbCardGroupLayoutSelectionAction,
  ObbCardGroupShowMoreClickedAction,
  ObbSquadBetPlayerPickerRemoveSquadParticipantAction,
  ObbEventPopularsShowMoreAction,
  ObbOnboardingCardsCardGroupNavigationAction,
  ObbOnboardingCardsCardGroupDisplayedAction,
} from "../../actions/obb";
import { ConfirmationAction } from "../../actions/confirmation";
import {
  BettingObbSbkClearAction,
  BettingObbSbkKeepAction,
  BettingSportsbookGenerosityWalletBetAction,
} from "../../actions/betting";
import {
  FetchGamingSearchResultsSuccessAction,
  GamingSearchHistoryPebbleAction,
  GamingSearchResultsClearAction,
} from "../../actions/gaming-search";
import {
  createObbSquadBetCardWithModalFieldsByURNSelector,
  createObbSquadVsSquadCardWithModalFieldsByURNSelector,
} from "../../state/layout/cards/obb-card/obb-card-selectors";
import { ObbParticipant } from "../../state/entities/obb-legs/ObbLegs.types";
import { obbTemplateIds } from "../../helpers/obb-betting";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

const getViewTypeSelector = createViewTypeSelector();
const getExchangeMarketByURN = createExchangeMarketSelector();
const getHydratedPebbleCardGroupByURN = createGetHydratedPebbleCardGroupByURNSelector();
const getObbSquadBetCardByURN = createObbSquadBetCardWithModalFieldsByURNSelector();
const getObbSquadVsSquadCardByURN = createObbSquadVsSquadCardWithModalFieldsByURNSelector();

const BETSLIP_MODULE_NAME = "betslip";
const BET_RECEIPT_MODULE_NAME = "bet receipt";

export const getClickEvent = (elementText: string, module: string): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText,
    module,
  });

const getCopyEvent = (elementText: string, module: string): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.COPIED,
    elementText,
    module,
  });

export const getMyBetsExchangeOrderStatusClickEvent = (action: MyBetsExchangeOrderStatusSwitch): InterfaceEvent => {
  const { orderStatusFilterLabel } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `exchange - ${orderStatusFilterLabel}`,
    module: MY_BETS_MODULE_NAME,
  });
};

export const getBetReceiptToggleClickEvent = (
  action: PNSubscribeEventsAction | PNUnsubscribeEventsAction,
): InterfaceEvent => {
  const { isSelected } = action.payload;

  return buildInterfaceEvent({
    elementText: "receive live alerts",
    module: BET_RECEIPT_MODULE_NAME,
    action: isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
  });
};

export const getEventPageNotificationsToggleEvent = (action: PNEventPageNotificationsToggleAction): InterfaceEvent => {
  const { isSelected, moduleName } = action.payload;

  return buildInterfaceEvent({
    action: isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
    elementText: "push notifications",
    module: moduleName,
  });
};

export const getBetReceiptSuccessMessageSawEvent = (
  action:
    | PNSubscribeEventsSuccessAction
    | PNPartialSubscribeEventsSuccessAction
    | PNUnsupportedSubscribeEventsSuccessAction,
): InterfaceEvent => {
  const { label } = action.payload;

  return buildInterfaceEvent({
    elementText: label,
    module: BET_RECEIPT_MODULE_NAME,
    action: TaggingAction.SAW,
  });
};

export const getMyAccountMenuToggleEvent = (action: MyAccountIconClickAction): InterfaceEvent => {
  const { payload: opened } = action;

  return buildInterfaceEvent({
    action: opened ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: "my account",
    module: "header",
  });
};

export const getLogoutClickEvent = (): InterfaceEvent => getClickEvent("my account - logout", "header");

export const getBetslipHeaderClickEvent = (action: BetslipHeaderClickAction): InterfaceEvent => {
  const { isCollapsed, betslipSubType } = action.payload;

  return buildInterfaceEvent({
    action: isCollapsed ? TaggingAction.CLOSED : TaggingAction.OPENED,
    elementText: BETSLIP_TYPE_TAG[betslipSubType],
    module: BETSLIP_MODULE_NAME,
  });
};

export const getBetslipAccordionHeaderClickEvent = (action: BetslipAccordionHeaderClick): InterfaceEvent => {
  const { isExpanded } = action.payload;

  return buildInterfaceEvent({
    action: isExpanded ? TaggingAction.EXPAND : TaggingAction.COLLAPSE,
    elementText: "selections",
    module: BETSLIP_MODULE_NAME,
  });
};

export const getBetslipSportsbookTabSwitchEvent = (action: BetslipSportsbookTabSwitchAction): InterfaceEvent => {
  const { tabName } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: getMappedBetslipTabName(tabName),
    module: BETSLIP_MODULE_NAME,
  });
};

export const getConfirmSportsbookBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CONFIRMED_BET,
    elementText: "confirm bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getEditSportsbookBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.EDITED_BET,
    elementText: "edit bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getBetslipSportsbookMultipleBetTypeClickEvent = (
  action: BetslipSportsbookMultipleBetTypeClick,
  state: ApplicationState,
): InterfaceEvent => {
  const combinations = getSportsbookBettingCombinations(state);

  const { combinationId } = action.payload;
  const { betType: elementText } = combinations[combinationId];

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText,
    module: BETSLIP_MODULE_NAME,
  });
};

export const getExchangePriceChangeEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CHANGED_ODDS,
    elementText: "betting",
    module: BETSLIP_MODULE_NAME,
  });

export const getChangePersistenceTypeClickEvent = (
  action: BetslipExchangeUnmatchedPersistenceItemClickAction,
): InterfaceEvent | null => {
  const { persistenceType } = action.payload;

  return buildInterfaceEvent({
    elementText: persistenceType,
    module: BETSLIP_MODULE_NAME,
    action: TaggingAction.TOGGLE_ON,
  });
};

export const getOpenPersistenceTypeMenuEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    elementText: "at in play options",
    module: BETSLIP_MODULE_NAME,
    action: TaggingAction.SHOW,
  });

export const getExchangeConfirmBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CONFIRMED_BET,
    elementText: "place bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getPlaceSportsbookBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.SUBMITTED_BET,
    elementText: "place bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getAutoConfirmSportsbookBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.AUTO_CONFIRMED_BET,
    elementText: "place bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getPlaceExchangeBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.SUBMITTED_BET,
    elementText: "place bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getExchangeAutoConfirmedBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.AUTO_CONFIRMED_BET,
    elementText: "place bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getExchangeMyBetsEditClickEvent = (
  action: MyBetsExchangeBetEditPressAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { betId } = action.payload;
  const { selection_id = "", selection = "" } = getBetMetrics(state, betId) || {};
  const selectionId = selection_id.toString();

  const label = `betId: ${betId} selection: ${selection} selectionId: ${selectionId}`;

  return buildInterfaceEvent({
    action: TaggingAction.EDIT_UNMATCHED_BET,
    elementText: label,
    module: BETSLIP_MODULE_NAME,
  });
};

export const getSbkIncrementStakeEvent = (action: BetslipSportsbookIncrementStakeAction): InterfaceEvent => {
  const { increment, currencySymbol } = action.payload;
  const symbol = currencySymbol || "";

  return buildInterfaceEvent({
    action: TaggingAction.SELECTED,
    elementText: `+${symbol}${increment} quick stake`,
    module: BETSLIP_MODULE_NAME,
  });
};

export const getExcIncrementSizeEvent = (action: BetslipExchangeIncrementSizeAction): InterfaceEvent => {
  const { increment, currencySymbol } = action.payload;
  const symbol = currencySymbol || "";

  const eventPayload = {
    action: TaggingAction.SELECTED,
    elementText: `+${symbol}${increment} quick stake`,
    module: BETSLIP_MODULE_NAME,
  };

  return buildInterfaceEvent(eventPayload);
};

export const getBetslipSbkRemoveAllEvent = (): InterfaceEvent =>
  getClickEvent("remove all selections", BETSLIP_MODULE_NAME);

export const getBetslipSbkDepositToConfirmBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "deposit to confirm bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getBetslipSbkDepositToPlaceBetClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "deposit to place bet",
    module: BETSLIP_MODULE_NAME,
  });

export const getBetslipSbkReAddSelectionsEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
    elementText: "full receipt",
    module: "bet receipt",
  });

export const getMyBetsReAddSelectionsEvent = (
  action: MyBetsSportsbookAddPreviousSelectionsClickAction,
): InterfaceEvent => {
  const { source } = action.payload;
  return buildInterfaceEvent({
    action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
    elementText: "re-use selections",
    module: `my bets - ${source}`,
  });
};
export const getBetslipSbkNotificationShownEvent = (
  action: BetslipSportsbookNotificationShownAction,
): InterfaceEvent => {
  const { label } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.SAW,
    elementText: label,
    module: BETSLIP_MODULE_NAME,
  });
};

export const getBetslipObbNotificationShownEvent = (action: BetslipObbNotificationShownAction): InterfaceEvent => {
  const { label } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.SAW,
    elementText: label,
    module: BETSLIP_MODULE_NAME,
  });
};

export const getMarketRulesToggleModalEvent = (
  action: MarketRulesModalToggleAction,
  state: ApplicationState,
): InterfaceEvent => {
  const pageType = getViewTypeSelector(state);
  const { open } = action.payload;

  return buildInterfaceEvent({
    action: open ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: "market rules",
    module: `${pageType} - market rules`,
  });
};

export const getToggleMarketGraphEvent = (action: ToggleGraphAction, state: ApplicationState): InterfaceEvent => {
  const { runnerName, marketName, isClosed } = action.payload;
  const pageType = getViewTypeSelector(state);

  return buildInterfaceEvent({
    action: isClosed ? TaggingAction.CLOSED : TaggingAction.OPENED,
    elementText: isClosed ? "market graphs" : `${runnerName} - market graphs`,
    module: `${pageType} - ${marketName}`,
  });
};

export const getToggleRecentRacesEvent = (
  action: ToggleRecentRaceAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { runnerName, cardUrn, isClosed } = action.payload;
  const pageType = getViewTypeSelector(state);
  const getRaceMarketCard = createCardByURNSelector<RaceMarketCards, URN>();
  const getMarketCard = createCardByURNSelector<MarketCards, URN>();
  const card =
    getRaceMarketCard(state.layouts.cards.racemarkets, cardUrn) ?? getMarketCard(state.layouts.cards.markets, cardUrn);

  if (!card) {
    return null;
  }

  const cardType = card.typename.toLowerCase();

  return buildInterfaceEvent({
    action: isClosed ? TaggingAction.CLOSED : TaggingAction.OPENED,
    elementText: `recent races - ${runnerName}`,
    module: `${pageType} - ${cardType}`,
  });
};

export const getMarketGraphSelectViewEvent = (action: MarketGraphSelectViewAction): InterfaceEvent => {
  const { label } = action.payload;

  return getClickEvent(label, "market graphs");
};

export const getMarketGraphSelectGraphEvent = (action: MarketGraphSelectGraphAction): InterfaceEvent => {
  const { label } = action.payload;

  return getClickEvent(label, "market graphs");
};

export const getMarketDepthClickEvent = (action: UpdateMarketDepth, state: ApplicationState): InterfaceEvent => {
  const { isActive, urn } = action.payload;
  const {
    entities: { exchangemarkets },
  } = state;
  const market = getExchangeMarketByURN(exchangemarkets, urn);
  const label = `${market?.name} - market depth`;

  return buildInterfaceEvent({
    action: isActive ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: label,
    module: "market - market depth",
  });
};

export const getPebbleSelectionClickEvent = (
  action: PebbleItemSelectionAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { cardGroupURN, pebbleURN, pebbleTypename } = action.payload;
  const cardGroup = getHydratedPebbleCardGroupByURN(state.layouts.cardgroups.pebblecardgroups, cardGroupURN);
  const pebbleTitle = cardGroup?.items.find((item) => item.urn === pebbleURN)?.name || "";

  if (pebbleTypename === "PackagedCreatedBetsCard") {
    const pageType = getViewTypeSelector(state);
    const { pebbleCardGroupTitle, tabName } = getLayoutMetadata(cardGroupURN);
    return getClickEvent(pebbleTitle, `${pageType} - ${pebbleCardGroupTitle} - ${tabName}`);
  }

  return getClickEvent(pebbleTitle, "market - market pebbles");
};

export const getSearchTabClickEvent = (action: SearchTabClickAction): InterfaceEvent =>
  getClickEvent(`market module product switcher - ${action.payload}`, "search menu");

export const getSearchBarFocusEvent = (_action: unknown, state: ApplicationState): InterfaceEvent => {
  const currentView = getCurrentUrlOrViewType(state);
  return getClickEvent("search box", getModuleData("search menu", currentView));
};

export const getGamingSearchBarFocusEvent = (): InterfaceEvent => getClickEvent("search box", "games search");

export const getSearchCancelClickEvent = (action: SearchCancelAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CANCELLED,
    elementText: `search text - ${action.payload.text}`,
    module: "search",
  });

export const getSportsFilterClickEvent = (action: SportsFilterClickAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `sport filter - ${action.payload.sportFilter}`,
    module: "search filters",
    eventContext: `input search term - ${action.payload.searchTerm}`,
  });

export const getSearchHistoryClickEvent = (action: SearchHistoryClickAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `search history - ${action.payload.text}`,
    module: "search history",
  });

export const getGamingSearchCancelClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "cancel",
    module: "games search",
  });

export const getGamingSearchHistoryPebbleClickEvent = (action: GamingSearchHistoryPebbleAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `search pebbles - ${action.payload.text}`,
    module: "search pebbles",
  });

export const getGamingSearchResults = (action: FetchGamingSearchResultsSuccessAction): SearchEvent => {
  const numberOfResults = action.payload.gamingSearchResults.length;
  const searchTerm = action.payload.inputSearchTerm;
  const hasSearchResults = numberOfResults > 0;
  return buildSearchEvent({
    searchTerm,
    searchCount: `${numberOfResults}`,
    searchResult: hasSearchResults ? "true" : "false",
  });
};

export const getSearchClearClickEvent = (action: SearchClearResultsAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLEARED,
    elementText: `search text - ${action.payload.text}`,
    module: "search",
  });

export const getGamingSearchClearClickEvent = (action: GamingSearchResultsClearAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLEARED,
    elementText: `search text - ${action.payload.text}`,
    module: "games search",
  });

export const getToggleRunnerInfoEvent = (action: ToggleRunnerInfo, state: ApplicationState): InterfaceEvent => {
  const { runnerName, marketName, isOpening } = action.payload;
  const pageType = getViewTypeSelector(state);

  return buildInterfaceEvent({
    action: isOpening ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: `runner info - ${runnerName}`,
    module: `${pageType} - ${marketName}`,
  });
};

export const getToggleExpandableCardGroupEvent = (
  action: ToggleExpandableCardGroupAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { isExpanded, title } = action.payload;
  const {
    layouts: { views },
    router: { currentUrn: currentViewUrn },
  } = state;

  const viewType = getViewTypeSelector(state);
  const viewTitle = currentViewUrn && getViewbyURN(views, currentViewUrn)?.title;

  return buildInterfaceEvent({
    action: isExpanded ? TaggingAction.EXPAND : TaggingAction.COLLAPSE,
    elementText: title || "",
    module: `${viewType} - ${viewTitle}`,
  });
};

export const getBetReceiptExchangeDoneClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "bet receipt",
    module: "bet receipt",
  });

export const getBetslipBonusActivationEvent = (action: BetslipExchangeBonusChangeAction): InterfaceEvent | null => {
  const { isFreeBetsSelected, product } = action.payload;

  return buildInterfaceEvent({
    action: isFreeBetsSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
    elementText: `use elegible bonus ${product}`,
    module: "betslip",
  });
};

export const getContentSummaryCollapseEvent = (action: ContentSummaryCollapseEvent): InterfaceEvent =>
  buildInterfaceEvent({
    action: !action.payload.collapsed ? TaggingAction.EXPAND : TaggingAction.COLLAPSE,
    elementText: action.payload.title,
    module: "seo footer",
  });

export const getNextRacesRaceClickEvent = (_: NextRacesRaceClick, state: ApplicationState): InterfaceEvent => {
  const pageType = getViewTypeSelector(state);
  const label = "race time selector";

  return getClickEvent(label, `${pageType} - ${label}`);
};

export const getBroadcastsToggleEvent = (
  action: BroadcastsCardToggleAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { isExpanded, cardUrn } = action.payload;
  const getBroadcastsCard = createCardByURNSelector<BroadcastsCards, URN>();
  const broadcastsCard = getBroadcastsCard(state.layouts.cards.broadcasts, cardUrn);
  if (!broadcastsCard) return null;

  return buildInterfaceEvent({
    action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    elementText: broadcastsCard.broadcasts.liveVideoUrl
      ? LiveStreamBroadcastsOptions.LiveVideo
      : LiveStreamBroadcastsOptions.DataViz,
    module: "media player",
  });
};

export const getBroadcastsAndStatisticsToggleEvent = (
  action: BroadcastsAndStatisticsCardToggleAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { isExpanded, cardUrn } = action.payload;
  const getBroadCastsAndStatisticsCard = createCardByURNSelector<BroadcastsAndStatisticsCards, URN>();
  const card = getBroadCastsAndStatisticsCard(state.layouts.cards.broadcastsandstatistics, cardUrn);
  if (!card) return null;

  return buildInterfaceEvent({
    action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    elementText: card.broadcasts?.liveVideoUrl
      ? LiveStreamBroadcastsOptions.LiveVideo
      : LiveStreamBroadcastsOptions.DataViz,
    module: "media player",
  });
};

export const getTimeFormBroadCastsToggleEvent = (
  action: TimeFormBroadCastsCardToggleAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { isExpanded, cardUrn } = action.payload;
  const getTimeFormBroadCastsCard = createCardByURNSelector<TimeFormBroadCastsCards, URN>();
  const timeFormBroadCastsCard = getTimeFormBroadCastsCard(state.layouts.cards.timeformbroadcasts, cardUrn);
  if (!timeFormBroadCastsCard) return null;

  return buildInterfaceEvent({
    action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    elementText: timeFormBroadCastsCard.broadcasts?.liveVideoUrl
      ? LiveStreamBroadcastsOptions.LiveVideo
      : LiveStreamBroadcastsOptions.DataViz,
    module: "media player",
  });
};

export const getBetslipEachWayToggleEvent = (action: BetslipSportsbookEachWayToggleAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: action.payload.isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
    elementText: "each way",
    module: "betslip",
  });

export const getBetslipAccaInsuranceToggleEvent = (
  action: BetslipSportsbookAccaInsuranceToggleAction,
): InterfaceEvent =>
  buildInterfaceEvent({
    action: action.payload.isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
    elementText: "acca insurance",
    module: "betslip",
  });

export const getBetslipMyOddsBoostToggleEvent = (action: BetslipSportsbookPriceBoostToggleAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: action.payload.isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
    elementText: "my odds boost",
    module: "betslip",
  });

export const getBetslipCastBetChangeEvent = (
  action: BetslipSportsbookCastBetChange,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { combinationId } = action.payload;
  // Cast bet combinations have only one leg, with legId equal to combinationId
  const { combinations, legs } = getSportsbookBettingState(state);
  const [legId] = combinations[combinationId].legs;
  const leg = legs[legId];
  if (!leg) return null;

  return getClickEvent(leg.legType, "betslip");
};

export const getBetslipCastBetOrderChangeEvent = (
  action: BetslipSportsbookCastBetOrderChange,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { combinationId, updatedRunnerId } = action.payload;
  const { combinations, legs, runners } = getSportsbookBettingState(state);
  const [legId] = combinations[combinationId].legs;
  const leg = legs[legId];
  if (!leg) return null;

  const runner = runners[updatedRunnerId];
  if (!runner) return null;

  const { marketId, selectionId } = runner;
  const { sportsbookmarkets } = state.entities;
  const market = getSportsbookMarketById(sportsbookmarkets, marketId);
  if (!market) return null;

  const { runners: marketRunners = [] } = market;
  const selection = marketRunners.find((r) => r.selectionId === selectionId);
  if (!selection) return null;

  return buildInterfaceEvent({
    action: TaggingAction.REPOSITIONED,
    elementText: `${leg.legType} - ${selection.name}`,
    module: "betslip",
  });
};

export const getSwitcherEvent = (action: SwitcherOpen): InterfaceEvent => {
  const { label, pageType } = action.payload;
  const TYPE_CONFIG: { [key: string]: string } = {
    GenericSwitcherCard: "generic",
    RaceSwitcherCard: "race",
  };
  const type = TYPE_CONFIG[pageType];

  return buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: label,
    module: `${type} - power nav`,
  });
};

export const getFilterOpenEvent = (action: FilterOpenAction): InterfaceEvent => {
  const { label } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: label,
    module: "filter",
  });
};

export const getFilterCloseEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "cancel",
    module: "filter",
  });

export const getFilterApplyEvent = (action: FilterApplyAction): InterfaceEvent => {
  const { selectedOptions, module } = action.payload;
  const filteredOptions = selectedOptions.filter(Boolean);

  return getClickEvent(filteredOptions.join(", "), module);
};

export const getFilterResetClickEvent = (action: FilterResetClickAction): InterfaceEvent => {
  const { label } = action.payload;

  return getClickEvent(label, "filter");
};

export const getSawCardEvent = (action: SawCardAction): InterfaceEvent => {
  const { label, moduleName } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.SAW,
    elementText: label,
    module: moduleName,
  });
};

export const getLoadedNotFoundView = (action: NotFoundViewLoadedAction, state: ApplicationState): InterfaceEvent => {
  const { currentUrl } = state.router;

  return buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: currentUrl || "",
    module: "error",
  });
};

export const getSwitchProductEvent = (
  action: SwitchProductPreferenceAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { productSwitcherPreference } = action.payload;
  const pageType = getViewTypeSelector(state);

  return buildInterfaceEvent({
    action: TaggingAction.SWITCH_PRODUCT,
    elementText: productSwitcherPreference,
    module: `${pageType} - bottom ribbon`,
  });
};

export const getOpenPredictsEvent = (_action: unknown, state: ApplicationState): InterfaceEvent => {
  const pageType = getViewTypeSelector(state);

  return buildInterfaceEvent({
    action: TaggingAction.SWITCH_PRODUCT,
    elementText: "Predicts",
    module: `${pageType} - bottom ribbon`,
  });
};

export const getBetslipDeeplinkEvent = (action: URLBetslipDeeplinkAction): InterfaceEvent => {
  const getDeeplinkActionType = () => {
    let actionType = "";

    if (action.payload.isBetSharing) {
      actionType = " - bet sharing";
    }

    return actionType;
  };

  return buildInterfaceEvent({
    action: TaggingAction.SAW,
    elementText: `betslip deeplink${getDeeplinkActionType()}`,
    module: BETSLIP_MODULE_NAME,
  });
};

export const getFavouriteMarketsToggleFavouriteEvent = (
  action: FavouriteMarketsToggleFavouriteAction,
  state: ApplicationState,
): InterfaceEvent => {
  const viewType = getViewTypeSelector(state);
  const metadata = getLayoutMetadata(action.payload.contentSectionURN);
  const { title, tabName } = metadata;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: action.payload.isFavourite ? "favourite" : "unfavourite",
    module: `${viewType} - ${title} - ${tabName}`,
  });
};

export const getFavouriteMarketsTooltipCloseEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "check the start tab for your favourite markets",
    module: "favourite popup message",
  });

export const getFavouriteMarketsLimitReachedMessageCloseEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "favourites limit reached",
    module: "favourite popup message",
  });

export const getMyBetsBetSharingDismissEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "bet sharing - dismiss button",
    module: MY_BETS_MODULE_NAME,
  });

export const getMyBetsBetSharingPreviewEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: "bet sharing - preview button",
    module: MY_BETS_MODULE_NAME,
  });

export const getMyBetsBetSharingShareBetEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "share your bet button",
    module: "share your bet popup",
  });

export const getMyBetsBetSharingShareImageEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "share image button",
    module: "share your bet popup",
  });

export const getMyBetsAccaFreezeOpenedEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: "acca freeze available",
    module: "my bets",
  });

export const getMyBetsAccaFreezeClosedEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "acca freeze bottom sheet",
    module: "acca freeze bottom sheet",
  });

export const getBetMutationAccaFreezeSelectedEvent = (action: BetMutationAccaFreezeSelectedAction): InterfaceEvent => {
  const eventId = codecs.event.decode(action.payload.eventUrn);
  return buildInterfaceEvent({
    action: TaggingAction.SELECTED,
    elementText: `card - ${eventId}`,
    module: "acca freeze bottom sheet",
  });
};

export const getBetMutationAccaFreezeDeselectedEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.DESELECTED,
    elementText: "card",
    module: "acca freeze bottom sheet",
  });

export const getBetMutationAccaFreezeConfirmEvent = (action: BetMutationFreezeLegAction): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `confirm freeze - ${action.payload.eventName} - ${action.payload.matchScore} - ${action.payload.timeFrozen}`,
    module: "my bets",
  });

export const getMyBetsCancelAllEvent = () => getClickEvent("cancel all", MY_BETS_MODULE_NAME);

export const getMyBetsHeaderTooltipToggleEvent = (action: MyBetsHeaderTooltipToggleAction): InterfaceEvent => {
  const { isTooltipOpen } = action.payload;

  return buildInterfaceEvent({
    action: isTooltipOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: "bets before - tool tip",
    module: MY_BETS_MODULE_NAME,
  });
};

export const getMyBetsEditBottomSheetCloseEvent = (action: MyBetsExchangeBetEditCloseAction): InterfaceEvent | null => {
  const { wasCloseButtonPressed } = action.payload;

  if (!wasCloseButtonPressed) return null;

  return buildInterfaceEvent({
    elementText: "edit bet",
    module: "edit bet bottom sheet",
    action: TaggingAction.CLOSED,
  });
};

export const getPNInteractionClickEvent = (action: PNInteraction) => {
  const { label, module } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: label,
    module,
  });
};

export const getMyBetsSinglesBellClickEvent = (action: PNMyBetsSinglesBellClickAction) => {
  const { toggleOn, betType, sportId } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: toggleOn ? "notification turned on" : "notification turned off",
    module: `my bets - open - notifications icon - ${betType} - ${sportId}`,
  });
};

export const getMyBetsMultiplesBellClickEvent = (action: PNMyBetsMultiplesBellClickAction) => {
  const { subscribedCount, numberOfEvents, betType } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: `subscribed - ${subscribedCount}/${numberOfEvents}`,
    module: `my bets - open - notifications overlay - ${betType}`,
  });
};

export const getMyBetsNotificationsCloseEvent = (action: PNMyBetsNotificationsCloseAction) => {
  const { betType } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "close",
    module: `my bets - open - notifications overlay - ${betType}`,
  });
};
export const getMyBetsSaveClickEvent = (action: PNMyBetsSaveClickAction) => {
  const { subscribedCount, numberOfEvents, betType, sportsIds } = action.payload;
  const sportsIdsSuffix = sportsIds ? ` - ${sportsIds}` : "";

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `saved - ${subscribedCount}/${numberOfEvents}`,
    module: `my bets - open - notifications overlay - ${betType}${sportsIdsSuffix}`,
  });
};

export const getToggleShowMoreEvent = (
  action: ToggleShowMoreRunnersAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { cardUrn, showMore, gaModuleSuffix = "" } = action.payload;
  const pageType = getViewTypeSelector(state);

  const metadata = getLayoutMetadata(cardUrn);
  const { pebbleCardGroupTitle, tabName } = metadata;

  const elementText = showMore ? "Show More" : "Show Less";
  const module = `${pageType} - ${tabName} - ${pebbleCardGroupTitle} ${gaModuleSuffix}`;

  return getClickEvent(elementText, module.trim());
};

export const getStatisticsModalToggleEvent = (
  action: StatisticsModalToggleAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { label, isOpen } = action.payload;
  const pageType = getViewTypeSelector(state);

  return buildInterfaceEvent({
    action: isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: label,
    module: `${pageType} - stats and viz`,
  });
};

export const getNextRacesRaceFilterClickEvent = (
  action: NextRacesFilterClickAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { label } = action.payload;
  const pageType = getViewTypeSelector(state);

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: label,
    module: `${pageType} - race region switcher`,
  });
};

const getMarketSnackBarEvent = (label: string): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.SAW,
    elementText: label,
    module: "market snack bar",
  });

export const getMarketSnackBarClosedEvent = (): InterfaceEvent => getMarketSnackBarEvent("closed");

export const getMarketSnackBarSuspendedEvent = (): InterfaceEvent => getMarketSnackBarEvent("suspended");

export const getAzSwitchToggleEvent = (action: AzSwitchClickAction): InterfaceEvent => {
  const { label, isToggleOn } = action.payload;

  return buildInterfaceEvent({
    action: isToggleOn ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
    elementText: label,
    module: "sort",
  });
};

export const getMyBetsOrderTypeFilterClickEvent = (action: MyBetsOrderTypeFilterClick): InterfaceEvent => {
  const { productType, orderType } = action.payload.filter;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `${getProductLabelByProductTypeFilterItem(productType as ProductTypeFilterItem)} - ${orderType} bets`,
    module: MY_BETS_MODULE_NAME,
  });
};

export const getPromoDescriptionToggleEvent = (action: PromoDescriptionToggleAction): InterfaceEvent => {
  const { title, isOpen, variant } = action.payload;

  return buildInterfaceEvent({
    action: isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: title,
    module: `market blurb - ${variant}`,
  });
};

export const getToggleAccordionEvent = (action: MyBetsOnAccordionToggle): InterfaceEvent => {
  const { isExpanded } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    module: MY_BETS_MODULE_NAME,
  });
};

export const getHeritageToggleClickEvent = (action: MyBetsHeritageToggleFilterClick): InterfaceEvent => {
  const { filter } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `switcher - ${filter.label}`,
    module: MY_BETS_MODULE_NAME,
  });
};

export const getBetReceiptCopyToClipboardEvent = (): InterfaceEvent =>
  getClickEvent("copy to clipboard", BET_RECEIPT_MODULE_NAME);

export const getMyBetsCopyBetIdToClipboardEvent = (): InterfaceEvent => getCopyEvent("bet id", MY_BETS_MODULE_NAME);

export const getMyBetsCopyDeviceIdToClipboardEvent = (): InterfaceEvent =>
  getCopyEvent("device id", MY_BETS_MODULE_NAME);

export const getStatisticsItemClickEvent = (action: StatisticsItemClickAction): InterfaceEvent => {
  const { label } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: label,
    module: "statistics",
  });
};

export const getRaceReplaysToggleEvent = (
  action: RaceReplaysToggleAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { selection, isClosed, cardUrn } = action.payload;
  const pageType = getViewTypeSelector(state);

  const getRaceMarketCard = createCardByURNSelector<RaceMarketCards, URN>();
  const getMarketCard = createCardByURNSelector<MarketCards, URN>();
  const card =
    getRaceMarketCard(state.layouts.cards.racemarkets, cardUrn) ?? getMarketCard(state.layouts.cards.markets, cardUrn);

  if (!card) {
    return null;
  }

  const cardType = card.typename.toLowerCase();

  return buildInterfaceEvent({
    action: isClosed ? TaggingAction.CLOSED : TaggingAction.OPENED,
    elementText: `recent races video - ${selection}`,
    module: `${pageType} - ${cardType}`,
  });
};

export const getMaxPayoutAcceptMessageClickEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `accept - warningI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT`,
    module: "betslip",
  });

export const getNavigationTabClickEvent = (
  action: NavigationTabClickAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const pageType = getViewTypeSelector(state);
  return getClickEvent(action.payload.label, `${pageType} - market ribbon`);
};

export const getToggleTimeFormEvent = (action: ToggleTimeformCard): InterfaceEvent => {
  const { isExpanded } = action.payload;

  return buildInterfaceEvent({
    action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    elementText: "race verdict",
    module: "racecard",
  });
};

export const getOpenBetslipEvent = (action: BetslipOpenAction, state: ApplicationState): InterfaceEvent | null => {
  const { product } = action.payload;
  if (getBetslipVisibilityState(state)) return null;

  return buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: `${getProductLabelByProductType(product)} betslip`,
    module: "auto-open",
  });
};

export const getGenerosityWalletClick = (action: GenerosityWalletButtonAction): InterfaceEvent | null => {
  const { module } = action.payload;

  return getClickEvent("generosity wallet", module);
};

export const getGenerosityWalletCloseEvent = (action: GenerosityWalletCloseClickAction): InterfaceEvent | null => {
  const { isFromBetslip, currentPebble } = action.payload;
  const module = `${isFromBetslip ? "betslip - " : ""}generosity wallet - ${currentPebble}`;

  return getClickEvent("close", module);
};

export const getGenerosityWalletBetslipClickAction = (
  action: BettingSportsbookGenerosityWalletBetAction,
): InterfaceEvent | null => {
  const { isSelected } = action.payload;
  const elementText = `generosity${isSelected ? " edit" : ""} icon`;

  return getClickEvent(elementText, "betslip");
};

export const getRemoveGenerosityWalletEvent = (): InterfaceEvent | null =>
  getClickEvent(`remove generosity`, "betslip");

export const getFreeBetsWalletToggleEvent = (action: FreeBetsWalletToggleAction): InterfaceEvent | null => {
  const { isSelected, walletDescription, value, totalAmount, currentPebble, numberOfPlaces, walletType } =
    action.payload;
  const isMoneyBack = walletType === WalletTypes.MoneyBackToken;
  const isGhostLeg = walletType === WalletTypes.GhostLegToken;

  let details = "";
  if (isMoneyBack) {
    details = numberOfPlaces ? " - placed" : " - losers";
  } else if (value) {
    details = ` - ${value} leg`;
  }

  const amountSuffix = !totalAmount || isGhostLeg ? "" : ` - ${totalAmount}`;

  return buildInterfaceEvent({
    action: isSelected ? TaggingAction.REMOVED : TaggingAction.ADDED,
    elementText: `${walletDescription}${details}${amountSuffix}`,
    module: `betslip - generosity wallet - ${currentPebble}`,
  });
};

export const getObbLayoutToggledEvent = (
  action: ObbCardGroupLayoutSelectionAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const cardGroup = state.layouts.cardgroups.obbcardgroups[action.payload.urn];
  const section = cardGroup.sections.find((s) => s.urn === action.payload.sectionUrn);
  if (!section) {
    return null;
  }
  const layout = section.layouts.find((l) => l.urn === action.payload.layoutUrn);
  if (!layout) {
    return null;
  }
  const { tabName } = getLayoutMetadata(cardGroup.urn);

  return buildInterfaceEvent({
    action: "clicked",
    elementText: layout.title ?? "",
    eventContext: action.payload.eventName,
    module: getModuleData(getViewTypeSelector(state), "", section.title, layout.title, tabName),
  });
};

export const getObbSectionToggledEvent = (
  action: ObbCardGroupSectionToggledAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const cardGroup = state.layouts.cardgroups.obbcardgroups[action.payload.cardGroupUrn];
  const section = cardGroup.sections.find((s) => s.urn === action.payload.sectionUrn);
  if (!section) {
    return null;
  }

  const { tabName } = getLayoutMetadata(action.payload.cardGroupUrn);

  return buildInterfaceEvent({
    action: action.payload.isOpen ? TaggingAction.OPENED : TaggingAction.CLOSED,
    elementText: section.title,
    eventContext: action.payload.eventName,
    module: getModuleData(getViewTypeSelector(state), "", section.title, "", tabName),
  });
};

export const getObbShowMoreClickedEvent = (
  action: ObbCardGroupShowMoreClickedAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const cardGroup = state.layouts.cardgroups.obbcardgroups[action.payload.cardGroupUrn];
  const section = cardGroup.sections.find((s) => s.urn === action.payload.sectionUrn);
  if (!section) {
    return null;
  }
  const layout = section.layouts.find((l) => l.urn === action.payload.layoutUrn);
  if (!layout) {
    return null;
  }

  const { tabName } = getLayoutMetadata(action.payload.cardGroupUrn);
  return buildInterfaceEvent({
    action: "clicked",
    elementText: "show more",
    eventContext: action.payload.eventName,
    module: getModuleData(getViewTypeSelector(state), "", section.title, layout.title, tabName),
  });
};

export const getObbSelectionsEvents = (
  action: ObbEventSelectionAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { event, eventName, urn } = action.payload;

  const moduleData = [];

  if (typeof event.module === "string") {
    moduleData.push(event.module);
  } else {
    const pageType = event.module?.pageType || getViewTypeSelector(state);
    const swimlaneType = event.module?.swimlaneType || "null";

    if (urn) {
      const layoutMetadata = getLayoutMetadata(urn);
      const { tabName, cardGroupTitle = "", cardLayoutTitle = "", title = "" } = layoutMetadata;

      moduleData.push(
        pageType,
        swimlaneType,
        event.module?.group || `${cardGroupTitle} ${cardLayoutTitle}`,
        event.module?.card || title,
        event.module?.tab || tabName,
      );
    } else {
      moduleData.push(
        pageType,
        swimlaneType,
        event.module?.group || null,
        event.module?.card || null,
        event.module?.tab || null,
      );
    }
  }

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: event.elementText,
    eventContext: eventName,
    module: getModuleData(...moduleData),
  });
};

export const getOpenClearBetslipEvent = (
  action: ConfirmationAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const pageType = getViewTypeSelector(state);

  const clearBetslipMetrics = getClearBetslipMetrics(action, state);

  if (!clearBetslipMetrics) return null;

  const { tabName, event, cardGroupTitle = "", cardLayoutTitle = "" } = clearBetslipMetrics;

  return buildInterfaceEvent({
    action: TaggingAction.SAW,
    elementText: `clear betslip modal`,
    eventContext: `${event}`,
    gameFilter: "null",
    module: getModuleData(pageType, null, `${cardGroupTitle} ${cardLayoutTitle}`, "clear betslip", tabName),
    swimlaneType: "null",
  });
};

export const getRefuseConfirmationEvent = (action: BettingObbSbkKeepAction, state: ApplicationState) => {
  const clearBetslipMetrics = getClearBetslipMetrics(action, state);

  if (!clearBetslipMetrics) return null;

  const { ctaLabel, tabName, event } = clearBetslipMetrics;

  const label = action.payload.clickedOutside ? "close" : ctaLabel;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `${label}`,
    eventContext: `${event}`,
    gameFilter: "null",
    module: getModuleData("clear betslip", tabName, label),
    swimlaneType: "null",
  });
};

export const getAcceptConfirmationEvent = (action: BettingObbSbkClearAction, state: ApplicationState) => {
  const clearBetslipMetrics = getClearBetslipMetrics(action, state);

  if (!clearBetslipMetrics) return null;

  const { tabName, event, ctaLabel } = clearBetslipMetrics;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `${ctaLabel}`,
    eventContext: `${event}`,
    gameFilter: "null",
    module: getModuleData("clear betslip", tabName, ctaLabel),
    swimlaneType: "null",
  });
};

export const getHamburgerMenuOpenEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: "burger menu",
    module: "header",
  });

export const getHamburgerMenuCloseEvent = (): InterfaceEvent =>
  buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "close icon",
    module: "burger menu",
  });

export const getEditSquadOpenEvent = (
  action: ObbSquadBetPlayerPickerOpenAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { cardUrn, element } = action.payload;

  if (!cardUrn) {
    return null;
  }

  const obbTemplateId = obbTemplateIds[ObbLegTemplateIds.PARTICIPANTS_COMBINED];

  const layoutMetadata = getLayoutMetadata(cardUrn);

  const { tabName } = layoutMetadata;

  const pageType = getViewTypeSelector(state);
  const elementText = element ? `edit squad - ${element}` : "edit squad";

  return buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText,
    module: `${pageType} - null - ${obbTemplateId} - player picker - ${tabName}`,
  });
};

export const getToggleSquadVsSquadPlayersTooltipEvent = (
  action: ObbSquadVsSquadTogglePlayersTooltipAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { cardUrn, actionType } = action.payload;

  if (!cardUrn) {
    return null;
  }

  const layoutMetadata = getLayoutMetadata(cardUrn);

  const { tabName, title } = layoutMetadata;

  const pageType = getViewTypeSelector(state);

  return buildInterfaceEvent({
    action: actionType,
    elementText: "players tooltip",
    module: `${pageType} - null - ${title} - player picker - ${tabName}`,
  });
};

export const getObbEnhancedPlayerCounterEvent = (
  action: ObbEnhancedTrackingPlayerCounterAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { actionType, eventName, betLegPartType, cardUrn } = action.payload;
  const pageType = getViewTypeSelector(state);
  const label = actionType === TaggingAction.OPENED ? "show player progress" : "hide player progress";
  const betLegPartLabel = betLegPartType === ObbLegTemplateIds.X_OF_N ? "multi" : "single";
  const { viewUrn } = getLayoutMetadata(cardUrn);
  const viewLabel = viewUrn?.split(":").pop() === "open" ? "open" : "settled";

  return buildInterfaceEvent({
    action: actionType,
    elementText: label,
    module: `${pageType} - null - obp - squadbet ${betLegPartLabel} - ${viewLabel}`,
    eventContext: eventName,
  });
};

export const getClosePlayerPickerModalEvent = (
  action: ObbClosePlayerPickerModalAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { cardUrn, eventName, incidentType } = action.payload;

  if (!cardUrn) {
    return null;
  }

  const layoutMetadata = getLayoutMetadata(cardUrn);

  const { tabName } = layoutMetadata;

  const pageType = getViewTypeSelector(state);

  const incidentTypeLabel = incidentType.replace(/_/g, " ");

  return buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: "close icon",
    eventContext: eventName,
    module: `${pageType} - null - ${incidentTypeLabel} - player picker - ${tabName}`,
  });
};

export const getSquadBetPlayerPickerRemoveSquadParticipantEvent = (
  action: ObbSquadBetPlayerPickerRemoveSquadParticipantAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { cardUrn, eventName, moduleName, incidentType } = action.payload;

  if (!cardUrn) {
    return null;
  }

  const layoutMetadata = getLayoutMetadata(cardUrn);

  const { tabName } = layoutMetadata;

  const pageType = getViewTypeSelector(state);
  const incidentTypeLabel = incidentType.replace(/_/g, " ");
  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `remove player`,
    eventContext: eventName,
    module: `${pageType} - null - ${incidentTypeLabel} - ${moduleName} - ${tabName}`,
  });
};

export const getSquadBetPlayerPickerToggleSquadParticipantEvent = (
  action: ObbToggleSquadBetPlayerPickerSquadParticipantAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { cardUrn, eventName, incidentType, participantUrn, playerName, selectedSquadId } = action.payload;
  let isSelected = false;

  if (!cardUrn) {
    return null;
  }

  const card = getObbSquadBetCardByURN(state, cardUrn) ?? getObbSquadVsSquadCardByURN(state, cardUrn);

  if (
    !card ||
    !["ObbSquadBetCard", "ObbSquadVsSquadCard"].includes(card.typename) ||
    !card.eventParticipants.map((eventParticipant) => eventParticipant.urn).includes(participantUrn)
  ) {
    return null;
  }

  let modalParticipants: ObbParticipant[] = [];
  let obbTemplateId: string;

  if (card.typename === "ObbSquadBetCard") {
    modalParticipants = card.modalParticipants;
    obbTemplateId = obbTemplateIds[ObbLegTemplateIds.PARTICIPANTS_COMBINED];
  } else {
    modalParticipants = selectedSquadId === "1" ? card.firstSquadModalParticipants : card.secondSquadModalParticipants;
    obbTemplateId = obbTemplateIds[ObbLegTemplateIds.SQUAD_VS_SQUAD];
  }

  const currentModalParticipants = modalParticipants.map((participant) => participant.urn);

  if (card.typename === "ObbSquadBetCard" && currentModalParticipants.includes(participantUrn)) {
    isSelected = true;
  } else if (card.typename === "ObbSquadVsSquadCard" && !currentModalParticipants.includes(participantUrn)) {
    isSelected = true;
  }

  const layoutMetadata = getLayoutMetadata(cardUrn);

  const { tabName } = layoutMetadata;

  const pageType = getViewTypeSelector(state);

  const incidentTypeLabel = incidentType.replace(/_/g, " ");

  return buildInterfaceEvent({
    action: isSelected ? TaggingAction.UNSELECTED : TaggingAction.SELECTED,
    elementText: `player - ${playerName}`,
    eventContext: eventName,
    module: `${pageType} - null - ${incidentTypeLabel} - player picker - ${tabName} - ${obbTemplateId}`,
  });
};

export const getSquadBetPlayerPickerBetButtonClickEvent = (
  action: ObbSquadBetPlayerPickerBetButtonClickAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { eventName, incidentType, buttonStatus, buttonLabel } = action.payload;

  const pageType = getViewTypeSelector(state);

  const incidentTypeLabel = incidentType.replace(/_/g, " ");

  /*
   * since the button status received is the status before the click
   * we map the default status to selected
   *  and the selected status to unselected
   */
  return buildInterfaceEvent({
    action: buttonStatus === "default" ? TaggingAction.SELECTED : TaggingAction.UNSELECTED,
    elementText: `bet button - ${buttonLabel}`,
    eventContext: eventName,
    module: `${pageType} - null - ${incidentTypeLabel} - player picker - null`,
  });
};

export const getGenerosityWalletPebbleClickEvent = (
  action: GenerosityWalletPebbleClickAction,
): InterfaceEvent | null => {
  const { isFromBetslip, toPebble, currentPebble } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `pebble - ${toPebble}`,
    module: `${isFromBetslip ? "betslip - " : ""}generosity wallet - ${currentPebble}`,
  });
};

export const getGenerosityWalletApplyButtonClickEvent = (
  action: GenerosityWalletApplyButtonClickAction,
): InterfaceEvent | null => {
  const { walletDescription, value, totalAmount, currentPebble, numberOfPlaces, walletType } = action.payload;
  const isMoneyBack = walletType === WalletTypes.MoneyBackToken;
  const isGhostLeg = walletType === WalletTypes.GhostLegToken;

  let details = "";
  if (isMoneyBack) {
    details = numberOfPlaces ? " - placed" : " - losers";
  } else if (value) {
    details = ` - ${value} leg`;
  }

  const amountSuffix = isGhostLeg ? "" : ` - ${totalAmount}`;

  const elementText = !walletDescription ? "apply - none" : `apply ${walletDescription}${details}${amountSuffix}`;

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText,
    module: `betslip - generosity wallet - ${currentPebble}`,
  });
};

export const getBetslipSliderInteractionEvent = (action: BetslipSliderInteractionAction): InterfaceEvent => {
  const { eventName, source, direction } = action.payload;

  return buildInterfaceEvent({
    action: source === "selector" ? TaggingAction.SELECTED : TaggingAction.CLICKED,
    elementText: `${direction} slider ${source}`,
    eventContext: eventName,
    gameFilter: "null",
    swimlaneType: "null",
    module: `betslip - or slider`,
  });
};
export const getBetslipSliderDisplayedEvent = (action: BetslipSliderDisplayedAction): InterfaceEvent | null => {
  const { eventName } = action.payload;

  return buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: `or slider`,
    eventContext: eventName,
    gameFilter: "null",
    swimlaneType: "null",
    module: `betslip - or slider`,
  });
};

export const getObbEventPopularsShowMoreEvent = (
  action: ObbEventPopularsShowMoreAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { cardUrn, eventName, showMore } = action.payload;

  const pageType = getViewTypeSelector(state);

  const { tabName, title } = getLayoutMetadata(cardUrn);

  return buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: showMore ? "show more" : "show less",
    eventContext: eventName,
    module: getModuleData(pageType, null, title, "popular card", tabName),
  });
};

export const getObbOnboardingCardsCardGroupSwipeEvent = (
  action: ObbOnboardingCardsCardGroupNavigationAction,
  state: ApplicationState,
): InterfaceEvent | null => {
  const { urn, eventName, direction } = action.payload;

  const taggingAction = swipedDirectionToTaggingAction[direction];

  if (!taggingAction) {
    return null;
  }

  const pageType = getViewTypeSelector(state);

  const layoutMetadata = getLayoutMetadata(urn);
  const { tabName, title, cardGroupTitle } = layoutMetadata;

  return buildInterfaceEvent({
    action: taggingAction,
    elementText: "null",
    gameFilter: "null",
    eventContext: eventName,
    module: getModuleData(pageType, null, cardGroupTitle, title, tabName),
  });
};

export const getObbOnboardingCardsCardGroupDisplayedEvent = (
  action: ObbOnboardingCardsCardGroupDisplayedAction,
  state: ApplicationState,
): InterfaceEvent => {
  const { urn, eventName, numberOfCards } = action.payload;

  const pageType = getViewTypeSelector(state);

  const layoutMetadata = getLayoutMetadata(urn);
  const { tabName, title, cardGroupTitle } = layoutMetadata;

  return buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: `popular picks ${numberOfCards}`,
    gameFilter: "null",
    eventContext: eventName,
    module: getModuleData(pageType, null, cardGroupTitle, title, tabName),
  });
};
