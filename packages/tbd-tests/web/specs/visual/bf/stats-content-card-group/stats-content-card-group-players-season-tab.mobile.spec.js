const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
const { PebbleListPO } = require("../../../../page-objects");
const { getCardResults, getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const MODULE_NAME = "stats_content_card_group";
const mockService = new MockService();

const statsContentCardGroupPO = new StatsContentCardGroupPO();

const EVENT_ID = "1";

const STATS_CONTENT_CARD_GROUP_MOCK = {
  __typename: "StatsContentCardGroup",
  urn: `ppb:tbd:stats:cardgroup:statsContent:Zw--rBIAACMAfYAw/e/${EVENT_ID}`,
  partials: {
    edges: [
      {
        displayName: {
          translationKey: "Player",
          __typename: "DisplayNameTranslationKey",
        },
        type: "PLAYER",
        node: {
          urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}|player`,
          __typename: "StatsPebbleCardGroup",
        },
      },
    ],
  },
};

const STATS_CONTENT_CARD_GROUP_MOCK_CARD = {
  cards: [STATS_CONTENT_CARD_GROUP_MOCK],
};

const STATS_CONTENT_CARD_GROUP_PARTIALS_MOCK = {
  __typename: "StatsContentCardGroup",
  urn: `ppb:tbd:stats:cardgroup:statsContent:Zw--rBIAACMAfYAw/e/${EVENT_ID}`,
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  url: routes.getEventViewUrl(EVENT_ID),
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
  },
  edges: [
    {
      node: STATS_CONTENT_CARD_GROUP_MOCK,
    },
  ],
  partialEdges: [
    {
      node: STATS_CONTENT_CARD_GROUP_PARTIALS_MOCK,
    },
  ],
};

const BFF_MOCK_CARDS_WITH_STATS_PLAYERS_PEBBLE = {
  cards: [
    {
      __typename: "StatsPebbleCardGroup",
      urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}|player`,
      status: "PRE_MATCH",
      full: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.ATTACKING",
            },
            type: "PLAYER",
            node: {
              __typename: "StatsPlayersSeasonStatsCard",
              urn: `ppb:tbd:stats:card:playersSeasonStats:${EVENT_ID}|attacking`,
              fixture: {
                urn: `ppb:fixture:${EVENT_ID}`,
                players: [
                  {
                    id: "1",
                    urn: `ppb:player:1|${EVENT_ID}`,
                    name: "Player 01",
                    seasonStats: {
                      totals: {
                        goals: 5,
                        firstGoalScored: 2,
                        lastGoalScored: 3,
                        shotsOnTarget: 10,
                        yellowCards: 1,
                        redCards: 1,
                      },
                      averages: {
                        fouls: 700,
                      },
                    },
                  },
                  {
                    id: "2",
                    urn: `ppb:player:2|${EVENT_ID}`,
                    name: "Player 02",
                    seasonStats: {
                      totals: {
                        goals: 10,
                        firstGoalScored: 2,
                        lastGoalScored: 3,
                        shotsOnTarget: 7,
                        yellowCards: 2,
                        redCards: 1,
                      },
                      averages: {
                        fouls: 1,
                      },
                    },
                  },
                  {
                    id: "3",
                    urn: `ppb:player:3|${EVENT_ID}`,
                    name: "Player 03",
                    seasonStats: {
                      totals: {
                        goals: 10,
                        firstGoalScored: 2,
                        lastGoalScored: 3,
                        shotsOnTarget: 7,
                        yellowCards: 2,
                        redCards: 1,
                      },
                      averages: {
                        fouls: 1,
                      },
                    },
                  },
                  {
                    id: "4",
                    urn: `ppb:player:4|${EVENT_ID}`,
                    name: "Player 04",
                    seasonStats: {
                      totals: {
                        goals: 10,
                        firstGoalScored: 2,
                        lastGoalScored: 3,
                        shotsOnTarget: 7,
                        yellowCards: 2,
                        redCards: 1,
                      },
                      averages: {
                        fouls: 1,
                      },
                    },
                  },
                  {
                    id: "5",
                    urn: `ppb:player:5|${EVENT_ID}`,
                    name: "Player 05",
                    seasonStats: {
                      totals: {
                        goals: 10,
                        firstGoalScored: 2,
                        lastGoalScored: 3,
                        shotsOnTarget: 7,
                        yellowCards: 2,
                        redCards: 1,
                      },
                      averages: {
                        fouls: 1,
                      },
                    },
                  },
                  {
                    id: "6",
                    urn: `ppb:player:6|${EVENT_ID}`,
                    name: "Player 06",
                    seasonStats: {
                      totals: {
                        goals: 10,
                        firstGoalScored: 2,
                        lastGoalScored: 3,
                        shotsOnTarget: 7,
                        yellowCards: 2,
                        redCards: 1,
                      },
                      averages: {
                        fouls: 1,
                      },
                    },
                  },
                ],
                home: {
                  name: "Everton",
                  squad: {
                    players: [
                      {
                        id: "2",
                      },
                      {
                        id: "4",
                      },
                      {
                        id: "6",
                      },
                    ],
                  },
                },
                away: {
                  name: "Man Utd",
                  squad: {
                    players: [
                      {
                        id: "1",
                      },
                      {
                        id: "3",
                      },
                      {
                        id: "5",
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
      partials: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.ATTACKING",
            },
            node: {
              __typename: "StatsPlayersSeasonStatsCard",
              urn: `ppb:tbd:stats:card:playersSeasonStats:${EVENT_ID}|attacking`,
            },
          },
          {
            displayName: {
              translationKey: "I18N.STATS.DEFENDING",
            },
            node: {
              __typename: "StatsPlayersSeasonStatsCard",
              urn: `ppb:tbd:stats:card:playersSeasonStats:${EVENT_ID}|defending`,
            },
          },
        ],
      },
    },
  ],
};

const BFF_MOCK_WITH_STATS_PLAYER_DEFENDING = {
  cards: [
    {
      __typename: "StatsPlayersSeasonStatsCard",
      urn: `ppb:tbd:stats:card:playersSeasonStats:${EVENT_ID}|defending`,
      fixture: {
        urn: `ppb:fixture:${EVENT_ID}`,
        players: [
          {
            id: "1",
            urn: `ppb:player:1|${EVENT_ID}`,
            name: "Player 01",
            seasonStats: {
              totals: {
                goals: 5,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 10,
                yellowCards: 1,
                redCards: 1,
              },
              averages: {
                fouls: 1.941,
              },
            },
          },
          {
            id: "2",
            urn: `ppb:player:2|${EVENT_ID}`,
            name: "Player 02",
            seasonStats: {
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
              },
              averages: {
                fouls: 1,
              },
            },
          },
          {
            id: "3",
            urn: `ppb:player:3|${EVENT_ID}`,
            name: "Player 03",
            seasonStats: {
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
              },
              averages: {
                fouls: 1,
              },
            },
          },
          {
            id: "4",
            urn: `ppb:player:4|${EVENT_ID}`,
            name: "Player 04",
            seasonStats: {
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
              },
              averages: {
                fouls: 1,
              },
            },
          },
          {
            id: "5",
            urn: `ppb:player:5|${EVENT_ID}`,
            name: "Player 05",
            seasonStats: {
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
              },
              averages: {
                fouls: 1,
              },
            },
          },
          {
            id: "6",
            urn: `ppb:player:6|${EVENT_ID}`,
            name: "Player 06",
            seasonStats: {
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
              },
              averages: {
                fouls: 1,
              },
            },
          },
        ],
        home: {
          name: "Everton",
          squad: {
            players: [
              {
                id: "2",
              },
              {
                id: "4",
              },
              {
                id: "6",
              },
            ],
          },
        },
        away: {
          name: "Man Utd",
          squad: {
            players: [
              {
                id: "1",
              },
              {
                id: "3",
              },
              {
                id: "5",
              },
            ],
          },
        },
      },
    },
  ],
};

