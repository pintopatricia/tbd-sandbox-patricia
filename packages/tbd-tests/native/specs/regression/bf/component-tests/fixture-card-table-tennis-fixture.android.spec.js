const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeUp } = require("../../../../helpers/gestures");

const {
  GenericSO,
  MarketBlurbsSO,
  AvBFixtureSO,
  AvBScoreboardSO,
  TeamSO,
  TeamsSO,
  ScoreSO,
  DurationSO,
  MarketStatusSO,
  ExchangeMarketSO,
} = require("../../../../screen-objects");

const genericSO = new GenericSO();
const exchangeMarketSO = new ExchangeMarketSO();
const marketBlurbsSO = new MarketBlurbsSO(exchangeMarketSO.blurbs);
const marketStatusSO = new MarketStatusSO(marketBlurbsSO.element);

// Table Tennis Fixture Selectors
const eventViewFixtureSO = new AvBFixtureSO(genericSO.tableTennisFixtures[0]);
const eventViewAvBScoreboardSO = new AvBScoreboardSO(eventViewFixtureSO.element);

const eventViewDurationSO = new DurationSO(eventViewAvBScoreboardSO.element);

const eventViewTeamsSO = new TeamsSO(eventViewAvBScoreboardSO.teams);
const eventViewHomeTeamSO = new TeamSO(eventViewTeamsSO.homeTeam);
const eventViewAwayTeamSO = new TeamSO(eventViewTeamsSO.awayTeam);

const eventViewScoreSO = new ScoreSO();

const eventViewHomeScoreSO = {
  firstScore: eventViewScoreSO.teamAScores[0],
  secondScore: eventViewScoreSO.teamAScores[1],
  thirdScore: eventViewScoreSO.teamAScores[2],
  fourthScore: eventViewScoreSO.teamAScores[3],
  fifthScore: eventViewScoreSO.teamAScores[4],
  sixthScore: eventViewScoreSO.teamAScores[5],
};
const eventViewAwayScoreSO = {
  firstScore: eventViewScoreSO.teamBScores[0],
  secondScore: eventViewScoreSO.teamBScores[1],
  thirdScore: eventViewScoreSO.teamBScores[2],
  fourthScore: eventViewScoreSO.teamBScores[3],
  fifthScore: eventViewScoreSO.teamBScores[4],
  sixthScore: eventViewScoreSO.teamBScores[5],
};

// Coupon Card Group Selectors
const couponCardGroupSO = new FilteredCouponCardGroupSO();
const couponSO = new CouponSO(couponCardGroupSO.coupons[0]);
const couponFixtureSO = new AvBFixtureSO(couponSO.element);
const couponDurationSO = new DurationSO(couponFixtureSO.element);

const couponTeamsSO = new TeamsSO(couponFixtureSO.element);
const couponHomeTeamSO = new TeamSO(couponTeamsSO.homeTeam);
const couponAwayTeamSO = new TeamSO(couponTeamsSO.awayTeam);

const couponScoreSO = new ScoreSO(couponFixtureSO.element);

const couponHomeScoreSO = {
  firstScore: couponScoreSO.teamAScores[0],
  secondScore: couponScoreSO.teamAScores[1],
};
const couponAwayScoreSO = {
  firstScore: couponScoreSO.teamBScores[0],
  secondScore: couponScoreSO.teamBScores[1],
};

const mockService = new MockService();

const EVENT_ID = "98765431";
const MARKET_ID = "1.160337355";
const MARKET_ID2 = "1.160337356";
const COMPETITION_NAME = "World TT Stuff";
const EVENT_NAME = "Jakub Kuzmicz v Artur Biatek";
const HOME_TEAM_NAME = "Jakub Kuzmicz";
const AWAY_TEAM_NAME = "Artur Biatek";

const MATCH_ODDS_RUNNER = {
  runnerURN: `ppb:excRunner:${MARKET_ID}/1/0`,
};
const CORRECT_SCORE_RUNNER = {
  runnerURN: `ppb:excRunner:${MARKET_ID2}/1/0`,
};

const COMPETITION_MOCK = {
  urn: "ppb:competition:12345",
  name: COMPETITION_NAME,
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:2593174",
    name: "Table Tennis",
    sportId: 2593174,
  },
};

