import { call, takeLatest, put, delay, spawn, cancel, select, debounce, takeEvery } from "redux-saga/effects";
import { SagaIterator, Task } from "redux-saga";
import { codecs } from "@ppb/tbd-urn-codecs";
import { ExchangeMarket, Sport, SportEvent } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import { Product } from "../state/entities/user-preferences/UserPreferences.types";
import cashoutService from "../services/cashout-service";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import {
  EnhancedExchangeMarketBet,
  createExchangeMarketBetSelector,
} from "../state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { getSportByURN } from "../state/entities/sports/sport-selectors";
import { getSportEventByURN } from "../state/entities/sport-events/sport-event-selectors";
import { createExchangeCashoutQuoteSelector } from "../state/betting/exchange-cashouts/exchange-cashout-selectors";
import { FETCH_EXC_OPEN_BETS_SUCCESS, FetchExchangeOpenBetsSuccessAction } from "../actions/exchange-open-bets";
import { buildQuoteReceipt } from "../helpers/receipt";

import {
  NETWORK__FETCH_EXC_QUOTES_SUCCESS,
  NETWORK__FETCH_EXC_QUOTES_FAILURE,
  FetchExchangeQuotesSuccessAction,
  SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  SubscribeExchangeCashoutAction,
  UnsubscribeExchangeCashoutAction,
  FetchExchangeQuotesFailureAction,
  NETWORK__CASHOUT_TAKE,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  NETWORK__CASHOUT_TAKE_FAILURE,
  TakeCashoutAction,
  TakeCashoutSuccessAction,
  TakeCashoutFailureAction,
  TakeCashoutInProgressAction,
  NETWORK__CASHOUT_TAKE_IN_PROGRESS,
  CASHOUT__RECEIPT_CLOSE_ALL,
  CashoutReceiptCloseAll,
} from "../actions/cashout";
import { getInterval } from "../config";
import {
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
  FetchExchangeMarketUpdatesSuccessAction,
} from "../actions/exchange-markets";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import {
  MyBetsSubscribeCardUpdatesAction,
  MyBetsUnsubscribeCardUpdatesAction,
  MY_BETS_SUBSCRIBE_CARD_UPDATES,
  MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  UI__MY_BETS_EXC_EDIT_BET_PRESS,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
} from "../actions/my-bets";
import { createCardByURNSelector } from "../state/layout/cards/cards-selectors";
import { createMeetingByURNSelector } from "../state/entities/meetings/meeting-selectors";
import { isRaceHierarchy } from "../helpers/markets";
import { UPDATE_PRODUCT_PREFERENCE } from "../actions/preferences";
import { PUSH, BOTTOM_BAR_PUSH, REFRESH } from "../actions/router";
import { createCardGroupByURNSelector } from "../state/layout/cardgroups/cardgroups-selectors";
import { FetchCardsAction, FETCH_CARDS } from "../actions/catalogue";
import { MarketId } from "../state/entities/Common.types";
import { MarketBetCard, MarketBetCards } from "../state/layout/cards/Card.types";
import { BetCardGroup, BetCardGroups } from "../state/layout/cardgroups/CardGroup.types";
import URN from "../state/layout/URN";
import { ExchangeCashoutQuote, ExchangeMarketStatus } from "../clients/catalogue/catalogue-response-types";
import { ExchangeCashouts } from "../state/betting/exchange-cashouts/ExchangeCashouts.types";
import { ExchangeMarketBet } from "../state/betting/exchange-market-bets/ExchangeMarketBet.types";
import { CashoutStep } from "../state/constants";

type CashoutEligibleMarket = {
  marketId: MarketId;
  marketUrn: URN;
  marketBetUrn: URN;
  hasSizeMatched: boolean;
};

enum PollingContext {
  MY_BETS = "MY_BETS",
  MARKET_VIEW = "COS",
}

let currentPollingContext: PollingContext;

/*
 * Markets subscribed by cards that allow the cashout feature
 */
const SUBSCRIBED_MARKETS = new Map<string, CashoutEligibleMarket>();
const RESET_POLLER_TIMEOUT = 400;

const genericErrorStatus = "GENERIC";

let pollerDetachedTask: Task;
let pollerInterval: number;
let customerRef: string | undefined;

const getExchangeMarketByURN = createExchangeMarketSelector();
const getExchangeMarketBetByURN = createExchangeMarketBetSelector();
const getCardByURN = createCardByURNSelector<MarketBetCards, URN>();
const getCardGroupByURN = createCardGroupByURNSelector<BetCardGroups, URN>();
const getMeetingByUrn = createMeetingByURNSelector();
const getExchangeCashoutQuoteByURN = createExchangeCashoutQuoteSelector();

