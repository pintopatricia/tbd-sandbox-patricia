const {
  getPlayerViewLayout,
  getCardResults,
  getQueryCardResponseByOperation,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const {
  PlayerViewPO,
  FootballPlayerCompetitionStatsCardPO,
  FootballPlayerCompetitionStatsCardStatItemPO,
  FootballScoreboardPO,
  CardPO,
  FooterPO,
  RunnerPO,
  SportsbookPlacePanelPO,
} = require("../../../../../page-objects");
const PebbleCardGroupPO = require("@ppb/tbd-shared/components/PebbleCardGroup/PebbleCardGroup.po");

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:player:71823|35049415",
  url: "player/bruno-fernandes/pl-71823%7C35049415",
  context: {
    player: {
      id: "71823",
      urn: "ppb:tbd:player:71823|35049415",
      name: "Bruno Fernandes",
      position: "MIDFIELDER",
      shirtNumber: "7",
    },
    team: {
      name: "Brighton",
      color: "0057B8",
    },
  },
  items: {
    edges: [
      {
        node: {
          __typename: "FootballPlayerCompetitionStatsCard",
          urn: "ppb:tbd:card:footballplayercompetitionstats:71823|35049415",
        },
      },
      {
        node: {
          __typename: "PlayerMarketsCardGroup",
          urn: "ppb:tbd:cardgroup:playermarkets:71823|35049415",
        },
      },
      {
        node: {
          __typename: "RegulatoryCard",
          urn: "ppb:tbd:card:regulatory:footer",
        },
      },
    ],
  },
};

const BFF_FOOTBALL_COMPETITITON_STATS_CARD_MOCK = {
  __typename: "FootballPlayerCompetitionStatsCard",
  urn: "ppb:tbd:card:footballplayercompetitionstats:71823|35049415",
  player: {
    seasonStats: {
      matchesPlayed: 6,
      totals: {
        goals: 6,
        yellowCards: 5,
        redCards: 4,
        assists: 1,
        __typename: "FootballPlayerFixtureStat",
      },
      __typename: "FootballPlayerFixtureSeasonStats",
    },
    __typename: "FootballPlayerFixture",
  },
};

const BFF_FIXTURE_CARD_MOCK = {
  __typename: "FixtureCard",
  urn: "ppb:tbd:card:fixture:35049415",
  fixture: {
    __typename: "FootballFixture",
    urn: "ppb:fixture:35049415",
    home: {
      name: "Bodo Glimt",
      color: null,
      crest: null,
      __typename: "FootballTeamDetails",
    },
    away: {
      name: "Man City",
      color: "6CABDD",
      crest: null,
      __typename: "FootballTeamDetails",
    },
    isAmericanFormat: false,
    runnerNames: {
      home: "Bodo Glimt",
      away: "Man City",
      __typename: "FixtureRunnerNames",
    },
    scheduledAt: "2026-01-20T17:45:00Z",
    startedAt: "2026-01-20T17:45:00Z",
    score: null,
    firstLegScore: null,
    duration: {
      period: "REGULAR",
      status: "PRE_MATCH",
      clock: null,
      stoppageMinutes: null,
      __typename: "FootballMatchDuration",
    },
    penaltyShootout: null,
  },
  fixtureEventViewLink: null,
  sportevent: {
    __typename: "SportsEvent",
    urn: "ppb:event:35049415",
    eventId: 35049415,
    name: "Bodo Glimt v Man City",
    openDate: "2026-01-20T17:45:00.000Z",
    competition: {
      __typename: "Competition",
      urn: "ppb:competition:228",
      name: "UEFA Champions League",
      competitionId: 228,
      sport: {
        __typename: "Sport",
        urn: "ppb:eventType:1",
        name: "Football",
        sportId: 1,
      },
    },
  },
  red7Scoreboard: null,
};

