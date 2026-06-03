const { SportPagePO } = require("../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const SPORT_ID = 1;

const sportPagePO = new SportPagePO();

const MARKET_ID = "924.266233830";
const SELECTION_ID = "39879518";
const BETTING_OPPORTUNITY_ID = "bo-2a96e7d4-boosted_bets";

const PRICE_BOOST_PROMO_CARD = {
  __typename: "PriceBoostMultiplePromoCard",
  urn: "ppb:tbd:card:priceboostmultiplepromocard:pph/B10G10ASCOTSTAT3",
  title: "SOME TITLE",
  subTitle: "SOME SUBTITLE",
  theme: "DARK",
  termsAndConditions: {
    summary: "The hidden law of a probable outcome",
    link: null,
    __typename: "PromoTermsAndConditions",
  },
  popularbettingopportunity: {
    __typename: "PopularBettingOpportunity",
    urn: "ppb:bettingOpportunity:popular:bo-2a96e7d4-boosted_bets|BOOSTED_BETS|0|0|0",
    count: 0,
    bettingOpportunityId: BETTING_OPPORTUNITY_ID,
    selections: [
      {
        __typename: "BettingOpportunitySelection",
        market: {
          urn: `ppb:sbkMarket:${MARKET_ID}`,
          __typename: "SportsbookMarket",
        },
        runner: {
          runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
          selectionId: SELECTION_ID,
          __typename: "Runner",
        },
        raceRunner: null,
      },
    ],

    displayName: "Coventry, Dortmund & Getafe all to win",
    type: "BOOSTED_BETS",
  },
};

const BFF_SPORT_PAGE_MOCK_CARD = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
        full: {
          edges: [
            {
              node: PRICE_BOOST_PROMO_CARD,
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PriceBoostMultiplePromoCard",
                urn: "ppb:tbd:card:priceboostmultiplepromocard:pph/B10G10ASCOTSTAT3",
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
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
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
          selectionId: SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
          ],
        },
      ],
    },
  ],
};
const SINGLE_BET_COMBINATION = {
  combinationGroupId: BETTING_OPPORTUNITY_ID,
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: SELECTION_ID,
        },
      ],
    },
  ],

  winAverageOdds: 1.3,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.3 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
  },
  averageOdds: 1.3,
};

const FIRST_SELECTION_ODDS = {
  runner: {
    marketId: MARKET_ID,
    selectionId: SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    fractionalDisplayOdds: { numerator: 13, denominator: 10 },
  },
};

const SIB_MOCK = {
  betCombinations: [SINGLE_BET_COMBINATION],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS],
};

const MODULE_NAME = "promo_card";

describe("PromoCard with Price Boost Multiple", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_CARD.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_CARD));
    await mockService.mockFonts(getMockFonts());
    await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1516]_should_display_the_price_boost_multiple_promo`);
  });

  it("[PRPI-1516]_should_display_the_price_boost_multiple_promo", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1516]_should_display_the_price_boost_multiple_promo`)).toBe(
      0,
    );
  });
});
