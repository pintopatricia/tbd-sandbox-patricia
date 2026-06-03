const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getAppContext,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp, openUrl } = require("../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");
const { swipeUp } = require("../../../../helpers/gestures");

const {
  GenericSO,
  AvBFixtureSO,
  AvBScoreboardSO,
  DurationSO,
  ScoreSO,
  ScrollableSwimlaneSO,
  TeamSO,
  TeamsSO,
} = require("../../../../screen-objects");

const genericSO = new GenericSO();

// Cricket Fixture Selectors
const eventViewCricketFixtureSO = new AvBFixtureSO(genericSO.cricketFixtures[0]);
const eventViewAvBScoreboardSO = new AvBScoreboardSO(eventViewCricketFixtureSO.element);

const eventViewDurationSO = new DurationSO(eventViewAvBScoreboardSO.element);

const eventViewTeamsSO = new TeamsSO(eventViewAvBScoreboardSO.teams);
const eventViewHomeTeamSO = new TeamSO(eventViewTeamsSO.homeTeam);
const eventViewAwayTeamSO = new TeamSO(eventViewTeamsSO.awayTeam);

const scoreSO = new ScoreSO(eventViewAvBScoreboardSO.element);
const eventViewHomeScoreSO = {
  firstScore: scoreSO.teamAScores[0],
  secondScore: scoreSO.teamAScores[1],
};
const eventViewAwayScoreSO = {
  firstScore: scoreSO.teamBScores[0],
  secondScore: scoreSO.teamBScores[1],
};

// Coupon Card Group Selectors
const couponCardGroupSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(couponCardGroupSO.coupons[0]);
const couponCricketFixtureSO = new AvBFixtureSO(firstCoupon.element);

const couponDurationSO = new DurationSO(couponCricketFixtureSO.element);

const couponTeamsSO = new TeamsSO(couponCricketFixtureSO.element);
const couponHomeTeamSO = new TeamSO(couponTeamsSO.homeTeam);
const couponAwayTeamSO = new TeamSO(couponTeamsSO.awayTeam);

const couponScoreSO = new ScoreSO(couponCricketFixtureSO.element);
const couponFirstHomeScoreSO = couponScoreSO.teamAScores[0];
const couponFirstAwayScoreSO = couponScoreSO.teamBScores[0];

// Swimlane Card Group Selectors
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const swimlaneCricketFixtureSO = new AvBFixtureSO(scrollableSwimlaneSO.element);

const swimlaneDurationSO = new DurationSO(swimlaneCricketFixtureSO.element);

const swimlaneTeamsSO = new TeamsSO(swimlaneCricketFixtureSO.element);
const swimlaneHomeTeamSO = new TeamSO(swimlaneTeamsSO.homeTeam);
const swimlaneAwayTeamSO = new TeamSO(swimlaneTeamsSO.awayTeam);

const swimlaneScoreSO = new ScoreSO(swimlaneCricketFixtureSO.element);
const swimlaneHomeScoreSO = {
  firstScore: swimlaneScoreSO.teamAScores[0],
  secondScore: swimlaneScoreSO.teamAScores[1],
};
const swimlaneAwayScoreSO = {
  firstScore: swimlaneScoreSO.teamBScores[0],
  secondScore: swimlaneScoreSO.teamBScores[1],
};

const mockService = new MockService();

const EVENT_ID_1 = 29359895;
const EVENT_ID_2 = 59895392;

const MARKET_ID_1 = "924.193270252";
const MARKET_ID_2 = "924.193270253";

const COMPETITION_1_MOCK = {
  urn: "ppb:competition:123451",
  name: "Vitality Blast",
};

const COMPETITION_2_MOCK = {
  urn: "ppb:competition:54321",
  name: "Plunket Shield",
};

const SPORT_EVENT_1_MOCK = {
  urn: `ppb:event:${EVENT_ID_1}`,
  name: "Birmingham Bears v Northamptonshire",
  openDate: "2077-01-16T20:00:00Z",
  competition: COMPETITION_1_MOCK,
};

const SPORT_EVENT_2_MOCK = {
  urn: `ppb:event:${EVENT_ID_2}`,
  name: "Pakistan v Australia",
  openDate: "2077-01-16T20:00:00Z",
  competition: COMPETITION_2_MOCK,
};

const CRICKET_FIXTURE_1_MOCK_PRE_MATCH = {
  __typename: "CricketFixture",
  urn: `ppb:fixture:${EVENT_ID_1}`,
  runnerNames: {
    home: "Birmingham Bears",
    away: "Northamptonshire",
  },
  currentTeamBatting: null,
  currentTime: null,
  cricketScore: null,
};