const SPORT_EVENT = {
  __typename: "SportsEvent",
  eventName: EVENT_NAME,
  name: EVENT_NAME,
  openDate: "2077-01-16T20:00:00Z",
  urn: `ppb:event:${EVENT_ID}`,
  competition: COMPETITION_MOCK,
};

const FIXTURE_MOCK = {
  __typename: "TableTennisFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  runnerNames: {
    home: HOME_TEAM_NAME,
    away: AWAY_TEAM_NAME,
  },
  currentSet: null,
  previousSets: null,
  setsWon: null,
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: SPORT_EVENT,
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_ID}`,
        sport: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
          name: "TableTennis Fixture",
        },
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        home: HOME_TEAM_NAME,
        away: AWAY_TEAM_NAME,
        sportevent: SPORT_EVENT,
        fixture: FIXTURE_MOCK,
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
        filteredCouponTitle: "Coupon Card Group",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                title: "Match Odds",
                sportevent: SPORT_EVENT,
                fixture: FIXTURE_MOCK,
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `/event/${EVENT_ID}`,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: `ppb:excMarket:${MARKET_ID}`,
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: SPORT_EVENT,
                        competition: COMPETITION_MOCK,
                      },
                      runners: [MATCH_ODDS_RUNNER, MATCH_ODDS_RUNNER],
                    },
                    runners: [MATCH_ODDS_RUNNER, MATCH_ODDS_RUNNER],
                  },
                },
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        sportevent: SPORT_EVENT,
        fixture: FIXTURE_MOCK,
        title: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID2}`,
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: SPORT_EVENT,
                competition: COMPETITION_MOCK,
              },
              runners: [
                CORRECT_SCORE_RUNNER,
                CORRECT_SCORE_RUNNER,
                CORRECT_SCORE_RUNNER,
                CORRECT_SCORE_RUNNER,
                CORRECT_SCORE_RUNNER,
                CORRECT_SCORE_RUNNER,
              ],
            },
            runners: [
              CORRECT_SCORE_RUNNER,
              CORRECT_SCORE_RUNNER,
              CORRECT_SCORE_RUNNER,
              CORRECT_SCORE_RUNNER,
              CORRECT_SCORE_RUNNER,
              CORRECT_SCORE_RUNNER,
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        __typename: "MarketCard",
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  tableTennisFixture: [
    {
      urn: `ppb:fixture:${EVENT_ID}`,
      id: EVENT_ID,
      currentTeamBatting: null,
      currentTime: null,
      cricketScore: null,
    },
  ],
};

const SCA_IN_RUNNING_MOCK_1ST_MATCH = {
  tableTennisFixture: [
    {
      urn: `ppb:fixture:${EVENT_ID}`,
      id: EVENT_ID,
      currentSet: {
        currentServer: "HOME",
        number: 1,
        tableTennisScore: { away: 8, home: 10 },
      },
      previousSets: [],
      setsWon: { away: 0, home: 0 },
    },
  ],
};

const SCA_IN_RUNNING_MOCK_LAST_MATCH = {
  tableTennisFixture: [
    {
      urn: `ppb:fixture:${EVENT_ID}`,
      id: EVENT_ID,
      currentSet: {
        currentServer: "AWAY",
        number: 5,
        tableTennisScore: { away: 10, home: 10 },
      },
      previousSets: [
        {
          currentServer: null,
          number: 4,
          tableTennisScore: { away: 2, home: 8 },
        },
        {
          currentServer: null,
          number: 3,
          tableTennisScore: { away: 8, home: 6 },
        },
        {
          currentServer: null,
          number: 2,
          tableTennisScore: { away: 11, home: 8 },
        },
        {
          currentServer: null,
          number: 1,
          tableTennisScore: { away: 9, home: 11 },
        },
      ],

      setsWon: { away: 2, home: 2 },
    },
  ],
};

const ERO_MOCK_OPEN = [
  { marketId: MARKET_ID, state: { status: "OPEN" } },
  { marketId: MARKET_ID2, state: { status: "OPEN" } },
];

const ERO_MOCK_IN_PLAY = [
  { marketId: MARKET_ID, state: { status: "OPEN", inplay: true } },
  { marketId: MARKET_ID2, state: { status: "OPEN", inplay: true } },
];

