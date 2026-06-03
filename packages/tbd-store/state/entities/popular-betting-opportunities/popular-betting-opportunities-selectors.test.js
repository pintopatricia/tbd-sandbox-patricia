import { createEntityByURNSelector } from "../entities-selectors";
import { createSportsbookMarketByURNSelector } from "../sportsbook-markets/sportsbook-market-selectors";
import { isRaceHierarchy } from "../../../helpers/markets";
import { createMeetingByURNSelector } from "../meetings/meeting-selectors";
import { createRaceByURNSelector } from "../races/race-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "../user-details/user-details-selectors";
import { formatTime } from "../../../helpers/dates";
import {
  createPopularBettingOpportunityHydratedSelector,
  createOddByRunnerUrnSelector,
} from "./popular-betting-opportunities-selectors";
import { createSportEventByURNSelector } from "../sport-events/sport-event-selectors";

jest.mock("../entities-selectors", () => {
  const mock = jest.fn();
  return {
    createEntityByURNSelector: jest.fn(() => mock),
  };
});

jest.mock("../sportsbook-markets/sportsbook-market-selectors", () => {
  const mock = jest.fn();
  return {
    createSportsbookMarketByURNSelector: jest.fn(() => mock),
  };
});

jest.mock("../../../helpers/markets", () => ({
  isRaceHierarchy: jest.fn(),
}));

jest.mock("../meetings/meeting-selectors", () => {
  const mock = jest.fn();
  return {
    createMeetingByURNSelector: jest.fn(() => mock),
  };
});

jest.mock("../races/race-selectors", () => {
  const mock = jest.fn();
  return {
    createRaceByURNSelector: jest.fn(() => mock),
  };
});

jest.mock("../user-details/user-details-selectors", () => {
  const mock = jest.fn();
  return {
    createGetCountryLocalCurrencyCodeSelector: jest.fn(() => mock),
  };
});

jest.mock("../sport-events/sport-event-selectors", () => {
  const mock = jest.fn();
  return {
    createSportEventByURNSelector: jest.fn(() => mock),
  };
});

jest.mock("../../../helpers/dates", () => ({
  formatTime: jest.fn(),
}));

const SPB_RUNNERS = {
  "ppb:sbkMarket:12345/1111": {
    odds: {
      decimal: 100,
      fractional: {
        numerator: 100,
        denominator: 1,
      },
    },
  },
  "ppb:sbkMarket:69/1111": {
    odds: {
      decimal: 101,
      fractional: {
        numerator: 101,
        denominator: 1,
      },
    },
  },
};

const SELECTION_DETAILS_MOCK = {
  marketUrn: "ppb:sbkMarket:12345",
  runnerUrn: "ppb:sbkMarket:12345/1111",
  silkUrl: "http://silk-url.com",
  trainerName: "Some Trainer",
  jockeyName: "Some Jockey",
};

const POPULAR_BETTING_OPPORTUNITY_MOCK = {
  typename: "PopularBettingOpportunity",
  type: "BOOSTED_BETS",
  urn: "ppb:tbd:popular:12345",
  id: "bo:12345",
  count: 69420,
  selections: [SELECTION_DETAILS_MOCK],
};

const MARKET_MOCK = {
  urn: "ppb:sbkMarket:12345",
  name: "Awesome Market",
  runners: [
    {
      urn: "ppb:sbkMarket:12345/1111",
      name: "Runner from an awesome market",
    },
  ],
  hierarchy: {},
};

const STATE_MOCK = {
  entities: {
    sportsbookmarkets: {
      "ppb:sbkMarket:12345": MARKET_MOCK,
    },
    popularbettingopportunities: {
      "ppb:tbd:popular:12345": POPULAR_BETTING_OPPORTUNITY_MOCK,
    },
    sportsbookrunners: SPB_RUNNERS,
  },
};

const STATE_MOCK_NO_RUNNER_ODDS = {
  entities: {
    ...STATE_MOCK.entities,
    sportsbookrunners: {
      "ppb:sbkMarket:12345/1111": {
        odds: undefined,
      },
      "ppb:sbkMarket:69/1111": {
        odds: undefined,
      },
    },
  },
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
  openDate: "2022-06-11 21:00:00",
};

