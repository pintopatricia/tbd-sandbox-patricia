import { buildSearchResult } from "./search-mapper";

describe("SearchMapper", () => {
  describe("buildSearchResult", () => {
    it("should filter empty results", () => {
      const result = buildSearchResult({
        Search: {
          query: "poorto",
          pageSize: 5,
          startIndex: 0,
          didYouMean: "porto",
          results: [null, null, null],
        },
      });

      expect(result).toEqual({
        query: "poorto",
        pageSize: 5,
        startIndex: 0,
        didYouMean: "porto",
        items: [],
      });
    });

    it("should map event results", () => {
      const result = buildSearchResult({
        Search: {
          query: "poorto",
          pageSize: 5,
          startIndex: 0,
          didYouMean: "porto",
          results: [
            {
              __typename: "EventView",
              urn: "ppb:event:12345",
              sportevent: {
                name: "Porto vs Canelas",
                openDate: "2020-01-01",
                competition: {
                  name: "Primeira Liga",
                  sport: {
                    sportId: 1,
                  },
                },
                sport: {
                  name: "Football",
                  sportId: 1,
                },
              },
            },
            {
              __typename: "CompetitionView",
              urn: "ppb:tbd:view:competition:59",
              competition: {
                urn: "ppb:competition:59",
                name: "German Bundesliga",
                sport: {
                  name: "Football",
                  sportId: 1,
                },
                logo: {
                  large: "logo",
                },
              },
            },
          ],
        },
      });

      expect(result).toEqual({
        didYouMean: "porto",
        items: [
          {
            type: "EVENT_SEARCH_RESULT_ITEM",
            competition: "Primeira Liga",
            date: new Date("2020-01-01"),
            name: "Porto vs Canelas",
            sportId: 1,
            sportName: "Football",
            urn: "ppb:event:12345",
            url: undefined,
          },
          {
            name: "German Bundesliga",
            sportName: "Football",
            logo: "logo",
            type: "COMPETITION_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:view:competition:59",
            sportId: 1,
            url: undefined,
          },
        ],
        pageSize: 5,
        query: "poorto",
        startIndex: 0,
      });
    });

    it("should map race results", () => {
      const result = buildSearchResult({
        Search: {
          query: "Maiden",
          pageSize: 5,
          startIndex: 0,
          didYouMean: "maiden",
          results: [
            {
              __typename: "RaceView",
              urn: "ppb:tbd:race:12345",
              url: "url2",
              race: {
                __typename: "Race",
                urn: "ppb:race:30191931.1720",
                startTime: "2020-12-18T17:20:00.000Z",
                name: "Maiden Claim",
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:30191931",
                  name: "Aque (US) 18th Dec",
                  country: "US",
                  countryFlag: {
                    vector: null,
                  },
                  venue: "Aqueduct",
                  date: "2020-12-18T17:20:00.000Z",
                },
                sport: {
                  name: "Horse Racing",
                  sportId: 7,
                },
              },
            },
          ],
        },
      });

      expect(result).toEqual({
        didYouMean: "maiden",
        items: [
          {
            type: "RACE_SEARCH_RESULT_ITEM",
            date: new Date("2020-12-18T17:20:00.000Z"),
            meetingName: "Aqueduct",
            name: "Maiden Claim",
            sportId: 7,
            sportName: "Horse Racing",
            urn: "ppb:tbd:race:12345",
            url: "url2",
          },
        ],
        pageSize: 5,
        query: "Maiden",
        startIndex: 0,
      });
    });
  });
});
