import { factory, helpers, CONST } from "@ppb/bet-engine";
import { isOnlineUserDetails } from "../state/entities";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";

import { PRICE_LADDER_CONFIG, SIZE_LADDER_CONFIG } from "../config/bet-engine-config";
import {
  BETTING__ADD_POTENTIAL_BET_ACTION,
  BETTING__UPDATE_POTENTIAL_BET_ACTION,
  BETTING__EXC_STATE_UPDATE,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__NUDGE_UP_POTENTIAL_BET_ACTION,
  BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION,
  BETTING__EXC_INCREMENT_SIZE_ACTION,
  BETTING__REMOVE_POTENTIAL_BET_ACTION,
  BETTING__UPDATE_UNMATCHED_BET_ACTION,
  BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
  BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
  BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION,
  BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
  BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
  BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION,
  BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
  BETTING__BONUS_TOGGLE_BET_ACTION,
} from "../actions/betting";
import { FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS } from "../actions/exchange-markets";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../state/entities/entities-selectors";
import { getUnmatchedBets } from "../state/betting/exchange-betting/exchange-betting-selectors";
import { FETCH_EXC_OPEN_BETS_SUCCESS } from "../actions/exchange-open-bets";
import { NETWORK__PLACE_EXC_BET_SUCCESS } from "../actions/betslip";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";
import { getExchangeRunnerByURN } from "../state/entities/exchange-runners/exchange-runner-selectors";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import { getBetslipExchangeEdit } from "../state/betslip/betslip-card-selectors";
import { ExchangeSide } from "../state/constants";

const { MIN_PRICE, MAX_PRICE, STEPS } = PRICE_LADDER_CONFIG;
const { MAX_SIZE, INTERVAL } = SIZE_LADDER_CONFIG;
const STORE_MOCK = {
  getState: jest.fn(() => "getStateMock"),
  dispatch: jest.fn(() => "storeDispatchMock"),
};
const subscribeSpy = jest.fn();
const setUserDiscountSpy = jest.fn();
const updateMarketSpy = jest.fn(() => "BetEngineUpdateMarketMock");
const addMarketSpy = jest.fn(() => "BetEngineAddMarketMock");
const hasMarketSpy = jest.fn(() => false);
const addPotentialBetSpy = jest.fn();
const setMarketOpenBetsSpy = jest.fn();
const updatePotentialBetSpy = jest.fn();
const updateUnmatchedBetSpy = jest.fn();
const nudgeUpUnmatchedBetPriceSpy = jest.fn();
const nudgeDownUnmatchedBetPriceSpy = jest.fn();
const nudgeUpUnmatchedBetSizeSpy = jest.fn();
const nudgeDownUnmatchedBetSizeSpy = jest.fn();
const removePotentialBetSpy = jest.fn();
const removePotentialBetsSpy = jest.fn();
const nudgeUpPotentialBetPriceSpy = jest.fn();
const nudgeDownPotentialBetPriceSpy = jest.fn();
const nudgeUpPotentialBetSizeSpy = jest.fn();
const nudgeDownPotentialBetSizeSpy = jest.fn();
const getPotentialBetsSpy = jest.fn();
const validatePriceSpy = jest.fn();
const validateSizeSpy = jest.fn();
const incrementPotentialBetSizeSpy = jest.fn();

jest.mock("@ppb/bet-engine", () => ({
  __esModule: true,
  factory: {
    createPriceLadder: jest.fn(() => "priceLadderMock"),
    createSizeLadder: jest.fn(() => "sizeLadderMock"),
    createBetEngine: jest.fn(() => ({
      subscribe: subscribeSpy,
      setUserDiscount: setUserDiscountSpy,
      updateMarket: updateMarketSpy,
      addMarket: addMarketSpy,
      hasMarket: hasMarketSpy,
      addPotentialBet: addPotentialBetSpy,
      setMarketOpenBets: setMarketOpenBetsSpy,
      removePotentialBets: removePotentialBetsSpy,
      nudgeUpPotentialBetPrice: nudgeUpPotentialBetPriceSpy,
      nudgeDownPotentialBetPrice: nudgeDownPotentialBetPriceSpy,
      nudgeUpPotentialBetSize: nudgeUpPotentialBetSizeSpy,
      nudgeDownPotentialBetSize: nudgeDownPotentialBetSizeSpy,
      updatePotentialBet: updatePotentialBetSpy,
      updateUnmatchedBet: updateUnmatchedBetSpy,
      nudgeUpUnmatchedBetPrice: nudgeUpUnmatchedBetPriceSpy,
      nudgeDownUnmatchedBetPrice: nudgeDownUnmatchedBetPriceSpy,
      nudgeUpUnmatchedBetSize: nudgeUpUnmatchedBetSizeSpy,
      nudgeDownUnmatchedBetSize: nudgeDownUnmatchedBetSizeSpy,
      getPotentialBets: getPotentialBetsSpy,
      removePotentialBet: removePotentialBetSpy,
      validatePrice: validatePriceSpy,
      validateSize: validateSizeSpy,
      incrementPotentialBetSize: incrementPotentialBetSizeSpy,
    })),
  },
  helpers: {
    mapLBROrdersToOpenBets: jest.fn(),
  },
  CONST: {
    BET: {
      CATEGORY_TYPE: {
        EXCHANGE: "EXCHANGE",
      },
    },
    LADDER: {
      VALIDATIONS_REASONS: {
        ABOVE_MAX_PRICE: "ABOVE_MAX_PRICE",
        INVALID_STEP: "INVALID_STEP",
        BELOW_MIN_PRICE: "BELOW_MIN_PRICE",
      },
    },
  },
}));

jest.mock("../state/entities/entities-selectors", () => ({
  getExchangeRunnerTree: jest.fn(() => null),
  createExcRunnerPotentialBetsByRunnerURNSelector: jest.fn(() => jest.fn(() => [])),
}));

jest.mock("../state/betting/exchange-betting/exchange-betting-selectors", () => ({
  getUnmatchedBets: jest.fn(() => {}),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    excSettings: {
      discount: "getUserDetailsDiscountMock",
      currencyDetails: {
        minStake: 1337,
      },
    },
  })),
}));

jest.mock("../state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeEdit: jest.fn(() => []),
}));

jest.mock("../state/entities/exchange-runners/exchange-runner-selectors", () => ({
  getExchangeRunnerByURN: jest.fn(() => null),
}));

