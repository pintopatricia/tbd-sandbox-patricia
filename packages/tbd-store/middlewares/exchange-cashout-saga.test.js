import { codecs } from "@ppb/tbd-urn-codecs";
import { Product } from "../state/entities/user-preferences/UserPreferences.types";

import {
  SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  NETWORK__FETCH_EXC_QUOTES_SUCCESS,
  NETWORK__CASHOUT_TAKE,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  NETWORK__CASHOUT_TAKE_FAILURE,
  NETWORK__CASHOUT_TAKE_IN_PROGRESS,
  CASHOUT__RECEIPT_CLOSE_ALL,
} from "../actions/cashout";
import { FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS } from "../actions/exchange-markets";
import { FETCH_EXC_OPEN_BETS_SUCCESS } from "../actions/exchange-open-bets";
import { PUSH, BOTTOM_BAR_PUSH, REFRESH } from "../actions/router";
import { getInterval } from "../config";
import cashoutService from "../services/cashout-service";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import setupSagaMocks from "../saga-jest-setup";
import { getSportByURN } from "../state/entities/sports/sport-selectors";
import { createExchangeCashoutQuoteSelector } from "../state/betting/exchange-cashouts/exchange-cashout-selectors";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import { createMeetingByURNSelector } from "../state/entities/meetings/meeting-selectors";
import { buildQuoteReceipt } from "../helpers/receipt";
import { isRaceHierarchy } from "../helpers/markets";

import {
  MY_BETS_SUBSCRIBE_CARD_UPDATES,
  MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
} from "../actions/my-bets";

const MARKET_1 = "1.111111111";
const MARKET_2 = "1.111111112";
const MARKET_4 = "1.111111114";

const MARKET_1_URN = "1.111111111/urn";
const MARKET_2_URN = "1.111111112/urn";
const MARKET_4_URN = "1.111111114/urn";

const CASHOUT_URN_1 = "cashout/urn1";
const CASHOUT_URN_2 = "cashout/urn2";
const CASHOUT_URN_3 = "cashout/urn3";
const CASHOUT_URN_4 = "cashout/urn4";

const MY_BETS_CARD_URN_1 = "aggregatorCardURN1";
const MY_BETS_CARD_URN_2 = "aggregatorCardURN2";

const MARKET_BET_URN_1 = "ppb:marketBet:1.11111111";
const MARKET_BET_URN_2 = "ppb:marketBet:1.11111112";

const mockMeetings = {
  MARKET_4_URN: {
    urn: MARKET_4_URN,
    entityName: "MARKET_4_MEETING_MOCK_NAME",
  },
};

const STATE = {
  betting: {
    exchangecashouts: "EXCHANGE_CASHOUT_ENTITIES",
    exchangemarketbets: "EXCHANGE_MARKET_BETS_ENTITIES",
  },
  entities: {
    exchangemarkets: "EXCHANGE_MARKETS_ENTITIES",
    sports: "SPORTS_ENTITIES",
    meetings: mockMeetings,
  },
  layouts: {
    cards: {
      marketbetcard: "MARKET_BET_CARD",
    },
    cardgroups: {
      betcardgroups: "BET_CARD_GROUPS",
    },
  },
};

const market1SelectorMock = {
  marketId: MARKET_1,
  inplay: true,
  hierarchy: { sportevent: "sport/urn", competition: "competition/urn" },
  name: "market1Name",
};
const market4SelectorMock = {
  marketId: MARKET_4,
  inplay: true,
  name: "market4Name",
  hierarchy: {
    meeting: MARKET_4_URN,
    race: "mock-race-urn",
  },
};

const sportMock = {
  urn: "sport/urn",
  name: "sportName",
  sportId: 1,
};

const meeting1Mock = {
  urn: MARKET_4_URN,
  entityName: "MARKET_4_MEETING_MOCK_NAME",
};

const sportEventMock = {
  name: "sportEventName",
};

const market1BetMock = {
  marketId: MARKET_1,
  description: "marketBetMockDescription",
  betCardGroupURN: "betCardGroupURN",
  marketBetCardGroupURN: "marketBetCardGroupURN",
};

const betCardGroupMock = {
  aggregatorDesc: "aggregatorDesc",
};

const marketBetCard1 = {
  marketBetURN: MARKET_BET_URN_1,
};

const marketBetCard2 = {
  marketBetURN: MARKET_BET_URN_2,
};

const userDetailsMock = { currencyCode: "currencyCode", loggedIn: true };
const quote1Mock = { marketURN: MARKET_1_URN, value: 10 };
const quote4Mock = { marketURN: MARKET_4_URN, value: 20 };

