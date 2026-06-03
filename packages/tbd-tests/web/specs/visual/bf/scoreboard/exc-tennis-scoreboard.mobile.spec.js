const { AvBScoreboardPO, ExchangeMarketPO } = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const exchangeMarketPO = new ExchangeMarketPO();
const avbScoreboardPO = new AvBScoreboardPO();

// Mock fragments
const EVENT_ID = "31111111";
const MODULE_NAME = "tennis-scoreboard";

const HOME_PLAYERS = [
  { name: "Keanu Reeves", rank: 420 },
  { name: "The OtherGuyFromTheMatrixThatIsKilledOnTheVideogame", rank: 69 },
];

const AWAY_PLAYERS = [
  { name: "Reanu Keeves", rank: 69 },
  { name: "That GuyFromFriendsThatEveryoneKnowsButNoOneRemembersTheName", rank: 69 },
];

const SPORT = {
  __typename: "Sport",
  urn: "ppb:eventType:2",
  name: "Tennis",
  sportId: 2,
};

const COMPETITION = {
  urn: "ppb:competition:123451",
  name: "ATP Australian Open",
  sport: SPORT,
};

const SPORT_EVENT = {
  __typename: "SportsEvent",
  eventName:
    "Reeves/OtherGuyFromTheMatrixThatIsKilledOnTheVideogame v Keeves/GuyFromFriendsThatEveryoneKnowsButNoOneRemembersTheName",
  openDate: "2010-10-14T18:45Z",
  urn: `ppb:event:${EVENT_ID}`,
  competition: COMPETITION,
};

const FIXTURE = {
  __typename: "TennisMatch",
  urn: `ppb:fixture:${EVENT_ID}`,
  isAmericanFormat: false,
  runnerNames: {
    home: "Reeves/OtherGuyFromTheMatrix",
    away: "Keeves/GuyFromFriends",
  },
  scheduledStartTime: "2032-01-16T20:00:00Z",
  matchStatus: { status: "PRE_MATCH", reason: null },
  teamA: {
    side: "HOME",
    players: HOME_PLAYERS,
  },
  teamB: {
    side: "AWAY",
    players: AWAY_PLAYERS,
  },
};

const FIXTURE_AMERICAN_FORMAT = {
  ...FIXTURE,
  isAmericanFormat: true,
};

// Mocks
const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: SPORT_EVENT.eventName,
    competition: { urn: COMPETITION.urn, name: COMPETITION.name },
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        home: "Reeves/OtherGuyFromTheMatrix",
        away: "Keeves/GuyFromFriends",
        sportevent: SPORT_EVENT,
        fixture: FIXTURE,
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        filteredCouponTitle: COMPETITION.name,
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                title: COMPETITION.name,
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337358",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: SPORT_EVENT,
                        competition: {
                          name: COMPETITION.name,
                          competitionId: 12345,
                          urn: COMPETITION.urn,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337358/48044/0",
                          selectionId: 48044,
                          name: "Reeves/OtherGuyFromTheMatrix",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337358/48351/0",
                          selectionId: 48351,
                          name: "Keeves/GuyFromFriends",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337358/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337358/48351/0" },
                    ],
                  },
                },
                sportevent: SPORT_EVENT,
                fixture: FIXTURE,
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              name: "Match Odds",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                competition: {
                  name: COMPETITION.name,
                  competitionId: 12345,
                  urn: COMPETITION.urn,
                },
                sportevent: {
                  name: "Sampras/Williams v Williams/Mcenroe",
                  urn: `ppb:event:${EVENT_ID}`,
                  competition: {
                    name: COMPETITION.name,
                    competitionId: 12345,
                    urn: COMPETITION.urn,
                  },
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337366/1/0",
                  selectionId: 1,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/2/0",
                  selectionId: 2,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/3/0",
                  selectionId: 3,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/4/0",
                  selectionId: 4,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/5/0",
                  selectionId: 5,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/6/0",
                  selectionId: 6,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/7/0",
                  selectionId: 7,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/8/0",
                  selectionId: 8,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/9/0",
                  selectionId: 9,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337366/1/0" },
              { runnerURN: "ppb:excRunner:1.160337366/2/0" },
              { runnerURN: "ppb:excRunner:1.160337366/3/0" },
              { runnerURN: "ppb:excRunner:1.160337366/4/0" },
              { runnerURN: "ppb:excRunner:1.160337366/5/0" },
              { runnerURN: "ppb:excRunner:1.160337366/6/0" },
              { runnerURN: "ppb:excRunner:1.160337366/7/0" },
              { runnerURN: "ppb:excRunner:1.160337366/8/0" },
              { runnerURN: "ppb:excRunner:1.160337366/9/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: `ppb:tbd:card:fixture:${EVENT_ID}`, __typename: "FixtureCard" } },
    { node: { urn: "ppb:tbd:card:group:topEventsInSport:2", __typename: "FilteredCouponCardGroup" } },
    { node: { urn: "ppb:tbd:card:29436223:CORRECT_SCORE", __typename: "MarketCard" } },
  ],
};

