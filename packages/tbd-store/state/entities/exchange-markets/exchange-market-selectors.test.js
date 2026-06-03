import {
  createExchangeMarketRunnersSelector,
  createExchangeMarketSelector,
  createExchangeMarketsSelector,
  createGetExchangeMarketByMarketIdSelector,
  createRunnersBestPricesForExchangeMarketSelector,
  createRunnersForBookPercentageSelector,
  createRunnersPricesForExchangeMarketSelector,
  getExchangeMarketRunnerByURN,
  createExchangeMarketRunnerByMarketAndRunnerURNsSelector,
  createGetExchangeMarketByHierarchySelector,
} from "./exchange-market-selectors";
import { isCompetitionEventHierarchy } from "../../../helpers/markets";

jest.mock("@ppb/tbd-store/helpers/market-runners", () => ({}));

jest.mock("../../../helpers/markets", () => ({
  isCompetitionEventHierarchy: jest.fn(),
}));

const sportevent = "ppb:event:22334455";
const competition = "ppb:competition:11223344";

const exchangeMarketMock = {
  "ppb:excMarket:1.166528788": {
    urn: "ppb:excMarket:1.166528788",
    sportevent: "ppb:event:22334455",
    name: "EXC Market 1",
    totalMatched: 6,
    hierarchy: {
      sportevent,
      competition,
    },
    runners: [
      {
        urn: "ppb:excRunner:1.166528788/19/0",
        selection: 19,
        marketId: "1.166528788",
        name: "Some other Team A",
        handicap: 0,
      },
    ],
  },
  "ppb:excMarket:1.12345678": {
    urn: "ppb:excMarket:1.12345678",
    sportevent: "ppb:event:55443322",
    name: "EXC Market 1",
    totalMatched: 6,
    hierarchy: {
      sportevent: "ppb:event:55443322",
      competition: "ppb:competition:99887766",
    },
    runners: [
      {
        urn: "ppb:excRunner:1.166528788/19/0",
        selection: 19,
        marketId: "1.166528788",
        name: "Some other Team A",
        handicap: 0,
      },
    ],
  },
};

const stateMock = {
  "ppb:excMarket:1.166528788": {
    urn: "ppb:excMarket:1.166528788",
    sportevent: "ppb:event:22334455",
    name: "EXC Market 1",
    totalMatched: 6,
    runners: [
      {
        urn: "ppb:excRunner:1.166528788/19/0",
        selection: 19,
        marketId: "1.166528788",
        name: "Some other Team A",
        handicap: 0,
      },
    ],
  },
};

function setup(runners) {
  const marketUrn = "12345";

  const runner1 = {
    urn: "runner1",
    market: marketUrn,
    selectionId: 98765,
    back: [
      {
        marketDepth: 0,
        price: 1.23,
      },
    ],
    lay: [
      {
        marketDepth: 0,
        price: 1.32,
      },
    ],
  };

  const runner2 = {
    urn: "runner2",
    market: marketUrn,
    selectionId: 56789,
    back: [
      {
        marketDepth: 0,
        price: 1.11,
      },
    ],
    lay: [
      {
        marketDepth: 0,
        price: 1.22,
      },
    ],
  };

  const runnerMultiplePrices1 = {
    urn: "runner1",
    market: marketUrn,
    selectionId: 98765,
    back: [
      {
        liquidity: 2000,
        marketDepth: 0,
        price: 1.11,
      },
      {
        liquidity: 2001,
        marketDepth: 1,
        price: 1.22,
      },
      {
        liquidity: 2002,
        marketDepth: 2,
        price: 1.33,
      },
    ],
    lay: [
      {
        liquidity: 2000,
        marketDepth: 0,
        price: 1.11,
      },
      {
        liquidity: 2001,
        marketDepth: 1,
        price: 1.22,
      },
      {
        liquidity: 2002,
        marketDepth: 2,
        price: 1.33,
      },
    ],
  };

  const runnerWithoutPrices = {
    urn: "runner1",
    market: marketUrn,
    selectionId: 98765,
  };

  const priceUpdate = {
    back: [{ price: 1.99 }],
  };

  const priceUpdate1 = {
    back: [
      {
        price: 1.99,
        marketDepth: 0,
        liquidity: 2001,
      },
      {
        price: 1.22,
        marketDepth: 1,
        liquidity: 2001,
      },
      {
        price: 1.33,
        marketDepth: 2,
        liquidity: 2002,
      },
    ],
  };

  const updatedRunner1 = { ...runner1, ...priceUpdate };

  const updatedBestRunner1 = { ...runnerMultiplePrices1, ...priceUpdate1 };

  const state = {
    entities: {
      exchangerunners: {
        ...runners,
      },
    },
  };

  const selector = createRunnersForBookPercentageSelector();

  const runnersBestPriceSelector = createRunnersBestPricesForExchangeMarketSelector();

  const runnersPricesSelector = createRunnersPricesForExchangeMarketSelector();

  return {
    runner1,
    runner2,
    updatedRunner1,
    runnerMultiplePrices1,
    updatedBestRunner1,
    state,
    selector,
    result: selector(state.entities.exchangerunners, marketUrn),
    runnersBestPriceSelector,
    runnersBestPrices: runnersBestPriceSelector(state.entities.exchangerunners, marketUrn),
    runnersPricesSelector,
    runnersPrices: runnersPricesSelector(state.entities.exchangerunners, marketUrn),
    runnerWithoutPrices,
  };
}

