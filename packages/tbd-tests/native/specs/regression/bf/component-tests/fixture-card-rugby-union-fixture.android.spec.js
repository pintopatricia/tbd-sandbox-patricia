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
} = require("../../../../screen-objects");

const genericSO = new GenericSO();

// Rugby Union Fixture Selectors
const eventViewRugbyUnionFixtureSO = new AvBFixtureSO(genericSO.rugbyUnionFixtures[0]);
const eventViewAvBScoreboardSO = new AvBScoreboardSO(eventViewRugbyUnionFixtureSO.element);

const eventViewDurationSO = new DurationSO(eventViewAvBScoreboardSO.element);

const eventViewTeamsSO = new TeamsSO(eventViewAvBScoreboardSO.teams);
const eventViewHomeTeamSO = new TeamSO(eventViewTeamsSO.homeTeam);
const eventViewAwayTeamSO = new TeamSO(eventViewTeamsSO.awayTeam);

const scoreSO = new ScoreSO(eventViewAvBScoreboardSO.element);
const eventViewTeamAScoreSO = {
  firstScore: scoreSO.teamAScores[0],
};
const eventViewTeamBScoreSO = {
  firstScore: scoreSO.teamBScores[0],
};

// Coupon Card Group Selectors
const couponCardGroupSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(couponCardGroupSO.coupons[0]);
const couponRugbyUnionFixtureSO = new AvBFixtureSO(firstCoupon.element);

const couponDurationSO = new DurationSO(couponRugbyUnionFixtureSO.element);

const couponTeamsSO = new TeamsSO(couponRugbyUnionFixtureSO.element);
const couponHomeTeamSO = new TeamSO(couponTeamsSO.homeTeam);
const couponAwayTeamSO = new TeamSO(couponTeamsSO.awayTeam);

const couponScoreSO = new ScoreSO(couponRugbyUnionFixtureSO.element);
const couponFirstTeamAScoreSO = couponScoreSO.teamAScores[0];
const couponFirstTeamBScoreSO = couponScoreSO.teamBScores[0];

// Swimlane Card Group Selectors
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const swimlaneRugbyUnionFixtureSO = new AvBFixtureSO(scrollableSwimlaneSO.element);

const swimlaneDurationSO = new DurationSO(swimlaneRugbyUnionFixtureSO.element);

const swimlaneTeamsSO = new TeamsSO(swimlaneRugbyUnionFixtureSO.element);
const swimlaneHomeTeamSO = new TeamSO(swimlaneTeamsSO.homeTeam);
const swimlaneAwayTeamSO = new TeamSO(swimlaneTeamsSO.awayTeam);

const swimlaneScoreSO = new ScoreSO(swimlaneRugbyUnionFixtureSO.element);
const swimlaneTeamAScoreSO = {
  firstScore: swimlaneScoreSO.teamAScores[0],
};
const swimlaneTeamBScoreSO = {
  firstScore: swimlaneScoreSO.teamBScores[0],
};

const mockService = new MockService();

const COMPETITION_ID = 111;
const EVENT_ID = 29359895;

const EVENT_ID_2 = 59895392;

const RUGBY_UNION_FIXTURE = {
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Los Angeles Lakers @ Chicago Bulls",
    openDate: "2077-01-16T20:00:00Z",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "European Champions Cup",
    },
  },
  fixture: {
    __typename: "RugbyUnionFixture",
    urn: `ppb:fixture:${EVENT_ID}`,
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
      name: "European Champions Cup",
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
        ...RUGBY_UNION_FIXTURE,
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
                ...RUGBY_UNION_FIXTURE,
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
                            name: "European Champions Cup",
                          },
                        },
                        competition: {
                          urn: `ppb:competition:${COMPETITION_ID}`,
                          name: "European Champions Cup",
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
                  __typename: "RugbyUnionFixture",
                  urn: `ppb:fixture:${EVENT_ID_2}`,
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
                    name: "European Champions Cup",
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
              name: "European Champions Cup",
            },
          },
          competition: {
            urn: `ppb:competition:${COMPETITION_ID}`,
            name: "European Champions Cup",
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
                    name: "European Champions Cup",
                  },
                },
                competition: {
                  urn: `ppb:competition:${COMPETITION_ID}`,
                  name: "European Champions Cup",
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
  rugbyUnionFixture: [
    {
      id: EVENT_ID,
    },
  ],
};

const SCA_IN_PLAY_MOCK = {
  rugbyUnionFixture: [
    {
      id: EVENT_ID,
      score: {
        scoreHome: 17,
        scoreAway: 20,
      },
    },
  ],
};

