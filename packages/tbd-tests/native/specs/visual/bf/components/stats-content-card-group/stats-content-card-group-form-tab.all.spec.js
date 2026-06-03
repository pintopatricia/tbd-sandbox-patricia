const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getAppContext,
  getGenericLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const StatsContentCardGroupSO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.so");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { GenericScreenSO, SnackbarSO } = require("../../../../../screen-objects");

const CARD_NAME = "stats_content_card_group";
const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const statsContentCardGroupSO = new StatsContentCardGroupSO();
const snackbarSO = new SnackbarSO();

const EVENT_ID = "1";

const createScores = (numberOfScores, side) => {
  const scores = Array.from(Array(numberOfScores).keys());

  return scores.map((_, index) => {
    const outcomeMap = ["WIN", "LOSE", "DRAW", "WIN", "LOSE"];
    const homeScore = index;
    const awayScore = 4 - index;

    return {
      outcome: outcomeMap[index],
      score: {
        score: side === "AWAY" ? awayScore : homeScore,
        away: side === "AWAY" ? homeScore : awayScore,
        __typename: "AVBScore",
      },
      __typename: "FootballTeamForm",
    };
  });
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
                  home: createScores(5),
                  away: createScores(5, "AWAY"),
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
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_CONTENT));

    const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(snackbarSO.element);
    await snackbarSO.closeButton.click();

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when BFF returns a stats content card group to the event view", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4937]_should_correctly_display_the_stats_content_closed`);
    });

    it("[PRPI-4937]_should_correctly_display_the_stats_content_closed", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4937]_should_correctly_display_the_stats_content_closed`))
          .misMatchPercentage,
      ).toEqual(0);
    });

    describe("and the user clicks on the stats button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_CARDS_WITH_STATS_PEBBLE));

        await browser.waitUntilClickableNative(statsContentCardGroupSO.tabs[0], "Form Tab is not clickable");

        await statsContentCardGroupSO.tabs[0].click();

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
