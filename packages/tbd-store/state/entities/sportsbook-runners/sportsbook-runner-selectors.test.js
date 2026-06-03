import {
  createSportsbookRunnerByURNSelector,
  createSportsbookRunnerOddsByURNSelector,
  createSportsbookRunnerStatusSelector,
  createSportsbookRunnerWithBettingLegStateByURNSelector,
} from "./sportsbook-runner-selectors";
import { isLegInState } from "../sportsbook-markets/sportsbook-market-selectors";

jest.mock("./sportsbook-runners-reducer");
jest.mock("../sportsbook-markets/sportsbook-market-selectors");

const getSportsbookMarketByURNSelector = jest.fn();
jest.mock("../sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarketByURN: jest.fn(),
  createSportsbookMarketByURNSelector: jest.fn(() => getSportsbookMarketByURNSelector),
  isLegInState: jest.fn(),
}));

const stateMock = {
  "ppb:sbkRunner:924.123456789/123": {
    urn: "ppb:sbkRunner:924.123456789/123",
    market: "ppb:sbkMarket:924.123456789",
    selectionId: 123,
    status: "ACTIVE",
    odds: {
      decimal: 5,
      fractional: {
        numerator: 10,
        denominator: 2,
      },
    },
    previousOdds: undefined,
    trueOdds: {
      decimal: 5,
      fractional: {
        numerator: 10,
        denominator: 2,
      },
    },
    eachWayOdds: {
      trueOdds: {
        decimal: 5,
        fractional: {
          numerator: 10,
          denominator: 2,
        },
      },
    },
  },
};