function getMarketInplayAndSportName(
  marketUrn: string,
): (state: ApplicationState) => { inPlay?: boolean; sportId?: number } {
  return ({ entities: { exchangemarkets, sports } }: ApplicationState) => {
    const { inplay, sport } = getExchangeMarketByURN(exchangemarkets, marketUrn) as ExchangeMarket;
    const { sportId } = getSportByURN(sports, sport) as Sport;

    return {
      inPlay: inplay,
      sportId,
    };
  };
}

type cashoutReceiptHeader = { title: string; subtitle: string; marketBetCardGroupURN?: URN[] };

function buildReceiptHeader(quote: ExchangeCashoutQuote): (state: ApplicationState) => cashoutReceiptHeader {
  return (state: ApplicationState): cashoutReceiptHeader => {
    const {
      entities: { exchangemarkets, sportevents, meetings },
      layouts: {
        cardgroups: { betcardgroups },
      },
    } = state;

    if (currentPollingContext === PollingContext.MARKET_VIEW) {
      const excMarket = getExchangeMarketByURN(exchangemarkets, quote.marketURN) as ExchangeMarket;

      if (isRaceHierarchy(excMarket.hierarchy)) {
        const meeting = getMeetingByUrn(meetings, excMarket?.hierarchy?.meeting);
        return {
          title: meeting.entityName,
          subtitle: excMarket.name,
        };
      }

      const event = getSportEventByURN(sportevents, excMarket.hierarchy.sportevent) as SportEvent;

      return {
        title: event.name,
        subtitle: excMarket.name,
      };
    }

    if (currentPollingContext === PollingContext.MY_BETS) {
      const { betCardGroupURN, marketBetCardGroupURN, description } = getExchangeMarketBetByURN(
        state,
        quote.marketBetURN,
      ) as EnhancedExchangeMarketBet;

      if (betCardGroupURN && description) {
        const { aggregatorDesc } = getCardGroupByURN(betcardgroups, betCardGroupURN) as BetCardGroup;

        if (aggregatorDesc)
          return {
            title: aggregatorDesc,
            subtitle: description,
            marketBetCardGroupURN,
          };
      }
    }

    return {
      title: "",
      subtitle: "",
    };
  };
}

function getQuoteData(
  cashoutUrn: string,
): (state: ApplicationState) => { marketId?: MarketId; quote?: ExchangeCashoutQuote } {
  return (state: ApplicationState) => {
    const {
      betting: { exchangecashouts },
      entities: { exchangemarkets },
    } = state;

    const quote = getExchangeCashoutQuoteByURN(exchangecashouts, cashoutUrn) as ExchangeCashoutQuote;

    // The reset confirmation step may invoke getQuoteData after the quote is already cashed out (debounce)
    if (!quote) {
      return {};
    }

    const excMarket = getExchangeMarketByURN(exchangemarkets, quote.marketURN);
    const excMarketBet = getExchangeMarketBetByURN(state, quote.marketBetURN);

    const { marketId } = excMarket || excMarketBet || { marketId: undefined };

    return {
      quote,
      marketId,
    };
  };
}

function getPollerSubscribedMarkets(): MarketId[] {
  return Array.from(SUBSCRIBED_MARKETS).reduce((acc: MarketId[], [marketId, market]) => {
    if (market.hasSizeMatched) {
      acc.push(marketId);
    }
    return acc;
  }, []);
}

function* setPollerInterval(loggedIn: boolean, pollerSubscribedMarketIds: MarketId[]): SagaIterator {
  if (currentPollingContext === PollingContext.MARKET_VIEW) {
    const { marketUrn } = SUBSCRIBED_MARKETS.get(pollerSubscribedMarketIds[0]) as CashoutEligibleMarket;
    const { inPlay, sportId } = yield select(getMarketInplayAndSportName(marketUrn));

    pollerInterval = getInterval(currentPollingContext, {
      loggedIn,
      inPlay,
      sportId,
    });
  } else {
    pollerInterval = getInterval(currentPollingContext);
  }
}

