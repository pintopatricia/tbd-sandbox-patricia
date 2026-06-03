const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const {
  AvBFixturePO,
  FootballScoreboardPO,
  FootballScorePO,
  PenaltiesPO,
  DurationPO,
  TeamPO,
  ScorePO,
} = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const avbFixturePO = new AvBFixturePO();
const footballScoreboardPO = new FootballScoreboardPO();
const footballScoreboardScorePO = new FootballScorePO();
const scoreboardScorePO = new ScorePO();
const footballScoreboardPenaltiesPO = new PenaltiesPO();
const scoreboardDurationPO = new DurationPO();
const scoreboardHomeTeamPO = new TeamPO(footballScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(footballScoreboardPO.awayTeam);
const footballScoreboardHomePenaltiesPO = new PenaltiesPO(footballScoreboardPenaltiesPO.homeKicks);
const footballScoreboardAwayPenaltiesPO = new PenaltiesPO(footballScoreboardPenaltiesPO.awayKicks);

const mockService = new MockService();

const EVENT_ID = "29465861";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29465861",
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
          competition: { urn: "ppb:competition:12345", name: "English Premier League" },
        },
        fixture: {
          __typename: "FootballFixture",
          urn: "ppb:fixture:29465861",
          home: {
            name: "Ukraine",
            color: "091453",
            crest: { vector: "invalid" },
          },
          away: {
            name: "Portugal",
            color: "FC5002",
            crest: { vector: "invalid" },
          },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {},
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29465861",
      },
    },
  ],
};

const BFF_FIRST_LEG_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture:29465861",
        fixture: {
          __typename: "FootballFixture",
          urn: "ppb:fixture:29465861",
          home: {
            name: "Ukraine",
            color: "091453",
            crest: { vector: "invalid" },
          },
          away: {
            name: "Portugal",
            color: "FC5002",
            crest: { vector: "invalid" },
          },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {},
          firstLegScore: {},
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29465861",
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      duration: {},
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

const SCA_INPLAY_HALF_TIME_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "REGULAR",
        status: "HALF",
        clock: {
          minute: 45,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        clock: {
          minute: 86,
          second: 23,
        },
      },
    },
  ],
};

const SCA_INPLAY_FULL_TIME_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "REGULAR",
        status: "FULL",
        clock: {
          minute: 90,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_EXTRA_TIME_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 98,
          second: 40,
        },
      },
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_EXTRA_TIME_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "INPLAY_SECOND_HALF",
        clock: {
          minute: 114,
          second: 40,
        },
      },
    },
  ],
};

const SCA_END_STATUS_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "END",
        clock: {
          minute: 120,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_STOPPAGE_MINUTES_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: 5,
        clock: {
          minute: 44,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_STOPPAGE_MINUTES_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: 3,
        clock: {
          minute: 89,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_EXTRA_PERIOD_STOPPAGE_MINUTES_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: 3,
        clock: {
          minute: 104,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_HALF_STATUS_EXTRA_PERIOD_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "HALF",
        clock: {
          minute: 114,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_EXTRA_PERIOD_STOPPAGE_MINUTES_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: 2,
        clock: {
          minute: 119,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_FULL_STATUS_EXTRA_PERIOD_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "FULL",
        clock: {
          minute: 119,
          second: 0,
        },
      },
    },
  ],
};

const SCA_INPLAY_END_STATUS_EXTRA_PERIOD_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "END",
        clock: {
          minute: 119,
          second: 0,
        },
      },
    },
  ],
};

const SCA_PRE_PENALTY_SHOOTOUT_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
        clock: {
          minute: 120,
          second: 0,
        },
      },
      penaltyShootout: null,
    },
  ],
};

const SCA_ERROR = {
  fixture: [
    {
      score: null,
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
      },
    },
  ],
};

const SCA_PENALTY_SHOOTOUT_FIRST_PENALTY_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
        clock: {
          minute: 120,
          second: 0,
        },
      },
      penaltyShootout: {
        firstTeamToShoot: "HOME",
        nextTeamToShoot: "AWAY",
        penaltyScores: [
          {
            penaltyNumber: 1,
            side: "HOME",
            shotResult: "SCORE",
          },
        ],
      },
    },
  ],
};

