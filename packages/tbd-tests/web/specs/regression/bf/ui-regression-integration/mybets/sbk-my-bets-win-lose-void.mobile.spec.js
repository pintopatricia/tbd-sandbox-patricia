const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  CardPO,
  BetSelectionDetailsPO,
  StatusLabelPO,
} = require("../../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getBlhResponse } = require("@ppb/tbd-shared/mocks/blh/blh.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const betStatusLabelPO = new StatusLabelPO(sbkBetPanelPO.statusLabel);

const cardPO = new CardPO();

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();

const firstBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookExpandableLegCardGroupPO.cards[0]);
const firstLegStatusLabelPO = new StatusLabelPO(firstBetSelectionDetailsPO.element);

const secondBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookExpandableLegCardGroupPO.cards[1]);
const secondLegStatusLabelPO = new StatusLabelPO(secondBetSelectionDetailsPO.element);

const thirdBetSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookExpandableLegCardGroupPO.cards[2]);
const thirdLegStatusLabelPO = new StatusLabelPO(thirdBetSelectionDetailsPO.element);

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
          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
          legs: [
            {
              legNumber: 1,
              result: "WON",
              resultType: "CONFIRMED",
              parts: [
                {
                  sportId: "1",
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
              legNumber: 2,
              parts: [
                {
                  sportId: "1",
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
              legNumber: 3,
              parts: [
                {
                  sportId: "1",
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

const SBK_SINGLE_FOOTBALL_SETTLED_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    isSettled: true,
    profitAndLoss: 0.17,
    result: "SETTLED",
    resultType: "CONFIRMED",
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Porto",
            awayName: "Caide",
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
          legs: [
            {
              legNumber: 1,
              type: "SS",
              result: "WON",
              resultType: "CONFIRMED",
              parts: [
                {
                  sportId: "1",
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Porto v Caide",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Caide",
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        settledDate: "2023-04-23T09:55:41.000Z",
      },
    },
  },
]);

const getBLHMock = ({ betResult, betResultType, legs }) => ({
  betsResult: [
    {
      resultType: betResultType,
      result: betResult,
      legs: legs.map(({ legResult, legResultType }, index) => ({
        legNumber: index + 1,
        runners: [
          {
            id: index + 1,
            marketId: `924.33333333${index + 1}`,
            result: legResult,
            resultType: legResultType,
          },
        ],
      })),
    },
  ],
});

describe("My Bets Page - Win Lose Void", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("When the user places a multiple bet on Football Match Odds markets", () => {
    describe("and then the 1st leg was resulted by BFF as 'WON' and the BLH is retriving the 1st leg as a 'POTENTIAL' 'WIN'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(SBK_MULTIPLE_BET_MOCK.urn, {
            products: ["sportsbook"],
            MY_BETS_WIN_LOSE_VOID: { isActive: true },
            NEW_SCA_POLLER: { isActive: true },
            date: "2019-06-26T09:55:00.000Z",
          }),
        );

        await mockService.mockHttpRequest(getMyBetsLayout(SBK_MULTIPLE_BET_MOCK));

        await mockService.mockHttpRequest(
          getBlhResponse(
            getBLHMock({
              betResult: "WIN",
              betResultType: "POTENTIAL",
              legs: [
                { legResult: "WIN", legResultType: "POTENTIAL" },
                { legResult: "PENDING", legResultType: "UNKNOWN" },
                { legResult: "PENDING", legResultType: "UNKNOWN" },
              ],
            }),
          ),
        );

        await browser.url(routes.getMyBetsViewUrl("open"));
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms  debounce when new subscriptions are added
        await browser.waitUntilEquals(firstLegStatusLabelPO.text, "Won");
        await browser.waitUntilEquals(betStatusLabelPO.text, "Winning");
      });

      it("[PRPI-6921] should be displayed the 'Winning' label on sportsbook bet panel", async () => {
        expect(await betStatusLabelPO.text.getText()).toEqual("Winning");
      });

      it("[PRPI-6922] should be displayed the 'Won' label on 1st sportsbook bet leg panel", async () => {
        expect(await firstLegStatusLabelPO.text.getText()).toEqual("Won");
      });

      it("[PRPI-6923] should not be displayed the status label on 2nd and 3rd sportsbook bet leg panels", async () => {
        expect(await secondLegStatusLabelPO.text.isDisplayed()).toEqual(false);
        expect(await thirdLegStatusLabelPO.text.isDisplayed()).toEqual(false);
      });

      describe("and then the 2nd leg event result is updated to 'Losing' and bet result to 'LOST'", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getBlhResponse(
              getBLHMock({
                betResult: "LOSE",
                betResultType: "POTENTIAL",
                legs: [
                  { legResult: "WIN", legResultType: "POTENTIAL" },
                  { legResult: "LOSE", legResultType: "POTENTIAL" },
                  { legResult: "PENDING", legResultType: "UNKNOWN" },
                ],
              }),
            ),
          );

          await browser.tickFakeClock("00:00:30");
          await browser.waitUntilEquals(betStatusLabelPO.text, "Losing");
        });

        it("[PRPI-6924] should be displayed the 'Losing' label on sportsbook bet panel", async () => {
          expect(await betStatusLabelPO.text.getText()).toEqual("Losing");
        });

        it("[PRPI-6924] should not be displayed the status label on 2nd and 3rd sportsbook bet leg panels", async () => {
          expect(await secondLegStatusLabelPO.text.isDisplayed()).toEqual(false);
          expect(await thirdLegStatusLabelPO.text.isDisplayed()).toEqual(false);
        });

        describe("and then the 2nd leg is confirmed and 'LOST' by BLH", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getBlhResponse(
                getBLHMock({
                  betResult: "LOSE",
                  betResultType: "POTENTIAL",
                  legs: [
                    { legResult: "WIN", legResultType: "POTENTIAL" },
                    { legResult: "LOSE", legResultType: "CONFIRMED" },
                    { legResult: "PENDING", legResultType: "UNKNOWN" },
                  ],
                }),
              ),
            );
            await browser.tickFakeClock("00:00:30");
            await browser.waitUntilEquals(secondLegStatusLabelPO.text, "Lost");
          });

          it("[PRPI-6924] should be displayed the 'Losing' label on sportsbook bet panel", async () => {
            expect(await betStatusLabelPO.text.getText()).toEqual("Losing");
          });

          it("[PRPI-6924] should be displayed the 'Lost' label on 2nd sportsbook bet leg panel", async () => {
            expect(await secondLegStatusLabelPO.text.getText()).toEqual("Lost");
          });
        });
      });
    });
  });
  describe("When the user has a settled bet on Football Match Odds markets", () => {
    describe("and the bet was resulted by BFF as 'SETTLED'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(SBK_SINGLE_FOOTBALL_SETTLED_MOCK.urn, {
            products: ["sportsbook"],
            MY_BETS_WIN_LOSE_VOID: { isActive: true },
            NEW_SCA_POLLER: { isActive: true },
            date: "2019-06-26T09:55:00.000Z",
          }),
        );

        await mockService.mockHttpRequest(getMyBetsLayout(SBK_SINGLE_FOOTBALL_SETTLED_MOCK));

        await browser.url(routes.getMyBetsViewUrl("settled"));
        await browser.waitUntilDisplayed(cardPO.header);
        await browser.waitUntilNotDisplayed(betStatusLabelPO.element, "Bet Status Label element still displayed");
      });

      it("[PRPI-3774] should not be displayed any Bet Status Label", async () => {
        expect(await betStatusLabelPO.element.isDisplayed()).toEqual(false);
      });
    });
  });
});
