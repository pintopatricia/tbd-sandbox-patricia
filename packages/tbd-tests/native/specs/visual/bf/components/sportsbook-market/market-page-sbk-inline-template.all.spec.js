const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const QuickLinksCardSO = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.native.so");
const MarketSO = require("@ppb/tbd-shared/components/Market/Market.so");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp, openUrl } = require("../../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../../helpers/view-link-start");

const { PebbleListSO, PebbleSO, MarketPromoSO, CardSO, SnackbarSO } = require("../../../../../screen-objects");

const MODULE_NAME = "market-page";
const mockService = new MockService();

const marketSO = new MarketSO();
const marketCardSO = new CardSO(marketSO.element);
const pebbleListSO = new PebbleListSO();
const matchOdds90Pebble = new PebbleSO(pebbleListSO.pebbleListElements[1]);
const marketPromoSO = new MarketPromoSO();
const secondMarketPromoSO = new MarketPromoSO(1);
const quickLinksCardSO = new QuickLinksCardSO();
const snackbarSO = new SnackbarSO();

const SPORTSBOOK_MARKET_ID = "924.1";
const SPORTSBOOK_MARKET_ID_2 = "924.2";
const EVENT_ID = "29682729";
const EVENT_ID_NO_PEBBLES = "29682730";
const EVENT_ID_HANDICAP = "29682731";

const getDisplayRunners = (marketId, name = "MATCH_ODDS", marketType = "MATCH_ODDS", hasThirdRunner = false) => ({
  exchange: null,
  sportsbook: {
    market: {
      __typename: "SportsbookMarket",
      eventId: EVENT_ID,
      urn: `ppb:sbkMarket:${marketId}`,
      name,
      marketType,
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
          runnerURN: `ppb:sbkRunner:${marketId}/55190`,
          name: "Chelsea",
          selectionId: 55190,
        },
        {
          __typename: "Runner",
          runnerURN: `ppb:sbkRunner:${marketId}/48224`,
          name: "Tottenham",
          selectionId: 48224,
        },
        hasThirdRunner && {
          __typename: "Runner",
          runnerURN: `ppb:sbkRunner:${marketId}/58805`,
          name: "Third Runner",
          selectionId: 58805,
        },
      ],
    },
    runners: [
      { runnerURN: `ppb:sbkRunner:${marketId}/55190` },
      { runnerURN: `ppb:sbkRunner:${marketId}/48224` },
      hasThirdRunner && { runnerURN: `ppb:sbkRunner:${marketId}/58805` },
    ],
  },
});

const BFF_MOCK_WITH_PEBBLES = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  __typename: "EventView",
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Chelsea v Tottenham",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        pebbleCardGroupTitle: { translated: "Match Result" },
        urn: `ppb:tbd:card:pebbleMarkets:1`,
        selectedItemUrn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
        full: {
          edges: [
            {
              name: "Match Odds",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID}`,
                displayRunners: getDisplayRunners(SPORTSBOOK_MARKET_ID),
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "INLINE",
              },
            },
            {
              name: "Match Odds 90",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID_2}`,
                displayRunners: getDisplayRunners(SPORTSBOOK_MARKET_ID_2, "Match Odds 90", "MATCH_ODDS_90", true),
                runnerViewLinks: [],
                isRunnerExpandable: null,
                template: "INLINE",
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
                        viewUrl: "support.betfair.com",
                        viewDisplayMode: "BLANK_INAPP",
                        __typename: "ViewLink",
                      },
                    },
                  },
                ],
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
            {
              name: "Match Odds 90",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${SPORTSBOOK_MARKET_ID_2}`,
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
              viewUrl: "1",
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
        urn: `ppb:tbd:card:pebbleMarkets:1`,
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

const BFF_MOCK_NO_PEBBLES = {
  urn: `ppb:tbd:view:event:${EVENT_ID_NO_PEBBLES}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        typename: "MarketCard",
        template: "INLINE",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: null,
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID_NO_PEBBLES}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                  selectionId: 55190,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                  selectionId: 48224,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
                  selectionId: 58805,
                  name: "Man Utd",
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
              viewUrl: "1",
            },
          },
        ],
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
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
      },
    },
  ],
};