const BFF_PEBBLE_MOCK = {
  __typename: "PebbleCardGroup",
  urn: "pbb:tbd:card:pebble:player:goalscorers|71823|35049415",
  pebbleExpanded: true,
  pebbleCardGroupTitle: {
    translated: "Goalscorers",
    translate: null,
    __typename: "TranslatableText",
  },
  favouriteMarketsState: null,
  pebbleCardGroupIcon: null,
  outerTitle: null,
  viewOpenBets: null,
  viewAll: null,
  selectedItemUrn: "ppb:tbd:card:player:grid:to-score|71823|35049415",
  full: {
    edges: [
      {
        name: "To Score",
        node: {
          __typename: "GridCard",
          urn: "ppb:tbd:card:player:grid:to-score|71823|35049415",
          numberOfItemsToDisplay: 4,
          layout: "VERTICAL_MARKETS",
          markets: [
            {
              displayLabel: {
                __typename: "DisplayNameTitle",
                name: "Anytime",
              },
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:930.347069446",
                name: "To Score in 90mins",
                marketType: "TO_SCORE",
                marketTypeName: null,
                bettingType: "ODDS",
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: true,
                  sportsbookMarketStatus: "OPEN",
                  runners: [
                    {
                      __typename: "SportsbookRunnerLiveData",
                      urn: "ppb:tbd:sbkRunnerLiveData:930.347069446/25522262",
                      marketURN: "ppb:sbkMarket:930.347069446",
                      runnerURN: "ppb:sbkRunner:930.347069446/25522262",
                      selectionId: 25522262,
                      runnerStatus: "ACTIVE",
                      handicap: 0,
                      odds: {
                        decimal: 17,
                        fractional: {
                          denominator: 1,
                          numerator: 16,
                          __typename: "FractionalOdds",
                        },
                        __typename: "SportsbookOdds",
                      },
                      displayOdds: {
                        decimal: 17,
                        fractional: {
                          denominator: 1,
                          numerator: 16,
                          __typename: "FractionalOdds",
                        },
                        __typename: "SportsbookOdds",
                      },
                    },
                  ],

                  __typename: "SportsbookMarketLiveData",
                },
                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:35049415",
                    eventId: 35049415,
                    name: "Bodo Glimt v Man City",
                    openDate: "2026-01-20T17:45:00.000Z",
                    competition: {
                      __typename: "Competition",
                      urn: "ppb:competition:228",
                      name: "UEFA Champions League",
                      competitionId: 228,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                        sportId: 1,
                      },
                    },
                  },
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:228",
                    name: "UEFA Champions League",
                    competitionId: 228,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:930.347069446/25522262",
                    name: "Bruno Fernandes",
                    selectionId: 25522262,
                    handicap: 0,
                    resultType: null,
                  },
                ],

                isOddsboostMarketType: false,
                isSuperSub: true,
                isAccaFreezeEligible: false,
              },
              __typename: "GridMarket",
            },
            {
              displayLabel: {
                __typename: "DisplayNameTitle",
                name: "1st",
              },
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:930.347069448",
                name: "1st Goalscorer",
                marketType: "FIRST_GOAL_SCORER",
                marketTypeName: null,
                bettingType: "ODDS",
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: true,
                  sportsbookMarketStatus: "OPEN",
                  runners: [
                    {
                      __typename: "SportsbookRunnerLiveData",
                      urn: "ppb:tbd:sbkRunnerLiveData:930.347069448/25522262",
                      marketURN: "ppb:sbkMarket:930.347069448",
                      runnerURN: "ppb:sbkRunner:930.347069448/25522262",
                      selectionId: 25522262,
                      runnerStatus: "ACTIVE",
                      handicap: 0,
                      odds: {
                        decimal: 17,
                        fractional: {
                          denominator: 1,
                          numerator: 16,
                          __typename: "FractionalOdds",
                        },
                        __typename: "SportsbookOdds",
                      },
                      displayOdds: {
                        decimal: 17,
                        fractional: {
                          denominator: 1,
                          numerator: 16,
                          __typename: "FractionalOdds",
                        },
                        __typename: "SportsbookOdds",
                      },
                    },
                  ],

                  __typename: "SportsbookMarketLiveData",
                },
                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:35049415",
                    eventId: 35049415,
                    name: "Bodo Glimt v Man City",
                    openDate: "2026-01-20T17:45:00.000Z",
                    competition: {
                      __typename: "Competition",
                      urn: "ppb:competition:228",
                      name: "UEFA Champions League",
                      competitionId: 228,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                        sportId: 1,
                      },
                    },
                  },
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:228",
                    name: "UEFA Champions League",
                    competitionId: 228,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:930.347069448/25522262",
                    name: "Bruno Fernandes",
                    selectionId: 25522262,
                    handicap: 0,
                    resultType: "AWAY",
                  },
                ],

                isOddsboostMarketType: false,
                isSuperSub: true,
                isAccaFreezeEligible: false,
              },
              __typename: "GridMarket",
            },
          ],

          runners: [
            {
              displayName: {
                __typename: "DisplayNameTitle",
                name: "Bruno Fernandes",
              },
              runner: {
                runnerURN: "ppb:sbkRunner:930.347069448/25522262",
                selectionId: 25522262,
                marketURN: "ppb:sbkMarket:930.347069448",
                __typename: "Runner",
              },
              __typename: "GridRunner",
            },
          ],
        },
        __typename: "PebbleCardEdge",
      },
    ],

    __typename: "PebbleLayoutItemsConnection",
  },
  partials: {
    edges: [
      {
        name: "To Score",
        node: {
          urn: "ppb:tbd:card:player:grid:to-score|71823|35049415",
          __typename: "GridCard",
        },
        __typename: "PebbleCardEdge",
      },
    ],

    __typename: "PebbleLayoutItemsConnection",
  },
};

