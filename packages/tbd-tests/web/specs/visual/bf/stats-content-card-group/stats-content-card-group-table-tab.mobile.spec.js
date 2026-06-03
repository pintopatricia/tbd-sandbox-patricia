const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
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
  ],
};

const BFF_MOCK_EVENT_VIEW = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        ...STATS_CONTENT_CARD_GROUP_MOCK.cards[0],
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
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_EVENT_VIEW.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_EVENT_VIEW, { withBottomBar: false }));
    await mockService.mockHttpRequest(getCardResults(STATS_CONTENT_CARD_GROUP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  });

  describe("when BFF returns a stats content card group to the event view", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1558]_should_display_the_stats_content_with_table_tab`);
    });

    it("[PRPI-1558]_should_correctly_display_the_stats_content_with_table_tab", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1558]_should_display_the_stats_content_with_table_tab`),
      ).toBe(0);
    });

    describe("and the user clicks on the table stats button", () => {
      const tableTab = statsContentCardGroupPO.tabs[1];

      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_TABLE_CARD));
        await tableTab.waitForClickable();
        await tableTab.click();
        await browser.waitUntilDisplayed(statsContentCardGroupPO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1559]_should_correctly_display_the_stats_table_opened`,
        );
      });

      it("[PRPI-1559]_should_correctly_display_the_stats_table_opened", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1559]_should_correctly_display_the_stats_table_opened`),
        ).toBe(0);
      });
    });
  });
});