const SCA_PENALTY_SHOOTOUT_SECOND_PENALTY_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
        clock: {
          minute: 120,
          second: 0,
        },
      },
      penaltyShootout: {
        firstTeamToShoot: "HOME",
        nextTeamToShoot: "HOME",
        penaltyScores: [
          {
            penaltyNumber: 1,
            side: "HOME",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 1,
            side: "AWAY",
            shotResult: "MISS",
          },
        ],
      },
    },
  ],
};

const SCA_PENALTY_SHOOTOUT_END_STATE_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "END",
        clock: {
          minute: 120,
          second: 0,
        },
      },
      penaltyShootout: {
        firstTeamToShoot: "HOME",
        nextTeamToShoot: "HOME",
        penaltyScores: [
          {
            penaltyNumber: 1,
            side: "HOME",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 1,
            side: "AWAY",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 2,
            side: "HOME",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 2,
            side: "AWAY",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 3,
            side: "HOME",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 3,
            side: "AWAY",
            shotResult: "MISS",
          },
        ],
      },
    },
  ],
};

const SCA_PENALTY_SHOOTOUT_6_PENALTIES_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
        clock: {
          minute: 120,
          second: 0,
        },
      },
      penaltyShootout: {
        firstTeamToShoot: "HOME",
        nextTeamToShoot: "HOME",
        penaltyScores: [
          {
            penaltyNumber: 1,
            side: "HOME",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 1,
            side: "AWAY",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 2,
            side: "HOME",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 2,
            side: "AWAY",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 3,
            side: "HOME",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 3,
            side: "AWAY",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 4,
            side: "HOME",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 4,
            side: "AWAY",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 5,
            side: "HOME",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 5,
            side: "AWAY",
            shotResult: "MISS",
          },
          {
            penaltyNumber: 6,
            side: "HOME",
            shotResult: "SCORE",
          },
          {
            penaltyNumber: 6,
            side: "AWAY",
            shotResult: "SCORE",
          },
        ],
      },
    },
  ],
};