const CRICKET_FIXTURE_2_MOCK_PRE_MATCH = {
  ...CRICKET_FIXTURE_1_MOCK_PRE_MATCH,
  urn: `ppb:fixture:${EVENT_ID_2}`,
  runnerNames: {
    home: "Pakistan",
    away: "Australia",
  },
};

const COUPON_CARD_MOCK = {
  node: {
    __typename: "FilteredCouponCardGroup",
    urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
    filteredCouponTitle: "Coupon Card Group",
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "EventMarketCard",
            urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_1}`,
          },
        },
      ],
    },
    full: {
      edges: [
        {
          node: {
            __typename: "EventMarketCard",
            urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_1}`,
            title: "Match Odds",
            eventViewLink: {
              viewUrn: `ppb:tbd:view:event:${EVENT_ID_1}`,
              viewUrl: `/event/${EVENT_ID_1}`,
            },
            sportevent: SPORT_EVENT_1_MOCK,
            fixture: CRICKET_FIXTURE_1_MOCK_PRE_MATCH,
            displayRunners: {
              sportsbook: {
                market: {
                  __typename: "SportsbookMarket",
                  urn: `ppb:sbkMarket:${MARKET_ID_1}`,
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: SPORT_EVENT_1_MOCK,
                    competition: COMPETITION_1_MOCK,
                  },
                  runners: [
                    {
                      runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/16113821`,
                      name: "Birmingham Bears",
                      selectionId: 16113821,
                    },
                    {
                      runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/9168659`,
                      name: "Northamptonshire",
                      selectionId: 9168659,
                    },
                  ],
                },
                runners: [
                  {
                    runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/16113821`,
                  },
                  {
                    runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/9168659`,
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

const EVENT_VIEW_1_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID_1}`,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID_1}`,
        fixture: CRICKET_FIXTURE_1_MOCK_PRE_MATCH,
        sportevent: SPORT_EVENT_1_MOCK,
      },
    },
    COUPON_CARD_MOCK,
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID_1}`,
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

const EVENT_VIEW_2_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID_2}`,
  sportevent: SPORT_EVENT_2_MOCK,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID_1}`,
        fixture: CRICKET_FIXTURE_1_MOCK_PRE_MATCH,
        sportevent: SPORT_EVENT_1_MOCK,
      },
    },
    COUPON_CARD_MOCK,
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:${EVENT_ID_2}`,
        cardGroupTitle: "Swimlane Card Group",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_2}`,
                fixture: CRICKET_FIXTURE_2_MOCK_PRE_MATCH,
                sportevent: SPORT_EVENT_2_MOCK,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID_2}`,
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: SPORT_EVENT_2_MOCK,
                        competition: COMPETITION_2_MOCK,
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/16113821`,
                          name: "Pakistan",
                          selectionId: 16113821,
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/9168659`,
                          name: "Australia",
                          selectionId: 9168659,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/16113821`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/9168659`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_2}`,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        title: "Match Odds",
        marketsHierarchy: {
          __typename: "EventCompetitionHierarchy",
          sportevent: SPORT_EVENT_2_MOCK,
          competition: COMPETITION_2_MOCK,
        },
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: SPORT_EVENT_2_MOCK,
                competition: COMPETITION_2_MOCK,
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337366/1/0",
                  selectionId: 1,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/2/0",
                  selectionId: 2,
                },
              ],
            },
            runners: [{ runnerURN: "ppb:excRunner:1.160337366/1/0" }, { runnerURN: "ppb:excRunner:1.160337366/2/0" }],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID_1}`,
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:${EVENT_ID_2}`,
      },
    },
    { node: { urn: "ppb:tbd:card:29436223:CORRECT_SCORE", __typename: "MarketCard" } },
  ],
};

const CRICKET_FIXTURE_MOCK_PRE_MATCH = {
  currentTeamBatting: null,
  currentTime: null,
  cricketScore: null,
};

const SCA_MOCK_PRE_MATCH = {
  cricketFixture: [
    { ...CRICKET_FIXTURE_MOCK_PRE_MATCH, urn: `ppb:fixture:${EVENT_ID_1}`, id: EVENT_ID_1 },
    { ...CRICKET_FIXTURE_MOCK_PRE_MATCH, urn: `ppb:fixture:${EVENT_ID_2}`, id: EVENT_ID_2 },
  ],
};

const SCA_MOCK_IN_PLAY_1_INNING = {
  cricketFixture: [
    {
      urn: `ppb:fixture:${EVENT_ID_1}`,
      id: EVENT_ID_1,
      currentTeamBatting: "HOME",
      currentTime: { inning: 1 },
      cricketScore: {
        home: [
          {
            inningNumber: 1,
            runs: 150,
            wickets: 3,
          },
        ],

        away: [],
      },
    },
  ],
};

const CRICKET_FIXTURE_MOCK_IN_PLAY_2_INNINGS = {
  currentTeamBatting: "AWAY",
  currentTime: { inning: 2 },
  cricketScore: {
    home: [
      {
        inningNumber: 1,
        runs: 150,
        wickets: 3,
      },
      {
        inningNumber: 2,
        runs: 250,
        wickets: 5,
      },
    ],

    away: [
      {
        inningNumber: 1,
        runs: 100,
        wickets: 2,
      },
      {
        inningNumber: 2,
        runs: 200,
        wickets: 4,
      },
    ],
  },
};

const SCA_MOCK_IN_PLAY_2_INNINGS = {
  cricketFixture: [
    { ...CRICKET_FIXTURE_MOCK_IN_PLAY_2_INNINGS, urn: `ppb:fixture:${EVENT_ID_1}`, id: EVENT_ID_1 },
    { ...CRICKET_FIXTURE_MOCK_IN_PLAY_2_INNINGS, urn: `ppb:fixture:${EVENT_ID_2}`, id: EVENT_ID_2 },
  ],
};

const SMP_MOCK_PRE_MATCH = {
  markets: [
    {
      marketId: MARKET_ID_1,
    },
    {
      marketId: MARKET_ID_2,
    },
  ],
};

const SMP_MOCK_IN_PLAY = {
  markets: [
    {
      marketId: MARKET_ID_1,
      inplay: true,
    },
    {
      marketId: MARKET_ID_2,
      inplay: true,
    },
  ],
};

const SMP_MOCK_1_CLOSED = {
  markets: [
    {
      marketId: MARKET_ID_1,
      noMarketInfo: true,
    },
  ],
};

const SMP_MOCK_2_CLOSED = {
  markets: [
    {
      marketId: MARKET_ID_2,
      noMarketInfo: true,
    },
  ],
};

// Failing spec after upgrade to React Native 0.72.3.
// Ignored until addressed with US.
xdescribe("Cricket Fixture", () => {
  const urls = [`sport/competition/event/e-${EVENT_ID_1}`, `sport/competition/event/e-${EVENT_ID_2}`];
  const HOME_VIEW_LINKS = getStartViewLinks(urls);
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getEventLayout(EVENT_VIEW_1_BFF_MOCK));
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });

    await browser.waitUntilEquals(eventViewCricketFixtureSO.title, COMPETITION_1_MOCK.name);
  });

  describe("when at the top of the event view", () => {
    describe("and the match is in PRE_MATCH", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_PRE_MATCH, { ignoreRequestedMarketIdsMatch: true }));
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_PRE_MATCH));

        await browser.waitUntilEquals(eventViewDurationSO.date, "Jan 16");
        await browser.waitUntilDisplayed(eventViewCricketFixtureSO.element);
        await browser.waitUntilDisplayed(eventViewHomeTeamSO.element);
        await browser.waitUntilDisplayed(couponCricketFixtureSO.element);
        await browser.waitUntilDisplayed(couponHomeTeamSO.element);
        await browser.waitUntilDisplayed(couponDurationSO.element);
      });

      describe("and in fixture card", () => {
        it("[PRPI-1987] should show the competition name", async () => {
          expect(await eventViewCricketFixtureSO.title.getText()).toBe(COMPETITION_1_MOCK.name);
        });

        it("[PRPI-1988] should show the teams name", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Birmingham Bears");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("Northamptonshire");
        });

        it("[PRPI-1989] should show the game starting date and time", async () => {
          expect(await eventViewDurationSO.date.getText()).toBe("Jan 16");
          expect(await eventViewDurationSO.time.getText()).toBe("20:00");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-1990] should not show the competition name", async () => {
          expect(await couponCricketFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-1991] should show the teams name", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("Birmingham Bears");
          expect(await couponAwayTeamSO.name.getText()).toBe("Northamptonshire");
        });

        it("[PRPI-1992] should show the game starting date and time", async () => {
          expect(await couponDurationSO.date.getText()).toBe("Jan 16");
          expect(await couponDurationSO.time.getText()).toBe("20:00");
        });
      });
    });

    describe("and the match is in the first inning", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_IN_PLAY, { ignoreRequestedMarketIdsMatch: true }));
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_IN_PLAY_1_INNING));

        await browser.waitUntilEquals(eventViewHomeScoreSO.firstScore, "150/3");
      });

      describe("and fixture card", () => {
        it("[PRPI-1993] should show the competition name", async () => {
          expect(await eventViewCricketFixtureSO.title.getText()).toBe(COMPETITION_1_MOCK.name);
        });

        it("[PRPI-1994] should show the teams name", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Birmingham Bears");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("Northamptonshire");
        });

        it("[PRPI-1995] should show the correct scores", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("150/3");
          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("-");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-1996] should not show the competition name", async () => {
          expect(await couponCricketFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-1997] should show the teams name", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("Birmingham Bears");
          expect(await couponAwayTeamSO.name.getText()).toBe("Northamptonshire");
        });

        it("[PRPI-1998] should show the correct scores", async () => {
          expect(await couponFirstHomeScoreSO.getText()).toBe("150/3");
          expect(await couponFirstAwayScoreSO.getText()).toBe("-");
        });
      });
    });

    describe("and the match is in the second inning ", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_IN_PLAY_2_INNINGS));
        await browser.waitUntilEquals(eventViewHomeScoreSO.secondScore, "250");
      });

      describe("and fixture card", () => {
        it("[PRPI-1999] should show the correct scores", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("150");
          expect(await eventViewHomeScoreSO.secondScore.getText()).toBe("250");

          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("100");
          expect(await eventViewAwayScoreSO.secondScore.getText()).toBe("200/4");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2000] should show the correct scores", async () => {
          expect(await couponFirstHomeScoreSO.getText()).toBe("250");
          expect(await couponFirstAwayScoreSO.getText()).toBe("200/4");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_1_CLOSED, { ignoreRequestedMarketIdsMatch: true }));
        await browser.waitUntilEquals(couponFirstHomeScoreSO, "400");
      });

      describe("and fixture card", () => {
        it("[PRPI-2001] should show the final score", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("150");
          expect(await eventViewHomeScoreSO.secondScore.getText()).toBe("250");

          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("100");
          expect(await eventViewAwayScoreSO.secondScore.getText()).toBe("200");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2002] should show the final score", async () => {
          expect(await couponFirstHomeScoreSO.getText()).toBe("400");
          expect(await couponFirstAwayScoreSO.getText()).toBe("300");
        });
      });
    });
  });

  describe("when navigating to another event view and scrolling down", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(EVENT_VIEW_2_BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_PRE_MATCH, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_PRE_MATCH));

      await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

      await browser.waitUntilEquals(couponDurationSO.date, "Jan 16");

      await swipeUp();
    });

    describe("and the match is in PRE_MATCH", () => {
      describe("and swimlane card group", () => {
        it("[PRPI-2003] should show the competition name", async () => {
          expect(await swimlaneCricketFixtureSO.title.getText()).toBe(COMPETITION_2_MOCK.name);
        });

        it("[PRPI-2004] should show the teams name", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Pakistan");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("Australia");
        });

        it("[PRPI-2005] should show the game starting date and time", async () => {
          expect(await swimlaneDurationSO.date.getText()).toBe("Jan 16");
          expect(await swimlaneDurationSO.time.getText()).toBe("20:00");
        });
      });
    });

    describe("and the match is in the second inning ", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_IN_PLAY, { ignoreRequestedMarketIdsMatch: true }));
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_IN_PLAY_2_INNINGS));
        await browser.waitUntilEquals(eventViewHomeScoreSO.firstScore, "150");
      });

      describe("and fixture card", () => {
        it("[PRPI-2006] should show the competition name", async () => {
          expect(await eventViewCricketFixtureSO.title.getText()).toBe(COMPETITION_1_MOCK.name);
        });

        it("[PRPI-2007] should show the teams name", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Birmingham Bears");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("Northamptonshire");
        });

        it("[PRPI-2008] should show the correct scores", async () => {
          expect(await eventViewHomeScoreSO.firstScore.getText()).toBe("150");
          expect(await eventViewHomeScoreSO.secondScore.getText()).toBe("250");

          expect(await eventViewAwayScoreSO.firstScore.getText()).toBe("100");
          expect(await eventViewAwayScoreSO.secondScore.getText()).toBe("200/4");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2009] should show the competition name", async () => {
          expect(await swimlaneCricketFixtureSO.title.getText()).toBe(COMPETITION_2_MOCK.name);
        });

        it("[PRPI-2010] should show the teams name", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Pakistan");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("Australia");
        });

        it("[PRPI-2011] should show the correct scores", async () => {
          expect(await swimlaneHomeScoreSO.firstScore.getText()).toBe("150");
          expect(await swimlaneHomeScoreSO.secondScore.getText()).toBe("250");

          expect(await swimlaneAwayScoreSO.firstScore.getText()).toBe("100");
          expect(await swimlaneAwayScoreSO.secondScore.getText()).toBe("200/4");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_2_CLOSED, { ignoreRequestedMarketIdsMatch: true }));
        await browser.waitUntilEquals(swimlaneAwayScoreSO.secondScore, "200");
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2012] should show the correct scores", async () => {
          expect(await swimlaneHomeScoreSO.firstScore.getText()).toBe("150");
          expect(await swimlaneHomeScoreSO.secondScore.getText()).toBe("250");

          expect(await swimlaneAwayScoreSO.firstScore.getText()).toBe("100");
          expect(await swimlaneAwayScoreSO.secondScore.getText()).toBe("200");
        });
      });
    });
  });
});