describe("Popular Betting Opportunities Selector", () => {
  let result;
  beforeEach(jest.clearAllMocks);

  describe("when the bettingOpportunity is null", () => {
    beforeEach(() => {
      createEntityByURNSelector().mockReturnValue(null);

      const getPopularBettingOpportunitiesSelector = createPopularBettingOpportunityHydratedSelector();
      result = getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
    });

    it("should return null", () => {
      expect(result).toEqual(null);
    });
  });

  describe("when the bettingOpportunity is defined and has selections", () => {
    describe("and its market does not exist", () => {
      beforeEach(() => {
        createEntityByURNSelector().mockReturnValue(POPULAR_BETTING_OPPORTUNITY_MOCK);
        createSportsbookMarketByURNSelector().mockReturnValue(undefined);

        const getPopularBettingOpportunitiesSelector = createPopularBettingOpportunityHydratedSelector();
        result = getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
      });

      it("should return correctly the information and the items as an empty array", () => {
        expect(result).toEqual({
          urn: POPULAR_BETTING_OPPORTUNITY_MOCK.urn,
          id: POPULAR_BETTING_OPPORTUNITY_MOCK.id,
          type: POPULAR_BETTING_OPPORTUNITY_MOCK.type,
          selections: POPULAR_BETTING_OPPORTUNITY_MOCK.selections,
          count: POPULAR_BETTING_OPPORTUNITY_MOCK.count,
          items: [],
        });
      });
    });

    describe("and its market exists but the runner does not", () => {
      beforeEach(() => {
        createEntityByURNSelector().mockReturnValue(POPULAR_BETTING_OPPORTUNITY_MOCK);
        createSportsbookMarketByURNSelector().mockReturnValue({
          ...MARKET_MOCK,
          runners: [{ urn: "ppb:sbkMarket:whatever" }],
        });

        const getPopularBettingOpportunitiesSelector = createPopularBettingOpportunityHydratedSelector();
        result = getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
      });

      it("should return correctly the information and the items as an empty array", () => {
        expect(result).toEqual({
          urn: POPULAR_BETTING_OPPORTUNITY_MOCK.urn,
          id: POPULAR_BETTING_OPPORTUNITY_MOCK.id,
          type: POPULAR_BETTING_OPPORTUNITY_MOCK.type,
          selections: POPULAR_BETTING_OPPORTUNITY_MOCK.selections,
          count: POPULAR_BETTING_OPPORTUNITY_MOCK.count,
          items: [],
        });
      });
    });

    describe("and its market and runner exist", () => {
      describe("and the market's hierarchy is not Race", () => {
        beforeEach(() => {
          createEntityByURNSelector().mockReturnValue(POPULAR_BETTING_OPPORTUNITY_MOCK);
          createSportsbookMarketByURNSelector().mockReturnValue(MARKET_MOCK);
          createSportEventByURNSelector().mockReturnValue(SPORT_EVENT_MOCK);
          isRaceHierarchy.mockReturnValue(false);

          const getPopularBettingOpportunitiesSelector = createPopularBettingOpportunityHydratedSelector();
          result = getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
        });

        it("should return correctly the information and the items for avb selections", () => {
          expect(result).toEqual({
            urn: POPULAR_BETTING_OPPORTUNITY_MOCK.urn,
            id: POPULAR_BETTING_OPPORTUNITY_MOCK.id,
            type: POPULAR_BETTING_OPPORTUNITY_MOCK.type,
            selections: POPULAR_BETTING_OPPORTUNITY_MOCK.selections,
            count: POPULAR_BETTING_OPPORTUNITY_MOCK.count,
            items: [
              {
                market: MARKET_MOCK,
                sportEvent: SPORT_EVENT_MOCK,
                runner: MARKET_MOCK.runners[0],
              },
            ],
          });
        });
      });

      describe("and the market's hierarchy is Race", () => {
        beforeEach(() => {
          createEntityByURNSelector().mockReturnValue(POPULAR_BETTING_OPPORTUNITY_MOCK);
          createSportsbookMarketByURNSelector().mockReturnValue(MARKET_MOCK);
          isRaceHierarchy.mockReturnValue(true);
          createMeetingByURNSelector().mockReturnValue({ venue: "venue" });
          createRaceByURNSelector().mockReturnValue({ startTime: "startTime", name: "raceName" });
          createGetCountryLocalCurrencyCodeSelector().mockReturnValue({
            localeCodeBcp47: "localeCodeBcp47",
            timezone: "timezone",
          });
          formatTime.mockReturnValue("formattedTime");

          const getPopularBettingOpportunitiesSelector = createPopularBettingOpportunityHydratedSelector();
          result = getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
        });

        it("should return correctly the information and the items for racing selections", () => {
          expect(result).toEqual({
            urn: POPULAR_BETTING_OPPORTUNITY_MOCK.urn,
            id: POPULAR_BETTING_OPPORTUNITY_MOCK.id,
            type: POPULAR_BETTING_OPPORTUNITY_MOCK.type,
            selections: POPULAR_BETTING_OPPORTUNITY_MOCK.selections,
            count: POPULAR_BETTING_OPPORTUNITY_MOCK.count,
            items: [
              {
                market: MARKET_MOCK,
                runner: MARKET_MOCK.runners[0],
                race: {
                  startTime: "startTime",
                  name: "raceName",
                },
                meeting: {
                  venue: "venue",
                },
                silkUrl: POPULAR_BETTING_OPPORTUNITY_MOCK.selections[0].silkUrl,
                jockeyName: POPULAR_BETTING_OPPORTUNITY_MOCK.selections[0].jockeyName,
                trainerName: POPULAR_BETTING_OPPORTUNITY_MOCK.selections[0].trainerName,
              },
            ],
          });
        });
      });
    });
  });

  describe("rerendering", () => {
    describe("and the selector is called twice with the same URN", () => {
      beforeEach(() => {
        const getPopularBettingOpportunitiesSelector = createPopularBettingOpportunityHydratedSelector();
        getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
        getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
      });

      it("should only run once", () => {
        expect(createEntityByURNSelector()).toHaveBeenCalledTimes(1);
        expect(createEntityByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.entities.popularbettingopportunities,
          "ppb:tbd:popular:12345",
        );
      });
    });

    describe("and the selector is called twice with different URNs", () => {
      beforeEach(() => {
        const getPopularBettingOpportunitiesSelector = createPopularBettingOpportunityHydratedSelector();
        getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:12345");
        getPopularBettingOpportunitiesSelector(STATE_MOCK, "ppb:tbd:popular:otherUrn");
      });

      it("should run twice", () => {
        expect(createEntityByURNSelector()).toHaveBeenCalledTimes(2);
        expect(createEntityByURNSelector()).toHaveBeenNthCalledWith(
          1,
          STATE_MOCK.entities.popularbettingopportunities,
          "ppb:tbd:popular:12345",
        );
        expect(createEntityByURNSelector()).toHaveBeenNthCalledWith(
          2,
          STATE_MOCK.entities.popularbettingopportunities,
          "ppb:tbd:popular:otherUrn",
        );
      });
    });
  });
});

describe("Selection Odd selector", () => {
  let result;
  beforeEach(jest.clearAllMocks);

  describe("when the runner does not exist", () => {
    beforeEach(() => {
      const getSelectionOdd = createOddByRunnerUrnSelector();
      result = getSelectionOdd(STATE_MOCK, "runner:coiso");
    });

    it("should return undefined", () => {
      expect(result).toEqual(undefined);
    });
  });

  describe("when the runner exists", () => {
    beforeEach(() => {
      const getSelectionOdd = createOddByRunnerUrnSelector();
      result = getSelectionOdd(STATE_MOCK, SELECTION_DETAILS_MOCK.runnerUrn);
    });

    it("should return the odd value", () => {
      expect(result).toEqual(SPB_RUNNERS[SELECTION_DETAILS_MOCK.runnerUrn].odds);
    });

    describe("when the odds don't exist", () => {
      beforeEach(() => {
        const getSelectionOdd = createOddByRunnerUrnSelector();
        result = getSelectionOdd(STATE_MOCK_NO_RUNNER_ODDS, SELECTION_DETAILS_MOCK.runnerUrn);
      });

      it("should return undefined", () => {
        expect(result).toEqual(undefined);
      });
    });
  });
});
