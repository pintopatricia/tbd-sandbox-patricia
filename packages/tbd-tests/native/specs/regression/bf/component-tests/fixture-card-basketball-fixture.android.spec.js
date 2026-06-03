const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");

const {
  getAppContext,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
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
  SnackbarSO,
} = require("../../../../screen-objects");

const genericSO = new GenericSO();

// Basketball Fixture Selectors
const eventViewBasketballFixtureSO = new AvBFixtureSO(genericSO.basketballFixtures[0]);
const eventViewAvBScoreboardSO = new AvBScoreboardSO(eventViewBasketballFixtureSO.element);

const eventViewDurationSO = new DurationSO(eventViewAvBScoreboardSO.element);

const eventViewTeamsSO = new TeamsSO(eventViewAvBScoreboardSO.teams);
const eventViewHomeTeamSO = new TeamSO(eventViewTeamsSO.homeTeam);
const eventViewAwayTeamSO = new TeamSO(eventViewTeamsSO.awayTeam);

const scoreSO = new ScoreSO(eventViewAvBScoreboardSO.element);
const eventViewTeamAScoreSO = {
  firstScore: scoreSO.teamAScores[0],
  secondScore: scoreSO.teamAScores[1],
  thirdScore: scoreSO.teamAScores[2],
  fourthScore: scoreSO.teamAScores[3],
  sixthScore: scoreSO.teamAScores[5],
};
const eventViewTeamBScoreSO = {
  firstScore: scoreSO.teamBScores[0],
  secondScore: scoreSO.teamBScores[1],
  thirdScore: scoreSO.teamBScores[2],
  fourthScore: scoreSO.teamBScores[3],
  sixthScore: scoreSO.teamBScores[5],
};

// Coupon Card Group Selectors
const couponCardGroupSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(couponCardGroupSO.coupons[0]);
const couponBasketballFixtureSO = new AvBFixtureSO(firstCoupon.element);

const couponDurationSO = new DurationSO(couponBasketballFixtureSO.element);

const couponTeamsSO = new TeamsSO(couponBasketballFixtureSO.element);
const couponHomeTeamSO = new TeamSO(couponTeamsSO.homeTeam);
const couponAwayTeamSO = new TeamSO(couponTeamsSO.awayTeam);

const couponScoreSO = new ScoreSO(couponBasketballFixtureSO.element);
const couponFirstTeamAScoreSO = couponScoreSO.teamAScores[0];
const couponFirstTeamBScoreSO = couponScoreSO.teamBScores[0];

// Swimlane Card Group Selectors
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const swimlaneBasketballFixtureSO = new AvBFixtureSO(scrollableSwimlaneSO.element);

const swimlaneDurationSO = new DurationSO(swimlaneBasketballFixtureSO.element);

const swimlaneTeamsSO = new TeamsSO(swimlaneBasketballFixtureSO.element);
const swimlaneHomeTeamSO = new TeamSO(swimlaneTeamsSO.homeTeam);
const swimlaneAwayTeamSO = new TeamSO(swimlaneTeamsSO.awayTeam);

const swimlaneScoreSO = new ScoreSO(swimlaneBasketballFixtureSO.element);
const swimlaneTeamAScoreSO = {
  firstScore: swimlaneScoreSO.teamAScores[0],
  secondScore: swimlaneScoreSO.teamAScores[1],
  thirdScore: swimlaneScoreSO.teamAScores[2],
  sixthScore: swimlaneScoreSO.teamAScores[5],
};
const swimlaneTeamBScoreSO = {
  firstScore: swimlaneScoreSO.teamBScores[0],
  secondScore: swimlaneScoreSO.teamBScores[1],
  thirdScore: swimlaneScoreSO.teamBScores[2],
  sixthScore: swimlaneScoreSO.teamBScores[5],
};
const snackbarSO = new SnackbarSO();

const mockService = new MockService();

const COMPETITION_ID = 111;
const EVENT_ID = 29359895;

const EVENT_ID_2 = 59895392;

const BASKETBALL_FIXTURE = {
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Los Angeles Lakers @ Chicago Bulls",
    openDate: "2077-01-16T20:00:00Z",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "NBA",
    },
  },
  fixture: {
    __typename: "BasketballFixture",
    urn: `ppb:fixture:${EVENT_ID}`,
    periodClock: "UNKNOWN_PERIOD",
    isAmericanFormat: true,
    runnerNames: {
      home: "Chicago Bulls",
      away: "Los Angeles Lakers",
    },
  },
};

