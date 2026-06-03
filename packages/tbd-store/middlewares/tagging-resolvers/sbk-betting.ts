import i18n from "i18next";
import { BettingState, generateLegId, generateRunnerId, LEG_TYPES } from "@ppb/betslip-core";
import {
  SportsbookFailedPlaceBet,
  SportsbookPlaceBet,
  SportsbookRemoveSelection,
  SportsbookSuccessPlaceBet,
  SportsbookSuccessPlaceSelection,
} from "../../state/tagging/Interface.types";
import { GenericEvent } from "../../state/tagging/Event.types";
import {
  Selection,
  MarketHierarchyMetrics,
  ConfirmBet,
  RunnerMetrics,
  BetslipPopularBetBuilderAddSelectionAction,
  LoginToPlaceBetEvent,
} from "../../state/tagging/Betting.types";
import URN from "../../state/layout/URN";
import { ApplicationState } from "../../state/ApplicationState.types";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";
import { BetDirection, BetTypeGroup, TaggingAction, TaggingCategory, YesNo } from "./AnalyticsConstants";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import {
  getBettingResolvers,
  getSportsbookMarketTree,
  getSportsbookRunnerTree,
} from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSbkDisplayTransactionalError, isSingleLike } from "../../helpers/sportsbook-betting";
import { MarketSportsbookBetButtonClickAction } from "../../actions/betting";
import { getBetslipCard } from "../../state/betslip/betslip-card-selectors";
import { createBettableCardByURNSelector, createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import {
  BetslipBetBuilderAddSelectionsAction,
  BetslipBetBuilderRemoveSelectionsAction,
  PlaceSportsbookBetSuccessPayload,
} from "../../actions/betslip";
import { isRaceHierarchy, isCompetitionEventHierarchy, isEventHierarchy } from "../../helpers/markets";
import { formatTime } from "../../helpers/dates";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { getRunnerUniqueTaggingId } from "../../helpers/betting";
import { getVirtualMarketByRunnerURN } from "../../state/entities/virtual-market/virtual-market-selectors";
import { getVirtualRunnerByURN } from "../../state/entities/virtual-runner/virtual-runner-selectors";
import { getVirtualSportByURN } from "../../state/entities/virtual-sport/virtual-sport-selectors";
import { getVirtualEventByURN } from "../../state/entities/virtual-event/virtual-event-selectors";
import { PopularMultiplesBetBuilderCards } from "../../state/layout/cards/Card.types";
import { UserDetails } from "../../state";
import { Metadata } from "../../state/layout-snapshot";

const getPopularMultiplesBetBuilderCardByURN = createCardByURNSelector<PopularMultiplesBetBuilderCards, URN>();

function getVirtualRunnerMetrics(state: ApplicationState, runnerURN: string): RunnerMetrics | null {
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
    [BUSINESS.MARKET_NAME]: market.name,
    [BUSINESS.MARKET_ID]: market.marketId,
    [BUSINESS.SELECTION_ID]: runner.selectionId,
    [BUSINESS.SELECTION_NAME]: runner.name,
    [BUSINESS.SPORT_ID]: sport.sportId,
    [BUSINESS.SPORT_NAME]: `virtual:${i18n.t(sport.name.translationKey)}`,
    [BUSINESS.COMPETITION_NAME]: event.name,
    [BUSINESS.EVENT_NAME]: event.name,
    [BUSINESS.EVENT_ID]: event.eventId,
    [BUSINESS.COMPETITION_ID]: event.eventId,
    [BUSINESS.ANTEPOST_FLAG]: YesNo.No,
    [BUSINESS.IN_PLAY_INDICATOR]: YesNo.No,
  };
}

