const { getQuote } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const {
  AppPO,
  MarketPagePO,
  PebbleListPO,
  PrimaryButtonPO,
  PNLAndWhatIfPO,
  BetSegmentsPO,
} = require("../../../../page-objects");
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const primaryButtonPO = new PrimaryButtonPO();
const pnlAndWhatIfPO = new PNLAndWhatIfPO(primaryButtonPO.element);
const marketPagePO = new MarketPagePO();
const liabilityInfoPO = new BetSegmentsPO();
const pebblesPO = new PebbleListPO(marketPagePO.element);
const secondPebble = pebblesPO.pebbles[1];

const mockService = new MockService();
const EXCHANGE_MATCH_ODDS_MARKET_ID = "1.123456789";

const CASHOUT_QUOTE = {
  urn: "ppb:excCashoutQuote:1.123456789/0",
  marketURN: "ppb:excMarket:1.123456789",
  value: 1.98,
  profit: -0.02,
  currentLiability: 2,
  status: "AVAILABLE",
};

const EXCHANGE_MARKET = {
  eventId: 29359895,
  __typename: "ExchangeMarket",
  urn: "ppb:excMarket:1.123456789",
  name: "Over/Under 0.5 Goals",
  marketType: "OVER_UNDER_05",
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:29359895`,
    },
  },
  bettingType: "ODDS",
  runners: [
    {
      __typename: "Runner",
      runnerURN: "ppb:excRunner:1.123456789/55190/0",
      name: "Chelsea",
      selectionId: 55190,
      handicap: 0,
    },
    {
      __typename: "Runner",
      runnerURN: "ppb:excRunner:1.123456789/48224/0",
      name: "Tottenham",
      selectionId: 48224,
      handicap: 0,
    },
    {
      __typename: "Runner",
      runnerURN: "ppb:excRunner:1.123456789/58805/0",
      name: "The Draw",
      selectionId: 58805,
      handicap: 0,
    },
  ],

  liveData: {
    cashoutQuotes: [CASHOUT_QUOTE],
  },
};

const BFF_MOCK_MARKET_VIEW = {
  urn: "ppb:tbd:view:market:1.123456789",
  mainMarket: EXCHANGE_MARKET,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29359895",
        sportevent: {
          __typename: "SportsEvent",
          urn: "ppb:event:29359895",
        },
        fixture: {
          urn: "ppb:fixture:29359895",
          home: {
            name: "Chelsea",
          },
          away: {
            name: "Tottenham",
          },
          duration: {},
        },
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleMarkets:1.123456789",
        pebbleCardGroupTitle: { translated: "Over/Under Goals" },
        selectedItemUrn: "ppb:tbd:card:marketExtended:1.123456789;924.240577106",
        full: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:1.123456789;924.240577106",
                displayRunners: {
                  exchange: {
                    market: EXCHANGE_MARKET,
                    runners: [
                      { runnerURN: "ppb:excRunner:1.123456789/55190/0" },
                      { runnerURN: "ppb:excRunner:1.123456789/48224/0" },
                      { runnerURN: "ppb:excRunner:1.123456789/58805/0" },
                    ],
                  },
                },
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:1.173614168;924.240577154",
                displayRunners: {
                  exchange: {
                    market: {
                      eventId: 29359895,
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.173614168",
                      name: "Over/Under 1.5 Goals",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      marketType: "OVER_UNDER_15",
                      bettingType: "ODDS",
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.173614168/55190/0",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.173614168/48224/0",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.173614168/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.173614168/55190/0" },
                      { runnerURN: "ppb:excRunner:1.173614168/48224/0" },
                      { runnerURN: "ppb:excRunner:1.173614168/58805/0" },
                    ],
                  },
                },
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:1.173614164;924.240577176",
                displayRunners: {
                  exchange: {
                    market: {
                      eventId: 29359895,
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.173614164",
                      name: "Over/Under 2.5 Goals",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      marketType: "OVER_UNDER_25",
                      bettingType: "ODDS",
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.173614164/55190/0",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.173614164/48224/0",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.173614164/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.173614164/55190/0" },
                      { runnerURN: "ppb:excRunner:1.173614164/48224/0" },
                      { runnerURN: "ppb:excRunner:1.173614164/58805/0" },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:1.123456789;924.240577106",
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:1.173614168;924.240577154",
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:1.173614164;924.240577176",
              },
            },
          ],
        },
      },
    },
  ],
};

const ERO_RUNNERS_MOCK = [
  {
    selectionId: "55190",
    availableToBack: [{ price: 2.5, size: 100 }],
    availableToLay: [{ price: 5.8, size: 110 }],
  },
  {
    selectionId: "48224",
    availableToBack: [{ price: 3.5, size: 100 }],
    availableToLay: [{ price: 6.8, size: 110 }],
  },
  {
    selectionId: "58805",
    availableToBack: [{ price: 1.5, size: 100 }],
    availableToLay: [{ price: 1.8, size: 110 }],
  },
];

const MATCH_ODDS_ERO_MOCK = [
  {
    marketId: 1.123456789,
    runners: ERO_RUNNERS_MOCK,
  },
];

const POSITION_VIEWS = {
  marketPositions: [
    {
      marketId: 1.123456789,
      selections: [
        {
          selectionId: "55190",
          orders: [
            {
              marketId: 1.123456789,
              selectionId: "55190",
              betId: "1:11111111111",
              price: 6,
              size: 3,
              averagePriceMatched: 6,
              sizeMatched: 3,
              sizeRemaining: 0,
              status: "EXECUTION_COMPLETE",
            },
          ],
        },
        {
          selectionId: "48224",
          orders: [
            {
              marketId: 1.123456789,
              selectionId: "48224",
              betId: "2:22222222222",
              price: 2.5,
              size: 2,
              averagePriceMatched: 2.5,
              sizeMatched: 2,
              sizeRemaining: 0,
              status: "EXECUTION_COMPLETE",
            },
          ],
        },
      ],
    },
  ],
};

const CASHOUT_QUOTE_MOCK = [
  {
    marketId: 1.123456789,
    value: 1.98,
    currentLiability: 2,
    profit: -0.02,
    minPartialPercentage: 5,
    maxPartialPercentage: 100,
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
  },
];

describe("Market Page (Over/Under) - Cash Out - Availability", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK_MARKET_VIEW.urn, {
        currencyCode: "EUR",
        localeCodeBcp47: "en-GB",
      }),
    );
    await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_MARKET_VIEW));
    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
    await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: marketPagePO.market,
        price: 2.5,
      }),
    );
    await browser.waitUntilDisplayed(primaryButtonPO.element);
  });

  describe("when the market has cash out quotes available", () => {
    it("[PRPI-5443] the cash out button should display the label and PnL", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: €1.98");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await pnlAndWhatIfPO.pnl.getText()).toBe("-€0.02");
    });

    it("[PRPI-10372] the liability info should be displayed", async () => {
      expect(await liabilityInfoPO.leftLabel.getText()).toBe("Liability");
      expect(await liabilityInfoPO.leftValue.getText()).toBe("€2.00");
    });

    describe("and when the user switches pebbles and there are no cash out quotes available", () => {
      beforeAll(async () => {
        await secondPebble.waitForClickable();
        await secondPebble.click();
      });

      it("[PRPI-5444] the cash out button should not be displayed", async () => {
        await browser.waitUntilNotDisplayed(primaryButtonPO.element, "Cash out button was displayed");
      });

      it("[PRPI-10373] the liability info should not be displayed", async () => {
        expect(await liabilityInfoPO.element.isDisplayed()).toBe(false);
      });
    });
  });
});
