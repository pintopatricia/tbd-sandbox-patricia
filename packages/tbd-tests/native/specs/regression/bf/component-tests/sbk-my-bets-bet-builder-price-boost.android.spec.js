const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  BottomBarSO,
  BetSegmentsSO,
  CardSO,
  PNLAndWhatIfSO,
  SportsbookBetPanelSO,
  InfoLabelSO,
  TabsGroupSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const betSegmentsSO = new BetSegmentsSO(myBetsSO.betCardGroups[0]);
const rightSelectionSegmentReturnsSO = new PNLAndWhatIfSO(betSegmentsSO.rightSegment);
const cardSO = new CardSO();
const tabsSO = new TabsGroupSO();
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const infoLabelSO = new InfoLabelSO();

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

let firstLoad = true;
const browseToMyBets = async (MOCK, { selectedTab = "Open" } = {}) => {
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  if (firstLoad) {
    firstLoad = false;

    await startApp("home", { pullToRefresh: true });
    await browser.waitUntilClickableNative(BottomBarSO.myBets);
    await BottomBarSO.myBets.click();
  } else {
    const tabs = ["Open", "Settled"];
    const isTabSelected = (await tabsSO.selectedTab.getText()) === selectedTab;

    if (!isTabSelected) {
      await tabsSO.tabButtons[tabs.indexOf(selectedTab)].click();
    }

    await swipeDownElementFullscreen(sbkBetPanelSO.element);
  }

  await browser.waitUntilDisplayed(cardSO.element);
};

describe("My Bets - Open bet and settled bet with price boost applied", () => {
  describe("Given I'm on My bets on Open tab with a multiple with price boost applied", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
      await browseToMyBets(SBK_OPEN_MULTIPLE_BET_WITH_ODDS_BOOST_MOCK);
    });

    it("[PRPI-2570] then the bet builder is displayed with the new total returns", async () => {
      expect(await rightSelectionSegmentReturnsSO.pnl.getText()).toEqual("$0.52");
      expect(await rightSelectionSegmentReturnsSO.previousPnl.getText()).toEqual("$0.21");
    });

    it("[PRPI-2571] then the bet builder is displayed with the boost label applied", async () => {
      expect(await infoLabelSO.icon.isDisplayed()).toEqual(true);
      expect(await infoLabelSO.label.getText()).toEqual("Bet Boost Applied");
    });
  });

  describe("Given I'm on My bets on Settled tab with a multiple with price boost applied", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_SETTLED_MULTIPLE_BET_WITH_ODDS_BOOST_MOCK, { selectedTab: "Settled" });
    });

    it("[PRPI-2572] then the bet builder is displayed with the new total returns", async () => {
      expect(await rightSelectionSegmentReturnsSO.pnl.getText()).toEqual("$0.52");
      expect(await rightSelectionSegmentReturnsSO.previousPnl.getText()).toEqual("$0.21");
    });

    it("[PRPI-2573] then the bet builder is displayed with the boost label applied", async () => {
      expect(await infoLabelSO.icon.isDisplayed()).toEqual(true);
      expect(await infoLabelSO.label.getText()).toEqual("Bet Boost Applied");
    });
  });
});
