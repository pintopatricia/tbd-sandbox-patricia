const { getMyBetsLayout, getAppContext, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const {
  CardSO,
  SupportingContentButtonSO,
  MatchStatsSO,
  IncidentEventsSO,
  EmptyStateSO,
  BottomBarSO,
  LiveStreamSO,
  HorseRacingRunnerSO,
  StatsRaceResultsCardSO,
  TabsGroupSO,
  StatusLabelSO,
} = require("../../../../screen-objects");
const StatsSupportingContentButtonsCardGroupSO = require("@ppb/tbd-shared/components/StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.so");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK, HEADER_ITEMS_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const firstSbkBetCardSO = new CardSO();
const statsSupportingContentButtonsCardGroupSO = new StatsSupportingContentButtonsCardGroupSO();
const supportingContentButtons = statsSupportingContentButtonsCardGroupSO.buttons;
const statsButtonSO = new SupportingContentButtonSO(supportingContentButtons[0]);
const incidentsButtonSO = new SupportingContentButtonSO(supportingContentButtons[1]);
const liveVideoButtonSO = new SupportingContentButtonSO(supportingContentButtons[2]);
const racingResultsButtonSO = new SupportingContentButtonSO(supportingContentButtons[0]);
const matchStatsSO = new MatchStatsSO();
const incidentsEventsSO = new IncidentEventsSO();
const liveStreamSO = new LiveStreamSO();
const emptyStateSO = new EmptyStateSO();
const statsRaceResultsCardSO = new StatsRaceResultsCardSO();
const firstRaceRunnerSO = new HorseRacingRunnerSO(statsRaceResultsCardSO.horseRacingRunnerList[0]);
const secondRaceRunnerSO = new HorseRacingRunnerSO(statsRaceResultsCardSO.horseRacingRunnerList[1]);
const thirdRaceRunnerSO = new HorseRacingRunnerSO(statsRaceResultsCardSO.horseRacingRunnerList[2]);
const fourthRaceRunnerSO = new HorseRacingRunnerSO(statsRaceResultsCardSO.horseRacingRunnerList[3]);
const fourthRaceRunnerStatusLabelSO = new StatusLabelSO(fourthRaceRunnerSO.rightColumn);
const tabsSO = new TabsGroupSO();
const settledTab = new TabsGroupSO(tabsSO.tabButtons[1]);

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
      urn: "ppb:fixture:1",
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
      urn: "ppb:fixture:1",
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
    urn: `ppb:tbd:card:incidents:1|pebble`,
    showEmptyState: true,
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      incidents: [],
      __typename: "FootballFixture",
    },
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
};

const STATS_BROADCASTS_CARD_MOCK = {
  __typename: "StatsBroadcastsCard",
  urn: "ppb:tbd:stats:card:broadcasts:1|livevideo",
  broadcasts: {
    dataVizUrl: null,
    liveVideoUrl: "https://dummy.com.betfair/livevideo",
  },
};

const LIVE_VIDEO_CARD = {
  displayName: {
    translationKey: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
    __typename: "DisplayNameTranslationKey",
  },
  node: {
    __typename: "StatsBroadcastsCard",
    urn: "ppb:tbd:stats:card:broadcasts:1|livevideo",
  },
  __typename: "StatsSupportingContentButtonsCardEdge",
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
          silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
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
          silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
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
          silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
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

const buildBFFMyBetsMockScoreboard = ({ isPreMatch, isRacing, isSettled }) => ({
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
                urn: `ppb:tbd:card:sbkBet:${BET_ID}`,
              },
            },
            {
              node: {
                __typename: "SportsbookExpandableLegCardGroup",
                urn: `ppb:tbd:card:group:sbkExpandableLeg:${BET_ID}`,
              },
            },
          ],
        },
      },
    },
  ],
  headerItems: HEADER_ITEMS_MOCK,
});

