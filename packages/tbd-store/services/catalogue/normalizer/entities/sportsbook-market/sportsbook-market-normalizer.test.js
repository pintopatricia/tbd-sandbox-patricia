import sportsbookMarketNormalizer from "./sportsbook-market-normalizer";
import marketHierarchyNormalizer from "../market-hierarchy/market-hierarchy-normalizer";

jest.mock("../market-hierarchy/market-hierarchy-normalizer", () => jest.fn());

const BFF_HYDRATED_RESPONSE = {
  __typename: "SportsbookMarket",
  isOddsboostMarketType: true,
  isAutomaticEachWayMarketType: true,
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
      eventId: 1234,
      name: "Event Name",
      openDate: "2020-07-08T10:20:00.000Z",
    },
  },
  liveData: {
    inplay: true,
    turnInPlayEnabled: true,
    bspMarket: false,
    runners: [
      {
        handicap: 2,
        runnerURN: "runnerURN",
      },
    ],
  },
  sport: {
    urn: "ppb:eventType:1",
    name: "Soccer",
    sportId: 1,
  },
  bettingType: "ODDS",
  marketId: "123",
  marketType: "MATCH_ODDS",
  marketTypeName: "Match Odds",
  isSuperSub: false,
  name: "Sportsbook Market",
  runners: [
    {
      handicap: 0,
      name: "runnerName",
      resultType: "resultType",
      runnerURN: "runnerURN",
      selectionId: 1234,
    },
  ],
  urn: "ppb:sbkMarket:123",
};

const BFF_NON_HYDRATED_RESPONSE = {
  __typename: "SportsbookMarket",
  isOddsboostMarketType: true,
  isAutomaticEachWayMarketType: true,
  sport: {
    urn: "ppb:eventType:1",
    name: "Soccer",
    sportId: 1,
  },
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
      eventId: 1234,
      name: "Event Name",
      openDate: "2020-07-08T10:20:00.000Z",
    },
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
      runnerURN: "runnerURN",
      selectionId: 1234,
    },
  ],
  urn: "ppb:sbkMarket:123",
  bettingType: "ODDS",
};

const RACING_MARKET_HYDRATED_FRAGMENT = {
  __typename: "SportsbookMarket",
  isOddsboostMarketType: true,
  sport: {
    urn: "ppb:eventType:1",
    name: "Soccer",
    sportId: 7,
  },
  hierarchy: {
    __typename: "RaceHierarchy",
    race: {
      __typename: "Race",
      urn: "ppb:race:30264283.1640",
      startTime: "2021-02-03T16:40:00.000Z",
      name: "Handicap Hurdle (Class 3)",
      meeting: {
        __typename: "Meeting",
        urn: "ppb:meeting:30264283",
        name: "Warw  3rd Feb",
        country: "GB",
        countryFlag: {
          vector: null,
        },
        venue: "Warwick",
        date: "2021-02-03T12:55:00.000Z",
      },
    },
  },
  liveData: {
    inplay: true,
    turnInPlayEnabled: true,
    bspMarket: false,
    sportsbookMarketStatus: "OPEN",
  },
  bettingType: "ODDS",
  marketId: "123",
  marketType: "MATCH_ODDS",
  marketTypeName: "Match Odds",
  isSupersub: false,
  name: "Sportsbook Market",
  runners: [
    {
      handicap: 0,
      name: "runnerName",
      resultType: "resultType",
      runnerURN: "runnerURN",
      selectionId: 1234,
    },
  ],
  urn: "ppb:sbkMarket:123",
};