const BFF_MOCK_HANDICAP = {
  urn: `ppb:tbd:view:event:${EVENT_ID_HANDICAP}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        typename: "MarketCard",
        template: "INLINE",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: null,
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID_HANDICAP}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                  selectionId: 55190,
                  name: "Wolves that has a big name",
                  handicap: 3.5,
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                  selectionId: 48224,
                  name: "The Draw with also a big name",
                  handicap: -0.5,
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
                  selectionId: 58805,
                  name: "Man Utd",
                  handicap: -2.5,
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
};

const RUNNER_DETAILS = [
  {
    selectionId: 55190,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 1.1 },
    },
    runnerStatus: "ACTIVE",
  },
  {
    selectionId: 48224,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 1.2 },
    },
    runnerStatus: "ACTIVE",
  },
  {
    selectionId: 58805,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 1.3 },
    },
    runnerStatus: "ACTIVE",
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: RUNNER_DETAILS,
    },
    {
      marketId: SPORTSBOOK_MARKET_ID_2,
      runnerDetails: RUNNER_DETAILS,
    },
  ],
};

describe("Sportsbook Football Market Page", () => {
  const urls = [
    `sport/competition/event/e-${EVENT_ID_NO_PEBBLES}`,
    `sport/competition/event/e-${EVENT_ID}`,
    `sport/competition/event/e-${EVENT_ID_HANDICAP}`,
  ];

  const HOME_VIEW_LINKS = getStartViewLinks(urls);

  describe("when the market template is inline", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse({}, { ignoreLegsOrder: true }));

      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));
    });

    describe("and there are no pebbles", () => {
      describe("and there are three selections", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_NO_PEBBLES));

          await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });
          await browser.waitUntilDisplayed(snackbarSO.element);
          await snackbarSO.closeButton.click();
          await browser.waitUntilClickableNative(quickLinksCardSO.element);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-4934]_should_display_market_header_dropdown_with_no_pebbles_and_three_selections`,
          );
        });

        it("[PRPI-4934]_should_display_market_header_dropdown_with_no_pebbles_and_three_selections", async () => {
          expect(
            (
              await browser.compareScreen(
                `${MODULE_NAME}_[PRPI-4934]_should_display_market_header_dropdown_with_no_pebbles_and_three_selections`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });
      });
    });

    describe("and there are pebbles", () => {
      describe("and there are two selections", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_WITH_PEBBLES));

          await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

          await browser.waitUntilDisplayed(quickLinksCardSO.element);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-4431]_should_display_market_header_dropdown_with_pebbles_and_two_selections`,
          );
        });

        it("[PRPI-4431]_should_display_market_header_dropdown_with_pebbles_and_two_selections", async () => {
          expect(
            (
              await browser.compareScreen(
                `${MODULE_NAME}_[PRPI-4431]_should_display_market_header_dropdown_with_pebbles_and_two_selections`,
              )
            ).misMatchPercentage,
          ).toBe(0);
        });

        describe("and the user clicks in the second pebble (Match odds 90)", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(matchOdds90Pebble.element);
            await matchOdds90Pebble.element.click();
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-4935]_should_display_the_match_odds_90_market_with_collapsed_market_promo`,
            );
          });

          it("[PRPI-4935]_should_display_the_match_odds_90_market_with_collapsed_market_promo", async () => {
            expect(
              (
                await browser.compareScreen(
                  `${MODULE_NAME}_[PRPI-4935]_should_display_the_match_odds_90_market_with_collapsed_market_promo`,
                )
              ).misMatchPercentage,
            ).toEqual(0);
          });

          describe("and the user clicks in the market promo", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(marketPromoSO.element);
              await marketPromoSO.element.click();
              await secondMarketPromoSO.element.click();

              await browser.waitUntilImageEquals(
                `${MODULE_NAME}_[PRPI-4936]_should_display_the_match_odds_90_market_with_extended_market_promo`,
              );
            });

            it("[PRPI-4936]_should_display_the_match_odds_90_market_with_extended_market_promo", async () => {
              expect(
                (
                  await browser.compareScreen(
                    `${MODULE_NAME}_[PRPI-4936]_should_display_the_match_odds_90_market_with_extended_market_promo`,
                  )
                ).misMatchPercentage,
              ).toEqual(0);
            });
          });
        });
      });
    });

    describe("and the runners have handicaps", () => {
      describe("and there are three selections", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_HANDICAP));

          await openUrl(urls[2], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 2 });

          await browser.waitUntilDisplayed(marketCardSO.element);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-4432]_should_display_market_header_dropdown_with_three_selections_and_handicaps`,
          );
        });

        it("[PRPI-4432]_should_display_market_header_dropdown_with_three_selections_and_handicaps", async () => {
          expect(
            (
              await browser.compareScreen(
                `${MODULE_NAME}_[PRPI-4432]_should_display_market_header_dropdown_with_three_selections_and_handicaps`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });
      });
    });
  });
});