const ERO_MOCK_CLOSED = [
  { marketId: MARKET_ID, state: { status: "CLOSED" } },
  { marketId: MARKET_ID2, state: { status: "CLOSED" } },
];

describe("Table Tennis Fixture", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews({}));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK_OPEN));
    await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when at the event view in a table tennis match", () => {
    describe("and the table tennis match is in PRE_MATCH", () => {
      beforeAll(async () => {
        await browser.waitUntilEquals(couponDurationSO.date, "Jan 16");
      });

      describe("the top fixture (DEFAULT)", () => {
        it("[PRPI-2132] should show the competition name", async () => {
          expect(await eventViewFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2133] should show the teams names", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await eventViewAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2134] should show the game starting time and date", async () => {
          expect(await eventViewDurationSO.date.getText()).toBe("Jan 16");
          expect(await eventViewDurationSO.time.getText()).toBe("20:00");
        });
      });

      describe("the coupon card group (COUPON)", () => {
        it("[PRPI-2135] should not show the competition name", async () => {
          expect(await couponFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2136] should show the teams names", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await couponAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2137] should show the game starting time and date", async () => {
          expect(await couponDurationSO.date.getText()).toBe("Jan 16");
          expect(await couponDurationSO.time.getText()).toBe("20:00");
        });
      });
    });

    describe("and the table tennis match is IN_PLAY on the first match", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_MOCK_IN_PLAY));
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK_1ST_MATCH));
        await browser.waitUntilEquals(couponHomeScoreSO.firstScore, "0");
      });

      describe("the top fixture (DEFAULT)", () => {
        it("[PRPI-2138] should show the competition name", async () => {
          expect(await eventViewFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2139] should show the teams names", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await eventViewAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2140] should show the correct scores", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("0");
          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("0");

          expect(await eventViewHomeScoreSO.secondScore.getText()).toBe("10");
          expect(await eventViewAwayScoreSO.secondScore.getText()).toBe("8");

          expect(await eventViewHomeScoreSO.thirdScore.getText()).toBe("-");
          expect(await eventViewAwayScoreSO.thirdScore.getText()).toBe("-");

          expect(await eventViewHomeScoreSO.fourthScore.getText()).toBe("-");
          expect(await eventViewAwayScoreSO.fourthScore.getText()).toBe("-");

          expect(await eventViewHomeScoreSO.fifthScore.getText()).toBe("-");
          expect(await eventViewAwayScoreSO.fifthScore.getText()).toBe("-");

          expect(await eventViewHomeScoreSO.sixthScore.getText()).toBe("-");
          expect(await eventViewAwayScoreSO.sixthScore.getText()).toBe("-");
        });

        /**
         * Failing with simulators on iOS 16.x and at this point we are not sure why that is happening.
         * But we know that Appium 1.x will not get any more fixes and we need to migrate to Appium 2.x
         * since it's the optimal version to use with Xcode 14. There is an user story to tackle that work.
         * https://ppb.tpondemand.com/entity/1145562-native-appium-2-migration
         */
        it("[PRPI-2141] should show the correct team serving (HOME)", async () => {
          expect(await eventViewHomeTeamSO.serving.isDisplayed()).toBe(true);
          expect(await eventViewAwayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });

      describe("the coupon card group (COUPON)", () => {
        it("[PRPI-2142] should show the competition name", async () => {
          expect(await couponFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2143] should show the teams names", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await couponAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2144] should show the correct scores", async () => {
          expect(await couponHomeScoreSO.firstScore.getText()).toBe("0");
          expect(await couponAwayScoreSO.firstScore.getText()).toBe("0");

          expect(await couponHomeScoreSO.secondScore.getText()).toBe("10");
          expect(await couponAwayScoreSO.secondScore.getText()).toBe("8");
        });

        it("[PRPI-2145] should show the correct team serving (HOME)", async () => {
          expect(await couponHomeTeamSO.serving.isDisplayed()).toBe(true);
          expect(await couponAwayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the table tennis match is IN_PLAY on the last match", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK_LAST_MATCH));
        await browser.waitUntilEquals(couponHomeScoreSO.firstScore, "2");
      });

      describe("the top fixture (DEFAULT)", () => {
        it("[PRPI-2146] should show the competition name", async () => {
          expect(await eventViewFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2147] should show the teams names", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await eventViewAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2148] should show the correct scores", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("2");
          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("2");

          expect(await eventViewHomeScoreSO.secondScore.getText()).toBe("8");
          expect(await eventViewAwayScoreSO.secondScore.getText()).toBe("2");

          expect(await eventViewHomeScoreSO.thirdScore.getText()).toBe("6");
          expect(await eventViewAwayScoreSO.thirdScore.getText()).toBe("8");

          expect(await eventViewHomeScoreSO.fourthScore.getText()).toBe("8");
          expect(await eventViewAwayScoreSO.fourthScore.getText()).toBe("11");

          expect(await eventViewHomeScoreSO.fifthScore.getText()).toBe("11");
          expect(await eventViewAwayScoreSO.fifthScore.getText()).toBe("9");

          expect(await eventViewHomeScoreSO.sixthScore.getText()).toBe("10");
          expect(await eventViewAwayScoreSO.sixthScore.getText()).toBe("10");
        });

        /**
         * Failing with simulators on iOS 16.x and at this point we are not sure why that is happening.
         * But we know that Appium 1.x will not get any more fixes and we need to migrate to Appium 2.x
         * since it's the optimal version to use with Xcode 14. There is an user story to tackle that work.
         * https://ppb.tpondemand.com/entity/1145562-native-appium-2-migration
         */
        it("[PRPI-2149] should show the correct team serving (AWAY)", async () => {
          expect(await eventViewHomeTeamSO.serving.isDisplayed()).toBe(false);
          expect(await eventViewAwayTeamSO.serving.isDisplayed()).toBe(true);
        });
      });

      describe("the coupon card group (COUPON)", () => {
        it("[PRPI-2150] should show the competition name", async () => {
          expect(await couponFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2151] should show the teams names", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await couponAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2152] should show the correct scores", async () => {
          expect(await couponHomeScoreSO.firstScore.getText()).toBe("2");
          expect(await couponAwayScoreSO.firstScore.getText()).toBe("2");

          expect(await couponHomeScoreSO.secondScore.getText()).toBe("10");
          expect(await couponAwayScoreSO.secondScore.getText()).toBe("10");
        });

        it("[PRPI-2153] should show the correct team serving (AWAY)", async () => {
          expect(await couponHomeTeamSO.serving.isDisplayed()).toBe(false);
          expect(await couponAwayTeamSO.serving.isDisplayed()).toBe(true);
        });
      });
    });

    describe("and the table tennis match is FINISHED", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_MOCK_CLOSED));
        await browser.waitUntilEquals(marketStatusSO.label, "CLOSED");
      });

      describe("the top fixture (DEFAULT)", () => {
        it("[PRPI-2154] should show the competition name", async () => {
          expect(await eventViewFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2155] should show the teams names", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await eventViewAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2156] should show the correct scores", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("2");
          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("2");
        });

        it("[PRPI-2157] should not show any team serving", async () => {
          expect(await eventViewHomeTeamSO.serving.isDisplayed()).toBe(false);
          expect(await eventViewAwayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });

      describe("the coupon card group (COUPON)", () => {
        it("[PRPI-2158] should show the competition name", async () => {
          expect(await couponFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2159] should show the teams names", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await couponAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2160] should show the correct scores", async () => {
          expect(await couponHomeScoreSO.firstScore.getText()).toBe("2");
          expect(await couponAwayScoreSO.firstScore.getText()).toBe("2");
        });

        it("[PRPI-2161] should show the correct team serving (HOME)", async () => {
          expect(await couponHomeTeamSO.serving.isDisplayed()).toBe(false);
          expect(await couponAwayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });

      describe("and when scrolling up so the event fixture changes to SMALL", () => {
        beforeAll(async () => {
          await swipeUp();
        });

        it("[PRPI-2162] should show the competition name", async () => {
          expect(await eventViewFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2163] should show the teams names", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe(HOME_TEAM_NAME);
          expect(await eventViewAwayTeamSO.name.getText()).toBe(AWAY_TEAM_NAME);
        });

        it("[PRPI-2164] should show the correct scores", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("2");
          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("2");
        });

        it("[PRPI-2165] should show the correct team serving (HOME)", async () => {
          expect(await eventViewHomeTeamSO.serving.isDisplayed()).toBe(false);
          expect(await eventViewAwayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
