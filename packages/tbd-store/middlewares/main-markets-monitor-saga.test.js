import { ProductExclusion } from "../state/entities";
import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";
import { MARKET_TRANSITIONED_STATUS, SUBSCRIBE_MAIN_MARKET_TRANSITIONS } from "../actions/market-transitions";
import { SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES } from "../actions/sportsbook-markets";
import { FETCH_MAIN_MARKETS_UPDATES_FAILURE, FETCH_MAIN_MARKETS_UPDATES_SUCCESS } from "../actions/catalogue";
import { PUSH } from "../actions/router";
import { SUBSCRIBE_EXCHANGE_MARKET_UPDATES } from "../actions/exchange-markets";

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ mainMarketsMonitorSaga: saga } = require("./main-markets-monitor-saga"));
  });
  return setupSagaMocks(saga);
}
const getMarketStatus = jest.fn();

jest.mock("../services/catalogue/catalogue-service", () => ({
  getMainMarketsUpdates: jest.fn(),
}));

jest.mock("./market-transitions-monitor-saga", () => ({
  getMarketStatus,
}));

const productExclusionsMock = [ProductExclusion.Games];
const userPreferencesMock = {
  prefA: 1,
  prefB: 2,
};
const experimentsMock = [{ id: "experiment-id", variant: "something-something-variant" }];
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };
const routerMock = { currentView: "" };

jest.mock("../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: productExclusionsMock,
      userPreferences: userPreferencesMock,
      experiments: experimentsMock,
      throttleOverrides: throttleOverridesMock,
      router: routerMock,
    })),
  ),
}));

