const {
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MY_BETS_SETTLED_URL = "mybets/settled/mb-736574746c6564";
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  SportsbookBetPanelSO,
  CardSO,
  TrackingBarSO,
  StatusLabelSO,
  ObbEnhancedTrackingSO,
  ShowMoreSO,
  BetSelectionDetailsSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const cardSO = new CardSO();
const myBetsSO = new MyBetsScreenSO();

const firstBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const firstCardSO = new CardSO(myBetsSO.betCardGroups[0]);
const enhancedTrackingSO = new ObbEnhancedTrackingSO(myBetsSO.betCardGroups[0]);

const betSelectionDetailsSO = new BetSelectionDetailsSO(myBetsSO.betCardGroups[0]);

const firstTrackingBarSO = new TrackingBarSO(enhancedTrackingSO.trackingBar);

const showMoreButtonSO = new ShowMoreSO();
const betStatusLabelSO = new StatusLabelSO(firstBetPanelSO.statusLabel);

const primeStatusLabelSO = new StatusLabelSO(betSelectionDetailsSO.element);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const OBB_SINGLE_WON_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    result: "WON",
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
              result: "WON",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  result: "WON",
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
                  selectionName:
                    "Darwin Nunez To Win | Darwin Nunez To Have More Goals Than Cody Gakpo During Regular Time",
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

const OBB_SINGLE_LOST_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    result: "LOST",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "FULL",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: "LOST",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  result: "LOST",
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
                  selectionName:
                    "Darwin Nunez To Win | Darwin Nunez To Have More Goals Than Cody Gakpo During Regular Time",
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

const OBB_SINGLE_VOID_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(9.1),
    product: "OUTCOME_BASED_BETTING",
    result: "VOID",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "FULL",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: "VOID",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  result: "VOID",
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
                  price: buildPrice(9.1),
                  originalPrice: buildPrice(9.1),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName:
                    "Darwin Nunez To Win | Darwin Nunez To Have More Goals Than Cody Gakpo During Regular Time",
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

const SCA_FINAL = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 7,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "FULL",
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
              goals: 1,
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
              goals: 3,
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
              goals: 1,
              fouls: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 2,
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
    const HOME_VIEW_LINK = getStartViewLink(MY_BETS_SETTLED_URL);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
  } else {
    await swipeDownElementFullscreen(firstBetPanelSO.element);
  }

  await browser.waitUntilDisplayed(cardSO.element);
};
describe("OBB Enhanced Tracking My Bets Page Singles Settled", () => {
  describe("Given I'm on my bets", () => {
    describe("[SHMRCK-549] And I already achieve the outcome.", () => {
      describe("[SHMRCK-549] And a new update comes from SCA and the bet change to settle as WON.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_UPDATE_MOCK));
          await browseToMyBets(OBB_SINGLE_WON_BET_MOCK);

          await firstCardSO.title.click();

          await browser.waitUntilDisplayed(firstTrackingBarSO.element);
        });
        it("[PRPI-3690] And the bet is settled as WON.", async () => {
          expect(await betStatusLabelSO.text.getText()).toBe("Won");
        });

        it("[PRPI-3691] And the prime bet is settled as WON.", async () => {
          expect(await primeStatusLabelSO.text.getText()).toBe("Won");
        });
      });
    });
    describe("[SHMRCK-550] And the event finished without me achieving the outcome.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINAL));

        await browseToMyBets(OBB_SINGLE_LOST_BET_MOCK);

        await firstCardSO.title.click();
        await browser.waitUntilDisplayed(firstTrackingBarSO.element);
      });
      it("[PRPI-3692] Then the counter is on 5.", async () => {
        expect(await firstTrackingBarSO.currentValue.getText()).toBe("5");
      });
      it("[PRPI-3693] And the outcome is with 7.", async () => {
        expect(await firstTrackingBarSO.goalValue.getText()).toBe("7");
      });
      it("[PRPI-3694] And the bet is settled as Lost.", async () => {
        expect(await betStatusLabelSO.element.isDisplayed()).toBe(true);
        expect(await betStatusLabelSO.text.getText()).toBe("Lost");
      });

      it("[PRPI-3695] And the prime leg is settled as Lost.", async () => {
        expect(await primeStatusLabelSO.text.getText()).toBe("Lost");
      });
      describe("[SHMRCK-563] When I click on the show more button.", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(showMoreButtonSO.element);
          await showMoreButtonSO.element.click();
          await browser.waitUntilDisplayed(enhancedTrackingSO.playerStats[0]);
        });

        it("[PRPI-3696] Then the first player statistics and name are updated.", async () => {
          expect(await enhancedTrackingSO.playerStats[0].getText()).toBe("3");
          expect(await enhancedTrackingSO.playerName[0].getText()).toBe("João");
        });

        it("[PRPI-3697] Then the second player statistics and name are updated.", async () => {
          expect(await enhancedTrackingSO.playerStats[1].getText()).toBe("2");
          expect(await enhancedTrackingSO.playerName[1].getText()).toBe("Mota");
        });
      });
    });
    describe("[GRNFLDS-56] And the event finished and the bet is voided.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINAL));

        await browseToMyBets(OBB_SINGLE_VOID_BET_MOCK);

        await firstCardSO.title.click();
        await browser.waitUntilDisplayed(betStatusLabelSO.element);
      });

      it("[PRPI-3698] And no enhanced tracking is showned.", async () => {
        expect(await enhancedTrackingSO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-3699] And the bet is settled as Void.", async () => {
        expect(await betStatusLabelSO.element.isDisplayed()).toBe(true);
        expect(await betStatusLabelSO.text.getText()).toBe("Void");
      });

      it("[PRPI-3700] And the prime leg is settled as void.", async () => {
        expect(await primeStatusLabelSO.text.getText()).toBe("Void");
      });
    });
  });
});
