import {
  buildCardsLayout,
  buildFullCardLayout,
  buildRunnersDisplayUpdatesPayload,
  buildFilteredCouponLayout,
  buildMainMarketsUpdatesPayload,
  buildFilteredSelectableItemsLayout,
  buildGamingSearchCardsLayout,
} from "./cards-mapper";
import { normalizerEngine } from "./normalizer/normalizer-engine";
import { getApolloCacheFeeder } from "../../config/apollo-cache-feeder";

jest.mock("./normalizer/normalizer-engine", () => ({
  normalizerEngine: jest.fn(() => "NormalizedData"),
}));

jest.mock("../../config/apollo-cache-feeder", () => ({
  getApolloCacheFeeder: jest.fn(),
}));

const cardsMock = {
  Cards: [{ urn: "urn1" }, { urn: "urn2" }, { urn: "urn3" }],
};

const gamingSearchMock = {
  GamingSearch: {
    edges: [{ node: { urn: "GameCard1" } }, { node: { urn: "GameCard2" } }, { node: { urn: "GameCard3" } }],
  },
};

const cardsDisplayRunnersMock = {
  Cards: [
    {
      __typename: "RaceMarketCard",
      urn: "urn1",
      displayRunners: {
        exchange: {
          runners: [{ runnerURN: "runner1Urn" }],
        },
        sportsbook: {
          runners: [{ runnerURN: "runner2Urn" }],
        },
      },
    },
    {
      __typename: "MarketCard",
      urn: "urn2",
      displayRunners: {
        exchange: {
          runners: [{ runnerURN: "runner3Urn" }],
        },
        sportsbook: {
          runners: [{ runnerURN: "runner4Urn" }],
        },
      },
    },
  ],
};

const cardsMainMarketsWithEventMarketCardUpdatesMock = {
  Cards: [
    {
      __typename: "EventMarketCard",
      urn: "urn1",
      eventViewLink: {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      },
      fixture: {
        urn: "ppb:fixture:1111",
        __typename: "BaseFixture",
        sportevent: { urn: "ppb:event:1234" },
        mainMarket: {
          exchange: { urn: "ppb:excMarket:1.178522911" },
          sportsbook: { urn: "ppb:sbkMarket:123" },
        },
      },
      runnerViewLinks: [
        {
          runnerUrn: "excRunner",
          viewUrl: "Not Implemented",
          viewUrn: "viewUrn",
        },
        {
          runnerUrn: "sbkRunner",
          viewUrl: "Not Implemented",
          viewUrn: "viewUrn",
        },
      ],
      title: "Match Odds",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.178522911",
            name: "Match Odds",
            marketId: "1.178522911",
            marketType: "MATCH_ODDS",
            marketTypeName: null,
            hierarchy: {
              __typename: "EventCompetitionHierarchy",
              competition: {
                __typename: "Competition",
                urn: "ppb:competition:10932509",
                name: "English Premier League",
                competitionId: 10932509,
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30255643",
                name: "Wolves v Arsenal",
              },
            },
            sport: {
              __typename: "Sport",
              urn: "ppb:eventType:1",
              name: "Football",
              sportId: 1,
            },
            bettingType: "ODDS",
            eachWayDivisor: null,
            numberOfWinners: 1,
            runners: [
              {
                __typename: "Runner",
                runnerURN: "excRunner",
                name: "Wolves",
                selectionId: 48044,
                handicap: 0,
                resultType: null,
              },
            ],
          },
          runners: [{ runnerURN: "excRunner" }],
        },
        sportsbook: {
          market: {
            __typename: "SportsbookMarket",
            isOddsboostMarketType: true,
            hierarchy: {
              __typename: "EventCompetitionHierarchy",
              competition: {
                urn: "ppb:competition:10",
                sport: {
                  urn: "ppb:eventType:1",
                },
              },
              sportevent: {
                urn: "ppb:event:1234",
              },
            },
            sport: {
              urn: "ppb:eventType:1",
            },
            marketId: "123",
            marketType: "MATCH_ODDS",
            marketTypeName: "Match Odds",
            name: "Sportsbook Market",
            runners: [
              {
                handicap: 0,
                name: "runnerName",
                resultType: "resultType",
                runnerURN: "sbkRunner",
                selectionId: 1234,
              },
            ],
            urn: "ppb:sbkMarket:123",
            bettingType: "ODDS",
          },
          runners: [{ runnerURN: "sbkRunner" }],
        },
      },
    },
  ],
};

describe("buildCardsLayout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should normalize all cards", () => {
    const result = buildCardsLayout(cardsMock);

    expect(normalizerEngine).toHaveBeenCalledWith(cardsMock.Cards);
    expect(result).toEqual({
      data: "NormalizedData",
    });
  });

  it("should call apolloCacheFeeder with normalizer result when available", () => {
    const mockFeeder = jest.fn();
    getApolloCacheFeeder.mockReturnValue(mockFeeder);

    buildCardsLayout(cardsMock);

    expect(getApolloCacheFeeder).toHaveBeenCalled();
    expect(mockFeeder).toHaveBeenCalledWith("NormalizedData");
  });

  it("should not call apolloCacheFeeder when it returns undefined", () => {
    getApolloCacheFeeder.mockReturnValue(undefined);

    buildCardsLayout(cardsMock);

    expect(getApolloCacheFeeder).toHaveBeenCalled();
  });
});

describe("buildFullCardLayout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should normalize all cards", () => {
    const result = buildFullCardLayout(cardsMock);

    expect(normalizerEngine).toHaveBeenCalledWith(cardsMock.Cards);
    expect(result).toEqual({
      data: "NormalizedData",
    });
  });
});

describe("buildRunnersDisplayUpdatesPayload", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should normalize all cards", () => {
    const result = buildRunnersDisplayUpdatesPayload(cardsDisplayRunnersMock);

    expect(normalizerEngine).toHaveBeenCalledWith(cardsDisplayRunnersMock.Cards);
    expect(result).toEqual({
      data: "NormalizedData",
    });
  });
});

describe("buildMainMarketsUpdatesPayload", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should normalize all cards", () => {
    const result = buildMainMarketsUpdatesPayload(cardsMainMarketsWithEventMarketCardUpdatesMock);

    expect(normalizerEngine).toHaveBeenCalledWith(cardsMainMarketsWithEventMarketCardUpdatesMock.Cards);
    expect(result).toEqual({
      data: "NormalizedData",
    });
  });
});

describe("buildFilteredCouponLayout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should normalize all cards", () => {
    const result = buildFilteredCouponLayout(cardsMock);

    expect(normalizerEngine).toHaveBeenCalledWith(cardsMock.Cards);
    expect(result).toEqual({
      data: "NormalizedData",
    });
  });
});

describe("buildFilteredSelectableItemsLayout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should normalize all cards", () => {
    const result = buildFilteredSelectableItemsLayout(cardsMock);

    expect(normalizerEngine).toHaveBeenCalledWith(cardsMock.Cards);
    expect(result).toEqual({
      data: "NormalizedData",
    });
  });
});

describe("buildGamingSearchCardsLayout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should normalize all cards", () => {
    const result = buildGamingSearchCardsLayout(gamingSearchMock);
    const expected = [{ urn: "GameCard1" }, { urn: "GameCard2" }, { urn: "GameCard3" }];

    expect(normalizerEngine).toHaveBeenCalledWith(expected);
    expect(result).toEqual({
      data: "NormalizedData",
    });
  });
});