describe("Football Scoreboard", () => {
  describe("[613947] When user lands on a football event in PRE_MATCH state and REGULAR period", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(avbFixturePO.element);
    });

    it("[PRPI-5786] Then the scoreboard should be displayed", async () => {
      expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5787] And the competition title should be: English Premier League", async () => {
      expect(await avbFixturePO.avbFixtureTitle.getText()).toBe("English Premier League");
    });

    it("[PRPI-5788] And the default team crests should be displayed", async () => {
      expect(await scoreboardHomeTeamPO.defaultTeamCrest.isDisplayed()).toBe(true);
      expect(await scoreboardAwayTeamPO.defaultTeamCrest.isDisplayed()).toBe(true);
    });

    it("[PRPI-5789] And the datetime of the event should be: Oct 14", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Oct 14,\n19:45");
    });

    it("[PRPI-5790] And the home team name should be: Ukraine and away team name should be: Portugal", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Ukraine");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("Portugal");
    });

    it("[PRPI-5791] And the versus label should be displayed", async () => {
      expect(await footballScoreboardScorePO.versus.isDisplayed()).toBe(true);
    });

    describe("[613948] Then the game goes into INPLAY_FIRST_HALF state and REGULAR period", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(scoreboardDurationPO.status, "1'");
      });

      it("[PRPI-5792] And the status should be 1'", async () => {
        expect(await scoreboardDurationPO.status.getText()).toBe("1'");
      });

      it("[PRPI-5793] And the home score should be 2", async () => {
        expect(await scoreboardScorePO.teamAScore.getText()).toBe("2");
      });

      it("[PRPI-5794] And the away score should be 2", async () => {
        expect(await scoreboardScorePO.teamBScore.getText()).toBe("2");
      });

      describe("[613949] Then the game goes into HALF state and REGULAR period", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_HALF_TIME_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(scoreboardDurationPO.status, "HT");
        });

        it("[PRPI-5795] And the status label should be: HT", async () => {
          expect(await scoreboardDurationPO.status.getText()).toBe("HT");
        });

        describe("[613951] Then the game goes into INPLAY_SECOND_HALF state and REGULAR period", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(scoreboardDurationPO.status, "87'");
          });

          it("[PRPI-5795] And the status should be 87'", async () => {
            expect(await scoreboardDurationPO.status.getText()).toBe("87'");
          });

          describe("[613952] Then the game goes into FULL state and REGULAR period", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FULL_TIME_MOCK));
              await browser.tickFakeClock();
              await browser.waitUntilEquals(scoreboardDurationPO.status, "FT");
            });

            it("[PRPI-5795] And the status label should be: FT", async () => {
              expect(await scoreboardDurationPO.status.getText()).toBe("FT");
            });

            describe("[613954] Then the game goes into First Half state and EXTRA period", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_EXTRA_TIME_MOCK));
                await browser.tickFakeClock();
                await browser.waitUntilEquals(scoreboardDurationPO.status, "ET\n99'");
              });

              it("[PRPI-5795] And the status label should be: ET 99'", async () => {
                expect(await scoreboardDurationPO.status.getText()).toBe("ET\n99'");
              });

              describe("[613955] Then the game goes into Second Half state and EXTRA period", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_EXTRA_TIME_MOCK));
                  await browser.tickFakeClock();
                  await browser.waitUntilEquals(scoreboardDurationPO.status, "ET\n115'");
                });

                it("[PRPI-5795] And the status should be: ET 115'", async () => {
                  expect(await scoreboardDurationPO.status.getText()).toBe("ET\n115'");
                });

                describe("[613956] Then the game goes into END state", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(getScaResponse(SCA_END_STATUS_MOCK));
                    await browser.tickFakeClock();
                    await browser.waitUntilContainsClass(scoreboardDurationPO.status, DurationPO.states.end);
                  });

                  it("[PRPI-5795] And the END style should be applied to the FT label", async () => {
                    expect(await browser.containsClass(scoreboardDurationPO.status, DurationPO.states.end)).toBe(true);
                  });

                  describe("[616718] Then the score is not received, the game is INPLAY", () => {
                    beforeAll(async () => {
                      await mockService.mockHttpRequest(getScaResponse(SCA_ERROR));
                      await browser.tickFakeClock();
                      await browser.waitUntilEquals(scoreboardDurationPO.statusError, "Error");
                    });

                    it("[PRPI-5795] And the status error should be displayed on the scoreboard as: Error", async () => {
                      expect(await scoreboardDurationPO.statusError.getText()).toBe("Error");
                    });

                    it("[PRPI-5795] And the versus label should be displayed", async () => {
                      expect(await footballScoreboardScorePO.versus.isDisplayed()).toBe(true);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

describe("Football Scoreboard with stoppage minutes", () => {
  describe("[614005] When user lands on a game with INPLAY_FIRST_HALF state, REGULAR period with stoppage minutes", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_STOPPAGE_MINUTES_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilEquals(scoreboardDurationPO.status, "45'");
    });

    it("[PRPI-5796] Then the status should be: 45'", async () => {
      expect(await scoreboardDurationPO.status.getText()).toBe("45'");
    });

    it("[PRPI-5797] And the stoppage minute added should be: +5'", async () => {
      expect(await scoreboardDurationPO.extraTime.getText()).toBe("+5'");
    });

    describe("[614011] Then the game goes into INPLAY_SECOND_HALF state, REGULAR period with stoppage minutes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_STOPPAGE_MINUTES_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(scoreboardDurationPO.status, "90'");
      });

      it("[PRPI-5798] And the status should be: 90'", async () => {
        expect(await scoreboardDurationPO.status.getText()).toBe("90'");
      });

      it("[PRPI-5798] And the stoppage minute added should be: +3'", async () => {
        expect(await scoreboardDurationPO.extraTime.getText()).toBe("+3'");
      });

      describe("[614016] Then the game goes into INPLAY_FIRST_HALF state, EXTRA period with stoppage minutes", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_EXTRA_PERIOD_STOPPAGE_MINUTES_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(scoreboardDurationPO.status, "ET\n105'");
        });

        it("[PRPI-5798] And the status should be: ET 105'", async () => {
          expect(await scoreboardDurationPO.status.getText()).toBe("ET\n105'");
        });

        it("[PRPI-5798] And the stoppage minute added should be: +3'", async () => {
          expect(await scoreboardDurationPO.extraTime.getText()).toBe("+3'");
        });

        describe("[623671] Then the game goes into HALF state, EXTRA period", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_HALF_STATUS_EXTRA_PERIOD_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(scoreboardDurationPO.status, "ET\nHT");
          });

          it("[PRPI-5798] And the status should be: ET HT", async () => {
            expect(await scoreboardDurationPO.status.getText()).toBe("ET\nHT");
          });

          describe("[614019] Then the game goes into INPLAY_SECOND_HALF state, EXTRA period with stoppage minutes", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getScaResponse(SCA_INPLAY_SECOND_HALF_EXTRA_PERIOD_STOPPAGE_MINUTES_MOCK),
              );
              await browser.tickFakeClock();
              await browser.waitUntilEquals(scoreboardDurationPO.status, "ET\n120'");
            });

            it("[PRPI-5798] And the status should be: ET 120'", async () => {
              expect(await scoreboardDurationPO.status.getText()).toBe("ET\n120'");
            });

            it("[PRPI-5798] And the stoppage minute added should be: +2'", async () => {
              expect(await scoreboardDurationPO.extraTime.getText()).toBe("+2'");
            });

            describe("[623683] Then the game goes into FULL state, EXTRA period", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FULL_STATUS_EXTRA_PERIOD_MOCK));
                await browser.tickFakeClock();
                await browser.waitUntilEquals(scoreboardDurationPO.status, "ET\nFT");
              });

              it("[PRPI-5798] And the status should be: ET FT", async () => {
                expect(await scoreboardDurationPO.status.getText()).toBe("ET\nFT");
              });

              describe("[623691] Then the game goes into END state, EXTRA period", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_END_STATUS_EXTRA_PERIOD_MOCK));
                  await browser.tickFakeClock();
                  await browser.waitUntilContainsClass(scoreboardDurationPO.status, DurationPO.states.end);
                });

                it("[PRPI-5798] And the status should be: ET FT", async () => {
                  expect(await scoreboardDurationPO.status.getText()).toBe("ET\nFT");
                });

                it("[PRPI-5798] And the END style should be applied to the ET FT label", async () => {
                  expect(await browser.containsClass(scoreboardDurationPO.status, DurationPO.states.end)).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });
});

