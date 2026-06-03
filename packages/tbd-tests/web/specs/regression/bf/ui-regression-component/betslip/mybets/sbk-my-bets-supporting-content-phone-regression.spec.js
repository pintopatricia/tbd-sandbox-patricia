const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  CardPO,
  SupportingContentButtonPO,
  MatchStatsPO,
  IncidentEventsPO,
  LiveStreamPO,
  EmptyStatePO,
  StatsRaceResultsCardPO,
  HorseRacingRunnerPO,
  StatusLabelPO,
} = require("../../../../../../page-objects");
const StatsSupportingContentButtonsCardGroupPO = require("@ppb/tbd-shared/components/StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.po");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const routes = require("../../../../helpers/routes");
const MockService = require("../../../../helpers/mocking-service");
const { getIndexHTML } = require("../../../../mocks/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mocks/fonts/fonts-controller");
const { getHtmlFilePuppeteer } = require("../../../../mocks/html/html-controller");
const { HEADER_ITEMS_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();

const firstSbkBetCardPO = new CardPO();
const statsSupportingContentButtonsCardGroupPO = new StatsSupportingContentButtonsCardGroupPO();
const supportingContentButtons = statsSupportingContentButtonsCardGroupPO.buttons;
const statsButtonPO = new SupportingContentButtonPO(supportingContentButtons[0]);
const incidentsButtonPO = new SupportingContentButtonPO(supportingContentButtons[1]);
const liveVideoButtonPO = new SupportingContentButtonPO(supportingContentButtons[2]);
const racingResultsButtonPO = new SupportingContentButtonPO(supportingContentButtons[0]);
const matchStatsPO = new MatchStatsPO();
const incidentsEventsPO = new IncidentEventsPO(firstSbkBetCardPO.content);
const liveStreamPO = new LiveStreamPO();
const iFrame = liveStreamPO.iframeElements[0];
const statsRaceResultsCardPO = new StatsRaceResultsCardPO();
const firstRaceRunnerPO = new HorseRacingRunnerPO(statsRaceResultsCardPO.horseRacingRunnerList[0]);
const secondRaceRunnerPO = new HorseRacingRunnerPO(statsRaceResultsCardPO.horseRacingRunnerList[1]);
const thirdRaceRunnerPO = new HorseRacingRunnerPO(statsRaceResultsCardPO.horseRacingRunnerList[2]);
const fourthRaceRunnerPO = new HorseRacingRunnerPO(statsRaceResultsCardPO.horseRacingRunnerList[3]);
const fourthRaceRunnerStatusLabelPO = new StatusLabelPO(fourthRaceRunnerPO.rightColumn);
const emptyStatePO = new EmptyStatePO();

const BET_ID = 123;
const EVENT_ID = 567352;
const MEETING_ID = 567352;
const RACE_ID = 567352.1015;

const RACE_DETAILS_CARD = {
  __typename: "RaceDetailsCard",
  urn: `ppb:tbd:card:raceDetails:${RACE_ID}|true`,
  numberOfRunners: 14,
  showMeetingInfo: true,
  race: {
    __typename: "Race",
    urn: `ppb:race:${RACE_ID}`,
    startTime: "2020-07-13T14:40:00Z",
    name: "Aintree",
    details: {
      distance: {
        totalFurlongs: 1,
        totalMeters: 1,
        miles: 10,
        furlongs: 40,
        yards: 50,
      },
      going: "GOOD_FIRM",
      type: "FLAT",
    },
    meeting: {
      __typename: "Meeting",
      urn: `ppb:meeting:${MEETING_ID}`,
      name: "Wind 13th Jul",
      country: "GB",
      countryFlag: {
        medium: "http://example.test.com/mockedImage/image.png",
      },
      venue: "Aintree",
    },
  },
};

const FIXTURE_CARD = {
  __typename: "FixtureCard",
  urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink|0`,
  sportevent: { urn: `ppb:event:${EVENT_ID}`, name: "AD Marco 09 v Vitória SC B" },
  scheduledAt: "2020-07-27T19:00:00Z",
  fixtureEventViewLink: {
    viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
    viewUrl: "football/argentinian-reserves/ca-lanus-(res)-v-ca-union-santa-fe-(res)/e-30744688",
  },
  fixture: {
    urn: `ppb:fixture:${EVENT_ID}`,
    home: { name: "AD Marco 09" },
    away: { name: "Vitória SC B" },
    score: {
      home: 1,
      away: 1,
    },
    duration: {
      period: "REGULAR",
      status: "PRE_MATCH",
    },
  },
};

const SBK_BET_INFO_CARD_PARTIAL = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_LEG = {
  __typename: "BetLeg",
  urn: `ppb:sbkBetLeg:${BET_ID}/0`,
  leg: {
    type: "SS",
    result: "LOSING",
    resultType: "POTENTIAL",
    parts: [
      {
        price: {
          decimal: 1.86,
          fractional: {
            numerator: 43,
            denominator: 50,
          },
        },
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "AD Marco 09 v Vitória SC B",
        eventMarketDescription: "Match Odds",
        selectionName: "AD Marco 09",
        startTime: "2020-07-27T19:00:00.000Z",
        priceType: "LIVE",
      },
    ],
  },
};

const STATS_MATCH_CARD = {
  displayName: {
    translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsMatchStatsCard",
    urn: "ppb:tbd:stats:card:matchStats:1",
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      stats: [
        {
          periodStatus: "FULL",
          home: {
            attacks: 10,
            dangerousAttacks: 0,
            possession: 50,
            corners: 1,
            yellowCards: 0,
            redCards: 0,
            shotsOnTarget: 1,
            shotsOffTarget: 0,
            __typename: "FootballGameStats",
          },
          away: {
            attacks: 15,
            dangerousAttacks: 0,
            possession: 50,
            corners: 3,
            yellowCards: 0,
            redCards: 0,
            shotsOnTarget: 2,
            shotsOffTarget: 3,
            __typename: "FootballGameStats",
          },
          __typename: "FootballStats",
        },
      ],

      __typename: "FootballFixture",
    },
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const STATS_MATCH_EMPTY_CARD = {
  displayName: {
    translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsMatchStatsCard",
    urn: "ppb:tbd:stats:card:matchStats:1",
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      stats: [],
      __typename: "FootballFixture",
    },
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const INCIDENTS_CARD = {
  displayName: {
    translationKey: "I18N.STATS.EVENTS_PEBBLE",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "IncidentsCard",
    urn: "ppb:tbd:card:incidents:1|pebble",
    showEmptyState: true,
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      incidents: [
        {
          period: "EXTRA",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 108,
            __typename: "Clock",
          },
          details: {
            __typename: "CardIncident",
            cardType: "YELLOW",
            side: "AWAY",
            player: {
              stratingType: "LINEUP",
              name: "Tiago Lopes",
              id: "1",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 20,
            __typename: "Clock",
          },
          details: {
            __typename: "CardIncident",
            cardType: "YELLOW",
            side: "HOME",
            player: {
              stratingType: "LINEUP",
              name: "Bruno Sousa",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
      ],

      __typename: "FootballFixture",
    },
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const INCIDENTS_EMPTY_CARD = {
  displayName: {
    translationKey: "I18N.STATS.EVENTS_PEBBLE",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "IncidentsCard",
    urn: `ppb:tbd:card:incidents:${EVENT_ID}|pebble`,
    showEmptyState: true,
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      incidents: [],
      __typename: "FootballFixture",
    },
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const LIVE_VIDEO_CARD = {
  displayName: {
    translationKey: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsBroadcastsCard",
    urn: "ppb:tbd:stats:card:broadcasts:1.1010|1|livevideo",
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const STATS_BROADCASTS_CARD_MOCK = {
  __typename: "StatsBroadcastsCard",
  urn: "ppb:tbd:stats:card:broadcasts:1.1010|1|livevideo",
  broadcasts: {
    dataVizUrl: "",
    liveVideoUrl: "https://dummy.com.betfair/livevideo",
  },
  sport: {
    urn: "ppb:eventType:1",
    sportId: 1,
    __typename: "Sport",
  },
};

const STATS_RACE_RESULTS_CARD = {
  displayName: {
    translationKey: "I18N.MYBETS_RESULTS_BUTTON",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsRaceResultsCard",
    urn: `ppb:tbd:stats:card:raceResults:${RACE_ID}`,
    runners: [
      {
        horse: {
          name: "SUPER SEIXAS",
          performance: {
            positionOfficial: 1,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "7",
          silk: "http://example.test.com/mockedImage/image.png",
        },
        isBetSelection: false,
      },
      {
        horse: {
          name: "CHICO GENIAL",
          performance: {
            positionOfficial: 2,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "8",
        },
        isBetSelection: false,
      },
      {
        horse: {
          name: "RICARDO IS LATE",
          performance: {
            positionOfficial: 3,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "9",
          silk: "http://example.test.com/mockedImage/image.png",
        },
        isBetSelection: false,
      },
      {
        horse: {
          name: "LURDINHA'S SURPRISE",
          performance: {
            positionOfficial: 4,
            positionStatusCode: null,
          },
        },
        details: {
          saddleCloth: "4",
          silk: "http://example.test.com/mockedImage/image.png",
        },
        isBetSelection: true,
      },
    ],
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const STATS_SUPPORTING_CONTENT_BUTTONS_FOOTBALL = {
  __typename: "StatsSupportingContentButtonsCardGroup",
  urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets",
  full: {
    edges: [STATS_MATCH_CARD, INCIDENTS_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
  partials: {
    edges: [STATS_MATCH_CARD, INCIDENTS_CARD, LIVE_VIDEO_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
};

const EMPTY_STATS_SUPPORTING_CONTENT_BUTTONS_FOOTBALL = {
  __typename: "StatsSupportingContentButtonsCardGroup",
  urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets",
  full: {
    edges: [STATS_MATCH_EMPTY_CARD, INCIDENTS_EMPTY_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
  partials: {
    edges: [STATS_MATCH_EMPTY_CARD, INCIDENTS_EMPTY_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
};

const SUPPORTING_CONTENT_BUTTONS_RACING = {
  __typename: "StatsSupportingContentButtonsCardGroup",
  urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets",
  full: {
    edges: [STATS_RACE_RESULTS_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
  partials: {
    edges: [STATS_RACE_RESULTS_CARD],
    __typename: "StatsSupportingContentButtonsLayoutItemsConnection",
  },
};

const buildBFFMyBetsMockScoreboard = ({ isPreMatch, isRacing, isSettled }) => {
  return {
    __typename: "MyBetsView",
    urn: `ppb:tbd:view:myBets:${isSettled ? "settled" : "open"}`,
    url: routes.getMyBetsViewUrl(isSettled ? "settled" : "open"),
    filters: {
      orderType: {
        items: ["OPEN", "SETTLED"],
        defaultIndex: isSettled ? 1 : 0,
      },
    },

    edges: [
      {
        node: {
          __typename: "BetCardGroup",
          urn: `ppb:tbd:card:bet:group:${BET_ID}|sbk`,
          full: {
            edges: [
              {
                node: {
                  __typename: "SportsbookBetCard",
                  urn: `ppb:tbd:card:sbkBet:${BET_ID}`,
                  navigationLinks: [
                    {
                      marketBetUrn: "ppb:marketBet:924.237747664",
                    },
                  ],

                  bet: {
                    urn: `ppb:sbkBet:${BET_ID}`,
                    betReceiptId: "O/4275336/0021305",
                    profitAndLoss: 0.22,
                    isSettled: false,
                    betType: "SGL",
                    currentSize: 0.12,
                    result: "CASHED_OUT",
                    legs: [SBK_BET_LEG],
                  },
                },
              },
              {
                node: {
                  __typename: "SportsbookExpandableLegCardGroup",
                  urn: `ppb:tbd:card:group:sbkExpandableLeg:${BET_ID}`,
                  full: {
                    edges: [
                      {
                        node: {
                          __typename: "SportsbookBetLegCardGroup",
                          urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
                          full: {
                            edges: [
                              {
                                node: {
                                  __typename: "BetLegCard",
                                  urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
                                  betUrn: `ppb:sbkBet:${BET_ID}`,
                                  leg: SBK_BET_LEG,
                                },
                              },
                              {
                                node: isRacing ? RACE_DETAILS_CARD : FIXTURE_CARD,
                              },
                              {
                                node: isRacing
                                  ? SUPPORTING_CONTENT_BUTTONS_RACING
                                  : isPreMatch
                                  ? EMPTY_STATS_SUPPORTING_CONTENT_BUTTONS_FOOTBALL
                                  : STATS_SUPPORTING_CONTENT_BUTTONS_FOOTBALL,
                              },
                            ],
                          },
                          partials: {
                            partialEdges: [
                              {
                                node: {
                                  __typename: "BetLegCard",
                                  urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
                                },
                              },
                              {
                                node: isRacing
                                  ? {
                                      __typename: "RaceDetailsCard",
                                      urn: `ppb:tbd:card:raceDetails:${RACE_ID}|true`,
                                    }
                                  : {
                                      __typename: "FixtureCard",
                                      urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink|0`,
                                    },
                              },
                              {
                                node: {
                                  __typename: "StatsSupportingContentButtonsCardGroup",
                                  urn: `ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets`,
                                },
                              },
                            ],
                          },
                        },
                      },
                      {
                        node: {
                          ...SBK_BET_INFO_CARD_PARTIAL,
                          betReceiptId: "O/4275336/0021305",
                        },
                      },
                    ],
                  },
                  partials: {
                    partialEdges: [
                      {
                        node: {
                          __typename: "SportsbookBetLegCardGroup",
                          urn: `ppb:tbd:card:sbkBetLeg:${BET_ID}/0`,
                        },
                      },
                      { node: SBK_BET_INFO_CARD_PARTIAL },
                    ],
                  },
                },
              },
            ],
          },
          partials: {
            partialEdges: [
              {
                node: {
                  __typename: "SportsbookBetCard",
                  urn: `ppb:tbd:card:sbkBet:${EVENT_ID}`,
                },
              },
              {
                node: {
                  __typename: "SportsbookExpandableLegCardGroup",
                  urn: `ppb:tbd:card:group:sbkExpandableLeg:${EVENT_ID}`,
                },
              },
            ],
          },
        },
      },
    ],
    headerItems: HEADER_ITEMS_MOCK,
  };
};

