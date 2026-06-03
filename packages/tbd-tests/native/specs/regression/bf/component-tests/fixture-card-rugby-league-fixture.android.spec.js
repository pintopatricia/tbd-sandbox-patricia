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
  ScoreSO,
  ScrollableSwimlaneSO,
  TeamSO,
  TeamsSO,
} = require("../../../../screen-objects");

const genericSO = new GenericSO();

const eventViewRugbyLeagueFixtureSO = new AvBFixtureSO(genericSO.rugbyLeagueFixtures[0]);
const eventViewAvBScoreboardSO = new AvBScoreboardSO(eventViewRugbyLeagueFixtureSO.element);
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

const couponCardGroupSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(couponCardGroupSO.coupons[0]);
const couponRugbyLeagueFixtureSO = new AvBFixtureSO(firstCoupon.element);

const couponTeamsSO = new TeamsSO(couponRugbyLeagueFixtureSO.element);
const couponHomeTeamSO = new TeamSO(couponTeamsSO.homeTeam);
const couponAwayTeamSO = new TeamSO(couponTeamsSO.awayTeam);

const couponScoreSO = new ScoreSO(couponRugbyLeagueFixtureSO.element);
const couponFirstTeamAScoreSO = couponScoreSO.teamAScores[0];
const couponFirstTeamBScoreSO = couponScoreSO.teamBScores[0];

const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const swimlaneRugbyLeagueFixtureSO = new AvBFixtureSO(scrollableSwimlaneSO.element);

const swimlaneTeamsSO = new TeamsSO(swimlaneRugbyLeagueFixtureSO.element);
const swimlaneHomeTeamSO = new TeamSO(swimlaneTeamsSO.homeTeam);
const swimlaneAwayTeamSO = new TeamSO(swimlaneTeamsSO.awayTeam);

const swimlaneScoreSO = new ScoreSO(swimlaneRugbyLeagueFixtureSO.element);
const swimlaneTeamAScoreSO = {
  firstScore: swimlaneScoreSO.teamAScores[0],
};
const swimlaneTeamBScoreSO = {
  firstScore: swimlaneScoreSO.teamBScores[0],
};

const mockService = new MockService();

const COMPETITION_ID = 147701;
const EVENT_ID = 56789123;

const EVENT_ID_2 = 56789124;

const RUGBY_LEAGUE_FIXTURE = {
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "St Helens v Wigan Warriors",
    openDate: "2077-03-15T19:45:00Z",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "Super League",
    },
  },
  fixture: {
    __typename: "RugbyLeagueFixture",
    urn: `ppb:fixture:${EVENT_ID}`,
    isAmericanFormat: false,
    runnerNames: {
      home: "St Helens",
      away: "Wigan Warriors",
    },
  },
};

