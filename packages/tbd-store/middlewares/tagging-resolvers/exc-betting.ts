import { GenericEvent } from "../../state/tagging/Event.types";
import {
  ExchangeRemoveSelection,
  ExchangePlaceBet,
  ExchangeFailedPlaceBet,
  ExchangeSuccessPlaceBet,
} from "../../state/tagging/Interface.types";
import {
  MarketHierarchyMetrics,
  BetMetrics,
  BetResponse,
  CancelBet,
  ClickEdit,
  EditSuccessfull,
  RunnerMetrics,
  UpdateBet,
  PriceChange,
  Selection,
  MyBetsEditClick,
  LoginToPlaceBetEvent,
} from "../../state/tagging/Betting.types";
import { ExchangePersistenceType, UserDetails } from "../../state/entities";
import { BetslipExchangeReport } from "../../state/betslip/Betslip.types";
import { ApplicationState } from "../../state/ApplicationState.types";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";

import { BetDirection, BetTypeGroup, TaggingAction, TaggingCategory, YesNo } from "./AnalyticsConstants";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { MarketExchangeBetButtonClickAction } from "../../actions/betting";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createBettableCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { getBetslipExchangeContext } from "../../state/betslip/betslip-card-selectors";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../../state/entities/entities-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { getExchangeOrder } from "../../state/betting/exchange-orders/exchange-order-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { isRaceHierarchy, isCompetitionEventHierarchy } from "../../helpers/markets";
import { formatTime } from "../../helpers/dates";

import { PlaceExchangeBetSuccessPayload } from "../../actions/betslip";
import { createUserPreferencesWithProductSwitcherSelector } from "../../state/entities/user-preferences/user-preferences-selectors";
import { getRunnerUniqueTaggingId } from "../../helpers/betting";
import { ExchangeOrder } from "../../state/betting/exchange-orders/ExchangeOrder.types";
import {
  ExchangeBetTransactionErrorCode,
  ExchangeBetTransactionError,
} from "../../state/betting/ExchangeBetTransactionError.types";
import { ExchangeSide as ExchangeSideType } from "../../state/betting/exchange-bets/ExchangeBet.types";
import { ExchangeSide } from "../../state/constants";
import { Metadata } from "../../state/layout-snapshot";

function getExchangeBetDirection(side: ExchangeSideType): BetDirection {
  return side === ExchangeSide.BACK ? BetDirection.Back : BetDirection.Lay;
}

function getBetResponseFromReport(report: BetslipExchangeReport): BetResponse {
  const { matched, unmatched } = report;

  const hasMatched = !!matched?.price;
  const hasUnmatched = !!unmatched?.price;

  if (hasMatched && hasUnmatched) {
    return "partially-matched";
  }

  return hasMatched ? "matched" : "unmatched";
}

function getBetResponse(order: ExchangeOrder | null): BetResponse | undefined {
  if (!order) return undefined;
  if (order.orderType !== "LIMIT") return "sp";
  if (order.sizeMatched && !order.sizeRemaining) return "matched";
  if (!order.sizeMatched && order.sizeRemaining) return "unmatched";

  return "partially-matched";
}

