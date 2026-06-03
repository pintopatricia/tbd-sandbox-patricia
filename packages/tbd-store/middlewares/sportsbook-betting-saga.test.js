import { codecs } from "@ppb/tbd-urn-codecs";
import { ProductsOption } from "../state/entities";
import setupSagaMocks from "../saga-jest-setup";
import catalogService from "../services/catalogue/catalogue-service";
import {
  NETWORK__SBK_MARKETS_IN_PROGRESS,
  NETWORK__SBK_MARKETS_SUCCESS,
  NETWORK__SBK_MARKETS_FAILURE,
} from "../actions/catalogue";
import {
  BETTING__SBK_MARKETS_REQUEST,
  BETTING__SBK_ENSURE_SELECTION_DATA,
  BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
  BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__OBB_CLEAR_ACTION,
} from "../actions/betting";
import {
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "../actions/sportsbook-markets";
import { getSportsbookRunnerTree } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getVirtualRunnerByURN } from "../state/entities/virtual-runner/virtual-runner-selectors";
import { UI__ACTION_CONFIRMATION } from "../actions/confirmation";
import { UI__BETSLIP_SET_COLLAPSE_ACTION } from "../actions/betslip";
import { getObbBettingState } from "../state/betting/obb-betting/obb-betting-selectors";

jest.mock("../services/catalogue/catalogue-service", () => ({
  getMarkets: jest.fn(() => Promise.resolve(42)),
  getVirtualMarkets: jest.fn(() => Promise.resolve({ vm: "vm" })),
}));

jest.mock("../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookRunnerTree: jest.fn(),
}));

jest.mock("../state/entities/virtual-runner/virtual-runner-selectors", () => ({
  getVirtualRunnerByURN: jest.fn(),
}));

jest.mock("../state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarketByURN: jest.fn(),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    sportsbookMarket: {
      decode: jest.fn(),
    },
  },
}));

jest.mock("../state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest
    .fn()
    .mockReturnValue(jest.fn().mockReturnValue({ products: [ProductsOption.sportsbook] })),
}));

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

jest.mock("../state/betting/obb-betting/obb-betting-selectors", () => ({
  getObbBettingState: jest.fn().mockReturnValue({ legs: {} }),
}));

const mockEmit = jest.fn();
jest.mock("eventemitter3-singleton", () => ({
  getEventRegistry: jest.fn().mockReturnValue({ emit: mockEmit }),
}));

const routerMock = { currentView: "" };

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ sportsbookBettingSaga: saga } = require("./sportsbook-betting-saga"));
  });
  const sagaMocks = setupSagaMocks(saga);

  sagaMocks.getState.mockReturnValue({
    router: routerMock,
    entities: { preferences: { products: [] } },
  });

  return sagaMocks;
}