const LIVE_VIDEO_MOCK = `
  <div style="display: flex; align-items:center; justify-content: center; width: 100%; height: 100%; background: pink" id="livevideo">
    <span style="font-size: 30px">LIVE VIDEO</span>
  </div>
`;

const handleButtonClick = async (elementToClick) => {
  await elementToClick.waitForClickable();
  await elementToClick.click();
};

const openMyBetsWithSupportingCards = async ({ isPreMatch, isRacing, isSettled }) => {
  const myBetsMockScoreBoard = buildBFFMyBetsMockScoreboard({ isPreMatch, isRacing, isSettled });
  await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
  await mockService.mockFonts(getMockFonts());
  await mockService.mockHttpRequest(await getIndexHTML(myBetsMockScoreBoard.urn, { products: ["sportsbook"] }));
  await mockService.mockHttpRequest(getMyBetsLayout(myBetsMockScoreBoard));
  await browser.url(routes.getMyBetsViewUrl(isSettled ? "settled" : "open"));
  // open accordion
  await handleButtonClick(firstSbkBetCardPO.header);
  await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
};

const openStats = async ({ hasData, buttonPO, componentPO }) => {
  await handleButtonClick(buttonPO.element);
  await browser.waitUntilDisplayed(hasData ? componentPO.element : emptyStatePO.element);
};