function* pollCosQuoteService(marketIds: MarketId[]): SagaIterator {
  const { currencyCode, loggedIn } = yield select(getUserDetails);

  yield call(setPollerInterval, loggedIn, marketIds);

  while (true) {
    try {
      const exchangeQuotes: ExchangeCashouts = yield call(cashoutService.quote, currencyCode, marketIds);

      yield put<FetchExchangeQuotesSuccessAction>({
        type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
        payload: exchangeQuotes,
      });
    } catch {
      yield put<FetchExchangeQuotesFailureAction>({
        type: NETWORK__FETCH_EXC_QUOTES_FAILURE,
      });
    }

    yield delay(pollerInterval);
  }
}

function* restartCashoutPoller(): SagaIterator {
  const pollerSubscribedMarketIds = getPollerSubscribedMarkets();

  if (pollerDetachedTask) {
    yield cancel(pollerDetachedTask);
  }

  if (pollerSubscribedMarketIds.length) {
    pollerDetachedTask = yield spawn(pollCosQuoteService, pollerSubscribedMarketIds);
  }
}

function* updatePollerEligibleMarkets(action: FetchExchangeOpenBetsSuccessAction): SagaIterator {
  const marketsPositionUpdate = action.payload.markets;
  let restartPoller = false;

  Array.from(SUBSCRIBED_MARKETS)
    .filter(([, { marketUrn, hasSizeMatched }]) => !hasSizeMatched && marketsPositionUpdate[marketUrn])
    .forEach(([marketId, subscribedMarket]) => {
      const { marketUrn } = subscribedMarket;
      const totalSizeMatched = marketsPositionUpdate[marketUrn].orders.reduce(
        (acc, { sizeMatched = 0 }) => acc + sizeMatched,
        0,
      );

      if (totalSizeMatched > 0) {
        SUBSCRIBED_MARKETS.set(marketId, {
          ...subscribedMarket,
          hasSizeMatched: true,
        });

        restartPoller = true;
      }
    });

  if (restartPoller) {
    yield call(restartCashoutPoller);
  }
}

function* updateMarketSubscription(action: UnsubscribeExchangeCashoutAction): SagaIterator {
  SUBSCRIBED_MARKETS.delete(action.payload.marketId);

  yield call(restartCashoutPoller);
}

function* updatePollerIneligibleMarkets(action: FetchExchangeMarketUpdatesSuccessAction): SagaIterator {
  let restartPoller = false;

  Array.from(SUBSCRIBED_MARKETS).forEach(([marketId, { marketUrn }]) => {
    const { status } = action.payload.markets.find(({ urn }) => urn === marketUrn) || {};

    if (status === ExchangeMarketStatus.Closed) {
      SUBSCRIBED_MARKETS.delete(marketId);
      restartPoller = true;
    }
  });

  if (restartPoller) {
    yield call(restartCashoutPoller);
  }
}

function updateMarketViewSubscriptions(action: SubscribeExchangeCashoutAction): void {
  const { marketId } = action.payload;

  currentPollingContext = PollingContext.MARKET_VIEW;

  if (!SUBSCRIBED_MARKETS.get(marketId)) {
    SUBSCRIBED_MARKETS.set(marketId, {
      marketId,
      marketUrn: codecs.exchangeMarket.encode(marketId).uid,
      marketBetUrn: codecs.marketBet.encode(marketId).uid,
      hasSizeMatched: false,
    });
  }
}

function* updateMarketBetsSubscriptions(marketBetURN: URN, isSubscriptionAction: boolean): SagaIterator {
  const { cashoutQuotesURNs, marketId }: ExchangeMarketBet = yield select((state: ApplicationState) =>
    getExchangeMarketBetByURN(state, marketBetURN),
  );

  if (!isSubscriptionAction) {
    SUBSCRIBED_MARKETS.delete(marketId);
    return;
  }

  if (!cashoutQuotesURNs?.length) {
    return;
  }

  // COS fetches quotes by market, handicaps will share the same market/market bet
  const quoteURN = cashoutQuotesURNs[0];

  const excQuote: ExchangeCashoutQuote = yield select((state: ApplicationState) =>
    getExchangeCashoutQuoteByURN(state.betting.exchangecashouts, quoteURN),
  );

  if (!excQuote) {
    return;
  }
  SUBSCRIBED_MARKETS.set(marketId, {
    marketId,
    marketUrn: excQuote.marketURN,
    marketBetUrn: excQuote.marketBetURN,
    hasSizeMatched: true,
  });
}