function getRunnerMetrics(state: ApplicationState, runnerURN: string): RunnerMetrics | null {
  const {
    entities: { competitions, meetings, sportevents, races },
  } = state;
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const runnerTree = getExchangeRunnerTree(state.entities, runnerURN);
  if (!runnerTree) {
    return null;
  }
  const { marketRunner, market, sport, runner } = runnerTree;

  const metrics = {
    [BUSINESS.MARKET_NAME]: market.name,
    [BUSINESS.IN_PLAY_INDICATOR]: market.inplay ? YesNo.Yes : YesNo.No,
    [BUSINESS.MARKET_ID]: market.marketId,
    [BUSINESS.SELECTION_ID]: runner.selectionId,
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
    const competition = getCompetitionByURN(competitions, market.hierarchy.competition);
    const event = getSportEventByURN(sportevents, market.hierarchy.sportevent);

    if (!sport || !event?.eventId || !competition?.competitionId || !competition?.name) {
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
  // TODO: Missing race antepost && outrights
  return null;
}

function getBetMetrics(state: ApplicationState, betOriginURL: string | null, betId?: string): BetMetrics | null {
  const { exchangemarkets, sports } = state.entities;
  let betResponse: BetResponse | undefined;
  let order: ExchangeOrder | null = null;

  const getExchangeMarketByURN = createExchangeMarketSelector();
  const { currencyCode } = <UserDetails>getUserDetails(state);

  const betslipContext = getBetslipExchangeContext(state);
  if (!betslipContext) return null;
  const { market: marketURN, side, runner: runnerURN } = betslipContext;

  const runnerMetrics = getRunnerMetrics(state, runnerURN);
  if (!runnerMetrics) return null;

  const { sport: sportUrn } = getExchangeMarketByURN(exchangemarkets, marketURN) || {};

  const sport = sportUrn ? getSportByURN(sports, sportUrn) : undefined;

  if (betId) {
    order = getExchangeOrder(state, marketURN, betId);
    betResponse = getBetResponse(order);
  }

  if (!sport?.sportId || !currencyCode) return null;

  return {
    [BUSINESS.SELECTION_SOURCE_URL]: betOriginURL,
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
    [BUSINESS.PRICE_AT_SELECTION]: order?.price || null,
    [BUSINESS.CURRENCY_CODE]: currencyCode,
    [BUSINESS.BET_ID]: betId,
    [BUSINESS.BET_RESPONSE]: betResponse,
    ...runnerMetrics,
  };
}

export const getDontUpdateBetClickEvent = (): GenericEvent => ({
  event: "ga_event",
  action: TaggingAction.EDITED_BET,
  category: TaggingCategory.EXC_BETTING,
  label: "don't update",
  [APPLICATION.MODULE]: "betslip",
});

export const getOpenPersistenceTypeMenuEvent = (): GenericEvent => ({
  event: "ga_event",
  action: TaggingAction.SHOW,
  category: TaggingCategory.EXC_BETTING,
  label: "at in play options",
  [APPLICATION.MODULE]: "betslip",
});

export const getUpdateBetClickEvent = (side: ExchangeSideType): UpdateBet => ({
  event: "ga_event",
  action: TaggingAction.SUBMITTED_BET,
  category: TaggingCategory.EXC_BETTING,
  label: "submitted bet - unmatched update",
  [APPLICATION.MODULE]: "betslip",
  [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
});

export const getUpdateBetFailureEvent = (
  state: ApplicationState,
  errorCode: ExchangeBetTransactionErrorCode,
): UpdateBet | null => {
  const betslipContext = getBetslipExchangeContext(state);
  const label = errorCode.toLowerCase();

  if (!betslipContext) {
    return null;
  }

  return {
    event: "ga_event",
    action: TaggingAction.UPDATE_BET_FAILURE,
    category: TaggingCategory.EXC_BETTING,
    label,
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(betslipContext.side),
    [BUSINESS.ERROR_CODE]: errorCode,
  };
};

export const getCancelBetClickEvent = (
  action: TaggingAction,
  label: string,
  moduleName: string,
  side?: ExchangeSideType,
  error?: ExchangeBetTransactionErrorCode,
): CancelBet => ({
  event: "ga_event",
  action,
  category: TaggingCategory.EXC_BETTING,
  label,
  [APPLICATION.MODULE]: moduleName,
  [BUSINESS.BET_DIRECTION]: side === ExchangeSide.BACK ? "back" : "lay",
  [BUSINESS.ERROR_CODE]: error,
});
export const getBetslipCancelBetClickEvent = (
  state: ApplicationState,
  action: TaggingAction,
  label: string,
  error?: ExchangeBetTransactionErrorCode,
): CancelBet | null => {
  const betslipContext = getBetslipExchangeContext(state);

  if (!betslipContext) {
    return null;
  }

  return getCancelBetClickEvent(action, label, "betslip", betslipContext.side, error);
};
export const getChangePersistenceTypeClickEvent = (
  state: ApplicationState,
  persistenceType: ExchangePersistenceType,
): UpdateBet | null => {
  const betslipContext = getBetslipExchangeContext(state);

  if (!betslipContext) {
    return null;
  }
  return {
    event: "ga_event",
    action: TaggingAction.TOGGLE_ON,
    category: TaggingCategory.EXC_BETTING,
    label: persistenceType,
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(betslipContext.side),
  };
};

export const getPlaceExchangeBetClickEvent = (state: ApplicationState): ExchangePlaceBet | null => {
  const betslipContext = getBetslipExchangeContext(state);

  if (!betslipContext) {
    return null;
  }

  const [potentialBet] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, betslipContext.runner);
  if (!potentialBet) {
    return null;
  }

  return {
    event: "ga_event",
    action: TaggingAction.SUBMITTED_BET,
    category: TaggingCategory.EXC_BETTING,
    label: "place bet",
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(potentialBet.side),
  };
};

function getExchangeConfirmBetEvent(state: ApplicationState, taggingAction: TaggingAction): ExchangePlaceBet | null {
  const betslipContext = getBetslipExchangeContext(state);

  if (!betslipContext) {
    return null;
  }

  const [potentialBet] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, betslipContext.runner);
  if (!potentialBet) {
    return null;
  }

  return {
    event: "ga_event",
    action: taggingAction,
    category: TaggingCategory.EXC_BETTING,
    label: "place bet",
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(potentialBet.side),
  };
}

export const getExchangeAutoConfirmedBetClickEvent = (state: ApplicationState): ExchangePlaceBet | null =>
  getExchangeConfirmBetEvent(state, TaggingAction.AUTO_CONFIRMED_BET);

export const getExchangeConfirmBetClickEvent = (state: ApplicationState): ExchangePlaceBet | null =>
  getExchangeConfirmBetEvent(state, TaggingAction.CONFIRMED_BET);

export const getExchangeSuccessPlaceBetEvent = (
  state: ApplicationState,
  payload: PlaceExchangeBetSuccessPayload,
): ExchangeSuccessPlaceBet | null => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  if (!payload.betId) {
    return null;
  }

  const userDetails = <UserDetails>getUserDetails(state);
  const { currencyCode } = userDetails;

  const { exchangeConfirmBetPlacement } = getUserPreferencesWithProductSwitcher(state.entities.preferences);

  return {
    event: "ga_event",
    action: TaggingAction.PLACED_BET,
    category: TaggingCategory.EXC_BETTING,
    label: "placed bet",
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.CURRENCY_CODE]: currencyCode,
    [BUSINESS.BET_ID]: payload.betId,
    [BUSINESS.BET_TYPE_GROUP]: BetTypeGroup.Single,
    [BUSINESS.BET_TYPE]: "single",
    [BUSINESS.CONFIRM_BETS_INDICATOR]: exchangeConfirmBetPlacement ? YesNo.Yes : YesNo.No,
  };
};