describe("sportsbookBettingSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("on every BETTING__SBK_ENSURE_SELECTION_DATA action", () => {
    const ensureSelectionAction = {
      type: BETTING__SBK_ENSURE_SELECTION_DATA,
      payload: {
        selections: [{ marketUrn: "market:urn", runnerUrn: "runner:urn" }],
        timestamp: 42,
        group: "REAL",
      },
    };

    it("should call getVirtualRunnerByURN", async () => {
      const { putActions, getState, stopSaga } = setup();
      getState.mockReturnValueOnce({
        betslip: { group: "REAL" },
        betting: { sportsbookBetting: { legs: [] } },
        entities: { sportsbookrunners: "sbkrunners", virtualrunners: "virtualrunners" },
      });

      await putActions([ensureSelectionAction]);

      expect(getVirtualRunnerByURN).toHaveBeenCalledWith("virtualrunners", "runner:urn");
      expect(getVirtualRunnerByURN).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    it("should call getSportsbookRunnerTree", async () => {
      const { putActions, getState, stopSaga } = setup();
      const STATE_MOCK = {
        betslip: { group: "REAL" },
        betting: { sportsbookBetting: { legs: [] } },
        entities: { sportsbookrunners: "sbkrunners" },
      };
      getState.mockReturnValueOnce(STATE_MOCK);

      await putActions([ensureSelectionAction]);

      expect(getSportsbookRunnerTree).toHaveBeenCalledWith(STATE_MOCK, "runner:urn");
      expect(getSportsbookRunnerTree).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    describe("when real runners are not in the store", () => {
      it("should dispatch BETTING__SBK_MARKETS_REQUEST", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();
        getState.mockReturnValueOnce({
          betslip: { group: "REAL" },
          betting: { sportsbookBetting: { legs: [] } },
          entities: { sportsbookrunners: "sbkrunners" },
        });
        getSportsbookRunnerTree.mockReturnValueOnce(null);
        codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");

        await putActions([ensureSelectionAction]);

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: BETTING__SBK_MARKETS_REQUEST,
          payload: { urns: ["market:urn"], group: "REAL" },
        });

        stopSaga();
      });

      it("should dispatch SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();
        getState.mockReturnValueOnce({
          betslip: { group: "REAL" },
          betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
          entities: { sportsbookrunners: "sbkrunners" },
        });
        getSportsbookRunnerTree.mockReturnValueOnce(null);
        codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");

        await putActions([ensureSelectionAction]);

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: {
            marketId: "924.123",
            subscriberId: "sportsbook-betting-saga",
          },
        });

        stopSaga();
      });

      describe("when NETWORK__SBK_MARKETS_SUCCESS and FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS is dispatched", () => {
        it("should call getSportsbookRunnerTree", async () => {
          const { putActions, getState, stopSaga } = setup();
          const STATE_MOCK = {
            betslip: { group: "REAL" },
            betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
            entities: { sportsbookrunners: "sbkrunners", sportsbookmarkets: "sbkmarkets" },
          };
          getState.mockReturnValue(STATE_MOCK);
          getSportsbookRunnerTree.mockReturnValueOnce(null);
          codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");

          await putActions([
            ensureSelectionAction,
            { type: NETWORK__SBK_MARKETS_SUCCESS },
            { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
          ]);

          expect(getSportsbookRunnerTree).toHaveBeenNthCalledWith(2, STATE_MOCK, "runner:urn");
          expect(getSportsbookRunnerTree).toHaveBeenCalledTimes(2);

          stopSaga();
        });

        describe("when runner is added to the store", () => {
          it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS", async () => {
            const { getState, putActions, dispatch, stopSaga } = setup();
            getState.mockReturnValue({
              betslip: { group: "REAL" },
              betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
              entities: { sportsbookrunners: "sbkrunners", sportsbookmarkets: "sbkmarkets" },
            });
            getSportsbookRunnerTree.mockReturnValueOnce(null);
            codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");
            getSportsbookRunnerTree.mockReturnValueOnce("some runner");

            await putActions([
              ensureSelectionAction,
              { type: NETWORK__SBK_MARKETS_SUCCESS },
              { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
            ]);

            expect(dispatch).toHaveBeenNthCalledWith(4, {
              type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
              payload: ensureSelectionAction.payload,
            });
            expect(dispatch).toHaveBeenCalledTimes(4);

            stopSaga();
          });

          it("should dispatch UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES", async () => {
            const { getState, putActions, dispatch, stopSaga } = setup();
            getState.mockReturnValue({
              betslip: { group: "REAL" },
              betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
              entities: { sportsbookrunners: "sbkrunners", sportsbookmarkets: "sbkmarkets" },
            });
            getSportsbookRunnerTree.mockReturnValueOnce(null);
            codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");
            getSportsbookRunnerTree.mockReturnValueOnce("some runner");

            await putActions([
              ensureSelectionAction,
              { type: NETWORK__SBK_MARKETS_SUCCESS },
              { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
            ]);

            expect(dispatch).toHaveBeenCalledWith({
              type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
              payload: {
                marketId: "924.123",
                subscriberId: "sportsbook-betting-saga",
              },
            });

            stopSaga();
          });

          describe("when runner is not added to the store and ensureSelectionsFromStore is true", () => {
            it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_ERROR", async () => {
              const { getState, putActions, dispatch, stopSaga } = setup();
              getState.mockReturnValue({
                betslip: { group: "REAL" },
                betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
                entities: { sportsbookrunners: "sbkrunners", sportsbookmarkets: "sbkmarkets" },
              });
              getSportsbookRunnerTree.mockReturnValueOnce(null);
              codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");
              getSportsbookRunnerTree.mockReturnValueOnce(null);

              await putActions([
                ensureSelectionAction,
                { type: NETWORK__SBK_MARKETS_SUCCESS },
                { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
              ]);

              expect(dispatch).toHaveBeenNthCalledWith(4, {
                type: BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
              });
              expect(dispatch).toHaveBeenCalledTimes(4);

              stopSaga();
            });
          });

          describe("when runner is not added to the store and ensureSelectionsFromStore is false", () => {
            it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_ERROR", async () => {
              const { getState, putActions, dispatch, stopSaga } = setup();
              getState.mockReturnValue({
                betslip: { group: "REAL" },
                betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
                entities: { sportsbookrunners: "sbkrunners", sportsbookmarkets: "sbkmarkets" },
              });
              getSportsbookRunnerTree.mockReturnValueOnce(null);
              codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");
              getSportsbookRunnerTree.mockReturnValueOnce(null);

              const payload = { ...ensureSelectionAction.payload, ensureSelectionsFromStore: false };

              await putActions([
                {
                  ...ensureSelectionAction,
                  payload,
                },
                { type: NETWORK__SBK_MARKETS_SUCCESS },
                { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
              ]);

              expect(dispatch).toHaveBeenNthCalledWith(4, {
                type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
                payload,
              });
              expect(dispatch).toHaveBeenCalledTimes(4);

              stopSaga();
            });
          });
        });
      });
    });

    describe("when NETWORK__SBK_MARKETS_FAILURE and FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS is dispatched", () => {
      describe("when runner is not added to the store and ensureSelectionsFromStore is true", () => {
        it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_ERROR", async () => {
          const { getState, putActions, dispatch, stopSaga } = setup();
          getState.mockReturnValue({
            betslip: { group: "REAL" },
            betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
            entities: { sportsbookrunners: "sbkrunners", sportsbookmarkets: "sbkmarkets" },
          });
          getSportsbookRunnerTree.mockReturnValueOnce(null);
          codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");
          getSportsbookRunnerTree.mockReturnValueOnce(null);

          await putActions([
            ensureSelectionAction,
            { type: NETWORK__SBK_MARKETS_FAILURE },
            { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
          ]);

          expect(dispatch).toHaveBeenNthCalledWith(4, {
            type: BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
          });
          expect(dispatch).toHaveBeenCalledTimes(4);

          stopSaga();
        });
      });

      describe("when runner is not added to the store and ensureSelectionsFromStore is false", () => {
        it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS", async () => {
          const { getState, putActions, dispatch, stopSaga } = setup();
          getState.mockReturnValue({
            betslip: { group: "REAL" },
            betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
            entities: { sportsbookrunners: "sbkrunners", sportsbookmarkets: "sbkmarkets" },
          });
          getSportsbookRunnerTree.mockReturnValueOnce(null);
          codecs.sportsbookMarket.decode.mockReturnValueOnce("924.123");
          getSportsbookRunnerTree.mockReturnValueOnce(null);

          const payload = { ...ensureSelectionAction.payload, ensureSelectionsFromStore: false };

          await putActions([
            {
              ...ensureSelectionAction,
              payload,
            },
            { type: NETWORK__SBK_MARKETS_FAILURE },
            { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
          ]);

          expect(dispatch).toHaveBeenNthCalledWith(4, {
            type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
            payload,
          });
          expect(dispatch).toHaveBeenCalledTimes(4);

          stopSaga();
        });
      });
    });

    describe("when real runners are in the store", () => {
      it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();
        getState.mockReturnValueOnce({
          betslip: { group: "REAL" },
          betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
          entities: { sportsbookrunners: "sbkrunners" },
        });
        getSportsbookRunnerTree.mockReturnValueOnce("some runner");

        await putActions([ensureSelectionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: {
            selections: [{ marketUrn: "market:urn", runnerUrn: "runner:urn" }],
            timestamp: 42,
            group: "REAL",
          },
        });

        stopSaga();
      });
    });

    describe("when virtual runners are not in the store", () => {
      it("should dispatch BETTING__SBK_MARKETS_REQUEST", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();

        getState.mockReturnValueOnce({
          betslip: { group: "REAL" },
          betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
          entities: { virtualrunners: "sbkrunners" },
        });
        getVirtualRunnerByURN.mockReturnValueOnce(null);
        codecs.sportsbookMarket.decode.mockReturnValueOnce(undefined);

        await putActions([ensureSelectionAction]);

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: BETTING__SBK_MARKETS_REQUEST,
          payload: { urns: ["market:urn"], group: "REAL" },
        });

        stopSaga();
      });

      it("should not dispatch SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();

        getState.mockReturnValueOnce({
          betslip: { group: "REAL" },
          betting: { sportsbookBetting: { legs: [] } },
          entities: { virtualrunners: "virtualrunners" },
        });
        getVirtualRunnerByURN.mockReturnValueOnce(null);
        codecs.sportsbookMarket.decode.mockReturnValueOnce(undefined);

        await putActions([ensureSelectionAction]);

        expect(dispatch).not.toHaveBeenCalledWith(
          expect.objectContaining({
            type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          }),
        );

        stopSaga();
      });

      describe("when NETWORK__SBK_MARKETS_SUCCESS and FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS is dispatched", () => {
        it("should call getVirtualRunnerByURN", async () => {
          const { putActions, getState, stopSaga } = setup();

          getState.mockReturnValue({
            betslip: { group: "REAL" },
            betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
            entities: { virtualrunners: "virtualrunners" },
          });
          getVirtualRunnerByURN.mockReturnValueOnce(null);
          codecs.sportsbookMarket.decode.mockReturnValueOnce(undefined);

          await putActions([
            ensureSelectionAction,
            { type: NETWORK__SBK_MARKETS_SUCCESS },
            { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
          ]);

          expect(getVirtualRunnerByURN).toHaveBeenNthCalledWith(2, "virtualrunners", "runner:urn");
          expect(getVirtualRunnerByURN).toHaveBeenCalledTimes(2);

          stopSaga();
        });

        describe("when runner is added to the store", () => {
          it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS", async () => {
            const { getState, putActions, dispatch, stopSaga } = setup();

            getState.mockReturnValue({
              betslip: { group: "REAL" },
              betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
              entities: { virtualrunners: "virtualrunners" },
            });
            getVirtualRunnerByURN.mockReturnValueOnce(null);
            codecs.sportsbookMarket.decode.mockReturnValueOnce(undefined);
            getVirtualRunnerByURN.mockReturnValueOnce("some virtual runner");

            await putActions([
              ensureSelectionAction,
              { type: NETWORK__SBK_MARKETS_SUCCESS },
              { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
            ]);

            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenNthCalledWith(2, {
              type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
              payload: ensureSelectionAction.payload,
            });

            stopSaga();
          });

          describe("when runner is not added to the store", () => {
            it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_ERROR", async () => {
              const { getState, putActions, dispatch, stopSaga } = setup();

              getState.mockReturnValue({
                betslip: { group: "REAL" },
                betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
                entities: { virtualrunners: "virtualrunners" },
              });
              getVirtualRunnerByURN.mockReturnValueOnce(null);
              codecs.sportsbookMarket.decode.mockReturnValueOnce(undefined);
              getVirtualRunnerByURN.mockReturnValueOnce(null);

              await putActions([
                ensureSelectionAction,
                { type: NETWORK__SBK_MARKETS_SUCCESS },
                { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS },
              ]);

              expect(dispatch).toHaveBeenNthCalledWith(2, {
                type: BETTING__SBK_ENSURE_SELECTION_DATA_ERROR,
              });
              expect(dispatch).toHaveBeenCalledTimes(2);

              stopSaga();
            });
          });
        });
      });
    });

    describe("when virtual runners are in the store", () => {
      it("should dispatch BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();
        getState.mockReturnValueOnce({
          betslip: { group: "REAL" },
          betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: [] } },
          entities: { virtualrunners: "virtualrunners" },
        });
        getVirtualRunnerByURN.mockReturnValueOnce("some virtual runner");

        await putActions([ensureSelectionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
          payload: {
            selections: [{ marketUrn: "market:urn", runnerUrn: "runner:urn" }],
            timestamp: 42,
            group: "REAL",
          },
        });

        stopSaga();
      });
    });

    describe("when the betting groups are different", () => {
      it("should dispatch UI__ACTION_CONFIRMATION", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();
        getState.mockReturnValueOnce({
          betslip: { group: "VIRTUAL" },
          betting: { sportsbookBetting: { runners: "runnersMapBettingStateMock", legs: { leg1: { id: "leg1" } } } },
          entities: { virtualrunners: "virtualrunners" },
        });
        getVirtualRunnerByURN.mockReturnValueOnce("some virtual runner");

        await putActions([ensureSelectionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__ACTION_CONFIRMATION,
          payload: {
            id: "BETTING_GROUP_SWITCH",
            refuseActions: [],
            acceptActions: [
              {
                type: BETTING__SBK_CLEAR_ACTION,
              },
              {
                type: BETTING__SBK_ADD_SELECTIONS,
                payload: {
                  selections: ensureSelectionAction.payload.selections,
                  group: ensureSelectionAction.payload.group,
                },
              },
              {
                type: UI__BETSLIP_SET_COLLAPSE_ACTION,
                payload: { collapse: false },
              },
            ],
          },
        });

        stopSaga();
      });
    });

    describe("when obb legs are in the store", () => {
      it("should dispatch UI__ACTION_CONFIRMATION", async () => {
        const { getState, putActions, dispatch, stopSaga } = setup();
        getState.mockReturnValueOnce({
          betslip: { group: "REAL" },
          betting: { sportsbookBetting: {}, obbBetting: {} },
          entities: {},
        });

        getObbBettingState.mockReturnValueOnce({ legs: { leg1: { urn: "leg:urn:1" } } });

        await putActions([ensureSelectionAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__ACTION_CONFIRMATION,
          payload: {
            id: "BETTING_BETSLIP_TYPE_SWITCH",
            refuseActions: [],
            acceptActions: [
              {
                type: BETTING__OBB_CLEAR_ACTION,
              },
              {
                type: BETTING__SBK_ADD_SELECTIONS,
                payload: {
                  selections: ensureSelectionAction.payload.selections,
                  group: ensureSelectionAction.payload.group,
                },
              },
              {
                type: UI__BETSLIP_SET_COLLAPSE_ACTION,
                payload: { collapse: false },
              },
            ],
          },
        });

        stopSaga();
      });
    });
  });

  describe("on every BETTING__SBK_MARKETS_REQUEST action", () => {
    it("should dispatch NETWORK__SBK_MARKETS_IN_PROGRESS", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([{ type: BETTING__SBK_MARKETS_REQUEST, payload: { urns: ["ppb:1"] } }]);

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__SBK_MARKETS_IN_PROGRESS,
      });

      stopSaga();
    });

    describe("when REAL", () => {
      it("should call getMarkets from catalogue service", async () => {
        const { putActions, stopSaga } = setup();
        const urns = ["ppb:1", "ppb:2"];

        await putActions([{ type: BETTING__SBK_MARKETS_REQUEST, payload: { urns, group: "REAL" } }]);

        expect(catalogService.getMarkets).toHaveBeenCalledWith(
          urns,
          { products: [ProductsOption.sportsbook] },
          OVERRIDEN_THROTTLES,
          routerMock,
        );

        stopSaga();
      });
    });

    describe("when VIRTUAL", () => {
      it("should call getVirtualMarkets from catalogue service", async () => {
        const { putActions, stopSaga } = setup();
        const urns = ["ppb:1", "ppb:2"];

        await putActions([{ type: BETTING__SBK_MARKETS_REQUEST, payload: { urns, group: "VIRTUAL" } }]);

        expect(catalogService.getVirtualMarkets).toHaveBeenCalledWith(urns, OVERRIDEN_THROTTLES, routerMock);

        stopSaga();
      });
    });

    describe("when markets request succeeds", () => {
      it("should dispatch NETWORK__SBK_MARKETS_SUCCESS", async () => {
        const markets = { sportsbookmarkets: [{ urn: "ppb:1" }, { urn: "ppb:2" }] };
        catalogService.getMarkets.mockResolvedValueOnce(markets);
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([{ type: BETTING__SBK_MARKETS_REQUEST, payload: { urns: ["ppb:1", "ppb:2"] } }]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__SBK_MARKETS_SUCCESS,
          payload: { ...markets },
        });

        stopSaga();
      });
    });

    describe("when markets request succeeds", () => {
      it("should emit @@NETWORK/SBK_MARKETS_SUCCESS event", async () => {
        const markets = { sportsbookmarkets: [{ urn: "ppb:1" }, { urn: "ppb:2" }] };
        catalogService.getMarkets.mockResolvedValueOnce(markets);
        const { putActions, stopSaga } = setup();

        await putActions([{ type: BETTING__SBK_MARKETS_REQUEST, payload: { urns: ["ppb:1", "ppb:2"] } }]);

        expect(mockEmit).toHaveBeenCalledWith("@@NETWORK/SBK_MARKETS_SUCCESS", { ...markets });

        stopSaga();
      });
    });

    describe("when markets request fails", () => {
      it("should dispatch NETWORK__SBK_MARKETS_FAILURE", async () => {
        catalogService.getMarkets.mockImplementation(() => {
          throw new Error("boom");
        });
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([{ type: BETTING__SBK_MARKETS_REQUEST, payload: { urns: ["ppb:1", "ppb:2"] } }]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__SBK_MARKETS_FAILURE,
          payload: { error: "boom" },
        });

        stopSaga();
      });
    });
  });
});
