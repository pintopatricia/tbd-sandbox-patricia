const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");

const {
  getSportsLayout,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
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

// Fixture Tennis Selectors
const avbFixtureSO = new AvBFixtureSO(genericSO.tennisFixtures[0]);
const avbScoreboardSO = new AvBScoreboardSO(genericSO.tennisFixtures[0]);
const durationSO = new DurationSO(avbFixtureSO.element);
const teamsSO = new TeamsSO(avbScoreboardSO.teams);
const homeTeamSO = new TeamSO(teamsSO.homeTeam);
const awayTeamSO = new TeamSO(teamsSO.awayTeam);

const scoreSO = new ScoreSO(avbScoreboardSO.element);

const firstHomeScoreSO = scoreSO.teamAScores[0];
const firstAwayScoreSO = scoreSO.teamBScores[0];
const secondHomeScoreSO = scoreSO.teamAScores[1];
const secondAwayScoreSO = scoreSO.teamBScores[1];
const thirdHomeScoreSO = scoreSO.teamAScores[2];
const thirdAwayScoreSO = scoreSO.teamBScores[2];

// Coupon Card Group Selectors
const couponCardGroupSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(couponCardGroupSO.coupons[0]);
const couponAvbScoreboardSO = new AvBScoreboardSO(firstCoupon.element);
const couponAvBFixtureSO = new AvBFixtureSO(firstCoupon.element);
const couponDurationSO = new DurationSO(firstCoupon.element);
const couponTeamsSO = new TeamsSO(couponAvbScoreboardSO.teams);
const couponScoreboardHomeTeamSO = new TeamSO(couponTeamsSO.homeTeam);
const couponScoreboardAwayTeamSO = new TeamSO(couponTeamsSO.awayTeam);

const couponScoreSO = new ScoreSO(couponAvbScoreboardSO.element);

const couponFirstHomeScoreSO = couponScoreSO.teamAScores[0];
const couponFirstAwayScoreSO = couponScoreSO.teamBScores[0];
const couponSecondHomeScoreSO = couponScoreSO.teamAScores[1];
const couponSecondAwayScoreSO = couponScoreSO.teamBScores[1];
const couponThirdHomeScoreSO = couponScoreSO.teamAScores[2];
const couponThirdAwayScoreSO = couponScoreSO.teamBScores[2];

// Swimlane Card Group Selectors
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const swimlaneAvBFixtureSO = new AvBFixtureSO(scrollableSwimlaneSO.element);
const swimlaneAvbScoreboardSO = new AvBScoreboardSO(scrollableSwimlaneSO.element);
const swimlaneDurationSO = new DurationSO(scrollableSwimlaneSO.element);
const swimlaneTeamsSO = new TeamsSO(swimlaneAvbScoreboardSO.teams);
const swimlaneScoreboardHomeTeamSO = new TeamSO(swimlaneTeamsSO.homeTeam);
const swimlaneScoreboardAwayTeamSO = new TeamSO(swimlaneTeamsSO.awayTeam);

const swimlaneScoreSO = new ScoreSO(swimlaneAvbScoreboardSO.element);

const swimlaneFirstHomeScoreSO = swimlaneScoreSO.teamAScores[0];
const swimlaneFirstAwayScoreSO = swimlaneScoreSO.teamBScores[0];
const swimlaneSecondHomeScoreSO = swimlaneScoreSO.teamAScores[1];
const swimlaneSecondAwayScoreSO = swimlaneScoreSO.teamBScores[1];
const swimlaneThirdHomeScoreSO = swimlaneScoreSO.teamAScores[2];
const swimlaneThirdAwayScoreSO = swimlaneScoreSO.teamBScores[2];

const mockService = new MockService();

const SURFACE_TYPE = "HARD";
const COMPETITION_NAME = "ATP Australian Open";
const HOME_PLAYER = { name: "Keanu Reeves", rank: 96 };
const AWAY_PLAYER = { name: "Reanu Keeves", rank: 69 };

const HOME_PLAYERS = [{ name: "Novak DjokovicDaSilvaPereira" }, { name: "Stefanos TsitsipasRodriguesFonseca" }];
const AWAY_PLAYERS = [
  { name: "Daniil Medvedev", rank: 2 },
  { name: "Alexander Zverev", rank: 3 },
];

const EVENT_TYPE_ID = 2;

const EVENT_ID = 29359895;
const EVENT_ID_2 = 59895392;

const SCA_POLING_TIMEOUT = 20000;

const PRE_MATCH_FIXTURE_SINGLE = {
  __typename: "TennisMatch",
  urn: `ppb:fixture:${EVENT_ID}`,
  runnerNames: {
    home: "Keanu Reeves",
    away: "Reanu Keeves",
  },
  scheduledStartTime: "2077-01-16T20:00:00",
  matchStatus: { status: "PRE_MATCH", reason: null },
  teamA: {
    side: "HOME",
    players: [HOME_PLAYER],
  },
  teamB: {
    side: "AWAY",
    players: [AWAY_PLAYER],
  },
};

const PRE_MATCH_FIXTURE_DOUBLES = {
  __typename: "TennisMatch",
  urn: `ppb:fixture:${EVENT_ID_2}`,
  runnerNames: {
    home: "DjokovicDaSilvaPereira/TsitsipasRodriguesFonseca",
    away: "Medvedev/Zverev",
  },
  scheduledStartTime: "2077-01-16T20:00:00",
  matchStatus: { status: "PRE_MATCH", reason: null },
  teamA: {
    side: "HOME",
    players: HOME_PLAYERS,
  },
  teamB: {
    side: "AWAY",
    players: AWAY_PLAYERS,
  },
};

const COUPON_CARD_GROUP_MOCK = {
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
          __typename: "EventMarketCard",
          urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
          title: "Match Odds",
          eventViewLink: {
            viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
            viewUrl: `/event/${EVENT_ID}`,
          },
          fixture: PRE_MATCH_FIXTURE_SINGLE,
          sportevent: {
            __typename: "SportsEvent",
            urn: `ppb:event:${EVENT_ID}`,
            competition: {
              urn: "ppb:competition:1234561",
              name: COMPETITION_NAME,
            },
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.222222222",
                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: `ppb:event:${EVENT_ID}`,
                    competition: {
                      urn: "ppb:competition:1234561",
                      name: COMPETITION_NAME,
                    },
                  },
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: COMPETITION_NAME,
                  },
                },
                runners: [
                  {
                    runnerURN: "ppb:sbkRunner:924.292366520/16113821",
                    name: "Keanu Reeves",
                    selectionId: 16113821,
                  },
                  {
                    runnerURN: "ppb:sbkRunner:924.292366520/9168659",
                    name: "Reanu Keeves",
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
};

const SPORT_VIEW_BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: COUPON_CARD_GROUP_MOCK,
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
};