export type ExchangeSuccessPlaceBetSelection = GenericEvent &
  MarketHierarchyMetrics & {
    [BUSINESS.CURRENCY_CODE]: string;
    [BUSINESS.BET_ID]: string;
    [BUSINESS.SPORT_ID]: number;
    [BUSINESS.SPORT_NAME]: string;
    [BUSINESS.MARKET_ID]: string;
    [BUSINESS.MARKET_NAME]: string;
    [BUSINESS.SELECTION_ID]: number;
    [BUSINESS.SELECTION_NAME]: string;
    [BUSINESS.ANTEPOST_FLAG]: string;
    [BUSINESS.BET_DIRECTION]: string;
    [BUSINESS.BET_RESPONSE]: BetResponse | undefined;
    [BUSINESS.PRICE_AT_BET]: number | undefined;
    [BUSINESS.IN_PLAY_INDICATOR]: YesNo;
    [BUSINESS.EACHWAY_INDICATOR]: YesNo;
    [BUSINESS.SELECTION_UNIQUE_ID]: string;
    [BUSINESS.STAKE_AMOUNT]: number | undefined;
  };

export const getExchangeSuccessPlaceBetSelectionEvent = (
  state: ApplicationState,
  payload: PlaceExchangeBetSuccessPayload,
): ExchangeSuccessPlaceBetSelection | null => {
  const { currencyCode } = <UserDetails>getUserDetails(state);

  if (!payload.betId) {
    return null;
  }

  const runnerMetrics = getRunnerMetrics(state, payload.report.runner);
  if (!runnerMetrics) {
    return null;
  }

  const { matched, unmatched, side } = payload.report;

  const price = matched?.price || unmatched?.price;
  const size = matched?.size || unmatched?.size;
  const betResponse = getBetResponseFromReport(payload.report);

  // hard-coded for now since we don't have this indicator
  const eachwayIndicator = YesNo.No;

  const uniqueId = getRunnerUniqueTaggingId(state, payload.report.runner);

  return {
    event: "ga_event",
    action: TaggingAction.PLACED_BET,
    category: TaggingCategory.EXC_BETTING,
    label: "selection",
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.CURRENCY_CODE]: currencyCode,
    [BUSINESS.EACHWAY_INDICATOR]: eachwayIndicator,
    [BUSINESS.BET_ID]: payload.betId || "",
    [BUSINESS.SPORT_ID]: runnerMetrics[BUSINESS.SPORT_ID],
    [BUSINESS.SPORT_NAME]: runnerMetrics[BUSINESS.SPORT_NAME],
    [BUSINESS.EVENT_ID]: runnerMetrics[BUSINESS.EVENT_ID],
    [BUSINESS.EVENT_NAME]: runnerMetrics[BUSINESS.EVENT_NAME],
    [BUSINESS.MARKET_ID]: runnerMetrics[BUSINESS.MARKET_ID],
    [BUSINESS.MARKET_NAME]: runnerMetrics[BUSINESS.MARKET_NAME],
    [BUSINESS.SELECTION_ID]: runnerMetrics[BUSINESS.SELECTION_ID],
    [BUSINESS.SELECTION_NAME]: runnerMetrics[BUSINESS.SELECTION_NAME],
    [BUSINESS.COMPETITION_ID]: runnerMetrics[BUSINESS.COMPETITION_ID],
    [BUSINESS.COMPETITION_NAME]: runnerMetrics[BUSINESS.COMPETITION_NAME],
    [BUSINESS.ANTEPOST_FLAG]: runnerMetrics[BUSINESS.ANTEPOST_FLAG],
    [BUSINESS.IN_PLAY_INDICATOR]: runnerMetrics[BUSINESS.IN_PLAY_INDICATOR],
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
    [BUSINESS.BET_RESPONSE]: betResponse,
    [BUSINESS.PRICE_AT_BET]: price,
    [BUSINESS.SELECTION_UNIQUE_ID]: uniqueId || "",
    [BUSINESS.STAKE_AMOUNT]: size,
  };
};

