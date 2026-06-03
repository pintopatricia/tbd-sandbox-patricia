const StatsPlayersInPlayCardSO = require("@ppb/tbd-shared/components/StatsPlayersInPlayCard/view/StatsPlayersInPlayCard.so");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { SupportingContentButtonSO, ShowMoreSO, GenericScreenSO } = require("../../../../../screen-objects");
const { startApp } = require("../../../../../helpers/urls");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeLeft } = require("../../../../../helpers/gestures");

const MODULE_NAME = "stats_players_in_play_card";
const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const supportingContentButtonSO = new SupportingContentButtonSO();
const statsPlayersInPlaySO = new StatsPlayersInPlayCardSO();
const showMoreSO = new ShowMoreSO();

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
};

async function getBlockOuts(element) {
  const position = await element.getLocation();
  const size = await element.getSize();
  const platformName = browser.capabilities.platformName || browser.capabilities["appium:platformName"];
  const pixelRatio = platformName === "IOS" ? 3 : 1;

  return [
    {
      x: position.x * pixelRatio,
      y: position.y * pixelRatio,
      width: size.width * pixelRatio,
      height: size.height * pixelRatio,
    },
  ];
}

describe("StatsPlayersInPlayCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_CARD_MOCK));
    await startApp("home");

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when BFF returns a `StatsPlayersInPlay` card", () => {
    describe("and the user clicks on the `Player` pebble", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(supportingContentButtonSO.element);
        await supportingContentButtonSO.element.click();
        await browser.waitUntilDisplayed(statsPlayersInPlaySO.infoLabel);
      });

      it("[PRPI-4589]_should_display_the_first_stat", async () => {
        expect(
          (
            await browser.compareScreen(`${MODULE_NAME}_[PRPI-4589]_should_display_the_first_stat`, {
              blockOuts: await getBlockOuts(statsPlayersInPlaySO.infoLabel),
            })
          ).misMatchPercentage,
        ).toEqual(0);
      });

      describe("and the user clicks on `Show More`", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(showMoreSO.element);
          await showMoreSO.element.click();
          await browser.waitUntilDisplayed(statsPlayersInPlaySO.element);
        });

        it("[PRPI-4590]_should_display_the_sixth_entry", async () => {
          expect(
            (
              await browser.compareScreen(`${MODULE_NAME}_[PRPI-4590]_should_display_the_sixth_entry`, {
                blockOuts: await getBlockOuts(statsPlayersInPlaySO.infoLabel),
              })
            ).misMatchPercentage,
          ).toEqual(0);
        });

        describe("and the user scrolls to the last element", () => {
          beforeAll(async () => {
            // moved to last element on swimlane
            for (let i = 0; i < 10; i += 1) {
              await swipeLeft();
            }

            const numberOfItems = await statsPlayersInPlaySO.scrollItems.length;
            await browser.waitUntilDisplayed(statsPlayersInPlaySO.scrollItems[numberOfItems - 1]);
          });

          it("[PRPI-4591]_should_display_the_empty_stats_message_on_last_swimlane_item", async () => {
            expect(
              (
                await browser.compareScreen(
                  `${MODULE_NAME}_[PRPI-4591]_should_display_the_empty_stats_message_on_last_swimlane_item`,
                  {
                    blockOuts: await getBlockOuts(statsPlayersInPlaySO.infoLabel),
                  },
                )
              ).misMatchPercentage,
            ).toEqual(0);
          });
        });
      });
    });
  });
});
