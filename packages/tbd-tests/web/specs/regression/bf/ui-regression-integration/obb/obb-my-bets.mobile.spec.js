const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const SportsbookBetLegCardPO = require("@ppb/tbd-shared/components/SportsbookBetLegCard/SportsbookBetLegCard.web.po");

const {
  MyBetsPagePO,
  CardPO,
  SportsbookBetPanelPO,
  AvBFixturePO,
  BetSelectionDetailsPO,
} = require("../../../../../page-objects");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const firstBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const secondBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[1]);
const thirdBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[2]);

const firstCardPO = new CardPO(myBetsPO.betCardGroups[0]);
const firstSportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO(myBetsPO.betCardGroups[0]);
const firstAvBFixturePO = new AvBFixturePO(firstSportsbookExpandableLegCardGroupPO.cards[0]);
const firstSportsbookBetLegCardPO = new SportsbookBetLegCardPO(firstSportsbookExpandableLegCardGroupPO.cards[0]);
const firstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardPO.contentCards[0]);

const secondCardPO = new CardPO(myBetsPO.betCardGroups[1]);
const secondSportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO(myBetsPO.betCardGroups[1]);
const secondAvBFixturePO = new AvBFixturePO(secondSportsbookExpandableLegCardGroupPO.cards[0]);
const secondSportsbookBetLegCardPO = new SportsbookBetLegCardPO(secondSportsbookExpandableLegCardGroupPO.cards[0]);
const firstBetLegSelectionsDetailsPO = new BetSelectionDetailsPO(secondSportsbookBetLegCardPO.contentCards[0]);
const secondBetLegSelectionsDetailsPO = new BetSelectionDetailsPO(secondSportsbookBetLegCardPO.contentCards[1]);

const thirdCardPO = new CardPO(myBetsPO.betCardGroups[2]);
const thirdSportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO(myBetsPO.betCardGroups[2]);
const thirdAvBFixturePO = new AvBFixturePO(thirdSportsbookExpandableLegCardGroupPO.cards[0]);
const thirdSportsbookBetLegCardPO = new SportsbookBetLegCardPO(thirdSportsbookExpandableLegCardGroupPO.cards[0]);
const thirdBetSelectionDetailsPO = new BetSelectionDetailsPO(thirdSportsbookBetLegCardPO.contentCards[0]);

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
                    x: 1,
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
                  eventMarketDescription: "Match Ups Multi",
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
                    outcomeId: "GOAL_TIME_ADJUSTED",
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
                  selectionName: "Leonel Messi To Win |  To Have More Goals Than Neymar Jr. During Regular Time",
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

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(firstCardPO.element);
};