const handleButtonClick = async (elementToClick, elementName) => {
  await browser.waitUntilClickableNative(elementToClick, `${elementName} is not clickable`);
  await elementToClick.click();
};

const openMyBetsWithSupportingCards = async ({ isPreMatch, isRacing, isSettled }) => {
  const isFirstLoad = isPreMatch;
  const myBetsMockScoreBoard = buildBFFMyBetsMockScoreboard({ isPreMatch, isRacing, isSettled });
  await mockService.mockHttpRequest(getMyBetsLayout(myBetsMockScoreBoard));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
  if (isFirstLoad) {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
    await startApp("home", { pullToRefresh: true });
    await BottomBarSO.myBets.waitForDisplayed();
    await BottomBarSO.myBets.click();
  } else {
    if (isSettled) {
      await browser.waitUntilClickableNative(settledTab.element, "Element is not clickable");
      await settledTab.element.click();
      await browser.waitUntilEquals(settledTab.selectedTab, "Settled");
    } else {
      await swipeDownElementFullscreen(firstSbkBetCardSO.header);
      await browser.waitUntil(async () => (await firstSbkBetCardSO.title.getText()) === "Show Selection Info");
    }
  }
  // open accordion
  await handleButtonClick(firstSbkBetCardSO.header, "First Bet Card");
  await browser.waitUntilDisplayed(firstSbkBetCardSO.contentWrapper);
};

const openStats = async ({ hasData, buttonSO, componentSO, buttonName }) => {
  await handleButtonClick(buttonSO.element, buttonName);
  await browser.waitUntilDisplayed(hasData ? componentSO.element : emptyStateSO.element);
};

