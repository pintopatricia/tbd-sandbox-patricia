const {
  MyBetsPagePO,
  CardPO,
  InfoLabelPO,
  SportsbookBetPanelPO,
  StatusLabelPO,
} = require("../../../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const cardPO = new CardPO();
const infoLabelPO = new InfoLabelPO();
const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const betPanelStatusLabelPO = new StatusLabelPO(sbkBetPanelPO.element);

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

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My Bets - ACCA Insurance Bets", () => {
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
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Won");
      });

      it("[PRPI-8206] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelPO.label.getText()).toBe("ACCA Edge Applied");
      });

      it("[PRPI-8207] should not display the odds value on title header", async () => {
        expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("Treble");
      });
    });

    describe("and one leg has 'Void' status", () => {
      beforeAll(async () => {
        await browseToMyBets(
          trebleMock({
            betId: "1000",
            isOpen: true,
            betResult: "WON",
            leg1Status: "VOID",
            leg2Status: "WON",
            leg3Status: "WON",
          }),
        );
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Won");
      });

      it("[PRPI-8208] should not display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelPO.element.isDisplayed()).toBe(false);
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
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Lost");
      });

      it("[PRPI-8209] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelPO.label.getText()).toBe("ACCA Edge Applied");
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
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Placed");
      });

      it("[PRPI-8210] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelPO.label.getText()).toBe("ACCA Edge Applied");
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
        );
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Won");
      });

      it("[PRPI-8211] should display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelPO.label.getText()).toBe("ACCA Edge Applied");
      });

      it("[PRPI-8212] should not display the odds value on title header", async () => {
        expect(await sbkBetPanelPO.panelTitle.getText()).toEqual("Treble");
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
        );
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Won");
      });

      it("[PRPI-8213] should not display the 'ACCA Edge Applied' signpost", async () => {
        expect(await infoLabelPO.element.isDisplayed()).toBe(false);
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
        );
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Lost");
      });

      it("[PRPI-8214] should display the 'You got your stake back as cash' signpost", async () => {
        expect(await infoLabelPO.label.getText()).toBe("You got your stake back as cash");
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
        );
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Lost");
      });

      it("[PRPI-8215] should not display the 'You got your stake back as cash' signpost", async () => {
        expect(await infoLabelPO.element.isDisplayed()).toBe(false);
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
        );
        await browser.waitUntilEquals(betPanelStatusLabelPO.text, "Cashed Out");
      });

      it("[PRPI-8216] should display the 'ACCA Edge' signpost", async () => {
        expect(await infoLabelPO.label.getText()).toBe("ACCA Edge");
      });
    });
  });
});