function getRunnerMetrics(
  state: ApplicationState,
  runnerURN: string,
  selectionRunnerURN?: string,
): RunnerMetrics | null {
  const {
    entities: { competitions, sportevents, races, meetings },
  } = state;
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const runnerTree = getSportsbookRunnerTree(state, runnerURN);

  const sportsbookTree =
    runnerTree || (selectionRunnerURN && getSportsbookMarketTree(state, runnerURN, selectionRunnerURN));

  if (!sportsbookTree) {
    return null;
  }
  const { marketRunner, market, sport } = sportsbookTree;
  const selectionId =
    runnerTree?.runner.selectionId ?? market.runners.find((run) => run.urn === selectionRunnerURN)?.selectionId;

  if (!selectionId) {
    return null;
  }

  const metrics = {
    [BUSINESS.MARKET_NAME]: market.name,
    [BUSINESS.IN_PLAY_INDICATOR]: market.inplay ? YesNo.Yes : YesNo.No,
    [BUSINESS.MARKET_ID]: market.marketId,
    [BUSINESS.SELECTION_ID]: selectionId,
    [BUSINESS.SELECTION_NAME]: marketRunner.name,
    [BUSINESS.SPORT_ID]: sport.sportId,
    [BUSINESS.SPORT_NAME]: sport.name,
  };

  if (isRaceHierarchy(market.hierarchy)) {
    const { race: raceURN, meeting: meetingURN } = market.hierarchy;
    const race = getRaceByURN(races, raceURN);
    const meeting = getMeetingByURN(meetings, meetingURN);

    if (!race || !meeting) {
      return null;
    }

    // TODO: review this when adding post racing
    const isAntepost = false;

    return {
      ...metrics,
      [BUSINESS.MEETING_NAME]: meeting.entityName,
      [BUSINESS.RACE_NAME]: `${formatTime(race.startTime)} ${meeting.venue}`,
      [BUSINESS.RACE_ID]: race.raceId,
      [BUSINESS.MEETING_ID]: meeting.meetingId,
      [BUSINESS.ANTEPOST_FLAG]: isAntepost ? YesNo.Yes : YesNo.No,
    };
  }

  if (isCompetitionEventHierarchy(market.hierarchy)) {
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);
    const competition = getCompetitionByURN(competitions, market.hierarchy.competition);

    if (!event?.eventId || !competition?.competitionId) {
      return null;
    }

    return {
      ...metrics,
      [BUSINESS.COMPETITION_NAME]: competition.name,
      [BUSINESS.EVENT_NAME]: event.name,
      [BUSINESS.EVENT_ID]: event.eventId,
      [BUSINESS.COMPETITION_ID]: competition.competitionId,
      [BUSINESS.ANTEPOST_FLAG]: YesNo.No,
    };
  }

  if (isEventHierarchy(market.hierarchy)) {
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);

    if (!event?.eventId) {
      return null;
    }

    return {
      ...metrics,
      [BUSINESS.COMPETITION_NAME]: null,
      [BUSINESS.EVENT_NAME]: event.name,
      [BUSINESS.EVENT_ID]: event.eventId,
      [BUSINESS.COMPETITION_ID]: null,
      [BUSINESS.ANTEPOST_FLAG]: YesNo.No,
    };
  }
  return null;
}

export const getPlaceSportsbookBetClickEvent = (): SportsbookPlaceBet => ({
  event: "ga_event",
  action: TaggingAction.SUBMITTED_BET,
  category: TaggingCategory.SBK_BETTING,
  label: "place bet",
  [APPLICATION.MODULE]: "betslip",
  [BUSINESS.BET_DIRECTION]: BetDirection.Back,
});

export const getSportsbookSuccessPlaceBetsEvent = (
  state: ApplicationState,
  payload: PlaceSportsbookBetSuccessPayload,
): SportsbookSuccessPlaceBet[] => {
  const userDetails = <UserDetails>getUserDetails(state);
  const { currencyCode } = userDetails;

  return Object.values(payload.report.result.combinations).map((combination) => ({
    event: "ga_event",
    action: TaggingAction.PLACED_BET,
    category: TaggingCategory.SBK_BETTING,
    label: "placed bet",
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.CURRENCY_CODE]: currencyCode,
    [BUSINESS.BET_ID]: `${combination.betId}`,
    [BUSINESS.BET_RECEIPT]: combination.betReceiptId,
    [BUSINESS.BET_TYPE_GROUP]: isSingleLike(combination, payload.report.result.legs)
      ? BetTypeGroup.Single
      : BetTypeGroup.Multiple,
    [BUSINESS.BET_TYPE]: combination.betType,
    [BUSINESS.CONFIRM_BETS_INDICATOR]: YesNo.No,
    [BUSINESS.ACCEPT_ODDS_INDICATOR]: YesNo.No,
    [BUSINESS.ACCA_EDGE_INDICATOR]: YesNo.No,
  }));
};

