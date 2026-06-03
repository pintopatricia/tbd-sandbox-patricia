import {
  getSportsbookMarketByURN,
  getSportsbookMarketRunnerByURN,
  getSportsbookMarketById,
  getSportsbookMarketRunnerById,
  getSportsbookMarkets,
  createSportsbookMarketByURNSelector,
  createSportsbookMarketSelector,
  getSportsbookMarket,
  createSportsbookMarketRunnerByRunnerAndMarketURNSelector,
  createGetSportsbookMarketByHierarchySelector,
} from "./sportsbook-market-selectors";
import { isCompetitionEventHierarchy } from "../../../helpers/markets";

jest.mock("../../../helpers/markets", () => ({
  isCompetitionEventHierarchy: jest.fn(),
}));

const sportevent = "ppb:event:22334455";
const competition = "ppb:competition:11223344";

const sportsbookMarketMock = {
  "ppb:sbkMarket:1.166528788": {
    urn: "ppb:sbkMarket:1.166528788",
    sportevent: "ppb:event:22334455",
    name: "SBK Market 1",
    totalMatched: 6,
    hierarchy: {
      sportevent,
      competition,
    },
    runners: [
      {
        urn: "ppb:sbkRunner:1.166528788/19/0",
        selection: 19,
        marketId: "1.166528788",
        name: "Some other Team A",
        handicap: 0,
      },
    ],
  },
  "ppb:sbkMarket:1.12345678": {
    urn: "ppb:sbkMarket:1.12345678",
    sportevent: "ppb:event:55443322",
    name: "SBK Market 1",
    totalMatched: 6,
    hierarchy: {
      sportevent: "ppb:event:55443322",
      competition: "ppb:competition:99887766",
    },
    runners: [
      {
        urn: "ppb:sbkRunner:1.166528788/19/0",
        selection: 19,
        marketId: "1.166528788",
        name: "Some other Team A",
        handicap: 0,
      },
    ],
  },
};

const stateMock = {
  "ppb:sbkMarket:1.166528788": {
    urn: "ppb:sbkMarket:1.166528788",
    sportevent: "ppb:event:22334455",
    name: "EXC Market 1",
    marketId: "1.166528788",
    runners: [
      {
        urn: "ppb:sbkRunner:1.166528788/19",
        selectionId: 19,
        name: "Some other Team A",
        handicap: 0,
      },
    ],
  },
};

