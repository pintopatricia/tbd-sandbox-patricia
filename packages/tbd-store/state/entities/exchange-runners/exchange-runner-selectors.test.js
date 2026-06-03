import { ExchangeSide } from "../../constants";
import {
  getExchangeRunnerByURN,
  getExchangeRunnerTradedByURN,
  createGetExchangeRunnerTradedByURN,
  createExchangeRunnerOddsByURNSelector,
  createExchangeRunnerWithoutOddsByRunnerURNSelector,
} from "./exchange-runner-selectors";

describe("getExchangeRunnerByURN", () => {
  const exchangeRunnersState = {
    "ppb:excRunner:1.166528790/20/0": {},
    "ppb:excRunner:1.166528788/19/0": {
      urn: "ppb:excRunner:1.166528788/19/0",
      market: "1.166528788",
      selectionId: 19,
      back: [{ odd: 1, liquidity: 7 }],
      lay: [{ odd: 1.8, liquidity: 60 }],
    },
  };

  it("must return undefined when receiving an URN for a non-existing runner", () => {
    const exchangeRunner = getExchangeRunnerByURN(exchangeRunnersState, "RANDOM_URN");
    expect(exchangeRunner).toBe(undefined);
  });

  it("must return an exchange runner when receiving an URN for an existing runner", () => {
    const exchangeRunner = getExchangeRunnerByURN(exchangeRunnersState, "ppb:excRunner:1.166528788/19/0");
    expect(exchangeRunner).toEqual(exchangeRunnersState["ppb:excRunner:1.166528788/19/0"]);
  });
});

describe("ExchangeRunnerTraded", () => {
  const exchangeRunnersTradedState = {
    "ppb:excRunner:1.166528790/20/0": {},
    "ppb:excRunner:1.166528788/19/0": {
      urn: "ppb:excRunner:1.166528788/19/0",
      market: "1.166528788",
      selectionId: 19,
      back: [{ odd: 1, liquidity: 7 }],
      lay: [{ odd: 1.8, liquidity: 60 }],
      traded: [{ odd: 1.8, liquidity: 60 }],
    },
  };
  describe("getExchangeRunnerTradedByURN", () => {
    it("must return undefined when receiving an URN for a non-existing runner", () => {
      const exchangeRunnerTraded = getExchangeRunnerTradedByURN(exchangeRunnersTradedState, "RANDOM_URN");
      expect(exchangeRunnerTraded).toBe(undefined);
    });

    it("must return an exchange runner when receiving an URN for an existing runner", () => {
      const exchangeRunnerTraded = getExchangeRunnerTradedByURN(
        exchangeRunnersTradedState,
        "ppb:excRunner:1.166528788/19/0",
      );
      expect(exchangeRunnerTraded).toEqual(exchangeRunnersTradedState["ppb:excRunner:1.166528788/19/0"]);
    });
  });

  describe("createGetExchangeRunnerTradedByURN", () => {
    const exchangeRunnerTradedByURN = {
      urn: "ppb:excRunner:1.166528788/19/0",
      market: "1.166528788",
      selectionId: 19,
      traded: [
        {
          liquidity: 60,
          odd: 1.8,
        },
      ],
      back: [{ odd: 1, liquidity: 7 }],
      lay: [{ odd: 1.8, liquidity: 60 }],
    };

    it("must return undefined if the URN does not match an existing runner", () => {
      const exchangeRunnerTraded = createGetExchangeRunnerTradedByURN()(exchangeRunnersTradedState, "RANDOM_URN");
      expect(exchangeRunnerTraded).toBe(undefined);
    });

    it("must return the correct runner if the URN matches an existing runner", () => {
      const exchangeRunnerTraded = createGetExchangeRunnerTradedByURN()(
        exchangeRunnersTradedState,
        "ppb:excRunner:1.166528788/19/0",
      );
      expect(exchangeRunnerTraded).toEqual(exchangeRunnerTradedByURN);
    });
  });
});

