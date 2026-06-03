/* eslint-disable @typescript-eslint/no-require-imports */
import { call, ForkEffect, put, take, takeLatest } from "redux-saga/effects";
import { EventChannel, eventChannel, SagaIterator } from "redux-saga";
import { FeedData } from "../state/entities";
import {
  SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  SubscribeToUpdateGameFeedResultsAction,
  UPDATE_LAST_NUMBERS,
  UPDATE_ROULETTE_LAST_NUMBERS,
  UpdateLastNumbersAction,
  UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  UnsubscribeToUpdateGameFeedResultsAction,
} from "../actions/game-feeds";
import { PUSH } from "../actions/router";
import { RouletteNumberColor } from "../state/constants";

let eventSource: EventSource | undefined;
const LIVE_DEALER_GAMES = new Map();
const ROULETTE_LAST_NUMBERS_COUNT = 8;

type RouletteLastNumbersResultsType = {
  data: {
    messageId: string;
    messageType: string;
    authentication: string | null;
    messagePayload: {
      liveDealer_payload: {
        result: { lastNumbers: string[] };
        gameTableName: string[];
        eventType: string;
        gameTableId: number;
        freeSeatsCount: number;
        timestamp: number;
      };
    };
  };
};

type EventChannelSocketActionType = {
  type: string;
  payload: RouletteLastNumbersResultsType;
};

export function unsubscribeAll(): void {
  eventSource?.close();
  eventSource = undefined;
  LIVE_DEALER_GAMES.clear();
}

export function unsubscribeTableUpdates(action: UnsubscribeToUpdateGameFeedResultsAction): void {
  const { tableNames } = action.payload;
  tableNames?.forEach((name) => LIVE_DEALER_GAMES.delete(name));
  if (LIVE_DEALER_GAMES.size === 0) {
    eventSource?.close();
    eventSource = undefined;
  }
}

export function initEventSource(endpoint: string): EventChannel<EventChannelSocketActionType> {
  return eventChannel((emitter) => {
    // check if we have an existing EventSource instance  If it doesn't
    if (!eventSource) {
      let EventSourceRef: typeof window.EventSource = window?.EventSource;
      // check if EventSource exists (will exist only on web - window.EventSource).
      if (!EventSourceRef) {
        // we are on Native and we'll use the polyfill from the RN library to create the instance
        const { default: RnEventSource } = require("react-native-event-source");
        EventSourceRef = RnEventSource;
      }
      eventSource = new EventSourceRef(endpoint);
    }
    eventSource.onmessage = (event) => {
      emitter({ type: UPDATE_ROULETTE_LAST_NUMBERS, payload: { ...event, data: JSON.parse(event.data) } });
    };
    return () => {
      eventSource?.close();
      eventSource = undefined;
    };
  });
}

function getColorByNumber(number: string): RouletteNumberColor {
  const RED_NUMBERS = [
    "1",
    "3",
    "5",
    "7",
    "9",
    "12",
    "14",
    "16",
    "18",
    "19",
    "21",
    "23",
    "25",
    "27",
    "30",
    "32",
    "34",
    "36",
  ];
  if (number === "0" || number === "00") {
    return RouletteNumberColor.GREEN;
  }

  if (RED_NUMBERS.includes(number)) {
    return RouletteNumberColor.RED;
  }

  return RouletteNumberColor.BLACK;
}

function processRouletteLastNumbersAction(
  payload: RouletteLastNumbersResultsType,
  gameUrn: string,
): UpdateLastNumbersAction {
  const { lastNumbers } = payload.data.messagePayload.liveDealer_payload.result;
  const feedDataPayload: FeedData = {
    lastNumbers: lastNumbers
      ? lastNumbers.slice(0, ROULETTE_LAST_NUMBERS_COUNT).map((nr) => ({
          number: nr,
          color: getColorByNumber(nr.toString()),
        }))
      : undefined,
    tableNames: payload.data.messagePayload.liveDealer_payload.gameTableName,
  };

  return {
    type: UPDATE_LAST_NUMBERS,
    payload: { data: feedDataPayload, urn: gameUrn },
  };
}

export function* fetchPhysicalTableUpdates(action: SubscribeToUpdateGameFeedResultsAction): SagaIterator {
  if (action.payload.tableNames && action.payload.tableNames.length > 0) {
    LIVE_DEALER_GAMES.set(action.payload.tableNames[0], action.payload.urn);
  }
  const channel = yield call(initEventSource, `${action.payload.endpoint}?currency=${action.payload.currencyCode}`);
  while (eventSource) {
    const socketAction = yield take(channel);
    if (!socketAction.payload.data) return;
    let tableCode;
    const gameAliasTableName = socketAction.payload.data.messagePayload?.liveDealer_payload?.gameTableName;
    if (gameAliasTableName && gameAliasTableName.length > 0) {
      tableCode = Array.isArray(gameAliasTableName) ? gameAliasTableName[0] : "";
    }
    if (LIVE_DEALER_GAMES.has(tableCode) && socketAction.type === UPDATE_ROULETTE_LAST_NUMBERS) {
      yield put(processRouletteLastNumbersAction(socketAction.payload, LIVE_DEALER_GAMES.get(tableCode)));
    }
  }
}

export function* updatePhysicalTableResultSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS, fetchPhysicalTableUpdates);
  yield takeLatest(UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS, unsubscribeTableUpdates);
  yield takeLatest(PUSH, unsubscribeAll);
}