function* updateMyBetsSubscriptions(
  action: MyBetsSubscribeCardUpdatesAction | MyBetsUnsubscribeCardUpdatesAction,
): SagaIterator {
  const { urn } = action.payload;

  currentPollingContext = PollingContext.MY_BETS;

  const betCard: MarketBetCard = yield select((state: ApplicationState) =>
    getCardByURN(state.layouts.cards.marketbetcard, urn),
  );

  if (!betCard) {
    return;
  }

  const isSubscriptionAction = action.type === MY_BETS_SUBSCRIBE_CARD_UPDATES;

  // for each market present on the card starts a subscription process
  yield call(updateMarketBetsSubscriptions, betCard.marketBetURN, isSubscriptionAction);
}

function* clearSubscriptions(): SagaIterator {
  if (pollerDetachedTask) {
    yield cancel(pollerDetachedTask);
  }

  SUBSCRIBED_MARKETS.clear();
}

function* takeCashout(action: TakeCashoutAction): SagaIterator {
  const { cashoutUrn } = action.payload;
  const { quote, marketId } = yield select(getQuoteData(cashoutUrn));

  if (!quote || quote.step === CashoutStep.CASHING_OUT) {
    return;
  }

  const { value, profit } = quote;
  const { currencyCode } = yield select(getUserDetails);

  customerRef = customerRef || `${Date.now()}`;

  try {
    yield put<TakeCashoutInProgressAction>({
      type: NETWORK__CASHOUT_TAKE_IN_PROGRESS,
      payload: {
        cashoutUrn,
      },
    });

    const { status: takeStatus } = yield call(cashoutService.takeEXC, currencyCode, marketId, value, customerRef);

    if (takeStatus === "SUCCESS") {
      const { title, subtitle, marketBetCardGroupURN }: cashoutReceiptHeader = yield select(buildReceiptHeader(quote));

      yield put<TakeCashoutSuccessAction>({
        type: NETWORK__CASHOUT_TAKE_SUCCESS,
        payload: {
          product: Product.Exchange,
          marketId,
          receipt: buildQuoteReceipt(cashoutUrn, takeStatus, title, subtitle, value, profit),
          errorCode: takeStatus,
        },
      });

      if (marketBetCardGroupURN) {
        yield put<FetchCardsAction>({
          type: FETCH_CARDS,
          payload: {
            urns: marketBetCardGroupURN,
            forceRefresh: true,
          },
        });
      }
    } else {
      yield put<TakeCashoutFailureAction>({
        type: NETWORK__CASHOUT_TAKE_FAILURE,
        payload: {
          receipt: buildQuoteReceipt(cashoutUrn, takeStatus || genericErrorStatus),
          errorCode: genericErrorStatus,
        },
      });
    }
  } catch (err) {
    const errorCode = (err as any).detail?.CashoutReadOnlyServiceException?.errorCode || genericErrorStatus;

    yield put<TakeCashoutFailureAction>({
      type: NETWORK__CASHOUT_TAKE_FAILURE,
      payload: {
        receipt: buildQuoteReceipt(cashoutUrn, errorCode),
        errorCode,
      },
    });
  } finally {
    customerRef = undefined;
  }
}

function* closeAllReceipts(): SagaIterator {
  yield put<CashoutReceiptCloseAll>({
    type: CASHOUT__RECEIPT_CLOSE_ALL,
  });
}

export function* exchangeCashoutSaga(): SagaIterator {
  yield takeLatest(SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES, updateMarketViewSubscriptions);
  yield takeLatest(UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES, updateMarketSubscription);
  yield takeLatest([MY_BETS_SUBSCRIBE_CARD_UPDATES, MY_BETS_UNSUBSCRIBE_CARD_UPDATES], updateMyBetsSubscriptions);
  yield takeLatest(FETCH_EXC_OPEN_BETS_SUCCESS, updatePollerEligibleMarkets);
  yield takeLatest(FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS, updatePollerIneligibleMarkets);
  yield takeEvery(NETWORK__CASHOUT_TAKE, takeCashout);
  yield takeLatest(
    [
      UPDATE_PRODUCT_PREFERENCE,
      UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
      PUSH,
      UI__MY_BETS_EXC_EDIT_BET_PRESS,
      UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
    ],
    clearSubscriptions,
  );
  yield takeLatest(NETWORK__CASHOUT_TAKE_SUCCESS, restartCashoutPoller);
  yield takeLatest([PUSH, BOTTOM_BAR_PUSH, REFRESH], closeAllReceipts);
  yield debounce(
    RESET_POLLER_TIMEOUT,
    [MY_BETS_SUBSCRIBE_CARD_UPDATES, MY_BETS_UNSUBSCRIBE_CARD_UPDATES],
    restartCashoutPoller,
  );
}
