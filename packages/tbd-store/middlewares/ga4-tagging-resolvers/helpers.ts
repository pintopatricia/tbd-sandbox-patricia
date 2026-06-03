import i18n from "i18next";
import { formatTime } from "../../helpers/dates";
import { isCompetitionEventHierarchy, isEventHierarchy, isRaceHierarchy } from "../../helpers/markets";
import { ApplicationState, PYWDepositSuccessEvent, SportsbookMarket, UserDetails } from "../../state";
import { BetslipExchangeReport } from "../../state/betslip/Betslip.types";
import { getBetslipExchangeContext } from "../../state/betslip/betslip-card-selectors";
import { ExchangeOrder } from "../../state/betting/exchange-orders/ExchangeOrder.types";
import { getExchangeOrder } from "../../state/betting/exchange-orders/exchange-order-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { getExchangeRunnerTree } from "../../state/entities/entities-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { getVirtualEventByURN } from "../../state/entities/virtual-event/virtual-event-selectors";
import { getVirtualMarketByRunnerURN } from "../../state/entities/virtual-market/virtual-market-selectors";
import { getVirtualRunnerByURN } from "../../state/entities/virtual-runner/virtual-runner-selectors";
import { getVirtualSportByURN } from "../../state/entities/virtual-sport/virtual-sport-selectors";
import { BetResponse as BetResponseType } from "../../state/tagging/Betting.types";
import { MarketFlags, MAX_URL_LENGTH_FOR_TAGGING, TaggingAction, YesNo } from "../tagging-resolvers/AnalyticsConstants";
import {
  getSportsbookMarketTree,
  getSportsbookRunnerTree,
} from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { BetResponse } from "../../state/constants";
import { getLayoutMetadata } from "../../state/layout-snapshot";
import { ConfirmationAction } from "../../actions/confirmation";
import { BettingObbSbkClearAction, BettingObbSbkKeepAction } from "../../actions/betting";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { ObbOnboardingCardsCardGroupNavigationAction } from "../../actions/obb";

export type ObbModuleMetadataTemplate = {
  pageType?: string; // First Parameter
  swimlaneType?: string; // Second Parameter
  group?: string; // Third Parameter
  card?: string; // Fourth Parameter
  tab?: string; // Fifth Parameter
};

export type BetslipTabLabel = {
  name: string;
  i18nLabel: string;
};

export type ClearBetslip = {
  cardGroupTitle: string | undefined;
  cardLayoutTitle: string | undefined;
  event: string;
  ctaLabel: string | undefined;
  tabName: string;
};

function getBetResponse(order: ExchangeOrder | null): BetResponseType | undefined {
  if (!order) return undefined;
  if (order.orderType !== "LIMIT") return BetResponse.SP;
  if (order.sizeMatched && !order.sizeRemaining) return BetResponse.MATCHED;
  if (!order.sizeMatched && order.sizeRemaining) return BetResponse.UNMATCHED;

  return "partially-matched";
}

export function getBetResponseFromReport(report: BetslipExchangeReport): BetResponseType {
  const { matched, unmatched } = report;

  const hasMatched = !!matched?.price;
  const hasUnmatched = !!unmatched?.price;

  if (hasMatched && hasUnmatched) {
    return "partially-matched";
  }

  return hasMatched ? BetResponse.MATCHED : BetResponse.UNMATCHED;
}

export function getExchangeRunnerMetrics(state: ApplicationState, runnerURN: string) {
  const {
    entities: { competitions, meetings, sportevents, races },
  } = state;
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const runnerTree = getExchangeRunnerTree(state.entities, runnerURN);

  if (!runnerTree) return null;

  const { marketRunner, market, sport, runner } = runnerTree;

  const metrics = {
    market_name: market.name,
    market_id: market.marketId,
    selection: marketRunner.name,
    selection_id: runner.selectionId,
    sport_name: sport.name,
    sport_id: sport.sportId,
    in_play_indicator: market.inplay ? YesNo.Yes : YesNo.No,
  };

  if (isRaceHierarchy(market.hierarchy)) {
    const { race: raceURN, meeting: meetingURN } = market.hierarchy;
    const race = getRaceByURN(races, raceURN);
    const meeting = getMeetingByURN(meetings, meetingURN);

    if (!race || !meeting) return null;

    // TODO: review this when adding post racing
    const isAntepost = false;

    return {
      ...metrics,
      competition_name: meeting.entityName,
      competition_id: meeting.meetingId,
      event_name: `${formatTime(race.startTime)} ${meeting.venue}`,
      event_id: race.raceId,
      antepost_flag: isAntepost ? YesNo.Yes : YesNo.No,
    };
  }
  if (isCompetitionEventHierarchy(market.hierarchy)) {
    const competition = getCompetitionByURN(competitions, market.hierarchy.competition);
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);

    if (!sport || !event?.eventId || !competition?.competitionId || !competition?.name) return null;

    return {
      ...metrics,
      competition_name: competition.name,
      competition_id: competition.competitionId,
      event_name: event.name,
      event_id: event.eventId,
      antepost_flag: YesNo.No,
    };
  }

  return null;
}