describe("Sportsbook Market normalizer", () => {
  beforeEach(() => {
    marketHierarchyNormalizer.mockClear();
  });

  describe("normalizeSportsbookMarketFragmentIntoSportsbookMarket", () => {
    describe("for a fully loaded (hydrated) sportsbook market", () => {
      it("should correctly transform and return the data object with runners with live handicaps", () => {
        marketHierarchyNormalizer.mockReturnValue({
          data: {
            competition: "ppb:competition:10",
            sportevent: "ppb:event:1234",
          },
        });
        const { data } = sportsbookMarketNormalizer(BFF_HYDRATED_RESPONSE);

        expect(data).toEqual({
          typename: "SportsbookMarket",
          inplay: true,
          turnInPlayEnabled: true,
          bspMarket: false,
          isOddsboostMarketType: true,
          isAutomaticEachWayMarketType: true,
          marketId: "123",
          marketType: "MATCH_ODDS",
          marketTypeName: "Match Odds",
          isSuperSub: false,
          isAccaFreezeEligible: false,
          name: "Sportsbook Market",
          hierarchy: {
            competition: "ppb:competition:10",
            sportevent: "ppb:event:1234",
          },
          runners: [
            {
              handicap: 2,
              name: "runnerName",
              resultType: "resultType",
              urn: "runnerURN",
              selectionId: 1234,
            },
          ],
          status: undefined,
          sport: "ppb:eventType:1",
          urn: "ppb:sbkMarket:123",
          bettingType: "ODDS",
        });
        expect(marketHierarchyNormalizer).toHaveBeenCalledWith({
          __typename: "EventCompetitionHierarchy",
          competition: {
            urn: "ppb:competition:10",
            sport: {
              urn: "ppb:eventType:1",
            },
          },
          sportevent: {
            urn: "ppb:event:1234",
            eventId: 1234,
            name: "Event Name",
            openDate: "2020-07-08T10:20:00.000Z",
          },
        });
      });

      describe("when isOddsboostMarketType is not true", () => {
        it("should correctly transform and return the data object with isOddsboostMarketType as undefined", () => {
          marketHierarchyNormalizer.mockReturnValue({
            data: {
              competition: "ppb:competition:10",
              sportevent: "ppb:event:1234",
            },
          });
          const { data } = sportsbookMarketNormalizer({ ...BFF_HYDRATED_RESPONSE, isOddsboostMarketType: false });

          expect(data).toEqual({
            typename: "SportsbookMarket",
            inplay: true,
            turnInPlayEnabled: true,
            bspMarket: false,
            isOddsboostMarketType: undefined,
            isAutomaticEachWayMarketType: true,
            marketId: "123",
            marketType: "MATCH_ODDS",
            marketTypeName: "Match Odds",
            isSuperSub: false,
            isAccaFreezeEligible: false,
            name: "Sportsbook Market",
            hierarchy: {
              competition: "ppb:competition:10",
              sportevent: "ppb:event:1234",
            },
            runners: [
              {
                handicap: 2,
                name: "runnerName",
                resultType: "resultType",
                urn: "runnerURN",
                selectionId: 1234,
              },
            ],
            status: undefined,
            sport: "ppb:eventType:1",
            urn: "ppb:sbkMarket:123",
            bettingType: "ODDS",
          });
          expect(marketHierarchyNormalizer).toHaveBeenCalledWith({
            __typename: "EventCompetitionHierarchy",
            competition: {
              urn: "ppb:competition:10",
              sport: {
                urn: "ppb:eventType:1",
              },
            },
            sportevent: {
              urn: "ppb:event:1234",
              eventId: 1234,
              name: "Event Name",
              openDate: "2020-07-08T10:20:00.000Z",
            },
          });
        });
      });

      describe("when isAutomaticEachWayMarketType is not true", () => {
        it("should correctly transform and return the data object with isAutomaticEachWayMarketType as undefined", () => {
          marketHierarchyNormalizer.mockReturnValue({
            data: {
              competition: "ppb:competition:10",
              sportevent: "ppb:event:1234",
            },
          });
          const { data } = sportsbookMarketNormalizer({
            ...BFF_HYDRATED_RESPONSE,
            isAutomaticEachWayMarketType: false,
          });

          expect(data).toEqual({
            typename: "SportsbookMarket",
            inplay: true,
            turnInPlayEnabled: true,
            bspMarket: false,
            isOddsboostMarketType: true,
            isAutomaticEachWayMarketType: undefined,
            marketId: "123",
            marketType: "MATCH_ODDS",
            marketTypeName: "Match Odds",
            isSuperSub: false,
            isAccaFreezeEligible: false,
            name: "Sportsbook Market",
            hierarchy: {
              competition: "ppb:competition:10",
              sportevent: "ppb:event:1234",
            },
            runners: [
              {
                handicap: 2,
                name: "runnerName",
                resultType: "resultType",
                urn: "runnerURN",
                selectionId: 1234,
              },
            ],
            status: undefined,
            sport: "ppb:eventType:1",
            urn: "ppb:sbkMarket:123",
            bettingType: "ODDS",
          });
          expect(marketHierarchyNormalizer).toHaveBeenCalledWith({
            __typename: "EventCompetitionHierarchy",
            competition: {
              urn: "ppb:competition:10",
              sport: {
                urn: "ppb:eventType:1",
              },
            },
            sportevent: {
              urn: "ppb:event:1234",
              eventId: 1234,
              name: "Event Name",
              openDate: "2020-07-08T10:20:00.000Z",
            },
          });
        });
      });

      describe("when liveData is not present", () => {
        it("should correctly transform and return the data object with inplay as null and runners default handicaps", () => {
          marketHierarchyNormalizer.mockReturnValue({
            data: {
              competition: "ppb:competition:10",
              sportevent: "ppb:event:1234",
            },
          });
          const { data } = sportsbookMarketNormalizer({ ...BFF_HYDRATED_RESPONSE, liveData: undefined });

          expect(data).toEqual({
            typename: "SportsbookMarket",
            turnInPlayEnabled: null,
            bspMarket: null,
            isOddsboostMarketType: true,
            isAutomaticEachWayMarketType: true,
            marketId: "123",
            marketType: "MATCH_ODDS",
            marketTypeName: "Match Odds",
            isSuperSub: false,
            isAccaFreezeEligible: false,
            name: "Sportsbook Market",
            hierarchy: {
              competition: "ppb:competition:10",
              sportevent: "ppb:event:1234",
            },
            runners: [
              {
                handicap: 0,
                name: "runnerName",
                resultType: "resultType",
                urn: "runnerURN",
                selectionId: 1234,
              },
            ],
            status: undefined,
            sport: "ppb:eventType:1",
            urn: "ppb:sbkMarket:123",
            bettingType: "ODDS",
          });
          expect(marketHierarchyNormalizer).toHaveBeenCalledWith({
            __typename: "EventCompetitionHierarchy",
            competition: {
              urn: "ppb:competition:10",
              sport: {
                urn: "ppb:eventType:1",
              },
            },
            sportevent: {
              urn: "ppb:event:1234",
              eventId: 1234,
              name: "Event Name",
              openDate: "2020-07-08T10:20:00.000Z",
            },
          });
        });
      });

      describe("when its a racing market", () => {
        it("should correctly return the relations object", () => {
          marketHierarchyNormalizer.mockReturnValue({
            data: {
              race: "ppb:race:30264283.1640",
              meeting: "ppb:meeting:30264283",
            },
          });
          const { data } = sportsbookMarketNormalizer(RACING_MARKET_HYDRATED_FRAGMENT);

          expect(data).toEqual({
            typename: "SportsbookMarket",
            inplay: true,
            turnInPlayEnabled: true,
            bspMarket: false,
            isOddsboostMarketType: true,
            marketId: "123",
            marketType: "MATCH_ODDS",
            marketTypeName: "Match Odds",
            isSuperSub: false,
            isAccaFreezeEligible: false,
            name: "Sportsbook Market",
            hierarchy: {
              race: "ppb:race:30264283.1640",
              meeting: "ppb:meeting:30264283",
            },
            runners: [
              {
                handicap: 0,
                name: "runnerName",
                resultType: "resultType",
                urn: "runnerURN",
                selectionId: 1234,
              },
            ],
            sport: "ppb:eventType:1",
            status: "OPEN",
            urn: "ppb:sbkMarket:123",
            bettingType: "ODDS",
          });
          expect(marketHierarchyNormalizer).toHaveBeenCalledWith({
            __typename: "RaceHierarchy",
            race: {
              __typename: "Race",
              urn: "ppb:race:30264283.1640",
              startTime: "2021-02-03T16:40:00.000Z",
              name: "Handicap Hurdle (Class 3)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30264283",
                name: "Warw  3rd Feb",
                country: "GB",
                countryFlag: {
                  vector: null,
                },
                venue: "Warwick",
                date: "2021-02-03T12:55:00.000Z",
              },
            },
          });
        });
      });
    });

    describe("for a non-hydrated sportsbook market (mandatory fields only)", () => {
      it("should correctly transform and return the data object", () => {
        marketHierarchyNormalizer.mockReturnValue({
          data: {
            competition: "ppb:competition:10",
            sportevent: "ppb:event:1234",
          },
        });
        const { data } = sportsbookMarketNormalizer(BFF_NON_HYDRATED_RESPONSE);

        expect(data).toEqual({
          typename: "SportsbookMarket",
          turnInPlayEnabled: null,
          bspMarket: null,
          isOddsboostMarketType: true,
          isAutomaticEachWayMarketType: true,
          marketId: "123",
          marketType: "MATCH_ODDS",
          marketTypeName: "Match Odds",
          isSuperSub: false,
          isAccaFreezeEligible: false,
          name: "Sportsbook Market",
          hierarchy: {
            competition: "ppb:competition:10",
            sportevent: "ppb:event:1234",
          },
          runners: [
            {
              handicap: 0,
              name: "runnerName",
              resultType: "resultType",
              urn: "runnerURN",
              selectionId: 1234,
            },
          ],
          sport: "ppb:eventType:1",
          status: undefined,
          urn: "ppb:sbkMarket:123",
          bettingType: "ODDS",
        });
        expect(marketHierarchyNormalizer).toHaveBeenCalledWith({
          __typename: "EventCompetitionHierarchy",
          competition: {
            urn: "ppb:competition:10",
            sport: {
              urn: "ppb:eventType:1",
            },
          },
          sportevent: {
            urn: "ppb:event:1234",
            eventId: 1234,
            name: "Event Name",
            openDate: "2020-07-08T10:20:00.000Z",
          },
        });
      });
    });

    describe("when is Super Sub", () => {
      it("should return the property", () => {
        const { data } = sportsbookMarketNormalizer({ ...BFF_HYDRATED_RESPONSE, isSuperSub: true });

        expect(data).toEqual(expect.objectContaining({ isSuperSub: true }));
      });
    });
  });
});