const EVENT_VIEW_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  url: `/rugby-league/super-league/st-helens-v-wigan-warriors/e-${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "St Helens v Wigan Warriors",
    openDate: "2077-03-15T19:45:00Z",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "Super League",
    },
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:event:${EVENT_ID}`,
        selectedViewLink: {
          label: "St Helens v Wigan Warriors",
          viewLink: {
            viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
            viewUrl: `/rugby-league/super-league/st-helens-v-wigan-warriors/e-${EVENT_ID}`,
          },
        },
        siblingViews: {
          edges: [
            {
              node: {
                label: "St Helens v Wigan Warriors",
                viewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `/rugby-league/super-league/st-helens-v-wigan-warriors/e-${EVENT_ID}`,
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        ...RUGBY_LEAGUE_FIXTURE,
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:rugby-league/s/1",
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
                ...RUGBY_LEAGUE_FIXTURE,
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
                      urn: "ppb:sbkMarket:924.333333333",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                          name: "St Helens v Wigan Warriors",
                          openDate: "2077-03-15T19:45:00Z",
                          competition: {
                            urn: `ppb:competition:${COMPETITION_ID}`,
                            name: "Super League",
                          },
                        },
                        competition: {
                          urn: `ppb:competition:${COMPETITION_ID}`,
                          name: "Super League",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.333333333/16113821",
                          name: "St Helens",
                          selectionId: 16113821,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.333333333/9168659",
                          name: "Wigan Warriors",
                          selectionId: 9168659,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.333333333/16113821",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.333333333/9168659",
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
                  __typename: "RugbyLeagueFixture",
                  urn: `ppb:fixture:${EVENT_ID_2}`,
                  isAmericanFormat: false,
                  runnerNames: {
                    home: "Leeds Rhinos",
                    away: "Hull FC",
                  },
                },
                sportevent: {
                  urn: `ppb:event:${EVENT_ID_2}`,
                  name: "Leeds Rhinos v Hull FC",
                  openDate: "2077-03-15T20:00:00Z",
                  competition: {
                    urn: `ppb:competition:${COMPETITION_ID}`,
                    name: "Super League",
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
        urn: "ppb:tbd:card:56789123:MATCH_ODDS",
        title: "Match Odds",
        marketsHierarchy: {
          __typename: "EventCompetitionHierarchy",
          sportevent: {
            urn: `ppb:event:${EVENT_ID}`,
            name: "St Helens v Wigan Warriors",
            openDate: "2077-03-15T19:45:00Z",
            competition: {
              urn: `ppb:competition:${COMPETITION_ID}`,
              name: "Super League",
            },
          },
          competition: {
            urn: `ppb:competition:${COMPETITION_ID}`,
            name: "Super League",
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
                  name: "St Helens v Wigan Warriors",
                  openDate: "2077-03-15T19:45:00Z",
                  competition: {
                    urn: `ppb:competition:${COMPETITION_ID}`,
                    name: "Super League",
                  },
                },
                competition: {
                  urn: `ppb:competition:${COMPETITION_ID}`,
                  name: "Super League",
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
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337366/1/0" },
              { runnerURN: "ppb:excRunner:1.160337366/2/0" },
              { runnerURN: "ppb:excRunner:1.160337366/3/0" },
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
        urn: "ppb:tbd:cardgroup:filtered:rugby-league/s/1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:${EVENT_ID_2}`,
      },
    },
    { node: { urn: "ppb:tbd:card:56789123:MATCH_ODDS", __typename: "MarketCard" } },
  ],
};

const SCA_FIRST_HALF_MOCK = {
  rugbyLeagueFixture: [
    {
      id: EVENT_ID,
      score: {
        home: 12,
        away: 6,
      },
      halfTimeScore: null,
    },
  ],
};

const SCA_HALF_TIME_MOCK = {
  rugbyLeagueFixture: [
    {
      id: EVENT_ID,
      score: {
        home: 18,
        away: 12,
      },
      halfTimeScore: {
        home: 18,
        away: 12,
      },
    },
  ],
};

const SCA_SECOND_HALF_MOCK = {
  rugbyLeagueFixture: [
    {
      id: EVENT_ID,
      score: {
        home: 24,
        away: 18,
      },
      halfTimeScore: {
        home: 18,
        away: 12,
      },
    },
  ],
};

const SCA_FINISHED_MOCK = {
  rugbyLeagueFixture: [
    {
      id: EVENT_ID,
      score: {
        home: 36,
        away: 24,
      },
      halfTimeScore: {
        home: 18,
        away: 12,
      },
    },
  ],
};

describe("Rugby League Fixture", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getEventLayout(EVENT_VIEW_BFF_MOCK));
    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilEquals(eventViewRugbyLeagueFixtureSO.title, "Super League");
  });

  describe("when at the top of the event view", () => {
    describe("and the match is in first half", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FIRST_HALF_MOCK));
        await browser.waitUntilEquals(eventViewTeamAScoreSO.firstScore, "12");
      });

      describe("and fixture card", () => {
        it("[PRPI-2061] should show the competition name", async () => {
          expect(await eventViewRugbyLeagueFixtureSO.title.getText()).toBe("Super League");
        });

        it("[PRPI-2062] should show the teams names", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("St Helens");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("Wigan Warriors");
        });

        it("[PRPI-2063] should show the correct scores", async () => {
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("12");
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("6");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2064] should not show the competition name", async () => {
          expect(await couponRugbyLeagueFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2065] should show the teams names", async () => {
          expect(await couponHomeTeamSO.name.getText()).toBe("St Helens");
          expect(await couponAwayTeamSO.name.getText()).toBe("Wigan Warriors");
        });

        it("[PRPI-2066] should show the correct scores", async () => {
          expect(await couponFirstTeamAScoreSO.getText()).toBe("12");
          expect(await couponFirstTeamBScoreSO.getText()).toBe("6");
        });
      });
    });

    describe("and the match reaches half time", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_HALF_TIME_MOCK));
        await browser.waitUntilEquals(eventViewTeamAScoreSO.firstScore, "18");
      });

      describe("and fixture card", () => {
        it("[PRPI-2067] should show the correct scores", async () => {
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("18");
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("12");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2069] should show the correct scores", async () => {
          expect(await couponFirstTeamAScoreSO.getText()).toBe("18");
          expect(await couponFirstTeamBScoreSO.getText()).toBe("12");
        });
      });
    });

    describe("and the match is in second half", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_SECOND_HALF_MOCK));
        await browser.waitUntilEquals(eventViewTeamAScoreSO.firstScore, "24");
      });

      describe("and fixture card", () => {
        it("[PRPI-2070] should show the correct score", async () => {
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("24");
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("18");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2072] should show the correct score", async () => {
          expect(await couponFirstTeamAScoreSO.getText()).toBe("24");
          expect(await couponFirstTeamBScoreSO.getText()).toBe("18");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINISHED_MOCK));
        await browser.waitUntilEquals(eventViewTeamAScoreSO.firstScore, "36");
      });

      describe("and fixture card", () => {
        it("[PRPI-2073] should show the final score", async () => {
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("36");
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("24");
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2075] should show the final score", async () => {
          expect(await couponFirstTeamAScoreSO.getText()).toBe("36");
          expect(await couponFirstTeamBScoreSO.getText()).toBe("24");
        });
      });
    });
  });

  describe("when scrolling down at the event view", () => {
    beforeAll(async () => {
      await swipeUp();
    });

    describe("and the match is in play", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            rugbyLeagueFixture: [
              { ...SCA_FIRST_HALF_MOCK.rugbyLeagueFixture[0] },
              { ...SCA_FIRST_HALF_MOCK.rugbyLeagueFixture[0], id: EVENT_ID_2 },
            ],
          }),
        );
        await browser.waitUntilEquals(eventViewTeamAScoreSO.firstScore, "12");
      });

      describe("and fixture card", () => {
        it("[PRPI-2076] should show the competition name", async () => {
          expect(await eventViewRugbyLeagueFixtureSO.title.getText()).toBe("Super League");
        });

        it("[PRPI-2077] should show the teams names", async () => {
          expect(await eventViewHomeTeamSO.name.getText()).toBe("St Helens");
          expect(await eventViewAwayTeamSO.name.getText()).toBe("Wigan Warriors");
        });

        it("[PRPI-2078] should show the correct scores", async () => {
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("12");
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("6");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2079] should show the competition name", async () => {
          expect(await swimlaneRugbyLeagueFixtureSO.title.getText()).toBe("Super League");
        });

        it("[PRPI-2080] should show the teams names", async () => {
          expect(await swimlaneHomeTeamSO.name.getText()).toBe("Leeds Rhinos");
          expect(await swimlaneAwayTeamSO.name.getText()).toBe("Hull FC");
        });

        it("[PRPI-2081] should show the correct scores", async () => {
          expect(await swimlaneTeamAScoreSO.firstScore.getText()).toBe("12");
          expect(await swimlaneTeamBScoreSO.firstScore.getText()).toBe("6");
        });
      });
    });

    describe("and the match finishes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            rugbyLeagueFixture: [
              { ...SCA_FINISHED_MOCK.rugbyLeagueFixture[0] },
              { ...SCA_FINISHED_MOCK.rugbyLeagueFixture[0], id: EVENT_ID_2 },
            ],
          }),
        );
        await browser.waitUntilEquals(eventViewTeamAScoreSO.firstScore, "36");
      });

      describe("and fixture card", () => {
        it("[PRPI-2082] should show the final score", async () => {
          expect(await eventViewTeamAScoreSO.firstScore.getText()).toBe("36");
          expect(await eventViewTeamBScoreSO.firstScore.getText()).toBe("24");
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2083] should show the final score", async () => {
          expect(await swimlaneTeamAScoreSO.firstScore.getText()).toBe("36");
          expect(await swimlaneTeamBScoreSO.firstScore.getText()).toBe("24");
        });
      });
    });
  });
});
