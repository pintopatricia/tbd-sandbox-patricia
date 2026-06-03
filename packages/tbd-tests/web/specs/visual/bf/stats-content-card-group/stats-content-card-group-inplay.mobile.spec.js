const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
const { getCardResults, getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const MODULE_NAME = "stats_content_card_group_inplay";
const mockService = new MockService();

const statsContentCardGroupPO = new StatsContentCardGroupPO();

const EVENT_ID = "1";

const STATS_CONTENT_CARD_GROUP_MOCK = {
  cards: [
    {
      __typename: "StatsContentCardGroup",
      urn: `ppb:tbd:stats:cardgroup:statsContent:Zo_esxAAACIAftCe/e/${EVENT_ID}`,
      full: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.OVERALL_FORM",
              __typename: "DisplayNameTranslationKey",
            },
            type: "FORM",
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
            type: "FORM",
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
  ],
};

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

describe("In-play football stats in Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getCardResults(STATS_CONTENT_CARD_GROUP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  });

  describe("when BFF returns a stats content card group to the event view", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1554]_should_correctly_display_the_stats_content`);
    });

    it("[PRPI-1554]_should_correctly_display_the_stats_content", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1554]_should_correctly_display_the_stats_content`)).toBe(
        0,
      );
    });

    describe("and the user clicks on the stats button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_CONTENT));
        await statsContentCardGroupPO.element.waitForClickable();
        await statsContentCardGroupPO.element.click();
        await browser.waitUntilDisplayed(statsContentCardGroupPO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1555]_should_correctly_display_the_stats_content_opened`,
        );
      });

      it("[PRPI-1555]_should_correctly_display_the_stats_content_opened", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1555]_should_correctly_display_the_stats_content_opened`),
        ).toBe(0);
      });
    });
  });
});
