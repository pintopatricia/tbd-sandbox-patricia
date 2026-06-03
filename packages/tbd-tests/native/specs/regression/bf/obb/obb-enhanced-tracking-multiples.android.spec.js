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
const secondBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardSO.contentCards[1]);

const firstCardSO = new CardSO(myBetsSO.betCardGroups[0]);

const firstEnhancedTrackingSO = new ObbEnhancedTrackingSO(firstSportsbookBetLegCardSO.contentCards[0]);
const secondEnhancedTrackingSO = new ObbEnhancedTrackingSO(firstSportsbookBetLegCardSO.contentCards[1]);

const firstTrackingBarSO = new TrackingBarSO(firstEnhancedTrackingSO.trackingBar);
const secondTrackingBarSO = new TrackingBarSO(secondEnhancedTrackingSO.trackingBar);

const firstShowMoreButtonSO = new ShowMoreSO(firstEnhancedTrackingSO.showMoreButton);

const betStatusLabelSO = new StatusLabelSO(firstBetPanelSO.statusLabel);

const firstPrimeStatusLabelSO = new StatusLabelSO(firstBetSelectionDetailsSO.element);

const secondPrimeStatusLabelSO = new StatusLabelSO(secondBetSelectionDetailsSO.element);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const OBB_MULTIPLE_ACTIVE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
    currentSize: 0.1,
    betPrice: buildPrice(4.6),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "IN_PLAY",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
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
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404042",
                            name: "Miguel",
                          },
                          { id: "404043", name: "Lira" },
                        ],
                      },
                      params: {
                        outcomeIds: ["FOULS"],
                        timePeriodId: "MATCH",
                        participantIds: ["404042", "404043"],
                        value: 7,
                        quantifier: "AT_LEAST",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "FOULS",
                            timePeriodId: "MATCH",
                            participantId: "404042",
                          },
                          {
                            operator: "+",
                          },
                          {
                            outcomeId: "FOULS",
                            timePeriodId: "MATCH",
                            participantId: "404043",
                          },
                        ],

                        operator: ">=",
                        rightOperand: [
                          {
                            decimal: 7,
                          },
                        ],
                      },
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName:
                    "MIGUEL and JOAO To Win | MIGUEL To Have More GOALS Than LIRA During Regular Time | Phil Foden To Win | Phil Foden To Have More Goals Than Diogo Jota During Regular Time",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const OBB_MULTIPLE_BET_ONE_LOST_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
    currentSize: 0.1,
    betPrice: buildPrice(4.6),
    product: "OUTCOME_BASED_BETTING",
    result: "LOST",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
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
              legNumber: 0,
              result: "LOST",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
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
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      result: "LOST",
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404042",
                            name: "Miguel",
                          },
                          { id: "404043", name: "Lira" },
                        ],
                      },
                      params: {
                        outcomeIds: ["FOULS"],
                        timePeriodId: "MATCH",
                        participantIds: ["404042", "404043"],
                        value: 7,
                        quantifier: "AT_LEAST",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "FOULS",
                            timePeriodId: "MATCH",
                            participantId: "404042",
                          },
                          {
                            operator: "+",
                          },
                          {
                            outcomeId: "FOULS",
                            timePeriodId: "MATCH",
                            participantId: "404043",
                          },
                        ],

                        operator: ">=",
                        rightOperand: [
                          {
                            decimal: 7,
                          },
                        ],
                      },
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName:
                    "MIGUEL and JOAO To Win | MIGUEL To Have More GOALS Than LIRA During Regular Time | Phil Foden To Win | Phil Foden To Have More Goals Than Diogo Jota During Regular Time",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const OBB_MULTIPLE_BET_ONE_VOID_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
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
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
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
              legNumber: 0,
              result: "LOST",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
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
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404042",
                            name: "Miguel",
                          },
                          { id: "404043", name: "Lira" },
                        ],
                      },
                      params: {
                        outcomeIds: ["FOULS"],
                        timePeriodId: "MATCH",
                        participantIds: ["404042", "404043"],
                        value: 7,
                        quantifier: "AT_LEAST",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "FOULS",
                            timePeriodId: "MATCH",
                            participantId: "404042",
                          },
                          {
                            operator: "+",
                          },
                          {
                            outcomeId: "FOULS",
                            timePeriodId: "MATCH",
                            participantId: "404043",
                          },
                        ],

                        operator: ">=",
                        rightOperand: [
                          {
                            decimal: 7,
                          },
                        ],
                      },
                      result: "WON",
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(9.1),
                  originalPrice: buildPrice(9.1),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const SCA_INPLAY_MOCK = {
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
              goals: 3,
              fouls: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 4,
              fouls: null,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404042,
          name: "MIGUEL",
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
              fouls: 3,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404043,
          name: "LIRA",
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
              goals: 4,
              fouls: 2,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const SCA_FINAL_MOCK = {
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
              goals: 3,
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
              goals: 4,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 3,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 4,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404042,
          name: "MIGUEL",
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
              fouls: 3,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404043,
          name: "LIRA",
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
              goals: 4,
              fouls: 2,
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

describe("OBB Enhanced Tracking Multiples - My Bets Page.", () => {
  describe("Given I'm on my bets.", () => {
    describe("[SHMRCK-551] And I have a multiple obb bet with an inplay event.", () => {
      describe("[SHMRCK-551] And I already achieved one outcome.", () => {
        beforeAll(async () => {
          await browseToMyBets(OBB_MULTIPLE_ACTIVE_BET_MOCK);
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_MOCK));

          await firstCardSO.header.click();

          await browser.waitUntilDisplayed(firstTrackingBarSO.element);
          await browser.waitUntilDisplayed(secondTrackingBarSO.element);
        });
        it("[PRPI-3675] And the outcome is displayed.", async () => {
          expect(await firstBetSelectionDetailsSO.subtitle.getText()).toEqual("7+ Goals Between Them");
        });

        it("[PRPI-3676] And the goals of outcomes are 7.", async () => {
          expect(await firstTrackingBarSO.goalValue.getText()).toBe("7");
          expect(await secondTrackingBarSO.goalValue.getText()).toBe("7");
        });
        it("[PRPI-3677] Then the counter for the first outcome is displayed with 7.", async () => {
          expect(await firstTrackingBarSO.currentValue.getText()).toBe("7");
        });
        it("[PRPI-3678] And the second counter is displayed with 5.", async () => {
          expect(await secondTrackingBarSO.currentValue.getText()).toBe("7");
        });
        it("[PRPI-3679] And the bet is in progress.", async () => {
          expect(await betStatusLabelSO.element.isDisplayed()).toBe(false);
        });
        describe("[SHMRCK-563] When I click on the first show more button.", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(firstShowMoreButtonSO.element);
            await firstShowMoreButtonSO.element.click();
            await browser.waitUntilDisplayed(firstEnhancedTrackingSO.playerStats[0]);
          });

          it("[PRPI-3680] Then the first player statistics and name are displayed.", async () => {
            expect(await firstEnhancedTrackingSO.playerStats[0].getText()).toBe("3");
            expect(await firstEnhancedTrackingSO.playerName[0].getText()).toBe("João");
          });

          it("[PRPI-3680] Then the second player statistics and name are displayed.", async () => {
            expect(await firstEnhancedTrackingSO.playerStats[1].getText()).toBe("4");
            expect(await firstEnhancedTrackingSO.playerName[1].getText()).toBe("Mota");
          });
        });
      });
    });

    describe("[SHMRCK-552] And the event is finished.", () => {
      describe("[SHMRCK-552] And I achieve one outcome.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_FINAL_MOCK));
          await browseToMyBets(OBB_MULTIPLE_BET_ONE_LOST_MOCK);

          await firstCardSO.title.click();

          await browser.waitUntilDisplayed(firstTrackingBarSO.element);
          await browser.waitUntilDisplayed(secondTrackingBarSO.element);
        });
        it("[PRPI-3681] Then And the goals of outcomes are 7.", async () => {
          expect(await firstTrackingBarSO.goalValue.getText()).toBe("7");
          expect(await secondTrackingBarSO.goalValue.getText()).toBe("7");
        });
        it("[PRPI-3682] And the first outcome value is 7.", async () => {
          expect(await firstTrackingBarSO.currentValue.getText()).toBe("7");
        });
        it("[PRPI-3683] And the counter of the other outcome is on 7.", async () => {
          expect(await secondTrackingBarSO.currentValue.getText()).toBe("7");
        });
        it("[PRPI-3684] And the bet is settled as LOST.", async () => {
          expect(await betStatusLabelSO.text.getText()).toBe("Lost");
        });
        it("[PRPI-3685] And the first prime bet is settled as Won.", async () => {
          expect(await firstPrimeStatusLabelSO.text.getText()).toBe("Won");
        });
        it("[PRPI-3686] And the second prime is settled as Lost.", async () => {
          expect(await secondPrimeStatusLabelSO.text.getText()).toBe("Lost");
        });
      });
    });

    describe("[GRNFLDS-56] And the bet is voided.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINAL_MOCK));
        await browseToMyBets(OBB_MULTIPLE_BET_ONE_VOID_MOCK);

        await firstCardSO.title.click();

        await browser.waitUntilDisplayed(firstBetSelectionDetailsSO.element);
      });

      it("[PRPI-3687] And the bet is settled as Void.", async () => {
        expect(await betStatusLabelSO.text.getText()).toBe("Void");
      });
      it("[PRPI-3688] And the first prime bet has no signpost.", async () => {
        expect(await firstPrimeStatusLabelSO.text.isDisplayed()).toEqual(false);
      });
      it("[PRPI-3689] And the second prime bet has no signpost.", async () => {
        expect(await secondPrimeStatusLabelSO.text.isDisplayed()).toEqual(false);
      });
    });
  });
});
