const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const {
  AvBFixtureSO,
  FootballScoreboardSO,
  DurationSO,
  TeamSO,
  ScoreSO,
  FootballScoreSO,
  PenaltiesSO,
} = require("../../../../screen-objects");

const avbFixtureSO = new AvBFixtureSO();
const footballScoreboardSO = new FootballScoreboardSO();
const footballScoreSO = new FootballScoreSO(footballScoreboardSO.element);
const durationSO = new DurationSO(footballScoreboardSO.element);
const homeTeamSO = new TeamSO(footballScoreboardSO.homeTeam);
const awayTeamSO = new TeamSO(footballScoreboardSO.awayTeam);
const scoreSO = new ScoreSO();
const penaltiesSO = new PenaltiesSO();
const homeKicksSO = new PenaltiesSO(penaltiesSO.homeKicks);
const awayKicksSO = new PenaltiesSO(penaltiesSO.awayKicks);

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const EVENT_ID = "29682729";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_ID}`,
        sport: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
          name: "Football Fixture",
        },
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45:00Z",
          __typename: "SportsEvent",
          competition: { urn: "ppb:competition:12345", name: "English Premier League" },
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Ukraine",
            crest: {
              vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              medium: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              large: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            },
          },
          away: {
            name: "Portugal",
            crest: {
              vector: "invalidURL",
            },
          },
          scheduledAt: "2010-10-14T18:45:00Z",
          duration: {},
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#${EVENT_ID}`,
        cardGroupTitle: "Match Odds Markets",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259755;924.228826155",
                cardTitle: "Match Odds",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170259755",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.123456789/55190/0",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.123456789/48224/0",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.123456789/58805/0",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.123456789/55190/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.123456789/48224/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.123456789/58805/0",
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170259755;924.228826155",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#${EVENT_ID}`,
        cardGroupTitle: "Correct Score",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228826420",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826420/1063100",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826420/1063101",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228826420/1063102",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.228826420/1063100",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.228826420/1063101",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.228826420/1063102",
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
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.228826420",
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
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#${EVENT_ID}`,
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: null,
      },
      scheduledAt: "2010-10-14T18:45:00Z",
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 0,
        away: 0,
      },
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
      eventId: EVENT_ID,
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

const SCA_INPLAY_SECOND_HALF_STOPPAGE_MINUTES_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: 3,
        clock: {
          minute: 89,
          second: 31,
        },
      },
    },
  ],
};

const SCA_INPLAY_FULL_TIME_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
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

const SCA_INPLAY_FIRST_HALF_EXTRA_PERIOD_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "EXTRA",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 104,
          second: 1,
        },
      },
    },
  ],
};

const SCA_INPLAY_HALF_TIME_EXTRA_PERIOD_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "EXTRA",
        status: "HALF",
        stoppageMinutes: null,
        clock: {
          minute: 110,
          second: 24,
        },
      },
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_EXTRA_PERIOD_STOPPAGE_MINUTES_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "EXTRA",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: 2,
        clock: {
          minute: 119,
          second: 24,
        },
      },
    },
  ],
};

const SCA_INPLAY_FULL_STATUS_EXTRA_PERIOD_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        period: "EXTRA",
        status: "FULL",
        clock: {
          minute: 120,
          second: 0,
        },
      },
    },
  ],
};

const SCA_PRE_PENALTIES_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 1,
        away: 1,
      },
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

const SCA_NO_SCORES_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: null,
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 12,
          second: 0,
        },
      },
    },
  ],
};