export const getSportsbookSuccessPlaceSelectionsEvent = (
  state: ApplicationState,
  payload: PlaceSportsbookBetSuccessPayload,
): SportsbookSuccessPlaceSelection[] => {
  const {
    result: { combinations, legs },
    metadata,
  } = payload.report;

  const userDetails = <UserDetails>getUserDetails(state);
  const { currencyCode } = userDetails;

  const selections: SportsbookSuccessPlaceSelection[] = [];

  Object.values(combinations).forEach((combination) => {
    combination.legs.forEach((legId) => {
      const leg = legs[legId];
      leg.runners.forEach((runnerId) => {
        const { runnerUrn, guaranteedPriceAvailable, bettingGroup } = metadata[runnerId];
        const runnerMetrics =
          bettingGroup === "REAL" ? getRunnerMetrics(state, runnerUrn) : getVirtualRunnerMetrics(state, runnerUrn);
        if (!runnerMetrics) {
          return;
        }

        const uniqueId = getRunnerUniqueTaggingId(state, runnerUrn);

        selections.push({
          event: "ga_event",
          action: TaggingAction.PLACED_BET,
          category: TaggingCategory.SBK_BETTING,
          label: "selection",
          [APPLICATION.MODULE]: "betslip",
          [BUSINESS.CURRENCY_CODE]: currencyCode,
          [BUSINESS.BET_DIRECTION]: BetDirection.Back,
          [BUSINESS.BET_ID]: `${combination.betId}`,
          [BUSINESS.BET_RECEIPT]: combination.betReceiptId,
          [BUSINESS.BET_RESPONSE]: "matched", // TODO: This can be SP in the future
          [BUSINESS.EACHWAY_INDICATOR]: YesNo.No,
          [BUSINESS.PRICE_AT_BET]: leg.displayOdds?.decimalOdds as number, // TODO: nullable in case of SP
          [BUSINESS.ACCA_EDGE_INDICATOR]: YesNo.No,
          [BUSINESS.EW_EDGE_INDICATOR]: YesNo.No,
          [BUSINESS.PRICE_BOOST_INDICATOR]: combination.isPriceBoosted ? YesNo.Yes : YesNo.No,
          [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: guaranteedPriceAvailable ? YesNo.Yes : YesNo.No,
          [BUSINESS.SELECTION_UNIQUE_ID]: uniqueId || "",
          [BUSINESS.STAKE_AMOUNT]: combination.totalStake,
          ...runnerMetrics,
        });
      });
    });
  });

  return selections;
};

export const getSportsbookFailedPlaceBetEvent = (
  failureGroup: BettingState.PlaceFailureGroup,
): SportsbookFailedPlaceBet | null => {
  const err = getSbkDisplayTransactionalError(failureGroup);
  if (!err) {
    return null;
  }

  return {
    event: "ga_event",
    action: TaggingAction.PLACED_BET_ERROR,
    category: TaggingCategory.SBK_BETTING,
    label: err,
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: BetDirection.Back,
    [BUSINESS.ERROR_CODE]: err,
  };
};

export function getBetslipSportsbookRemoveSelectionEvent(
  state: ApplicationState,
  options: { legId?: string; runnerUrn?: string },
): SportsbookRemoveSelection | null {
  const {
    betting: { sportsbookBetting },
  } = state;

  const { runnerUrn, legId } = options;

  const card = getBetslipCard(state);

  if (runnerUrn && !card?.taggingMetadata.selections[runnerUrn]) {
    return null;
  }

  const leg = legId ? sportsbookBetting.legs[legId] : Object.values(sportsbookBetting.legs)[0];

  if (!leg) {
    return null;
  }
  const bettingRunnersMetadata = getBettingResolvers(state.betslip?.group).getMetadata(state);
  const metadata = bettingRunnersMetadata[leg.runners[0]];

  if (!metadata) {
    return null;
  }

  return {
    event: "ga_event",
    action: TaggingAction.REMOVED_SELECTION,
    category: TaggingCategory.SBK_BETTING,
    label: metadata.sportName.toLowerCase(),
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: BetDirection.Back,
  };
}
export type AddSelection = GenericEvent &
  MarketHierarchyMetrics &
  Selection & {
    [BUSINESS.MARKET_ID]: string;
    [BUSINESS.MARKET_NAME]: string;
    [DEVICE.POSITION]?: number | null;
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]?: number | null;
    [BUSINESS.TRANS_CASHOUT_INDICATOR]?: number | null;
    [BUSINESS.SELECTION_UNIQUE_ID]: string;
  };