describe("Football Scoreboard with Penalty Shootout", () => {
  describe("[613995] When user lands on a game with PENALTY_SHOOTOUT state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PENALTY_SHOOTOUT_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(footballScoreboardPenaltiesPO.element);
    });

    it("[PRPI-5799] Then the penalties container should be displayed", async () => {
      expect(await footballScoreboardPenaltiesPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5800] And the status label should be: ET FT", async () => {
      expect(await scoreboardDurationPO.status.getText()).toBe("ET\nFT");
    });

    it("[PRPI-5801] And it should be 5 penalty kicks displayed on each side", async () => {
      expect(await footballScoreboardHomePenaltiesPO.kick.length).toBe(5);
      expect(await footballScoreboardAwayPenaltiesPO.kick.length).toBe(5);
    });

    it("[PRPI-5802] And the penalties score should display: 0 - 0", async () => {
      expect(await footballScoreboardPenaltiesPO.score.getText()).toBe("0 - 0");
    });

    it("[PRPI-5803] And first penalty on each side should not be displayed as: INPLAY", async () => {
      expect(await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[0], PenaltiesPO.states.inPlay)).toBe(
        false,
      );

      expect(await browser.containsClass(footballScoreboardAwayPenaltiesPO.kick[0], PenaltiesPO.states.inPlay)).toBe(
        false,
      );
    });

    describe("[613999] Then first penalty is taken", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PENALTY_SHOOTOUT_FIRST_PENALTY_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(footballScoreboardPenaltiesPO.score, "1 - 0");
      });

      it("[PRPI-5804] And the penalties score should display: 1 - 0", async () => {
        expect(await footballScoreboardPenaltiesPO.score.getText()).toBe("1 - 0");
      });

      it("[PRPI-5805] And the first home penalty kick should be displayed as: SCORE", async () => {
        expect(await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[0], PenaltiesPO.states.goal)).toBe(
          true,
        );
      });

      it("[PRPI-5806] And the first away penalty kick should be displayed as: INPLAY", async () => {
        expect(await browser.containsClass(footballScoreboardAwayPenaltiesPO.kick[0], PenaltiesPO.states.inPlay)).toBe(
          true,
        );
      });

      describe("[613003] Then second penalty is taken", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_PENALTY_SHOOTOUT_SECOND_PENALTY_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(footballScoreboardPenaltiesPO.score, "1 - 0");
        });

        it("[PRPI-5807] And the penalties score should display: 1 - 0", async () => {
          expect(await footballScoreboardPenaltiesPO.score.getText()).toBe("1 - 0");
        });

        it("[PRPI-5808] And the first home penalty kick should be displayed as: SCORE", async () => {
          expect(await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[0], PenaltiesPO.states.goal)).toBe(
            true,
          );
        });

        it("[PRPI-5809] And the first away penalty kick should be displayed as: MISS", async () => {
          expect(await browser.containsClass(footballScoreboardAwayPenaltiesPO.kick[0], PenaltiesPO.states.miss)).toBe(
            true,
          );
        });

        it("[PRPI-5810] And the second home penalty kick should be displayed as: INPLAY", async () => {
          expect(
            await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[1], PenaltiesPO.states.inPlay),
          ).toBe(true);
        });

        describe("[613004] Then the game progresses into extra penalties", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_PENALTY_SHOOTOUT_6_PENALTIES_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(footballScoreboardPenaltiesPO.score, "2 - 2");
          });

          it("[PRPI-5811] And the penalties score should display: 2 - 2", async () => {
            expect(await footballScoreboardPenaltiesPO.score.getText()).toBe("2 - 2");
          });

          it("[PRPI-5811] And it should be 5 penalty kicks displayed on each side", async () => {
            expect(await footballScoreboardHomePenaltiesPO.kick.length).toBe(5);
            expect(await footballScoreboardAwayPenaltiesPO.kick.length).toBe(5);
          });

          it("[PRPI-5811] And the 6th home penalty kick should be displayed first in row and it should be displayed as: SCORE", async () => {
            expect(
              await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[0], PenaltiesPO.states.goal),
            ).toBe(true);
          });

          it("[PRPI-5811] And the 6th away penalty kick should be displayed first in row and it should be displayed as: SCORE", async () => {
            expect(
              await browser.containsClass(footballScoreboardAwayPenaltiesPO.kick[0], PenaltiesPO.states.goal),
            ).toBe(true);
          });

          it("[PRPI-5811] And the 7th home penalty kick should be displayed second in row and it should be displayed as: INPLAY", async () => {
            expect(
              await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[1], PenaltiesPO.states.inPlay),
            ).toBe(true);
          });

          describe("[613007] Then the game goes into END state, home team wins 3 - 0 at penalties", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getScaResponse(SCA_PENALTY_SHOOTOUT_END_STATE_MOCK));
              await browser.tickFakeClock();
              await browser.waitUntilContainsClass(scoreboardDurationPO.status, DurationPO.states.end);
            });

            it("[PRPI-5811] Then the penalties container should be displayed", async () => {
              expect(await footballScoreboardPenaltiesPO.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-5811] And the status label should be: ET FT", async () => {
              expect(await scoreboardDurationPO.status.getText()).toBe("ET\nFT");
            });

            it("[PRPI-5811] And the END style should be applied to the FT label", async () => {
              expect(await browser.containsClass(scoreboardDurationPO.status, DurationPO.states.end)).toBe(true);
            });

            // SCA will always populate `nextTeamToShoot` field and in the end state, the last penalty should not be displayed as INPLAY.
            it("[PRPI-5811] And the 4th home penalty kick should not be displayed as: INPLAY, as the penalties ended", async () => {
              expect(
                await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[1], PenaltiesPO.states.inPlay),
              ).toBe(false);
            });
          });
        });
      });
    });
  });
});

describe("Football Scoreboard with first leg score", () => {
  describe("[613979] When user lands on a football event with first leg score in PRE_MATCH state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_FIRST_LEG_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(avbFixturePO.element);
    });

    it("[PRPI-5812] Then the first leg score should display: 1st leg: 1-0", async () => {
      expect(await footballScoreboardScorePO.preplayFirstLeg.getText()).toBe("1st leg:\n1-0");
    });

    describe("[613998] Then the game goes INPLAY and some goals are scored", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(scoreboardScorePO.teamAScore, "2");
      });

      it("[PRPI-5813] And the home score should display: 2", async () => {
        expect(await scoreboardScorePO.teamAScore.getText()).toBe("2");
      });

      it("[PRPI-5814] And the away score should display: 2", async () => {
        expect(await scoreboardScorePO.teamBScore.getText()).toBe("2");
      });

      it("[PRPI-5815] And the aggregated score displayed should be: (3-2)", async () => {
        expect(await footballScoreboardScorePO.aggregateScore.getText()).toBe("(3-2)");
      });
    });
  });
});