export const getExchangeFailedPlaceBetEvent = (
  state: ApplicationState,
  transactionError: ExchangeBetTransactionError,
  side: ExchangeSideType,
): ExchangeFailedPlaceBet | null => {
  const betslipContext = getBetslipExchangeContext(state);
  if (!betslipContext) {
    return null;
  }

  return {
    event: "ga_event",
    action: TaggingAction.PLACED_BET_ERROR,
    category: TaggingCategory.EXC_BETTING,
    label: transactionError.errorCode,
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
    [BUSINESS.ERROR_CODE]: transactionError.errorCode,
  };
};

export const getExcIncrementSizeEvent = (increment: number, currencySymbol: string | undefined): GenericEvent => {
  const symbol = currencySymbol || "";

  return {
    event: "ga_event",
    action: TaggingAction.SELECTED,
    category: TaggingCategory.EXC_BETTING,
    label: `+${symbol}${increment} quick stake`,
    [APPLICATION.MODULE]: "betslip",
  };
};

export function getBetslipExchangeRemoveSelectionEvent(state: ApplicationState): ExchangeRemoveSelection | null {
  const betslipContext = getBetslipExchangeContext(state);

  if (!betslipContext) {
    return null;
  }

  // Given the fact we only handle one potential bet at a time.
  // This bet is the one that will always get removed / replaced.
  const [potentialBetBeingRemoved] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, betslipContext.runner);

  if (!potentialBetBeingRemoved) {
    return null;
  }

  const runnerTree = getExchangeRunnerTree(state.entities, betslipContext.runner);
  if (!runnerTree) {
    return null;
  }

  return {
    event: "ga_event",
    action: TaggingAction.REMOVED_SELECTION,
    category: TaggingCategory.EXC_BETTING,
    label: runnerTree.sport.name,
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(potentialBetBeingRemoved.side),
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

export const getExchangeAddSelectionToBetslip = (
  state: ApplicationState,
  action: MarketExchangeBetButtonClickAction,
  metadata: Metadata,
): AddSelection | null => {
  const {
    layouts: { views },
    router,
  } = state;
  const { betOriginURL, urn: runnerUrn, price, side, cardUrn, uniqueId } = action.payload;
  const betslipContext = getBetslipExchangeContext(state);
  const getBettableCardByURN = createBettableCardByURNSelector();

  if (betslipContext && betslipContext.runner === runnerUrn && betslipContext.side === side) {
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

  const card = getBettableCardByURN(state.layouts.cards, cardUrn);
  if (!card) {
    return null;
  }

  const runnerMetrics = getRunnerMetrics(state, runnerUrn);
  if (!runnerMetrics) return null;

  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const marketName = runnerMetrics[BUSINESS.MARKET_NAME];
  const module = card.typename === "HighlightedSelectionCard" ? "secondary swimlane" : "primary swimlane";

  const { cd5: sportName, cd14, ...selectionMetrics } = runnerMetrics;

  const { horizontalPosition, verticalPosition, cardGroupTitle, tabName } = metadata;

  const moduleName = `${pageType} - ${module} - ${cardGroupTitle} - ${marketName} - ${tabName}`;

  return {
    event: "ga_event",
    category: TaggingCategory.EXC_BETTING,
    action: TaggingAction.ADDED_SELECTION,
    label: sportName,
    [APPLICATION.MODULE]: moduleName,
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
    [BUSINESS.SELECTION_SOURCE_URL]: betOriginURL,
    [BUSINESS.PRICE_AT_SELECTION]: price === undefined ? null : price,
    [DEVICE.POSITION]: verticalPosition || null,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: horizontalPosition || null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: horizontalPosition || null,
    [BUSINESS.SELECTION_UNIQUE_ID]: uniqueId || "",
    ...selectionMetrics,
  };
};

export const getExchangeOnClickEdit = (
  state: ApplicationState,
  betId: string,
  betOriginURL: string,
): ClickEdit | null => {
  const betMetrics = getBetMetrics(state, betOriginURL, betId);
  if (!betMetrics || !betOriginURL) return null;

  const BET_RESPONSE = betMetrics[BUSINESS.BET_RESPONSE];
  const BET_ID = betMetrics[BUSINESS.BET_ID];
  if (!BET_RESPONSE || !BET_ID) return null;

  return {
    event: "ga_event",
    category: TaggingCategory.EXC_BETTING,
    action: TaggingAction.EDITED_BET,
    label: "edit bet",
    ...betMetrics,
    [APPLICATION.MODULE]: `betslip`,
    [BUSINESS.MODULE_OF_SELECTION]: "betslip",
    [BUSINESS.BET_RESPONSE]: BET_RESPONSE,
    [BUSINESS.BET_ID]: BET_ID,
  };
};

export const getExchangeBetEditSuccessfull = (
  state: ApplicationState,
  report: BetslipExchangeReport,
  betOriginURL: string | null,
): EditSuccessfull | null => {
  const betMetrics = getBetMetrics(state, betOriginURL);
  if (!betMetrics || !report) return null;

  const { matched, unmatched, priceAtSelection } = report;
  const betId = matched?.betId || unmatched?.betId;
  const price = matched?.price || unmatched?.price;
  const size = matched?.size || unmatched?.size;
  const hasMatched = !!matched?.price;
  const hasUnmatched = !!unmatched?.price;

  let betResponse: BetResponse | undefined;
  if (hasMatched && !hasUnmatched) betResponse = "matched";
  if (!hasMatched && hasUnmatched) betResponse = "unmatched";
  betResponse = betResponse || "partially-matched";

  // hard-coded for now since we don't have this info. Will be covered in another story.
  const cashoutIndicator = true;

  if (!betId || !price || !size || !priceAtSelection) return null;

  return {
    event: "ga_event",
    category: TaggingCategory.EXC_BETTING,
    action: TaggingAction.PLACED_BET,
    label: "place bet - unmatched update",
    ...betMetrics,
    [APPLICATION.MODULE]: `betslip`,
    [BUSINESS.MODULE_OF_SELECTION]: "betslip",
    [BUSINESS.PRICE_AT_SELECTION]: priceAtSelection,
    [BUSINESS.PRICE_AT_BET]: price,
    [BUSINESS.CASHOUT_INDICATOR]: cashoutIndicator,
    [BUSINESS.BET_RESPONSE]: betResponse,
    [BUSINESS.BET_ID]: betId,
    [BUSINESS.STAKE_AMOUNT]: size,
  };
};

export const getBetReceiptExchangeDoneClickEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.EXC_BETTING,
  action: TaggingAction.CLOSED,
  label: "bet receipt",
  [APPLICATION.MODULE]: "bet receipt",
});

