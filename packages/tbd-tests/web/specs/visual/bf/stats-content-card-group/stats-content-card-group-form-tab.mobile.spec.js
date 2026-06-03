const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
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
              type: "TEAM",
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
            type: "TEAM",
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

const BFF_MOCK_CARDS_WITH_STATS_PEBBLE = {
  cards: [
    {
      __typename: "StatsPebbleCardGroup",
      urn: `ppb:tbd:stats:cardgroup:pebble:${EVENT_ID}`,
      selectedItemUrn: `ppb:tbd:stats:card:form:${EVENT_ID}|recent`,
      full: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.OVERALL_FORM",
            },
            type: "FORM",
            node: {
              __typename: "StatsFormCard",
              urn: `ppb:tbd:stats:card:form:${EVENT_ID}|recent`,
              fixture: {
                home: {
                  name: "Home 1",
                },
                away: {
                  name: "Away 1",
                },
                homeStanding: {
                  rank: { position: 1 },
                },
                awayStanding: {
                  rank: { position: 2 },
                },
                recentForm: {
                  home: [
                    {
                      outcome: "DRAW",
                      score: {
                        home: 3,
                        away: 3,
                      },
                    },
                    {
                      outcome: "DRAW",
                      score: {
                        home: 1,
                        away: 1,
                      },
                    },
                    {
                      outcome: "LOSE",
                      score: {
                        score: 5,
                        away: 2,
                      },
                    },
                    {
                      outcome: "WIN",
                      score: {
                        score: 2,
                        away: 3,
                      },
                    },
                    {
                      outcome: "LOSE",
                      score: {
                        home: 5,
                        away: 0,
                      },
                    },
                  ],

                  away: [
                    {
                      outcome: "WIN",
                      score: {
                        score: 6,
                        away: 5,
                      },
                    },
                    {
                      outcome: "WIN",
                      score: {
                        score: 3,
                        away: 0,
                      },
                    },
                    {
                      outcome: "WIN",
                      score: {
                        score: 7,
                        away: 1,
                      },
                    },
                    {
                      outcome: "DRAW",
                      score: {
                        score: 0,
                        away: 0,
                      },
                    },
                    {
                      outcome: "LOSE",
                      score: {
                        score: 0,
                        away: 2,
                      },
                    },
                  ],
                },
              },
            },
          },
        ],

        __typename: "PebbleLayoutItemsConnection",
      },
      partials: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.OVERALL_FORM",
              __typename: "DisplayNameTranslationKey",
            },
            type: "FORM",
            node: {
              urn: `ppb:tbd:stats:card:form:${EVENT_ID}|recent`,
              __typename: "StatsFormCard",
            },
          },
          {
            displayName: {
              translationKey: "I18N.STATS.H2H_FORM",
              __typename: "DisplayNameTranslationKey",
            },
            type: "FORM",
            node: {
              urn: `ppb:tbd:stats:card:h2h:${EVENT_ID}`,
              __typename: "StatsHeadToHeadCard",
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

  beforeEach(async () => {
    await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_CONTENT));
  });

  describe("when BFF returns a stats content card group to the event view", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1552]_should_correctly_display_the_stats_content`);
    });

    it("[PRPI-1552]_should_correctly_display_the_stats_content", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1552]_should_correctly_display_the_stats_content`)).toBe(
        0,
      );
    });

    describe("when user clicks on the form tab", () => {
      const formTab = statsContentCardGroupPO.tabs[0];

      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_PEBBLE));
        await browser.waitUntilDisplayed(formTab);
        await formTab.waitForClickable();
        await formTab.click();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1553]_should_correctly_display_the_stats_content_opened`,
        );
      });

      it("[PRPI-1553]_should_correctly_display_the_stats_content_opened", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1553]_should_correctly_display_the_stats_content_opened`),
        ).toBe(0);
      });
    });
  });
});
