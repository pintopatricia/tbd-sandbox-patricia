import setupSagaMocks from "../saga-jest-setup";
import { PUSH } from "../actions/router";
import { UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES } from "../actions/sportsbook-markets";
import { getSportsbookMarketById } from "../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES } from "../actions/exchange-markets";

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ marketTransitionsMonitorSaga: saga } = require("./market-transitions-monitor-saga"));
  });
  return setupSagaMocks(saga);
}

jest.mock("../state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarketById: jest.fn(),
}));

const getExchangeMarketById = jest.fn();

jest.mock("../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createGetExchangeMarketByMarketIdSelector: () => getExchangeMarketById,
}));

describe("marketTransitionsMonitorSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("for sportsbook market updates", () => {
    describe("when transitioning from PREPLAY -> INPLAY", () => {
      const initialAction = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.263290881",
              marketId: "924.263290881",
              status: "OPEN",
              eachWayAvailable: false,
              guaranteedPriceAvailable: true,
              inplay: false,
            },
          ],
        },
      };

      const transitionAction = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.263290881",
              marketId: "924.263290881",
              status: "OPEN",
              eachWayAvailable: false,
              guaranteedPriceAvailable: true,
              inplay: true,
            },
          ],
        },
      };

      it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([initialAction, transitionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:sbkMarket:924.263290881",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        });
        stopSaga();
      });
    });

    describe("when transitioning from PREPLAY -> CLOSED", () => {
      const initialAction = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.263290881",
              marketId: "924.263290881",
              status: "OPEN",
              eachWayAvailable: false,
              guaranteedPriceAvailable: true,
              inplay: false,
            },
            {
              urn: "ppb:sbkMarket:924.263290882",
              marketId: "924.263290882",
              status: "OPEN",
              eachWayAvailable: false,
              guaranteedPriceAvailable: true,
              inplay: false,
            },
          ],
        },
      };

      const transitionAction = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.263290881",
              status: "CLOSED",
            },
            {
              urn: "ppb:sbkMarket:924.263290882",
              status: "CLOSED",
            },
          ],
        },
      };

      it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([initialAction, transitionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:sbkMarket:924.263290881",
          transition: {
            before: "PREPLAY",
            after: "CLOSED",
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:sbkMarket:924.263290882",
          transition: {
            before: "PREPLAY",
            after: "CLOSED",
          },
        });
        stopSaga();
      });
    });

    describe("when transitioning from PREPLAY -> INPLAY -> CLOSED", () => {
      const initialAction = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.263290881",
              marketId: "924.263290881",
              status: "OPEN",
              eachWayAvailable: false,
              guaranteedPriceAvailable: true,
              inplay: false,
            },
          ],
        },
      };

      const transitionToInplayAction = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.263290881",
              marketId: "924.263290881",
              status: "OPEN",
              eachWayAvailable: false,
              guaranteedPriceAvailable: true,
              inplay: true,
            },
          ],
        },
      };

      const transitionToClosedAction = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.263290881",
              status: "CLOSED",
            },
          ],
        },
      };

      it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([initialAction, transitionToInplayAction, transitionToClosedAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:sbkMarket:924.263290881",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:sbkMarket:924.263290881",
          transition: {
            before: "INPLAY",
            after: "CLOSED",
          },
        });
        stopSaga();
      });
    });
  });

  describe("for exchange market updates", () => {
    describe("when transitioning from PREPLAY -> INPLAY", () => {
      const initialAction = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.182938767",
              status: "OPEN",
              inplay: false,
            },
            {
              urn: "ppb:excMarket:1.182939052",
              status: "OPEN",
              inplay: false,
            },
          ],
        },
      };

      const transitionAction = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.182938767",
              status: "OPEN",
              inplay: true,
            },
            {
              urn: "ppb:excMarket:1.182939052",
              status: "OPEN",
              inplay: true,
            },
          ],
        },
      };

      it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([initialAction, transitionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:excMarket:1.182938767",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:excMarket:1.182939052",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        });
        stopSaga();
      });
    });

    describe("when transitioning from PREPLAY -> CLOSED", () => {
      const initialAction = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.182938767",
              status: "OPEN",
              inplay: false,
            },
            {
              urn: "ppb:excMarket:1.182939052",
              status: "OPEN",
              inplay: false,
            },
          ],
        },
      };

      const transitionAction = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.182938767",
              status: "CLOSED",
              inplay: false,
            },
            {
              urn: "ppb:excMarket:1.182939052",
              status: "CLOSED",
              inplay: false,
            },
          ],
        },
      };

      it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([initialAction, transitionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:excMarket:1.182939052",
          transition: {
            before: "PREPLAY",
            after: "CLOSED",
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:excMarket:1.182938767",
          transition: {
            before: "PREPLAY",
            after: "CLOSED",
          },
        });
        stopSaga();
      });
    });

    describe("when transitioning from PREPLAY -> INPLAY -> CLOSED", () => {
      const initialAction = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.182938767",
              status: "OPEN",
              inplay: false,
            },
          ],
        },
      };

      const transitionToInplayAction = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.182938767",
              status: "OPEN",
              inplay: true,
            },
          ],
        },
      };

      const transitionToClosedAction = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.182938767",
              status: "CLOSED",
              inplay: false,
            },
          ],
        },
      };

      it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([initialAction, transitionToInplayAction, transitionToClosedAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:excMarket:1.182938767",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: "MARKET_TRANSITIONED_STATUS",
          payload: "ppb:excMarket:1.182938767",
          transition: {
            before: "INPLAY",
            after: "CLOSED",
          },
        });
        stopSaga();
      });
    });
  });

  describe("when receiving same PREPLAY state updates", () => {
    const initialAction = {
      type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [
          {
            urn: "ppb:excMarket:1.182938767",
            status: "OPEN",
            inplay: false,
          },
        ],
      },
    };

    const transitionAction = {
      type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [
          {
            urn: "ppb:excMarket:1.182938767",
            status: "OPEN",
            inplay: false,
          },
        ],
      },
    };

    it("should not dispatch MARKET_TRANSITIONED_STATUS", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([initialAction, transitionAction]);

      expect(dispatch).not.toHaveBeenCalled();
      stopSaga();
    });
  });

  describe("when receiving same INPLAY state updates", () => {
    const initialAction = {
      type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [
          {
            urn: "ppb:excMarket:1.182938767",
            status: "OPEN",
            inplay: true,
          },
        ],
      },
    };

    const transitionAction = {
      type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [
          {
            urn: "ppb:excMarket:1.182938767",
            status: "OPEN",
            inplay: true,
          },
        ],
      },
    };

    it("should not dispatch MARKET_TRANSITIONED_STATUS", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([initialAction, transitionAction]);

      expect(dispatch).not.toHaveBeenCalled();
      stopSaga();
    });
  });

  describe("when receiving same CLOSED state updates", () => {
    const initialAction = {
      type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [
          {
            urn: "ppb:excMarket:1.182938767",
            status: "CLOSED",
            inplay: false,
          },
        ],
      },
    };

    const transitionAction = {
      type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [],
      },
    };

    it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([initialAction, transitionAction]);

      expect(dispatch).toHaveBeenCalledWith({
        type: "MARKET_TRANSITIONED_STATUS",
        payload: "ppb:excMarket:1.182938767",
        transition: {
          after: "CLOSED",
          before: "INPLAY",
        },
      });
      stopSaga();
    });
  });

  describe("when receiving CLOSED at first state", () => {
    const action = {
      type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [
          {
            urn: "ppb:excMarket:1.182938767",
            status: "CLOSED",
            inplay: false,
          },
        ],
      },
    };

    it("should dispatch a MARKET_TRANSITIONED_STATUS with the correct payload", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([action]);

      expect(dispatch).toHaveBeenCalledWith({
        type: "MARKET_TRANSITIONED_STATUS",
        payload: "ppb:excMarket:1.182938767",
        transition: {
          after: "CLOSED",
          before: "INPLAY",
        },
      });
      stopSaga();
    });
  });

  describe("when a PUSH action is dispatched", () => {
    it("should not dispatch MARKET_TRANSITIONED_STATUS", async () => {
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

  describe("when a UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES action is dispatched", () => {
    it("should call getSportsbookMarketById with the correct arguments", async () => {
      const { putActions, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { sportsbookmarkets: [1, 2], exchangemarkets: [3, 4] } });

      getSportsbookMarketById.mockReturnValue({
        urn: "ppb:sbkMarket:924.263290881",
        marketId: "1",
        status: "OPEN",
        eachWayAvailable: false,
        guaranteedPriceAvailable: true,
        inplay: false,
      });

      await putActions([
        {
          type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
          payload: {
            markets: [
              {
                urn: "ppb:sbkMarket:924.263290881",
                marketId: "1",
                status: "OPEN",
                eachWayAvailable: false,
                guaranteedPriceAvailable: true,
                inplay: false,
              },
            ],
          },
        },
        {
          type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: {
            marketId: "1",
          },
        },
      ]);

      expect(getSportsbookMarketById).toHaveBeenCalledWith([1, 2], "1");
      stopSaga();
    });
  });

  describe("when a UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES action is dispatched", () => {
    it("should call createGetExchangeMarketByMarketIdSelector with the correct arguments", async () => {
      const { putActions, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { sportsbookmarkets: [1, 2], exchangemarkets: [3, 4] } });

      getSportsbookMarketById.mockReturnValue(null);
      getExchangeMarketById.mockReturnValue({
        urn: "ppb:excMarket:1.182938767",
        marketId: "2",
      });

      await putActions([
        {
          type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
          payload: {
            markets: [
              {
                urn: "ppb:excMarket:1.182938767",
                status: "CLOSED",
                marketId: "2",
                inplay: false,
              },
            ],
          },
        },
        {
          type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: {
            marketId: "2",
          },
        },
      ]);

      expect(getExchangeMarketById).toHaveBeenCalledWith([3, 4], "2");
      stopSaga();
    });
  });
});