export const getExchangePriceChangeEvent = (
  state: ApplicationState,
  { runner, side }: { runner: string; side: ExchangeSideType },
): PriceChange | null => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  const runnerMetrics = getRunnerMetrics(state, runner);
  if (!runnerMetrics) {
    return null;
  }

  const { exchangeConfirmBetPlacement } = getUserPreferencesWithProductSwitcher(state.entities.preferences);

  return {
    event: "ga_event",
    category: TaggingCategory.EXC_BETTING,
    action: TaggingAction.CHANGED_ODDS,
    label: "betting",
    [APPLICATION.MODULE]: "betslip",
    [BUSINESS.COMPETITION_NAME]: runnerMetrics[BUSINESS.COMPETITION_NAME],
    [BUSINESS.EVENT_NAME]: runnerMetrics[BUSINESS.EVENT_NAME],
    [BUSINESS.MARKET_NAME]: runnerMetrics[BUSINESS.MARKET_NAME],
    [BUSINESS.IN_PLAY_INDICATOR]: runnerMetrics[BUSINESS.IN_PLAY_INDICATOR],
    [BUSINESS.EVENT_ID]: runnerMetrics[BUSINESS.EVENT_ID],
    [BUSINESS.MARKET_ID]: runnerMetrics[BUSINESS.MARKET_ID],
    [BUSINESS.SELECTION_ID]: runnerMetrics[BUSINESS.SELECTION_ID],
    [BUSINESS.COMPETITION_ID]: runnerMetrics[BUSINESS.COMPETITION_ID],
    [BUSINESS.SELECTION_NAME]: runnerMetrics[BUSINESS.SELECTION_NAME],
    [BUSINESS.SPORT_ID]: runnerMetrics[BUSINESS.SPORT_ID],
    [BUSINESS.SPORT_NAME]: runnerMetrics[BUSINESS.SPORT_NAME],
    [BUSINESS.BET_TYPE]: "single",
    [BUSINESS.CASHOUT_INDICATOR]: YesNo.No,
    [BUSINESS.BET_TYPE_GROUP]: "single",
    [BUSINESS.CONFIRM_BETS_INDICATOR]: exchangeConfirmBetPlacement ? YesNo.Yes : YesNo.No,
    [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
  };
};

