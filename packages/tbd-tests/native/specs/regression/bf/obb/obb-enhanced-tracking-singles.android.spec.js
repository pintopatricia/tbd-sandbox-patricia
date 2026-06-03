const { getMyBetsLayout, getAppContext, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");
const SportsbookBetLegCardSO = require("@ppb/tbd-shared/components/SportsbookBetLegCard/SportsbookBetLegCard.native.so");

const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  BottomBarSO,
  MyBetsScreenSO,
  SportsbookBetPanelSO,
  CardSO,
  TrackingBarSO,
  StatusLabelSO,
  BetSelectionDetailsSO,
  ObbEnhancedTrackingSO,
  ShowMoreSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const cardSO = new CardSO();
const myBetsSO = new MyBetsScreenSO();

const firstBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const firstSportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO(myBetsSO.betCardGroups[0]);
const firstSportsbookBetLegCardSO = new SportsbookBetLegCardSO(firstSportsbookExpandableLegCardGroupSO.cards[0]);
const firstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardSO.contentCards[0]);
const firstCardSO = new CardSO(myBetsSO.betCardGroups[0]);

const enhancedTrackingSO = new ObbEnhancedTrackingSO(myBetsSO.betCardGroups[0]);

const firstTrackingBarSO = new TrackingBarSO(enhancedTrackingSO.trackingBar);

const showMoreButtonSO = new ShowMoreSO();

const betStatusLabelSO = new StatusLabelSO(firstBetPanelSO.statusLabel);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const OBB_SINGLE_ACTIVE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "João",
                      },
                      { id: "404041", name: "Mota" },
                    ],
                  },
                  params: {
                    outcomeIds: ["GOALS"],
                    timePeriodId: "MATCH",
                    participantIds: ["404040", "404041"],
                    value: 7,
                    quantifier: "MORE_THAN",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                      {
                        operator: "+",
                      },
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        decimal: 7,
                      },
                    ],
                  },
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName: "JOAO To Win | JOAO To Have More Goals Than MOTA During Regular Time",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const OBB_SINGLE_PVP_ACTIVE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "playerVsPlayer",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "Bukayo Saka",
                      },
                      { id: "404041", name: "Cristiano Ronaldo" },
                    ],
                  },
                  params: {
                    participantIdA: "404040",
                    participantIdB: "404041",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                    timePeriodId: "MATCH",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],
                  },
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName:
                    "Bukayo Saka To Win | Bukayo Saka To Have More Goals Than Cristiano Ronaldo During Regular Time",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const SCA_PRE_PLAY_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 0,
        away: 0,
      },
      duration: {
        period: null,
        status: "PRE_MATCH",
        stoppageMinutes: null,
        clock: {
          minute: 0,
          second: 0,
        },
      },
      stats: [],
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 3,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 30,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 1,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404041,
          name: "MOTA",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 1,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 6,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 85,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 2,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 3,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404041,
          name: "MOTA",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 1,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 2,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_UPDATE_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 8,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 90,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 2,
              fouls: null,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 2,
              fouls: 3,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 4,
              fouls: 5,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404041,
          name: "MOTA",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              fouls: 2,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 3,
              fouls: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 3,
              fouls: null,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

let firstLoad = true;

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(getAppContext());
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  if (firstLoad) {
    firstLoad = false;
    await startApp("home", { pullToRefresh: true });
    await browser.waitUntilClickableNative(BottomBarSO.myBets);
    await BottomBarSO.myBets.click();
  } else {
    await swipeDownElementFullscreen(firstBetPanelSO.element);
  }

  await browser.waitUntilDisplayed(cardSO.element);
};