const BFF_PLAYERS_MARKET_CARD_GROUP_MOCK = {
  __typename: "PlayerMarketsCardGroup",
  urn: "ppb:tbd:cardgroup:playermarkets:71823|35049415",
  fixtureCard: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:35049415",
  },
  items: {
    edges: [
      {
        node: {
          __typename: "PebbleCardGroup",
          urn: "pbb:tbd:card:pebble:player:goalscorers|71823|35049415",
        },
        __typename: "PlayerMarketsCardGroupItemEdge",
      },
    ],

    __typename: "PlayerMarketsCardGroupItemsConnection",
  },
};

const BFF_REGULATORY_CARD_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
            items: [
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/over18.png",
                alignment: "LEFT",
                alt: null,
                target: "POPUP",
                link: "http://content.betfair.com/misc/?product=portal&sWhichKey=gamCare&locale=en_GB&region=GBR&brand=betfair&entrydomain=betfair.com",
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
    },
  ],

  bottomBar: {},
};

const mockService = new MockService();
const playerViewPO = new PlayerViewPO();
const footballPlayerCompetitionStatsCardPO = new FootballPlayerCompetitionStatsCardPO(playerViewPO.element);

describe("PlayerView", () => {
  beforeAll(async () => {
    // Apollo components
    await mockService.mockHttpRequest(
      getQueryCardResponseByOperation("FootballPlayerCompetitionStatsCard", BFF_FOOTBALL_COMPETITITON_STATS_CARD_MOCK),
    );
    await mockService.mockHttpRequest(
      getQueryCardResponseByOperation("PlayerMarketsCardGroup", BFF_PLAYERS_MARKET_CARD_GROUP_MOCK),
    );

    // Cards
    await mockService.mockHttpRequest(getCardResults({ cards: [BFF_FIXTURE_CARD_MOCK] }));
    await mockService.mockHttpRequest(getCardResults({ cards: [BFF_PEBBLE_MOCK] }));
    await mockService.mockHttpRequest(getCardResults({ cards: [BFF_REGULATORY_CARD_MOCK.edges[0].node] }));

    await mockService.mockHttpRequest(getPlayerViewLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    const routePath = routes.getPlayerViewUrl("71823|35049415", "bruno-fernandes");

    await browser.url(routePath);

    await browser.waitUntilDisplayed(playerViewPO.playerName);
    await browser.waitUntilDisplayed(footballPlayerCompetitionStatsCardPO.title);
  });

  describe("Components", () => {
    describe("PageHeader", () => {
      it("[PRPI-4133] displays the correct player info", async () => {
        expect(await playerViewPO.playerName.getText()).toBe("Bruno Fernandes");
        expect(await playerViewPO.playerPosition.getText()).toBe("MIDFIELDER");
        expect(await playerViewPO.playerShirtNumber.getText()).toBe("7");
      });
    });

    describe("FootballPlayerCompetitionStatsCard", () => {
      it("[PRPI-4134] displays the correct player stats", async () => {
        const statItems = footballPlayerCompetitionStatsCardPO.statItems;
        const goalsStat = new FootballPlayerCompetitionStatsCardStatItemPO(statItems[0]);
        const assitsStat = new FootballPlayerCompetitionStatsCardStatItemPO(statItems[1]);
        const cardsStat = new FootballPlayerCompetitionStatsCardStatItemPO(statItems[2]);

        expect(await footballPlayerCompetitionStatsCardPO.title.getText()).toBe("Performance");
        expect(await footballPlayerCompetitionStatsCardPO.headerTitle.getText()).toBe("Competition Stats");

        expect(await statItems.length).toBe(3);

        expect(await goalsStat.label.getText()).toBe("Goals");
        expect(await goalsStat.value.getText()).toBe("6");

        expect(await assitsStat.label.getText()).toBe("Assists");
        expect(await assitsStat.value.getText()).toBe("1");

        expect(await cardsStat.label.getText()).toBe("Cards");
        expect(await cardsStat.value.getText()).toBe("9");
      });
    });

    describe("Fixture Card", () => {
      const footballScoreboardPO = new FootballScoreboardPO(playerViewPO.element);

      beforeAll(async () => {
        await browser.waitUntilDisplayed(footballScoreboardPO.element);
      });

      it("[PRPI-4135] The scoreboard should be displayed", async () => {
        expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
      });
    });

    describe("PebbleCardGroup", () => {
      const pebbleCardGroupPO = new PebbleCardGroupPO(playerViewPO.element);
      const pebbleCardGroupCardPO = new CardPO(pebbleCardGroupPO.element);
      const runnerMarketSportsbookPO = new RunnerPO(pebbleCardGroupCardPO.element);
      const placePanelPO = new SportsbookPlacePanelPO();

      beforeAll(async () => {
        await runnerMarketSportsbookPO.sportsbookBetButton.scrollIntoView();
        await runnerMarketSportsbookPO.sportsbookBetButton.waitForClickable();
      });

      it("[PRPI-4136] The pebblecardgroup should be displayed", async () => {
        expect(await pebbleCardGroupPO.element.isDisplayed()).toBe(true);
        expect(await pebbleCardGroupCardPO.content.isDisplayed()).toBe(true);
      });

      it("[PRPI-4238] The pebblecardgroup should be visible with 'Goalscorers' title", async () => {
        expect(await pebbleCardGroupPO.collapseTitle.getText()).toBe("Goalscorers");
      });

      it("[PRPI-4239] Pressing the BetButton should open the BetSlip", async () => {
        await runnerMarketSportsbookPO.sportsbookBetButton.click();

        await browser.waitUntilDisplayed(placePanelPO.element);
        expect(await placePanelPO.element.isDisplayed()).toBe(true);

        await placePanelPO.removeAll.click();
        expect(await placePanelPO.element.isDisplayed()).toBe(false);
      });
    });

    describe("RegulatoryCard", () => {
      const footerPO = new FooterPO();

      beforeAll(async () => {
        await footerPO.element.scrollIntoView();
        await browser.waitUntilDisplayed(footerPO.element);
      });

      it("[PRPI-4137] the footer should be displayed", async () => {
        expect(await footerPO.sections.length).toBe(1);
        expect(await footerPO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
