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
const firstSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[0]);
const secondSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[1]);

// 1st bet leg card group
const firstEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardGroupPO.cards[0]);
const firstEventFirstBetSelectionDetailsOddsPO = new OddsPO(firstEventFirstBetSelectionDetailsPO.element);
const firstEventSecondBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardGroupPO.cards[1]);
const firstEventSecondBetSelectionDetailsOddsPO = new OddsPO(firstEventSecondBetSelectionDetailsPO.element);
const firstEventThirdBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardGroupPO.cards[2]);
const firstEventThirdBetSelectionDetailsOddsPO = new OddsPO(firstEventThirdBetSelectionDetailsPO.element);
const firstEventAvBFixturePO = new AvBFixturePO(firstSportsbookBetLegCardGroupPO.cards[3]);

// 2nd bet leg card group
const secondEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(secondSportsbookBetLegCardGroupPO.cards[0]);
const secondEventFirstBetSelectionDetailsOddsPO = new OddsPO(secondEventFirstBetSelectionDetailsPO.element);
const secondEventSecondBetSelectionDetailsPO = new BetSelectionDetailsPO(secondSportsbookBetLegCardGroupPO.cards[1]);
const secondEventSecondBetSelectionDetailsOddsPO = new OddsPO(secondEventSecondBetSelectionDetailsPO.element);
const secondEventAvBFixturePO = new AvBFixturePO(secondSportsbookBetLegCardGroupPO.cards[2]);

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
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn, { products: ["sportsbook"] }));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My bets - Multi Bet Builder", () => {
  beforeAll(async () => {
    await browseToMyBets(SBK_MULTIPLE_BET_BUILDER_MOCK);
  });

  describe("When the user has a multi bet builder in 2 distinct events", () => {
    it("[PRPI-8217] should display the title header with '5 Fold - Bet Builder Multis @ 15.4'", async () => {
      expect(await sbkBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
      expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("5 Fold - Bet Builder Multis @ 15.4");
    });

    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await betInfoPO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(betInfoPO.element);
      });

      it("[PRPI-8218] should display 2 sportsbook bet leg card groups", async () => {
        // (2) sportsbook bet leg cards groups + (1) bet info
        expect(await sportsbookExpandableLegCardGroupPO.cards.length).toEqual(3);
      });

      // 1st bet leg card group
      describe("and on first bet leg card group", () => {
        it("[PRPI-8219] should display 1 scoreboard", async () => {
          expect(await firstEventAvBFixturePO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8220] should display 3 bet legs", async () => {
          expect(await firstEventFirstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
          expect(await firstEventSecondBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
          expect(await firstEventThirdBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });

        // 1st Bet Leg
        describe("and on first bet leg", () => {
          it("[PRPI-8221] should display the selection name with 'Sporting Lisbon'", async () => {
            expect(await firstEventFirstBetSelectionDetailsPO.title.getText()).toEqual("Sporting Lisbon");
          });

          it("[PRPI-8222] should display the market name with 'Match Odds'", async () => {
            expect(await firstEventFirstBetSelectionDetailsPO.subtitle.getText()).toEqual("Match Odds");
          });

          it("[PRPI-8223] should not display the odds value", async () => {
            expect(await firstEventFirstBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
          });
        });

        // 2nd Bet Leg
        describe("and on second bet leg", () => {
          it("[PRPI-8224] should display the selection name with 'Yes'", async () => {
            expect(await firstEventSecondBetSelectionDetailsPO.title.getText()).toEqual("Yes");
          });

          it("[PRPI-8225] should display the market name with 'Both Teams To Score'", async () => {
            expect(await firstEventSecondBetSelectionDetailsPO.subtitle.getText()).toEqual("Both Teams To Score");
          });

          it("[PRPI-8226] should not display the odds value", async () => {
            expect(await firstEventSecondBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
          });
        });

        // 3rd Bet Leg
        describe("and on third bet leg", () => {
          it("[PRPI-8227] should display the selection name with 'Pote'", async () => {
            expect(await firstEventThirdBetSelectionDetailsPO.title.getText()).toEqual("Pote");
          });

          it("[PRPI-8228] should display the market name with 'Anytime Goalscorer'", async () => {
            expect(await firstEventThirdBetSelectionDetailsPO.subtitle.getText()).toEqual("Anytime Goalscorer");
          });

          it("[PRPI-8229] should not display the odds value", async () => {
            expect(await firstEventThirdBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
          });
        });
      });

      // 2nd bet leg card group
      describe("and on second bet leg card group", () => {
        it("[PRPI-8230] should display 1 scoreboard", async () => {
          expect(await secondEventAvBFixturePO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8231] should display 2 bet legs", async () => {
          expect(await secondEventFirstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
          expect(await secondEventSecondBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });

        // 1st Bet Leg
        describe("and on first bet leg", () => {
          it("[PRPI-8232] should display the selection name with 'Maritimo'", async () => {
            expect(await secondEventFirstBetSelectionDetailsPO.title.getText()).toEqual("Maritimo");
          });

          it("[PRPI-8233] should display the market name with 'Match Odds'", async () => {
            expect(await secondEventFirstBetSelectionDetailsPO.subtitle.getText()).toEqual("Match Odds");
          });

          it("[PRPI-8234] should not display the odds value", async () => {
            expect(await secondEventFirstBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
          });
        });

        // 2nd Bet Leg
        describe("and on second bet leg", () => {
          it("[PRPI-8235] should display the selection name with 'No'", async () => {
            expect(await secondEventSecondBetSelectionDetailsPO.title.getText()).toEqual("No");
          });

          it("[PRPI-8236] should display the market name with 'Both Teams To Score First Half'", async () => {
            expect(await secondEventSecondBetSelectionDetailsPO.subtitle.getText()).toEqual(
              "Both Teams To Score First Half",
            );
          });

          it("[PRPI-8237] should not display the odds value", async () => {
            expect(await secondEventSecondBetSelectionDetailsOddsPO.value.isDisplayed()).toEqual(false);
          });
        });
      });

      it("[PRPI-8238] should display the bet info", async () => {
        expect(await betInfoPO.element.isDisplayed()).toEqual(true);
        expect(await betInfoPO.infoItems.length).toEqual(2);
      });
    });
  });
});
