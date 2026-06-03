const { MyBetsPagePO, FooterPO, SportsbookBetPanelPO, CardPO } = require("../../../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const cardPO = new CardPO();
const firstSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const secondSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[1]);
const thirdSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[2]);
const fourthSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[3]);
const fifthSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[4]);
const footerPO = new FooterPO();

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
    {
      betId: "333333",
      betType: "SGL",
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
                    price: buildPrice(1.61),
                    originalPrice: buildPrice(1.61),
                    selectionName: "Venezia",
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
    await mockService.mockHttpRequest(await getIndexHTML(SBK_BET_MOCK1.urn));
    await mockService.mockHttpRequest(getMyBetsLayout(SBK_BET_MOCK1));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await browser.url(routes.getMyBetsViewUrl("open"));
    await browser.waitUntilInViewport(cardPO.element);
  });

  describe("when the user opens the my bets page and has 4 opened Sportbook bets", () => {
    it("[PRPI-8282] should show only 3 bet cards", async () => {
      expect(await myBetsPO.betCardGroups.length).toBe(3);
    });

    it("[PRPI-8283] the 3 bet cards shown should be the first three", async () => {
      expect(await firstSbkBetPanelPO.panelSupportingText.getText()).toEqual("Spezia");
      expect(await secondSbkBetPanelPO.panelSupportingText.getText()).toEqual("Empoli");
      expect(await thirdSbkBetPanelPO.panelTitle.getText()).toEqual("Treble");
    });

    describe("and when the user scrolls the page", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(SBK_BET_MOCK2));
        await thirdSbkBetPanelPO.element.scrollIntoView({ block: "start" });
        await browser.waitUntilEquals(fifthSbkBetPanelPO.panelSupportingText, "Venezia");
      });

      it("[PRPI-8284] should have 5 bet cards", async () => {
        expect(await myBetsPO.betCardGroups.length).toBe(5);
      });

      it("[PRPI-8285] the 5 bet cards shown should be the first three and the two new ones", async () => {
        expect(await firstSbkBetPanelPO.panelSupportingText.getText()).toEqual("Spezia");
        expect(await secondSbkBetPanelPO.panelSupportingText.getText()).toEqual("Empoli");
        expect(await thirdSbkBetPanelPO.panelTitle.getText()).toEqual("Treble");
        expect(await fourthSbkBetPanelPO.panelSupportingText.getText()).toEqual("Benfica");
        expect(await fifthSbkBetPanelPO.panelSupportingText.getText()).toEqual("Venezia");
      });

      it("[PRPI-8286] the footer should be displayed", async () => {
        await footerPO.element.waitForDisplayed();
        expect(await footerPO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
