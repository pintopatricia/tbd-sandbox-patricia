const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
const { ShowMorePO, ScrollableSwimlanePO, GenericPagePO } = require("../../../../page-objects");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const MODULE_NAME = "stats_players_in_play_card";
const mockService = new MockService();
const genericPagePO = new GenericPagePO();
const statsContentCardGroupPO = new StatsContentCardGroupPO();
const statsPlayersInPlaySwimlanePO = new ScrollableSwimlanePO(genericPagePO.scrollableSwimlanes[1]);
const showMorePO = new ShowMorePO();

const STATS_PLAYERS_IN_PLAY_CARD_MOCK = {
  __typename: "StatsPlayersInPlayCard",
  urn: "ppb:tbd:stats:card:playersInPlay:1",
  fixture: {
    __typename: "FootballFixture",
    urn: "ppb:fixture:1",
    players: [...Array(6).keys()].map((index) => {
      const playerId = index + 1;

      return {
        id: `${playerId}`,
        name: `Player ${playerId}`,
        stats: {
          shotsOnTarget: playerId,
          foulsWon: playerId,
          assists: playerId,
          fouls: playerId,
          totalShots: 0,
          tacklesWon: 0,
          blockedShots: 0,
          offsides: 0,
          interceptions: 0,
          goalkeeperSaves: 0,
        },
      };
    }),
    home: {
      name: "Home Team",
      squad: {
        players: [1, 2, 3].map((id) => ({
          id,
          name: `Player ${id}`,
        })),
      },
    },
    away: {
      name: "Away Team",
      squad: {
        players: [4, 5, 6].map((id) => ({
          id,
          name: `Player ${id}`,
        })),
      },
    },
  },
};

// TODO: StatsPlayersInPlayCard - this should not use StatsContent but currently does not work outside of it, probably a TBD bug.
const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:prismic_doc/e/1`,
        partials: {
          edges: [
            {
              displayName: {
                translationKey: "Player",
                __typename: "DisplayNameTranslationKey",
              },
              type: "PLAYER",
              node: {
                __typename: "StatsPlayersInPlayCard",
                urn: "ppb:tbd:stats:card:playersInPlay:1",
              },
              __typename: "StatsPlayersInPlayItemEdge",
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
        urn: `ppb:tbd:stats:cardgroup:statsContent:prismic_doc/e/1`,
      },
    },
  ],
};

const BFF_CARD_MOCK = {
  cards: [STATS_PLAYERS_IN_PLAY_CARD_MOCK],
  withAppContext: true,
};

describe("StatsPlayersInPlayCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK, { withBottomBar: false }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getHomeViewUrl());
  });

  describe("when BFF returns a `StatsPlayersInPlay` card", () => {
    describe("and the user clicks on the `Player` pebble", () => {
      beforeAll(async () => {
        const firstStatContainerPO = statsPlayersInPlaySwimlanePO.scrollItems[0];

        await mockService.mockHttpRequest(getCardResults(BFF_CARD_MOCK));
        await statsContentCardGroupPO.element.waitForClickable();
        await statsContentCardGroupPO.element.click();

        await browser.waitUntilDisplayed(firstStatContainerPO);

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1572]_should_display_the_first_stat`);
      });

      it("[PRPI-1572]_should_display_the_first_stat", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1572]_should_display_the_first_stat`)).toBe(0);
      });

      describe("and the user clicks on `Show More`", () => {
        beforeAll(async () => {
          await showMorePO.element.waitForClickable();
          await showMorePO.element.click();

          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1573]_should_display_the_sixth_entry`);
        });

        it("[PRPI-1573]_should_display_the_sixth_entry", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1573]_should_display_the_sixth_entry`)).toBe(0);
        });

        describe("and the user scrolls to the last element", () => {
          beforeAll(async () => {
            const lastStatContainerPO = statsPlayersInPlaySwimlanePO.scrollItems[9];

            await lastStatContainerPO.scrollIntoView();

            await browser.waitUntilInViewport(lastStatContainerPO);

            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1574]_should_display_the_empty_stats_message_on_last_swimlane_item`,
            );
          });

          it("[PRPI-1574]_should_display_the_empty_stats_message_on_last_swimlane_item", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1574]_should_display_the_empty_stats_message_on_last_swimlane_item`,
              ),
            ).toBe(0);
          });
        });
      });
    });
  });
});
