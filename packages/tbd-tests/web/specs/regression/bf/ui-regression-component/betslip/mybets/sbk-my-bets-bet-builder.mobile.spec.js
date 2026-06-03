const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const SportsbookBetLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web.po");
const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
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

const cardPO = new CardPO();

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();
const sportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[0]);

const firstBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookBetLegCardGroupPO.cards[0]);
const firstBetSelectionDetailsOddsPO = new OddsPO(firstBetSelectionDetailsPO.element);

const secondBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookBetLegCardGroupPO.cards[1]);
const secondBetSelectionDetailsOddsPO = new OddsPO(secondBetSelectionDetailsPO.element);

const thirdBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookBetLegCardGroupPO.cards[2]);
const thirdBetSelectionDetailsOddsPO = new OddsPO(thirdBetSelectionDetailsPO.element);

const firstAvBFixturePO = new AvBFixturePO(sportsbookBetLegCardGroupPO.cards[3]);

const betInfoPO = new BetInfoPO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_MULTIPLE_BET_BUILDER_MOCK = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(8.13),
    isSGM: true,
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Sporting Lisbon",
            awayName: "Benfica",
            scheduledAt: "2023-05-21T19:30:00Z",
          },
          legs: [
            {
              parts: [
                {
                  price: buildPrice(2.2),
                  originalPrice: buildPrice(2.55),
                  priceType: "LIVE",
                  eventDescription: "Sporting Lisbon v Benfica",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Sporting Lisbon",
                },
              ],
            },
            {
              parts: [
                {
                  price: buildPrice(1.38),
                  originalPrice: buildPrice(1.6),
                  priceType: "LIVE",
                  eventDescription: "Sporting Lisbon v Benfica",
                  eventMarketDescription: "Both Teams To Score",
                  selectionName: "Yes",
                },
              ],
            },
            {
              parts: [
                {
                  price: buildPrice(2.67),
                  originalPrice: buildPrice(3.1),
                  priceType: "LIVE",
                  eventDescription: "Sporting Lisbon v Benfica",
                  eventMarketDescription: "Anytime Goalscorer",
                  selectionName: "Pote",
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

describe("My bets - Bet Builder", () => {
  beforeAll(async () => {
    await browseToMyBets(SBK_MULTIPLE_BET_BUILDER_MOCK);
  });

  describe("When the user has a bet builder bet with 3 selections", () => {
    it("[PRPI-8239] should display the title header with 'Treble - Bet Builder @ 8.13'", async () => {
      expect(await sbkBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("Treble - Bet Builder @ 8.13");
    });

    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await cardPO.title.waitForClickable();
        await cardPO.title.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(firstAvBFixturePO.element);
      });

      it("[PRPI-8240] should display 1 sportsbook bet leg card group", async () => {
        // (1) sportsbook bet leg cards groups + (1) bet info
        expect(await sportsbookExpandableLegCardGroupPO.cards.length).toEqual(2);
      });

      it("[PRPI-8241] should display 1 scoreboard", async () => {
        expect(await firstAvBFixturePO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8242] should display 3 bet legs", async () => {
        expect(await firstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        expect(await secondBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        expect(await thirdBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
      });

      // 1st Bet Leg
      describe("and on first bet leg", () => {
        it("[PRPI-8243] should display the selection name with 'Sporting Lisbon'", async () => {
          expect(await firstBetSelectionDetailsPO.title.getText()).toEqual("Sporting Lisbon");
        });

        it("[PRPI-8244] should display the market name with 'Match Odds'", async () => {
          expect(await firstBetSelectionDetailsPO.subtitle.getText()).toEqual("Match Odds");
        });

        it("[PRPI-8245] should not display the odds value", async () => {
          expect(await firstBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
        });
      });

      // 2nd Bet Leg
      describe("and on second bet leg", () => {
        it("[PRPI-8246] should display the selection name with 'Yes'", async () => {
          expect(await secondBetSelectionDetailsPO.title.getText()).toEqual("Yes");
        });

        it("[PRPI-8247] should display the market name with 'Both Teams To Score'", async () => {
          expect(await secondBetSelectionDetailsPO.subtitle.getText()).toEqual("Both Teams To Score");
        });

        it("[PRPI-8248] should not display the odds value", async () => {
          expect(await secondBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
        });
      });

      // 3rd Bet Leg
      describe("and on third bet leg", () => {
        it("[PRPI-8249] should display the selection name with 'Pote'", async () => {
          expect(await thirdBetSelectionDetailsPO.title.getText()).toEqual("Pote");
        });

        it("[PRPI-8250] should display the market name with 'Anytime Goalscorer'", async () => {
          expect(await thirdBetSelectionDetailsPO.subtitle.getText()).toEqual("Anytime Goalscorer");
        });

        it("[PRPI-8251] should not display the odds value", async () => {
          expect(await thirdBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
        });
      });

      it("[PRPI-8252] should display the bet info", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(2);
      });
    });
  });
});
