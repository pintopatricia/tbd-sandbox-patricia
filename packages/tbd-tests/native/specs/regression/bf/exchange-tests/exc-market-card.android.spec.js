const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  MarketBlurbsSO,
  RunnerSO,
  CardSO,
  ExchangeMarketSO,
  ExchangeBetButtonSO,
  MarketStatusSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const exchangeMarketSO = new ExchangeMarketSO();
const cardSO = new CardSO();
const exchangeMarketBlurbsSO = new MarketBlurbsSO(exchangeMarketSO.blurbs);
const exchangeMarketStatusSO = new MarketStatusSO(exchangeMarketBlurbsSO.element);

const EVENT_ID = "29682729";
const MARKET_ID = "1.160337355";

const firstExchangeRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const firstExchangeBetButtonSO = new ExchangeBetButtonSO(firstExchangeRunnerSO.betButtons[0]);
const secondExchangeBetButtonSO = new ExchangeBetButtonSO(firstExchangeRunnerSO.betButtons[1]);

const BFF_MOCK = (withMarketPromo = false) => ({
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  name: "Wolves",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                },
                {
                  name: "Man Utd",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
                  selectionId: 48351,
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0` },
            ],
          },
        },
        ...(withMarketPromo && {
          marketPromo: {
            title: "market title",
            description: "market description",
            signposting: "EXTRA_PLACES",
          },
        }),
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
});

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const ERO_MOCK_POLLING = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.2, size: 150 }],
        availableToLay: [{ price: 1.3, size: 160 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.2, size: 200 }],
        availableToLay: [{ price: 2.3, size: 250 }],
      },
    ],
  },
];

const SUSPENDED_EXC_MARKET = [
  {
    state: { status: "SUSPENDED" },
    ...ERO_MOCK_POLLING[0],
  },
];

const CLOSED_EXC_MARKET = [
  {
    state: { status: "CLOSED" },
    ...ERO_MOCK_POLLING[0],
  },
];

describe("Exchange Market Card Component", () => {
  describe("When user enters event view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK(true)));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
      await browser.waitUntilEquals(cardSO.title, "Match Odds");
    });

    it("[PRPI-1794] The market title should be displayed", async () => {
      expect(await cardSO.title.getText()).toBe("Match Odds");
    });

    it("[PRPI-1795] The matched value should be displayed with correct value", async () => {
      expect(await exchangeMarketBlurbsSO.text.getText()).toBe("Matched: $6");
    });

    it("[PRPI-1796] The back and lay labels should be displayed", async () => {
      expect(await exchangeMarketBlurbsSO.columnList[0].getText()).toBe("Back");
      expect(await exchangeMarketBlurbsSO.columnList[1].getText()).toBe("Lay");
    });

    it("[PRPI-1797] The runners should be displayed", async () => {
      expect(await exchangeMarketSO.runnerList.length).toBe(2);
    });

    it("[PRPI-1798] The bet buttons should be rendered", async () => {
      expect(await firstExchangeRunnerSO.betButtons.length).toBe(2);
    });

    it("[PRPI-1799] The first back and lay bet button should have the correct odd", async () => {
      expect(await firstExchangeBetButtonSO.odd.getText()).toBe("1.1");
      expect(await secondExchangeBetButtonSO.odd.getText()).toBe("1.2");
    });

    it("[PRPI-1800] The first back and lay bet button should have the correct liquidity", async () => {
      expect(await firstExchangeBetButtonSO.liquidity.getText()).toBe("$100");
      expect(await secondExchangeBetButtonSO.liquidity.getText()).toBe("$110");
    });

    describe("And the back odd and liquidity of the first runner changes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_MOCK_POLLING));
        await browser.waitUntilEquals(firstExchangeBetButtonSO.odd, "1.2");
      });

      it("[PRPI-1801] The first back bet button odd should be updated", async () => {
        expect(await firstExchangeBetButtonSO.odd.getText()).toBe("1.2");
        expect(await secondExchangeBetButtonSO.odd.getText()).toBe("1.3");
      });

      it("[PRPI-1802] The first back bet button liquidity should be updated", async () => {
        expect(await firstExchangeBetButtonSO.liquidity.getText()).toBe("$150");
        expect(await secondExchangeBetButtonSO.liquidity.getText()).toBe("$160");
      });

      describe("And the exchange market suspends", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(SUSPENDED_EXC_MARKET));
          await browser.waitUntilEquals(exchangeMarketStatusSO.label, "SUSPENDED");
        });

        it("[PRPI-1803] The suspended market label should be displayed", async () => {
          expect(await exchangeMarketStatusSO.label.getText()).toBe("SUSPENDED");
        });

        describe("And the exchange market re-opens", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarkets(ERO_MOCK_POLLING));
            await browser.waitUntilNotDisplayed(exchangeMarketBlurbsSO.marketStatus);
          });

          it("[PRPI-1804] The suspended market label should not be displayed", async () => {
            expect(await exchangeMarketBlurbsSO.marketStatus.isDisplayed()).toBe(false);
          });

          describe("And the exchange market closes", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarkets(CLOSED_EXC_MARKET));
              await browser.waitUntilEquals(exchangeMarketStatusSO.label, "CLOSED");
            });

            it("[PRPI-1805] The closed market label should be displayed", async () => {
              expect(await exchangeMarketStatusSO.label.getText()).toBe("CLOSED");
            });
          });
        });
      });
    });

    describe("When there is a market promo available", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(exchangeMarketBlurbsSO.marketPromo, "Market promo was not displayed");
      });

      it("[PRPI-1806] The market promo should be displayed", async () => {
        expect(await exchangeMarketBlurbsSO.marketPromo.isDisplayed()).toBe(true);
      });
    });
  });
});
