const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");

const {
  getMyBetsLayout,
  getAppContext,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getBlhResponse } = require("@ppb/tbd-shared/mocks/blh/blh.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const SportsbookBetLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.native.so");

const { startApp, openUrl } = require("../../../../helpers/urls");

const MockService = require("../../../../mock-essentials/mocking-service");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");

const {
  MyBetsScreenSO,
  SportsbookBetPanelSO,
  CardSO,
  BetSelectionDetailsSO,
  StatusLabelSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const betStatusLabelSO = new StatusLabelSO(sbkBetPanelSO.statusLabel);

const cardSO = new CardSO();

const sportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO();

const firstSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[0]);
const secondSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[1]);
const thirdSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[2]);

const firstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardGroupSO.cards[0]);
const firstLegStatusLabelSO = new StatusLabelSO(firstBetSelectionDetailsSO.element);

const secondBetSelectionDetailsSO = new BetSelectionDetailsSO(secondSportsbookBetLegCardGroupSO.cards[0]);
const secondLegStatusLabelSO = new StatusLabelSO(secondBetSelectionDetailsSO.element);

const thirdBetSelectionDetailsSO = new BetSelectionDetailsSO(thirdSportsbookBetLegCardGroupSO.cards[0]);
const thirdLegStatusLabelSO = new StatusLabelSO(thirdBetSelectionDetailsSO.element);

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

          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
        },
        {
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

          footballFixture: {
            homeName: "Sevilla",
            awayName: "Juventus",
            scheduledAt: "2023-05-18T19:00:00.000Z",
          },
        },
        {
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

          footballFixture: {
            homeName: "Porto",
            awayName: "Caide",
            scheduledAt: "2023-05-18T18:30:00.000Z",
          },
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

const urls = ["mybets/open/mb-6f70656e", "mybets/settled/mb-736574746c6564"];
const HOME_VIEW_LINKS = getStartViewLinks(urls);

describe("My Bets Page - Win Lose Void", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("When the user places a multiple bet on Football Match Odds markets", () => {
    describe("and then the 1st leg was resulted by FBR as 'WON' and the BLH is retrieving the 1st leg as a 'POTENTIAL' 'WIN'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getAppContext({
            products: ["SPORTSBOOK"],
            throttles: {
              MY_BETS_WIN_LOSE_VOID: { isActive: true },
              NEW_SCA_POLLER: { isActive: true },
            },
          }),
        );

        await mockService.mockHttpRequest(getMyBetsLayout(SBK_MULTIPLE_BET_MOCK));

        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));

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

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });

        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
        await browser.waitUntilEquals(firstLegStatusLabelSO.text, "Won");
      });

      it("[PRPI-3770] should be displayed the 'Winning' label on sportsbook bet panel", async () => {
        expect(await betStatusLabelSO.text.getText()).toEqual("Winning");
      });

      it("[PRPI-3771] should be displayed the 'Won' label on 1st sportsbook bet leg panel", async () => {
        expect(await firstLegStatusLabelSO.text.getText()).toEqual("Won");
      });

      it("[PRPI-3772] should not be displayed the status label on 2nd and 3rd sportsbook bet leg panels", async () => {
        expect(await secondLegStatusLabelSO.text.isDisplayed()).toEqual(false);
        expect(await thirdLegStatusLabelSO.text.isDisplayed()).toEqual(false);
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
                  { legResult: "PENDING", legResultType: "UNKNOWN" },
                  { legResult: "PENDING", legResultType: "UNKNOWN" },
                ],
              }),
            ),
          );

          await browser.waitUntilEquals(betStatusLabelSO.text, "Losing");
        });

        it("[PRPI-3773] should be displayed the 'Losing' label on sportsbook bet panel", async () => {
          expect(await betStatusLabelSO.text.getText()).toEqual("Losing");
        });

        it("[PRPI-3773] should not be displayed the status label on 2nd and 3rd sportsbook bet leg panels", async () => {
          expect(await secondLegStatusLabelSO.text.isDisplayed()).toEqual(false);
          expect(await thirdLegStatusLabelSO.text.isDisplayed()).toEqual(false);
        });

        describe("and then BLH returns 'CONFIRMED' and 'LOST' on the 2nd leg", () => {
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

            await browser.waitUntilEquals(secondLegStatusLabelSO.text, "Lost");
          });

          it("[PRPI-3773] should be displayed the 'Losing' label on sportsbook bet panel", async () => {
            expect(await betStatusLabelSO.text.getText()).toEqual("Losing");
          });

          it("[PRPI-3773] should be displayed the 'Lost' label on 2nd sportsbook bet leg panel", async () => {
            expect(await secondLegStatusLabelSO.text.getText()).toEqual("Lost");
          });
        });
      });
    });
  });
  describe("When the user has a settled bet on Football Match Odds markets", () => {
    describe("and the bet was resulted by BFF as 'SETTLED'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(SBK_SINGLE_FOOTBALL_SETTLED_MOCK));

        await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

        await browser.waitUntilDisplayed(cardSO.header);
        await browser.waitUntilNotDisplayed(betStatusLabelSO.element, "Bet Status Label element still displayed");
      });

      it("[PRPI-3774] should not be displayed any Bet Status Label", async () => {
        expect(await betStatusLabelSO.element.isDisplayed()).toEqual(false);
      });
    });
  });
});
