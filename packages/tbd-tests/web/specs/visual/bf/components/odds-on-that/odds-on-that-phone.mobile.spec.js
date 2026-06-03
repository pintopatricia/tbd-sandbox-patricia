const { RunnerPO } = require("../../../../../page-objects");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MarketExtendedCardPO = require("@ppb/tbd-shared/components/MarketExtendedCard/MarketExtendedCard.po");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const MODULE_NAME = "odds-on-that";
const mockService = new MockService();
const marketExtendedCardCardPO = new MarketExtendedCardPO();
// collapsed
const firstRunner = new RunnerPO(marketExtendedCardCardPO.runners[0]);

const MARKET_ID = 924.1;

const createRunners = () =>
  [
    "Each Team to Have 2+ Corners in Each Half",
    "Both teams to score & 3+ corners for each team & 2+ cards for each team",
    "Each Team 2+ Shots on Target in each Half",
    "Leicester to Win, Leicester Most Shots On Target and Leicester Most Corners",
    "Leicester to Win; Leicester Most Corners and Leeds Most Cards",
    "Leeds to Have 2 or More Cards in Each Half",
  ].map((name, i) => ({
    __typename: "Runner",
    runnerURN: `ppb:sbkRunner:${MARKET_ID}/${i + 1}`,
    name,
    selectionId: i + 1,
    handicap: 0,
    resultType: null,
  }));

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:event:1",
  sportevent: {
    urn: "ppb:event:1",
    eventId: 1,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
        pebbleCardGroupTitle: { translated: "OddsOnThat" },
        selectedItemUrn: `ppb:tbd:card:marketExtended:${MARKET_ID}|4`,
        full: {
          edges: [
            {
              name: "OddsOnThat -1",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${MARKET_ID}|4`,
                numberOfItemsToDisplay: 4,
                name: "OddsOnThat - Featured",
                marketType: "PRE_MATCH_COMBO_-_FEATURED",
                noLiveData: true,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      name: "OddsOnThat - Featured",
                      marketType: "PRE_MATCH_COMBO_-_FEATURED",
                      noLiveData: true,
                      runners: createRunners(),
                    },
                    runners: createRunners(),
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "OddsOnThat -1",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${MARKET_ID}|4`,
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
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 4,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 4 },
          },
        },
        {
          selectionId: 5,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 6,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

describe("OddsOnThat", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse({}, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
  });

  describe("when the user is in an event view with a pebblecardgroup for oddsonthat", () => {
    beforeAll(async () => {
      await browser.url(routes.getEventViewUrl("1"));
      await browser.waitUntilEquals(firstRunner.sportsbookBetButton, "1.1");
      await marketExtendedCardCardPO.element.isDisplayed();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1612]_the_oddsonthat_markets_should_be_correctly_displayed`,
      );
    });

    it("[PRPI-1612]_the_oddsonthat_markets_should_be_correctly_displayed", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1612]_the_oddsonthat_markets_should_be_correctly_displayed`),
      ).toEqual(0);
    });
  });

  it("[PRPI-1612]_the_oddsonthat_markets_should_be_correctly_displayed", async () => {
    expect(await marketExtendedCardCardPO.element.isDisplayed()).toBe(true);
  });
});
