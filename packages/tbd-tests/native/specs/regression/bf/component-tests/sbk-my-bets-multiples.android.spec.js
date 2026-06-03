const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");

const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { swipeUp } = require("../../../../helpers/gestures");

const { startApp } = require("../../../../helpers/urls");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  BottomBarSO,
  SportsbookBetPanelSO,
  BetSegmentsSO,
  CardSO,
  BetSelectionDetailsSO,
  BetInfoSO,
  OddsSO,
  AvBFixtureSO,
  PNLAndWhatIfSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const betSegmentsSO = new BetSegmentsSO(myBetsSO.betCardGroups[0]);

const midSelectionSegmentSO = new OddsSO(betSegmentsSO.midSegment);
const rightSelectionSegmentReturnsSO = new PNLAndWhatIfSO(betSegmentsSO.rightSegment);

const cardSO = new CardSO();

const sportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO();

const firstAvBFixtureSO = new AvBFixtureSO(sportsbookExpandableLegCardGroupSO.cards[0]);
const firstBetSelectionDetailsSO = new BetSelectionDetailsSO(sportsbookExpandableLegCardGroupSO.cards[0]);
const firstBetSelectionDetailsOddsSO = new OddsSO(firstBetSelectionDetailsSO.element);

const secondAvBFixtureSO = new AvBFixtureSO(sportsbookExpandableLegCardGroupSO.cards[1]);
const secondBetSelectionDetailsSO = new BetSelectionDetailsSO(sportsbookExpandableLegCardGroupSO.cards[1]);
const secondBetSelectionDetailsOddsSO = new OddsSO(secondBetSelectionDetailsSO.element);

const thirdAvBFixtureSO = new AvBFixtureSO(sportsbookExpandableLegCardGroupSO.cards[2]);
const thirdBetSelectionDetailsSO = new BetSelectionDetailsSO(sportsbookExpandableLegCardGroupSO.cards[2]);
const thirdBetSelectionDetailsOddsSO = new OddsSO(thirdBetSelectionDetailsSO.element);

const betInfoSO = new BetInfoSO();

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
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Newcastle v Brighton",
                  eventMarketDescription: "Match Odds 90",
                  marketType: "MATCH_ODDS_90",
                  selectionName: "Newcastle",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
        },
        {
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

          footballFixture: {
            homeName: "Sevilla",
            awayName: "Juventus",
            scheduledAt: "2023-05-18T19:00:00.000Z",
          },
        },
        {
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.11),
                  originalPrice: buildPrice(1.11),
                  eventDescription: "Az Alkmaar v West Ham",
                  eventMarketDescription: "Alternative Handicaps",
                  selectionName: "Az Alkmaar",
                  handicap: 2,
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Az Alkmaar",
            awayName: "West Ham",
            scheduledAt: "2023-05-18T19:00:00.000Z",
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

describe("My bets - SBK Multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
    await browseToMyBets(SBK_MULTIPLE_BET_MOCK);
  });

  describe("When the user has a multiple bet with 3 different events (one in a handicap market)", () => {
    it("[PRPI-2588] should display the title header with 'Treble @ 5.2'", async () => {
      expect(await sbkBetPanelSO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("Treble @ 5.2");
    });

    it("[PRPI-2589] should display the supportingText with 'Newcastle | Sevilla | Az Alkmaar +2'", async () => {
      expect(await sbkBetPanelSO.sbkBetPanelSupportingText.getText()).toEqual("Newcastle | Sevilla | Az Alkmaar +2");
    });

    it("[PRPI-2590] should display the stake value with '$0.10'", async () => {
      expect(await midSelectionSegmentSO.odds.getText()).toEqual("$0.10");
    });

    it("[PRPI-2591] should display the returns value with '$0.52'", async () => {
      expect(await rightSelectionSegmentReturnsSO.pnl.getText()).toEqual("$0.52");
    });

    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        await swipeUp();
        await browser.waitUntilDisplayed(betInfoSO.element);
      });

      it("[PRPI-2592] should display 3 sportsbook bet leg cards groups", async () => {
        // (3) sportsbook bet leg cards groups + (1) bet info
        expect(await sportsbookExpandableLegCardGroupSO.cards.length).toEqual(4);
      });

      // 1st bet leg card group
      describe("and on first card group", () => {
        it("[PRPI-2593] should display the scoreboard", async () => {
          expect(await firstAvBFixtureSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2594] should display the bet selection details", async () => {
          expect(await firstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2595] should display the selection name with 'Newcastle'", async () => {
          expect(await firstBetSelectionDetailsSO.title.getText()).toEqual("Newcastle");
        });

        it("[PRPI-2596] should display the market name with 'Match Odds 90'", async () => {
          expect(await firstBetSelectionDetailsSO.subtitle.getText()).toEqual("Match Odds 90");
        });

        it("[PRPI-2597] should display the Ninety minute icon", async () => {
          expect(await firstBetSelectionDetailsSO.icon90Min.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2598] should display the odds value with '@ 1.95'", async () => {
          expect(await firstBetSelectionDetailsOddsSO.odds.getText()).toEqual("@ 1.95");
        });
      });

      // 2nd bet leg card group
      describe("and on second card group", () => {
        it("[PRPI-2599] should display the scoreboard", async () => {
          expect(await secondAvBFixtureSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2600] should display the bet selection details", async () => {
          expect(await secondBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2601] should display the selection name with 'Sevilla'", async () => {
          expect(await secondBetSelectionDetailsSO.title.getText()).toEqual("Sevilla");
        });

        it("[PRPI-2602] should display the market name with 'Match Odds'", async () => {
          expect(await secondBetSelectionDetailsSO.subtitle.getText()).toEqual("Match Odds");
        });

        it("[PRPI-2603] should display the odds value with '@ 2.4'", async () => {
          expect(await secondBetSelectionDetailsOddsSO.odds.getText()).toEqual("@ 2.4");
        });
      });

      // 3rd bet leg card group
      describe("and on third card group", () => {
        it("[PRPI-2604] should display the scoreboard", async () => {
          expect(await thirdAvBFixtureSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2605] should display the bet selection details", async () => {
          expect(await thirdBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-2606] should display the selection name with 'Az Alkmaar +2'", async () => {
          expect(await thirdBetSelectionDetailsSO.title.getText()).toEqual("Az Alkmaar +2");
        });

        it("[PRPI-2607] should display the market name with 'Alternative Handicaps'", async () => {
          expect(await thirdBetSelectionDetailsSO.subtitle.getText()).toEqual("Alternative Handicaps");
        });

        it("[PRPI-2608] should display the odds value with '@ 1.11'", async () => {
          expect(await thirdBetSelectionDetailsOddsSO.odds.getText()).toEqual("@ 1.11");
        });
      });

      it("[PRPI-2609] should display the bet info", async () => {
        expect(await betInfoSO.element.isDisplayed()).toEqual(true);
        expect(await betInfoSO.infoItems.length).toEqual(2);
      });
    });
  });
});
