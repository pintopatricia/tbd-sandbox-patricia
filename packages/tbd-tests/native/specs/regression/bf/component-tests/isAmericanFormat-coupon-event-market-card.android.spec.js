const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const { CardSO, ScoreSO, TeamsSO, TeamSO } = require("../../../../screen-objects");

const mockService = new MockService();
const WITH_SCORE = {
  clock: { period: "PERIOD_2", segment: "Q2", timeElapsed: 97, timeRemaining: 503 },
  homeScore: 21,
  awayScore: 18,
};

const SCA_BASKETBALL = {
  fixture: [31664428, 31664429, 31664430].map((fixtureId) => ({
    id: fixtureId,
    periodClock: "PERIOD_2",
    timeElapsedClock: 97,
    timeRemainingClock: 503,
    segmentClock: "Q2",
    periodScores: null,
    homeScore: 21,
    awayScore: 18,
  })),
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:31664428`,
  sportevent: {
    eventId: 31664428,
  },
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
        filteredCouponTitle: "Coupon Matches",
        has90Min: false,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {},
          marketTypeFilter: {},
          competitionsFilter: {},
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:31664428",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:31664428",
                  viewUrl: "basketball/nba/philadelphia-76ers-%40-new-york-knicks/e-31664428",
                },
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.205510452/40274538/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.205510452/40274538/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.205510452/237482/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.205510452/237482/0",
                  },
                ],

                title: "Moneyline",
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:31664428",
                  eventId: 31664428,
                  name: "New York Knicks v Philadelphia 76ers",
                  openDate: "2022-12-25T17:10:00.000Z",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:10547864",
                    name: "NBA",
                    competitionId: 10547864,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:7522",
                      name: "Basketball",
                      sportId: 7522,
                    },
                  },
                },
                fixture: {
                  __typename: "BasketballFixture",
                  urn: "ppb:fixture:31664428",
                  isAmericanFormat: false,
                  runnerNames: {
                    home: "New York Knicks",
                    away: "Philadelphia 76ers",
                  },
                  ...WITH_SCORE,
                  periodScores: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.205510452",
                      liveData: {
                        totalMatched: 2749.2268678647633,
                        exchangeMarketStatus: "OPEN",
                        inplay: false,
                      },
                      name: "Moneyline",
                      marketType: "MATCH_ODDS",
                      marketTypeName: null,
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:31664428",
                          eventId: 31664428,
                          name: "New York Knicks v Philadelphia 76ers",
                          openDate: "2022-12-25T17:10:00.000Z",
                          competition: {
                            __typename: "Competition",
                            urn: "ppb:competition:10547864",
                            name: "NBA",
                            competitionId: 10547864,
                            sport: {
                              __typename: "Sport",
                              urn: "ppb:eventType:7522",
                              name: "Basketball",
                              sportId: 7522,
                            },
                          },
                        },
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:10547864",
                          name: "NBA",
                          competitionId: 10547864,
                          sport: {
                            __typename: "Sport",
                            urn: "ppb:eventType:7522",
                            name: "Basketball",
                            sportId: 7522,
                          },
                        },
                      },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7522",
                        name: "Basketball",
                        sportId: 7522,
                      },
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.205510452/40274538/0",
                          name: "Philadelphia 76ers",
                          selectionId: 40274538,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.205510452/237482/0",
                          name: "New York Knicks",
                          selectionId: 237482,
                          handicap: 0,
                          resultType: null,
                        },
                      ],

                      marketRulesViewLink: null,
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.205510452/40274538/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.205510452/237482/0",
                      },
                    ],
                  },
                  sportsbook: null,
                },
                videoAvailable: false,
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:31664429",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:31664429",
                  viewUrl: "basketball/nba/philadelphia-76ers-%40-new-york-knicks/e-31664429",
                },
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.205510452/40274538/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.205510452/40274538/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.205510452/237482/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.205510452/237482/0",
                  },
                ],

                title: "Moneyline",
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:31664429",
                  eventId: 31664429,
                  name: "Philadelphia 76ers @ New York Knicks",
                  openDate: "2022-12-25T17:10:00.000Z",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:10547864",
                    name: "NBA",
                    competitionId: 10547864,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:7522",
                      name: "Basketball",
                      sportId: 7522,
                    },
                  },
                },
                fixture: {
                  __typename: "BasketballFixture",
                  urn: "ppb:fixture:31664429",
                  isAmericanFormat: true,
                  runnerNames: {
                    home: "New York Knicks",
                    away: "Philadelphia 76ers",
                  },
                  ...WITH_SCORE,
                  periodScores: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.205510452",
                      liveData: {
                        totalMatched: 2749.2268678647633,
                        exchangeMarketStatus: "OPEN",
                        inplay: false,
                      },
                      name: "Moneyline",
                      marketType: "MATCH_ODDS",
                      marketTypeName: null,
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:31664429",
                          eventId: 31664429,
                          name: "Philadelphia 76ers @ New York Knicks",
                          openDate: "2022-12-25T17:10:00.000Z",
                          competition: {
                            __typename: "Competition",
                            urn: "ppb:competition:10547864",
                            name: "NBA",
                            competitionId: 10547864,
                            sport: {
                              __typename: "Sport",
                              urn: "ppb:eventType:7522",
                              name: "Basketball",
                              sportId: 7522,
                            },
                          },
                        },
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:10547864",
                          name: "NBA",
                          competitionId: 10547864,
                          sport: {
                            __typename: "Sport",
                            urn: "ppb:eventType:7522",
                            name: "Basketball",
                            sportId: 7522,
                          },
                        },
                      },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7522",
                        name: "Basketball",
                        sportId: 7522,
                      },
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.205510452/40274538/0",
                          name: "Philadelphia 76ers",
                          selectionId: 40274538,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.205510452/237482/0",
                          name: "New York Knicks",
                          selectionId: 237482,
                          handicap: 0,
                          resultType: null,
                        },
                      ],

                      marketRulesViewLink: null,
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.205510452/40274538/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.205510452/237482/0",
                      },
                    ],
                  },
                  sportsbook: null,
                },
                videoAvailable: false,
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:31664430",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:31664430",
                  viewUrl: "basketball/nba/philadelphia-76ers-%40-new-york-knicks/e-31664430",
                },
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.205510452/40274538/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.205510452/40274538/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.205510452/237482/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.205510452/237482/0",
                  },
                ],

                title: "Moneyline",
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:31664430",
                  eventId: 31664430,
                  name: "New York Knicks v Philadelphia 76ers",
                  openDate: "2022-12-25T17:10:00.000Z",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:10547864",
                    name: "NBA",
                    competitionId: 10547864,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:7522",
                      name: "Basketball",
                      sportId: 7522,
                    },
                  },
                },
                fixture: {
                  __typename: "BasketballFixture",
                  urn: "ppb:fixture:31664430",
                  isAmericanFormat: false,
                  ...WITH_SCORE,
                  periodScores: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.205510452",
                      liveData: {
                        totalMatched: 2749.2268678647633,
                        exchangeMarketStatus: "OPEN",
                        inplay: false,
                      },
                      name: "Moneyline",
                      marketType: "MATCH_ODDS",
                      marketTypeName: null,
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:31664430",
                          eventId: 31664430,
                          name: "New York Knicks v Philadelphia 76ers",
                          openDate: "2022-12-25T17:10:00.000Z",
                          competition: {
                            __typename: "Competition",
                            urn: "ppb:competition:10547864",
                            name: "NBA",
                            competitionId: 10547864,
                            sport: {
                              __typename: "Sport",
                              urn: "ppb:eventType:7522",
                              name: "Basketball",
                              sportId: 7522,
                            },
                          },
                        },
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:10547864",
                          name: "NBA",
                          competitionId: 10547864,
                          sport: {
                            __typename: "Sport",
                            urn: "ppb:eventType:7522",
                            name: "Basketball",
                            sportId: 7522,
                          },
                        },
                      },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7522",
                        name: "Basketball",
                        sportId: 7522,
                      },
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.205510452/40274538/0",
                          name: "Philadelphia 76ers",
                          selectionId: 40274538,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.205510452/237482/0",
                          name: "New York Knicks",
                          selectionId: 237482,
                          handicap: 0,
                          resultType: null,
                        },
                      ],

                      marketRulesViewLink: null,
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.205510452/40274538/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.205510452/237482/0",
                      },
                    ],
                  },
                  sportsbook: null,
                },
                videoAvailable: false,
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:31664428",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:31664429",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:31664430",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
  ],

  sections: [
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
  ],
};

describe("EventMarketCard - Coupons scoreboard", () => {
  describe("When the user is on a given page", () => {
    let firstCouponSO;
    let secondCouponSO;
    let thirdCouponSO;

    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }, 404));
      await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getScaResponse({ ...SCA_BASKETBALL }));
      const url = "basket/nba/philadelphia-76ers-%40-new-york-knicks/e-31664428";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      const couponCardgroupSO = new FilteredCouponCardGroupSO();
      await browser.waitUntil(async () => (await couponCardgroupSO.coupons.length) === 3);

      firstCouponSO = new CardSO(couponCardgroupSO.coupons[0]);
      secondCouponSO = new CardSO(couponCardgroupSO.coupons[1]);
      thirdCouponSO = new CardSO(couponCardgroupSO.coupons[2]);
    });

    describe("And an EventMarketCard is retrieved for basketball, with runnerNames, isAmericanFormat as false and inplay event", () => {
      let teamASO;
      let teamBSO;
      let scoreSO;

      beforeAll(async () => {
        const couponSO = new CouponSO(firstCouponSO.element);
        const teamsSO = new TeamsSO(couponSO.fixture);
        teamASO = new TeamSO(teamsSO.teamA);
        teamBSO = new TeamSO(teamsSO.teamB);
        scoreSO = new ScoreSO(couponSO.fixture);

        await browser.waitUntilEquals(scoreSO.teamAScores[0], "21");
      });

      it("[PRPI-3809] The first runner name visible should be 'New York Knicks' (home)", async () => {
        expect(await teamASO.name.getText()).toEqual("New York Knicks");
      });

      it("[PRPI-3810] The second runner name visible should be 'Philadelphia 76ers' (away)", async () => {
        expect(await teamBSO.name.getText()).toEqual("Philadelphia 76ers");
      });

      it("[PRPI-4219] The scoreboard should be in the correct order: 21 (New York Knicks) 18 (Philadelphia 76ers)", async () => {
        expect(await scoreSO.teamAScores[0].getText()).toBe("21");
        expect(await scoreSO.teamBScores[0].getText()).toBe("18");
      });
    });

    describe("And an EventMarketCard is retrieved for basketball, with runnerNames, isAmericanFormat as true and inplay event", () => {
      let teamASO;
      let teamBSO;
      let scoreSO;

      beforeAll(async () => {
        const couponSO = new CouponSO(secondCouponSO.element);
        const teamsSO = new TeamsSO(couponSO.fixture);
        teamASO = new TeamSO(teamsSO.teamA);
        teamBSO = new TeamSO(teamsSO.teamB);
        scoreSO = new ScoreSO(couponSO.fixture);

        await browser.waitUntilEquals(scoreSO.teamAScores[0], "18");
      });

      it("[PRPI-3811] The first runner name visible should be 'Philadelphia 76ers' (away)", async () => {
        expect(await teamASO.name.getText()).toEqual("Philadelphia 76ers");
      });

      it("[PRPI-3812] The second runner name visible should be 'New York Knicks' (home)", async () => {
        expect(await teamBSO.name.getText()).toEqual("@ New York Knicks");
      });

      it("[PRPI-4220] The scoreboard should be in the correct order: 18 (Philadelphia 76ers) 21 (New York Knicks)", async () => {
        expect(await scoreSO.teamAScores[0].getText()).toBe("18");
        expect(await scoreSO.teamBScores[0].getText()).toBe("21");
      });
    });

    describe("And an EventMarketCard is retrieved for basketball, without runnerNames, isAmericanFormat as false and inplay event", () => {
      let teamASO;
      let scoreSO;

      beforeAll(async () => {
        const couponSO = new CouponSO(thirdCouponSO.element);
        await browser.waitUntilDisplayed(couponSO.element);

        const teamsSO = new TeamsSO(couponSO.fixture);
        teamASO = new TeamSO(teamsSO.teamA);
        scoreSO = new ScoreSO(couponSO.fixture);

        await swipeDownElementFullscreen(couponSO.element);
        await browser.waitUntilEquals(scoreSO.teamAScores[0], "21");
      });

      it("[PRPI-4221] The event name should be visible 'New York Knicks v Philadelphia 76ers'", async () => {
        expect(await teamASO.name.getText()).toEqual("New York Knicks v Philadelphia 76ers");
      });

      it("[PRPI-4222] The scoreboard should be in the correct order: 21 (New York Knicks) 18 (Philadelphia 76ers)", async () => {
        expect(await scoreSO.teamAScores[0].getText()).toBe("21");
        expect(await scoreSO.teamBScores[0].getText()).toBe("18");
      });
    });
  });
});
