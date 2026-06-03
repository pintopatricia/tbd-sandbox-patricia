const StatsContentCardGroupSO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.so");
const { getAppContext, getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { PebbleListSO, GenericScreenSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");

const CARD_NAME = "stats_content_card_group";
const genericScreenSO = new GenericScreenSO();
const statsContentCardGroupSO = new StatsContentCardGroupSO();

const MODULE_NAME = "stats_content_card_group";
const mockService = new MockService();

const EVENT_ID = "1";

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:Zo_esxAAACIAftCe/e/${EVENT_ID}`,
        partials: {
          edges: [
            {
              displayName: {
                translationKey: "Player",
              },
              type: "PLAYER",
              node: {
                urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}|player`,
              },
            },
          ],
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
            type: "PLAYER",
            node: {
              __typename: "StatsPlayersSeasonStatsCard",
              urn: `ppb:tbd:stats:card:playersSeasonStats:${EVENT_ID}|attacking`,
            },
          },
          {
            displayName: {
              translationKey: "I18N.STATS.DEFENDING",
            },
            type: "PLAYER",
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
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));

    await startApp("home");

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when user clicks on Players tab", () => {
    const playersTab = statsContentCardGroupSO.tabs[0];

    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_PLAYERS_PEBBLE));
      await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_PLAYER_ATTACKING));

      await browser.waitUntilClickableNative(playersTab, "Players Tab is not clickable");
      await playersTab.click();

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4575]_should_correctly_display_the_players_attacking_content`,
      );
    });

    it("[PRPI-4575]_should_correctly_display_the_players_attacking_content", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4575]_should_correctly_display_the_players_attacking_content`))
          .misMatchPercentage,
      ).toEqual(0);
    });

    describe("and the user clicks on the defending pebble", () => {
      const pebblesSO = new PebbleListSO();
      const secondPebble = pebblesSO.pebbleListElements[1];

      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_PLAYER_DEFENDING));
        await browser.waitUntilClickableNative(secondPebble, "Defending Pebble is not clickable");
        await secondPebble.click();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4576]_should_correctly_display_the_players_defending_content`,
        );
      });

      it("[PRPI-4576]_should_correctly_display_the_players_defending_content", async () => {
        expect(
          (
            await browser.compareScreen(
              `${CARD_NAME}_[PRPI-4576]_should_correctly_display_the_players_defending_content`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