describe('"sportsbookmarkets" selectors', () => {
  describe("getSportsbookMarkets selector", () => {
    it("must return undefined when receiving an URN for a non-existing market", () => {
      const markets = getSportsbookMarkets("RANDOM_URN");
      expect(markets).toBe(undefined);
    });

    it("must return all available markets", () => {
      const state = {
        entities: {
          sportsbookmarkets: stateMock,
        },
      };
      const markets = getSportsbookMarkets(state);
      expect(markets).toEqual(stateMock);
    });
  });

  describe("getSportsbookMarketByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing market", () => {
      const market = getSportsbookMarketByURN("RANDOM_URN");
      expect(market).toBe(undefined);
    });

    it("must return an sportsbook market when receiving an URN for an existing market", () => {
      const market = getSportsbookMarketByURN(stateMock, "ppb:sbkMarket:1.166528788");
      expect(market).toEqual(stateMock["ppb:sbkMarket:1.166528788"]);
    });
  });

  describe("getSportsbookMarketById selector", () => {
    it("must return undefined when receiving an id for a non-existing market", () => {
      const market = getSportsbookMarketById({}, 123);
      expect(market).toBe(undefined);
    });

    it("must return an sportsbook market when receiving an id for an existing market", () => {
      const market = getSportsbookMarketById(stateMock, "1.166528788");
      expect(market).toEqual(stateMock["ppb:sbkMarket:1.166528788"]);
    });
  });

  describe("getSportsbookMarketRunnerByURN selector", () => {
    it("must return undefined when there are no runners", () => {
      const marketRunner = getSportsbookMarketRunnerByURN({ runners: [] }, "dummy:urn");

      expect(marketRunner).toBe(undefined);
    });

    it("must return an sportsbook market runner when receiving an URN for an existing runner", () => {
      const runner = { urn: "dummy:urn" };
      const marketRunner = getSportsbookMarketRunnerByURN({ runners: [runner] }, "dummy:urn");

      expect(marketRunner).toEqual(runner);
    });
  });

  describe("getSportsbookMarketRunnerById selector", () => {
    it("must return undefined when there are no runners found", () => {
      const marketRunner = getSportsbookMarketRunnerById([], 123);

      expect(marketRunner).toBe(undefined);
    });

    it("must return an sportsbook market runner when receiving an URN for an existing runner", () => {
      const runner = { selectionId: 19 };
      const marketRunner = getSportsbookMarketRunnerById([runner], 19);

      expect(marketRunner).toEqual(runner);
    });
  });

  describe("createSportsbookMarketByURNSelector", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const getSportsbookMarketByURNSelector = createSportsbookMarketByURNSelector();

    it("should return undefined when receiving an URN for a non-existing market", () => {
      const market = getSportsbookMarketByURNSelector(stateMock, "URN");
      expect(market).toBe(undefined);
    });

    it("should return the matching sportsbook market for the given URN", () => {
      const market = getSportsbookMarketByURNSelector(stateMock, "ppb:sbkMarket:1.166528788");
      expect(market).toEqual({
        urn: "ppb:sbkMarket:1.166528788",
        sportevent: "ppb:event:22334455",
        name: "EXC Market 1",
        marketId: "1.166528788",
        runners: [
          {
            urn: "ppb:sbkRunner:1.166528788/19",
            selectionId: 19,
            name: "Some other Team A",
            handicap: 0,
          },
        ],
      });
    });

    describe("when the selector is called again and the market has not changed", () => {
      const state = { "ppb:sbkMarket:1.166528788": { status: "OPEN" } };
      const newStateMock = { "ppb:sbkMarket:1.166528788": { status: "OPEN" } };
      const firstCallMarket = getSportsbookMarketByURNSelector(state, "ppb:sbkMarket:1.166528788");
      const secondCallMarket = getSportsbookMarketByURNSelector(newStateMock, "ppb:sbkMarket:1.166528788");

      it("should return the same market", () => {
        expect(firstCallMarket === secondCallMarket).toBe(true);
      });
    });

    describe("when the selector is called again but the market has changed", () => {
      const state = { "ppb:sbkMarket:1.166528788": { status: "OPEN" } };
      const newStateMock = { "ppb:sbkMarket:1.166528788": { status: "CLOSED" } };
      const firstCallMarket = getSportsbookMarketByURNSelector(state, "ppb:sbkMarket:1.166528788");
      const secondCallMarket = getSportsbookMarketByURNSelector(newStateMock, "ppb:sbkMarket:1.166528788");

      it("should return a different market object", () => {
        expect(firstCallMarket === secondCallMarket).toBe(false);
      });
    });
  });

  describe("getSportsbookMarket", () => {
    it("should return the market", () => {
      const marketUrn = "12345";
      const state = { entities: { sportsbookmarkets: { [marketUrn]: "fakeMarket" } } };
      expect(getSportsbookMarket(state, marketUrn)).toBe("fakeMarket");
    });
  });

  describe("createSportsbookMarketSelector", () => {
    const getSportsbookMarketSelector = createSportsbookMarketSelector();
    const marketUrn = "12345";
    const state = { entities: { sportsbookmarkets: { [marketUrn]: { status: "OPEN" } } } };

    it("should return the correct market", () => {
      expect(getSportsbookMarketSelector(state, marketUrn)).toStrictEqual({ status: "OPEN" });
    });

    describe("when the selector is called again and the market status didnt change", () => {
      const newState = { entities: { sportsbookmarkets: { [marketUrn]: { status: "OPEN" } } } };
      const firstCallMarket = getSportsbookMarketSelector(state, marketUrn);
      const secondCallMarket = getSportsbookMarketSelector(newState, marketUrn);

      it("should return the same market", () => {
        expect(firstCallMarket === secondCallMarket).toBe(true);
      });
    });

    describe("when the selector is called again but the market status has changed", () => {
      const newState = { entities: { sportsbookmarkets: { [marketUrn]: { status: "CLOSED" } } } };
      const firstCallMarket = getSportsbookMarketSelector(state, marketUrn);
      const secondCallMarket = getSportsbookMarketSelector(newState, marketUrn);

      it("should return a different market object", () => {
        expect(firstCallMarket === secondCallMarket).toBe(false);
      });
    });
  });
  describe("createSportsbookMarketRunnerByRunnerAndMarketURNSelector", () => {
    it("should return the correct runner for a given urn", () => {
      expect(
        createSportsbookMarketRunnerByRunnerAndMarketURNSelector()(stateMock, {
          marketUrn: "ppb:sbkMarket:1.166528788",
          runnerUrn: "ppb:sbkRunner:1.166528788/19",
        }),
      ).toEqual({ handicap: 0, name: "Some other Team A", selectionId: 19, urn: "ppb:sbkRunner:1.166528788/19" });
    });
    describe("when the selector is called twice with the same input", () => {
      it("should only execute one computation", () => {
        const firstExecution = createSportsbookMarketRunnerByRunnerAndMarketURNSelector()(stateMock, {
          marketUrn: "ppb:sbkMarket:1.166528788",
          runnerUrn: "ppb:sbkRunner:1.166528788/19",
        });
        const secondExecution = createSportsbookMarketRunnerByRunnerAndMarketURNSelector()(stateMock, {
          marketUrn: "ppb:sbkMarket:1.166528788",
          runnerUrn: "ppb:sbkRunner:1.166528788/19",
        });
        expect(firstExecution === secondExecution).toBe(true);
      });
    });

    describe("when the selector is called twice with different inputs", () => {
      it("should execute one computation for each call", () => {
        const newStateMock = {
          "ppb:sbkMarket:1.166528789": {
            urn: "ppb:sbkMarket:1.166528789",
            sportevent: "ppb:event:22334456",
            name: "EXC Market 2",
            marketId: "1.166528789",
            runners: [
              {
                urn: "ppb:sbkRunner:1.166528789/19",
                selectionId: 19,
                name: "Some other Team A",
                handicap: 0,
              },
            ],
          },
        };
        const firstExecution = createSportsbookMarketRunnerByRunnerAndMarketURNSelector()(stateMock, {
          marketUrn: "ppb:sbkMarket:1.166528788",
          runnerUrn: "ppb:sbkRunner:1.166528788/19",
        });
        const secondExecution = createSportsbookMarketRunnerByRunnerAndMarketURNSelector()(newStateMock, {
          marketUrn: "ppb:sbkMarket:1.166528789",
          runnerUrn: "ppb:sbkRunner:1.166528789/19",
        });
        expect(firstExecution === secondExecution).toBe(false);
      });
    });
  });

  describe("createGetSportsbookMarketByHierarchySelector", () => {
    const getSportsBookMarketByHierarchy = createGetSportsbookMarketByHierarchySelector();
    describe("when finds sportsbook market with same hierarchy", () => {
      it("should return the correct market", () => {
        isCompetitionEventHierarchy.mockReturnValue(true);
        const result = getSportsBookMarketByHierarchy(sportsbookMarketMock, {
          sporteventURN: sportevent,
          competitionURN: competition,
        });
        expect(result).toEqual({
          urn: "ppb:sbkMarket:1.166528788",
          sportevent: "ppb:event:22334455",
          name: "SBK Market 1",
          totalMatched: 6,
          hierarchy: {
            sportevent: "ppb:event:22334455",
            competition: "ppb:competition:11223344",
          },
          runners: [
            {
              urn: "ppb:sbkRunner:1.166528788/19/0",
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
      const newState = sportsbookMarketMock;
      const firstCallMarket = getSportsBookMarketByHierarchy(sportsbookMarketMock, {
        sporteventURN: sportevent,
        competitionURN: competition,
      });
      const secondCallMarket = getSportsBookMarketByHierarchy(newState, {
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
          "ppb:sbkMarket:1.456123": {
            urn: "ppb:sbkMarket:1.456123",
            sportevent: "ppb:event:987654",
            name: "SBK Market 3",
            totalMatched: 6,
            hierarchy: {
              sportevent: "ppb:event:987654",
              competition: "ppb:competition:789456",
            },
            runners: [
              {
                urn: "ppb:sbkRunner:1.166528788/19/0",
                selection: 19,
                marketId: "1.166528788",
                name: "Some other Team A",
                handicap: 0,
              },
            ],
          },
        };
        const firstExecution = getSportsBookMarketByHierarchy(sportsbookMarketMock, {
          sporteventURN: sportevent,
          competitionURN: competition,
        });
        const secondExecution = getSportsBookMarketByHierarchy(newStateMock, {
          sporteventURN: "ppb:event:987654",
          competitionURN: "ppb:competition:789456",
        });
        expect(firstExecution === secondExecution).toBe(false);
      });
    });

    describe("when it doesn't find an sportsbook market with the same hierarchy", () => {
      it("should return undefined", () => {
        isCompetitionEventHierarchy.mockReturnValue(true);
        const result = getSportsBookMarketByHierarchy(sportsbookMarketMock, {
          sporteventURN: "sporteventURN",
          competitionURN: "competitionURN",
        });
        expect(result).toBeUndefined();
      });
    });

    describe("when hierarchy is not of type event or competition", () => {
      it("should return undefined", () => {
        isCompetitionEventHierarchy.mockReturnValue(false);
        const result = getSportsBookMarketByHierarchy(sportsbookMarketMock, {
          sporteventURN: "sporteventURN",
          competitionURN: "competitionURN",
        });
        expect(result).toBeUndefined();
      });
    });
  });
});
