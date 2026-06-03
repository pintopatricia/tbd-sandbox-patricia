const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");
const SportsbookBetLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.native.so");

const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { swipeUp } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  BottomBarSO,
  SportsbookBetPanelSO,
  CardSO,
  BetSelectionDetailsSO,
  BetInfoSO,
  OddsSO,
  AvBFixtureSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);

const cardSO = new CardSO();

const sportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO();
const sportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[0]);

const firstAvBFixtureSO = new AvBFixtureSO(sportsbookBetLegCardGroupSO.cards[3]);

const firstBetSelectionDetailsSO = new BetSelectionDetailsSO(sportsbookBetLegCardGroupSO.cards[0]);
const firstBetSelectionDetailsOddsSO = new OddsSO(firstBetSelectionDetailsSO.element);

const secondBetSelectionDetailsSO = new BetSelectionDetailsSO(sportsbookBetLegCardGroupSO.cards[1]);
const secondBetSelectionDetailsOddsSO = new OddsSO(secondBetSelectionDetailsSO.element);

const thirdBetSelectionDetailsSO = new BetSelectionDetailsSO(sportsbookBetLegCardGroupSO.cards[2]);
const thirdBetSelectionDetailsOddsSO = new OddsSO(thirdBetSelectionDetailsSO.element);

const betInfoSO = new BetInfoSO();

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

          footballFixture: {
            homeName: "Sporting Lisbon",
            awayName: "Benfica",
            scheduledAt: "2023-05-21T19:30:00Z",
          },
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
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  await startApp("home");
  await browser.waitUntilClickableNative(BottomBarSO.myBets);
  await BottomBarSO.myBets.click();

  await browser.waitUntilDisplayed(cardSO.element);
};

describe("My bets - Bet Builder", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
    await browseToMyBets(SBK_MULTIPLE_BET_BUILDER_MOCK);
  });

  describe("When the user has a bet builder bet with 3 selections", () => {
    it("[PRPI-2574] should display the title header with 'Treble - Bet Builder @ 8.13'", async () => {
      expect(await sbkBetPanelSO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("Treble - Bet Builder @ 8.13");
    });

    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.title);
        await cardSO.title.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        // Needed for android:
        await swipeUp();
        await browser.waitUntilDisplayed(betInfoSO.element);
      });

      it("[PRPI-2575] should display 1 sportsbook bet leg card group", async () => {
        // (1) sportsbook bet leg cards groups + (1) bet info
        expect(await sportsbookExpandableLegCardGroupSO.cards.length).toEqual(2);
      });

      it("[PRPI-2576] should display 1 scoreboard", async () => {
        expect(await firstAvBFixtureSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-2577] should display 3 bet legs", async () => {
        expect(await firstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        expect(await secondBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        expect(await thirdBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
      });

      // 1st Bet Leg
      describe("and on first bet leg", () => {
        it("[PRPI-2578] should display the selection name with 'Sporting Lisbon'", async () => {
          expect(await firstBetSelectionDetailsSO.title.getText()).toEqual("Sporting Lisbon");
        });

        it("[PRPI-2579] should display the market name with 'Match Odds'", async () => {
          expect(await firstBetSelectionDetailsSO.subtitle.getText()).toEqual("Match Odds");
        });

        it("[PRPI-2580] should not display the odds value", async () => {
          expect(await firstBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
        });
      });

      // 2nd Bet Leg
      describe("and on second bet leg", () => {
        it("[PRPI-2581] should display the selection name with 'Yes'", async () => {
          expect(await secondBetSelectionDetailsSO.title.getText()).toEqual("Yes");
        });

        it("[PRPI-2582] should display the market name with 'Both Teams To Score'", async () => {
          expect(await secondBetSelectionDetailsSO.subtitle.getText()).toEqual("Both Teams To Score");
        });

        it("[PRPI-2583] should not display the odds value", async () => {
          expect(await secondBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
        });
      });

      // 3rd Bet Leg
      describe("and on third bet leg", () => {
        it("[PRPI-2584] should display the selection name with 'Pote'", async () => {
          expect(await thirdBetSelectionDetailsSO.title.getText()).toEqual("Pote");
        });

        it("[PRPI-2585] should display the market name with 'Anytime Goalscorer'", async () => {
          expect(await thirdBetSelectionDetailsSO.subtitle.getText()).toEqual("Anytime Goalscorer");
        });

        it("[PRPI-2586] should not display the odds value", async () => {
          expect(await thirdBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
        });
      });

      it("[PRPI-2587] should display the bet info", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(2);
      });
    });
  });
});