describe("OBB Enhanced Tracking My Bets Page", () => {
  describe("Given I'm on my bets", () => {
    describe("[SHMRCK-547] And I have a single obb bet open with a preplay event.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PLAY_MOCK));

        await browseToMyBets(OBB_SINGLE_ACTIVE_BET_MOCK);

        await firstCardSO.header.click();

        await browser.waitUntilDisplayed(firstTrackingBarSO.element);
      });
      it("[PRPI-3701] Then the leg section is displayed", async () => {
        expect(await firstBetPanelSO.panelTitle.isDisplayed()).toEqual(true);
        expect(await firstBetPanelSO.panelTitle.getText()).toEqual("Squad Bet Single @1.9");
      });
      it("[PRPI-3702] And the counter is displayed with 0.", async () => {
        expect(await firstTrackingBarSO.currentValue.getText()).toBe("0");
      });

      it("[PRPI-3703] And the outcome is displayed.", async () => {
        expect(await firstBetSelectionDetailsSO.subtitle.getText()).toEqual("7+ Goals Between Them");
      });

      describe("[SHMRCK-563] When I click on the show more button.", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(showMoreButtonSO.element);
          await showMoreButtonSO.element.click();
          await browser.waitUntilDisplayed(enhancedTrackingSO.playerStats[0]);
        });

        it("[PRPI-3704] Then the first player name are displayed.", async () => {
          expect(await enhancedTrackingSO.playerStats[0].getText()).toBe("0");
        });

        it("[PRPI-3705] Then the first player statistics are displayed.", async () => {
          expect(await enhancedTrackingSO.playerName[0].getText()).toBe("João");
        });

        it("[PRPI-3706] Then the second player statistics and name are displayed.", async () => {
          expect(await enhancedTrackingSO.playerStats[1].getText()).toBe("0");
          expect(await enhancedTrackingSO.playerName[1].getText()).toBe("Mota");
        });
      });
    });
    describe("[SHMRCK-548] And the event turns inplay but I didn't achieve the outcome.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));

        await browseToMyBets(OBB_SINGLE_ACTIVE_BET_MOCK);

        await firstCardSO.title.click();

        await browser.waitUntilDisplayed(firstTrackingBarSO.element);
      });
      it("[PRPI-3707] The counter is displayed with 2.", async () => {
        expect(await firstTrackingBarSO.currentValue.getText()).toBe("2");
      });

      describe("[SHMRCK-548] And a new SCA update is coming, but I haven't reached the outcome yet.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_MOCK));
          await browser.waitUntilEquals(firstTrackingBarSO.currentValue, "5");
        });
        it("[PRPI-3708] Then the counter is displayed with 5", async () => {
          expect(await firstTrackingBarSO.currentValue.getText()).toBe("5");
        });
        it("[PRPI-3709] And the outcome is with 7", async () => {
          expect(await firstTrackingBarSO.goalValue.getText()).toBe("7");
        });
        describe("[SHMRCK-563] When I click on the show more button.", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(showMoreButtonSO.element);
            await showMoreButtonSO.element.click();
            await browser.waitUntilDisplayed(enhancedTrackingSO.playerStats[0]);
          });

          it("[PRPI-3710] Then the first player statistics and name are updated.", async () => {
            expect(await enhancedTrackingSO.playerStats[0].getText()).toBe("3");
            expect(await enhancedTrackingSO.playerName[0].getText()).toBe("João");
          });

          it("[PRPI-3710] Then the second player statistics and name are updated.", async () => {
            expect(await enhancedTrackingSO.playerStats[1].getText()).toBe("2");
            expect(await enhancedTrackingSO.playerName[1].getText()).toBe("Mota");
          });
        });
      });
    });
    describe("[SHMRCK-549] And I already achieve the outcome.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_UPDATE_MOCK));

        await browseToMyBets(OBB_SINGLE_ACTIVE_BET_MOCK);

        await firstCardSO.title.click();

        await browser.waitUntilDisplayed(firstTrackingBarSO.element);
      });
      it("[PRPI-3711] Then the counter is on 7.", async () => {
        expect(await firstTrackingBarSO.currentValue.getText()).toBe("7");
      });
      it("[PRPI-3712] And the outcome is with 7.", async () => {
        expect(await firstTrackingBarSO.goalValue.getText()).toBe("7");
      });
      it("[PRPI-3713] And the bet is not settled.", async () => {
        expect(await betStatusLabelSO.element.isDisplayed()).toBe(false);
      });
    });

    describe("[SHMRCK-597] When I have a single obb pvp bet open with a pre-play event and I click on the show more button.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PLAY_MOCK));

        await browseToMyBets(OBB_SINGLE_PVP_ACTIVE_BET_MOCK);

        await firstCardSO.header.click();

        await browser.waitUntilClickableNative(showMoreButtonSO.element);
        await showMoreButtonSO.element.click();

        await browser.waitUntilDisplayed(enhancedTrackingSO.playerStats[0]);
      });
      it("[PRPI-3714] No tracking bar is displayed", async () => {
        expect(await firstTrackingBarSO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-3715] And the counters for each player are displayed correctly", async () => {
        expect(await enhancedTrackingSO.playerStats[0].getText()).toBe("0");
        expect(await enhancedTrackingSO.playerName[0].getText()).toBe("Bukayo Saka");
        expect(await enhancedTrackingSO.playerStats[1].getText()).toBe("0");
        expect(await enhancedTrackingSO.playerName[1].getText()).toBe("Cristiano Ronaldo");
      });

      describe("[SHMRCK-597] And the event turns in-play.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));

          await browser.waitUntilEquals(enhancedTrackingSO.playerStats[0], "1");
        });
        it("[PRPI-3716] Then the counters for each player are updated correctly", async () => {
          expect(await enhancedTrackingSO.playerStats[0].getText()).toBe("1");
          expect(await enhancedTrackingSO.playerName[0].getText()).toBe("Bukayo Saka");
          expect(await enhancedTrackingSO.playerStats[1].getText()).toBe("1");
          expect(await enhancedTrackingSO.playerName[1].getText()).toBe("Cristiano Ronaldo");
        });
      });
    });
  });
});
