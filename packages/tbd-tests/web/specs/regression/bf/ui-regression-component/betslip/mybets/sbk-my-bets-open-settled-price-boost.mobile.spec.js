const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { BetSegmentsPO, CardPO, InfoLabelPO, PNLAndWhatIfPO, OddsPO } = require("../../../../../../page-objects");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();
const betSegmentsPO = new BetSegmentsPO();
const betSegmentReturnsPO = new PNLAndWhatIfPO(betSegmentsPO.rightValue);
const cardPO = new CardPO();
const infoLabelPO = new InfoLabelPO();
const infoLabelOddsPO = new OddsPO(infoLabelPO.odds);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_OPEN_MULTIPLE_BET_WITH_ODDS_BOOST_MOCK = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    originalBetPrice: buildPrice(5),
    isOddsBoosted: true,
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

const SBK_SETTLED_MULTIPLE_BET_WITH_ODDS_BOOST_MOCK = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: false,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    originalBetPrice: buildPrice(5),
    isOddsBoosted: true,
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

const browseToMyBets = async (MOCK, { selectedTab = "Open" } = {}) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl(selectedTab));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My Bets - Open bet and settled bet with price boost applied", () => {
  describe("Given I'm on My bets on Open tab with a multiple with price boost applied", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_OPEN_MULTIPLE_BET_WITH_ODDS_BOOST_MOCK, { selectedTab: "Open" });
    });

    it("[PRPI-2570]then the bet builder is displayed with the new total returns", async () => {
      expect(await betSegmentReturnsPO.pnl.getText()).toEqual("$0.52");
      expect(await betSegmentReturnsPO.previousPnl.getText()).toEqual("$0.21");
    });

    it("[PRPI-5263]then the bet builder is displayed with the boost label applied and the odds", async () => {
      expect(await infoLabelPO.icon.isDisplayed()).toEqual(true);
      expect(await infoLabelPO.label.getText()).toEqual("Bet Boost Applied");
      expect(await infoLabelOddsPO.previousValue.getText()).toEqual("5");
      expect(await infoLabelOddsPO.value.getText()).toEqual("5.2");
    });
  });

  describe("Given I'm on My bets on Settled tab with a multiple with price boost applied", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SETTLED_MULTIPLE_BET_WITH_ODDS_BOOST_MOCK, { selectedTab: "Settled" });
    });

    it("[PRPI-2572]then the bet builder is displayed with the new total returns", async () => {
      expect(await betSegmentReturnsPO.pnl.getText()).toEqual("$0.52");
    });

    it("[PRPI-5264]then the bet builder is displayed with the boost label applied and the odds", async () => {
      expect(await infoLabelPO.icon.isDisplayed()).toEqual(true);
      expect(await infoLabelPO.label.getText()).toEqual("Bet Boost Applied");
      expect(await infoLabelOddsPO.previousValue.getText()).toEqual("5");
      expect(await infoLabelOddsPO.value.getText()).toEqual("5.2");
    });
  });
});