const getSportsbookMetricsMarketName = (market: SportsbookMarket) => {
  if (market.isSuperSub) {
    return `${market.name} ${MarketFlags.SUPER_SUB}`;
  }

  return market.name;
};

export function getSportsbookRunnerMetrics(
  state: ApplicationState,
  runnerURN: string,
  selectionRunnerURN?: string,
  isLotto?: boolean,
) {
  const {
    entities: { competitions, sportevents, races, meetings },
  } = state;
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();

  const runnerTree = getSportsbookRunnerTree(state, runnerURN, isLotto || false);

  const sportsbookTree =
    runnerTree || (selectionRunnerURN && getSportsbookMarketTree(state, runnerURN, selectionRunnerURN));

  if (!sportsbookTree) return null;

  const { marketRunner, market, sport } = sportsbookTree;
  const selectionId =
    runnerTree?.runner.selectionId ?? market.runners.find((run) => run.urn === selectionRunnerURN)?.selectionId;

  if (!selectionId) return null;

  const metrics = {
    market_name: getSportsbookMetricsMarketName(market),
    in_play_indicator: market.inplay ? YesNo.Yes : YesNo.No,
    market_id: market.marketId,
    selection_id: selectionId,
    selection: marketRunner.name,
    sport_id: sport.sportId,
    sport_name: sport.name,
    price_at_selection: runnerTree?.runner.odds?.decimal,
  };

  if (isRaceHierarchy(market.hierarchy)) {
    const { race: raceURN, meeting: meetingURN } = market.hierarchy;
    const race = getRaceByURN(races, raceURN);
    const meeting = getMeetingByURN(meetings, meetingURN);

    if (!race || !meeting) return null;

    // TODO: review this when adding post racing
    const isAntepost = false;

    return {
      ...metrics,
      competition_name: meeting.entityName,
      competition_id: meeting.meetingId,
      event_name: `${formatTime(race.startTime)} ${meeting.venue}`,
      event_id: race.raceId,
      antepost_flag: isAntepost ? YesNo.Yes : YesNo.No,
    };
  }

  if (isCompetitionEventHierarchy(market.hierarchy)) {
    const competition = getCompetitionByURN(competitions, market.hierarchy.competition);
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
    if (!event?.eventId || !competition?.competitionId) return null;

    return {
      ...metrics,
      competition_name: competition.name,
      event_name: event.name,
      event_id: event.eventId,
      competition_id: competition.competitionId,
      antepost_flag: YesNo.No,
    };
  }

  if (isEventHierarchy(market.hierarchy)) {
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);

    if (!event?.eventId) return null;

    return {
      ...metrics,
      competition_name: null,
      event_name: event.name,
      event_id: event.eventId,
      competition_id: null,
      antepost_flag: YesNo.No,
    };
  }
  return null;
}

export function getBetMetrics(state: ApplicationState, betId?: string) {
  const { exchangemarkets, sports } = state.entities;
  let betResponse: BetResponseType | undefined;
  let order = null;

  const getExchangeMarketByURN = createExchangeMarketSelector();
  const { currencyCode } = <UserDetails>getUserDetails(state);

  const betslipContext = getBetslipExchangeContext(state);

  if (!betslipContext) return null;

  const { market: marketURN, side, runner: runnerURN } = betslipContext;

  const runnerMetrics = getExchangeRunnerMetrics(state, runnerURN);

  if (!runnerMetrics) return null;

  const { sport: sportUrn } = getExchangeMarketByURN(exchangemarkets, marketURN) || {};

  const sport = sportUrn ? getSportByURN(sports, sportUrn) : undefined;

  if (betId) {
    order = getExchangeOrder(state, marketURN, betId);
    betResponse = getBetResponse(order);
  }

  if (!sport?.sportId || !currencyCode) return null;

  return {
    betDirection: side,
    price_at_selection: order?.price || null,
    currency: currencyCode,
    betId,
    betResponse,
    ...runnerMetrics,
  };
}