export const getSportsbookAddSelectionToBetslip = (
  state: ApplicationState,
  action: MarketSportsbookBetButtonClickAction,
  metadata: Metadata,
): AddSelection | null => {
  const {
    betting: { sportsbookBetting },
    layouts: { cards, views },
    router,
  } = state;

  const { betOriginURL, urn: runnerUrn, odds, cardUrn, group, uniqueId } = action.payload;

  const runnerIds = getBettingResolvers(group).getMarketRunnerIdAssociation(state.entities, runnerUrn);
  if (!runnerIds) {
    return null;
  }

  const { marketId, selectionId } = runnerIds;
  const runnerTuple = [generateRunnerId({ marketId, selectionId })];
  const legId = generateLegId(LEG_TYPES.SIMPLE_SELECTION, runnerTuple);
  if (sportsbookBetting.legs[legId]) {
    // removing the bet
    return null;
  }

  const viewUrn = router.currentUrn;
  if (!viewUrn) {
    return null;
  }

  const view = getViewbyURN(views, viewUrn);
  if (!view) {
    return null;
  }

  const getBettableCardByURN = createBettableCardByURNSelector();
  const card = getBettableCardByURN(cards, cardUrn);
  if (!card) {
    return null;
  }

  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const runnerMetrics =
    group === "VIRTUAL" ? getVirtualRunnerMetrics(state, runnerUrn) : getRunnerMetrics(state, runnerUrn);

  if (!runnerMetrics) {
    return null;
  }

  const marketName = runnerMetrics[BUSINESS.MARKET_NAME];
  const module = card.typename === "HighlightedSelectionCard" ? "secondary swimlane" : "primary swimlane";

  const { horizontalPosition, verticalPosition, cardGroupTitle, tabName = null } = metadata;

  const moduleName =
    card.typename === "MatchStatSelectionCard"
      ? `${pageType} - ${module} - ${cardGroupTitle} - obp`
      : `${pageType} - ${module} - ${cardGroupTitle} - ${marketName} - ${tabName}`;

  return {
    event: "ga_event",
    category: TaggingCategory.SBK_BETTING,
    action: TaggingAction.ADDED_SELECTION,
    label: card.typename === "MatchStatSelectionCard" ? "obp" : runnerMetrics[BUSINESS.SPORT_NAME],
    [APPLICATION.MODULE]: moduleName,
    [BUSINESS.BET_DIRECTION]: "back",
    [BUSINESS.SELECTION_SOURCE_URL]: betOriginURL,
    [BUSINESS.PRICE_AT_SELECTION]: odds?.decimal ?? null,
    [DEVICE.POSITION]: verticalPosition || null,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: horizontalPosition || null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: horizontalPosition || null,
    [BUSINESS.SELECTION_UNIQUE_ID]: uniqueId || "",
    ...runnerMetrics,
  };
};

export const getSbkIncrementStakeEvent = (increment: number, currencySymbol: string | undefined): GenericEvent => {
  const symbol = currencySymbol || "";

  return {
    event: "ga_event",
    action: TaggingAction.SELECTED,
    category: TaggingCategory.SBK_BETTING,
    label: `+${symbol}${increment} quick stake`,
    [APPLICATION.MODULE]: "betslip",
  };
};

export const getAutoConfirmSportsbookBetClickEvent = (): ConfirmBet => ({
  event: "ga_event",
  category: TaggingCategory.SBK_BETTING,
  action: TaggingAction.AUTO_CONFIRMED_BET,
  label: "place bet",
  [APPLICATION.MODULE]: "betslip",
  [BUSINESS.BET_DIRECTION]: "back",
});