describe("My Bets Page - Supporting Content", () => {
  describe("When the user has a Football open bet", () => {
    describe("and the event is in Pre-Match and no live Video link is available", () => {
      beforeAll(async () => {
        await openMyBetsWithSupportingCards({ isPreMatch: true });
      });
      it("[PRPI-3757] should be displayed the Stats and Event buttons bellow the fixture card", async () => {
        expect(await supportingContentButtons.length).toEqual(2);
        expect(await statsButtonPO.title.getText()).toEqual("Match Stats");
        expect(await incidentsButtonPO.title.getText()).toEqual("Events");
      });

      describe("and the user clicks on Stats Card", () => {
        beforeAll(async () => {
          await openStats({ hasData: false, buttonPO: statsButtonPO, componentPO: matchStatsPO });
        });
        it("[PRPI-3758] should be displayed the messages `Oops, sorry about that` and `There are no stats available for this game`", async () => {
          expect(await emptyStatePO.title.getText()).toContain("Oops, sorry about that");
          expect(await emptyStatePO.message.getText()).toContain("There are no stats available for this game");
        });

        describe("and the user clicks on event Card", () => {
          beforeAll(async () => {
            await openStats({ hasData: false, buttonPO: incidentsButtonPO, componentPO: incidentsEventsPO });
          });
          it("[PRPI-3759] should be displayed the messages `Stats unavailable` `There are no events to highlight yet.`", async () => {
            expect(await emptyStatePO.title.getText()).toContain("Stats unavailable");
            expect(await emptyStatePO.message.getText()).toContain("There are no events to highlight yet.");
          });
        });
      });
    });

    describe("and the event is in Inplay", async () => {
      beforeAll(async () => {
        await openMyBetsWithSupportingCards({ isPreMatch: false });
      });
      it("[PRPI-3760] should be displayed the Stats, the Events and Live Video buttons bellow the fixture card", async () => {
        expect(await supportingContentButtons.length).toEqual(3);
        expect(await statsButtonPO.title.getText()).toEqual("Match Stats");
        expect(await incidentsButtonPO.title.getText()).toEqual("Events");
        expect(await liveVideoButtonPO.title.getText()).toEqual("Live Video");
      });

      describe("and the user clicks on Stats Card", async () => {
        beforeAll(async () => {
          await openStats({ hasData: true, buttonPO: statsButtonPO, componentPO: matchStatsPO });
        });

        it("[PRPI-3761] should be displayed the stats for the event", async () => {
          expect(await matchStatsPO.element.isDisplayed()).toBe(true);
        });

        describe("and the user clicks on event Card", () => {
          beforeAll(async () => {
            await openStats({ hasData: true, buttonPO: incidentsButtonPO, componentPO: incidentsEventsPO });
          });

          it("[PRPI-3762] should be displayed the incident events for the event", async () => {
            expect(await incidentsEventsPO.element.isDisplayed()).toBe(true);
          });

          describe("and the user clicks on Live Video", async () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getHtmlFilePuppeteer({ path: ".*livevideo.*", content: LIVE_VIDEO_MOCK, bodyStyle: "margin:0;" }),
              );
              await mockService.mockHttpRequest(getCardResults({ cards: [STATS_BROADCASTS_CARD_MOCK] }));
              await liveVideoButtonPO.element.waitForClickable();
              await liveVideoButtonPO.element.click();
              await browser.waitUntilIframeReady(iFrame, $("#livevideo"));
            });
            it("[PRPI-3763] should be displayed an iframe with football video", async () => {
              expect(await firstSbkBetCardPO.content.$("iframe").getAttribute("src")).toContain(
                "https://dummy.com.betfair/livevideo",
              );
            });
          });
        });
      });
    });
  });
  describe("When the user has a Horse Racing settled bet", () => {
    describe("and the race has results available", async () => {
      beforeAll(async () => {
        await openMyBetsWithSupportingCards({ isRacing: true, isSettled: true });
      });
      it("[PRPI-3764] should be displayed the Results button below the race coupon", async () => {
        expect(await supportingContentButtons.length).toEqual(1);
        expect(await racingResultsButtonPO.title.getText()).toEqual("Results");
      });

      describe("and then the user clicks on Results button", async () => {
        beforeAll(async () => {
          await openStats({ hasData: true, buttonPO: racingResultsButtonPO, componentPO: statsRaceResultsCardPO });
          await browser.waitUntilDisplayed(firstRaceRunnerPO.element);
        });

        it("[PRPI-3765] should be displayed the results details", async () => {
          expect(await statsRaceResultsCardPO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-3766] should be displayed the horse `Super Seixas` on 1st position with saddle cloth of 7", async () => {
          expect(await firstRaceRunnerPO.horseName.getText()).toBe("Super Seixas");
          expect(await firstRaceRunnerPO.horseNumber.getText()).toBe("1st");
          expect(await firstRaceRunnerPO.jockeyNumber.getText()).toBe("(7)");
        });

        it("[PRPI-3767] should be displayed the horse `Chico Genial` on 2nd position with saddle cloth of 8", async () => {
          expect(await secondRaceRunnerPO.horseName.getText()).toBe("Chico Genial");
          expect(await secondRaceRunnerPO.horseNumber.getText()).toBe("2nd");
          expect(await secondRaceRunnerPO.jockeyNumber.getText()).toBe("(8)");
        });

        it("[PRPI-3768] should be displayed the horse `Ricardo is Late` on 3rd position with saddle cloth of 9", async () => {
          expect(await thirdRaceRunnerPO.horseName.getText()).toBe("Ricardo Is Late");
          expect(await thirdRaceRunnerPO.horseNumber.getText()).toBe("3rd");
          expect(await thirdRaceRunnerPO.jockeyNumber.getText()).toBe("(9)");
        });

        it("[PRPI-3769] should be displayed the placed horse `Lurdinha's Surprise` on 4th position with saddle cloth of 4 and the status label `Lost`", async () => {
          expect(await fourthRaceRunnerPO.horseName.getText()).toBe("Lurdinha's Surprise");
          expect(await fourthRaceRunnerPO.horseNumber.getText()).toBe("4th");
          expect(await fourthRaceRunnerPO.jockeyNumber.getText()).toBe("(4)");
          expect(await fourthRaceRunnerStatusLabelPO.text.getText()).toBe("Lost");
        });
      });
    });
  });
});
