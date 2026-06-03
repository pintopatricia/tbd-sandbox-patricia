const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { ShowMorePO, MarketBlurbsPO, MarketPromoPO } = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const showMorePO = new ShowMorePO();
const marketBlurbsPO = new MarketBlurbsPO();
const SPORTSBOOK_MARKET_ID = "924.222615412";
const EVENT_ID = "29682729";

const BASE_BFF_MARKET_RUNNERS = [
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
    selectionId: 48044,
    name: "Rory McIlroy",
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
    selectionId: 58805,
    name: "Tom Kim",
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351`,
    selectionId: 48351,
    name: "Tiger Woods The Greatest Of All Times",
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45877`,
    selectionId: 45877,
    name: "Phil Mickelson",
  },
];

const BASE_BFF_SBK_RUNNERS = [
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351`,
  },
  {
    runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45877`,
  },
];

const BASE_SMP_MARKET_SELECTIONS = [
  {
    selectionId: 48044,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 6.5 },
    },
  },
  {
    selectionId: 58805,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 1.2 },
    },
  },
  {
    selectionId: 48351,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 2.9 },
    },
  },
  {
    selectionId: 45877,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 4.2 },
    },
  },
];

const EVEN_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: `ppb:tbd:cardgroup:pebble:marketTemplateEvent:${SPORTSBOOK_MARKET_ID}`,
        pebbleCardGroupTitle: {
          translated: "Win",
          translate: null,
        },
        pebbleExpanded: true,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      marketType: "BOTH_TEAMS_TO_SCORE",
                      marketTypeName: null,
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [...BASE_BFF_MARKET_RUNNERS],
                    },
                    runners: [...BASE_BFF_SBK_RUNNERS],
                  },
                },
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "OUTRIGHT",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Win",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
              },
            },
          ],
        },
      },
    },
  ],
};

const EVEN_SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [...BASE_SMP_MARKET_SELECTIONS],
    },
  ],
};

const ODD_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: `ppb:tbd:cardgroup:pebble:marketTemplateEvent:${SPORTSBOOK_MARKET_ID}`,
        pebbleCardGroupTitle: {
          translated: "Win",
          translate: null,
        },
        pebbleExpanded: true,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      marketType: "BOTH_TEAMS_TO_SCORE",
                      marketTypeName: null,
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        ...BASE_BFF_MARKET_RUNNERS,
                        {
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45233`,
                          selectionId: 45233,
                          name: "Scottie Scheffler",
                        },
                      ],
                    },
                    runners: [
                      ...BASE_BFF_SBK_RUNNERS,
                      {
                        runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45233`,
                      },
                    ],
                  },
                },
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "OUTRIGHT",
                numberOfItemsToDisplay: 4,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Win",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
              },
            },
          ],
        },
      },
    },
  ],
};

const ODD_SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        ...BASE_SMP_MARKET_SELECTIONS,
        {
          selectionId: 45233,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1 },
          },
        },
      ],
    },
  ],
};

const AZ_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: `ppb:tbd:cardgroup:pebble:marketTemplateEvent:${SPORTSBOOK_MARKET_ID}`,
        pebbleCardGroupTitle: {
          translated: "Win",
          translate: null,
        },
        pebbleExpanded: true,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      marketType: "BOTH_TEAMS_TO_SCORE",
                      marketTypeName: null,
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        ...BASE_BFF_MARKET_RUNNERS,
                        {
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45233`,
                          selectionId: 45233,
                          name: "Scottie Scheffler",
                        },
                      ],
                    },
                    runners: [
                      ...BASE_BFF_SBK_RUNNERS,
                      {
                        runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/45233`,
                      },
                    ],
                  },
                },
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "OUTRIGHT",
                numberOfItemsToDisplay: 4,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Win",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
              },
            },
          ],
        },
      },
    },
  ],
};

const AZ_SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        ...BASE_SMP_MARKET_SELECTIONS,
        {
          selectionId: 45233,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1 },
          },
        },
      ],
    },
  ],
};

const EVEN_BFF_MOCK_WITH_BLURBS = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: `ppb:tbd:cardgroup:pebble:marketTemplateEvent:${SPORTSBOOK_MARKET_ID}`,
        pebbleCardGroupTitle: {
          translated: "Win",
          translate: null,
        },
        pebbleExpanded: true,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
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
                      marketType: "BOTH_TEAMS_TO_SCORE",
                      marketTypeName: null,
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [...BASE_BFF_MARKET_RUNNERS],
                    },
                    runners: [...BASE_BFF_SBK_RUNNERS],
                  },
                },
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "OUTRIGHT",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Win",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}|0|true|false|true|0`,
              },
            },
          ],
        },
      },
    },
  ],
};