describe("createExchangeRunnerOddsByURNSelector", () => {
  describe("when some data is undefined", () => {
    it("should return undefined", () => {
      expect(createExchangeRunnerOddsByURNSelector()({}, { urn: 1 })).toBeUndefined();
    });
  });
  describe("when there are runners", () => {
    describe("when no side is set", () => {
      describe("and side data exists", () => {
        describe("and best odds are not requested", () => {
          const stateSlice = {
            "ppb:excRunner:1.166528790/20/0": {},
            "ppb:excRunner:1.166528788/19/0": {
              urn: "ppb:excRunner:1.166528788/19/0",
              market: "1.166528788",
              selectionId: 19,
              back: [
                { odd: 1, liquidity: 7 },
                { odd: 2, liquidity: 8 },
              ],
              lay: [
                { odd: 1.8, liquidity: 60 },
                { odd: 0.8, liquidity: 6 },
              ],
            },
          };
          it("should return all runner info and all odds for both sides", () => {
            expect(
              createExchangeRunnerOddsByURNSelector()(stateSlice, {
                urn: "ppb:excRunner:1.166528788/19/0",
                bestOdds: false,
                side: undefined,
              }),
            ).toEqual(stateSlice["ppb:excRunner:1.166528788/19/0"]);
          });
        });
        describe("and best odds are requested", () => {
          const stateSlice = {
            "ppb:excRunner:1.166528790/20/0": {},
            "ppb:excRunner:1.166528788/19/0": {
              urn: "ppb:excRunner:1.166528788/19/0",
              market: "1.166528788",
              selectionId: 19,
              back: [
                { odd: 1, liquidity: 7 },
                { odd: 2, liquidity: 8 },
              ],
              lay: [
                { odd: 1.8, liquidity: 60 },
                { odd: 0.8, liquidity: 6 },
              ],
            },
          };
          it("should return all runner info but only the first odd for both sides", () => {
            expect(
              createExchangeRunnerOddsByURNSelector()(stateSlice, {
                urn: "ppb:excRunner:1.166528788/19/0",
                bestOdds: true,
                side: undefined,
              }),
            ).toEqual({
              urn: "ppb:excRunner:1.166528788/19/0",
              market: "1.166528788",
              selectionId: 19,
              back: [{ odd: 1, liquidity: 7 }],
              lay: [{ odd: 1.8, liquidity: 60 }],
            });
          });
        });
      });
      describe("and at least onde side is undefined", () => {
        describe("and best odds are not requested", () => {
          const stateSlice = {
            "ppb:excRunner:1.166528790/20/0": {},
            "ppb:excRunner:1.166528788/19/0": {
              urn: "ppb:excRunner:1.166528788/19/0",
              market: "1.166528788",
              selectionId: 19,
              back: [],
              lay: [
                { odd: 1.8, liquidity: 60 },
                { odd: 0.8, liquidity: 6 },
              ],
            },
          };
          it("should return all runner info and all odds for both sides", () => {
            expect(
              createExchangeRunnerOddsByURNSelector()(stateSlice, {
                urn: "ppb:excRunner:1.166528788/19/0",
                bestOdds: false,
                side: undefined,
              }),
            ).toEqual(stateSlice["ppb:excRunner:1.166528788/19/0"]);
          });
        });
        describe("and best odds are requested", () => {
          const stateSlice = {
            "ppb:excRunner:1.166528790/20/0": {},
            "ppb:excRunner:1.166528788/19/0": {
              urn: "ppb:excRunner:1.166528788/19/0",
              market: "1.166528788",
              selectionId: 19,
              back: [
                { odd: 1, liquidity: 7 },
                { odd: 2, liquidity: 8 },
              ],
              lay: [],
            },
          };
          it("should return all runner info but only the first odd for both sides", () => {
            expect(
              createExchangeRunnerOddsByURNSelector()(stateSlice, {
                urn: "ppb:excRunner:1.166528788/19/0",
                bestOdds: true,
                side: undefined,
              }),
            ).toEqual({
              urn: "ppb:excRunner:1.166528788/19/0",
              market: "1.166528788",
              selectionId: 19,
              back: [{ odd: 1, liquidity: 7 }],
              lay: [undefined],
            });
          });
        });
      });
    });
    describe("when side is 'Back'", () => {
      describe("and data exists", () => {
        const stateSlice = {
          "ppb:excRunner:1.166528790/20/0": {},
          "ppb:excRunner:1.166528788/19/0": {
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [
              { odd: 1, liquidity: 7 },
              { odd: 2, liquidity: 8 },
            ],
            lay: [
              { odd: 1.8, liquidity: 60 },
              { odd: 0.8, liquidity: 6 },
            ],
          },
        };
        it("should return all runner info but only the first odd for that side", () => {
          expect(
            createExchangeRunnerOddsByURNSelector()(stateSlice, {
              urn: "ppb:excRunner:1.166528788/19/0",
              bestOdds: true,
              side: ExchangeSide.BACK,
            }),
          ).toEqual({
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [{ odd: 1, liquidity: 7 }],
            lay: [],
          });
        });
      });
      describe("and data is undefined", () => {
        const stateSlice = {
          "ppb:excRunner:1.166528790/20/0": {},
          "ppb:excRunner:1.166528788/19/0": {
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [],
            lay: [{ odd: 1.8, liquidity: 60 }],
          },
        };
        it("should return all runner info but only the first odd for that side", () => {
          expect(
            createExchangeRunnerOddsByURNSelector()(stateSlice, {
              urn: "ppb:excRunner:1.166528788/19/0",
              bestOdds: true,
              side: ExchangeSide.BACK,
            }),
          ).toEqual({
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [undefined],
            lay: [],
          });
        });
      });
    });
    describe("when side is 'Lay'", () => {
      describe("and data exists", () => {
        const stateSlice = {
          "ppb:excRunner:1.166528790/20/0": {},
          "ppb:excRunner:1.166528788/19/0": {
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [
              { odd: 1, liquidity: 7 },
              { odd: 2, liquidity: 8 },
            ],
            lay: [
              { odd: 1.8, liquidity: 60 },
              { odd: 0.8, liquidity: 6 },
            ],
          },
        };
        it("should return all runner info but only the first odd for that side", () => {
          expect(
            createExchangeRunnerOddsByURNSelector()(stateSlice, {
              urn: "ppb:excRunner:1.166528788/19/0",
              bestOdds: true,
              side: ExchangeSide.LAY,
            }),
          ).toEqual({
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [],
            lay: [{ odd: 1.8, liquidity: 60 }],
          });
        });
      });
      describe("and data is undefined", () => {
        const stateSlice = {
          "ppb:excRunner:1.166528790/20/0": {},
          "ppb:excRunner:1.166528788/19/0": {
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [],
            lay: [],
          },
        };
        it("should return all runner info but only the first odd for that side", () => {
          expect(
            createExchangeRunnerOddsByURNSelector()(stateSlice, {
              urn: "ppb:excRunner:1.166528788/19/0",
              bestOdds: true,
              side: ExchangeSide.LAY,
            }),
          ).toEqual({
            urn: "ppb:excRunner:1.166528788/19/0",
            market: "1.166528788",
            selectionId: 19,
            back: [],
            lay: [undefined],
          });
        });
      });
    });
  });
});