describe("OBB My Bets Page", () => {
  describe("When a user has obb open bets", () => {
    beforeAll(async () => {
      await browseToMyBets(OBB_BETS_MOCK);
    });
    it("[PRPI-7089] should display three obb bets", async () => {
      expect(await myBetsPO.betCardGroups.length).toEqual(3);
    });

    it("[PRPI-7090] should display the correct bet title headers", async () => {
      expect(await firstBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await secondBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await thirdBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await firstBetPanelPO.panelTitle.getText()).toEqual("Match Ups @1.9");
      expect(await secondBetPanelPO.panelTitle.getText()).toEqual("Match Ups Multi @4.6");
      expect(await thirdBetPanelPO.panelTitle.getText()).toEqual("Match Ups @2.3");
    });

    it("[PRPI-7091] should display the correct bet subtitles", async () => {
      expect(await firstBetPanelPO.panelSubTitle.isDisplayed()).toEqual(false);
      expect(await secondBetPanelPO.panelSubTitle.isDisplayed()).toEqual(true);
      expect(await secondBetPanelPO.panelSubTitle.getText()).toEqual("1 of 2 Selections to Win");
      expect(await thirdBetPanelPO.panelSubTitle.isDisplayed()).toEqual(false);
    });

    it("[PRPI-7092] should display the correct bet supporting text", async () => {
      expect(await firstBetPanelPO.panelSupportingText.isDisplayed()).toEqual(true);
      expect(await secondBetPanelPO.panelSupportingText.isDisplayed()).toEqual(true);
      expect(await firstBetPanelPO.panelSupportingText.getText()).toEqual("Darwin Nunez");
      expect(await secondBetPanelPO.panelSupportingText.getText()).toEqual("Cristiano Ronaldo | Phil Foden");
      expect(await thirdBetPanelPO.panelSupportingText.getText()).toEqual(
        "Leonel Messi To Win | To Have More Goals Than Neymar Jr. During Regular Time",
      );
    });

    it("[PRPI-7093] should display the correct bet stakes", async () => {
      expect(await firstBetPanelPO.stake.getText()).toEqual("$0.10");
      expect(await secondBetPanelPO.stake.getText()).toEqual("$0.10");
      expect(await thirdBetPanelPO.stake.getText()).toEqual("$0.10");
    });

    it("[PRPI-7094] should display the correct bet potential returns", async () => {
      expect(await firstBetPanelPO.potentialReturns.getText()).toEqual("$0.19");
      expect(await secondBetPanelPO.potentialReturns.getText()).toEqual("$0.46");
      expect(await thirdBetPanelPO.potentialReturns.getText()).toEqual("$0.23");
    });

    describe("and clicks to expand the bet cards", () => {
      beforeAll(async () => {
        await firstCardPO.header.waitForClickable();
        await firstCardPO.header.click();
        await browser.waitUntilDisplayed(firstCardPO.content);
        await browser.waitUntilDisplayed(firstAvBFixturePO.element);
        await browser.waitUntilDisplayed(firstBetSelectionDetailsPO.element);
      });

      // 1st bet
      describe("and on the first bet", () => {
        it("[PRPI-7095] should display the scoreboard and one bet selection details card", async () => {
          expect(await firstAvBFixturePO.element.isDisplayed()).toEqual(true);
          expect(await firstSportsbookBetLegCardPO.contentCards.length).toEqual(1);
          expect(await firstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-7096] should display the correct participant name", async () => {
          expect(await firstBetSelectionDetailsPO.title.getText()).toEqual("Darwin Nunez");
        });

        it("[PRPI-7097] should display the correct outcome description", async () => {
          expect(await firstBetSelectionDetailsPO.subtitle.getText()).toEqual(
            "To Score More Goals Than Cody Gakpo During Regular Time",
          );
        });
      });

      // 2nd bet
      describe("and on the second bet", () => {
        beforeAll(async () => {
          await secondCardPO.element.scrollIntoView({ block: "end" });
          await secondCardPO.header.waitForDisplayed();
          await secondCardPO.header.click();
          await browser.waitUntilDisplayed(secondAvBFixturePO.element);
          await browser.waitUntilDisplayed(firstBetLegSelectionsDetailsPO.element);
          await browser.waitUntilDisplayed(secondBetLegSelectionsDetailsPO.element);
        });

        it("[PRPI-7098] should display the scoreboard and two bet selection details cards", async () => {
          expect(await secondAvBFixturePO.element.isDisplayed()).toEqual(true);
          expect(await secondSportsbookBetLegCardPO.contentCards.length).toEqual(2);
          expect(await firstBetLegSelectionsDetailsPO.element.isDisplayed()).toEqual(true);
          expect(await secondBetLegSelectionsDetailsPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-7099] should display the correct participants names", async () => {
          expect(await firstBetLegSelectionsDetailsPO.title.getText()).toEqual("Cristiano Ronaldo");
          expect(await secondBetLegSelectionsDetailsPO.title.getText()).toEqual("Phil Foden");
        });

        it("[PRPI-7100] should display the correct outcome descriptions", async () => {
          expect(await firstBetLegSelectionsDetailsPO.subtitle.getText()).toEqual(
            "To Score More Goals Than Bukayo Saka During Regular Time",
          );

          expect(await secondBetLegSelectionsDetailsPO.subtitle.getText()).toEqual(
            "To Score More Goals Than Diogo Jota During Regular Time",
          );
        });
      });

      // 3rd bet
      describe("and on the third bet", () => {
        beforeAll(async () => {
          await thirdCardPO.element.scrollIntoView({ block: "end" });
          await thirdCardPO.header.waitForDisplayed();
          await thirdCardPO.header.click();
          await browser.waitUntilDisplayed(thirdAvBFixturePO.element);
          await browser.waitUntilDisplayed(thirdBetSelectionDetailsPO.element);
        });

        it("[PRPI-7101] should display the scoreboard and one bet selection details card", async () => {
          expect(await thirdAvBFixturePO.element.isDisplayed()).toEqual(true);
          expect(await thirdSportsbookBetLegCardPO.contentCards.length).toEqual(1);
          expect(await thirdBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-7102] should not display the participant name", async () => {
          expect(await thirdBetSelectionDetailsPO.title.getText()).toEqual("");
        });

        it("[PRPI-7103] should display the correct outcome description", async () => {
          expect(await thirdBetSelectionDetailsPO.subtitle.getText()).toEqual(
            "Leonel Messi To Win | To Have More Goals Than Neymar Jr. During Regular Time",
          );
        });
      });
    });
  });
});