const BFF_MOCK_WITH_STATS_PLAYER_ATTACKING = {
  cards: [
    {
      __typename: "StatsPlayersSeasonStatsCard",
      urn: `ppb:tbd:stats:card:playersSeasonStats:${EVENT_ID}|attacking`,
      fixture: {
        urn: `ppb:fixture:${EVENT_ID}`,
        players: [
          {
            id: "1",
            urn: `ppb:player:1|${EVENT_ID}`,
            name: "Player 01",
            seasonStats: {
              matchesPlayed: 20,
              totals: {
                goals: 5,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 10,
                yellowCards: 1,
                redCards: 1,
                assists: 3,
                fouls: null,
                tacklesMade: null,
              },
            },
          },
          {
            id: "2",
            urn: `ppb:player:2|${EVENT_ID}`,
            name: "Player 02",
            seasonStats: {
              matchesPlayed: 25,
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
                assists: 5,
                fouls: null,
                tacklesMade: null,
              },
            },
          },
          {
            id: "3",
            urn: `ppb:player:3|${EVENT_ID}`,
            name: "Player 03",
            seasonStats: {
              matchesPlayed: 25,
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
                assists: 5,
                fouls: null,
                tacklesMade: null,
              },
            },
          },
          {
            id: "4",
            urn: `ppb:player:4|${EVENT_ID}`,
            name: "Player 04",
            seasonStats: {
              matchesPlayed: 25,
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
                assists: 5,
                fouls: null,
                tacklesMade: null,
              },
            },
          },
          {
            id: "5",
            urn: `ppb:player:5|${EVENT_ID}`,
            name: "Player 05",
            seasonStats: {
              matchesPlayed: 25,
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
                assists: 5,
                fouls: null,
                tacklesMade: null,
              },
            },
          },
          {
            id: "6",
            urn: `ppb:player:6|${EVENT_ID}`,
            name: "Player 06",
            seasonStats: {
              matchesPlayed: 25,
              totals: {
                goals: 10,
                firstGoalScored: 2,
                lastGoalScored: 3,
                shotsOnTarget: 7,
                yellowCards: 2,
                redCards: 1,
                assists: 5,
                fouls: null,
                tacklesMade: null,
              },
            },
          },
        ],
        home: {
          name: "Everton",
          squad: {
            players: [
              {
                id: "2",
              },
              {
                id: "4",
              },
              {
                id: "6",
              },
            ],
          },
        },
        away: {
          name: "Man Utd",
          squad: {
            players: [
              {
                id: "1",
              },
              {
                id: "3",
              },
              {
                id: "5",
              },
            ],
          },
        },
      },
    },
  ],
};

describe("Football stats in Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getCardResults(STATS_CONTENT_CARD_GROUP_MOCK_CARD));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  });

  describe("when user clicks on Players tab", () => {
    const playersTab = statsContentCardGroupPO.tabs[0];

    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_PLAYERS_PEBBLE));
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_PLAYER_ATTACKING));

      await playersTab.waitForClickable();
      await playersTab.click();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1556]_should_correctly_display_the_players_attacking_content`,
      );
    });

    it("[PRPI-1556]_should_correctly_display_the_players_attacking_content", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1556]_should_correctly_display_the_players_attacking_content`),
      ).toBe(0);
    });

    describe("and the user clicks on the defending pebble", () => {
      const pebblesPO = new PebbleListPO();
      const secondPebble = pebblesPO.pebbles[1];

      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_PLAYER_DEFENDING));
        await secondPebble.waitForClickable();
        await secondPebble.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1557]_should_correctly_display_the_players_defending_content`,
        );
      });

      it("[PRPI-1557]_should_correctly_display_the_players_defending_content", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1557]_should_correctly_display_the_players_defending_content`,
          ),
        ).toBe(0);
      });
    });
  });
});
