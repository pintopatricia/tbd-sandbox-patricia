const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");
const SportsbookBetLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.native.so");

const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { swipeUp } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");

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
const firstSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[0]);
const secondSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[1]);

// 1st bet leg card group
const firstEventFirstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardGroupSO.cards[0]);
const firstEventFirstBetSelectionDetailsOddsSO = new OddsSO(firstEventFirstBetSelectionDetailsSO.element);
const firstEventSecondBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardGroupSO.cards[1]);
const firstEventSecondBetSelectionDetailsOddsSO = new OddsSO(firstEventSecondBetSelectionDetailsSO.element);
const firstEventThirdBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardGroupSO.cards[2]);
const firstEventThirdBetSelectionDetailsOddsSO = new OddsSO(firstEventThirdBetSelectionDetailsSO.element);
const firstEventAvBFixtureSO = new AvBFixtureSO(firstSportsbookBetLegCardGroupSO.cards[3]);

// 2nd bet leg card group
const secondEventFirstBetSelectionDetailsSO = new BetSelectionDetailsSO(secondSportsbookBetLegCardGroupSO.cards[0]);
const secondEventFirstBetSelectionDetailsOddsSO = new OddsSO(secondEventFirstBetSelectionDetailsSO.element);
const secondEventSecondBetSelectionDetailsSO = new BetSelectionDetailsSO(secondSportsbookBetLegCardGroupSO.cards[1]);
const secondEventSecondBetSelectionDetailsOddsSO = new OddsSO(secondEventSecondBetSelectionDetailsSO.element);
const secondEventAvBFixtureSO = new AvBFixtureSO(secondSportsbookBetLegCardGroupSO.cards[2]);

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
    betType: "ACC5",
    isOpen: true,
    profitAndLoss: 1.54,
    currentSize: 0.1,
    betPrice: buildPrice(15.4),
    isSGMMulti: true,
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
        {
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.64),
                  originalPrice: buildPrice(1.66),
                  priceType: "LIVE",
                  eventDescription: "Maritimo v Vizela",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Maritimo",
                },
              ],
            },
            {
              parts: [
                {
                  price: buildPrice(1.15),
                  originalPrice: buildPrice(1.16),
                  priceType: "LIVE",
                  eventDescription: "Maritimo v Vizela",
                  eventMarketDescription: "Both Teams To Score First Half",
                  selectionName: "No",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Maritimo",
            awayName: "Vizela",
            scheduledAt: "2023-05-19T19:15:00Z",
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

describe("My bets - Multi Bet Builder", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
    await browseToMyBets(SBK_MULTIPLE_BET_BUILDER_MOCK);
  });

  describe("When the user has a multi bet builder in 2 distinct events", () => {
    it("[PRPI-2548] should display the title header with '5 Fold - Bet Builder Multis @ 15.4'", async () => {
      expect(await sbkBetPanelSO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("5 Fold - Bet Builder Multis @ 15.4");
    });

    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        await swipeUp();
        await browser.waitUntilDisplayed(betInfoSO.element);
      });

      it("[PRPI-2549] should display 2 sportsbook bet leg card groups", async () => {
        // (2) sportsbook bet leg cards groups + (1) bet info
        expect(await sportsbookExpandableLegCardGroupSO.cards.length).toEqual(3);
      });

      // 1st bet leg card group
      describe("and on first bet leg card group", () => {
        it("[PRPI-2550] should display 1 scoreboard", async () => {
          expect(await firstEventAvBFixtureSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2551] should display 3 bet legs", async () => {
          expect(await firstEventFirstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
          expect(await firstEventSecondBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
          expect(await firstEventThirdBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        });

        // 1st Bet Leg
        describe("and on first bet leg", () => {
          it("[PRPI-2552] should display the selection name with 'Sporting Lisbon'", async () => {
            expect(await firstEventFirstBetSelectionDetailsSO.title.getText()).toEqual("Sporting Lisbon");
          });

          it("[PRPI-2553] should display the market name with 'Match Odds'", async () => {
            expect(await firstEventFirstBetSelectionDetailsSO.subtitle.getText()).toEqual("Match Odds");
          });

          it("[PRPI-2554] should not display the odds value", async () => {
            expect(await firstEventFirstBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
          });
        });

        // 2nd Bet Leg
        describe("and on second bet leg", () => {
          it("[PRPI-2555] should display the selection name with 'Yes'", async () => {
            expect(await firstEventSecondBetSelectionDetailsSO.title.getText()).toEqual("Yes");
          });

          it("[PRPI-2556] should display the market name with 'Both Teams To Score'", async () => {
            expect(await firstEventSecondBetSelectionDetailsSO.subtitle.getText()).toEqual("Both Teams To Score");
          });

          it("[PRPI-2557] should not display the odds value", async () => {
            expect(await firstEventSecondBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
          });
        });

        // 3rd Bet Leg
        describe("and on third bet leg", () => {
          it("[PRPI-2558] should display the selection name with 'Pote'", async () => {
            expect(await firstEventThirdBetSelectionDetailsSO.title.getText()).toEqual("Pote");
          });

          it("[PRPI-2559] should display the market name with 'Anytime Goalscorer'", async () => {
            expect(await firstEventThirdBetSelectionDetailsSO.subtitle.getText()).toEqual("Anytime Goalscorer");
          });

          it("[PRPI-2560] should not display the odds value", async () => {
            expect(await firstEventThirdBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
          });
        });
      });

      // 2nd bet leg card group
      describe("and on second bet leg card group", () => {
        it("[PRPI-2561] should display 1 scoreboard", async () => {
          expect(await secondEventAvBFixtureSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2562] should display 2 bet legs", async () => {
          expect(await secondEventFirstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
          expect(await secondEventSecondBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        });

        // 1st Bet Leg
        describe("and on first bet leg", () => {
          it("[PRPI-2563] should display the selection name with 'Maritimo'", async () => {
            expect(await secondEventFirstBetSelectionDetailsSO.title.getText()).toEqual("Maritimo");
          });

          it("[PRPI-2564] should display the market name with 'Match Odds'", async () => {
            expect(await secondEventFirstBetSelectionDetailsSO.subtitle.getText()).toEqual("Match Odds");
          });

          it("[PRPI-2565] should not display the odds value", async () => {
            expect(await secondEventFirstBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
          });
        });

        // 2nd Bet Leg
        describe("and on second bet leg", () => {
          it("[PRPI-2566] should display the selection name with 'No'", async () => {
            expect(await secondEventSecondBetSelectionDetailsSO.title.getText()).toEqual("No");
          });

          it("[PRPI-2567] should display the market name with 'Both Teams To Score First Half'", async () => {
            expect(await secondEventSecondBetSelectionDetailsSO.subtitle.getText()).toEqual(
              "Both Teams To Score First Half",
            );
          });

          it("[PRPI-2568] should not display the odds value", async () => {
            expect(await secondEventSecondBetSelectionDetailsOddsSO.odds.isDisplayed()).toEqual(false);
          });
        });
      });

      it("[PRPI-2569] should display the bet info", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(2);
      });
    });
  });
});