describe("Normal Scoreboard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
    const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(avbFixtureSO.element);
  });

  describe("Regular Period", () => {
    describe("When the user is in a pre-match event view with the Scoreboard", () => {
      beforeAll(async () => {
        await browser.waitUntilEquals(avbFixtureSO.title, "English Premier League");
        await browser.waitUntilDisplayed(footballScoreSO.element);
      });

      it("[PRPI-2016] The competition title should be `English Premier League`", async () => {
        expect(await avbFixtureSO.title.getText()).toBe("English Premier League");
      });

      it("[PRPI-2017] The datetime of the event should be: `Oct 14, 19:45`", async () => {
        expect(await durationSO.date.getText()).toBe("Oct 14");
        expect(await durationSO.separator.getText()).toBe(",");
        expect(await durationSO.time.getText()).toBe("19:45");
      });

      it("[PRPI-2018] The team crests should be displayed", async () => {
        expect(await homeTeamSO.crest.isDisplayed()).toBe(true);
        expect(await awayTeamSO.crestPlaceholder.isDisplayed()).toBe(true);
      });

      it("[PRPI-2019] The home team name should be: `Ukraine` and away team name should be: `Portugal`", async () => {
        expect(await homeTeamSO.name.getText()).toBe("Ukraine");
        expect(await awayTeamSO.name.getText()).toBe("Portugal");
      });

      it("[PRPI-2020] The versus label should be displayed", async () => {
        expect(await footballScoreSO.versus.isDisplayed()).toBe(true);
      });

      describe("And when the first half starts", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
          await browser.waitUntilEquals(durationSO.statusLabel, "1'");
        });

        it("[PRPI-2021] The duration of the event should be `1'`", async () => {
          expect(await durationSO.statusLabel.getText()).toBe("1'");
        });

        it("[PRPI-2022] The score of the event should be `0 - 0`", async () => {
          expect(await scoreSO.teamAScores[0].getText()).toBe("0");
          expect(await scoreSO.teamBScores[0].getText()).toBe("0");
        });

        describe("And when the event goes into half time", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_HALF_TIME_MOCK));
            await browser.waitUntilEquals(durationSO.statusLabel, "HT");
          });

          it("[PRPI-2023] The duration should display the status label: `HT`", async () => {
            expect(await durationSO.statusLabel.getText()).toBe("HT");
          });

          describe("And when the second half goes to stoppage minutes", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_STOPPAGE_MINUTES_MOCK));
              await browser.waitUntilEquals(durationSO.statusLabel, "90'");
            });

            it("[PRPI-2024] The duration of the event should be `90'`", async () => {
              expect(await durationSO.statusLabel.getText()).toBe("90'");
            });

            it("[PRPI-2024] The stoppage minutes should be ` +3'`", async () => {
              expect(await durationSO.extraTime.getText()).toBe(" +3'");
            });

            describe("And when the event reaches full time", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FULL_TIME_MOCK));
                await browser.waitUntilEquals(durationSO.statusLabel, "FT");
              });

              it("[PRPI-2025] The full time label should be displayed: `FT`", async () => {
                expect(await durationSO.statusLabel.getText()).toBe("FT");
              });
            });
          });
        });
      });
    });
  });

  describe("Extra Time Period", () => {
    describe("When the user is in an event view with the Scoreboard on the first half of the extra time", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_EXTRA_PERIOD_MOCK));
        await browser.waitUntilEquals(durationSO.prefixLabel, "ET ");
        await browser.waitUntilEquals(durationSO.statusLabel, "105'");
      });

      it("[PRPI-2026] The duration of the event should be `ET 105'`", async () => {
        expect(await durationSO.prefixLabel.getText()).toBe("ET ");
        expect(await durationSO.statusLabel.getText()).toBe("105'");
      });

      describe("And when the extra time reaches half time", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_HALF_TIME_EXTRA_PERIOD_MOCK));
          await browser.waitUntilEquals(durationSO.prefixLabel, "ET ");
          await browser.waitUntilEquals(durationSO.statusLabel, "HT");
        });

        it("[PRPI-2027] The duration should display the status label:`ET HT`", async () => {
          expect(await durationSO.prefixLabel.getText()).toBe("ET ");
          expect(await durationSO.statusLabel.getText()).toBe("HT");
        });

        describe("And when extra time second half goes to stoppage minutes", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getScaResponse(SCA_INPLAY_SECOND_HALF_EXTRA_PERIOD_STOPPAGE_MINUTES_MOCK),
            );
            await browser.waitUntilEquals(durationSO.prefixLabel, "ET ");
            await browser.waitUntilEquals(durationSO.statusLabel, "120'");
          });

          it("[PRPI-2028] The duration of the event should be: `ET 120'`", async () => {
            expect(await durationSO.prefixLabel.getText()).toBe("ET ");
            expect(await durationSO.statusLabel.getText()).toBe("120'");
          });

          it("[PRPI-2028] The stoppage minutes should be ` +2'`", async () => {
            expect(await durationSO.extraTime.getText()).toBe(" +2'");
          });

          describe("And when the extra time reaches full time", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FULL_STATUS_EXTRA_PERIOD_MOCK));
              await browser.waitUntilEquals(durationSO.prefixLabel, "ET ");
              await browser.waitUntilEquals(durationSO.statusLabel, "FT");
            });

            it("[PRPI-2029] The full time label should be displayed:`EF FT`", async () => {
              expect(await durationSO.prefixLabel.getText()).toBe("ET ");
              expect(await durationSO.statusLabel.getText()).toBe("FT");
            });
          });
        });
      });
    });
  });

  describe("Penalties Time", () => {
    describe("When the user is in an event view with the Scoreboard with on penalties stage", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PENALTIES_MOCK));
        await browser.waitUntilEquals(durationSO.prefixLabel, "ET ");
        await browser.waitUntilEquals(durationSO.statusLabel, "FT");
        await browser.waitUntilDisplayed(penaltiesSO.element);
      });

      it("[PRPI-2030] The duration should display the status label: `ET FT`", async () => {
        expect(await durationSO.prefixLabel.getText()).toBe("ET ");
        expect(await durationSO.statusLabel.getText()).toBe("FT");
      });

      it("[PRPI-2031] The score of the event should be `1 - 1`", async () => {
        expect(await scoreSO.teamAScores[0].getText()).toBe("1");
        expect(await scoreSO.teamBScores[0].getText()).toBe("1");
      });

      it("[PRPI-2032] The penalties container should be displayed", async () => {
        expect(await penaltiesSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2033] The penalties score should display `0 - 0`", async () => {
        expect(await penaltiesSO.scoreText.getText()).toBe("0 - 0");
      });

      it("[PRPI-2034] The home and away penalties should be displayed", async () => {
        expect(await penaltiesSO.homeKicks.isDisplayed()).toBe(true);
        expect(await penaltiesSO.awayKicks.isDisplayed()).toBe(true);
      });

      it("[PRPI-2035] The 5 penalties kicks should be displayed on each side", async () => {
        expect(await homeKicksSO.kicks.length).toBe(5);
        expect(await awayKicksSO.kicks.length).toBe(5);
      });
    });
  });

  describe("No scores available", () => {
    describe("When the user is in an in-play event view with the Scoreboard and the service does not retrieve data", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_NO_SCORES_MOCK));
        await browser.waitUntilEquals(durationSO.noScoreError, "In-play");
      });

      it("[PRPI-2036] The score and duration should be displayed as `In-play`", async () => {
        expect(await durationSO.noScoreError.getText()).toBe("In-play");
      });

      it("[PRPI-2037] The versus label should be displayed.", async () => {
        expect(await footballScoreSO.versus.isDisplayed()).toBe(true);
      });
    });
  });
});