export function getVirtualRunnerMetrics(state: ApplicationState, runnerURN: string) {
  const {
    entities: { virtualmarkets, virtualrunners, virtualevents, virtualsports },
  } = state;

  const market = getVirtualMarketByRunnerURN(virtualmarkets, runnerURN);
  const runner = getVirtualRunnerByURN(virtualrunners, runnerURN);

  if (!market || !runner) {
    return null;
  }

  const event = getVirtualEventByURN(virtualevents, market.event);
  if (!event) {
    return null;
  }

  const sport = getVirtualSportByURN(virtualsports, event.sport);
  if (!sport) {
    return null;
  }

  return {
    market_name: market.name,
    market_id: market.marketId,
    selection_id: runner.selectionId,
    selection: runner.name,
    sport_id: sport.sportId,
    sport_name: `virtual:${i18n.t(sport.name.translationKey)}`,
    competition_name: event.name,
    event_name: event.name,
    event_id: event.eventId,
    competition_id: event.eventId,
    price_at_selection: runner.odds?.decimal,
    antepost_flag: YesNo.No,
    in_play_indicator: YesNo.No,
  };
}

export const getDepositSuccessEventObject = (data: PYWDepositSuccessEvent) => {
  const {
    payload: { currency, deposited, transactionId, methodType },
  } = data;

  return {
    paymentTransactionId: transactionId,
    value: deposited,
    paymentTransactionMethod: methodType,
    numOfPaymentTransactions: "null",
    accountBalance: "null",
    depositLimit: "null",
    currency,
  };
};

/*
 * The name of each element clicked and sent to GA vary according to user language, so not always the analytics will be in english.
 * This function guarantee that when the user switch tabs on betslips the GA element_text will always be sent in english.
 * This function can be removed when a better implementation to fix GA translations is available.
 */
export const getMappedBetslipTabName = (tabName: string) => {
  const betslipTabNames: Record<string, BetslipTabLabel> = {
    allTabs: { name: "all", i18nLabel: i18n.t("I18N.BETSLIP.TABS.ALL") },
    singlesTab: { name: "singles", i18nLabel: i18n.t("I18N.BETSLIP.TABS.SINGLES") },
    betBuilderTab: { name: "betBuilder", i18nLabel: i18n.t("I18N.BETSLIP.TABS.BET_BUILDER") },
    multiplesTab: { name: "multiples", i18nLabel: i18n.t("I18N.BETSLIP.TABS.MULTIPLES") },
    castBetTab: { name: "castBet", i18nLabel: i18n.t("I18N.BETSLIP.TABS.CAST_BET") },
  };

  const betslipTab = Object.values(betslipTabNames).find(({ i18nLabel }) => i18nLabel === tabName);
  return betslipTab?.name || tabName;
};

export const getClearBetslipMetrics = (
  action: ConfirmationAction | BettingObbSbkClearAction | BettingObbSbkKeepAction,
  state: ApplicationState,
): ClearBetslip | null => {
  if (!action.payload) return null;

  const {
    payload: { cardUrn, eventName, group, runnerUrn },
  } = action;

  if (!cardUrn) return null;

  let event = "no event information";

  if (eventName) {
    event = eventName;
  } else {
    if (!runnerUrn) {
      return null;
    }

    const runnerMetrics =
      group === "VIRTUAL" ? getVirtualRunnerMetrics(state, runnerUrn) : getSportsbookRunnerMetrics(state, runnerUrn);

    if (!runnerMetrics) {
      return null;
    }

    event = runnerMetrics.event_name;
  }

  const metadata = getLayoutMetadata(cardUrn);
  const { cardGroupTitle, tabName = "no tab", cardLayoutTitle } = metadata;

  const ctaLabel = "actionLabel" in action.payload ? action.payload.actionLabel : undefined;

  return {
    cardGroupTitle,
    cardLayoutTitle,
    event,
    ctaLabel,
    tabName,
  };
};

export function formatTextToGA(text: string): string {
  return text.toLowerCase().replace(/_/g, " ");
}

export function getModuleData(...modules: Array<string | null | undefined>): string {
  return modules.map((moduleElement) => moduleElement?.trim() || "null").join(" - ");
}

export function getCurrentUrlOrViewType(state: ApplicationState): string | null {
  const getViewTypeSelector = createViewTypeSelector();
  const url = state.router.currentUrl?.slice(0, MAX_URL_LENGTH_FOR_TAGGING);

  return url || getViewTypeSelector(state, state.router.currentUrn);
}

export const swipedDirectionToTaggingAction: Record<
  ObbOnboardingCardsCardGroupNavigationAction["payload"]["direction"],
  TaggingAction
> = {
  left: TaggingAction.SWIPED_LEFT,
  right: TaggingAction.SWIPED_RIGHT,
};