const BFF_AMERICAN_FORMAT_MOCK = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        home: "Reeves/OtherGuyFromTheMatrix",
        away: "Keeves/GuyFromFriends",
        sportevent: SPORT_EVENT,
        fixture: FIXTURE_AMERICAN_FORMAT,
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        filteredCouponTitle: COMPETITION.name,
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                title: COMPETITION.name,
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337358",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: SPORT_EVENT,
                        competition: {
                          name: COMPETITION.name,
                          competitionId: 12345,
                          urn: COMPETITION.urn,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337358/48044/0",
                          selectionId: 48044,
                          name: "Reeves/OtherGuyFromTheMatrix",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337358/48351/0",
                          selectionId: 48351,
                          name: "Keeves/GuyFromFriends",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337358/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337358/48351/0" },
                    ],
                  },
                },
                sportevent: SPORT_EVENT,
                fixture: FIXTURE_AMERICAN_FORMAT,
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              name: "Match Odds",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                competition: {
                  name: COMPETITION.name,
                  competitionId: 12345,
                  urn: COMPETITION.urn,
                },
                sportevent: {
                  name: "Sampras/Williams v Williams/Mcenroe",
                  urn: `ppb:event:${EVENT_ID}`,
                  competition: {
                    name: COMPETITION.name,
                    competitionId: 12345,
                    urn: COMPETITION.urn,
                  },
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337366/1/0",
                  selectionId: 1,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/2/0",
                  selectionId: 2,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/3/0",
                  selectionId: 3,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/4/0",
                  selectionId: 4,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/5/0",
                  selectionId: 5,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/6/0",
                  selectionId: 6,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/7/0",
                  selectionId: 7,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/8/0",
                  selectionId: 8,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/9/0",
                  selectionId: 9,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337366/1/0" },
              { runnerURN: "ppb:excRunner:1.160337366/2/0" },
              { runnerURN: "ppb:excRunner:1.160337366/3/0" },
              { runnerURN: "ppb:excRunner:1.160337366/4/0" },
              { runnerURN: "ppb:excRunner:1.160337366/5/0" },
              { runnerURN: "ppb:excRunner:1.160337366/6/0" },
              { runnerURN: "ppb:excRunner:1.160337366/7/0" },
              { runnerURN: "ppb:excRunner:1.160337366/8/0" },
              { runnerURN: "ppb:excRunner:1.160337366/9/0" },
            ],
          },
        },
      },
    },
  ],
};

const ERO_MOCK = [
  {
    marketId: "1.183826351",
    runners: [
      {
        selectionId: "25928050",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "11514894",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.265466387",
      runnerDetails: [
        {
          selectionId: "25928050",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "11514894",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SCA_IN_RUNNING_MOCK = {
  match: [
    {
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamAScore: "1",
      teamBScore: "1",
      currentSet: {
        teamAScore: "15",
        teamBScore: "0",
        currentGame: {
          teamAScore: "15",
          teamBScore: "30",
          teamServing: "HOME",
          type: "NORMAL",
        },
      },
    },
  ],
};

describe("Tennis Scoreboards", () => {
  describe("When at the event view and it's a doubles match with long names and without rank", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { disableCSSAnimations: true }));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1544]_should_display_scoreboards_long_names`);
    });

    it("[PRPI-1544]_should_display_scoreboards_long_names", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1544]_should_display_scoreboards_long_names`)).toEqual(0);
    });

    describe("and when scrolling", () => {
      beforeAll(async () => {
        await exchangeMarketPO.element.scrollIntoView({ behavior: "smooth", inline: "end" });
        await browser.waitUntilContainsClass(avbScoreboardPO.element, AvBScoreboardPO.states.viewSmall);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1545]_should_display_sticky_scoreboards_in_small_view`,
        );
      });

      it("[PRPI-1545]_should_display_sticky_scoreboards_in_small_view", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1545]_should_display_sticky_scoreboards_in_small_view`),
        ).toBeLessThanOrEqual(0.001);
      });
    });
  });

  describe("when a tennis fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn, { disableCSSAnimations: true }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1546]_should_display_inverted_scoreboard`);
    });

    it("[PRPI-1546]_should_display_inverted_scoreboard", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1546]_should_display_inverted_scoreboard`)).toEqual(0);
    });
  });
});
