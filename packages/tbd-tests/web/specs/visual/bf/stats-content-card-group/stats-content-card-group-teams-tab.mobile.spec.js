const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
const { PebbleListPO } = require("../../../../page-objects");
const { getCardResults, getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const MODULE_NAME = "stats_content_card_group";
const mockService = new MockService();

const statsContentCardGroupPO = new StatsContentCardGroupPO();

const EVENT_ID = "1";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  url: `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:Zo_esxAAACIAftCe/e/${EVENT_ID}`,
        partials: {
          edges: [
            {
              displayName: {
                translationKey: "Form",
                __typename: "DisplayNameTranslationKey",
              },
              type: "FORM",
              node: {
                urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}`,
                __typename: "StatsPebbleCardGroup",
              },
              __typename: "StatsPebbleItemEdge",
            },
            {
              displayName: {
                translationKey: "Team",
                __typename: "DisplayNameTranslationKey",
              },
              type: "FORM",
              node: {
                urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}|team`,
                __typename: "StatsPebbleCardGroup",
              },
              __typename: "StatsPebbleItemEdge",
            },
          ],

          __typename: "StatsContentItemsConnection",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:Zo_esxAAACIAftCe/e/${EVENT_ID}`,
      },
    },
  ],
};

const BFF_MOCK_CARDS_WITH_STATS_CONTENT = {
  cards: [
    {
      __typename: "StatsContentCardGroup",
      urn: `ppb:tbd:stats:cardgroup:statsContent:Zo_esxAAACIAftCe/e/${EVENT_ID}`,
      partials: {
        edges: [
          {
            displayName: {
              translationKey: "Form",
              __typename: "DisplayNameTranslationKey",
            },
            type: "FORM",
            node: {
              urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}`,
              __typename: "StatsPebbleCardGroup",
            },
            __typename: "StatsPebbleItemEdge",
          },
          {
            displayName: {
              translationKey: "Team",
              __typename: "DisplayNameTranslationKey",
            },
            type: "FORM",
            node: {
              urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}|team`,
              __typename: "StatsPebbleCardGroup",
            },
            __typename: "StatsPebbleItemEdge",
          },
        ],

        __typename: "StatsContentItemsConnection",
      },
    },
  ],
};

const BFF_MOCK_CARDS_WITH_STATS_TEAMS_PEBBLE = {
  cards: [
    {
      __typename: "StatsPebbleCardGroup",
      urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}|team`,
      selectedItemUrn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}|team`,
      status: "PRE_MATCH",
      full: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.LAST_FIVE",
              __typename: "DisplayNameTranslationKey",
            },
            node: {
              __typename: "StatsTeamsCard",
              urn: `ppb:tbd:stats:card:teams:${EVENT_ID}|previousFive`,
              fixture: {
                teams: [
                  {
                    urn: `ppb:stats:footballTeam:1|${EVENT_ID}`,
                    name: "Home",
                    statsAllSeason: {
                      averageGoalsScored: {
                        home: 15,
                      },
                      averageGoalsConceded: {},
                      averageBookingPoints: {},
                      averageCorners: {},
                      bothTeamsToScore: {},
                      averageShots: 1,
                    },
                    statsPreviousFive: {
                      averageGoalsScored: {
                        home: 10,
                      },
                      averageGoalsConceded: {},
                      averageBookingPoints: {},
                      averageCorners: {},
                      bothTeamsToScore: {},
                      averageShots: 1,
                    },
                  },
                  {
                    urn: `ppb:stats:footballTeam:2|${EVENT_ID}`,
                    name: "Away",
                    statsAllSeason: {
                      averageGoalsScored: {
                        home: 15,
                      },
                      averageGoalsConceded: {},
                      averageBookingPoints: {},
                      averageCorners: {},
                      bothTeamsToScore: {},
                      averageShots: 1,
                    },
                    statsPreviousFive: {
                      averageGoalsScored: {
                        home: 15,
                      },
                      averageGoalsConceded: {},
                      averageBookingPoints: {},
                      averageCorners: {},
                      bothTeamsToScore: {},
                      averageShots: 1,
                    },
                  },
                ],
              },
            },
            __typename: "PebbleCardEdge",
          },
        ],

        __typename: "PebbleLayoutItemsConnection",
      },
      partials: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.LAST_FIVE",
              __typename: "DisplayNameTranslationKey",
            },
            node: {
              urn: `ppb:tbd:stats:card:teams:${EVENT_ID}|previousFive`,
              __typename: "StatsTeamsCard",
            },
            __typename: "PebbleCardEdge",
          },

          {
            displayName: {
              translationKey: "I18N.STATS.ALL_SEASON",
              __typename: "DisplayNameTranslationKey",
            },
            node: {
              urn: `ppb:tbd:stats:card:teams:${EVENT_ID}|allSeason`,
              __typename: "StatsTeamsCard",
            },
            __typename: "PebbleCardEdge",
          },
        ],
      },
    },
  ],
};

const BFF_MOCK_WITH_STATS_TEAMS_ALL_SEASON_CARD = {
  cards: [
    {
      __typename: "StatsTeamsCard",
      urn: `ppb:tbd:stats:card:teams:${EVENT_ID}|allSeason`,
      fixture: {
        teams: [
          {
            urn: `ppb:stats:footballTeam:1|${EVENT_ID}`,
            name: "Home",
            statsAllSeason: {
              averageGoalsScored: {
                home: 15,
              },
              averageGoalsConceded: {},
              averageBookingPoints: {},
              averageCorners: {},
              bothTeamsToScore: {},
              averageShots: 1,
            },
            statsPreviousFive: {
              averageGoalsScored: {
                home: 15,
              },
              averageGoalsConceded: {},
              averageBookingPoints: {},
              averageCorners: {},
              bothTeamsToScore: {},
              averageShots: 1,
            },
          },
          {
            urn: `ppb:stats:footballTeam:2|${EVENT_ID}`,
            name: "Away",
            statsAllSeason: {
              averageGoalsScored: {
                home: 15,
              },
              averageGoalsConceded: {},
              averageBookingPoints: {},
              averageCorners: {},
              bothTeamsToScore: {},
              averageShots: 1,
            },
            statsPreviousFive: {
              averageGoalsScored: {
                home: 15,
              },
              averageGoalsConceded: {},
              averageBookingPoints: {},
              averageCorners: {},
              bothTeamsToScore: {},
              averageShots: 1,
            },
          },
        ],
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: `924.1`,
      runnerDetails: [1, 2, 3].map((key) => ({
        selectionId: key,
        runnerOdds: {
          decimalDisplayOdds: { decimalOdds: 1 + key * 0.1 },
        },
        runnerStatus: "ACTIVE",
      })),
    },
  ],
};

describe("Football stats in Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_CONTENT));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  });

  describe("when user clicks on the team tab", () => {
    const teamsTab = statsContentCardGroupPO.tabs[1];

    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_TEAMS_PEBBLE));

      await teamsTab.waitForClickable();
      await teamsTab.click();

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1560]_should_correctly_display_the_stats_team_previous_five_games_content`,
      );
    });

    it("[PRPI-1560]_should_correctly_display_the_stats_team_previous_five_games_content", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1560]_should_correctly_display_the_stats_team_previous_five_games_content`,
        ),
      ).toBe(0);
    });

    describe("when user clicks on the all season pebble", () => {
      const pebblesPO = new PebbleListPO();
      const secondPebble = pebblesPO.pebbles[1];

      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_TEAMS_ALL_SEASON_CARD));
        await secondPebble.waitForClickable();
        await secondPebble.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1561]_should_correct_display_the_stats_all_season_content`,
        );
      });

      it("[PRPI-1561]_should_correct_display_the_stats_all_season_content", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1561]_should_correct_display_the_stats_all_season_content`),
        ).toBe(0);
      });
    });
  });
});
