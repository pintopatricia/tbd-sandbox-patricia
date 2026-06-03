const {
  getAppContext,
  getGenericLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { SupportingContentButtonSO, GenericScreenSO, SnackbarSO } = require("../../../../../screen-objects");

const CARD_NAME = "stats_content_card_group_inplay";
const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const supportingContentButtonSO = new SupportingContentButtonSO();
const snackbarSO = new SnackbarSO();

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
        full: {
          edges: [
            {
              displayName: {
                translationKey: "I18N.STATS.OVERALL_FORM",
                __typename: "DisplayNameTranslationKey",
              },
              type: "STATS",
              node: {
                __typename: "StatsMatchStatsCard",
                urn: `ppb:tbd:stats:card:matchStats:${EVENT_ID}`,
                fixture: {
                  urn: "ppb:fixture:33873411",
                  stats: [
                    {
                      __typename: "FootballStats",
                      period: "REGULAR",
                      periodStatus: "FULL",
                      home: {
                        __typename: "FootballGameStats",
                        attacks: 3,
                        dangerousAttacks: 2,
                        possession: 62,
                        corners: 6,
                        yellowCards: 1,
                        redCards: 0,
                        shotsOnTarget: 4,
                        shotsOffTarget: 0,
                      },
                      away: {
                        __typename: "FootballGameStats",
                        attacks: 2,
                        dangerousAttacks: 1,
                        possession: 38,
                        corners: 1,
                        yellowCards: 1,
                        redCards: 1,
                        shotsOnTarget: 1,
                        shotsOffTarget: 0,
                      },
                    },
                  ],
                },
              },
              __typename: "StatsMatchStatsItemEdge",
            },
          ],

          __typename: "StatsContentItemsConnection",
        },
        partials: {
          edges: [
            {
              displayName: {
                translationKey: "Match Stats",
                __typename: "DisplayNameTranslationKey",
              },
              type: "STATS",
              node: {
                urn: `ppb:tbd:stats:card:matchStats:${EVENT_ID}`,
                __typename: "StatsMatchStatsCard",
              },
              __typename: "StatsMatchStatsItemEdge",
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
      __typename: "StatsMatchStatsCard",
      urn: `ppb:tbd:stats:card:matchStats:${EVENT_ID}`,
      fixture: {
        urn: `ppb:fixture:${EVENT_ID}`,
        stats: [
          {
            __typename: "FootballStats",
            period: "REGULAR",
            periodStatus: "FULL",
            home: {
              __typename: "FootballGameStats",
              attacks: 3,
              dangerousAttacks: 2,
              possession: 62,
              corners: 6,
              yellowCards: 1,
              redCards: 0,
              shotsOnTarget: 4,
              shotsOffTarget: 0,
            },
            away: {
              __typename: "FootballGameStats",
              attacks: 2,
              dangerousAttacks: 1,
              possession: 38,
              corners: 1,
              yellowCards: 1,
              redCards: 1,
              shotsOnTarget: 1,
              shotsOffTarget: 0,
            },
          },
        ],

        __typename: "FootballFixture",
      },
    },
  ],
};

describe("Inplay football stats in Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(snackbarSO.element);
    await snackbarSO.closeButton.click();

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when BFF returns a stats content card group to the event view", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4938]_should_correctly_display_the_stats_content`);
    });

    it("[PRPI-4938]_should_correctly_display_the_stats_content", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4938]_should_correctly_display_the_stats_content`))
          .misMatchPercentage,
      ).toEqual(0);
    });

    describe("and the user clicks on the stats button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_CONTENT));
        await browser.waitUntilClickableNative(
          supportingContentButtonSO.element,
          "Stats Content Button is not clickable",
        );
        await supportingContentButtonSO.element.click();

        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-4939]_should_correctly_display_the_stats_content_opened`,
        );
      });

      it("[PRPI-4939]_should_correctly_display_the_stats_content_opened", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4939]_should_correctly_display_the_stats_content_opened`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
