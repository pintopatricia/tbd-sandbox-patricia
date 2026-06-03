const { getMyBetsLayout, getAppContext, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");
const SportsbookBetLegCardSO = require("@ppb/tbd-shared/components/SportsbookBetLegCard/SportsbookBetLegCard.native.so");
const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen, swipeUpElement } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  BottomBarSO,
  MyBetsScreenSO,
  SportsbookBetPanelSO,
  CardSO,
  BetSegmentsSO,
  OddsSO,
  PNLAndWhatIfSO,
  BetSelectionDetailsSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const cardSO = new CardSO();
const myBetsSO = new MyBetsScreenSO();

const firstBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const secondBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[1]);
const thirdBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[2]);

const firstCardSO = new CardSO(myBetsSO.betCardGroups[0]);
const firstBetSegmentsSO = new BetSegmentsSO(myBetsSO.betCardGroups[0]);
const firstRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(firstBetSegmentsSO.rightSegment);
const firstSelectionSegmentStakeSO = new OddsSO(firstBetSegmentsSO.midSegment);
const firstSportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO(myBetsSO.betCardGroups[0]);
const firstSportsbookBetLegCardSO = new SportsbookBetLegCardSO(firstSportsbookExpandableLegCardGroupSO.cards[0]);
const firstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardSO.contentCards[0]);

const secondCardSO = new CardSO(myBetsSO.betCardGroups[1]);
const secondBetSegmentsSO = new BetSegmentsSO(myBetsSO.betCardGroups[1]);
const secondRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(secondBetSegmentsSO.rightSegment);
const secondSelectionSegmentStakeSO = new OddsSO(secondBetSegmentsSO.midSegment);
const secondSportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO(myBetsSO.betCardGroups[1]);
const secondSportsbookBetLegCardSO = new SportsbookBetLegCardSO(secondSportsbookExpandableLegCardGroupSO.cards[0]);
const firstBetLegSelectionsDetailsSO = new BetSelectionDetailsSO(secondSportsbookBetLegCardSO.contentCards[0]);
const secondBetLegSelectionsDetailsSO = new BetSelectionDetailsSO(secondSportsbookBetLegCardSO.contentCards[1]);