export const getMyBetsEditClickEvent = (side: ExchangeSideType): MyBetsEditClick => ({
  event: "ga_event",
  category: TaggingCategory.EXC_BETTING,
  action: TaggingAction.EDIT_UNMATCHED_BET,
  label: "my bets",
  [APPLICATION.MODULE]: "my bets",
  [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
});

export const getMyBetsEditBottomSheetCloseEvent = (): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.EXC_BETTING,
  action: TaggingAction.CLOSED,
  label: "edit bet",
  [APPLICATION.MODULE]: "edit bet bottom sheet",
});

export const getBetslipExchangeLoginToPlaceBetClickEvent = (side: ExchangeSideType): LoginToPlaceBetEvent => ({
  event: "ga_event",
  category: TaggingCategory.EXC_BETTING,
  action: TaggingAction.SUBMITTED_BET,
  label: "login & place bet",
  [APPLICATION.MODULE]: "betslip",
  [BUSINESS.BET_DIRECTION]: getExchangeBetDirection(side),
  [BUSINESS.ERROR_CODE]: null,
});

export const getMyBetsExchangeOrderStatusClickEvent = (
  orderStatusFilterLabel: string,
  moduleName: string,
): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.CLICKED,
  label: `exchange - ${orderStatusFilterLabel}`,
  [APPLICATION.MODULE]: moduleName,
});
