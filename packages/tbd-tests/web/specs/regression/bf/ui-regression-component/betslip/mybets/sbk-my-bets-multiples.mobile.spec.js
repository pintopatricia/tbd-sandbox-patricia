const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  BetSegmentsPO,
  CardPO,
  BetSelectionDetailsPO,
  BetInfoPO,
  OddsPO,
  AvBFixturePO,
} = require("../../../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const betSegmentsPO = new BetSegmentsPO(myBetsPO.betCardGroups[0]);

const cardPO = new CardPO();

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();

const firstAvBFixturePO = new AvBFixturePO(sportsbookExpandableLegCardGroupPO.cards[0]);
const firstBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookExpandableLegCardGroupPO.cards[0]);
const firstBetSelectionDetailsOddsPO = new OddsPO(firstBetSelectionDetailsPO.element);

const secondAvBFixturePO = new AvBFixturePO(sportsbookExpandableLegCardGroupPO.cards[1]);
const secondBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookExpandableLegCardGroupPO.cards[1]);
const secondBetSelectionDetailsOddsPO = new OddsPO(secondBetSelectionDetailsPO.element);

const thirdAvBFixturePO = new AvBFixturePO(sportsbookExpandableLegCardGroupPO.cards[2]);
const thirdBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookExpandableLegCardGroupPO.cards[2]);
const thirdBetSelectionDetailsOddsPO = new OddsPO(thirdBetSelectionDetailsPO.element);

const betInfoPO = new BetInfoPO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_MULTIPLE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Newcastle v Brighton",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Newcastle",
                },
              ],
            },
          ],
        },
        {
          footballFixture: {
            homeName: "Sevilla",
            awayName: "Juventus",
            scheduledAt: "2023-05-18T19:00:00.000Z",
          },
          legs: [
            {
              parts: [
                {
                  price: buildPrice(2.4),
                  originalPrice: buildPrice(2.4),
                  eventDescription: "Sevilla v Juventus",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Sevilla",
                },
              ],
            },
          ],
        },
        {
          footballFixture: {
            homeName: "Az Alkmaar",
            awayName: "West Ham",
            scheduledAt: "2023-05-18T19:00:00.000Z",
          },
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.11),
                  originalPrice: buildPrice(1.11),
                  eventDescription: "Az Alkmaar v West Ham",
                  eventMarketDescription: "Alternative Handicaps",
                  selectionName: "Az Alkmaar",
                  startTime: "2023-05-18T19:00:00.000Z",
                  handicap: 2,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
      },
    },
  },
]);

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn, { products: ["sportsbook"] }));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My bets - SBK Multiples", () => {
  beforeAll(async () => {
    await browseToMyBets(SBK_MULTIPLE_BET_MOCK);
  });

  describe("When the user has a multiple bet with 3 different events (one in a handicap market)", () => {
    it("[PRPI-8253] should display the title header with 'Treble @ 5.2'", async () => {
      expect(await sbkBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("Treble @ 5.2");
    });

    it("[PRPI-8254] should display the supportingText with 'Newcastle | Sevilla | Az Alkmaar +2'", async () => {
      expect(await sbkBetPanelPO.panelSupportingText.getText()).toEqual("Newcastle | Sevilla | Az Alkmaar +2");
    });

    it("[PRPI-8255] should display the stake value with '$0.10'", async () => {
      expect(await betSegmentsPO.midValue.getText()).toEqual("$0.10");
    });

    it("[PRPI-8256] should display the returns value with '$0.52'", async () => {
      expect(await betSegmentsPO.rightValue.getText()).toEqual("$0.52");
    });

    describe("and clicks to expand the accordion", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await betInfoPO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(betInfoPO.element);
      });

      it("[PRPI-8257] should display 3 sportsbook bet leg cards groups", async () => {
        // (3) sportsbook bet leg cards groups + (1) bet info
        expect(await sportsbookExpandableLegCardGroupPO.cards.length).toEqual(4);
      });

      // 1st Event
      describe("and on first card group", () => {
        it("[PRPI-8258] should display the scoreboard", async () => {
          expect(await firstAvBFixturePO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8259] should display the bet selection details", async () => {
          expect(await firstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8260] should display the selection name with 'Newcastle'", async () => {
          expect(await firstBetSelectionDetailsPO.title.getText()).toEqual("Newcastle");
        });

        it("[PRPI-8261] should display the market name with 'Match Odds'", async () => {
          expect(await firstBetSelectionDetailsPO.subtitle.getText()).toEqual("Match Odds");
        });

        it("[PRPI-8262] should display the odds value with '@ 1.95'", async () => {
          expect(await firstBetSelectionDetailsOddsPO.value.getText()).toEqual("@ 1.95");
        });
      });

      // 2nd Event
      describe("and on second card group", () => {
        it("[PRPI-8263] should display the scoreboard", async () => {
          expect(await secondAvBFixturePO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8264] should display the bet selection details", async () => {
          expect(await secondBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8265] should display the selection name with 'Sevilla'", async () => {
          expect(await secondBetSelectionDetailsPO.title.getText()).toEqual("Sevilla");
        });

        it("[PRPI-8266] should display the market name with 'Match Odds'", async () => {
          expect(await secondBetSelectionDetailsPO.subtitle.getText()).toEqual("Match Odds");
        });

        it("[PRPI-8267] should display the odds value with '@ 2.4'", async () => {
          expect(await secondBetSelectionDetailsOddsPO.value.getText()).toEqual("@ 2.4");
        });
      });

      // 3rd Event
      describe("and on third card group", () => {
        it("[PRPI-8268] should display the scoreboard", async () => {
          expect(await thirdAvBFixturePO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8269] should display the bet selection details", async () => {
          expect(await thirdBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8270] should display the selection name with 'Az Alkmaar +2'", async () => {
          expect(await thirdBetSelectionDetailsPO.title.getText()).toEqual("Az Alkmaar +2");
        });

        it("[PRPI-8271] should display the market name with 'Alternative Handicaps'", async () => {
          expect(await thirdBetSelectionDetailsPO.subtitle.getText()).toEqual("Alternative Handicaps");
        });

        it("[PRPI-8272] should display the odds value with '@ 1.11'", async () => {
          expect(await thirdBetSelectionDetailsOddsPO.value.getText()).toEqual("@ 1.11");
        });
      });

      it("[PRPI-8273] should display the bet info", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(2);
      });
    });
  });
});
