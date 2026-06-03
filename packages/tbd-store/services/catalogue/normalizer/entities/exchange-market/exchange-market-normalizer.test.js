import exchangeMarketNormalizer from "./exchange-market-normalizer";
import marketHierarchyNormalizer from "../market-hierarchy/market-hierarchy-normalizer";

jest.mock("../market-hierarchy/market-hierarchy-normalizer", () => jest.fn());

const MARKET_HYDRATED_FRAGMENT = {
  __typename: "ExchangeMarket",
  urn: "ppb:excMarket:1.178522911",
  liveData: {
    totalMatched: 210760.17761221164,
    exchangeMarketStatus: "OPEN",
    inplay: false,
    turnInPlayEnabled: false,
  },
  name: "Match Odds",
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
      runnerURN: "ppb:excRunner:1.178522911/48044/0",
      name: "Wolves",
      selectionId: 48044,
      handicap: 0,
      resultType: null,
    },
  ],
  marketRulesViewLink: {
    viewUrn: "ppb:tbd:view:marketRules:1.195702271",
    viewUrl: "",
  },
};

const MARKET_NON_HYDRATED_FRAGMENT = {
  __typename: "ExchangeMarket",
  urn: "ppb:excMarket:1.178522911",
  name: "Match Odds",
  marketType: "MATCH_ODDS",
  marketTypeName: null,
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
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
  bettingType: "ODDS",
  eachWayDivisor: null,
  numberOfWinners: 1,
  runners: [
    {
      __typename: "Runner",
      runnerURN: "ppb:excRunner:1.178522911/48044/0",
      name: "Wolves",
      selectionId: 48044,
      handicap: 0,
      resultType: null,
    },
  ],
};

describe("Exchange Market normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeExchangeMarketFragmentIntoExchangeMarket", () => {
    describe("for a fully loaded (hydrated) exchange market", () => {
      it("should correctly transform and return the data object", () => {
        marketHierarchyNormalizer.mockReturnValue({
          data: {
            competition: "ppb:competition:10932509",
            sportevent: "ppb:event:30255643",
          },
        });
        const { data } = exchangeMarketNormalizer(MARKET_HYDRATED_FRAGMENT);

        expect(data).toEqual({
          typename: "ExchangeMarket",
          bettingType: "ODDS",
          eachWayDivisor: undefined,
          inplay: false,
          turnInPlayEnabled: false,
          marketId: "1.178522911",
          marketType: "MATCH_ODDS",
          marketTypeName: null,
          name: "Match Odds",
          numberOfWinners: 1,
          hierarchy: {
            competition: "ppb:competition:10932509",
            sportevent: "ppb:event:30255643",
          },
          runners: [
            {
              handicap: 0,
              name: "Wolves",
              resultType: null,
              selectionId: 48044,
              urn: "ppb:excRunner:1.178522911/48044/0",
            },
          ],
          sport: "ppb:eventType:1",
          status: "OPEN",
          totalMatched: 210760.17761221164,
          type: "MATCH_ODDS",
          urn: "ppb:excMarket:1.178522911",
          marketRulesViewLink: MARKET_HYDRATED_FRAGMENT.marketRulesViewLink,
        });
      });

      describe("when liveData is not present", () => {
        it("should correctly transform and return the data object with inplay as null", () => {
          marketHierarchyNormalizer.mockReturnValue({
            data: {
              competition: "ppb:competition:10932509",
              sportevent: "ppb:event:30255643",
            },
          });
          const { data } = exchangeMarketNormalizer({ ...MARKET_HYDRATED_FRAGMENT, liveData: undefined });

          expect(data).toEqual({
            typename: "ExchangeMarket",
            bettingType: "ODDS",
            eachWayDivisor: undefined,
            marketId: "1.178522911",
            marketType: "MATCH_ODDS",
            marketTypeName: null,
            name: "Match Odds",
            numberOfWinners: 1,
            hierarchy: {
              competition: "ppb:competition:10932509",
              sportevent: "ppb:event:30255643",
            },
            runners: [
              {
                handicap: 0,
                name: "Wolves",
                resultType: null,
                selectionId: 48044,
                urn: "ppb:excRunner:1.178522911/48044/0",
              },
            ],
            sport: "ppb:eventType:1",
            status: "OPEN",
            totalMatched: 0,
            type: "MATCH_ODDS",
            urn: "ppb:excMarket:1.178522911",
          });
        });
      });
    });

    describe("for a non-hydrated exchange market (mandatory fields only)", () => {
      it("should correctly transform and return the data object", () => {
        marketHierarchyNormalizer.mockReturnValue({
          data: {
            competition: "ppb:competition:10932509",
            sportevent: "ppb:event:30255643",
          },
        });
        const { data } = exchangeMarketNormalizer(MARKET_NON_HYDRATED_FRAGMENT);

        expect(data).toEqual({
          typename: "ExchangeMarket",
          bettingType: "ODDS",
          eachWayDivisor: undefined,
          marketId: "1.178522911",
          marketType: "MATCH_ODDS",
          marketTypeName: null,
          name: "Match Odds",
          numberOfWinners: 1,
          hierarchy: {
            sportevent: "ppb:event:30255643",
            competition: "ppb:competition:10932509",
          },
          runners: [
            {
              handicap: 0,
              name: "Wolves",
              resultType: null,
              selectionId: 48044,
              urn: "ppb:excRunner:1.178522911/48044/0",
            },
          ],
          sport: "ppb:eventType:1",
          status: "OPEN",
          totalMatched: 0,
          type: "MATCH_ODDS",
          urn: "ppb:excMarket:1.178522911",
        });
      });
    });
  });
});