describe("Rugby Union Fixture", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getEventLayout(EVENT_VIEW_BFF_MOCK));
    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilEquals(eventViewRugbyUnionFixtureSO.title, "European Champions Cup");
  });

  describe("when at the top of the event view", () => {
    describe("and the match is PRE_MATCH", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
        await browser.waitUntilEquals(eventViewDurationSO.date, "Jan 16");
      });

      describe("and in fixture card", () => {
        it("[PRPI-2084] should show the competition name", async () => {
          expect(await eventViewRugbyUnionFixtureSO.title.getText()).toBe("European Champions Cup");
        });

        it("[PRPI-2085] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2086] should show the game starting date and time", async () => {
          expect(await eventViewDurationSO.date.getText()).toBe("Jan 16");
          expect(await eventViewDurationSO.time.getText()).toBe("20:00");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2087] should not show the competition name", async () => {
          expect(await couponRugbyUnionFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2088] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await couponAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2089] should show the game starting date and time", async () => {
          expect(await couponDurationSO.date.getText()).toBe("Jan 16");
          expect(await couponDurationSO.time.getText()).toBe("20:00");
        });
      });
    });

    describe("and the match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_PLAY_MOCK));
        await browser.waitUntilEquals(eventViewTeamBScoreSO.firstScore, "17");
      });

      describe("and fixture card", () => {
        it("[PRPI-2090] should show the competition name", async () => {
          expect(await eventViewRugbyUnionFixtureSO.title.getText()).toBe("European Champions Cup");
        });

        it("[PRPI-2091] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2092] should show the correct scores", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("17");

          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("20");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2093] should not show the competition name", async () => {
          expect(await couponRugbyUnionFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2094] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await couponAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2095] should show the correct scores", async () => {
          expect(await couponFirstTeamBScoreSO.getText()).toBe("17");
          expect(await couponFirstTeamAScoreSO.getText()).toBe("20");
        });
      });
    });
  });

  describe("when scrolling down at the event view", () => {
    beforeAll(async () => {
      await swipeUp();
    });

    describe("and the match is PRE_MATCH", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            rugbyUnionFixture: [
              { ...SCA_PRE_MATCH_MOCK.rugbyUnionFixture[0] },
              { ...SCA_PRE_MATCH_MOCK.rugbyUnionFixture[0], id: EVENT_ID_2 },
            ],
          }),
        );
        await browser.waitUntilEquals(eventViewDurationSO.date, "Jan 16");
      });

      describe("and fixture card", () => {
        it("[PRPI-2096] should show the competition name", async () => {
          expect(await eventViewRugbyUnionFixtureSO.title.getText()).toBe("European Champions Cup");
        });

        it("[PRPI-2097] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2098] should show the game starting date and time", async () => {
          expect(await eventViewDurationSO.date.getText()).toBe("Jan 16");
          expect(await eventViewDurationSO.time.getText()).toBe("20:00");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2099] should show the competition name", async () => {
          expect(await swimlaneRugbyUnionFixtureSO.title.getText()).toBe("European Champions Cup");
        });

        it("[PRPI-2100] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Cleveland Cavaliers");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("@ Toronto Raptors");
        });

        it("[PRPI-2101] should show the game starting date and time", async () => {
          expect(await swimlaneDurationSO.date.getText()).toBe("Jan 16");
          expect(await swimlaneDurationSO.time.getText()).toBe("20:00");
        });
      });
    });

    describe("and the match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            rugbyUnionFixture: [
              { ...SCA_IN_PLAY_MOCK.rugbyUnionFixture[0] },
              {
                ...SCA_IN_PLAY_MOCK.rugbyUnionFixture[0],
                id: EVENT_ID_2,
                halfTimeScore: { halfTimeScoreHome: 1, halfTimeScoreAway: 2 },
              },
            ],
          }),
        );
        await browser.waitUntilEquals(eventViewTeamBScoreSO.firstScore, "17");
      });

      describe("and fixture card", () => {
        it("[PRPI-2102] should show the competition name", async () => {
          expect(await eventViewRugbyUnionFixtureSO.title.getText()).toBe("European Champions Cup");
        });

        it("[PRPI-2103] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("Los Angeles Lakers");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("@ Chicago Bulls");
        });

        it("[PRPI-2104] should show the correct scores", async () => {
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("17");

          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("20");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2105] should show the competition name", async () => {
          expect(await swimlaneRugbyUnionFixtureSO.title.getText()).toBe("European Champions Cup");
        });

        it("[PRPI-2106] should show the teams name and \u201C@\u201D for indicating the home team", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Cleveland Cavaliers");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("@ Toronto Raptors");
        });

        it("[PRPI-2107] should show the correct scores", async () => {
          expect(await swimlaneTeamBScoreSO.firstScore.getText()).toBe("17");

          expect(await swimlaneTeamAScoreSO.firstScore.getText()).toBe("20");
        });
      });
    });
  });
});
