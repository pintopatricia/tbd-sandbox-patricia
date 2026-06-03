const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, PebbleCardGroupSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const pebbleCardGroupSO = new PebbleCardGroupSO();

const MODULE_NAME = "oddsboost";
const MARKET_ID = "924.342274939";

const BFF_MOCK = {
  __typename: "GenericView",
  url: "view/generic:home",
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:Y7cQdREAABd_41Aw/e/29682729",
        pebbleCardGroupTitle: { translated: "OddsBoosts" },
        selectedItemUrn: `ppb:tbd:card:market:${MARKET_ID}|0|true|false|true|4`,
        full: {
          edges: [
            {
              name: "OddsBoosts",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${MARKET_ID}|0|true|false|true|4`,
                numberOfItemsToDisplay: 4,
                viewLinks: [],
                marketsHierarchy: {},
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      name: "OddsBoost",
                      marketType: "ODDSBOOST",
                      marketTypeName: null,
                      bettingType: "ODDS",
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/37511202`,
                          name: "Each Team to Have 2+ Corners in Each Half",
                          selectionId: 37511202,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/36634703`,
                          name: "Both teams to score & 3+ corners for each team & 2+ cards for each team",
                          selectionId: 36634703,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/51725848`,
                          name: "Ellis Harrison to score first",
                          selectionId: 51725848,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/38915495`,
                          name: "Jonson Clarke-Harris to score 2 or more",
                          selectionId: 38915495,
                          handicap: 0,
                          resultType: null,
                        },
                      ],

                      isOddsboostMarketType: true,
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/37511202`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/36634703`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/51725848`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/38915495`,
                      },
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
              name: "OddsBoosts",
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${MARKET_ID}|0|true|false|true|4`,
              },
            },
          ],
        },
      },
    },
  ],

  partials: {
    partialEdges: [
      {
        node: {
          __typename: "PebbleCardGroup",
          urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:Y7cQdREAABd_41Aw/e/29682729",
        },
      },
    ],
  },
};

const BFF_MOCK_WITH_MARKET_BLURBS = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        ...BFF_MOCK.edges[0].node,
        full: {
          edges: [
            {
              name: "OddsBoosts",
              node: {
                ...BFF_MOCK.edges[0].node.full.edges[0].node,
                marketPromo: {
                  title: "Race default template (extra places)",
                  description:
                    "Guinness market promo racing 02 perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
                  signposting: "EXTRA_PLACES",
                  __typename: "MarketPromo",
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
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: "37511202",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
          ],
        },
        {
          selectionId: "36634703",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
          ],
        },
        {
          selectionId: "51725848",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.3 },
            },
          ],
        },
        {
          selectionId: "38915495",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
          ],
        },
      ],
    },
  ],
};

describe("Oddsboost - PebbleCardGroup", () => {
  describe("When the user opens a view with an oddsboost pebblecardgroup", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await startApp("home");
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(pebbleCardGroupSO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4945]_the_oddsboost_pebblecardgroup_should_be_displayed_with_the_odds_and_the_previous_odds`,
      );
    });

    it("[PRPI-4945]_the_oddsboost_pebblecardgroup_should_be_displayed_with_the_odds_and_the_previous_odds", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4945]_the_oddsboost_pebblecardgroup_should_be_displayed_with_the_odds_and_the_previous_odds`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("And when there are market blurbs", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_WITH_MARKET_BLURBS));
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
        await startApp("home", { shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(genericScreenSO.element);
        await browser.waitUntilDisplayed(pebbleCardGroupSO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4946]_should_be_displayed_with_market_blurbs`);
      });

      it("[PRPI-4946]_should_be_displayed_with_market_blurbs", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4946]_should_be_displayed_with_market_blurbs`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
