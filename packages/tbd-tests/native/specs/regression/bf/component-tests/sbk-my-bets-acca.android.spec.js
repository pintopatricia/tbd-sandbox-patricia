const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const {
  MyBetsScreenSO,
  BottomBarSO,
  SportsbookBetPanelSO,
  CardSO,
  InfoLabelSO,
  StatusLabelSO,
  TabsGroupSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const cardSO = new CardSO();
const infoLabelSO = new InfoLabelSO();
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const betPanelStatusLabelSO = new StatusLabelSO(sbkBetPanelSO.element);
const tabsSO = new TabsGroupSO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const trebleMock = ({ betId, isOpen, betResult, leg1Status, leg2Status, leg3Status }) =>
  getMyBetsSBKViewMock([
    {
      betId,
      betType: "TBL",
      isOpen,
      isSettled: !isOpen,
      isACCA: true,
      result: betResult,
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
                result: leg1Status,
                parts: [
                  {
                    price: buildPrice(1.95),
                    originalPrice: buildPrice(1.95),
                    eventDescription: "Newcastle v Brighton",
                    eventMarketDescription: "Match Odds",
                    selectionName: "Newcastle",
                    startTime: "2023-05-18T18:30:00.000Z",
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
                result: leg2Status,
                parts: [
                  {
                    price: buildPrice(2.4),
                    originalPrice: buildPrice(2.4),
                    eventDescription: "Sevilla v Juventus",
                    eventMarketDescription: "Match Odds",
                    selectionName: "Sevilla",
                    startTime: "2023-05-18T19:00:00.000Z",
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
                result: leg3Status,
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

describe("My Bets - ACCA Insurance Bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
  });

  describe("when the user has one opened bet with ACCA Insurance", () => {
    describe("and no leg has 'Lost' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1000",
            isOpen: true,
            betResult: "WON",
            leg1Status: "WON",
            leg2Status: "WON",
            leg3Status: "WON",
          }),
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Won");
        await browser.waitUntilEquals(infoLabelSO.label, "ACCA Edge Applied");
        await browser.waitUntilEquals(sbkBetPanelSO.panelTitle, "Treble");
      });

      it("[PRPI-2537] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelSO.label.getText()).toBe("ACCA Edge Applied");
      });

      it("[PRPI-2538] should not display the odds value on title header", async () => {
        expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("Treble");
      });
    });

    describe("and one leg has 'Void' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1000",
            isOpen: true,
            betResult: "WON",
            leg1Status: "WON",
            leg2Status: "VOID",
            leg3Status: "WON",
          }),
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Won");
        await browser.waitUntilNotDisplayed(infoLabelSO.element);
      });

      it("[PRPI-2539] should not display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelSO.element.isDisplayed()).toBe(false);
      });
    });

    describe("and one leg has 'Lost' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1001",
            isOpen: true,
            betResult: "LOST",
            leg1Status: "LOST",
            leg2Status: "WON",
            leg3Status: "WON",
          }),
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Lost");
        await browser.waitUntilEquals(infoLabelSO.label, "ACCA Edge Applied");
      });

      it("[PRPI-2540] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelSO.label.getText()).toBe("ACCA Edge Applied");
      });
    });

    describe("and more than one leg has 'Lost' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1002",
            isOpen: true,
            betResult: "PLACED",
            leg1Status: "LOST",
            leg2Status: "LOST",
            leg3Status: "PLACED",
          }),
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Placed");
        await browser.waitUntilEquals(infoLabelSO.label, "ACCA Edge Applied");
      });

      it("[PRPI-2541] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelSO.label.getText()).toBe("ACCA Edge Applied");
      });
    });
  });

  describe("when the user has one settled bet with ACCA Insurance", () => {
    describe("and no leg has 'Lost' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1003",
            isOpen: false,
            betResult: "WON",
            leg1Status: "WON",
            leg2Status: "WON",
            leg3Status: "WON",
          }),
          { selectedTab: "Settled" },
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Won");
        await browser.waitUntilEquals(infoLabelSO.label, "ACCA Edge Applied");
        await browser.waitUntilEquals(sbkBetPanelSO.panelTitle, "Treble");
      });

      it("[PRPI-2542] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelSO.label.getText()).toEqual("ACCA Edge Applied");
      });

      it("[PRPI-2543] should not display the odds value on title header", async () => {
        expect(await sbkBetPanelSO.panelTitle.getText()).toEqual("Treble");
      });
    });

    describe("and one leg has 'Void' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1003",
            isOpen: false,
            betResult: "WON",
            leg1Status: "VOID",
            leg2Status: "WON",
            leg3Status: "WON",
          }),
          { selectedTab: "Settled" },
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Won");
        await browser.waitUntilNotDisplayed(infoLabelSO.element);
      });

      it("[PRPI-2544] should not display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelSO.element.isDisplayed()).toBe(false);
      });
    });

    describe("and one leg has 'Lost' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1004",
            isOpen: false,
            betResult: "LOST",
            leg1Status: "LOST",
            leg2Status: "WON",
            leg3Status: "WON",
          }),
          { selectedTab: "Settled" },
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Lost");
        await browser.waitUntilEquals(infoLabelSO.label, "You got your stake back as cash");
      });

      it("[PRPI-2545] should display the 'You got your stake back as cash' signpost", async () => {
        expect(await infoLabelSO.label.getText()).toBe("You got your stake back as cash");
      });
    });

    describe("and we have one leg with 'Lost' and another one with 'Void' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1004",
            isOpen: false,
            betResult: "LOST",
            leg1Status: "LOST",
            leg2Status: "VOID",
            leg3Status: "WON",
          }),
          { selectedTab: "Settled" },
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Lost");
        await browser.waitUntilNotDisplayed(infoLabelSO.element);
      });

      it("[PRPI-2546] should not display the 'You got your stake back as cash' signpost", async () => {
        expect(await infoLabelSO.element.isDisplayed()).toBe(false);
      });
    });

    describe("and more than one leg has 'Lost' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1005",
            isOpen: false,
            betResult: "CASHED_OUT",
            leg1Status: "LOST",
            leg2Status: "LOST",
            leg3Status: "LOST",
          }),
          { selectedTab: "Settled" },
        );
        await browser.waitUntilEquals(betPanelStatusLabelSO.text, "Cashed Out");
        await browser.waitUntilEquals(infoLabelSO.label, "ACCA Edge");
      });

      it("[PRPI-2547] should display the 'ACCA Edge' signpost", async () => {
        expect(await infoLabelSO.label.getText()).toBe("ACCA Edge");
      });
    });
  });
});
