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
  SnackbarSO,
  TeamSO,
  TeamsSO,
} = require("../../../../screen-objects");

const genericSO = new GenericSO();

// Ice Hockey Fixture Selectors
const eventViewIceHockeyFixtureSO = new AvBFixtureSO(genericSO.iceHockeyFixtures[0]);
const eventViewAvBScoreboardSO = new AvBScoreboardSO(eventViewIceHockeyFixtureSO.element);

const eventViewDurationSO = new DurationSO(eventViewAvBScoreboardSO.element);

const eventViewTeamsSO = new TeamsSO(eventViewAvBScoreboardSO.teams);
const eventViewHomeTeamSO = new TeamSO(eventViewTeamsSO.homeTeam);
const eventViewAwayTeamSO = new TeamSO(eventViewTeamsSO.awayTeam);

const scoreSO = new ScoreSO(eventViewAvBScoreboardSO.element);
const eventViewTeamAScoreSO = {
  firstScore: scoreSO.teamAScores[0],
  secondScore: scoreSO.teamAScores[1],
  thirdScore: scoreSO.teamAScores[2],
};
const eventViewTeamBScoreSO = {
  firstScore: scoreSO.teamBScores[0],
  secondScore: scoreSO.teamBScores[1],
  thirdScore: scoreSO.teamBScores[2],
};

// Coupon Card Group Selectors
const couponCardGroupSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(couponCardGroupSO.coupons[0]);
const couponIceHockeyFixtureSO = new AvBFixtureSO(firstCoupon.element);

const couponDurationSO = new DurationSO(couponIceHockeyFixtureSO.element);

const couponTeamsSO = new TeamsSO(couponIceHockeyFixtureSO.element);
const couponHomeTeamSO = new TeamSO(couponTeamsSO.homeTeam);
const couponAwayTeamSO = new TeamSO(couponTeamsSO.awayTeam);

const couponScoreSO = new ScoreSO(couponIceHockeyFixtureSO.element);
const couponFirstTeamAScoreSO = couponScoreSO.teamAScores[0];
const couponFirstTeamBScoreSO = couponScoreSO.teamBScores[0];

// Swimlane Card Group Selectors
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const swimlaneIceHockeyFixtureSO = new AvBFixtureSO(scrollableSwimlaneSO.element);

const swimlaneDurationSO = new DurationSO(swimlaneIceHockeyFixtureSO.element);

const swimlaneTeamsSO = new TeamsSO(swimlaneIceHockeyFixtureSO.element);
const swimlaneHomeTeamSO = new TeamSO(swimlaneTeamsSO.homeTeam);
const swimlaneAwayTeamSO = new TeamSO(swimlaneTeamsSO.awayTeam);

const swimlaneScoreSO = new ScoreSO(swimlaneIceHockeyFixtureSO.element);
const swimlaneTeamAScoreSO = {
  firstScore: swimlaneScoreSO.teamAScores[0],
  secondScore: swimlaneScoreSO.teamAScores[1],
  thirdScore: swimlaneScoreSO.teamAScores[2],
};
const swimlaneTeamBScoreSO = {
  firstScore: swimlaneScoreSO.teamBScores[0],
  secondScore: swimlaneScoreSO.teamBScores[1],
  thirdScore: swimlaneScoreSO.teamBScores[2],
};
const snackbarSO = new SnackbarSO();

const mockService = new MockService();

const COMPETITION_ID = 111;
const EVENT_ID = 34967318;

const EVENT_ID_2 = 59895392;

