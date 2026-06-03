const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { MarketPromoPO } = require("../../../../page-objects");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const SPORTSBOOK_MARKET_ID = "924.222615412";
const EVENT_ID = "29682729";

const BFF_MOCK_WITH_PEBBLES = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Chelsea v Tottenham",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        pebbleCardGroupTitle: { translated: "Match Result" },
        urn: `ppb:tbd:card:pebbleMarkets:${SPORTSBOOK_MARKET_ID}`,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                          resultType: "HOME",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                          resultType: "AWAY",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224` },
                    ],
                  },
                },
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "INLINE",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
        quickLinksTitle: "All Markets",
        links: [
          {
            label: "View All Markets",
            target: "_self",
            icon: null,
            viewLink: {
              viewUrl: routes.getEventViewUrl(EVENT_ID),
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: `ppb:tbd:card:pebbleMarkets:${SPORTSBOOK_MARKET_ID}`,
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
      },
    },
  ],
};

const BFF_MOCK_HANDICAP = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Chelsea v Tottenham",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:marketcard##${SPORTSBOOK_MARKET_ID}`,
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: null,
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              eventId: EVENT_ID,
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              name: "Match Odds",
              liveData: {
                inplay: false,
              },
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Chelsea v Tottenham",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                  name: "Chelsea that has a big name",
                  selectionId: 55190,
                  handicap: 1.5,
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                  name: "Tottenham with also a big name",
                  selectionId: 48224,
                  handicap: 3.5,
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
                  name: "The Draw",
                  selectionId: 58805,
                  handicap: -2.0,
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805` },
            ],
          },
        },
        runnerViewLinks: [],
        template: "INLINE",
      },
    },
  ],

  partialEdges: [],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "55190",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48224",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const MODULE_NAME = "market_page";

const BFF_MOCK_WITH_PEBBLES_AND_BLURBS = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Chelsea v Tottenham",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        pebbleCardGroupTitle: { translated: "Match Result" },
        urn: `ppb:tbd:card:pebbleMarkets:${SPORTSBOOK_MARKET_ID}`,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
                marketPromo: {
                  title: "Half priced double bet",
                  description:
                    "Double bet at half price to enhance your wagering precision. After 00 am Tomorrow, standard betting will be restated.",
                  signposting: "EXTRA_PLACES",
                },
                blurbs: [
                  {
                    __typename: "InformativeBlurb",
                    title: {
                      __typename: "DisplayNameTitle",
                      name: "Calculate potential payouts for double bets.",
                    },
                    description: {
                      __typename: "DisplayNameTitle",
                      name: "Betfair double bet calculator makes it easy to calculate potential payouts for double bets",
                    },
                    isCollapsed: false,
                    supplementaryInfo: {
                      __typename: "SupplementaryInfo",
                      label: {
                        __typename: "DisplayNameTitle",
                        name: "Betfair double bet calculator",
                      },
                      viewLink: {
                        viewUrl: "https://betting.betfair.com/bet-calculator/double/",
                        viewDisplayMode: "BLANK_INAPP",
                        __typename: "ViewLink",
                      },
                    },
                  },
                ],

                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                          resultType: "HOME",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                          resultType: "AWAY",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224` },
                    ],
                  },
                },
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "INLINE",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: `ppb:tbd:card:pebbleMarkets:${SPORTSBOOK_MARKET_ID}`,
      },
    },
  ],
};

describe("Sportsbook Football Market Page", () => {
  describe("when the market template is inline", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    });

    describe("and there are pebbles", () => {
      describe("and there are two selections", () => {
        beforeEach(async () => {
          await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_WITH_PEBBLES.urn));
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_WITH_PEBBLES));
          await mockService.mockHttpRequest(getScaResponse({}));
          await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1398]_should_display_market_header_dropdown_with_pebbles_and_two_selections`,
          );
        });

        it("[PRPI-1398]_should_display_market_header_dropdown_with_pebbles_and_two_selections", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1398]_should_display_market_header_dropdown_with_pebbles_and_two_selections`,
            ),
          ).toBe(0);
        });
      });
    });

    describe("and the runners have handicaps", () => {
      describe("and there are three selections", () => {
        beforeEach(async () => {
          await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_HANDICAP.urn));
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_HANDICAP));
          await mockService.mockHttpRequest(getScaResponse({}));
          await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1399]_should_display_market_header_dropdown_with_three_selections_and_handicaps`,
          );
        });

        it("[PRPI-1399]_should_display_market_header_dropdown_with_three_selections_and_handicaps", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1399]_should_display_market_header_dropdown_with_three_selections_and_handicaps`,
            ),
          ).toBe(0);
        });
      });
    });

    describe("and the template has an 'info blurb' and a 'market promo blurb'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_WITH_PEBBLES_AND_BLURBS.urn));
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_WITH_PEBBLES_AND_BLURBS));
        await mockService.mockHttpRequest(getScaResponse({}));
        await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
        const secondMarketPromo = new MarketPromoPO(1);
        await secondMarketPromo.element.click();
        // The market promo component has a hover effect so we need to click outside to avoid
        // that effect to be seen in the screenshot
        await browser
          .action("pointer", { parameters: { pointerType: "mouse" } })
          .move({ origin: "viewport", x: 0, y: 0 })
          .perform();
        await secondMarketPromo.description.waitForDisplayed();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4692]_inline_market_template_should_render_blurbs_with_all_properties_correctly`,
        );
      });

      it("[PRPI-4692]_inline_market_template_should_render_blurbs_with_all_properties_correctly", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-4692]_inline_market_template_should_render_blurbs_with_all_properties_correctly`,
          ),
        ).toBe(0);
      });
    });
  });
});