const takeRejectedMock = {
  detail: {
    CashoutReadOnlyServiceException: {
      errorCode: "UNEXPECTED",
    },
  },
};

const getExchangeMarketByURN = (marketMock) => jest.fn(() => marketMock);
const getMeetingByUrn = (meetingMock) => jest.fn(() => meetingMock);

jest.useFakeTimers("modern");

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 2000),
}));

jest.mock("../services/cashout-service", () => ({
  quote: jest.fn(() => Promise.resolve({ quotes: "quotes" })),
  takeEXC: jest.fn(() => Promise.resolve({ status: "SUCCESS" })),
}));

jest.mock("../helpers/receipt", () => ({
  buildQuoteReceipt: jest.fn(() => "RECEIPT_VM"),
}));

jest.mock("../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => jest.fn()),
}));

const getExchangeMarketBetByURN = jest.fn();

jest.mock("../state/betting/exchange-market-bets/exchange-market-bets-selectors", () => ({
  createExchangeMarketBetSelector: () => getExchangeMarketBetByURN,
}));

const getCardGroupByURN = jest.fn(() => betCardGroupMock);

jest.mock("../state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: () => getCardGroupByURN,
}));

const getCardByURN = jest.fn(() => marketBetCard1);

jest.mock("../state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: () => getCardByURN,
}));

jest.mock("../state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => sportMock),
}));

jest.mock("../state/entities/meetings/meeting-selectors.ts", () => ({
  createMeetingByURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => userDetailsMock),
}));

jest.mock("../state/betting/exchange-cashouts/exchange-cashout-selectors", () => {
  const mock = jest.fn();
  return {
    createExchangeCashoutQuoteSelector: () => mock,
  };
});

const getExchangeCashoutQuoteByURNMock = createExchangeCashoutQuoteSelector();

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    exchangeMarket: {
      encode: jest.fn((marketId) => ({ uid: `${marketId}/urn` })),
    },
    marketBet: {
      encode: jest.fn((marketId) => ({ uid: `${marketId}/betUrn` })),
    },
  },
}));

jest.mock("../state/entities/sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn(() => sportEventMock),
}));

jest.mock("../helpers/markets", () => ({
  isRaceHierarchy: jest.fn().mockReturnValue(false),
}));

let putActions;
let advanceTimersByTime;
let stopSaga;
let getState;
let dispatch;

const dateMock = 1651762140000;

const startSaga = () => {
  let saga;

  jest.isolateModules(() => {
    ({ exchangeCashoutSaga: saga } = require("./exchange-cashout-saga"));
  });

  ({ putActions, advanceTimersByTime, stopSaga, getState, dispatch } = setupSagaMocks(saga));

  getState.mockReturnValue(STATE);

  jest.setSystemTime(dateMock);
};

const dispatchMarketSubscribe = (markets) => {
  markets.forEach(async (marketId) => {
    await putActions([
      {
        type: SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
        payload: { marketId },
      },
    ]);
  });
};

const dispatchMarketUnsubscribe = (markets) => {
  markets.forEach(async (marketId) => {
    await putActions([
      {
        type: UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
        payload: { marketId },
      },
    ]);
  });
};

const dispatchBetCardSubscribe = (cardsURNs) => {
  cardsURNs.forEach(async (urn) => {
    await putActions([
      {
        type: MY_BETS_SUBSCRIBE_CARD_UPDATES,
        payload: { urn },
      },
    ]);
  });
};

const dispatchBetCardUnsubscribe = (cardsURNs) => {
  cardsURNs.forEach(async (urn) => {
    await putActions([
      {
        type: MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
        payload: { urn },
      },
    ]);
  });
};

const dispatchSearchOrdersUpdate = async (searchOrders) => {
  const state = searchOrders.reduce(
    (acc, { marketURN, numberOfOrders, sizeMatched }) => ({
      ...acc,
      [marketURN]: {
        orders: new Array(numberOfOrders).fill(null).map(() => ({
          sizeMatched,
        })),
      },
    }),
    {},
  );

  await putActions([
    {
      type: FETCH_EXC_OPEN_BETS_SUCCESS,
      payload: {
        markets: state,
      },
    },
  ]);

  await advanceTimersByTime(0);
};

const dispatchMarketUpdate = async (marketUpdates) => {
  await putActions([
    {
      type: FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
      payload: {
        markets: marketUpdates,
      },
    },
  ]);

  await advanceTimersByTime(0);
};

