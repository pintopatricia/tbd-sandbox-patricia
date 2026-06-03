const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const mockService = new MockService(browser);

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
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1493]_the_oddsboost_pebblecardgroup_should_be_displayed_without_price_history`,
      );
    });

    it("[PRPI-1493]_the_oddsboost_pebblecardgroup_should_be_displayed_without_price_history", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1493]_the_oddsboost_pebblecardgroup_should_be_displayed_without_price_history`,
        ),
      ).toEqual(0);
    });
  });
});