describe("Sportsbook Runners Selectors", () => {
  describe("createSportsbookRunnerOddsByURNSelector", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const getSportsbookRunnerOddsByURN = createSportsbookRunnerOddsByURNSelector();

    it("should return an odds object when receiving an URN for an existing runner", () => {
      const selector = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      expect(selector).toEqual({
        odds: {
          decimal: 5,
          fractional: {
            numerator: 10,
            denominator: 2,
          },
        },
        trueOdds: {
          decimal: 5,
          fractional: {
            numerator: 10,
            denominator: 2,
          },
        },
        eachWayOdds: {
          trueOdds: {
            decimal: 5,
            fractional: {
              numerator: 10,
              denominator: 2,
            },
          },
        },
      });
    });

    // all variations of hasMaintainedAllSportsbookRunnerOdds
    describe("when the selector is called again and the runner has changed", () => {
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(undefined);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner odds have not changed", () => {
      const newStateMock = { ...stateMock["ppb:sbkRunner:924.123456789/123"] };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should return the same runner", () => {
        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when the selector is called again and the runner odds are undefined", () => {
      const newStateMock = {
        urn: "ppb:sbkRunner:924.123456789/123",
        market: "ppb:sbkMarket:924.123456789",
        selectionId: 123,
        status: "ACTIVE",
        odds: undefined,
        previousOdds: undefined,
        trueOdds: undefined,
        eachWayOdds: undefined,
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should return the same runner", () => {
        expect(firstCall === secondCall).toBe(true);
      });
    });

    // odds
    describe("when the selector is called again and the runner odds decimal have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        odds: {
          decimal: 1,
          fractional: {
            numerator: 10,
            denominator: 2,
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner odds fractional is undefined", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        odds: {
          decimal: 5,
          fractional: undefined,
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner odds fractional numerator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        odds: {
          decimal: 5,
          fractional: {
            numerator: 1,
            denominator: 2,
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner odds fractional denominator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        odds: {
          decimal: 5,
          fractional: {
            numerator: 10,
            denominator: 1,
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    // previous odds
    describe("when the selector is called again and the runner previous odds did not change", () => {
      const previousOddsMock = [
        {
          decimal: 5,
          fractional: {
            numerator: 10,
            denominator: 2,
          },
        },
      ];

      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: previousOddsMock,
      };
      const firstCall = getSportsbookRunnerOddsByURN({
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: previousOddsMock,
      });
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should return the same runner", () => {
        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when the selector is called again and the runner previous odds have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: [
          {
            decimal: 1,
            fractional: {
              numerator: 11,
              denominator: 111,
            },
          },
        ],
      };
      const firstCall = getSportsbookRunnerOddsByURN({
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: [
          {
            decimal: 2,
            fractional: {
              numerator: 22,
              denominator: 222,
            },
          },
        ],
      });
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner gained previousOdds", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: [
          {
            decimal: 1,
            fractional: {
              numerator: 11,
              denominator: 111,
            },
          },
        ],
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner lost previousOdds", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
      };
      const firstCall = getSportsbookRunnerOddsByURN({
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: [
          {
            decimal: 1,
            fractional: {
              numerator: 11,
              denominator: 111,
            },
          },
        ],
      });
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner previous odds fractional is undefined", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: [
          {
            decimal: 5,
            fractional: undefined,
          },
        ],
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner previous odds fractional numerator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: [
          {
            decimal: 5,
            fractional: {
              numerator: 1,
              denominator: 2,
            },
          },
        ],
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner previous odds fractional denominator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        previousOdds: [
          {
            decimal: 5,
            fractional: {
              numerator: 10,
              denominator: 1,
            },
          },
        ],
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    // true odds
    describe("when the selector is called again and the runner true odds have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        trueOdds: {
          decimal: 50,
          fractional: {
            numerator: 10,
            denominator: 2,
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner true odds fractional is undefined", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        trueOdds: {
          decimal: 5,
          fractional: undefined,
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner true odds fractional numerator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        trueOdds: {
          decimal: 5,
          fractional: {
            numerator: 1,
            denominator: 2,
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner true odds fractional denominator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        trueOdds: {
          decimal: 5,
          fractional: {
            numerator: 10,
            denominator: 1,
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    // each way odds
    describe("when the selector is called again and the runner each way odds have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        eachWayOdds: {
          trueOdds: {
            decimal: 50,
            fractional: {
              numerator: 10,
              denominator: 2,
            },
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner each way fractional is undefined", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        eachWayOdds: {
          trueOdds: {
            decimal: 5,
            fractional: undefined,
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner each way fractional numerator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        eachWayOdds: {
          trueOdds: {
            decimal: 5,
            fractional: {
              numerator: 1,
              denominator: 2,
            },
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and the runner each way fractional denominator have changed", () => {
      const newStateMock = {
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        eachWayOdds: {
          trueOdds: {
            decimal: 5,
            fractional: {
              numerator: 10,
              denominator: 1,
            },
          },
        },
      };
      const firstCall = getSportsbookRunnerOddsByURN(stateMock["ppb:sbkRunner:924.123456789/123"]);
      const secondCall = getSportsbookRunnerOddsByURN(newStateMock);

      it("should not return the same runner", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });
  });

  describe("createSportsbookRunnerByURNSelector", () => {
    const getSportsbookRunnerByURNSelector = createSportsbookRunnerByURNSelector();

    it("should return undefined when receiving an URN for a non-existing runner", () => {
      const selector = getSportsbookRunnerByURNSelector(stateMock, "URN");
      expect(selector).toBe(undefined);
    });

    it("should return the matching sportsbook runner for the given URN", () => {
      const selector = getSportsbookRunnerByURNSelector(stateMock, "ppb:sbkRunner:924.123456789/123");
      expect(selector).toEqual({
        urn: "ppb:sbkRunner:924.123456789/123",
        market: "ppb:sbkMarket:924.123456789",
        selectionId: 123,
        status: "ACTIVE",
        odds: {
          decimal: 5,
          fractional: {
            numerator: 10,
            denominator: 2,
          },
        },
        previousOdds: undefined,
        trueOdds: {
          decimal: 5,
          fractional: {
            numerator: 10,
            denominator: 2,
          },
        },
        eachWayOdds: {
          trueOdds: {
            decimal: 5,
            fractional: {
              numerator: 10,
              denominator: 2,
            },
          },
        },
      });
    });

    describe("when the selector is called again and the runner has not changed", () => {
      it("should return the same runner", () => {
        const newStateMock = { ...stateMock };
        const firstCall = getSportsbookRunnerByURNSelector(stateMock, "ppb:sbkRunner:924.123456789/123");
        const secondCall = getSportsbookRunnerByURNSelector(newStateMock, "ppb:sbkRunner:924.123456789/123");

        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when the selector is called again and the runner has changed", () => {
      it("should return the same runner", () => {
        const newStateMock = {
          "ppb:sbkRunner:924.123456789/123": {
            urn: "ppb:sbkRunner:924.123456789/123",
            market: "ppb:sbkMarket:924.123456789",
            selectionId: 123,
            status: "REMOVED",
            odds: {
              decimal: 5,
              fractional: {
                numerator: 10,
                denominator: 2,
              },
            },
            previousOdds: [
              {
                decimal: 5,
                fractional: {
                  numerator: 10,
                  denominator: 2,
                },
              },
            ],
            trueOdds: {
              decimal: 5,
              fractional: {
                numerator: 10,
                denominator: 2,
              },
            },
            eachWayOdds: {
              trueOdds: {
                decimal: 5,
                fractional: {
                  numerator: 10,
                  denominator: 2,
                },
              },
            },
          },
        };
        const firstCall = getSportsbookRunnerByURNSelector(stateMock, "ppb:sbkRunner:924.123456789/123");
        const secondCall = getSportsbookRunnerByURNSelector(newStateMock, "ppb:sbkRunner:924.123456789/123");

        expect(firstCall === secondCall).toBe(false);
      });
    });
  });

  describe("createSportsbookRunnerWithBettingLegStateByURNSelector", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const state = {
      entities: {
        sportsbookrunners: stateMock,
        sportsbookmarkets: {
          "ppb:sbkMarket:924.123456789": {
            hierarchy: { competition: "competitionUrn", sportevent: "eventUrn" },
            bspMarket: false,
          },
        },
      },
      betting: {
        sportsbookBetting: {},
      },
    };

    isLegInState.mockReturnValue(false);

    it("should return a sportsbookrunner object plus isPotentialBet and isStartingPrice data when receiving an URN for an existing runner", () => {
      const getSportsbookRunnerWithBettingLegStateByURN = createSportsbookRunnerWithBettingLegStateByURNSelector();
      getSportsbookMarketByURNSelector.mockReturnValue(state.entities.sportsbookmarkets["ppb:sbkMarket:924.123456789"]);

      const selector = getSportsbookRunnerWithBettingLegStateByURN(state, {
        marketUrn: "ppb:sbkMarket:924.123456789",
        runnerUrn: "ppb:sbkRunner:924.123456789/123",
      });
      expect(selector).toEqual({
        ...stateMock["ppb:sbkRunner:924.123456789/123"],
        isPotentialBet: false,
        isStartingPrice: false,
      });
    });

    it("should return with isStartingPrice as true if it's a race market, it's a bspMarket and the runner is active", () => {
      const marketMock = {
        ...state.entities.sportsbookmarkets["ppb:sbkMarket:924.123456789"],
        hierarchy: { race: "raceUrn", meeting: "meetingUrn" },
        bspMarket: true,
      };
      getSportsbookMarketByURNSelector.mockReturnValue(marketMock);

      const getSportsbookRunnerWithBettingLegStateByURN = createSportsbookRunnerWithBettingLegStateByURNSelector();

      const selector = getSportsbookRunnerWithBettingLegStateByURN(state, {
        marketUrn: "ppb:sbkMarket:924.123456789",
        runnerUrn: "ppb:sbkRunner:924.123456789/123",
      });
      expect(selector.isStartingPrice).toEqual(true);
    });

    it("should return with isPotentialBet as true if leg in state", () => {
      isLegInState.mockReturnValue(true);
      const getSportsbookRunnerWithBettingLegStateByURN = createSportsbookRunnerWithBettingLegStateByURNSelector();
      getSportsbookMarketByURNSelector.mockReturnValue(state.entities.sportsbookmarkets["ppb:sbkMarket:924.123456789"]);

      const selector = getSportsbookRunnerWithBettingLegStateByURN(state, {
        marketUrn: "ppb:sbkMarket:924.123456789",
        runnerUrn: "ppb:sbkRunner:924.123456789/123",
      });
      expect(selector.isPotentialBet).toEqual(true);
    });

    it("should return undefined if sportsbookMarket is undefined", () => {
      const getSportsbookRunnerWithBettingLegStateByURN = createSportsbookRunnerWithBettingLegStateByURNSelector();
      getSportsbookMarketByURNSelector.mockReturnValue(undefined);

      const selector = getSportsbookRunnerWithBettingLegStateByURN(state, {
        marketUrn: "ppb:sbkMarket:924.123456789",
        runnerUrn: "ppb:sbkRunner:924.123456789/123",
      });
      expect(selector).toEqual(undefined);
    });

    it("should return undefined if sportsbookrunner is undefined", () => {
      const getSportsbookRunnerWithBettingLegStateByURN = createSportsbookRunnerWithBettingLegStateByURNSelector();
      getSportsbookMarketByURNSelector.mockReturnValue(state.entities.sportsbookmarkets["ppb:sbkMarket:924.123456789"]);

      const selector = getSportsbookRunnerWithBettingLegStateByURN(
        {
          ...state,
          entities: {
            ...state.entities,
            sportsbookrunners: {},
          },
        },
        {
          marketUrn: "ppb:sbkMarket:924.123456789",
          runnerUrn: "ppb:sbkRunner:924.123456789/123",
        },
      );
      expect(selector).toEqual(undefined);
    });
  });

  describe("createSportsbookRunnerStatusSelector", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("must return the runner status when runner exists", () => {
      const getSportsbookRunnerStatus = createSportsbookRunnerStatusSelector();
      const runnerStatus = getSportsbookRunnerStatus(stateMock, "ppb:sbkRunner:924.123456789/123");

      expect(runnerStatus).toEqual("ACTIVE");
    });

    it("must return undefined when runner doesn't exists", () => {
      const getSportsbookRunnerStatus = createSportsbookRunnerStatusSelector();
      const runnerStatus = getSportsbookRunnerStatus(stateMock, "ppb:sbkRunner:missing");

      expect(runnerStatus).toEqual(undefined);
    });

    describe("when the selector is called twice with the same input", () => {
      it("should only execute one computation", () => {
        const firstExecution = createSportsbookRunnerStatusSelector()(stateMock, "ppb:sbkRunner:924.123456789/123");
        const secondExecution = createSportsbookRunnerStatusSelector()(stateMock, "ppb:sbkRunner:924.123456789/123");
        expect(firstExecution === secondExecution).toBe(true);
      });
    });
    describe("when the selector is called twice with different inputs", () => {
      it("should execute one computation for each call", () => {
        const newStateMock = {
          "ppb:sbkRunner:924.123456789/123": {
            urn: "ppb:sbkRunner:924.123456789/123",
            market: "ppb:sbkMarket:924.123456789",
            selectionId: 123,
            status: "REMOVED",
            odds: {
              decimal: 5,
              fractional: {
                numerator: 10,
                denominator: 2,
              },
            },
            previousOdds: [
              {
                decimal: 5,
                fractional: {
                  numerator: 10,
                  denominator: 2,
                },
              },
            ],
            trueOdds: {
              decimal: 5,
              fractional: {
                numerator: 10,
                denominator: 2,
              },
            },
            eachWayOdds: {
              trueOdds: {
                decimal: 5,
                fractional: {
                  numerator: 10,
                  denominator: 2,
                },
              },
            },
          },
        };
        const firstExecution = createSportsbookRunnerStatusSelector()(stateMock, "ppb:sbkRunner:924.123456789/123");
        const secondExecution = createSportsbookRunnerStatusSelector()(newStateMock, "ppb:sbkRunner:924.123456789/123");
        expect(firstExecution === secondExecution).toBe(false);
      });
    });
  });
});
