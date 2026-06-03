const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");
const { swipeFromElementToElement } = require("../../../../helpers/gestures");

const { MyBetsScreenSO, BottomBarSO, FooterSO, SportsbookBetPanelSO, CardSO } = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const cardSO = new CardSO();
const firstSbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const secondSbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[1]);
const thirdSbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[2]);
const fourthSbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[3]);
const footerSO = new FooterSO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_BET_MOCK1 = getMyBetsSBKViewMock(
  [
    {
      betType: "SGL",
      isOpen: true,
      bonus: 0.1,
      currentSize: 0.1,
      profitAndLoss: 0.16,
      edges: {
        legCardGroups: [
          {
            raceDetails: {
              showMeetingInfo: true,
              raceName: "6f Mdn Stks",
              meetingName: "Southwell 11th May",
              venue: "Southwell",
            },
            legs: [
              {
                parts: [
                  {
                    price: buildPrice(2.11),
                    originalPrice: buildPrice(2.11),
                    selectionName: "Spezia",
                  },
                ],
              },
            ],
          },
        ],

        betInfo: {
          betReceiptId: "O/11037374/0002965",
          placedDate: "2023-04-21T09:45:41.000Z",
          regulatorBetId: "bc000000001c17979f05",
        },
      },
    },
    {
      betType: "SGL",
      isOpen: true,
      bonus: 0.1,
      currentSize: 0.1,
      profitAndLoss: 0.16,
      edges: {
        legCardGroups: [
          {
            raceDetails: {
              showMeetingInfo: true,
              raceName: "6f Mdn Stks",
              meetingName: "Southwell 11th May",
              venue: "Southwell",
            },
            legs: [
              {
                parts: [
                  {
                    price: buildPrice(2.11),
                    originalPrice: buildPrice(2.11),
                    selectionName: "Empoli",
                  },
                ],
              },
            ],
          },
        ],

        betInfo: {
          betReceiptId: "O/11037374/0002965",
          placedDate: "2023-04-21T09:45:41.000Z",
          regulatorBetId: "bc000000001c17979f05",
        },
      },
    },
    {
      betType: "TBL",
      isOpen: true,
      isACCA: true,
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
                    selectionName: "Az Alkmaar",
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
  ],

  { hasNextPage: true },
);

const SBK_BET_MOCK2 = getMyBetsSBKViewMock(
  [
    {
      betId: "222222",
      betType: "SGL",
      isOpen: true,
      bonus: 0.1,
      currentSize: 0.1,
      profitAndLoss: 0.16,
      edges: {
        legCardGroups: [
          {
            raceDetails: {
              showMeetingInfo: true,
              raceName: "6f Mdn Stks",
              meetingName: "Southwell 11th May",
              venue: "Southwell",
            },
            legs: [
              {
                parts: [
                  {
                    price: buildPrice(1.11),
                    originalPrice: buildPrice(1.11),
                    selectionName: "Benfica",
                  },
                ],
              },
            ],
          },
        ],

        betInfo: {
          betReceiptId: "O/11037374/0002965",
          placedDate: "2023-04-21T09:45:41.000Z",
          regulatorBetId: "bc000000001c17979f05",
        },
      },
    },
  ],

  { hasFooter: true },
);

describe("My Bets Page - SBK Pagination", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMyBetsLayout(SBK_BET_MOCK1));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await startApp("home");
    await browser.waitUntilClickableNative(BottomBarSO.myBets);
    await BottomBarSO.myBets.click();
    await browser.waitUntilDisplayed(cardSO.element);
  });

  describe("when the user opens the my bets page and has 4 opened Sportbook bets", () => {
    it("[PRPI-2610] should show only 3 bet cards", async () => {
      expect(await myBetsSO.betCardGroups.length).toBe(3);
    });

    it("[PRPI-2611] the 3 bet cards shown should be the first three", async () => {
      expect(await firstSbkBetPanelSO.sbkBetPanelSupportingText.getText()).toEqual("Spezia");
      expect(await secondSbkBetPanelSO.sbkBetPanelSupportingText.getText()).toEqual("Empoli");
      expect(await thirdSbkBetPanelSO.panelTitle.getText()).toEqual("Treble");
    });

    describe("and when the user scrolls the page", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(SBK_BET_MOCK2));
        await swipeFromElementToElement(secondSbkBetPanelSO.panelTitle, firstSbkBetPanelSO.panelTitle);
        await browser.waitUntilEquals(fourthSbkBetPanelSO.sbkBetPanelSupportingText, "Benfica");
      });

      it("[PRPI-2612] should have 4 bet cards", async () => {
        expect(await myBetsSO.betCardGroups.length).toBe(4);
      });

      it("[PRPI-2613] should be displayed the last card with the selection 'Benfica'", async () => {
        expect(await fourthSbkBetPanelSO.sbkBetPanelSupportingText.getText()).toEqual("Benfica");
      });

      describe("and when the user scrolls again the page", () => {
        beforeAll(async () => {
          await swipeFromElementToElement(fourthSbkBetPanelSO.panelTitle, thirdSbkBetPanelSO.panelTitle);
          await browser.waitUntilDisplayed(footerSO.element);
        });

        it("[PRPI-2614] the footer should be displayed", async () => {
          expect(await footerSO.element.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