const ICE_HOCKEY_FIXTURE = {
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Los Angeles Lakers @ Chicago Bulls",
    openDate: "2077-01-16T20:00:00Z",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "NHL",
    },
  },
  fixture: {
    __typename: "IceHockeyFixture",
    urn: `ppb:fixture:${EVENT_ID}`,
    periodClock: "PERIOD_1",
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
      name: "NHL",
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
        ...ICE_HOCKEY_FIXTURE,
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
                ...ICE_HOCKEY_FIXTURE,
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
                            name: "NHL",
                          },
                        },
                        competition: {
                          urn: `ppb:competition:${COMPETITION_ID}`,
                          name: "NHL",
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
                  __typename: "IceHockeyFixture",
                  urn: `ppb:fixture:${EVENT_ID_2}`,
                  periodClock: "PERIOD_1",
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
                    name: "NHL",
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
              name: "NHL",
            },
          },
          competition: {
            urn: `ppb:competition:${COMPETITION_ID}`,
            name: "NHL",
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
                    name: "NHL",
                  },
                },
                competition: {
                  urn: `ppb:competition:${COMPETITION_ID}`,
                  name: "NHL",
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

const SCA_FIRST_PERIOD_MOCK = {
  iceHockeyFixture: [
    {
      id: EVENT_ID,
      periodClock: "PERIOD_1",
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

const SCA_FIRST_PERIOD_END_MOCK = {
  iceHockeyFixture: [
    {
      id: EVENT_ID,
      periodClock: "END_PERIOD_1",
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

const SCA_SECOND_PERIOD_MOCK = {
  iceHockeyFixture: [
    {
      id: EVENT_ID,
      periodClock: "PERIOD_2",
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
  iceHockeyFixture: [
    {
      id: EVENT_ID,
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
  iceHockeyFixture: [
    {
      id: EVENT_ID,
      periodClock: "END",
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
      ],

      homeScore: 67,
      awayScore: 84,
    },
  ],
};

describe("Ice Hockey Fixture", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getEventLayout(EVENT_VIEW_BFF_MOCK));
    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(snackbarSO.element);
    await snackbarSO.closeButton.click();
    await browser.waitUntilEquals(eventViewIceHockeyFixtureSO.title, "NHL");
  });

  describe("when at the top of the event view", () => {
    describe("and the match is the first period", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FIRST_PERIOD_MOCK));
        await browser.waitUntilEquals(eventViewTeamBScoreSO.firstScore, "17");
      });

      describe("and fixture card", () => {
        it("[PRPI-2038] should show the competition name", async () => {
          expect(await eventViewIceHockeyFixtureSO.title.getText()).toBe("NHL");
        });

        it("[PRPI-2039] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2040] should show the correct scores", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("17");
          expect(await eventViewTeamBScoreSO.secondScore.getText()).toBe("17");

          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("20");
          expect(await eventViewTeamAScoreSO.secondScore.getText()).toBe("20");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2041] should not show the competition name", async () => {
          expect(await couponIceHockeyFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2042] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await couponAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2043] should show the correct scores", async () => {
          expect(await couponFirstTeamBScoreSO.getText()).toBe("17");
          expect(await couponFirstTeamAScoreSO.getText()).toBe("20");
        });
      });
    });

    describe("and the first period ends ", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FIRST_PERIOD_END_MOCK));
        await browser.waitUntilEquals(eventViewDurationSO.statusLabel, "End of Period");
      });

      describe("and fixture card", () => {
        it("[PRPI-2044] should show the game status (End of Period)", async () => {
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("End of Period");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2045] should show the game status (End)", async () => {
          expect(await couponDurationSO.statusLabel.getText()).toBe("End");
        });
      });
    });

    describe("and the match goes to the second period", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_SECOND_PERIOD_MOCK));
        await browser.waitUntilEquals(eventViewTeamBScoreSO.firstScore, "19");
      });

      describe("and fixture card", () => {
        it("[PRPI-2046] should show the correct score", async () => {
          await browser.waitUntilEquals(
            eventViewTeamBScoreSO.firstScore,
            "19",
            "Team B - First score correctly updated",
          );
          await browser.waitUntilEquals(
            eventViewTeamBScoreSO.secondScore,
            "19",
            "Team B - Second score correctly updated",
          );
          await browser.waitUntilEquals(
            eventViewTeamBScoreSO.thirdScore,
            "0",
            "Team B - Third score correctly updated",
          );

          await browser.waitUntilEquals(
            eventViewTeamAScoreSO.firstScore,
            "22",
            "Team A - First score correctly updated",
          );
          await browser.waitUntilEquals(
            eventViewTeamAScoreSO.secondScore,
            "22",
            "Team A - Second score correctly updated",
          );
          await browser.waitUntilEquals(
            eventViewTeamAScoreSO.thirdScore,
            "0",
            "Team A - Third score correctly updated",
          );
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2047] should show the correct score", async () => {
          expect(await couponFirstTeamBScoreSO.getText()).toBe("19");
          expect(await couponFirstTeamAScoreSO.getText()).toBe("22");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINISHED_MOCK));
        await browser.waitUntilEquals(couponDurationSO.statusLabel, "FT");
      });

      describe("and fixture card", () => {
        it("[PRPI-2048] should show the final score", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("67");
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("84");
        });

        it("[PRPI-2049] should show the game status (Full Time)", async () => {
          expect(await eventViewDurationSO.statusLabel.getText()).toBe("Full Time");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2050] should show the final score", async () => {
          expect(await couponFirstTeamBScoreSO.getText()).toBe("67");
          expect(await couponFirstTeamAScoreSO.getText()).toBe("84");
        });

        it("[PRPI-2051] should show the game status (FT)", async () => {
          expect(await couponDurationSO.statusLabel.getText()).toBe("FT");
        });
      });
    });
  });

  describe("when scrolling down at the event view", () => {
    beforeAll(async () => {
      await swipeUp();
    });

    describe("and the match is the first period", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            iceHockeyFixture: [
              { ...SCA_FIRST_PERIOD_MOCK.iceHockeyFixture[0] },
              { ...SCA_FIRST_PERIOD_MOCK.iceHockeyFixture[0], id: EVENT_ID_2 },
            ],
          }),
        );
        await browser.waitUntilEquals(eventViewTeamBScoreSO.firstScore, "17");
      });

      describe("and fixture card", () => {
        it("[PRPI-2052] should show the competition name", async () => {
          expect(await eventViewIceHockeyFixtureSO.title.getText()).toBe("NHL");
        });

        it("[PRPI-2053] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2054] should show the correct scores", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("17");
          expect(await eventViewTeamBScoreSO.secondScore.getText()).toBe("17");
          expect(await eventViewTeamBScoreSO.thirdScore.getText()).toBe("-");

          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("20");
          expect(await eventViewTeamAScoreSO.secondScore.getText()).toBe("20");
          expect(await eventViewTeamAScoreSO.thirdScore.getText()).toBe("-");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2055] should show the competition name", async () => {
          expect(await swimlaneIceHockeyFixtureSO.title.getText()).toBe("NHL");
        });

        it("[PRPI-2056] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Cleveland Cavaliers");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("@ Toronto Raptors");
        });

        it("[PRPI-2057] should show the correct scores", async () => {
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
            iceHockeyFixture: [
              { ...SCA_OVER_TIME_MOCK.iceHockeyFixture[0] },
              { ...SCA_OVER_TIME_MOCK.iceHockeyFixture[0], id: EVENT_ID_2 },
            ],
          }),
        );
        await browser.waitUntilEquals(swimlaneTeamBScoreSO.firstScore, "72");
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2058] should show the correct score", async () => {
          expect(await swimlaneTeamBScoreSO.firstScore.getText()).toBe("72");
          expect(await swimlaneTeamAScoreSO.firstScore.getText()).toBe("96");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            iceHockeyFixture: [
              { ...SCA_FINISHED_MOCK.iceHockeyFixture[0] },
              { ...SCA_FINISHED_MOCK.iceHockeyFixture[0], id: EVENT_ID_2 },
            ],
          }),
        );
        await browser.waitUntilEquals(eventViewDurationSO.statusLabel, "FT");
        await browser.waitUntilEquals(swimlaneDurationSO.statusLabel, "Full Time");
      });

      it("[PRPI-2059] should show the correct game status (FT) for fixture card", async () => {
        expect(await eventViewDurationSO.statusLabel.getText()).toBe("FT");
      });

      it("[PRPI-2060] should show the correct game status (FT) for swimlane", async () => {
        expect(await swimlaneDurationSO.statusLabel.getText()).toBe("Full Time");
      });
    });
  });
});