const MODULE_NAME = "market_page";
const CARD_NAME = "outright_template";

describe("Market Card Component", () => {
  describe("Outright Template - Even runners with market blurbs", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(EVEN_BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(EVEN_SMP_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(EVEN_BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse({}));
      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_${CARD_NAME}_[PRPI-1401]_should_render_outright_template_with_even_number_of_runners_and_market_blurb`,
      );
    });

    it("[PRPI-1401]_should_render_outright_template_with_even_number_of_runners_and_market_blurb", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_${CARD_NAME}_[PRPI-1401]_should_render_outright_template_with_even_number_of_runners_and_market_blurb`,
        ),
      ).toBe(0);
    });
  });

  describe("Outright Template - Odd runners without market blurbs and with show more", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(ODD_BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(ODD_SMP_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(ODD_BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse({}));
      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_${CARD_NAME}_[PRPI-1403]_should_render_outright_template_with_odd_number_of_runners_and_without_market_blurb_and_with_show_more`,
      );
    });

    it("[PRPI-1402]_should_render_outright_template_with_odd_number_of_runners_and_without_market_blurb_and_with_show_more", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_${CARD_NAME}_[PRPI-1403]_should_render_outright_template_with_odd_number_of_runners_and_without_market_blurb_and_with_show_more`,
        ),
      ).toBe(0);
    });

    describe("Outright Template - Odd runners without market blurbs after show more click", () => {
      beforeAll(async () => {
        showMorePO.element.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_${CARD_NAME}_[PRPI-1403]_should_render_outright_template_with_odd_number_of_runners_and_without_market_blurb`,
        );
      });

      it("[PRPI-1403]_should_render_outright_template_with_odd_number_of_runners_and_without_market_blurb", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_${CARD_NAME}_[PRPI-1403]_should_render_outright_template_with_odd_number_of_runners_and_without_market_blurb`,
          ),
        ).toBe(0);
      });
    });
  });

  describe("Outright Template - Runners with market blurbs, with show more and with A-Z", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(AZ_BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(AZ_SMP_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(AZ_BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse({}));
      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_${CARD_NAME}_[PRPI-1404]_should_render_outright_template_with_market_blurb_and_with_show_more_and_with_az_toggle_off`,
      );
    });

    it("[PRPI-1404]_should_render_outright_template_with_market_blurb_and_with_show_more_and_with_az_toggle_off", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_${CARD_NAME}_[PRPI-1404]_should_render_outright_template_with_market_blurb_and_with_show_more_and_with_az_toggle_off`,
        ),
      ).toBe(0);
    });

    describe("Outright Template - Runners with market blurbs after A-Z click", () => {
      beforeAll(async () => {
        marketBlurbsPO.azSwitcher.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_${CARD_NAME}_[PRPI-1405]_should_render_outright_template_with_market_blurb_and_with_show_more_and_with_az_toggle_on`,
        );
      });

      it("[PRPI-1405]_should_render_outright_template_with_market_blurb_and_with_show_more_and_with_az_toggle_on", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_${CARD_NAME}_[PRPI-1405]_should_render_outright_template_with_market_blurb_and_with_show_more_and_with_az_toggle_on`,
          ),
        ).toBe(0);
      });
    });
  });

  describe("[GNSS-270] when the outright template has an 'info blurb' and a 'market promo blurb'", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(EVEN_BFF_MOCK_WITH_BLURBS.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(EVEN_SMP_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(EVEN_BFF_MOCK_WITH_BLURBS));
      await mockService.mockHttpRequest(getScaResponse({}));

      await browser.url(routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID));
    });

    it("[PRPI-4791]_it_should_render_the_blurbs_with_all_properties_correctly", async () => {
      const thirdMarketPromo = new MarketPromoPO(2);
      await thirdMarketPromo.element.click();
      await thirdMarketPromo.description.waitForDisplayed();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4791]_it_should_render_the_blurbs_with_all_properties_correctly`,
      );

      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-4791]_it_should_render_the_blurbs_with_all_properties_correctly`,
        ),
      ).toBe(0);
    });
  });
});
