const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const StatsContentCardGroupSO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.so");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { GenericScreenSO } = require("../../../../../screen-objects");

const CARD_NAME = "stats_content_card_group";
const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const statsContentCardGroupSO = new StatsContentCardGroupSO();

const EVENT_ID = "1";

const BFF_MOCK_HOME_VIEW = {
  urn: `ppb:tbd:view:generic:home`,
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
              node: {
                urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}`,
                __typename: "StatsPebbleCardGroup",
              },
              __typename: "StatsPebbleItemEdge",
            },
            {
              __typename: "StatsTableItemEdge",
              displayName: {
                __typename: "DisplayNameTranslationKey",
                translationKey: "Table",
              },
              node: {
                __typename: "StatsTableCard",
                urn: `ppb:tbd:stats:card:table:${EVENT_ID}`,
              },
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
const BFF_MOCK_TABLE_CARD = {
  cards: [
    {
      __typename: "StatsTableCard",
      urn: `ppb:tbd:stats:card:table:${EVENT_ID}`,
      fixture: {
        __typename: "FootballFixture",
        urn: `ppb:fixture:${EVENT_ID}`,
        competition: {
          __typename: "FootballCompetition",
          id: "1",
          stages: [
            {
              __typename: "FootballCompetitionStage",
              standings: [
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 31,
                  win: 19,
                  loss: 3,
                  draw: 9,
                  points: 66,
                  goalsDifference: 43,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "Leeds United",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 1,
                    status: "PROMOTION",
                    change: "UP",
                  },
                },
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 31,
                  win: 20,
                  loss: 5,
                  draw: 6,
                  points: 64,
                  goalsDifference: 21,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "Sheffield United",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 2,
                    status: "CHAMPIONS",
                    change: "DOWN",
                  },
                },
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 31,
                  win: 16,
                  loss: 2,
                  draw: 13,
                  points: 61,
                  goalsDifference: 28,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "Burnley",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 3,
                    status: "RELEGATION",
                    change: "UNKNOWN",
                  },
                },
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 31,
                  win: 16,
                  loss: 4,
                  draw: 11,
                  points: 59,
                  goalsDifference: 19,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "Sunderland",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 4,
                    status: "CHAMPIONS_LEAGUE_QUALIFICATION",
                    change: undefined,
                  },
                },
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 31,
                  win: 11,
                  loss: 6,
                  draw: 14,
                  points: 47,
                  goalsDifference: 13,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "West Bromwich Albion",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 5,
                    status: "UEFA_CONFERENCE_LEAGUE_PLAY_OFFS",
                    change: null,
                  },
                },
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 31,
                  win: 13,
                  loss: 12,
                  draw: 6,
                  points: 45,
                  goalsDifference: 4,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "Blackburn Rovers",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 6,
                    status: "UEFA_EUROPA_LEAGUE",
                    change: "UP",
                  },
                },
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 30,
                  win: 12,
                  loss: 10,
                  draw: 8,
                  points: 44,
                  goalsDifference: 10,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "Middlesbrough",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 7,
                    status: "UNKNOWN",
                    change: "DOWN",
                  },
                },
                {
                  __typename: "FootballTeamStanding",
                  gamesPlayed: 31,
                  win: 11,
                  loss: 10,
                  draw: 10,
                  points: 43,
                  goalsDifference: 7,
                  team: {
                    __typename: "FootballTeamDetails",
                    name: "Norwich City",
                  },
                  rank: {
                    __typename: "FootballTeamRank",
                    position: 8,
                    status: null,
                    change: null,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  ],
};

describe("Football stats in Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_HOME_VIEW));
    await startApp("home");
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when BFF returns a stats content card group to the event view", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4577]_should_correctly_display_the_stats_content_with_table_tab`,
      );
    });

    it("[PRPI-4577]_should_correctly_display_the_stats_content_with_table_tab", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4577]_should_correctly_display_the_stats_content_with_table_tab`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("and the user clicks on the table stats button", () => {
      const tableTab = statsContentCardGroupSO.tabs[1];

      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_TABLE_CARD));
        await browser.waitUntilClickableNative(tableTab, "Table tab is not clickable");
        await tableTab.click();

        await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4578]_should_correctly_display_the_stats_table_opened`);
      });

      it("[PRPI-4578]_should_correctly_display_the_stats_table_opened", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4578]_should_correctly_display_the_stats_table_opened`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