describe("createExchangeRunnerWithoutOddsByRunnerURNSelector", () => {
  let state = {
    entities: {
      exchangerunners: {
        "ppb:excrunner:123": {
          urn: "ppb:excrunner:123",
          reduction: 1.2,
          date: "date",
          status: "ACTIVE",
          market: "ppb:excmarket:123",
          selectionId: 1,
          handicap: 0,
          back: [{}, {}],
          lay: [],
        },
        "ppb:excrunner:321": {
          urn: "ppb:excrunner:321",
          reduction: 1.2,
          date: "date",
          status: "ACTIVE",
          market: "ppb:excmarket:123",
          selectionId: 1,
          handicap: 0,
          back: [{}, {}],
          lay: [],
        },
      },
    },
  };
  let getExchangeRunnerWithoutOddsByRunnerURN;

  beforeEach(() => {
    getExchangeRunnerWithoutOddsByRunnerURN = createExchangeRunnerWithoutOddsByRunnerURNSelector();
  });

  describe("given a runner URN for a non-existing runner", () => {
    it("should return undefined", () => {
      const runner = getExchangeRunnerWithoutOddsByRunnerURN(state.entities.exchangerunners, "non-existing-urn");
      expect(runner).toBe(undefined);
    });
  });

  describe("given a runner URN for an existing runner", () => {
    it("should return the runner without odds", () => {
      const runner = getExchangeRunnerWithoutOddsByRunnerURN(state.entities.exchangerunners, "ppb:excrunner:123");
      expect(runner).toEqual({
        urn: "ppb:excrunner:123",
        reduction: 1.2,
        date: "date",
        status: "ACTIVE",
        market: "ppb:excmarket:123",
        selectionId: 1,
        handicap: 0,
      });
    });
  });

  describe("when called multiple times, with different params", () => {
    it("should return different objects", () => {
      const runner1 = getExchangeRunnerWithoutOddsByRunnerURN(state.entities.exchangerunners, "ppb:excrunner:123");

      // state update to simulate rewrites of obj refs
      state = {
        ...state,
        entities: {
          exchangerunners: { ...state.entities.exchangerunners },
        },
      };

      const runner2 = getExchangeRunnerWithoutOddsByRunnerURN(state.entities.exchangerunners, "ppb:excrunner:321");

      expect(runner1).not.toBe(runner2);
    });
  });

  describe("when called multiple times, with the same params", () => {
    it("should keep the same object reference", () => {
      const runner1 = getExchangeRunnerWithoutOddsByRunnerURN(state.entities.exchangerunners, "ppb:excrunner:123");

      // state update to simulate rewrites of obj refs
      state = {
        ...state,
        entities: {
          exchangerunners: { ...state.entities.exchangerunners },
        },
      };

      const runner2 = getExchangeRunnerWithoutOddsByRunnerURN(state.entities.exchangerunners, "ppb:excrunner:123");

      expect(runner1).toBe(runner2);
    });
  });
});