describe('"exchangemarkets" selectors', () => {
  describe("getExchangeMarketRunnerByURN", () => {
    it("should return undefined when receiving a non-existing runner", () => {
      const market = stateMock["ppb:excMarket:1.166528788"];

      const runner = getExchangeMarketRunnerByURN(market, "NOPE");

      expect(runner).toBe(undefined);
    });

    it("should return runner when receiving an existing runner", () => {
      const market = stateMock["ppb:excMarket:1.166528788"];

      const runner = getExchangeMarketRunnerByURN(market, "ppb:excRunner:1.166528788/19/0");

      expect(runner).toEqual(market.runners[0]);
    });
  });

  describe("createExchangeMarketRunnersSelector", () => {
    function getState() {
      return {
        entities: {
          exchangemarkets: {
            "ppb:exc:market:1": {
              runners: [{ type: "runner" }],
            },
          },
        },
      };
    }

    describe("when market exists", () => {
      it("should return the runners for a given market", () => {
        const STATE = getState();
        const getExchangeMarketRunners = createExchangeMarketRunnersSelector();
        expect(getExchangeMarketRunners(STATE.entities.exchangemarkets, "ppb:exc:market:1")).toStrictEqual([
          { type: "runner" },
        ]);
      });
    });

    describe("when market does not exist", () => {
      it("should return empty for a given market", () => {
        const STATE = getState();
        const getExchangeMarketRunners = createExchangeMarketRunnersSelector();
        expect(getExchangeMarketRunners(STATE.entities.exchangemarkets, "unexistent:market")).toStrictEqual([]);
      });
    });

    describe("when state did not change", () => {
      it("should return the same instance", () => {
        const STATE = getState();

        const getExchangeMarketRunners = createExchangeMarketRunnersSelector();
        const runners = getExchangeMarketRunners(STATE.entities.exchangemarkets, "ppb:exc:market:1");
        const updatedRunners = getExchangeMarketRunners(STATE.entities.exchangemarkets, "ppb:exc:market:1");

        expect(runners).toStrictEqual([{ type: "runner" }]);
        expect(updatedRunners).toStrictEqual([{ type: "runner" }]);

        expect(runners === updatedRunners).toEqual(true);
      });
    });
  });

  describe("createExchangeMarketSelector", () => {
    it("should return the correct market", () => {
      const getExchangeMarketSelector = createExchangeMarketSelector();
      const state = { entities: { exchangemarkets: { 1234: { status: "OPEN" } } } };
      expect(getExchangeMarketSelector(state.entities.exchangemarkets, 1234)).toStrictEqual({ status: "OPEN" });
    });

    describe("when the selector is called again and market status didnt change", () => {
      const getExchangeMarketSelector = createExchangeMarketSelector();
      const state = { entities: { exchangemarkets: { 1234: { status: "OPEN" } } } };
      const newState = { ...state };

      const firstCallMarket = getExchangeMarketSelector(state.entities.exchangemarkets, 1234);
      const secondCallMarket = getExchangeMarketSelector(newState.entities.exchangemarkets, 1234);

      it("should return the same market", () => {
        expect(firstCallMarket === secondCallMarket).toBe(true);
      });
    });

    describe("when the selector is called again but the market status has changed", () => {
      const getExchangeMarketSelector = createExchangeMarketSelector();
      const state = { entities: { exchangemarkets: { 1234: { status: "OPEN" } } } };
      const newState = { entities: { exchangemarkets: { 1234: { status: "CLOSED" } } } };

      const firstCallMarket = getExchangeMarketSelector(state.entities.exchangemarkets, 1234);
      const secondCallMarket = getExchangeMarketSelector(newState.entities.exchangemarkets, 1234);

      it("should return a different market object", () => {
        expect(firstCallMarket === secondCallMarket).toBe(false);
      });
    });
  });

  describe("createGetExchangeMarketByMarketIdSelector", () => {
    it("should return the correct market", () => {
      const getExchangeMarketById = createGetExchangeMarketByMarketIdSelector();
      const state = { entities: { exchangemarkets: { 1234: { status: "OPEN", marketId: 1 } } } };
      expect(getExchangeMarketById(state.entities.exchangemarkets, 1)).toStrictEqual({ status: "OPEN", marketId: 1 });
    });

    describe("when the selector is called again and market id didnt change", () => {
      const getExchangeMarketById = createGetExchangeMarketByMarketIdSelector();
      const state = { entities: { exchangemarkets: { 1234: { status: "OPEN", marketId: 1 } } } };
      const newState = { ...state };

      const firstCallMarket = getExchangeMarketById(state.entities.exchangemarkets, 1);
      const secondCallMarket = getExchangeMarketById(newState.entities.exchangemarkets, 1);

      it("should return the same market", () => {
        expect(firstCallMarket === secondCallMarket).toBe(true);
      });
    });

    describe("when the selector is called again but the market status has changed", () => {
      const getExchangeMarketById = createGetExchangeMarketByMarketIdSelector();
      const state = { entities: { exchangemarkets: { 1234: { status: "OPEN", marketId: 1 } } } };
      const newState = { entities: { exchangemarkets: { 1234: { status: "CLOSED", marketId: 1 } } } };

      const firstCallMarket = getExchangeMarketById(state.entities.exchangemarkets, 1);
      const secondCallMarket = getExchangeMarketById(newState.entities.exchangemarkets, 1);

      it("should return a different market object", () => {
        expect(firstCallMarket === secondCallMarket).toBe(false);
      });
    });
  });

  describe("createRunnersPricesForExchangeMarketSelector", () => {
    describe("when the selector is called again with the same runners", () => {
      it("should return the same array of runners", () => {
        const { runnerMultiplePrices1 } = setup();
        const { runnersPrices } = setup({ runnerMultiplePrices1 });

        expect(runnersPrices).toStrictEqual([runnerMultiplePrices1]);
      });
    });

    describe("when the selector is called again but a price has changed", () => {
      const { runnerMultiplePrices1, updatedBestRunner1 } = setup();
      const { runnersPrices } = setup({ updatedBestRunner1, runnerMultiplePrices1 });

      it("should return an updated array of runners with all prices", () => {
        expect(runnersPrices).toStrictEqual([updatedBestRunner1, runnerMultiplePrices1]);
      });
    });
  });

  describe("when the createRunnersForBookPercentageSelector selector is called", () => {
    it("should return an array of runners", () => {
      const { runner1, runner2 } = setup();
      const { result } = setup({ runner1, runner2 });

      expect(result).toStrictEqual([runner1, runner2]);
    });

    describe("when the selector is called again with the same runners", () => {
      it("should return the same array of runners", () => {
        const { runner1, runner2 } = setup();
        const { result } = setup({ runner1, runner2 });

        expect(result).toStrictEqual([runner1, runner2]);
      });
    });

    describe("when the selector is called again but a price has changed", () => {
      const { runner2, updatedRunner1 } = setup();
      const { result } = setup({ updatedRunner1, runner2 });

      it("should return an updated array of runners", () => {
        expect(result).toStrictEqual([updatedRunner1, runner2]);
      });
    });

    describe("when the selector is called again with a different number of runners", () => {
      const { runner2 } = setup();
      const { result } = setup({ runner2 });

      it("should return an updated array of runners", () => {
        expect(result).toStrictEqual([runner2]);
      });
    });
  });

  describe("when the createRunnersBestPricesForExchangeMarketSelector selector is called", () => {
    it("should return an array of runners with best prices", () => {
      const { runnerMultiplePrices1 } = setup();
      const { runnersBestPrices } = setup({ runnerMultiplePrices1 });

      expect(runnersBestPrices).toStrictEqual([
        {
          ...runnerMultiplePrices1,
          back: [
            {
              liquidity: 2000,
              marketDepth: 0,
              price: 1.11,
            },
          ],
          lay: [
            {
              liquidity: 2000,
              marketDepth: 0,
              price: 1.11,
            },
          ],
        },
      ]);
    });

    describe("when the selector is called again with the same runners", () => {
      it("should return the same array of runners with best prices", () => {
        const { runnerMultiplePrices1 } = setup();
        const { runnersBestPrices } = setup({ runnerMultiplePrices1 });

        expect(runnersBestPrices).toStrictEqual([
          {
            ...runnerMultiplePrices1,
            back: [
              {
                liquidity: 2000,
                marketDepth: 0,
                price: 1.11,
              },
            ],
            lay: [
              {
                liquidity: 2000,
                marketDepth: 0,
                price: 1.11,
              },
            ],
          },
        ]);
      });
    });

    describe("when the selector is called again but a price has changed", () => {
      const { runnerMultiplePrices1, updatedBestRunner1 } = setup();
      const { runnersBestPrices } = setup({ updatedBestRunner1, runnerMultiplePrices1 });

      it("should return an updated array of runners", () => {
        expect(runnersBestPrices).toStrictEqual([
          {
            ...updatedBestRunner1,
            back: [
              {
                liquidity: 2001,
                marketDepth: 0,
                price: 1.99,
              },
            ],
            lay: [
              {
                liquidity: 2000,
                marketDepth: 0,
                price: 1.11,
              },
            ],
          },
          {
            ...runnerMultiplePrices1,
            back: [
              {
                liquidity: 2000,
                marketDepth: 0,
                price: 1.11,
              },
            ],
            lay: [
              {
                liquidity: 2000,
                marketDepth: 0,
                price: 1.11,
              },
            ],
          },
        ]);
      });
    });

    describe("when selector is called without prices", () => {
      const state = {
        entities: {
          exchangerunners: [
            {
              urn: "runner1",
              market: "marketUrn",
              selectionId: 98765,
            },
          ],
        },
      };

      const bestPrices = createRunnersBestPricesForExchangeMarketSelector();

      it("should return back and lay with price and liquidity as undefined", () => {
        expect(bestPrices(state.entities.exchangerunners, "marketUrn")).toStrictEqual([
          {
            urn: "runner1",
            market: "marketUrn",
            selectionId: 98765,
            back: [
              {
                liquidity: undefined,
                marketDepth: undefined,
                price: undefined,
              },
            ],
            lay: [
              {
                liquidity: undefined,
                marketDepth: undefined,
                price: undefined,
              },
            ],
          },
        ]);
      });
    });

    describe("when selector is called without prices (undefined value)", () => {
      const state = {
        entities: {
          exchangerunners: [
            {
              urn: "runner1",
              market: "marketUrn",
              selectionId: 98765,
              back: [],
              lay: [],
            },
          ],
        },
      };

      const bestPrices = createRunnersBestPricesForExchangeMarketSelector();

      it("should return back and lay with price and liquidity as undefined", () => {
        expect(bestPrices(state.entities.exchangerunners, "marketUrn")).toStrictEqual([
          {
            urn: "runner1",
            market: "marketUrn",
            selectionId: 98765,
            back: [
              {
                liquidity: undefined,
                marketDepth: undefined,
                price: undefined,
              },
            ],
            lay: [
              {
                liquidity: undefined,
                marketDepth: undefined,
                price: undefined,
              },
            ],
          },
        ]);
      });
    });

    describe("when selector is called without prices (empty value)", () => {
      const state = {
        entities: {
          exchangerunners: [
            {
              urn: "runner1",
              market: "marketUrn",
              selectionId: 98765,
              back: [{}],
              lay: [{}],
            },
          ],
        },
      };

      const bestPrices = createRunnersBestPricesForExchangeMarketSelector();

      it("should return back and lay with price and liquidity as undefined", () => {
        expect(bestPrices(state.entities.exchangerunners, "marketUrn")).toStrictEqual([
          {
            urn: "runner1",
            market: "marketUrn",
            selectionId: 98765,
            back: [
              {
                liquidity: undefined,
                marketDepth: undefined,
                price: undefined,
              },
            ],
            lay: [
              {
                liquidity: undefined,
                marketDepth: undefined,
                price: undefined,
              },
            ],
          },
        ]);
      });
    });
  });

  describe("createExchangeMarketsSelector", () => {
    it("should return the exchange markets", () => {
      const getExchangeMarkets = createExchangeMarketsSelector();
      const state = {
        entities: {
          exchangemarkets: {
            1234: { urn: "urn:1234" },
            4321: { urn: "urn:4321" },
            1111: { urn: "urn:1111" },
          },
          sportsbookmarkets: {
            1234: { urn: "urn:1234" },
            4321: { urn: "urn:4321" },
            1111: { urn: "urn:1111" },
          },
        },
      };
      expect(getExchangeMarkets(state)).toStrictEqual({
        1111: { urn: "urn:1111" },
        1234: { urn: "urn:1234" },
        4321: { urn: "urn:4321" },
      });
    });
  });

  describe("createExchangeMarketRunnerByMarketAndRunnerURNsSelector", () => {
    describe("when market is undefined", () => {
      it("should return undefined", () => {
        expect(createExchangeMarketRunnerByMarketAndRunnerURNsSelector()({}, {})).toBeUndefined();
      });
    });

    describe("when market is defined", () => {
      describe("and runner does not exist on that market", () => {
        it("should return undefined", () => {
          expect(
            createExchangeMarketRunnerByMarketAndRunnerURNsSelector()(stateMock, {
              marketURN: "ppb:excMarket:1.166528788",
              runnerURN: "non-existent runner",
            }),
          ).toBeUndefined();
        });
      });
      describe("and runner exists on that market", () => {
        it("should return the runner matching the provided runnerURN", () => {
          expect(
            createExchangeMarketRunnerByMarketAndRunnerURNsSelector()(stateMock, {
              marketURN: "ppb:excMarket:1.166528788",
              runnerURN: "ppb:excRunner:1.166528788/19/0",
            }),
          ).toEqual(stateMock["ppb:excMarket:1.166528788"].runners[0]);
        });
      });
    });
  });

  describe("createGetExchangeMarketByHierarchySelector", () => {
    const getExchangeMarketByHierarchy = createGetExchangeMarketByHierarchySelector();
    describe("when finds exchange market with same hierarchy", () => {
      it("should return the correct market", () => {
        isCompetitionEventHierarchy.mockReturnValue(true);
        const result = getExchangeMarketByHierarchy(exchangeMarketMock, {
          sporteventURN: sportevent,
          competitionURN: competition,
        });

        expect(result).toEqual({
          urn: "ppb:excMarket:1.166528788",
          sportevent: "ppb:event:22334455",
          name: "EXC Market 1",
          totalMatched: 6,
          hierarchy: {
            sportevent: "ppb:event:22334455",
            competition: "ppb:competition:11223344",
          },
          runners: [
            {
              urn: "ppb:excRunner:1.166528788/19/0",
              selection: 19,
              marketId: "1.166528788",
              name: "Some other Team A",
              handicap: 0,
            },
          ],
        });
      });
    });

    describe("when the selector is called again and the market hierarchy is the same", () => {
      isCompetitionEventHierarchy.mockReturnValue(true);
      const newState = exchangeMarketMock;
      const firstCallMarket = getExchangeMarketByHierarchy(exchangeMarketMock, {
        sporteventURN: sportevent,
        competitionURN: competition,
      });
      const secondCallMarket = getExchangeMarketByHierarchy(newState, {
        sporteventURN: sportevent,
        competitionURN: competition,
      });

      it("should return the same market", () => {
        expect(firstCallMarket === secondCallMarket).toBe(true);
      });
    });

    describe("when the selector is called twice with different inputs", () => {
      it("should execute one computation for each call", () => {
        isCompetitionEventHierarchy.mockReturnValue(true);
        const newStateMock = {
          "ppb:excMarket:1.456123": {
            urn: "ppb:excMarket:1.456123",
            sportevent: "ppb:event:987654",
            name: "EXC Market 3",
            totalMatched: 6,
            hierarchy: {
              sportevent: "ppb:event:987654",
              competition: "ppb:competition:789456",
            },
            runners: [
              {
                urn: "ppb:excRunner:1.166528788/19/0",
                selection: 19,
                marketId: "1.166528788",
                name: "Some other Team A",
                handicap: 0,
              },
            ],
          },
        };
        const firstExecution = getExchangeMarketByHierarchy(exchangeMarketMock, {
          sporteventURN: sportevent,
          competitionURN: competition,
        });
        const secondExecution = getExchangeMarketByHierarchy(newStateMock, {
          sporteventURN: "ppb:event:987654",
          competitionURN: "ppb:competition:789456",
        });
        expect(firstExecution === secondExecution).toBe(false);
      });
    });

    describe("when it doesn't find an sportsbook market with the same hierarchy", () => {
      it("should return undefined", () => {
        isCompetitionEventHierarchy.mockReturnValue(true);
        const result = getExchangeMarketByHierarchy(exchangeMarketMock, {
          sporteventURN: "sporteventURN",
          competitionURN: "competitionURN",
        });
        expect(result).toBeUndefined();
      });
    });

    describe("when hierarchy is not of type event or competition", () => {
      it("should return undefined", () => {
        isCompetitionEventHierarchy.mockReturnValue(false);
        const result = getExchangeMarketByHierarchy(exchangeMarketMock, {
          sporteventURN: "sporteventURN",
          competitionURN: "competitionURN",
        });
        expect(result).toBeUndefined();
      });
    });
  });
});
