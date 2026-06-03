const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const CouponListSO = require("@ppb/tbd-shared/components/CouponList/CouponList.so");
const StatsPebbleCardGroupSO = require("@ppb/tbd-shared/components/StatsPebbleCardGroup/view/StatsPebbleCardGroup.so");
const { startApp } = require("../../../../../helpers/urls");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { SupportingContentButtonSO, GenericScreenSO } = require("../../../../../screen-objects");

const CARD_NAME = "stats_pebble_card_group_inplay";
const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const couponListSO = new CouponListSO();

const createCompetition = (id) => ({
  __typename: "Competition",
  urn: `ppb:competition:${id}`,
  name: `Competition ${id}`,
  competitionId: id,
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
});

const createMarketRunner = (marketId, selectionId) => ({
  _typename: "Runner",
  runnerURN: `ppb:sbkRunner:924.${marketId}/${selectionId}`,
  name: `Runner ${selectionId}`,
  resultType: null,
  selectionId,
});

const createEventMarket = (id) => ({
  node: {
    __typename: "EventMarketCard",
    urn: `ppb:tbd:card:eventPrimaryMarket:${id}`,
    eventViewLink: {
      viewUrn: `ppb:tbd:view:event:${id}`,
      viewUrl: `football/competition/event/e-${id}`,
    },
    statsPebble: {
      urn: `ppb:tbd:stats:cardgroup:pebble:${id}`,
      __typename: "StatsPebbleCardGroup",
    },
    runnerViewLinks: [],
    title: "Match Odds",
    sportevent: {
      urn: `ppb:event:${id}`,
      eventId: id,
      name: `Team A ${id} v Team B ${id}`,
      competition: createCompetition(1),
    },
    displayRunners: {
      sportsbook: {
        market: {
          __typename: "SportsbookMarket",
          urn: `ppb:sbkMarket:924.1`,
          name: "Match Odds",
          marketType: "MATCH_ODDS",
          noLiveData: true,
          hierarchy: {
            __typename: "EventCompetitionHierarchy",
            sportevent: {
              urn: `ppb:event:${id}`,
              eventId: id,
              name: `Team A ${id} v Team B ${id}`,
              competition: createCompetition(1),
            },
            competition: createCompetition(1),
          },
          runners: [1, 2, 3].map((key) => createMarketRunner(1, key)),
        },
        runners: [1, 2, 3].map((key) => ({
          __typename: "Runner",
          runnerURN: `ppb:sbkRunner:924.1/${key}`,
        })),
      },
    },
    fixture: {
      urn: `ppb:fixture:${id}`,
      home: {
        name: `Home ${id}`,
      },
      away: {
        name: `Away ${id}`,
      },
      scheduledAt: `2021-05-10T01:00:00Z`,
    },
  },
});

const createEventMarketPartials = (id) => ({
  node: {
    __typename: "EventMarketCard",
    urn: `ppb:tbd:card:eventPrimaryMarket:${id}`,
  },
});

const FILTERED_COUPON_PARAMS = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:coupon:filtered/cv/home",
  defaultMarketTab: null,
  filteredCouponTitle: "Football Statistics Test",
  filterOptions: null,
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        ...FILTERED_COUPON_PARAMS,
        full: {
          edges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:1",
                competition: createCompetition(1),
                columns: ["1", "x", "2"],
                hasStats: true,
              },
            },
            ...[1, 2].map((id) => createEventMarket(id)),
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:1",
              },
            },
            ...[1, 2].map((id) => createEventMarketPartials(id)),
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:coupon:filtered/cv/home",
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

const BFF_MOCK_WITH_STATS_PEBBLE_AND_MATCH_STATS = {
  cards: [
    {
      __typename: "StatsPebbleCardGroup",
      urn: "ppb:tbd:stats:cardgroup:pebble:1",
      selectedItemUrn: "ppb:tbd:stats:card:matchStats:1",
      status: "INPLAY_SECOND_HALF",
      full: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
            },
            node: {
              __typename: "StatsMatchStatsCard",
              urn: "ppb:tbd:stats:card:matchStats:1",
              fixture: {
                urn: "ppb:tbd:fixture:1",
                scheduledAt: "2010-10-14T18:45Z",
                stats: [
                  {
                    periodStatus: "FULL",
                    home: {
                      attacks: 10,
                      dangerousAttacks: 0,
                      possession: 50,
                      corners: 1,
                      yellowCards: 0,
                      redCards: 0,
                      shotsOnTarget: 1,
                      shotsOffTarget: 0,
                      __typename: "FootballGameStats",
                    },
                    away: {
                      attacks: 15,
                      dangerousAttacks: 0,
                      possession: 50,
                      corners: 3,
                      yellowCards: 0,
                      redCards: 0,
                      shotsOnTarget: 2,
                      shotsOffTarget: 3,
                      __typename: "FootballGameStats",
                    },
                    __typename: "FootballStats",
                  },
                ],

                __typename: "FootballFixture",
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
              translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
              __typename: "DisplayNameTranslationKey",
            },
            node: {
              urn: "ppb:tbd:stats:card:matchStats:1",
              __typename: "StatsMatchStatsCard",
            },
          },
        ],
      },
    },
  ],
};

describe("Football stats in Coupon Card Group", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

    await startApp("home");

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when BFF returns a stats card group to the coupon", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4583]_should_correctly_display_the_coupon`);
    });

    it("[PRPI-4583]_should_correctly_display_the_coupon", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4583]_should_correctly_display_the_coupon`))
          .misMatchPercentage,
      ).toEqual(0);
    });

    describe("and the user clicks on the stats button", () => {
      describe("and there is SCA information", () => {
        const firstSupportingContentButton = new SupportingContentButtonSO(couponListSO.statsPressable[0]);
        const statsPebbleCardGroupSO = new StatsPebbleCardGroupSO(couponListSO.coupons[0]);

        beforeAll(async () => {
          await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_PEBBLE_AND_MATCH_STATS));
          await browser.waitUntilClickableNative(firstSupportingContentButton.element);
          await firstSupportingContentButton.element.click();
          await browser.waitUntilDisplayed(statsPebbleCardGroupSO.element);
          await browser.waitUntilImageEquals(
            `${CARD_NAME}_[PRPI-4584]_should_correctly_display_the_stats_opened_in_coupon`,
          );
        });

        it("[PRPI-4584]_should_correctly_display_the_stats_opened_in_coupon", async () => {
          expect(
            (
              await browser.compareScreen(
                `${CARD_NAME}_[PRPI-4584]_should_correctly_display_the_stats_opened_in_coupon`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });
      });
    });
  });
});
