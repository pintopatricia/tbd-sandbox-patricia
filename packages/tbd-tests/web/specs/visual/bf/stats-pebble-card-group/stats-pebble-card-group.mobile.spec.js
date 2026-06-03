const { SupportingContentButtonPO, PebbleListPO, EmptyStatePO } = require("../../../../page-objects");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const StatsPebbleCardGroupPO = require("@ppb/tbd-shared/components/StatsPebbleCardGroup/view/StatsPebbleCardGroup.po");
const CouponListPO = require("@ppb/tbd-shared/components/CouponList/CouponList.web.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const MODULE_NAME = "stats_pebble_card_group";
const mockService = new MockService();

const couponListPO = new CouponListPO();

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

const BFF_MOCK_WITH_STATS_PEBBLE = {
  cards: [
    {
      __typename: "StatsPebbleCardGroup",
      urn: "ppb:tbd:stats:cardgroup:pebble:1",
      selectedItemUrn: "ppb:tbd:stats:card:form:1|recent",
      full: {
        edges: [
          {
            displayName: {
              translationKey: "I18N.STATS.OVERALL_FORM",
            },
            node: {
              __typename: "StatsFormCard",
              urn: "ppb:tbd:stats:card:form:1|recent",
              fixture: {
                urn: "ppb:tbd:fixture:1",
                home: {
                  name: "Home 1",
                },
                away: {
                  name: "Away 1",
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
                competitionForm: {
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
                homeStanding: {
                  rank: {
                    position: 1,
                  },
                  team: {
                    name: "Home Team",
                  },
                },
                awayStanding: {
                  rank: {
                    position: 2,
                  },
                  team: {
                    name: "Away Team",
                  },
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
              urn: "ppb:tbd:stats:card:form:1|recent",
              __typename: "StatsFormCard",
            },
          },
          {
            displayName: {
              translationKey: "I18N.STATS.H2H_FORM",
              __typename: "DisplayNameTranslationKey",
            },
            node: {
              urn: "ppb:tbd:stats:card:h2h:1",
              __typename: "StatsHeadToHeadCard",
            },
          },
          {
            displayName: {
              translationKey: "I18N.STATS.COMPETITION_FORM",
              __typename: "DisplayNameTranslationKey",
            },
            node: {
              urn: "ppb:tbd:stats:card:form:1|competition",
              __typename: "StatsFormCard",
            },
          },
          {
            displayName: {
              translationKey: "I18N.STATS.GOALS_SHOTS",
              __typename: "DisplayNameTranslationKey",
            },
            node: {
              urn: "ppb:tbd:stats:card:goalsAndShots:1",
              __typename: "StatsGoalsAndShotsCard",
            },
          },
        ],
      },
    },
  ],
};

const BFF_MOCK_WITH_STATS_HEAD_TO_HEAD_CARD = {
  cards: [
    {
      __typename: "StatsHeadToHeadCard",
      urn: "ppb:tbd:stats:card:h2h:1",
      fixture: {
        head2head: {
          home: [
            {
              opponent: "Home 1",
              score: {
                home: 1,
                away: 0,
                __typename: "AVBScore",
              },
              startAt: "2001-01-01T12:00:00Z",
              side: "AWAY",
              __typename: "FootballTeamForm",
            },
            {
              opponent: "Home 1",
              score: {
                home: 0,
                away: 0,
                __typename: "AVBScore",
              },
              startAt: "2001-01-02T12:00:00Z",
              side: "AWAY",
              __typename: "FootballTeamForm",
            },
            {
              opponent: "Home 1",
              score: {
                home: 0,
                away: 1,
                __typename: "AVBScore",
              },
              startAt: "2001-01-03T12:00:00Z",
              side: "AWAY",
              __typename: "FootballTeamForm",
            },
          ],

          away: [
            {
              opponent: "Away 1",
              score: {
                home: 1,
                away: 0,
                __typename: "AVBScore",
              },
              startAt: "2001-01-01T12:00:00Z",
              __typename: "FootballTeamForm",
            },
            {
              opponent: "Away 1",
              score: {
                home: 0,
                away: 0,
                __typename: "AVBScore",
              },
              startAt: "2001-01-02T12:00:00Z",
              __typename: "FootballTeamForm",
            },
            {
              opponent: "Away 1",
              score: {
                home: 1,
                away: 1,
                __typename: "AVBScore",
              },
              startAt: "2001-01-03T12:00:00Z",
              __typename: "FootballTeamForm",
            },
          ],

          __typename: "FootballFixtureForm",
        },
        __typename: "FootballFixture",
      },
    },
  ],
};

const BFF_MOCK_WITH_STATS_COMPETITION_FORM_CARD = {
  cards: [
    {
      __typename: "StatsFormCard",
      urn: "ppb:tbd:stats:card:form:1|competition",
      fixture: {
        urn: "ppb:tbd:fixture:1",
        __typename: "FootballFixture",
        home: {
          name: "Home 1",
        },
        away: {
          name: "Away 1",
        },
        competitionForm: {
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
        homeStanding: {
          rank: {
            position: 1,
          },
          team: {
            name: "Home Team",
          },
        },
        awayStanding: {
          rank: {
            position: 2,
          },
          team: {
            name: "Home Team",
          },
        },
      },
    },
  ],
};

const BFF_MOCK_WITH_GOALS_AND_SHOTS = {
  cards: [
    {
      __typename: "StatsGoalsAndShotsCard",
      urn: "ppb:tbd:stats:card:goalsAndShots:1",
      fixture: {
        urn: "ppb:tbd:fixture:1",
        __typename: "FootballFixture",
        home: {
          name: "Home",
          __typename: "FootballTeamDetails",
          statsAllSeason: {
            averageGoalsConceded: {
              firstHalf: 1,
              secondHalf: 2,
              overall: 3,
            },
            averageGoalsScored: {
              firstHalf: 1,
              secondHalf: 2,
              overall: 3,
            },
            averageShotsOnTarget: 1,
          },
        },
        away: {
          name: "Away",
          __typename: "FootballTeamDetails",
          statsAllSeason: {
            averageGoalsConceded: {
              firstHalf: 1,
              secondHalf: 2,
              overall: 3,
            },
            averageGoalsScored: {
              firstHalf: 1,
              secondHalf: 2,
              overall: 3,
            },
            averageShotsOnTarget: 1,
            __typename: "FootballTeamStatsDetails",
          },
        },
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

describe("Football stats in Coupon Card Group", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getHomeViewUrl());
  });

  describe("when BFF returns a stats card group to the coupon", () => {
    beforeAll(async () => {
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1566]_should_correctly_display_the_coupon`);
    });

    it("[PRPI-1566]_should_correctly_display_the_coupon", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1566]_should_correctly_display_the_coupon`)).toBe(0);
    });

    describe("and the user clicks on the stats button", () => {
      describe("and there is SCA information", () => {
        const firstSupportingContentButton = new SupportingContentButtonPO(couponListPO.couponStatsButtons[0]);
        const statsPebbleCardGroupPO = new StatsPebbleCardGroupPO(couponListPO.filteredCoupons[0]);

        beforeAll(async () => {
          await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_PEBBLE));
          await firstSupportingContentButton.element.waitForClickable();
          await firstSupportingContentButton.element.click();
          await browser.waitUntilDisplayed(statsPebbleCardGroupPO.element);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1567]_should_correctly_display_the_stats_opened_in_coupon`,
          );
        });

        it("[PRPI-1567]_should_correctly_display_the_stats_opened_in_coupon", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1567]_should_correctly_display_the_stats_opened_in_coupon`),
          ).toBe(0);
        });

        describe("when the user click on H2H pebble", () => {
          const pebblesPO = new PebbleListPO();
          const secondPebble = pebblesPO.pebbles[1];

          beforeAll(async () => {
            await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_HEAD_TO_HEAD_CARD));
            await secondPebble.waitForClickable();
            await secondPebble.click();
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1568]_should_correct_display_the_second_pebble_container`,
            );
          });

          it("[PRPI-1568]_should_correct_display_the_second_pebble_container", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1568]_should_correct_display_the_second_pebble_container`,
              ),
            ).toBe(0);
          });
        });
        describe("when the user click on Competition Form pebble", () => {
          const pebblesPO = new PebbleListPO();
          const thirdPebble = pebblesPO.pebbles[2];

          beforeAll(async () => {
            await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_STATS_COMPETITION_FORM_CARD));
            await thirdPebble.waitForClickable();
            await thirdPebble.click();
            await browser.waitUntilStopsMoving(thirdPebble);
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1569]_should_correct_display_the_third_pebble_container`,
            );
          });

          it("[PRPI-1569]_should_correct_display_the_third_pebble_container", async () => {
            expect(
              await browser.checkScreen(`${MODULE_NAME}_[PRPI-1569]_should_correct_display_the_third_pebble_container`),
            ).toBe(0);
          });
        });

        describe("and the user clicks on Goals and Shots pebble", () => {
          const pebblesPO = new PebbleListPO();
          const fourthPebble = pebblesPO.pebbles[3];

          beforeAll(async () => {
            await mockService.mockHttpRequest(getCardResults(BFF_MOCK_WITH_GOALS_AND_SHOTS));
            await fourthPebble.waitForClickable();
            await fourthPebble.click();
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1570]_should_correct_display_the_goals_and_shots_pebble_container`,
            );
          });

          it("[PRPI-1570]_should_correct_display_the_goals_and_shots_pebble_container", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1570]_should_correct_display_the_goals_and_shots_pebble_container`,
              ),
            ).toBe(0);
          });
        });
      });

      describe("and there is no SCA information", () => {
        const secondSupportingContentButton = new SupportingContentButtonPO(couponListPO.couponStatsButtons[1]);
        const emptyStatePO = new EmptyStatePO(couponListPO.filteredCoupons[1]);

        beforeAll(async () => {
          const firstSupportingContentButton = new SupportingContentButtonPO(couponListPO.couponStatsButtons[0]);
          await firstSupportingContentButton.element.waitForClickable();
          await firstSupportingContentButton.element.click();
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1566]_should_correctly_display_the_coupon`);

          await secondSupportingContentButton.element.waitForClickable();
          await secondSupportingContentButton.element.click();
          await browser.waitUntilDisplayed(emptyStatePO.element);
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1571]_should_correctly_display_the_empty_state`);
        });

        it("[PRPI-1571]_should_correctly_display_the_empty_state", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1571]_should_correctly_display_the_empty_state`)).toBe(
            0,
          );
        });
      });
    });
  });
});
