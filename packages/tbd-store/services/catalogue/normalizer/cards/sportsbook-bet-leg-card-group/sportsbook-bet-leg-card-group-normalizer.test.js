import normalizeSportsbookBetLegCardGroupFragmentIntoSportsbookBetLegCardGroup from "./sportsbook-bet-leg-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:card:group:sbkBetLeg:1175702671/0",
  full: {
    edges: [
      {
        node: {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          fixture: {
            __typename: "FootballFixture",
            urn: "ppb:fixture:30824665",
            home: {
              name: "Crystal Palace",
              color: "1017da",
              crest: {
                vector: "https://sca.betfair.com/Assets/Team%20Logo/English%20Premier%20League/Crystal%20Palace.svg",
                small: "https://sca.betfair.com/Assets/logo/small/7.png",
                medium: "https://sca.betfair.com/Assets/logo/medium/7.png",
                large: "https://sca.betfair.com/Assets/logo/big/7.png",
              },
            },
            away: {
              name: "Tottenham",
              color: "3b3a4d",
              crest: {
                vector: "https://sca.betfair.com/Assets/Team%20Logo/English%20Premier%20League/Tottenham.svg",
                small: "https://sca.betfair.com/Assets/logo/small/33.png",
                medium: "https://sca.betfair.com/Assets/logo/medium/33.png",
                large: "https://sca.betfair.com/Assets/logo/big/33.png",
              },
            },
            scheduledAt: "2021-09-11T11:30:00Z",
            startedAt: null,
            score: null,
            firstLegScore: null,
            duration: {
              period: "REGULAR",
              status: "PRE_MATCH",
              clock: null,
              stoppageMinutes: null,
            },
            penaltyShootout: null,
          },
          fixtureEventViewLink: {
            viewUrn: "ppb:tbd:view:event:30824665",
            viewUrl: "football/english-premier-league/crystal-palace-v-tottenham/e-30824665",
          },
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30824665",
            eventId: 30824665,
            name: "Crystal Palace v Tottenham",
            openDate: "2021-09-11T11:30:00.000Z",
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
          },
        },
      },
      {
        node: {
          __typename: "BetLegCard",
          urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          betUrn: "ppb:sbkBet:1175702671",
          leg: {
            __typename: "BetLeg",
            urn: "ppb:sbkBetLeg:1175702671/0",
            type: "SS",
            result: null,
            parts: [
              {
                marketBetUrn: "ppb:marketBet:924.273738251",
                price: {
                  decimal: 1.83,
                  fractional: {
                    numerator: 5,
                    denominator: 6,
                  },
                },
                originalPrice: {
                  decimal: 1.83,
                  fractional: {
                    numerator: 5,
                    denominator: 6,
                  },
                },
                priceType: "LIVE",
                eventDescription: "Crystal Palace v Tottenham",
                eventMarketDescription: "Match Odds",
                selectionName: "Tottenham",
                startTime: "2021-09-11T11:30:00.000Z",
                handicap: null,
                eachwayPlaces: null,
                eachwayFactor: null,
                rule4Deductions: 0,
              },
            ],
          },
        },
      },
    ],
  },
};

describe("Sportsbook bet leg card group normalizer", () => {
  describe("normalizeBetCardGroupFragmentIntoBetCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSportsbookBetLegCardGroupFragmentIntoSportsbookBetLegCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "SportsbookBetLegCardGroup",
        urn: "ppb:tbd:card:group:sbkBetLeg:1175702671/0",
        items: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
          {
            typename: "BetLegCard",
            urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when a partial edge doesn't have a full edge match", () => {
      BFF_RESPONSE.full.edges[1] = null;

      const { data } = normalizeSportsbookBetLegCardGroupFragmentIntoSportsbookBetLegCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "SportsbookBetLegCardGroup",
        urn: "ppb:tbd:card:group:sbkBetLeg:1175702671/0",
        items: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
        ],
      });
    });
  });
});