const EVENT_VIEW_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  url: `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Los Angeles Lakers @ Chicago Bulls",
    openDate: "2077-01-16T20:00:00Z",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "NBA",
    },
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:event:${EVENT_ID}`,
        selectedViewLink: {
          label: "Los Angeles Lakers @ Chicago Bulls",
          viewLink: {
            viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
            viewUrl: `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
          },
        },
        siblingViews: {
          edges: [
            {
              node: {
                label: "Los Angeles Lakers @ Chicago Bulls",
                viewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        ...BASKETBALL_FIXTURE,
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
        filteredCouponTitle: "Coupon Card Group",
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
        full: {
          edges: [
            {
              node: {
                ...BASKETBALL_FIXTURE,
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                title: "Match Odds",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `/event/${EVENT_ID}`,
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.222222222",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                          name: "Los Angeles Lakers @ Chicago Bulls",
                          openDate: "2077-01-16T20:00:00Z",
                          competition: {
                            urn: `ppb:competition:${COMPETITION_ID}`,
                            name: "NBA",
                          },
                        },
                        competition: {
                          urn: `ppb:competition:${COMPETITION_ID}`,
                          name: "NBA",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.292366520/16113821",
                          name: "Los Angeles Lakers",
                          selectionId: 16113821,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.292366520/9168659",
                          name: "Chicago Bulls",
                          selectionId: 9168659,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.292366520/16113821",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.292366520/9168659",
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
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
                fixture: {
                  __typename: "BasketballFixture",
                  urn: `ppb:fixture:${EVENT_ID_2}`,
                  periodClock: "UNKNOWN_PERIOD",
                  isAmericanFormat: true,
                  runnerNames: {
                    home: "Toronto Raptors",
                    away: "Cleveland Cavaliers",
                  },
                },
                sportevent: {
                  urn: `ppb:event:${EVENT_ID_2}`,
                  name: "Cleveland Cavaliers @ Toronto Raptors",
                  openDate: "2077-01-16T20:00:00Z",
                  competition: {
                    urn: `ppb:competition:${COMPETITION_ID}`,
                    name: "NBA",
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
          sportevent: {
            urn: `ppb:event:${EVENT_ID}`,
            name: "Los Angeles Lakers @ Chicago Bulls",
            openDate: "2077-01-16T20:00:00Z",
            competition: {
              urn: `ppb:competition:${COMPETITION_ID}`,
              name: "NBA",
            },
          },
          competition: {
            urn: `ppb:competition:${COMPETITION_ID}`,
            name: "NBA",
          },
        },
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                  name: "Los Angeles Lakers @ Chicago Bulls",
                  openDate: "2077-01-16T20:00:00Z",
                  competition: {
                    urn: `ppb:competition:${COMPETITION_ID}`,
                    name: "NBA",
                  },
                },
                competition: {
                  urn: `ppb:competition:${COMPETITION_ID}`,
                  name: "NBA",
                },
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
                {
                  runnerURN: "ppb:excRunner:1.160337366/3/0",
                  selectionId: 3,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/4/0",
                  selectionId: 4,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/5/0",
                  selectionId: 5,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/6/0",
                  selectionId: 6,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337366/1/0" },
              { runnerURN: "ppb:excRunner:1.160337366/2/0" },
              { runnerURN: "ppb:excRunner:1.160337366/3/0" },
              { runnerURN: "ppb:excRunner:1.160337366/4/0" },
              { runnerURN: "ppb:excRunner:1.160337366/5/0" },
              { runnerURN: "ppb:excRunner:1.160337366/6/0" },
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
        urn: `ppb:tbd:card:genericswitcher:event:${EVENT_ID}`,
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

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      id: EVENT_ID,
      periodClock: "UNKNOWN_PERIOD",
    },
  ],
};

const SCA_FIRST_QUARTER_MOCK = {
  fixture: [
    {
      id: EVENT_ID,
      periodClock: "PERIOD_1",
      segmentClock: "Q1",
      timeRemainingClock: 0,
      periodScores: [
        {
          score: { home: 17, away: 20 },
          period: "PERIOD_1",
        },
      ],

      homeScore: 17,
      awayScore: 20,
    },
  ],
};

const SCA_FIRST_QUARTER_END_MOCK = {
  fixture: [
    {
      id: EVENT_ID,
      periodClock: "END_PERIOD_1",
      segmentClock: "Q1",
      timeRemainingClock: 0,
      periodScores: [
        {
          score: { home: 19, away: 22 },
          period: "PERIOD_1",
        },
      ],

      homeScore: 19,
      awayScore: 22,
    },
  ],
};

const SCA_SECOND_QUARTER_MOCK = {
  fixture: [
    {
      id: EVENT_ID,
      periodClock: "PERIOD_2",
      segmentClock: "Q2",
      periodScores: [
        {
          score: { home: 19, away: 22 },
          period: "PERIOD_1",
        },
        {
          score: { home: 0, away: 0 },
          period: "PERIOD_2",
        },
      ],

      homeScore: 19,
      awayScore: 22,
    },
  ],
};

const SCA_OVER_TIME_MOCK = {
  fixture: [
    {
      id: EVENT_ID,
      periodClock: "OVERTIME",
      segmentClock: "OT",
      timeRemainingClock: 300,
      periodScores: [
        {
          score: { home: 19, away: 22 },
          period: "PERIOD_1",
        },
        {
          score: { home: 13, away: 24 },
          period: "PERIOD_2",
        },
        {
          score: { home: 16, away: 20 },
          period: "PERIOD_3",
        },
        {
          score: { home: 19, away: 18 },
          period: "PERIOD_4",
        },
        {
          score: { home: 5, away: 12 },
          period: "OVERTIME",
        },
      ],

      homeScore: 72,
      awayScore: 96,
    },
  ],
};

const SCA_FINISHED_MOCK = {
  fixture: [
    {
      id: EVENT_ID,
      periodClock: "END",
      timeRemainingClock: 0,
      periodScores: [
        {
          score: { home: 19, away: 22 },
          period: "PERIOD_1",
        },
        {
          score: { home: 13, away: 24 },
          period: "PERIOD_2",
        },
        {
          score: { home: 16, away: 20 },
          period: "PERIOD_3",
        },
        {
          score: { home: 19, away: 18 },
          period: "PERIOD_4",
        },
      ],

      homeScore: 67,
      awayScore: 84,
    },
  ],
};

describe("Basketball Fixture", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getEventLayout(EVENT_VIEW_BFF_MOCK));
    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(snackbarSO.element);
    await snackbarSO.closeButton.click();
    await browser.waitUntilEquals(eventViewBasketballFixtureSO.title, "NBA");
  });

  describe("when at the top of the event view", () => {
    describe("and the match is in PRE_MATCH", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
        await browser.waitUntilEquals(eventViewDurationSO.date, "Jan 16");
      });

      describe("and in fixture card", () => {
        it("[PRPI-1943] should show the competition name", async () => {
          expect(await eventViewBasketballFixtureSO.title.getText()).toBe("NBA");
        });

        it("[PRPI-1944] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-1945] should show the game starting date and time", async () => {
          expect(await eventViewDurationSO.date.getText()).toBe("Jan 16");
          expect(await eventViewDurationSO.time.getText()).toBe("20:00");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-1946] should not show the competition name", async () => {
          expect(await couponBasketballFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-1947] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await couponAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-1948] should show the game starting date and time", async () => {
          expect(await couponDurationSO.date.getText()).toBe("Jan 16");
          expect(await couponDurationSO.time.getText()).toBe("20:00");
        });
      });
    });

    describe("and the match is the first quarter", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FIRST_QUARTER_MOCK));
        await browser.waitUntilEquals(eventViewDurationSO.prefixLabel, "Q1");
      });

      describe("and fixture card", () => {
        it("[PRPI-1949] should show the competition name", async () => {
          expect(await eventViewBasketballFixtureSO.title.getText()).toBe("NBA");
        });

        it("[PRPI-1950] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-1951] should show the game status (Q1 - 0')", async () => {
          expect(await eventViewDurationSO.prefixLabel.getText()).toBe("Q1");
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("0'");
        });

        it("[PRPI-1952] should show the correct scores", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("17");
          expect(await eventViewTeamBScoreSO.secondScore.getText()).toBe("17");
          expect(await eventViewTeamBScoreSO.thirdScore.getText()).toBe("-");

          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("20");
          expect(await eventViewTeamAScoreSO.secondScore.getText()).toBe("20");
          expect(await eventViewTeamAScoreSO.thirdScore.getText()).toBe("-");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-1953] should not show the competition name", async () => {
          expect(await couponBasketballFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-1954] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await couponAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-1955] should show the game status (Q1 - 0')", async () => {
          expect(await couponDurationSO.prefixLabel.getText()).toBe("Q1");
          expect(await couponDurationSO.statusLabel.getText()).toBe("0'");
        });

        it("[PRPI-1956] should show the correct scores", async () => {
          expect(await couponFirstTeamBScoreSO.getText()).toBe("17");
          expect(await couponFirstTeamAScoreSO.getText()).toBe("20");
        });
      });
    });

    describe("and the first quarter ends ", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FIRST_QUARTER_END_MOCK));
        await browser.waitUntilEquals(eventViewDurationSO.statusLabel, "End of Period");
      });

      describe("and fixture card", () => {
        it("[PRPI-1957] should show the game status (Q1 - End of Period)", async () => {
          expect(await eventViewDurationSO.prefixLabel.getText()).toBe("Q1");
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("End of Period");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-1958] should show the game status (Q1 - End)", async () => {
          expect(await couponDurationSO.prefixLabel.getText()).toBe("Q1");
          expect(await couponDurationSO.statusLabel.getText()).toBe("End");
        });
      });
    });

    describe("and the match goes to the second Quarter", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_SECOND_QUARTER_MOCK));
        await browser.waitUntilEquals(couponDurationSO.statusLabel, "Q2");
      });

      describe("and fixture card", () => {
        it("[PRPI-1959] should show the correct score", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("19");
          expect(await eventViewTeamBScoreSO.secondScore.getText()).toBe("19");
          expect(await eventViewTeamBScoreSO.thirdScore.getText()).toBe("0");
          expect(await eventViewTeamBScoreSO.fourthScore.getText()).toBe("-");

          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("22");
          expect(await eventViewTeamAScoreSO.secondScore.getText()).toBe("22");
          expect(await eventViewTeamAScoreSO.thirdScore.getText()).toBe("0");
          expect(await eventViewTeamAScoreSO.fourthScore.getText()).toBe("-");
        });

        it("[PRPI-1960] should show the game status (Q2 (timeRemaining: null))", async () => {
          expect(await eventViewDurationSO.prefixLabel.isDisplayed()).toBe(false);
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("Q2");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-1961] should show the correct score", async () => {
          expect(await couponFirstTeamBScoreSO.getText()).toBe("19");
          expect(await couponFirstTeamAScoreSO.getText()).toBe("22");
        });

        it("[PRPI-1962] should show the game status (Q2 (timeRemaining: null))", async () => {
          expect(await couponDurationSO.prefixLabel.isDisplayed()).toBe(false);
          expect(await couponDurationSO.statusLabel.getText()).toBe("Q2");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINISHED_MOCK));
        await browser.waitUntilEquals(couponDurationSO.statusLabel, "FT");
      });

      describe("and fixture card", () => {
        it("[PRPI-1963] should show the final score", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("67");
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("84");
        });

        it("[PRPI-1964] should show the game status (Full Time)", async () => {
          expect(await eventViewDurationSO.prefixLabel.isDisplayed()).toBe(false);
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("Full Time");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-1965] should show the final score", async () => {
          expect(await couponFirstTeamBScoreSO.getText()).toBe("67");
          expect(await couponFirstTeamAScoreSO.getText()).toBe("84");
        });

        it("[PRPI-1966] should show the game status (FT)", async () => {
          expect(await couponDurationSO.prefixLabel.isDisplayed()).toBe(false);
          expect(await couponDurationSO.statusLabel.getText()).toBe("FT");
        });
      });
    });
  });

  describe("when scrolling down at the event view", () => {
    beforeAll(async () => {
      await swipeUp();
    });

    describe("and the match is in PRE_MATCH", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            fixture: [{ ...SCA_PRE_MATCH_MOCK.fixture[0] }, { ...SCA_PRE_MATCH_MOCK.fixture[0], id: EVENT_ID_2 }],
          }),
        );
        await browser.waitUntilEquals(eventViewDurationSO.date, "Jan 16");
      });

      describe("and fixture card", () => {
        it("[PRPI-1967] should show the competition name", async () => {
          expect(await eventViewBasketballFixtureSO.title.getText()).toBe("NBA");
        });

        it("[PRPI-1968] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-1969] should show the game starting date and time", async () => {
          expect(await eventViewDurationSO.date.getText()).toBe("Jan 16");
          expect(await eventViewDurationSO.time.getText()).toBe("20:00");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-1970] should show the competition name", async () => {
          expect(await swimlaneBasketballFixtureSO.title.getText()).toBe("NBA");
        });

        it("[PRPI-1971] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Cleveland Cavaliers");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("@ Toronto Raptors");
        });

        it("[PRPI-1972] should show the game starting date and time", async () => {
          expect(await swimlaneDurationSO.date.getText()).toBe("Jan 16");
          expect(await swimlaneDurationSO.time.getText()).toBe("20:00");
        });
      });
    });

    describe("and the match is the first quarter", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            fixture: [
              { ...SCA_FIRST_QUARTER_MOCK.fixture[0] },
              { ...SCA_FIRST_QUARTER_MOCK.fixture[0], id: EVENT_ID_2, timeRemainingClock: 540 },
            ],
          }),
        );
        await browser.waitUntilEquals(eventViewDurationSO.prefixLabel, "Q1");
      });

      describe("and fixture card", () => {
        it("[PRPI-1973] should show the competition name", async () => {
          expect(await eventViewBasketballFixtureSO.title.getText()).toBe("NBA");
        });

        it("[PRPI-1974] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-1975] should show the game status (Q1 - 0')", async () => {
          expect(await eventViewDurationSO.prefixLabel.getText()).toBe("Q1");
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("0'");
        });

        it("[PRPI-1976] should show the correct scores", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("17");
          expect(await eventViewTeamBScoreSO.secondScore.getText()).toBe("17");
          expect(await eventViewTeamBScoreSO.thirdScore.getText()).toBe("-");

          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("20");
          expect(await eventViewTeamAScoreSO.secondScore.getText()).toBe("20");
          expect(await eventViewTeamAScoreSO.thirdScore.getText()).toBe("-");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-1977] should show the competition name", async () => {
          expect(await swimlaneBasketballFixtureSO.title.getText()).toBe("NBA");
        });

        it("[PRPI-1978] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Cleveland Cavaliers");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("@ Toronto Raptors");
        });

        it("[PRPI-1979] should show the game status (Q1 - 9')", async () => {
          expect(await swimlaneDurationSO.prefixLabel.getText()).toBe("Q1");
          expect(await swimlaneDurationSO.statusLabel.getText()).toBe("9'");
        });

        it("[PRPI-1980] should show the correct scores", async () => {
          expect(await swimlaneTeamBScoreSO.firstScore.getText()).toBe("17");
          expect(await swimlaneTeamBScoreSO.secondScore.getText()).toBe("17");
          expect(await swimlaneTeamBScoreSO.thirdScore.getText()).toBe("-");

          expect(await swimlaneTeamAScoreSO.firstScore.getText()).toBe("20");
          expect(await swimlaneTeamAScoreSO.secondScore.getText()).toBe("20");
          expect(await swimlaneTeamAScoreSO.thirdScore.getText()).toBe("-");
        });
      });
    });

    describe("and the match goes Over Time", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            fixture: [{ ...SCA_OVER_TIME_MOCK.fixture[0] }, { ...SCA_OVER_TIME_MOCK.fixture[0], id: EVENT_ID_2 }],
          }),
        );
        await browser.waitUntilEquals(eventViewDurationSO.prefixLabel, "OT");
      });

      describe("and fixture card", () => {
        it("[PRPI-1981] should show the correct score", async () => {});

        it("[PRPI-1982] should show the game status (OT - 5')", async () => {
          expect(await eventViewDurationSO.prefixLabel.getText()).toBe("OT");
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("5'");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-1983] should show the correct score", async () => {
          expect(await swimlaneTeamBScoreSO.sixthScore.getText()).toBe("5");
          expect(await swimlaneTeamAScoreSO.sixthScore.getText()).toBe("12");
        });

        it("[PRPI-1984] should show the game status (OT - 5')", async () => {
          expect(await swimlaneDurationSO.prefixLabel.getText()).toBe("OT");
          expect(await swimlaneDurationSO.statusLabel.getText()).toBe("5'");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            fixture: [{ ...SCA_FINISHED_MOCK.fixture[0] }, { ...SCA_FINISHED_MOCK.fixture[0], id: EVENT_ID_2 }],
          }),
        );
        await browser.waitUntilEquals(eventViewDurationSO.statusLabel, "FT");
        await browser.waitUntilEquals(swimlaneDurationSO.statusLabel, "Full Time");
      });

      it("[PRPI-1985] should show the correct game status (FT) for fixture card", async () => {
        expect(await eventViewDurationSO.prefixLabel.isDisplayed()).toBe(false);
        expect(await eventViewDurationSO.statusLabel.getText()).toBe("FT");
      });

      it("[PRPI-1986] should show the correct game status (FT) for swimlane", async () => {
        expect(await swimlaneDurationSO.prefixLabel.isDisplayed()).toBe(false);
        expect(await swimlaneDurationSO.statusLabel.getText()).toBe("Full Time");
      });
    });
  });
});