describe("mainMarketsMonitorSaga", () => {
  beforeEach(jest.clearAllMocks);

  const subscribeMainMarketTransitionAction = (marketURNs, withFixtureUpdates) => ({
    type: SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
    payload: {
      cardURN: "cardURN",
      marketURNs,
      withFixtureUpdates,
    },
  });

  const stateWithExcAndSbkMarketsOpen = {
    entities: {
      sportsbookmarkets: {
        "ppb:sbkMarket:924.11111": {
          urn: "ppb:sbkMarket:924.11111",
          marketId: "sbkMarketId",
          status: "OPEN",
          inplay: true,
        },
      },
      exchangemarkets: {
        "ppb:excMarket:1.111111": {
          urn: "ppb:excMarket:1.111111",
          marketId: "excMarketId",
          status: "OPEN",
          inplay: true,
        },
      },
      preferences: { prefA: 1, prefB: 2 },
      userdetails: {
        productExclusions: [ProductExclusion.Games],
      },
    },
  };

  const excClosedState = {
    entities: {
      ...stateWithExcAndSbkMarketsOpen.entities,
      exchangemarkets: {
        "ppb:excMarket:1.111111": {
          urn: "ppb:excMarket:1.111111",
          marketId: "excMarketId",
          status: "CLOSED",
          inplay: true,
        },
      },
    },
  };

  const stateWithExcAndSbkMarketsClosed = {
    entities: {
      ...excClosedState.entities,
      sportsbookmarkets: {
        "ppb:sbkMarket:924.11111": {
          urn: "ppb:sbkMarket:924.11111",
          marketId: "sbkMarketId",
          status: "CLOSED",
          inplay: true,
        },
      },
    },
  };

  describe("card with exc and sbk markets", () => {
    describe("when a SUBSCRIBE_MAIN_MARKET_TRANSITIONS action is dispatched", () => {
      it("should call getMarketStatus for each market", async () => {
        const { putActions, stopSaga, getState } = setup();

        getState.mockReturnValue(stateWithExcAndSbkMarketsOpen);

        await putActions([subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"])]);

        expect(getMarketStatus).toHaveBeenCalledTimes(2);
        expect(getMarketStatus).toHaveBeenCalledWith({
          urn: "ppb:sbkMarket:924.11111",
          marketId: "sbkMarketId",
          status: "OPEN",
          inplay: true,
        });
        expect(getMarketStatus).toHaveBeenCalledWith({
          urn: "ppb:excMarket:1.111111",
          marketId: "excMarketId",
          status: "OPEN",
          inplay: true,
        });
        stopSaga();
      });
    });

    describe("when exc market transit from INPLAY -> CLOSED and sbk market is INPLAY", () => {
      const excToClosedAction = {
        type: MARKET_TRANSITIONED_STATUS,
        transition: { before: "INPLAY", after: "CLOSED" },
        payload: "ppb:excMarket:1.111111",
      };

      it(`should call getMarketStatus for exc market with CLOSED status and
           dispatch SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES`, async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getMarketStatus.mockReturnValueOnce("INPLAY").mockReturnValueOnce("CLOSED");
        getState
          .mockReturnValueOnce(stateWithExcAndSbkMarketsOpen)
          .mockReturnValueOnce(stateWithExcAndSbkMarketsOpen)
          .mockReturnValue(excClosedState);

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"]),
          excToClosedAction,
        ]);

        expect(getMarketStatus).toHaveBeenCalledTimes(3);
        expect(getMarketStatus).toHaveBeenNthCalledWith(3, {
          urn: "ppb:excMarket:1.111111",
          marketId: "excMarketId",
          status: "CLOSED",
          inplay: true,
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: {
            marketId: "sbkMarketId",
            subscriberId: "main-markets-monitor-saga",
          },
        });

        stopSaga();
      });
    });

    describe("when sbk market transit from INPLAY -> CLOSED after exc market is already CLOSED", () => {
      const sbkToClosedAction = {
        type: MARKET_TRANSITIONED_STATUS,
        transition: { before: "INPLAY", after: "CLOSED" },
        payload: "ppb:sbkMarket:924.11111",
      };

      it(`should call getMarketStatus sbk market with CLOSED status,
           request mainMarketsUpdates from BFF and dispatch FETCH_MAIN_MARKETS_UPDATES_SUCCESS`, async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getMarketStatus.mockReturnValue("CLOSED");
        getState
          .mockReturnValueOnce(excClosedState)
          .mockReturnValueOnce(excClosedState)
          .mockReturnValue(stateWithExcAndSbkMarketsClosed);

        catalogueService.getMainMarketsUpdates.mockReturnValue("mainMarketsUpdatesResult");

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"]),
          sbkToClosedAction,
        ]);

        expect(getMarketStatus).toHaveBeenCalledTimes(3);
        expect(getMarketStatus).toHaveBeenNthCalledWith(3, {
          urn: "ppb:sbkMarket:924.11111",
          marketId: "sbkMarketId",
          status: "CLOSED",
          inplay: true,
        });

        expect(catalogueService.getMainMarketsUpdates).toHaveBeenCalledWith(
          ["cardURN"],
          false,
          {
            prefA: 1,
            prefB: 2,
          },
          ["GAMES"],
          experimentsMock,
          throttleOverridesMock,
          routerMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
          payload: "mainMarketsUpdatesResult",
        });

        stopSaga();
      });

      it("should dispatch FETCH_MAIN_MARKETS_UPDATES_FAILURE when BFF request fails", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getMarketStatus.mockReturnValue("CLOSED");
        getState
          .mockReturnValueOnce(excClosedState)
          .mockReturnValueOnce(excClosedState)
          .mockReturnValue(stateWithExcAndSbkMarketsClosed);

        catalogueService.getMainMarketsUpdates.mockImplementation(() => {
          throw new Error("errorMessage");
        });

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"]),
          sbkToClosedAction,
        ]);

        expect(catalogueService.getMainMarketsUpdates).toHaveBeenCalledWith(
          ["cardURN"],
          false,
          {
            prefA: 1,
            prefB: 2,
          },
          ["GAMES"],
          experimentsMock,
          throttleOverridesMock,
          routerMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_MAIN_MARKETS_UPDATES_FAILURE,
          error: "errorMessage",
        });

        stopSaga();
      });
    });

    describe("when sbk market transit from INPLAY -> CLOSED and exc market is INPLAY", () => {
      const sbkToClosedAction = {
        type: MARKET_TRANSITIONED_STATUS,
        transition: { before: "INPLAY", after: "CLOSED" },
        payload: "ppb:sbkMarket:924.11111",
      };

      const sbkClosedState = {
        entities: {
          sportsbookmarkets: {
            "ppb:sbkMarket:924.11111": {
              urn: "ppb:sbkMarket:924.11111",
              marketId: "sbkMarketId",
              status: "CLOSED",
              inplay: true,
            },
          },
          exchangemarkets: {
            "ppb:excMarket:1.111111": {
              urn: "ppb:excMarket:1.111111",
              marketId: "excMarketId",
              status: "OPEN",
              inplay: true,
            },
          },
        },
      };

      it(`should call getMarketStatus for sbk market with CLOSED status and"
           dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES`, async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getMarketStatus.mockReturnValueOnce("CLOSED").mockReturnValueOnce("INPLAY");
        getState
          .mockReturnValueOnce(stateWithExcAndSbkMarketsOpen)
          .mockReturnValueOnce(stateWithExcAndSbkMarketsOpen)
          .mockReturnValue(sbkClosedState);

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"]),
          sbkToClosedAction,
        ]);

        expect(getMarketStatus).toHaveBeenCalledTimes(3);
        expect(getMarketStatus).toHaveBeenNthCalledWith(3, {
          urn: "ppb:sbkMarket:924.11111",
          marketId: "sbkMarketId",
          status: "CLOSED",
          inplay: true,
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId: "excMarketId",
          },
        });

        stopSaga();
      });

      it(`should not dispatch SUBSCRIBE_EXCHANGE_MARKET_UPDATES if exc market isn't in store`, async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        const withoutExcMarket = {
          entities: { ...sbkClosedState.entities, exchangemarkets: {} },
        };

        getMarketStatus.mockReturnValueOnce("CLOSED").mockReturnValueOnce("INPLAY");
        getState
          .mockReturnValueOnce(stateWithExcAndSbkMarketsOpen)
          .mockReturnValueOnce(stateWithExcAndSbkMarketsOpen)
          .mockReturnValue(withoutExcMarket);

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"]),
          sbkToClosedAction,
        ]);

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when sbk market transit from PREPLAY -> INPLAY", () => {
      const sbkToInplayAction = {
        type: MARKET_TRANSITIONED_STATUS,
        transition: { before: "PREPLAY", after: "INPLAY" },
        payload: "ppb:sbkMarket:924.11111",
      };

      it(`should not call getMarketStatus neither dispatch any action to subscribe
       the other market updates`, async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getState.mockReturnValue(stateWithExcAndSbkMarketsOpen);

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"]),
          sbkToInplayAction,
        ]);

        expect(getMarketStatus).toHaveBeenCalledTimes(2);
        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });
  });

  describe("with withFixtureUpdates equals true (mainMarkets from baseFixture)", () => {
    const sbkToClosedAction = {
      type: MARKET_TRANSITIONED_STATUS,
      transition: { before: "INPLAY", after: "CLOSED" },
      payload: "ppb:sbkMarket:924.11111",
    };

    describe("when baseFixture sbk market transit from INPLAY -> CLOSED after baseFixture exc market is already CLOSED", () => {
      it(`should call getMarketStatus sbk market with CLOSED status,
           request mainMarketsUpdates from BFF and dispatch FETCH_MAIN_MARKETS_UPDATES_SUCCESS`, async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getMarketStatus.mockReturnValue("CLOSED");
        getState
          .mockReturnValueOnce(excClosedState)
          .mockReturnValueOnce(excClosedState)
          .mockReturnValue(stateWithExcAndSbkMarketsClosed);

        catalogueService.getMainMarketsUpdates.mockReturnValue("mainMarketsUpdatesResult");

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"], true),
          sbkToClosedAction,
        ]);

        expect(getMarketStatus).toHaveBeenCalledTimes(3);
        expect(getMarketStatus).toHaveBeenNthCalledWith(3, {
          urn: "ppb:sbkMarket:924.11111",
          marketId: "sbkMarketId",
          status: "CLOSED",
          inplay: true,
        });

        expect(catalogueService.getMainMarketsUpdates).toHaveBeenCalledWith(
          ["cardURN"],
          true,
          {
            prefA: 1,
            prefB: 2,
          },
          ["GAMES"],
          experimentsMock,
          throttleOverridesMock,
          routerMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
          payload: "mainMarketsUpdatesResult",
        });

        stopSaga();
      });
    });

    describe(`when both displayMarkets (withFixtureUpdates === false) and mainMarkets (withFixtureUpdates === true)
       are subscribed to this saga with the same marketIds`, () => {
      it(`should request for bff updates only once`, async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getMarketStatus.mockReturnValue("CLOSED");
        getState
          .mockReturnValueOnce(excClosedState)
          .mockReturnValueOnce(excClosedState)
          .mockReturnValue(stateWithExcAndSbkMarketsClosed);

        catalogueService.getMainMarketsUpdates.mockReturnValue("mainMarketsUpdatesResult");

        await putActions([
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"]),
          subscribeMainMarketTransitionAction(["ppb:sbkMarket:924.11111", "ppb:excMarket:1.111111"], true),
          sbkToClosedAction,
        ]);

        expect(getMarketStatus).toHaveBeenCalledTimes(6);
        expect(catalogueService.getMainMarketsUpdates).toHaveBeenCalledTimes(1);
        expect(catalogueService.getMainMarketsUpdates).toHaveBeenCalledWith(
          ["cardURN"],
          true,
          {
            prefA: 1,
            prefB: 2,
          },
          ["GAMES"],
          experimentsMock,
          throttleOverridesMock,
          routerMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
          payload: "mainMarketsUpdatesResult",
        });

        stopSaga();
      });
    });
  });

  describe("when a PUSH action is dispatched", () => {
    it("should not dispatch any action", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([
        {
          type: PUSH,
        },
      ]);

      expect(dispatch).not.toHaveBeenCalled();
      stopSaga();
    });
  });
});
