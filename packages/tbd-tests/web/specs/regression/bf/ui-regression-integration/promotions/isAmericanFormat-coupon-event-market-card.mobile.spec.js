const CouponPO = require("@ppb/tbd-shared/components/Coupon/Coupon.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { AvBScoreboardPO } = require("../../../../../page-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const avbScoreboardPO = new AvBScoreboardPO();

// Coupon Card Page Objects
const couponPO = new CouponPO();
const mockService = new MockService();
const EVENT_ID = 31664428;

const WITH_SCORE = {
  clock: { period: "PERIOD_2", segment: "Q2", timeElapsed: 97, timeRemaining: 503 },
  homeScore: 21,
  awayScore: 18,
};
const NON_AMERICAN_EVENT_NAME = "New York Knicks v Philadelphia 76ers";
const NON_AMERICAN_EVENT_FIXTURE = {
  __typename: "BasketballFixture",
  urn: "ppb:fixture:31664428",
  runnerNames: {
    home: "New York Knicks",
    away: "Philadelphia 76ers",
  },
  isAmericanFormat: false,
  ...WITH_SCORE,
  periodScores: null,
};

const SCA_BASKETBALL = {
  fixture: [
    {
      id: 31664428,
      periodClock: "PERIOD_2",
      timeElapsedClock: 97,
      timeRemainingClock: 503,
      segmentClock: "Q2",
      periodScores: null,
      homeScore: 21,
      awayScore: 18,
    },
  ],
};

const AMERICAN_EVENT_NAME = "Philadelphia 76ers @ New York Knicks";
const AMERICAN_EVENT_FIXTURE = {
  __typename: "BasketballFixture",
  urn: "ppb:fixture:31664428",
  runnerNames: {
    home: "New York Knicks",
    away: "Philadelphia 76ers",
  },
  isAmericanFormat: true,
  ...WITH_SCORE,
  periodScores: null,
};

const NO_RUNNERNAMES_EVENT_FIXTURE = {
  __typename: "BasketballFixture",
  urn: "ppb:fixture:31664428",
  isAmericanFormat: false,
  clock: { period: "PERIOD_2", segment: "Q2", timeElapsed: 97, timeRemaining: 503 },
  ...WITH_SCORE,
  periodScores: null,
};

const getEventViewMock = (eventName = NON_AMERICAN_EVENT_NAME, fixture = NON_AMERICAN_EVENT_FIXTURE) => ({
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
  },
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/c/12345",
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
                  name: eventName,
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
                fixture,
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
                          name: eventName,
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
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/c/12345",
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
});

describe("EventMarketCard - Coupons scoreboard", () => {
  describe("When the user is on a given page", () => {
    describe("An EventMarketCard is retrieved for basketball with runnerNames and isAmericanFormat= false InPlay event", () => {
      beforeAll(async () => {
        const BFF_VIEW_MOCK = getEventViewMock(NON_AMERICAN_EVENT_NAME, NON_AMERICAN_EVENT_FIXTURE);

        await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
        await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
        await mockService.mockHttpRequest(getScaResponse({ ...SCA_BASKETBALL }));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(avbScoreboardPO.teamAScore, "21");
      });

      it("[PRPI-7212] The first runner name visible should be 'New York Knicks' (home)", async () => {
        expect(await couponPO.scoreboardTeamNames[0].getText()).toEqual("New York Knicks");
      });

      it("[PRPI-7213] The second runner name visible should be 'Philadelphia 76ers' (away)", async () => {
        expect(await couponPO.scoreboardTeamNames[1].getText()).toEqual("Philadelphia 76ers");
      });

      it("[PRPI-7214] The scoreboard should be in the correct order", async () => {
        // 21 (New York Knicks) - 18" (Philadelphia 76ers)
        expect(await avbScoreboardPO.teamAScore.getText()).toBe("21");
        expect(await avbScoreboardPO.teamBScore.getText()).toBe("18");
      });
    });

    describe("An EventMarketCard is retrieved for basketball without runnerNames and isAmericanFormat= true InPlay event", () => {
      beforeAll(async () => {
        const BFF_VIEW_MOCK = getEventViewMock(AMERICAN_EVENT_NAME, AMERICAN_EVENT_FIXTURE);

        await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
        await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
        await mockService.mockHttpRequest(getScaResponse({ ...SCA_BASKETBALL }));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(avbScoreboardPO.teamAScore, "18");
      });

      it("[PRPI-7215] The first runner name visible should be 'Philadelphia 76ers' (away)", async () => {
        expect(await couponPO.scoreboardTeamNames[0].getText()).toEqual("Philadelphia 76ers");
      });

      it("[PRPI-7216] The second runner name visible should be 'New York Knicks' (home)", async () => {
        expect(await couponPO.scoreboardTeamNames[1].getText()).toEqual("@ New York Knicks");
      });

      it("[PRPI-7217] The scoreboard should be in the correct order", async () => {
        //18 (Philadelphia 76ers) - 21 (New York Knicks)
        expect(await avbScoreboardPO.teamAScore.getText()).toBe("18");
        expect(await avbScoreboardPO.teamBScore.getText()).toBe("21");
      });
    });

    describe("an EventMarketCard is retrieved for basketball without runnerNames and isAmericanFormat= false InPlay event", () => {
      beforeAll(async () => {
        const BFF_VIEW_MOCK = getEventViewMock(NON_AMERICAN_EVENT_NAME, NO_RUNNERNAMES_EVENT_FIXTURE);

        await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
        await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
        await mockService.mockHttpRequest(getScaResponse({ ...SCA_BASKETBALL }));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(avbScoreboardPO.teamAScore, "21");
      });

      it("[PRPI-7218] The event name should be visible New York Knicks v Philadelphia 76ers", async () => {
        expect(await couponPO.scoreboardTeamNames[0].getText()).toEqual("New York Knicks v Philadelphia 76ers");
      });

      it("[PRPI-7219] The scoreboard should be in the correct order", async () => {
        //21 (New York Knicks) - 18" (Philadelphia 76ers)
        expect(await avbScoreboardPO.teamAScore.getText()).toBe("21");
        expect(await avbScoreboardPO.teamBScore.getText()).toBe("18");
      });
    });
  });
});