export const getBetslipBetBuilderAddSelections = (
  state: ApplicationState,
  action: BetslipBetBuilderAddSelectionsAction,
  metadata: Metadata,
  betIdentifier: string,
): BetslipPopularBetBuilderAddSelectionAction | null => {
  const { odds, selection, cardUrn } = action.payload;

  const popularMultiplesBetBuilderCard = getPopularMultiplesBetBuilderCardByURN(
    state.layouts.cards.popularmultiplesbetbuilders,
    cardUrn,
  );
  const popularMultiplesTitle = popularMultiplesBetBuilderCard?.title || null;

  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const { horizontalPosition, verticalPosition, cardGroupTitle, tabName } = metadata;

  const runnerMetrics = getRunnerMetrics(state, selection.marketUrn, selection.runnerUrn);
  if (!runnerMetrics) {
    return null;
  }
  const marketName = runnerMetrics[BUSINESS.MARKET_NAME];

  const moduleName = `${pageType} - primary swimlane - ${cardGroupTitle} | ${popularMultiplesTitle} - ${marketName} - ${tabName}`;

  return {
    event: "ga_event",
    category: TaggingCategory.SBK_BETTING,
    action: TaggingAction.ADDED_SELECTION,
    label: runnerMetrics[BUSINESS.SPORT_NAME],
    [APPLICATION.MODULE]: moduleName,
    [BUSINESS.BET_DIRECTION]: "back",
    [BUSINESS.MODULE_OF_SELECTION]: "betslip",
    [BUSINESS.SELECTION_SOURCE_URL]: window.location ? window.location.href : "",
    [BUSINESS.CMS_CARD_TITLE]: null,
    [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
    [BUSINESS.CMS_COUPON_NAME]: null,
    [BUSINESS.PRICE_AT_SELECTION]: odds?.decimal ?? null,
    [DEVICE.POSITION]: verticalPosition ?? null,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: horizontalPosition ?? null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: horizontalPosition ?? null,
    [BUSINESS.SELECTION_UNIQUE_ID]: betIdentifier,
    ...runnerMetrics,
  };
};

export const getBetslipBetBuilderRemoveSelections = (
  state: ApplicationState,
  metadata: Metadata,
  action: BetslipBetBuilderRemoveSelectionsAction,
): GenericEvent | null => {
  const events = state.entities.sportevents;

  const { selection, cardUrn } = action.payload;

  const popularMultiplesBetBuilderCard = getPopularMultiplesBetBuilderCardByURN(
    state.layouts.cards.popularmultiplesbetbuilders,
    cardUrn,
  );
  const popularMultiplesTitle = popularMultiplesBetBuilderCard?.title || null;

  const sportsbookRunnerTree = getSportsbookMarketTree(state, selection.marketUrn, selection.runnerUrn);
  if (!sportsbookRunnerTree) {
    return null;
  }
  const { cardGroupTitle, tabName } = metadata;

  const { market, sport } = sportsbookRunnerTree;
  let eventName;
  if (isEventHierarchy(market.hierarchy) || isCompetitionEventHierarchy(market.hierarchy)) {
    const event = getSportEventByURN(events, market.hierarchy.sportevent);

    if (!event?.name) {
      return null;
    }
    eventName = event.name;
  }

  return {
    event: "ga_event",
    category: TaggingCategory.SBK_BETTING,
    action: TaggingAction.REMOVED_ALL_SELECTIONS,
    label: sport.name,
    [APPLICATION.MODULE]: `${tabName} - ${cardGroupTitle} | ${popularMultiplesTitle} - ${eventName}`,
  };
};

export const getBetslipSportsbookLoginToPlaceBetClickEvent = (): LoginToPlaceBetEvent => ({
  event: "ga_event",
  category: TaggingCategory.SBK_BETTING,
  action: TaggingAction.SUBMITTED_BET,
  label: "login & place bet",
  [APPLICATION.MODULE]: "betslip",
  [BUSINESS.BET_DIRECTION]: "back",
  [BUSINESS.ERROR_CODE]: null,
});