jest.mock("../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => null),
}));

jest.mock("../state/entities/user-details/UserDetailsState", () => ({ isOnlineUserDetails: jest.fn() }));

function setup({ nextSpy = jest.fn(), storeMock = STORE_MOCK } = {}) {
  let middleware;

  jest.isolateModules(() => {
    ({ exchangeBettingMiddleware: middleware } = require("./exchange-betting"));
  });

  return {
    dispatch: (actionType, payload = {}) =>
      middleware(storeMock)(nextSpy)({
        type: actionType,
        payload,
      }),
  };
}

describe("Exchange Betting Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isOnlineUserDetails.mockReturnValue(true);
  });

  describe("when the store receives it's first action", () => {
    it("should pass through a random action", async () => {
      const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      await setup({ nextSpy }).dispatch("ANY_ACTION", { fake: "payload" });

      expect(nextSpy).toHaveBeenCalledWith({ type: "ANY_ACTION", payload: { fake: "payload" } });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should not instantiate bet engine when initialState is null", async () => {
      isOnlineUserDetails.mockReturnValueOnce(false);
      await setup().dispatch("ANY_ACTION", { initialState: null });

      expect(getUserDetails).toHaveBeenCalledWith("getStateMock");
      expect(factory.createBetEngine).not.toHaveBeenCalled();
    });

    it("should not instantiate bet engine when user details are not online type", async () => {
      isOnlineUserDetails.mockReturnValueOnce(false);
      await setup().dispatch("ANY_ACTION", { fake: "payload" });

      expect(getUserDetails).toHaveBeenCalledWith("getStateMock");
      expect(factory.createBetEngine).not.toHaveBeenCalled();
    });

    it("should initialize a bet engine stateful api instance", async () => {
      await setup().dispatch("ANY_ACTION", { fake: "payload" });

      expect(getUserDetails).toHaveBeenCalledWith("getStateMock");
      expect(factory.createPriceLadder).toHaveBeenCalledWith(MIN_PRICE, MAX_PRICE, STEPS);
      expect(factory.createSizeLadder).toHaveBeenCalledWith(1337, MAX_SIZE, INTERVAL);
      expect(factory.createBetEngine).toHaveBeenCalledWith({
        discount: "getUserDetailsDiscountMock",
        ladders: { price: { default: "priceLadderMock" }, size: { default: "sizeLadderMock" } },
      });
      expect(subscribeSpy).toHaveBeenCalledWith(expect.any(Function));

      expect(getUserDetails).toHaveBeenCalledTimes(1);
      expect(factory.createPriceLadder).toHaveBeenCalledTimes(1);
      expect(factory.createSizeLadder).toHaveBeenCalledTimes(1);
      expect(factory.createBetEngine).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });

    it("should not create multiple instances of bet engine stateful api", async () => {
      const { dispatch } = setup();
      await dispatch("ANY_ACTION", { fake: "payload" });
      await dispatch("ANY_ACTION2", { fake: "payload" });

      expect(getUserDetails).toHaveBeenCalledTimes(1);
      expect(factory.createPriceLadder).toHaveBeenCalledTimes(1);
      expect(factory.createSizeLadder).toHaveBeenCalledTimes(1);
      expect(factory.createBetEngine).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when the store receives a market update", () => {
    describe("and if betengine already has the markets", () => {
      it("should update each betengine market", async () => {
        const storeMock = {
          getState: jest.fn(() => ({
            entities: {
              exchangemarkets: {
                "urn:12345": { old: "data" },
                "urn:123": { old: "data2" },
                "urn:54321": { garbage: true },
              },
            },
          })),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        hasMarketSpy.mockReturnValue(true);

        await setup({ storeMock }).dispatch(FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS, {
          markets: {
            "urn:12345": { urn: "urn:12345", new: "data" },
            "urn:123": { urn: "urn:123", new: "data2" },
          },
        });

        expect(hasMarketSpy).toHaveBeenCalledWith("urn:12345");
        expect(updateMarketSpy).toHaveBeenCalledWith(
          "urn:12345",
          { urn: "urn:12345", old: "data", new: "data" },
          undefined,
        );
        expect(hasMarketSpy).toHaveBeenCalledWith("urn:123");
        expect(updateMarketSpy).toHaveBeenCalledWith(
          "urn:123",
          { urn: "urn:123", old: "data2", new: "data2" },
          undefined,
        );
      });
    });

    describe("and if betengine does not have the market", () => {
      it("should add the market to betengine", async () => {
        const storeMock = {
          getState: jest.fn(() => ({
            entities: {
              exchangemarkets: {
                "urn:12345": { old: "olddata", runners: [1, 2, 3] },
                "urn:123": { old: "olddata2", runners: [4, 5, 6] },
                "urn:54321": { garbage: true },
              },
            },
          })),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        hasMarketSpy.mockReturnValue(false);

        await setup({ storeMock }).dispatch(FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS, {
          markets: {
            "urn:12345": { urn: "urn:12345", new: "newdata" },
            "urn:123": { urn: "urn:123", new: "newdata2" },
          },
        });

        expect(hasMarketSpy).toHaveBeenCalledWith("urn:12345");
        expect(addMarketSpy).toHaveBeenCalledWith(
          {
            id: "urn:12345",
            urn: "urn:12345",
            old: "olddata",
            new: "newdata",
            settledProfit: 0,
          },
          [1, 2, 3],
        );
        expect(hasMarketSpy).toHaveBeenCalledWith("urn:123");
        expect(addMarketSpy).toHaveBeenCalledWith(
          {
            id: "urn:123",
            urn: "urn:123",
            old: "olddata2",
            new: "newdata2",
            settledProfit: 0,
          },
          [4, 5, 6],
        );
      });
    });
  });

  describe("when bet-engine state changes", () => {
    it("should dispatch BETTING__EXC_STATE_UPDATE actions for every new state", async () => {
      await setup().dispatch(BETTING__ADD_POTENTIAL_BET_ACTION, { fake: "payload" });
      const [onStateChange] = subscribeSpy.mock.calls[0];

      onStateChange("some bet-engine state");
      onStateChange("more bet-engine state");

      expect(STORE_MOCK.dispatch).toHaveBeenCalledTimes(2);
      expect(STORE_MOCK.dispatch).toHaveBeenNthCalledWith(1, {
        type: BETTING__EXC_STATE_UPDATE,
        payload: { state: "some bet-engine state" },
      });
      expect(STORE_MOCK.dispatch).toHaveBeenNthCalledWith(2, {
        type: BETTING__EXC_STATE_UPDATE,
        payload: { state: "more bet-engine state" },
      });
    });
  });

  describe("when the action is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    it("should re-initialize the bet engine with correct exchangeSettings", async () => {
      await setup().dispatch(NETWORK__FETCH_APP_CONTEXT_SUCCESS, {
        initialState: {
          entities: {
            userdetails: {
              excSettings: {
                discount: "updatedDiscount",
              },
            },
          },
        },
      });

      expect(setUserDiscountSpy).toHaveBeenCalledTimes(1);
      expect(setUserDiscountSpy).toHaveBeenCalledWith("updatedDiscount");
      expect(subscribeSpy).toHaveBeenCalledWith(expect.any(Function));

      expect(factory.createPriceLadder).toHaveBeenCalledTimes(1);
      expect(factory.createSizeLadder).toHaveBeenCalledTimes(1);
      expect(factory.createBetEngine).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });

    it("should not create the bet engine when user details are not online type", async () => {
      // suppress warning
      const warnSpy = jest.spyOn(console, "warn");
      warnSpy.mockImplementation(() => {});

      isOnlineUserDetails.mockReturnValue(false);

      await setup().dispatch(NETWORK__FETCH_APP_CONTEXT_SUCCESS, {
        initialState: {
          entities: {
            userdetails: {
              currencyCode: "USD",
            },
            excSettings: null,
          },
        },
      });

      expect(factory.createBetEngine).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe("when the action is BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION", () => {
    it("should remove potential bets for all markets", async () => {
      const stateMock = {
        mock: "state",
        betting: {
          exchangeBetting: {
            urn1: {},
            urn2: {},
          },
        },
      };
      const storeMock = {
        getState: jest.fn(() => stateMock),
        dispatch: jest.fn(() => "storeDispatchMock"),
      };

      await setup({ storeMock }).dispatch(BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION);

      expect(removePotentialBetsSpy).toHaveBeenCalledTimes(2);
      expect(removePotentialBetsSpy).toHaveBeenCalledWith("urn1");
      expect(removePotentialBetsSpy).toHaveBeenCalledWith("urn2");
    });
  });

  describe("when the action is NETWORK__PLACE_EXC_BET_SUCCESS", () => {
    it("should remove potential bets for all markets", async () => {
      const stateMock = {
        mock: "state",
        betting: {
          exchangeBetting: {
            urn1: {},
            urn2: {},
          },
        },
      };
      const storeMock = {
        getState: jest.fn(() => stateMock),
        dispatch: jest.fn(() => "storeDispatchMock"),
      };

      await setup({ storeMock }).dispatch(NETWORK__PLACE_EXC_BET_SUCCESS);

      expect(removePotentialBetsSpy).toHaveBeenCalledTimes(2);
      expect(removePotentialBetsSpy).toHaveBeenCalledWith("urn1");
      expect(removePotentialBetsSpy).toHaveBeenCalledWith("urn2");
    });
  });

  describe("when the action is BETTING__EXC_INCREMENT_SIZE_ACTION", () => {
    describe("when it can't resolve the bet-engine runner", () => {
      it("should not increment the potential bet size in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        await setup({ storeMock }).dispatch(BETTING__EXC_INCREMENT_SIZE_ACTION, {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
          increment: 10,
        });

        expect(incrementPotentialBetSizeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when there is all data", () => {
      describe("when there is size", () => {
        it("should set the size + increment", async () => {
          const stateMock = {
            mock: "state",
          };
          const storeMock = {
            getState: jest.fn(() => stateMock),
            dispatch: jest.fn(() => "storeDispatchMock"),
          };

          getExchangeRunnerTree.mockReturnValue({
            market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
            marketRunner: { selectionId: 123, handicap: 0 },
          });

          await setup({ storeMock }).dispatch(BETTING__EXC_INCREMENT_SIZE_ACTION, {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            increment: 10,
          });

          expect(incrementPotentialBetSizeSpy).toHaveBeenCalledTimes(1);
          expect(incrementPotentialBetSizeSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, 10);
        });
      });
    });
  });

  describe("when the action is BETTING__ADD_POTENTIAL_BET_ACTION", () => {
    describe("when it can't resolve the runner tree", () => {
      it("should not add potential bet to the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue(null);

        await setup({ storeMock }).dispatch(BETTING__ADD_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
          price: 1.01,
          size: 2,
        });

        expect(addPotentialBetSpy).not.toHaveBeenCalled();
        expect(updateMarketSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can resolve the runner tree", () => {
      it("should add potential bet to the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC", type: "type", bettingType: "bettingType" },
          marketRunner: { selectionId: "some selectionId", handicap: "some handicap" },
        });

        await setup({ storeMock }).dispatch(BETTING__ADD_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
          price: 1.01,
          size: 2,
        });

        expect(addPotentialBetSpy).toHaveBeenCalledTimes(1);
        expect(updateMarketSpy).toHaveBeenCalledTimes(1);
        expect(addPotentialBetSpy).toHaveBeenCalledWith("marketUrn", {
          side: ExchangeSide.BACK,
          selectionId: "some selectionId",
          handicap: "some handicap",
          price: 1.01,
          size: 2,
        });
        expect(updateMarketSpy).toHaveBeenCalledWith("marketUrn", {
          type: "type",
          bettingType: "bettingType",
          bonus: 0,
        });
      });
    });
  });

  describe("when the action is BETTING__NUDGE_UP_POTENTIAL_BET_ACTION", () => {
    describe("when it can't resolve the runner tree", () => {
      it("should not nudge the potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue(null);

        await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
        });

        expect(nudgeUpPotentialBetPriceSpy).not.toHaveBeenCalled();
        expect(nudgeUpPotentialBetSizeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can't resolve a potential bet", () => {
      it("should not nudge the potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
          marketRunner: { selectionId: 123, handicap: 0 },
        });
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);

        await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
        });

        expect(nudgeUpPotentialBetPriceSpy).not.toHaveBeenCalled();
        expect(nudgeUpPotentialBetSizeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when there is all data", () => {
      describe("when the input is price (odds)", () => {
        describe("when there is price", () => {
          it("should nudge the potential bet in the bet-engine with the price", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, price: 1.23 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "price",
            });

            expect(nudgeUpPotentialBetPriceSpy).toHaveBeenCalledTimes(1);
            expect(nudgeUpPotentialBetPriceSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, 1.23);
          });
        });

        describe("when there is no price", () => {
          it("should nudge the potential bet in the bet-engine with 1", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "price",
            });

            expect(nudgeUpPotentialBetPriceSpy).toHaveBeenCalledTimes(1);
            expect(nudgeUpPotentialBetPriceSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, 1);
          });
        });

        it("should dispatch a valid potential bet update", async () => {
          const dispatchMock = jest.fn(() => "storeDispatchMock");
          const storeMock = {
            getState: jest.fn(() => ({ mock: "state" })),
            dispatch: dispatchMock,
          };

          getExchangeRunnerTree.mockReturnValue({
            market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
            marketRunner: { selectionId: 123, handicap: 0 },
          });
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
            { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, price: 1.23 },
          ]);

          await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            input: "price",
          });

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
            },
          });
        });
      });

      describe("when the input is size (stake)", () => {
        describe("when there is size", () => {
          it("should update the potential bet with size + 1, preserving cents", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, size: 2000.5 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "size",
            });

            expect(nudgeUpPotentialBetSizeSpy).not.toHaveBeenCalled();
            expect(updatePotentialBetSpy).toHaveBeenCalledTimes(1);
            expect(updatePotentialBetSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, {
              size: 2001.5,
            });
          });
        });

        describe("when there is no size", () => {
          it("should update the potential bet, clamped at the minimum stake", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "size",
            });

            expect(updatePotentialBetSpy).toHaveBeenCalledTimes(1);
            expect(updatePotentialBetSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, {
              size: 1337,
            });
          });
        });

        it("should dispatch a valid potential bet update", async () => {
          const dispatchMock = jest.fn(() => "storeDispatchMock");
          const storeMock = {
            getState: jest.fn(() => ({ mock: "state" })),
            dispatch: dispatchMock,
          };

          getExchangeRunnerTree.mockReturnValue({
            market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
            marketRunner: { selectionId: 123, handicap: 0 },
          });
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
            { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, size: 1 },
          ]);

          await setup({ storeMock }).dispatch(BETTING__NUDGE_UP_POTENTIAL_BET_ACTION, {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            input: "size",
          });

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
            },
          });
        });
      });
    });
  });

  describe("when the action is BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION", () => {
    describe("when it can't resolve the bet-engine runner", () => {
      it("should not nudge the potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue(null);

        await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
        });

        expect(nudgeDownPotentialBetPriceSpy).not.toHaveBeenCalled();
        expect(nudgeDownPotentialBetSizeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can't resolve a potential bet", () => {
      it("should not nudge the potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
          marketRunner: { selectionId: 123, handicap: 0 },
        });
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);

        await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
        });

        expect(nudgeDownPotentialBetPriceSpy).not.toHaveBeenCalled();
        expect(nudgeDownPotentialBetSizeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when there is all data", () => {
      describe("when the input is price (odds)", () => {
        describe("when there is price", () => {
          it("should nudge the potential bet in the bet-engine with the price", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, price: 1.23 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "price",
            });

            expect(nudgeDownPotentialBetPriceSpy).toHaveBeenCalledTimes(1);
            expect(nudgeDownPotentialBetPriceSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, 1.23);
          });
        });

        describe("when there is no price", () => {
          it("should nudge the potential bet in the bet-engine with 1", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "price",
            });

            expect(nudgeDownPotentialBetPriceSpy).toHaveBeenCalledTimes(1);
            expect(nudgeDownPotentialBetPriceSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, 1);
          });
        });

        it("should dispatch a valid potential bet update", async () => {
          const dispatchMock = jest.fn(() => "storeDispatchMock");
          const storeMock = {
            getState: jest.fn(() => ({ mock: "state" })),
            dispatch: dispatchMock,
          };

          getExchangeRunnerTree.mockReturnValue({
            market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
            marketRunner: { selectionId: 123, handicap: 0 },
          });
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
            { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, price: 1.23 },
          ]);

          await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            input: "price",
          });

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
            },
          });
        });
      });

      describe("when the input is size (stake)", () => {
        describe("when there is size", () => {
          it("should update the potential bet with size - 1, preserving cents", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, size: 2000.5 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "size",
            });

            expect(nudgeDownPotentialBetSizeSpy).not.toHaveBeenCalled();
            expect(updatePotentialBetSpy).toHaveBeenCalledTimes(1);
            expect(updatePotentialBetSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, {
              size: 1999.5,
            });
          });
        });

        describe("when there is no size", () => {
          it("should update the potential bet, clamped at the minimum stake", async () => {
            const stateMock = {
              mock: "state",
            };
            const storeMock = {
              getState: jest.fn(() => stateMock),
              dispatch: jest.fn(() => "storeDispatchMock"),
            };

            getExchangeRunnerTree.mockReturnValue({
              market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
              marketRunner: { selectionId: 123, handicap: 0 },
            });
            createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
              { side: ExchangeSide.BACK, selectionId: 123, handicap: 0 },
            ]);

            await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              input: "size",
            });

            expect(updatePotentialBetSpy).toHaveBeenCalledTimes(1);
            expect(updatePotentialBetSpy).toHaveBeenCalledWith("marketUrn", 123, 0, ExchangeSide.BACK, {
              size: 1337,
            });
          });
        });

        it("should dispatch a valid potential bet update", async () => {
          const dispatchMock = jest.fn(() => "storeDispatchMock");
          const storeMock = {
            getState: jest.fn(() => ({ mock: "state" })),
            dispatch: dispatchMock,
          };

          getExchangeRunnerTree.mockReturnValue({
            market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
            marketRunner: { selectionId: 123, handicap: 0 },
          });
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
            { side: ExchangeSide.BACK, selectionId: 123, handicap: 0, size: 1 },
          ]);

          await setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION, {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            input: "size",
          });

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
            },
          });
        });
      });
    });
  });

  describe("when the action is BETTING__UPDATE_POTENTIAL_BET_ACTION", () => {
    const buildSetup = ({
      dispatch = () => {},
      priceValidation = { isValid: true },
      sizeValidation = { isValid: true },
      action,
    }) => {
      const stateMock = {
        mock: "state",
      };
      const storeMock = {
        getState: jest.fn(() => stateMock),
        dispatch,
      };

      getExchangeRunnerTree.mockReturnValue({
        market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
        marketRunner: { selectionId: 1, handicap: 0 },
      });
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
        { side: ExchangeSide.BACK, selectionId: 1, handicap: 0 },
      ]);
      validateSizeSpy.mockReturnValue(sizeValidation);
      validatePriceSpy.mockReturnValue(priceValidation);

      return async () => {
        await setup({ storeMock }).dispatch(BETTING__UPDATE_POTENTIAL_BET_ACTION, action);
      };
    };

    describe("when it can't resolve the runner tree", () => {
      it("should not update potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue(null);

        await setup({ storeMock }).dispatch(BETTING__UPDATE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
          price: 1.01,
          size: 2,
        });

        expect(updatePotentialBetSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can't resolve the potential bet", () => {
      it("should NOT update potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
          marketRunner: { selectionId: 1, handicap: 0 },
        });
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);

        await setup({ storeMock }).dispatch(BETTING__UPDATE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
          price: 1.01,
          size: 2,
        });

        expect(updatePotentialBetSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it has all data but the price is invalid", () => {
      describe("invalid for exceeding maximum price", () => {
        it("should dispatch BETTING/INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION", async () => {
          const dispatch = jest.fn(() => "storeDispatchMock");
          const maximumPrice = 42;
          const reason = CONST.LADDER.VALIDATIONS_REASONS.ABOVE_MAX_PRICE;

          await buildSetup({
            dispatch,
            priceValidation: {
              isValid: false,
              data: { reason, maximum: maximumPrice },
            },
            action: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              price: 100,
              size: 1,
            },
          })();

          expect(dispatch.mock.calls[0][0]).toStrictEqual({
            type: BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              price: 100,
              error: {
                maximum: maximumPrice,
                reason,
              },
            },
          });
        });
      });

      describe("invalid for in between step prices", () => {
        it("should dispatch BETTING/INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION", async () => {
          const dispatch = jest.fn(() => "storeDispatchMock");
          const previousStep = 42;
          const nextStep = 52;
          const reason = CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP;

          await buildSetup({
            dispatch,
            priceValidation: {
              isValid: false,
              data: { reason, previousStep, nextStep },
            },
            action: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              price: 44,
              size: 1,
            },
          })();

          expect(dispatch.mock.calls[0][0]).toStrictEqual({
            type: BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              price: 44,
              error: {
                previousStep,
                nextStep,
                reason,
              },
            },
          });
        });
      });

      describe("invalid for falling short of price", () => {
        it("should dispatch BETTING/INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION", async () => {
          const dispatch = jest.fn(() => "storeDispatchMock");
          const minimum = 42;
          const reason = CONST.LADDER.VALIDATIONS_REASONS.BELOW_MIN_PRICE;

          await buildSetup({
            dispatch,
            priceValidation: {
              isValid: false,
              data: { reason, minimum },
            },
            action: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              price: 44,
              size: 1,
            },
          })();

          expect(dispatch.mock.calls[0][0]).toStrictEqual({
            type: BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              price: 44,
              error: {
                minimum,
                reason,
              },
            },
          });
        });
      });

      it("should NOT update potential bet in the bet-engine", async () => {
        await buildSetup({
          priceValidation: { isValid: false, data: { reason: "tell me why" } },
          action: {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            price: 1.01,
            size: 2,
          },
        })();

        expect(updatePotentialBetSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it has all data but the size is invalid", () => {
      describe("invalid for falling short of size", () => {
        it("should dispatch BETTING/INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION", async () => {
          const dispatch = jest.fn(() => "storeDispatchMock");
          const minimum = 1;
          const reason = "some reason";

          await buildSetup({
            dispatch,
            sizeValidation: {
              isValid: false,
              data: { reason, minimum },
            },
            action: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              price: 20,
              size: 0.5,
            },
          })();

          expect(dispatch.mock.calls[0][0]).toStrictEqual({
            type: BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION,
            payload: {
              runner: "runner:urn",
              side: ExchangeSide.BACK,
              size: 0.5,
              error: {
                minimum,
                reason,
              },
            },
          });
        });
      });

      it("should NOT update potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const dispatch = jest.fn(() => "storeDispatchMock");
        const minimum = 1;
        const reason = "some reason";
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch,
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
          marketRunner: { selectionId: 1, handicap: 0 },
        });
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
          { side: ExchangeSide.BACK, selectionId: 1, handicap: 0 },
        ]);
        validatePriceSpy.mockReturnValue({ isValid: true });
        validateSizeSpy.mockReturnValue({
          isValid: false,
          data: { reason, minimum },
        });

        await setup({ storeMock }).dispatch(BETTING__UPDATE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
          price: 1.01,
          size: 0.5,
        });

        expect(updatePotentialBetSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it has all data and the price+size are valid", () => {
      it("should update potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
          marketRunner: { selectionId: 1, handicap: 0 },
        });
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
          { side: ExchangeSide.BACK, selectionId: 1, handicap: 0 },
        ]);

        validatePriceSpy.mockReturnValue({ isValid: true });
        validateSizeSpy.mockReturnValue({ isValid: true });

        await setup({ storeMock }).dispatch(BETTING__UPDATE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
          price: 1.01,
          size: 2,
        });

        await setup({ storeMock }).dispatch(BETTING__UPDATE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
        });

        expect(updatePotentialBetSpy).toHaveBeenCalledTimes(2);
        expect(updatePotentialBetSpy).toHaveBeenCalledWith("marketUrn", 1, 0, ExchangeSide.BACK, {
          price: 1.01,
          size: 2,
        });

        expect(updatePotentialBetSpy).toHaveBeenCalledWith("marketUrn", 1, 0, ExchangeSide.BACK, {
          price: undefined,
          size: undefined,
        });
      });

      it("should update potential bet in the bet-engine with undefined values", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
          marketRunner: { selectionId: 1, handicap: 0 },
        });
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
          { side: ExchangeSide.BACK, selectionId: 1, handicap: 0 },
        ]);

        validatePriceSpy.mockReturnValue({ isValid: true });
        validateSizeSpy.mockReturnValue({ isValid: true });

        await setup({ storeMock }).dispatch(BETTING__UPDATE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
        });

        expect(updatePotentialBetSpy).toHaveBeenCalledTimes(1);
        expect(updatePotentialBetSpy).toHaveBeenCalledWith("marketUrn", 1, 0, ExchangeSide.BACK, {
          price: undefined,
          size: undefined,
        });
      });

      it("should dispatch BETTING/VALID_UPDATE_POTENTIAL_BET_ACTION", async () => {
        const dispatch = jest.fn(() => {});
        await buildSetup({
          dispatch,
          action: {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            price: 44,
            size: 1,
          },
        })();

        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
          payload: {
            runner: "runner:urn",
            side: ExchangeSide.BACK,
            price: 44,
            size: 1,
          },
        });
      });
    });
  });

  describe("when the action is BETTING__UPDATE_UNMATCHED_BET_ACTION", () => {
    async function setupUpdateUnmatchetBet({
      runnerTree = null,
      unmatchedBet = null,
      isValidPrice = false,
      isValidSize = false,
      dispatchFn = jest.fn(() => "dispatch mock"),
    }) {
      const storeMock = {
        getState: jest.fn(() => "state mock"),
        dispatch: dispatchFn,
      };

      getExchangeRunnerTree.mockReturnValue(runnerTree);
      getUnmatchedBets.mockReturnValue([unmatchedBet]);
      validatePriceSpy.mockReturnValue({ isValid: isValidPrice });
      validateSizeSpy.mockReturnValue({ isValid: isValidSize });

      return setup({ storeMock }).dispatch(BETTING__UPDATE_UNMATCHED_BET_ACTION, {
        betId: "some betId",
        side: ExchangeSide.BACK,
        price: 1.01,
        size: 2,
      });
    }

    describe("when it can't resolve the runner tree", () => {
      it("should not update unmatched bet in the bet-engine", async () => {
        await setupUpdateUnmatchetBet({
          runnerTree: null,
          unmatchedBet: null,
        });

        expect(updateUnmatchedBetSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can resolve the runner tree", () => {
      describe("and cant resolve the unmatched bet", () => {
        it("should not update unmatched bet in the bet-engine", async () => {
          await setupUpdateUnmatchetBet({
            runnerTree: {
              market: {
                urn: "urn:market",
              },
            },
            unmatchedBet: null,
          });

          expect(updateUnmatchedBetSpy).not.toHaveBeenCalled();
        });
      });

      describe("and can resolve the unmatched bet", () => {
        describe("and price is not valid", () => {
          it("should validate size and price using bet-engine", async () => {
            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
              },
              unmatchedBet: {
                size: 100,
              },
              isValidPrice: false,
              isValidSize: true,
            });

            expect(validatePriceSpy).toHaveBeenCalledWith("urn:market", ExchangeSide.BACK, "EXCHANGE", 1.01);
            expect(validateSizeSpy).toHaveBeenCalledWith(ExchangeSide.BACK, "EXCHANGE", 2, 100);
          });
          it("should not update unmatched bet using bet-engine", async () => {
            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
              },
              unmatchedBet: {
                size: 100,
              },
              isValidPrice: false,
              isValidSize: true,
            });

            expect(updateUnmatchedBetSpy).not.toHaveBeenCalled();
          });
          it("should dispatch a price validation", async () => {
            const dispatchFn = jest.fn();

            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
              },
              unmatchedBet: {
                size: 100,
              },
              isValidPrice: false,
              isValidSize: true,
              dispatchFn,
            });

            expect(dispatchFn).toHaveBeenCalledWith({
              type: BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION,
              payload: {
                betId: "some betId",
                order: {
                  price: 1.01,
                  size: 2,
                  validations: {
                    price: { isValid: false },
                    size: undefined,
                  },
                },
              },
            });
          });
        });
        describe("and size is not valid", () => {
          it("should validate size and price using bet-engine", async () => {
            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
              },
              unmatchedBet: {
                size: 100,
              },
              isValidPrice: true,
              isValidSize: false,
            });

            expect(validatePriceSpy).toHaveBeenCalledWith("urn:market", ExchangeSide.BACK, "EXCHANGE", 1.01);
            expect(validateSizeSpy).toHaveBeenCalledWith(ExchangeSide.BACK, "EXCHANGE", 2, 100);
          });
          it("should not update unmatched bet using bet-engine", async () => {
            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
              },
              unmatchedBet: {
                size: 100,
              },
              isValidPrice: true,
              isValidSize: false,
            });

            expect(updateUnmatchedBetSpy).not.toHaveBeenCalled();
          });
          it("should dispatch a price validation", async () => {
            const dispatchFn = jest.fn();

            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
              },
              unmatchedBet: {
                size: 100,
              },
              isValidPrice: true,
              isValidSize: false,
              dispatchFn,
            });

            expect(dispatchFn).toHaveBeenCalledWith({
              type: BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION,
              payload: {
                betId: "some betId",
                order: {
                  price: 1.01,
                  size: 2,
                  validations: {
                    price: undefined,
                    size: { isValid: false },
                  },
                },
              },
            });
          });
        });
        describe("and size+price are valid", () => {
          it("should validate size and price using bet-engine", async () => {
            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 100,
              },
              isValidPrice: true,
              isValidSize: true,
            });

            expect(validatePriceSpy).toHaveBeenCalledWith("urn:market", ExchangeSide.BACK, "EXCHANGE", 1.01);
            expect(validateSizeSpy).toHaveBeenCalledWith(ExchangeSide.BACK, "EXCHANGE", 2, 100);
          });
          it("should update unmatched bet using bet-engine", async () => {
            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 100,
              },
              isValidPrice: true,
              isValidSize: true,
            });

            expect(updateUnmatchedBetSpy).toHaveBeenCalledWith(
              "urn:market",
              "some selectionId",
              "some handicap",
              "some betId",
              {
                price: 1.01,
                size: 2,
              },
            );
          });

          it("should dispatch a valid unmatched bet update", async () => {
            const dispatchFn = jest.fn();

            await setupUpdateUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 100,
              },
              isValidPrice: true,
              isValidSize: true,
              dispatchFn,
            });

            expect(dispatchFn).toHaveBeenCalledWith({
              type: BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
              payload: {
                betId: "some betId",
                order: {
                  price: 1.01,
                  size: 2,
                },
              },
            });
          });
        });
      });
    });
  });

  describe("when the action is BETTING__NUDGE_UP_UNMATCHED_BET_ACTION", () => {
    async function setupNudgeUpUnmatchetBet({
      runnerTree = null,
      unmatchedBet = null,
      dispatch = jest.fn(() => "dispatch default mock"),
      input = "price",
    }) {
      const storeMock = {
        getState: jest.fn(() => "state mock"),
        dispatch,
      };

      getExchangeRunnerTree.mockReturnValue(runnerTree);
      getUnmatchedBets.mockReturnValue([unmatchedBet]);

      return setup({ storeMock }).dispatch(BETTING__NUDGE_UP_UNMATCHED_BET_ACTION, {
        betId: "some betId",
        side: ExchangeSide.BACK,
        price: 1.01,
        size: 2,
        input,
      });
    }

    describe("when it can't resolve the runner tree", () => {
      it("should not nudge up unmatched bet in the bet-engine", async () => {
        await setupNudgeUpUnmatchetBet({
          runnerTree: null,
          unmatchedBet: null,
        });

        expect(nudgeUpUnmatchedBetPriceSpy).not.toHaveBeenCalled();
        expect(nudgeUpUnmatchedBetSizeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can resolve the runner tree", () => {
      describe("and cant resolve the unmatched bet", () => {
        it("should not nudge up unmatched bet in the bet-engine", async () => {
          await setupNudgeUpUnmatchetBet({
            runnerTree: {
              market: {},
            },
            unmatchedBet: null,
          });

          expect(nudgeUpUnmatchedBetPriceSpy).not.toHaveBeenCalled();
          expect(nudgeUpUnmatchedBetSizeSpy).not.toHaveBeenCalled();
        });
      });

      describe("and can resolve the unmatched bet", () => {
        describe("when the input is price (odds)", () => {
          it("should nudge up unmatched bet using bet-engine", async () => {
            await setupNudgeUpUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 100,
              },
            });

            expect(nudgeUpUnmatchedBetPriceSpy).toHaveBeenCalledWith(
              "urn:market",
              "some selectionId",
              "some handicap",
              "some betId",
            );
          });

          it("should dispatch a valid unmatched bet update", async () => {
            const dispatch = jest.fn();
            nudgeUpUnmatchedBetPriceSpy.mockReturnValue(42);
            await setupNudgeUpUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 100,
              },
              dispatch,
            });

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
              payload: {
                betId: "some betId",
                order: {
                  price: 42,
                  size: 100,
                },
              },
            });
          });
        });

        describe("when the input is size (stake)", () => {
          it("should update the unmatched bet with size + 1, preserving cents", async () => {
            await setupNudgeUpUnmatchetBet({
              input: "size",
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                price: 42,
                size: 2000.5,
              },
            });

            expect(nudgeUpUnmatchedBetSizeSpy).not.toHaveBeenCalled();
            expect(updateUnmatchedBetSpy).toHaveBeenCalledWith(
              "urn:market",
              "some selectionId",
              "some handicap",
              "some betId",
              { size: 2001.5 },
            );
          });

          it("should dispatch a valid unmatched bet update with the new size", async () => {
            const dispatch = jest.fn();
            await setupNudgeUpUnmatchetBet({
              input: "size",
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                price: 42,
                size: 2000.5,
              },
              dispatch,
            });

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
              payload: {
                betId: "some betId",
                order: {
                  price: 42,
                  size: 2001.5,
                },
              },
            });
          });
        });
      });
    });
  });

  describe("when the action is BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION", () => {
    async function setupNudgeDownUnmatchetBet({
      runnerTree = null,
      unmatchedBet = null,
      dispatch = jest.fn(() => "dispatch default mock"),
      input = "price",
    }) {
      const storeMock = {
        getState: jest.fn(() => "state mock"),
        dispatch,
      };

      getExchangeRunnerTree.mockReturnValue(runnerTree);
      getUnmatchedBets.mockReturnValue([unmatchedBet]);

      return setup({ storeMock }).dispatch(BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION, {
        betId: "some betId",
        side: ExchangeSide.BACK,
        price: 1.01,
        size: 2,
        input,
      });
    }

    describe("when it can't resolve the runner tree", () => {
      it("should not nudge down unmatched bet in the bet-engine", async () => {
        await setupNudgeDownUnmatchetBet({
          runnerTree: null,
          unmatchedBet: null,
        });

        expect(nudgeDownUnmatchedBetPriceSpy).not.toHaveBeenCalled();
        expect(nudgeDownUnmatchedBetSizeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can resolve the runner tree", () => {
      describe("and cant resolve the unmatched bet", () => {
        it("should not nudge down unmatched bet in the bet-engine", async () => {
          await setupNudgeDownUnmatchetBet({
            runnerTree: {
              market: {},
            },
            unmatchedBet: null,
          });

          expect(nudgeDownUnmatchedBetPriceSpy).not.toHaveBeenCalled();
          expect(nudgeDownUnmatchedBetSizeSpy).not.toHaveBeenCalled();
        });
      });

      describe("and can resolve the unmatched bet", () => {
        describe("when the input is price (odds)", () => {
          it("should nudge down unmatched bet using bet-engine", async () => {
            await setupNudgeDownUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 100,
              },
            });

            expect(nudgeDownUnmatchedBetPriceSpy).toHaveBeenCalledWith(
              "urn:market",
              "some selectionId",
              "some handicap",
              "some betId",
            );
          });

          it("should dispatch a valid unmatched bet update", async () => {
            const dispatch = jest.fn();
            nudgeDownUnmatchedBetPriceSpy.mockReturnValue(42);
            await setupNudgeDownUnmatchetBet({
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 100,
              },
              dispatch,
            });

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
              payload: {
                betId: "some betId",
                order: {
                  price: 42,
                  size: 100,
                },
              },
            });
          });
        });

        describe("when the input is size (stake)", () => {
          it("should update the unmatched bet with size - 1, preserving cents", async () => {
            await setupNudgeDownUnmatchetBet({
              input: "size",
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                size: 2000.5,
              },
            });

            expect(nudgeDownUnmatchedBetSizeSpy).not.toHaveBeenCalled();
            expect(updateUnmatchedBetSpy).toHaveBeenCalledWith(
              "urn:market",
              "some selectionId",
              "some handicap",
              "some betId",
              { size: 1999.5 },
            );
          });

          it("should dispatch a valid unmatched bet update with the new size", async () => {
            const dispatch = jest.fn();
            await setupNudgeDownUnmatchetBet({
              input: "size",
              runnerTree: {
                market: {
                  urn: "urn:market",
                },
                marketRunner: {
                  selectionId: "some selectionId",
                  handicap: "some handicap",
                },
              },
              unmatchedBet: {
                id: "some betId",
                price: 100,
                size: 2000.5,
              },
              dispatch,
            });

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
              payload: {
                betId: "some betId",
                order: {
                  price: 100,
                  size: 1999.5,
                },
              },
            });
          });
        });
      });
    });
  });

  describe("when the action is BETTING__REMOVE_POTENTIAL_BET_ACTION", () => {
    describe("when it can't resolve the runner tree", () => {
      it("should not remove potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue(null);

        await setup({ storeMock }).dispatch(BETTING__REMOVE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
        });

        expect(removePotentialBetSpy).not.toHaveBeenCalled();
      });
    });

    describe("when it can resolve the runner tree", () => {
      it("should remove potential bet in the bet-engine", async () => {
        const stateMock = {
          mock: "state",
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };

        getExchangeRunnerTree.mockReturnValue({
          market: { urn: "marketUrn", priceLadderType: "CLASSIC" },
          marketRunner: { selectionId: "some selectionId", handicap: "some handicap" },
        });

        await setup({ storeMock }).dispatch(BETTING__REMOVE_POTENTIAL_BET_ACTION, {
          side: ExchangeSide.BACK,
        });

        expect(removePotentialBetSpy).toHaveBeenCalledTimes(1);
        expect(removePotentialBetSpy).toHaveBeenCalledWith(
          "marketUrn",
          "some selectionId",
          "some handicap",
          ExchangeSide.BACK,
        );
      });
    });
  });

  describe("when action is BETTING__BONUS_TOGGLE_BET_ACTION", () => {
    it("should call updateMarket from betEngine", async () => {
      const stateMock = {
        entities: {
          exchangerunners: "exchangerunners",
          exchangemarkets: "exchangemarkets",
        },
      };
      const storeMock = {
        getState: jest.fn(() => stateMock),
        dispatch: jest.fn(() => "storeDispatchMock"),
      };

      createExchangeMarketSelector.mockReturnValue(() => ({
        urn: "runnerURN",
        bettingType: "bettingType",
        type: "type",
      }));

      getExchangeRunnerByURN.mockReturnValue({ market: "market" });

      await setup({ storeMock }).dispatch(BETTING__BONUS_TOGGLE_BET_ACTION, {
        runner: "runnerURN",
        marketEligibleBonus: 10,
        isFreeBetsSelected: true,
      });

      expect(updateMarketSpy).toHaveBeenCalledTimes(1);
      expect(updateMarketSpy).toHaveBeenCalledWith("runnerURN", {
        bettingType: "bettingType",
        type: "type",
        bonus: 10,
      });
    });

    describe("when bonus is not selected", () => {
      it("should call updateMarket with bonus as 0", async () => {
        const stateMock = {
          entities: {
            exchangerunners: "exchangerunners",
            exchangemarkets: "exchangemarkets",
          },
        };
        const storeMock = {
          getState: jest.fn(() => stateMock),
          dispatch: jest.fn(() => "storeDispatchMock"),
        };
        createExchangeMarketSelector.mockReturnValue(() => ({
          urn: "runnerURN",
          bettingType: "bettingType",
          type: "type",
        }));

        getExchangeRunnerByURN.mockReturnValue({ market: "market" });

        await setup({ storeMock }).dispatch(BETTING__BONUS_TOGGLE_BET_ACTION, {
          runner: "runnerURN",
          marketEligibleBonus: 10,
          isFreeBetsSelected: false,
        });

        expect(updateMarketSpy).toHaveBeenCalledTimes(1);
        expect(updateMarketSpy).toHaveBeenCalledWith("runnerURN", {
          bettingType: "bettingType",
          type: "type",
          bonus: 0,
        });
      });
    });

    describe("when exchangeRunner is undefined", () => {
      it("should not call updateMarket", async () => {
        getExchangeRunnerByURN.mockReturnValue(undefined);

        expect(updateMarketSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("when exchangeMarket is undefined", () => {
      it("should not call updateMarket", async () => {
        getExchangeRunnerByURN.mockReturnValue({ market: "market" });

        createExchangeMarketSelector.mockReturnValue(() => undefined);

        expect(updateMarketSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when the action is FETCH_EXC_OPEN_BETS_SUCCESS", () => {
    async function setupOpenBetsAction() {
      const stateMock = {
        mock: "state",
      };
      const storeMock = {
        getState: jest.fn(() => stateMock),
        dispatch: jest.fn(() => "storeDispatchMock"),
      };

      hasMarketSpy.mockReturnValueOnce(true);
      hasMarketSpy.mockReturnValueOnce(false);
      helpers.mapLBROrdersToOpenBets.mockImplementation((orders) => ({
        1.1: orders,
        1.2: orders,
      }));
      getBetslipExchangeEdit.mockReturnValue({
        betId: "111",
        order: {
          price: 10,
          size: 100,
        },
      });

      await setup({ storeMock }).dispatch(FETCH_EXC_OPEN_BETS_SUCCESS, {
        markets: {
          1.1: {
            market: "market:urn:1.1",
            marketId: "1.1",
            orders: "orders:1.1",
            settledProfit: 1,
          },
          1.2: {
            market: "market:urn:1.2",
            marketId: "1.2",
            orders: "orders:1.2",
            settledProfit: 2,
          },
        },
      });
    }

    it("should map position orders using mapLBROrdersToOpenBets helper mapper", async () => {
      await setupOpenBetsAction();

      const editedBetsArg = {
        111: {
          newPrice: 10,
          newSize: 100,
        },
      };

      expect(getBetslipExchangeEdit).toHaveBeenCalledWith({ mock: "state" });
      expect(getBetslipExchangeEdit).toHaveBeenCalledTimes(1);

      expect(helpers.mapLBROrdersToOpenBets).toHaveBeenCalledWith("orders:1.1", editedBetsArg);
      expect(helpers.mapLBROrdersToOpenBets).toHaveBeenCalledTimes(1);
    });

    it("should set open bets for all markets in the bet-engine", async () => {
      await setupOpenBetsAction();

      expect(hasMarketSpy).toHaveBeenCalledWith("market:urn:1.1");
      expect(hasMarketSpy).toHaveBeenCalledWith("market:urn:1.2");
      expect(hasMarketSpy).toHaveBeenCalledTimes(2);

      expect(setMarketOpenBetsSpy).toHaveBeenCalledWith("market:urn:1.1", "orders:1.1", 1);
      expect(setMarketOpenBetsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