const dispatchTakeCashout = async (cashoutUrn) => {
  await putActions([
    {
      type: NETWORK__CASHOUT_TAKE,
      payload: {
        cashoutUrn,
      },
    },
  ]);

  await advanceTimersByTime(0);
};

describe("exchangeCashoutSaga", () => {
  beforeEach(() => {
    createExchangeMarketSelector.mockReturnValue(getExchangeMarketByURN(market1SelectorMock));
    getExchangeMarketBetByURN.mockReturnValue(market1BetMock);
    getExchangeCashoutQuoteByURNMock.mockReturnValue(quote1Mock);
    startSaga();
  });

  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  // Add markets to a subscription list
  describe("when SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES is dispatched", () => {
    beforeEach(() => {
      dispatchMarketSubscribe([MARKET_1, MARKET_2, MARKET_1, MARKET_2]);
    });

    it("should add any distinct markets to the subscription", () => {
      expect(codecs.exchangeMarket.encode).toHaveBeenCalledTimes(2);
      expect(codecs.exchangeMarket.encode).toHaveBeenNthCalledWith(1, MARKET_1);
      expect(codecs.exchangeMarket.encode).toHaveBeenNthCalledWith(2, MARKET_2);

      expect(codecs.marketBet.encode).toHaveBeenCalledTimes(2);
      expect(codecs.marketBet.encode).toHaveBeenNthCalledWith(1, MARKET_1);
      expect(codecs.marketBet.encode).toHaveBeenNthCalledWith(2, MARKET_2);
    });
  });

  // Remove markets subscription
  describe("when UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES is dispatched", () => {
    beforeEach(async () => {
      getExchangeMarketBetByURN
        .mockReturnValueOnce({
          cashoutQuotesURNs: [CASHOUT_URN_1, CASHOUT_URN_3],
          marketId: MARKET_1,
        })
        .mockReturnValueOnce({
          cashoutQuotesURNs: [CASHOUT_URN_2],
          marketId: MARKET_2,
        });

      dispatchBetCardSubscribe([MY_BETS_CARD_URN_1, MY_BETS_CARD_URN_2]);

      dispatchMarketUnsubscribe([MARKET_1]);
    });

    it("should remove any distinct markets from the subscription list", () => {
      expect(cashoutService.quote).toHaveBeenCalledTimes(1);
      expect(cashoutService.quote).toHaveBeenCalledWith("currencyCode", [MARKET_2]);
    });
  });

  // Adds eligible markets from the subscription to the poller
  describe("when FETCH_EXC_OPEN_BETS_SUCCESS is dispatched", () => {
    describe("and there is no market subscribed", () => {
      beforeEach(() => {
        dispatchMarketSubscribe([]);
        dispatchSearchOrdersUpdate([{ marketURN: MARKET_1_URN, numberOfOrders: 1 }]);
      });

      it("should not trigger any poller", () => {
        expect(cashoutService.quote).not.toHaveBeenCalled();
      });
    });

    describe("and there is one markets subscribed", () => {
      beforeEach(() => {
        dispatchMarketSubscribe([MARKET_1]);
      });

      describe("and order sizeMatched is 0", () => {
        beforeEach(() => {
          dispatchSearchOrdersUpdate([{ marketURN: MARKET_1_URN, numberOfOrders: 1, sizeMatched: 0 }]);
        });

        it("should not trigger any poller restart", () => {
          expect(cashoutService.quote).not.toHaveBeenCalled();
        });
      });

      describe("and order sizeMatched is bigger than 0", () => {
        beforeEach(() => {
          dispatchSearchOrdersUpdate([{ marketURN: MARKET_1_URN, numberOfOrders: 1, sizeMatched: 1 }]);
        });

        it("should get the exchange market state", () => {
          expect(createExchangeMarketSelector()).toHaveBeenCalledWith("EXCHANGE_MARKETS_ENTITIES", MARKET_1_URN);
        });

        it("should get the exchange market sport name", () => {
          expect(getSportByURN).toHaveBeenCalledWith("SPORTS_ENTITIES", market1SelectorMock.sport);
        });

        it("should fetch the user details", () => {
          expect(getUserDetails).toHaveBeenCalled();
        });

        it("should fetch the COS poller interval with the right props", () => {
          expect(getInterval).toHaveBeenCalledWith("COS", {
            inPlay: market1SelectorMock.inplay,
            loggedIn: userDetailsMock.loggedIn,
            sportId: sportMock.sportId,
          });
        });

        it("should trigger the poller by calling cashoutService", () => {
          expect(cashoutService.quote).toHaveBeenCalledTimes(1);
          expect(cashoutService.quote).toHaveBeenCalledWith("currencyCode", [MARKET_1]);
        });
      });
    });
  });

  // Removes eligible markets from the poller
  describe("when FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS is dispatched", () => {
    beforeEach(() => {
      // Set Up Scenario with 2 markets on the poller
      dispatchMarketSubscribe([MARKET_1, MARKET_2]);
      dispatchSearchOrdersUpdate([
        { marketURN: MARKET_1_URN, numberOfOrders: 1, sizeMatched: 1 },
        { marketURN: MARKET_2_URN, numberOfOrders: 1, sizeMatched: 1 },
      ]);
      jest.clearAllMocks();
    });

    describe("and the first market updates with CLOSED status", () => {
      beforeEach(() => {
        dispatchMarketUpdate([{ urn: MARKET_1_URN, status: "CLOSED" }]);
      });

      it("should trigger the poller restart immediately with MARKET_2 only", async () => {
        await advanceTimersByTime(1);

        expect(cashoutService.quote).toHaveBeenCalledTimes(1);
        expect(cashoutService.quote).toHaveBeenCalledWith("currencyCode", [MARKET_2]);
      });
    });

    describe("and there is a market update for a previous closed market", () => {
      beforeEach(() => {
        dispatchMarketUpdate([{ urn: MARKET_1_URN, status: "CLOSED" }]);
        jest.clearAllMocks();
        dispatchMarketUpdate([{ urn: MARKET_1_URN, status: "CLOSED" }]);
      });

      it("should trigger not the poller immediately", async () => {
        // immediately after
        await advanceTimersByTime(1);

        expect(cashoutService.quote).not.toHaveBeenCalled();
      });
    });

    describe("and the last market updates with CLOSED status", () => {
      beforeEach(() => {
        dispatchMarketUpdate([{ urn: MARKET_1_URN, status: "CLOSED" }]);
        jest.clearAllMocks();
        dispatchMarketUpdate([{ urn: MARKET_2_URN, status: "CLOSED" }]);
      });

      it("should not trigger the poller since there are no subscribed markets", async () => {
        // immediately after
        await advanceTimersByTime(1);

        expect(cashoutService.quote).not.toHaveBeenCalled();
      });
    });
  });

  // Poller Behaviors
  describe("Exchange quotes cashout poller", () => {
    beforeEach(() => {
      // Set Up Scenario with 2 markets on the poller
      dispatchMarketSubscribe([MARKET_1, MARKET_2]);
      dispatchSearchOrdersUpdate([
        { marketURN: MARKET_1_URN, numberOfOrders: 1, sizeMatched: 1 },
        { marketURN: MARKET_2_URN, numberOfOrders: 1, sizeMatched: 1 },
      ]);
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it("should trigger again after the delay time passed", async () => {
      expect(cashoutService.quote).toHaveBeenCalledTimes(0);

      await advanceTimersByTime(2000);
      expect(cashoutService.quote).toHaveBeenCalledTimes(1);
    });

    it("should not trigger again after a UI__MY_BETS_ORDER_TYPE_FILTER_CLICK", async () => {
      await advanceTimersByTime(2000);
      expect(cashoutService.quote).toHaveBeenCalledTimes(1);

      await putActions([{ type: UI__MY_BETS_ORDER_TYPE_FILTER_CLICK }]);

      await advanceTimersByTime(2000);
      expect(cashoutService.quote).toHaveBeenCalledTimes(1);
    });

    it("should not trigger again after a UI__MY_BETS_ORDER_STATUS_FILTER_CLICK", async () => {
      await advanceTimersByTime(2000);
      expect(cashoutService.quote).toHaveBeenCalledTimes(1);

      await putActions([{ type: UI__MY_BETS_ORDER_STATUS_FILTER_CLICK }]);

      await advanceTimersByTime(2000);
      expect(cashoutService.quote).toHaveBeenCalledTimes(1);
    });

    describe("when cashoutService succeeds", () => {
      it("should dispatch NETWORK__FETCH_EXC_QUOTES_SUCCESS", async () => {
        await advanceTimersByTime(0);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
          payload: {
            quotes: "quotes",
          },
        });
      });
    });
  });

  // Take Cashout
  describe("when NETWORK__CASHOUT_TAKE is dispatched", () => {
    beforeEach(() => {
      // Set Up Scenario with 2 markets on the poller

      dispatchMarketSubscribe([MARKET_1, MARKET_2]);
      dispatchSearchOrdersUpdate([
        { marketURN: MARKET_1_URN, numberOfOrders: 1, sizeMatched: 1 },
        { marketURN: MARKET_2_URN, numberOfOrders: 1, sizeMatched: 1 },
      ]);
      jest.clearAllMocks();
    });

    it("should dispatch NETWORK__CASHOUT_TAKE_IN_PROGRESS", async () => {
      await dispatchTakeCashout(CASHOUT_URN_1);

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__CASHOUT_TAKE_IN_PROGRESS,
        payload: { cashoutUrn: CASHOUT_URN_1 },
      });
    });

    describe("and the given URN does not match any quote", () => {
      beforeEach(async () => {
        getExchangeCashoutQuoteByURNMock.mockImplementationOnce(() => undefined);
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should not call take cashout service", async () => {
        expect(cashoutService.takeEXC).not.toHaveBeenCalled();
      });
    });

    describe("and quote step isn't CASHING_OUT", () => {
      beforeEach(async () => {
        getExchangeCashoutQuoteByURNMock.mockImplementationOnce(() => ({
          ...quote1Mock,
          step: "DISPLAY",
        }));
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should not call exchange take cashout service", () => {
        expect(cashoutService.takeEXC).toHaveBeenCalledWith(
          userDetailsMock.currencyCode,
          MARKET_1,
          quote1Mock.value,
          `${dateMock}`,
        );
      });
    });

    describe("and quote step is CASHING_OUT", () => {
      beforeEach(async () => {
        getExchangeCashoutQuoteByURNMock.mockImplementationOnce(() => ({
          ...quote1Mock,
          step: "CASHING_OUT",
        }));
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should not call take cashout service", () => {
        expect(cashoutService.takeEXC).not.toHaveBeenCalled();
      });
    });

    describe("and cashoutService take Succeeds with SUCCESS or PARTIAL_SUCCESS status", () => {
      beforeEach(async () => {
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should get the exchange cashout quote from state", () => {
        expect(getExchangeCashoutQuoteByURNMock).toHaveBeenCalledWith(STATE.betting.exchangecashouts, CASHOUT_URN_1);
      });

      it("should get the exchange market from state", () => {
        expect(createExchangeMarketSelector()).toHaveBeenCalledWith(STATE.entities.exchangemarkets, MARKET_1_URN);
      });

      it("should fetch the user details", () => {
        expect(getUserDetails).toHaveBeenCalled();
      });

      it("should call take cashout service", () => {
        expect(cashoutService.takeEXC).toHaveBeenCalledWith(
          userDetailsMock.currencyCode,
          MARKET_1,
          quote1Mock.value,
          `${dateMock}`,
        );
      });

      it("should dispatch NETWORK__CASHOUT_TAKE_SUCCESS", () => {
        expect(buildQuoteReceipt).toHaveBeenCalledWith(
          CASHOUT_URN_1,
          "SUCCESS",
          sportEventMock.name,
          market1SelectorMock.name,
          quote1Mock.value,
          quote1Mock.profit,
        );

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CASHOUT_TAKE_SUCCESS,
          payload: { receipt: "RECEIPT_VM", errorCode: "SUCCESS", marketId: "1.111111111", product: Product.Exchange },
        });
      });

      it("should restart the cashout quote poller", () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
          payload: {
            quotes: "quotes",
          },
        });
      });
    });

    describe("and cashoutService take Succeeds with any other status", () => {
      beforeEach(async () => {
        cashoutService.takeEXC.mockImplementationOnce(() => Promise.resolve({ status: "UNAVAILABLE" }));
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should dispatch NETWORK__CASHOUT_TAKE_FAILURE", () => {
        expect(buildQuoteReceipt).toHaveBeenCalledWith(CASHOUT_URN_1, "UNAVAILABLE");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CASHOUT_TAKE_FAILURE,
          payload: { receipt: "RECEIPT_VM", errorCode: "GENERIC" },
        });
      });

      it("should restart the cashout quote poller", () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
          payload: {
            quotes: "quotes",
          },
        });
      });
    });

    describe("and cashoutService take request Succeeds with invalid payload", () => {
      beforeEach(async () => {
        cashoutService.takeEXC.mockImplementationOnce(() => Promise.resolve("<html></html>"));
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should dispatch NETWORK__CASHOUT_TAKE_FAILURE", () => {
        expect(buildQuoteReceipt).toHaveBeenCalledWith(CASHOUT_URN_1, "GENERIC");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CASHOUT_TAKE_FAILURE,
          payload: { receipt: "RECEIPT_VM", errorCode: "GENERIC" },
        });
      });
    });

    describe("and cashoutService take Succeeds on Market View PollingContext", () => {
      describe("and is a Sport Event", () => {
        beforeEach(async () => {
          // To set Market View PollingContext
          dispatchMarketSubscribe([MARKET_1]);

          cashoutService.takeEXC.mockImplementationOnce(() => Promise.resolve({ status: "UNAVAILABLE" }));
          await dispatchTakeCashout(CASHOUT_URN_1);
        });

        it("should dispatch NETWORK__CASHOUT_TAKE_FAILURE", () => {
          expect(buildQuoteReceipt).toHaveBeenCalledWith(CASHOUT_URN_1, "UNAVAILABLE");

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__CASHOUT_TAKE_FAILURE,
            payload: { receipt: "RECEIPT_VM", errorCode: "GENERIC" },
          });
        });
      });

      describe("and is a Race Meeting", () => {
        beforeEach(async () => {
          stopSaga(); // stop default saga with MARKET_1
          createExchangeMarketSelector.mockReturnValueOnce(getExchangeMarketByURN(market4SelectorMock));
          createMeetingByURNSelector.mockReturnValueOnce(getMeetingByUrn(meeting1Mock));
          getExchangeCashoutQuoteByURNMock.mockReturnValue(quote4Mock);
          startSaga();
          dispatchMarketSubscribe([MARKET_4]);
          cashoutService.takeEXC.mockImplementationOnce(() => Promise.resolve({ status: "UNAVAILABLE" }));
          isRaceHierarchy.mockReturnValue(true);
          await dispatchTakeCashout(CASHOUT_URN_4);
        });

        it("should dispatch NETWORK__CASHOUT_TAKE_FAILURE", () => {
          expect(buildQuoteReceipt).toHaveBeenCalledWith(CASHOUT_URN_4, "UNAVAILABLE");

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__CASHOUT_TAKE_FAILURE,
            payload: { receipt: "RECEIPT_VM", errorCode: "GENERIC" },
          });
        });
      });
    });

    describe("and cashoutService take Succeeds on MyBets View PollingContext", () => {
      beforeEach(async () => {
        // To set My Bets PollingContext
        dispatchBetCardSubscribe(["cardURN"]);

        cashoutService.takeEXC.mockImplementationOnce(() => Promise.resolve({ status: "UNAVAILABLE" }));
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should dispatch NETWORK__CASHOUT_TAKE_FAILURE", () => {
        expect(buildQuoteReceipt).toHaveBeenCalledWith(CASHOUT_URN_1, "UNAVAILABLE");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CASHOUT_TAKE_FAILURE,
          payload: { receipt: "RECEIPT_VM", errorCode: "GENERIC" },
        });
      });
    });

    describe("and cashoutService take Fails with a exception status", () => {
      beforeEach(async () => {
        cashoutService.takeEXC.mockRejectedValue(takeRejectedMock);
        jest.clearAllMocks();
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should dispatch NETWORK__CASHOUT_TAKE_FAILURE with exception status", async () => {
        expect(buildQuoteReceipt).toHaveBeenCalledWith(CASHOUT_URN_1, "UNEXPECTED");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CASHOUT_TAKE_FAILURE,
          payload: { receipt: "RECEIPT_VM", errorCode: "UNEXPECTED" },
        });
      });
    });

    describe("and cashoutService take Fails without an exception status", () => {
      beforeEach(async () => {
        cashoutService.takeEXC.mockRejectedValue({});
        jest.clearAllMocks();
        await dispatchTakeCashout(CASHOUT_URN_1);
      });

      it("should dispatch NETWORK__CASHOUT_TAKE_FAILURE with GENERIC status", async () => {
        expect(buildQuoteReceipt).toHaveBeenCalledWith(CASHOUT_URN_1, "GENERIC");

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__CASHOUT_TAKE_FAILURE,
          payload: { receipt: "RECEIPT_VM", errorCode: "GENERIC" },
        });
      });

      it("should not restart the cashout quote poller", () => {
        expect(dispatch).not.toHaveBeenCalledWith({
          type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
          payload: {
            quotes: "quotes",
          },
        });
      });
    });

    describe("and two takes are triggered at once", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        cashoutService.takeEXC.mockImplementation(() => Promise.resolve({ status: "SUCCESS" }));
        await putActions([
          {
            type: NETWORK__CASHOUT_TAKE,
            payload: {
              cashoutUrn: CASHOUT_URN_1,
            },
          },
          {
            type: NETWORK__CASHOUT_TAKE,
            payload: {
              cashoutUrn: CASHOUT_URN_2,
            },
          },
        ]);
      });

      it("should call the take cashout service twice", () => {
        expect(cashoutService.takeEXC).toHaveBeenCalledTimes(2);
      });

      it("should build two receipts", () => {
        expect(buildQuoteReceipt).toHaveBeenCalledTimes(2);
      });
    });
  });

  // My bets card markets to subscriptions list
  describe("when MY_BETS_SUBSCRIBE_CARD_UPDATES is dispatched", () => {
    describe("and card URN is invalid", () => {
      beforeEach(async () => {
        getCardByURN.mockReturnValueOnce({});
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_1]);
        await advanceTimersByTime(400);
      });

      it("should try to get the card from store", () => {
        expect(getCardByURN).toHaveBeenCalledWith(STATE.layouts.cards.marketbetcard, MY_BETS_CARD_URN_1);
      });

      it("should not trigger any poller", () => {
        expect(cashoutService.quote).not.toHaveBeenCalled();
      });
    });

    describe("and market bets URN are invalid", () => {
      beforeEach(async () => {
        getCardByURN.mockReturnValue({});
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_1]);
        await advanceTimersByTime(400);
      });

      it("should try to get all card market bet from store", () => {
        expect(getCardByURN).toHaveBeenCalledTimes(1);
        expect(getCardByURN).toHaveBeenCalledWith(STATE.layouts.cards.marketbetcard, MY_BETS_CARD_URN_1);
      });

      it("should not trigger any poller", () => {
        expect(cashoutService.quote).not.toHaveBeenCalled();
      });
    });

    describe("and market bets don't have quotes attached", () => {
      beforeEach(async () => {
        getCardByURN.mockReturnValueOnce(marketBetCard1).mockReturnValueOnce(marketBetCard2);

        getExchangeMarketBetByURN
          .mockReturnValueOnce({
            cashoutQuotesURNs: [],
          })
          .mockReturnValueOnce({
            cashoutQuotesURNs: [],
          });
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_1]);
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_2]);
        await advanceTimersByTime(400);
      });

      it("should try to get all card market bet from store", () => {
        expect(getCardByURN).toHaveBeenCalledTimes(2);
        expect(getCardByURN).toHaveBeenCalledWith(STATE.layouts.cards.marketbetcard, MY_BETS_CARD_URN_1);
        expect(getCardByURN).toHaveBeenCalledWith(STATE.layouts.cards.marketbetcard, MY_BETS_CARD_URN_2);

        expect(getExchangeMarketBetByURN).toHaveBeenCalledTimes(2);
        expect(getExchangeMarketBetByURN).toHaveBeenCalledWith(STATE, MARKET_BET_URN_1);
        expect(getExchangeMarketBetByURN).toHaveBeenCalledWith(STATE, MARKET_BET_URN_2);
      });

      it("should not trigger any poller", () => {
        expect(cashoutService.quote).not.toHaveBeenCalled();
      });
    });

    describe("and cashout quotes URN are invalid", () => {
      beforeEach(async () => {
        getCardByURN.mockReturnValueOnce(marketBetCard1).mockReturnValueOnce(marketBetCard2);

        getExchangeMarketBetByURN
          .mockImplementationOnce(() => ({
            cashoutQuotesURNs: [CASHOUT_URN_1, CASHOUT_URN_3],
          }))
          .mockImplementationOnce(() => ({
            cashoutQuotesURNs: [CASHOUT_URN_2],
          }));
        getExchangeCashoutQuoteByURNMock
          .mockImplementationOnce(() => undefined)
          .mockImplementationOnce(() => undefined);
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_1]);
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_2]);
        await advanceTimersByTime(400);
      });

      it("should try to get all cashout quotes from store", () => {
        expect(getExchangeCashoutQuoteByURNMock).toHaveBeenCalledTimes(2);
        expect(getExchangeCashoutQuoteByURNMock).toHaveBeenCalledWith(STATE.betting.exchangecashouts, CASHOUT_URN_1);
        expect(getExchangeCashoutQuoteByURNMock).toHaveBeenCalledWith(STATE.betting.exchangecashouts, CASHOUT_URN_2);
      });

      it("should not trigger any poller", () => {
        expect(cashoutService.quote).not.toHaveBeenCalled();
      });
    });

    describe("and cashout quotes URN are valid", () => {
      beforeEach(async () => {
        getCardByURN.mockReturnValueOnce(marketBetCard1).mockReturnValueOnce(marketBetCard2);

        getExchangeMarketBetByURN
          .mockImplementationOnce(() => ({
            cashoutQuotesURNs: [CASHOUT_URN_1, CASHOUT_URN_3],
            marketId: MARKET_1,
          }))
          .mockImplementationOnce(() => ({
            cashoutQuotesURNs: [CASHOUT_URN_2],
            marketId: MARKET_2,
          }));
        getExchangeCashoutQuoteByURNMock.mockImplementationOnce(() => ({})).mockImplementationOnce(() => ({}));
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_1]);
        dispatchBetCardSubscribe([MY_BETS_CARD_URN_2]);
        await advanceTimersByTime(400);
      });

      it("should trigger the poller for the correspondent markets", () => {
        expect(cashoutService.quote).toHaveBeenCalledWith("currencyCode", [MARKET_1, MARKET_2]);
      });
    });
  });

  // My bets card markets unsubscription
  describe("when MY_BETS_UNSUBSCRIBE_CARD_UPDATES is dispatched", () => {
    beforeEach(async () => {
      // Initial scenario with 2 cards subscribed
      getCardByURN
        .mockReturnValueOnce({
          marketBetURN: [MARKET_BET_URN_1],
        })
        .mockReturnValueOnce({
          marketBetURN: [MARKET_BET_URN_2],
        })
        .mockReturnValueOnce({
          marketBetURN: [MARKET_BET_URN_1],
        })
        .mockReturnValueOnce({
          marketBetURN: [MARKET_BET_URN_2],
        });

      getExchangeMarketBetByURN
        .mockReturnValueOnce({
          cashoutQuotesURNs: [CASHOUT_URN_1, CASHOUT_URN_3],
          marketId: MARKET_1,
        })
        .mockReturnValueOnce({
          cashoutQuotesURNs: [CASHOUT_URN_2],
          marketId: MARKET_2,
        })
        .mockReturnValueOnce({
          cashoutQuotesURNs: [CASHOUT_URN_1, CASHOUT_URN_3],
          marketId: MARKET_1,
        })
        .mockReturnValueOnce({
          cashoutQuotesURNs: [CASHOUT_URN_2],
          marketId: MARKET_2,
        });

      getExchangeCashoutQuoteByURNMock.mockImplementation(() => ({}));

      // To assure sequence of the mock implementations due to the forks solution
      dispatchBetCardSubscribe([MY_BETS_CARD_URN_1]);
      dispatchBetCardSubscribe([MY_BETS_CARD_URN_2]);
      await advanceTimersByTime(400);
    });

    it("should trigger the poller for the remaining markets", async () => {
      expect(cashoutService.quote).toHaveBeenCalledWith("currencyCode", [MARKET_1, MARKET_2]);

      jest.clearAllMocks();
      dispatchBetCardUnsubscribe([MY_BETS_CARD_URN_1]);
      await advanceTimersByTime(400);

      expect(cashoutService.quote).toHaveBeenCalledWith("currencyCode", [MARKET_2]);
    });

    it("should stop the poller when there are no remaining markets", async () => {
      expect(cashoutService.quote).toHaveBeenCalledWith("currencyCode", [MARKET_2, MARKET_1]);

      jest.clearAllMocks();

      // To assure sequence of the mock implementations due to the forks solution
      dispatchBetCardUnsubscribe([MY_BETS_CARD_URN_1]);
      dispatchBetCardUnsubscribe([MY_BETS_CARD_URN_2]);
      await advanceTimersByTime(400);

      expect(cashoutService.quote).not.toHaveBeenCalled();
    });
  });

  describe("when PUSH is dispatched", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await putActions([{ type: PUSH }]);
      await advanceTimersByTime(0);
    });

    it("should dispatch CASHOUT__RECEIPT_CLOSE_ALL to dismiss all cashout receipts", () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: CASHOUT__RECEIPT_CLOSE_ALL,
      });
    });
  });

  describe("when BOTTOM_BAR_PUSH is dispatched", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await putActions([{ type: BOTTOM_BAR_PUSH }]);
      await advanceTimersByTime(0);
    });

    it("should dispatch CASHOUT__RECEIPT_CLOSE_ALL to dismiss all cashout receipts", () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: CASHOUT__RECEIPT_CLOSE_ALL,
      });
    });
  });

  describe("when REFRESH is dispatched", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await putActions([{ type: REFRESH }]);
      await advanceTimersByTime(0);
    });

    it("should dispatch CASHOUT__RECEIPT_CLOSE_ALL to dismiss all cashout receipts", () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: CASHOUT__RECEIPT_CLOSE_ALL,
      });
    });
  });
});