const thirdCardSO = new CardSO(myBetsSO.betCardGroups[2]);
const thirdBetSegmentsSO = new BetSegmentsSO(myBetsSO.betCardGroups[2]);
const thirdRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(thirdBetSegmentsSO.rightSegment);
const thirdSelectionSegmentStakeSO = new OddsSO(thirdBetSegmentsSO.midSegment);
const thirdSportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO(myBetsSO.betCardGroups[2]);
const thirdSportsbookBetLegCardSO = new SportsbookBetLegCardSO(thirdSportsbookExpandableLegCardGroupSO.cards[0]);
const thirdBetSelectionDetailsSO = new BetSelectionDetailsSO(thirdSportsbookBetLegCardSO.contentCards[0]);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const OBB_BETS_MOCK = getMyBetsSBKViewMock([
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
          },
          legs: [
            {
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "playerVsPlayer",
                  templateVersion: 1,
                  params: {
                    participantIdA: "62719",
                    participantIdB: "10364",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                    timePeriodId: "MATCH",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "62719",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "10364",
                      },
                    ],
                  },
                  expressionMetadata: {
                    participants: [
                      {
                        id: "62719",
                        name: "Darwin Nunez",
                      },
                      {
                        id: "10364",
                        name: "Cody Gakpo",
                      },
                    ],
                  },
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName:
                    "Darwin Nunez To Win | Darwin Nunez To Have More Goals Than Cody Gakpo During Regular Time",
                  outcomeDefinitionExp: {
                    __typename: "OutcomeDefinitionExp",
                    outcomeDefinitionEntries: [
                      {
                        outcomeDefinitionType: "OPERAND",
                        operator: null,
                        outcomeDefinition: null,
                        __typename: "OutcomeDefinitionEntry",
                      },
                    ],
                  },
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
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
          legs: [
            {
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  expressionMetadata: null,
                  subExpressionInfos: [
                    {
                      templateId: "playerVsPlayer",
                      params: {
                        participantIdA: "46191",
                        participantIdB: "91733",
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                      },
                      expressionMetadata: {
                        participants: [
                          {
                            id: "91733",
                            name: "Bukayo Saka",
                          },
                          {
                            id: "46191",
                            name: "Cristiano Ronaldo",
                          },
                        ],
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "GOALS",
                            timePeriodId: "MATCH",
                            participantId: "46191",
                          },
                        ],

                        operator: ">",
                        rightOperand: [
                          {
                            outcomeId: "GOALS",
                            timePeriodId: "MATCH",
                            participantId: "91733",
                          },
                        ],
                      },
                    },
                    {
                      templateId: "playerVsPlayer",
                      params: {
                        participantIdA: "17942",
                        participantIdB: "56257",
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                      },
                      expressionMetadata: {
                        participants: [
                          {
                            id: "17942",
                            name: "Phil Foden",
                          },
                          {
                            id: "56257",
                            name: "Diogo Jota",
                          },
                        ],
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "GOALS",
                            timePeriodId: "MATCH",
                            participantId: "17942",
                          },
                        ],

                        operator: ">",
                        rightOperand: [
                          {
                            outcomeId: "GOALS",
                            timePeriodId: "MATCH",
                            participantId: "56257",
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Build Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName:
                    "Cristiano Ronaldo To Win | Cristiano Ronaldo To Have More GOALS Than Bukayo Saka During Regular Time | Phil Foden To Win | Phil Foden To Have More Goals Than Diogo Jota During Regular Time",
                  outcomeDefinitionExp: {
                    __typename: "OutcomeDefinitionExp",
                    outcomeDefinitionEntries: [
                      {
                        outcomeDefinitionType: "OPERAND",
                        operator: null,
                        outcomeDefinition: null,
                        __typename: "OutcomeDefinitionEntry",
                      },
                    ],
                  },
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
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.23,
    currentSize: 0.1,
    betPrice: buildPrice(2.3),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
          legs: [
            {
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "playerVsPlayer",
                  templateVersion: 1,
                  params: {
                    participantIdA: "28465",
                    participantIdB: "19492",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                    timePeriodId: "MATCH",
                  },
                  expressionComponents: null,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "28465",
                        name: null,
                      },
                      {
                        id: "19492",
                        name: null,
                      },
                    ],
                  },
                },
              },
              parts: [
                {
                  price: buildPrice(2.3),
                  originalPrice: buildPrice(2.3),
                  eventMarketDescription: "Match Ups",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  selectionName: "Leonel Messi To Win | To Have More Goals Than Neymar Jr. During Regular Time",
                  outcomeDefinitionExp: {
                    __typename: "OutcomeDefinitionExp",
                    outcomeDefinitionEntries: [
                      {
                        outcomeDefinitionType: "OPERAND",
                        operator: null,
                        outcomeDefinition: null,
                        __typename: "OutcomeDefinitionEntry",
                      },
                    ],
                  },
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

describe("OBB My Bets", () => {
  describe("When a user has obb open bets", () => {
    beforeAll(async () => {
      await browseToMyBets(OBB_BETS_MOCK);
    });

    it("[PRPI-3719] should display three open bets", async () => {
      expect(await myBetsSO.betCardGroups.length).toBe(3);
    });

    it("[PRPI-3720] should display the correct first bet details", async () => {
      expect(await firstBetPanelSO.panelTitle.isDisplayed()).toBe(true);
      expect(await firstBetPanelSO.panelTitle.getText()).toBe("Match Ups @1.9");

      expect(await firstBetPanelSO.sbkBetPanelSupportingText.isDisplayed()).toBe(true);
      expect(await firstBetPanelSO.sbkBetPanelSupportingText.getText()).toBe("Darwin Nunez");

      expect(await firstSelectionSegmentStakeSO.odds.getText()).toBe("$0.10");

      expect(await firstRightSelectionSegmentProfitSO.pnl.getText()).toBe("$0.19");
    });

    it("[PRPI-3721] should display the correct second bet details", async () => {
      expect(await secondBetPanelSO.panelTitle.isDisplayed()).toBe(true);
      expect(await secondBetPanelSO.panelTitle.getText()).toBe("Match Ups Multi @4.6");

      expect(await secondBetPanelSO.sbkBetPanelSupportingText.isDisplayed()).toBe(true);
      expect(await secondBetPanelSO.sbkBetPanelSupportingText.getText()).toBe("Cristiano Ronaldo | Phil Foden");

      expect(await secondSelectionSegmentStakeSO.odds.getText()).toBe("$0.10");

      expect(await secondRightSelectionSegmentProfitSO.pnl.getText()).toBe("$0.46");
    });

    it("[PRPI-3722] should display the correct third bet details", async () => {
      await swipeUpElement(thirdBetPanelSO.element, 250);

      expect(await thirdBetPanelSO.panelTitle.isDisplayed()).toBe(true);
      expect(await thirdBetPanelSO.panelTitle.getText()).toBe("Match Ups @2.3");

      expect(await thirdBetPanelSO.sbkBetPanelSupportingText.isDisplayed()).toBe(true);
      expect(await thirdBetPanelSO.sbkBetPanelSupportingText.getText()).toBe(
        "Leonel Messi To Win | To Have More Goals Than Neymar Jr. During Regular Time",
      );

      expect(await thirdSelectionSegmentStakeSO.odds.getText()).toBe("$0.10");

      expect(await thirdRightSelectionSegmentProfitSO.pnl.getText()).toBe("$0.23");
    });

    describe("and clicks to expand the bet cards", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(firstCardSO.header);
        await firstCardSO.header.click();
        await browser.waitUntilDisplayed(firstCardSO.contentWrapper);
        await swipeUpElement(firstCardSO.element, 250);
      });

      // 1st bet
      describe("and on the first bet", () => {
        it("[PRPI-3723] should display one bet selection details card", async () => {
          expect(await firstSportsbookBetLegCardSO.contentCards.length).toEqual(1);
          expect(await firstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3724] should display the correct participant name", async () => {
          expect(await firstBetSelectionDetailsSO.title.getText()).toEqual("Darwin Nunez");
        });

        it("[PRPI-3725] should display the correct outcome description", async () => {
          expect(await firstBetSelectionDetailsSO.subtitle.getText()).toEqual(
            "To Score More Goals Than Cody Gakpo During Regular Time",
          );
        });
      });

      // 2nd bet
      describe("and on the second bet", () => {
        beforeAll(async () => {
          await firstCardSO.header.click();
          await browser.waitUntilClickableNative(secondCardSO.header);
          await secondCardSO.header.click();
          await browser.waitUntilDisplayed(secondCardSO.contentWrapper);
        });

        it("[PRPI-3726] should display two bet selection cards", async () => {
          expect(await secondSportsbookBetLegCardSO.contentCards.length).toEqual(2);
          expect(await firstBetLegSelectionsDetailsSO.element.isDisplayed()).toEqual(true);
          expect(await secondBetLegSelectionsDetailsSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3727] should display the correct participants names", async () => {
          expect(await firstBetLegSelectionsDetailsSO.title.getText()).toEqual("Cristiano Ronaldo");
          expect(await secondBetLegSelectionsDetailsSO.title.getText()).toEqual("Phil Foden");
        });

        it("[PRPI-3728] should display the correct outcome descriptions", async () => {
          expect(await firstBetLegSelectionsDetailsSO.subtitle.getText()).toEqual(
            "To Score More Goals Than Bukayo Saka During Regular Time",
          );

          expect(await secondBetLegSelectionsDetailsSO.subtitle.getText()).toEqual(
            "To Score More Goals Than Diogo Jota During Regular Time",
          );
        });
      });

      // 3rd bet
      describe("and on the third bet", () => {
        beforeAll(async () => {
          await secondCardSO.header.click();
          await browser.waitUntilClickableNative(thirdCardSO.header);
          await thirdCardSO.header.click();
          await browser.waitUntilDisplayed(thirdCardSO.contentWrapper);
          await swipeUpElement(thirdCardSO.element, 400);
        });

        it("[PRPI-3729] should display one bet selections card", async () => {
          expect(await thirdSportsbookBetLegCardSO.contentCards.length).toEqual(1);
          expect(await thirdBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
          expect(await thirdBetSelectionDetailsSO.subtitle.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3730] should not display the participant name", async () => {
          // With new arch element is there without text
          expect(await thirdBetSelectionDetailsSO.title.getText()).toBe("");
        });

        it("[PRPI-3731] should display the correct outcome description", async () => {
          expect(await thirdBetSelectionDetailsSO.subtitle.getText()).toEqual(
            "Leonel Messi To Win | To Have More Goals Than Neymar Jr. During Regular Time",
          );
        });
      });
    });
  });
});