const EVENT_VIEW_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    __typename: "SportsEvent",
    urn: `ppb:event:${EVENT_ID}`,
    competition: {
      urn: "ppb:competition:1234561",
      name: COMPETITION_NAME,
    },
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_ID}`,
        sport: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
          name: "Tennis Fixture",
        },
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        sportevent: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
          competition: {
            urn: "ppb:competition:1234561",
            name: COMPETITION_NAME,
          },
        },
        fixture: PRE_MATCH_FIXTURE_SINGLE,
      },
    },
    {
      node: COUPON_CARD_GROUP_MOCK,
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
                fixture: PRE_MATCH_FIXTURE_DOUBLES,
                sportevent: {
                  __typename: "SportsEvent",
                  urn: `ppb:event:${EVENT_ID_2}`,
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: COMPETITION_NAME,
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
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        title: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              name: "Match Odds",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: {
                  name: "Sampras/Williams v Williams/Mcenroe",
                  urn: `ppb:event:${EVENT_ID}`,
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: COMPETITION_NAME,
                  },
                },
                competition: {
                  urn: "ppb:competition:1234561",
                  name: COMPETITION_NAME,
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
  match: [
    {
      id: EVENT_ID,
      matchStatus: {
        status: "PRE_MATCH",
        reason: null,
      },
    },
  ],
};

const SCA_IN_RUNNING_MOCK = {
  match: [
    {
      id: EVENT_ID,
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamAScore: "2",
      teamBScore: "3",
      currentSet: {
        teamAScore: "15",
        teamBScore: "0",
        currentGame: {
          teamAScore: "15",
          teamBScore: "30",
          teamServing: "HOME",
          type: "NORMAL",
        },
      },
    },
  ],
};

const SCA_INTERRUPED_MOCK = {
  match: [
    {
      ...SCA_IN_RUNNING_MOCK.match[0],
      matchStatus: {
        status: "INTERRUPTED",
        reason: "RAIN_DELAY",
      },
      currentSet: {
        ...SCA_IN_RUNNING_MOCK.match[0].currentSet,
        currentGame: {
          ...SCA_IN_RUNNING_MOCK.match[0].currentSet.currentGame,
          teamAScore: "30",
          teamServing: "AWAY",
        },
      },
    },
  ],
};

const SCA_FINISHED_MOCK = {
  match: [
    {
      ...SCA_IN_RUNNING_MOCK.match[0],
      matchStatus: {
        status: "FINISHED",
      },
      teamAScore: "5",
      teamBScore: "1",
    },
  ],
};

describe("Tennis Scoreboard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(SPORT_VIEW_BFF_MOCK));
    await mockService.mockHttpRequest(getEventLayout(EVENT_VIEW_BFF_MOCK));
    const url = "tennis/s-2";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
    await browser.waitUntilDisplayed(avbFixtureSO.element, "Tennis fixture is not visible");
    await browser.waitUntilClickableNative(couponCardGroupSO.coupons[0]);
    await couponCardGroupSO.coupons[0].click();
    await browser.waitUntilDisplayed(avbFixtureSO.element);
    await browser.waitUntilDisplayed(avbScoreboardSO.element);
    /**
     * `await swipeDownElementFullscreen(avbFixtureSO.element)`
     * Swimlane card group and correct score card are not loading immediately 100% of the times
     * Suspected to be an issue on the react-native visibility information from android
     */
    await swipeDownElementFullscreen(avbFixtureSO.element);
    await browser.waitUntilDisplayed(swimlaneAvbScoreboardSO.element);
  });

  describe("when at the top of the event view", () => {
    describe("and the tennis match is in PRE_MATCH", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
        await browser.waitUntilEquals(avbScoreboardSO.matchInfo, SURFACE_TYPE);
      });

      describe("and in fixture card", () => {
        it("[PRPI-2166] should show the competition name", async () => {
          expect(await avbFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2167] should show the players names", async () => {
          expect(await homeTeamSO.name.getText()).toBe(`${HOME_PLAYER.name}`);
          expect(await awayTeamSO.name.getText()).toBe(`${AWAY_PLAYER.name}`);
        });

        it("[PRPI-2168] should show the game starting time", async () => {
          expect(await durationSO.date.getText()).toBe("Jan 16");
          expect(await durationSO.time.getText()).toBe("20:00");
        });

        it("[PRPI-2169] should show the game surface type", async () => {
          expect(await avbScoreboardSO.matchInfo.getText()).toBe(SURFACE_TYPE);
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2170] should not show the competition name", async () => {
          expect(await couponAvBFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2171] should show the players names", async () => {
          expect(await couponScoreboardHomeTeamSO.name.getText()).toBe(`${HOME_PLAYER.name}`);

          expect(await couponScoreboardAwayTeamSO.name.getText()).toBe(`${AWAY_PLAYER.name}`);
        });

        it("[PRPI-2172] should show the game starting time", async () => {
          expect(await couponDurationSO.date.getText()).toBe("Jan 16");
          expect(await couponDurationSO.time.getText()).toBe("20:00");
        });

        it("[PRPI-2173] should not show the game surface type", async () => {
          expect(await couponAvbScoreboardSO.matchInfo.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the tennis match is IN_RUNNING", () => {
      const expectedFirstHomeScore = SCA_IN_RUNNING_MOCK.match[0].teamAScore;
      const expectedSecondHomeScore = SCA_IN_RUNNING_MOCK.match[0].currentSet.teamAScore;
      const expectedThirdHomeScore = SCA_IN_RUNNING_MOCK.match[0].currentSet.currentGame.teamAScore;

      const expectedFirstAwayScore = SCA_IN_RUNNING_MOCK.match[0].teamBScore;
      const expectedSecondAwayScore = SCA_IN_RUNNING_MOCK.match[0].currentSet.teamBScore;
      const expectedThirdAwayScore = SCA_IN_RUNNING_MOCK.match[0].currentSet.currentGame.teamBScore;

      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            match: [{ ...SCA_IN_RUNNING_MOCK.match[0], id: EVENT_ID_2 }, { ...SCA_IN_RUNNING_MOCK.match[0] }],
          }),
        );
        await browser.waitUntilEquals(thirdHomeScoreSO, expectedThirdHomeScore);
        await browser.waitUntilEquals(swimlaneFirstHomeScoreSO, expectedFirstHomeScore);
      });

      describe("and fixture card", () => {
        it("[PRPI-2174] should show the competition name", async () => {
          expect(await avbFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2175] should show the players names", async () => {
          expect(await homeTeamSO.name.getText()).toBe(`${HOME_PLAYER.name}`);
          expect(await awayTeamSO.name.getText()).toBe(`${AWAY_PLAYER.name}`);
        });

        it("[PRPI-2176] should show the game surface type", async () => {
          expect(await avbScoreboardSO.matchInfo.getText()).toBe(SURFACE_TYPE);
        });

        it("[PRPI-2177] should show the correct scores", async () => {
          expect(await firstHomeScoreSO.getText()).toBe(expectedFirstHomeScore);
          expect(await secondHomeScoreSO.getText()).toBe(expectedSecondHomeScore);
          expect(await thirdHomeScoreSO.getText()).toBe(expectedThirdHomeScore);

          expect(await firstAwayScoreSO.getText()).toBe(expectedFirstAwayScore);
          expect(await secondAwayScoreSO.getText()).toBe(expectedSecondAwayScore);
          expect(await thirdAwayScoreSO.getText()).toBe(expectedThirdAwayScore);
        });

        it("[PRPI-2178] should show the serving indicator in the first player", async () => {
          expect(await homeTeamSO.serving.isDisplayed()).toBe(true);
          expect(await awayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2179] should not show the competition name", async () => {
          expect(await couponAvBFixtureSO.title.isDisplayed()).toBe(false);
        });

        it("[PRPI-2180] should show the players names", async () => {
          expect(await couponScoreboardHomeTeamSO.name.getText()).toBe(`${HOME_PLAYER.name}`);

          expect(await couponScoreboardAwayTeamSO.name.getText()).toBe(`${AWAY_PLAYER.name}`);
        });

        it("[PRPI-2181] should not show the game surface type", async () => {
          expect(await couponAvbScoreboardSO.matchInfo.isDisplayed()).toBe(false);
        });

        it("[PRPI-2182] should show the correct scores", async () => {
          expect(await couponFirstHomeScoreSO.getText()).toBe(expectedFirstHomeScore);
          expect(await couponSecondHomeScoreSO.getText()).toBe(expectedSecondHomeScore);
          expect(await couponThirdHomeScoreSO.getText()).toBe(expectedThirdHomeScore);

          expect(await couponFirstAwayScoreSO.getText()).toBe(expectedFirstAwayScore);
          expect(await couponSecondAwayScoreSO.getText()).toBe(expectedSecondAwayScore);
          expect(await couponThirdAwayScoreSO.getText()).toBe(expectedThirdAwayScore);
        });

        it("[PRPI-2183] should show the serving indicator in the first player", async () => {
          expect(await couponScoreboardHomeTeamSO.serving.isDisplayed()).toBe(true);
          expect(await couponScoreboardAwayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2184] should show the competition name", async () => {
          expect(await swimlaneAvBFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2185] should show the players surname", async () => {
          expect(await swimlaneScoreboardHomeTeamSO.name.getText()).toBe(
            "DjokovicDaSilvaPereira/TsitsipasRodriguesFonseca",
          );

          expect(await swimlaneScoreboardAwayTeamSO.name.getText()).toBe("Medvedev/Zverev");
        });

        it("[PRPI-2186] should show the game surface type", async () => {
          expect(await swimlaneAvbScoreboardSO.matchInfo.isDisplayed()).toBe(true);
        });

        it("[PRPI-2187] should show the correct scores", async () => {
          expect(await swimlaneFirstHomeScoreSO.getText()).toBe(expectedFirstHomeScore);
          expect(await swimlaneSecondHomeScoreSO.getText()).toBe(expectedSecondHomeScore);
          expect(await swimlaneThirdHomeScoreSO.getText()).toBe(expectedThirdHomeScore);
          expect(await swimlaneFirstAwayScoreSO.getText()).toBe(expectedFirstAwayScore);
          expect(await swimlaneSecondAwayScoreSO.getText()).toBe(expectedSecondAwayScore);
          expect(await swimlaneThirdAwayScoreSO.getText()).toBe(expectedThirdAwayScore);
        });

        it("[PRPI-2188] should show the serving indicator in the first player", async () => {
          expect(await swimlaneScoreboardHomeTeamSO.serving.isDisplayed()).toBe(true);
          expect(await swimlaneScoreboardAwayTeamSO.serving.isDisplayed()).toBe(false);
        });
      });
    });
    describe("and the tennis match is INTERRUPTED", () => {
      const expectedFirstHomeScore = SCA_INTERRUPED_MOCK.match[0].teamAScore;
      const expectedSecondHomeScore = SCA_INTERRUPED_MOCK.match[0].currentSet.teamAScore;
      const expectedThirdHomeScore = SCA_INTERRUPED_MOCK.match[0].currentSet.currentGame.teamAScore;

      const expectedFirstAwayScore = SCA_INTERRUPED_MOCK.match[0].teamBScore;
      const expectedSecondAwayScore = SCA_INTERRUPED_MOCK.match[0].currentSet.teamBScore;
      const expectedThirdAwayScore = SCA_INTERRUPED_MOCK.match[0].currentSet.currentGame.teamBScore;

      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INTERRUPED_MOCK));
        await browser.waitUntilEquals(avbScoreboardSO.matchInfo, "RAIN DELAY");
      });

      describe("and fixture card", () => {
        it("[PRPI-2189] should show the correct scores", async () => {
          expect(await firstHomeScoreSO.getText()).toBe(expectedFirstHomeScore);
          expect(await secondHomeScoreSO.getText()).toBe(expectedSecondHomeScore);
          expect(await thirdHomeScoreSO.getText()).toBe(expectedThirdHomeScore);

          expect(await firstAwayScoreSO.getText()).toBe(expectedFirstAwayScore);
          expect(await secondAwayScoreSO.getText()).toBe(expectedSecondAwayScore);
          expect(await thirdAwayScoreSO.getText()).toBe(expectedThirdAwayScore);
        });

        it("[PRPI-2190] should show the status reason", async () => {
          expect(await avbScoreboardSO.matchInfo.getText()).toBe("RAIN DELAY");
        });

        it("[PRPI-2191] should show the serving indicator in the second player", async () => {
          expect(await homeTeamSO.serving.isDisplayed()).toBe(false);
          expect(await awayTeamSO.serving.isDisplayed()).toBe(true);
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2192] should show the correct scores", async () => {
          expect(await couponFirstHomeScoreSO.getText()).toBe(expectedFirstHomeScore);
          expect(await couponSecondHomeScoreSO.getText()).toBe(expectedSecondHomeScore);
          expect(await couponThirdHomeScoreSO.getText()).toBe(expectedThirdHomeScore);

          expect(await couponFirstAwayScoreSO.getText()).toBe(expectedFirstAwayScore);
          expect(await couponSecondAwayScoreSO.getText()).toBe(expectedSecondAwayScore);
          expect(await couponThirdAwayScoreSO.getText()).toBe(expectedThirdAwayScore);
        });

        it("[PRPI-2193] should not show the status reason", async () => {
          expect(await couponAvbScoreboardSO.matchInfo.isDisplayed()).toBe(false);
        });

        it("[PRPI-2194] should show the serving indicator in the second player", async () => {
          expect(await couponScoreboardHomeTeamSO.serving.isDisplayed()).toBe(false);
          expect(await couponScoreboardAwayTeamSO.serving.isDisplayed()).toBe(true);
        });
      });
    });

    describe("and the tennis match is FINISHED", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINISHED_MOCK));
        const expectedFirstHomeScore = SCA_FINISHED_MOCK.match[0].teamAScore;
        await browser.waitUntilEquals(firstHomeScoreSO, expectedFirstHomeScore, { timeout: SCA_POLING_TIMEOUT });
      });

      describe("and fixture card", () => {
        it("[PRPI-2195] should show the final score", async () => {
          const expectedFirstHomeScore = SCA_FINISHED_MOCK.match[0].teamAScore;
          const expectedFirstAwayScore = SCA_FINISHED_MOCK.match[0].teamBScore;

          expect(await firstHomeScoreSO.getText()).toBe(expectedFirstHomeScore);
          expect(await firstAwayScoreSO.getText()).toBe(expectedFirstAwayScore);
        });

        it("[PRPI-2196] should show the game surface type", async () => {
          expect(await avbScoreboardSO.matchInfo.getText()).toBe(SURFACE_TYPE);
        });
      });

      describe("and coupon card group", () => {
        it("[PRPI-2197] should show the final score", async () => {
          const expectedFirstHomeScore = SCA_FINISHED_MOCK.match[0].teamAScore;
          const expectedFirstAwayScore = SCA_FINISHED_MOCK.match[0].teamBScore;

          expect(await couponFirstHomeScoreSO.getText()).toBe(expectedFirstHomeScore);
          expect(await couponFirstAwayScoreSO.getText()).toBe(expectedFirstAwayScore);
        });

        it("[PRPI-2198] should not show the game surface type", async () => {
          expect(await couponAvbScoreboardSO.matchInfo.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the tennis match is in PRE_MATCH", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getScaResponse({
            match: [{ ...SCA_PRE_MATCH_MOCK.match[0], id: EVENT_ID_2 }, { ...SCA_PRE_MATCH_MOCK.match[0] }],
          }),
        );
        await browser.waitUntilEquals(durationSO.time, "20:00", { timeout: SCA_POLING_TIMEOUT });
        await browser.waitUntilEquals(swimlaneAvBFixtureSO.title, COMPETITION_NAME, { timeout: SCA_POLING_TIMEOUT });
      });

      describe("and fixture card", () => {
        it("[PRPI-2199] should show the competition name", async () => {
          expect(await avbFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2200] should show the players names", async () => {
          expect(await homeTeamSO.name.getText()).toBe(`${HOME_PLAYER.name}`);
          expect(await awayTeamSO.name.getText()).toBe(`${AWAY_PLAYER.name}`);
        });

        it("[PRPI-2201] should show the game starting time", async () => {
          expect(await durationSO.date.getText()).toBe("Jan 16");
          expect(await durationSO.time.getText()).toBe("20:00");
        });

        it("[PRPI-2202] should show the game surface type", async () => {
          expect(await avbScoreboardSO.matchInfo.getText()).toBe(SURFACE_TYPE);
        });
      });

      describe("and swimlane card group", () => {
        it("[PRPI-2203] should show the competition name", async () => {
          expect(await swimlaneAvBFixtureSO.title.getText()).toBe(COMPETITION_NAME);
        });

        it("[PRPI-2204] should show the players surname", async () => {
          expect(await swimlaneScoreboardHomeTeamSO.name.getText()).toBe(
            "DjokovicDaSilvaPereira/TsitsipasRodriguesFonseca",
          );

          expect(await swimlaneScoreboardAwayTeamSO.name.getText()).toBe("Medvedev/Zverev");
        });

        it("[PRPI-2205] should show the game starting time", async () => {
          expect(await swimlaneDurationSO.date.getText()).toBe("Jan 16");
          expect(await swimlaneDurationSO.time.getText()).toBe("20:00");
        });

        it("[PRPI-2206] should show the game surface type", async () => {
          expect(await swimlaneAvbScoreboardSO.matchInfo.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