describe("My Bets Page - Supporting Content", () => {
  describe("When the user has a Football open bet", () => {
    describe("and the event is in Pre-Match and no live Video link is available", () => {
      beforeAll(async () => {
        await openMyBetsWithSupportingCards({ isPreMatch: true });
      });
      it("[PRPI-3757] should be displayed the Stats and Event buttons bellow the fixture card", async () => {
        expect(await supportingContentButtons.length).toEqual(2);
        expect(await statsButtonSO.title.getText()).toEqual("Match Stats");
        expect(await incidentsButtonSO.title.getText()).toEqual("Events");
      });

      describe("and the user clicks on Stats Card", () => {
        beforeAll(async () => {
          await openStats({
            hasData: false,
            buttonSO: statsButtonSO,
            componentSO: matchStatsSO,
            buttonName: "Match Stats button",
          });
        });
        it("[PRPI-3758] should be displayed the messages `Oops, sorry about that` and `There are no stats available for this game`", async () => {
          expect(await emptyStateSO.title.getText()).toEqual("Oops, sorry about that");
          expect(await emptyStateSO.message.getText()).toEqual("There are no stats available for this game");
        });

        describe("and the user clicks on event Card", () => {
          beforeAll(async () => {
            await openStats({
              hasData: false,
              buttonSO: incidentsButtonSO,
              componentSO: incidentsEventsSO,
              buttonName: "Events button",
            });
          });
          it("[PRPI-3759] should be displayed the messages `Stats unavailable` `There are no events to highlight yet.`", async () => {
            expect(await emptyStateSO.title.getText()).toEqual("Stats unavailable");
            expect(await emptyStateSO.message.getText()).toEqual("There are no events to highlight yet.");
          });
        });
      });
    });

    describe("and the event is in Inplay", () => {
      beforeAll(async () => {
        await openMyBetsWithSupportingCards({ isPreMatch: false });
      });
      it("[PRPI-3760] should be displayed the Stats, the Events and Live Video buttons bellow the fixture card", async () => {
        expect(await supportingContentButtons.length).toEqual(3);
        expect(await statsButtonSO.title.getText()).toEqual("Match Stats");
        expect(await incidentsButtonSO.title.getText()).toEqual("Events");
        expect(await liveVideoButtonSO.title.getText()).toEqual("Live Video");
      });

      describe("and the user clicks on Stats Card", async () => {
        beforeAll(async () => {
          await openStats({
            hasData: true,
            buttonSO: statsButtonSO,
            componentSO: matchStatsSO,
            buttonName: "Match Stats button",
          });
        });

        it("[PRPI-3761] should be displayed the stats for the event", async () => {
          expect(await matchStatsSO.element.isDisplayed()).toEqual(true);
        });

        describe("and the user clicks on event Card", () => {
          beforeAll(async () => {
            await openStats({
              hasData: true,
              buttonSO: incidentsButtonSO,
              componentSO: incidentsEventsSO,
              buttonName: "Events button",
            });
          });

          it("[PRPI-3762] should be displayed the incident events for the event", async () => {
            expect(await incidentsEventsSO.element.isDisplayed()).toEqual(true);
          });

          describe("and the user clicks on Live Video", async () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getCardResults({ cards: [STATS_BROADCASTS_CARD_MOCK] }));
              await handleButtonClick(liveVideoButtonSO.element, "Live Video button");
              await browser.waitUntilDisplayed(liveStreamSO.element);
            });
            it("[PRPI-3763] should be displayed an iframe with football video", async () => {
              expect(await liveStreamSO.element.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
  describe("When the user has a Horse Racing settled bet", () => {
    describe("and the race has results available", () => {
      beforeAll(async () => {
        await openMyBetsWithSupportingCards({ isRacing: true, isSettled: true });
      });
      it("[PRPI-3764] should be displayed the Results button below the race coupon", async () => {
        expect(await supportingContentButtons.length).toEqual(1);
        expect(await racingResultsButtonSO.title.getText()).toEqual("Results");
      });

      describe("and then the user clicks on Results button", () => {
        beforeAll(async () => {
          await openStats({
            hasData: true,
            buttonSO: racingResultsButtonSO,
            componentSO: statsRaceResultsCardSO,
            buttonName: "Results button",
          });
          await browser.waitUntilDisplayed(firstRaceRunnerSO.element);
        });

        it("[PRPI-3765] should be displayed the results details", async () => {
          expect(await statsRaceResultsCardSO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-3766] should be displayed the horse `Super Seixas` on 1st position with saddle cloth of 7", async () => {
          expect(await firstRaceRunnerSO.runnerHorseName.getText()).toBe("Super Seixas");
          expect(await firstRaceRunnerSO.clothNumber.getText()).toBe("1st");
          expect(await firstRaceRunnerSO.drawNumber.getText()).toBe("(7)");
        });

        it("[PRPI-3767] should be displayed the horse `Chico Genial` on 2nd position with saddle cloth of 8", async () => {
          expect(await secondRaceRunnerSO.runnerHorseName.getText()).toBe("Chico Genial");
          expect(await secondRaceRunnerSO.clothNumber.getText()).toBe("2nd");
          expect(await secondRaceRunnerSO.drawNumber.getText()).toBe("(8)");
        });

        it("[PRPI-3768] should be displayed the horse `Ricardo is Late` on 3rd position with saddle cloth of 9", async () => {
          expect(await thirdRaceRunnerSO.runnerHorseName.getText()).toBe("Ricardo Is Late");
          expect(await thirdRaceRunnerSO.clothNumber.getText()).toBe("3rd");
          expect(await thirdRaceRunnerSO.drawNumber.getText()).toBe("(9)");
        });

        it("[PRPI-3769] should be displayed the placed horse `Lurdinha's Surprise` on 4th position with saddle cloth of 4 and the status label `Lost`", async () => {
          expect(await fourthRaceRunnerSO.runnerHorseName.getText()).toBe("Lurdinha's Surprise");
          expect(await fourthRaceRunnerSO.clothNumber.getText()).toBe("4th");
          expect(await fourthRaceRunnerSO.drawNumber.getText()).toBe("(4)");
          expect(await fourthRaceRunnerStatusLabelSO.text.getText()).toBe("Lost");
        });
      });
    });
  });
});
