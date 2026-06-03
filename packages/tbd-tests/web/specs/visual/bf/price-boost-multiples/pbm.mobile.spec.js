const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { SportsbookBetButtonPO } = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const sportsbookBetButtonPO = new SportsbookBetButtonPO();

const MODULE_NAME = "pbm";
const EVENT_TYPE_ID = 1;
const EVENT_ID = 12345;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";

const FULL_CARD_MOCK = {
  node: {
    __typename: "PriceBoostMultisCard",
    urn: `ppb:tbd:card:priceboostmultis:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
    showWasPrice: true,
    boostedBettingGroup: "group1",
    title: "Champions League Price Boosts",
    popularbettingopportunity: {
      urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
      type: "BOOSTED_BETS",
      count: 0,
      selections: [
        {
          market: {
            __typename: "SportsbookMarket",
            urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
            name: "Anytime Goalscorer",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                selectionId: 1,
                name: "PSG",
              },
            ],

            isOddsboostMarketType: false,
          },
          runner: {
            runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
            selectionId: 1,
          },
        },
        {
          market: {
            __typename: "SportsbookMarket",
            urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
            name: "Missed Shots Over/Under 100.5",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                selectionId: 2,
                name: "Arsenal",
              },
            ],

            isOddsboostMarketType: false,
          },
          runner: {
            runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
            selectionId: 2,
          },
        },
      ],
    },
  },
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [FULL_CARD_MOCK],
  partialEdges: [
    {
      node: {
        __typename: FULL_CARD_MOCK.node.__typename,
        urn: FULL_CARD_MOCK.node.urn,
      },
    },
  ],
};

const IMPLY_BETS_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        { runners: [{ marketId: FIRST_MARKET_ID, selectionId: 1 }] },
        { runners: [{ marketId: SECOND_MARKET_ID, selectionId: 2 }] },
      ],

      winAvgOdds: { prettyDisplayOdds: { decimalOdds: { decimalOdds: 1 } } },
    },
  ],
};

describe("PriceBoostMultisCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BETS_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportsbookBetButtonPO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1508]_should_render_pbm`);
  });

  it("[PRPI-1508]_should_render_pbm", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1508]_should_render_pbm`)).toBe(0);
  });
});
