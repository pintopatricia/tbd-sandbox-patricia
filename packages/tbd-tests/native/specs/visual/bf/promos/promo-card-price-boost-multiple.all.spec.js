const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { SportPageScreenSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();

const SPORT_ID = 1;

const sportPagePO = new SportPageScreenSO();

const MARKET_ID = "924.266233830";
const SELECTION_ID = "39879518";
const BETTING_OPPORTUNITY_ID = "bo-1|1|0|0";

const PRICE_BOOST_PROMO_CARD = {
  __typename: "PriceBoostMultiplePromoCard",
  urn: "ppb:tbd:card:priceboostmultiplepromocard:pph/B10G10ASCOTSTAT3",
  title: "SOME TITLE",
  subTitle: "SOME SUBTITLE",
  theme: "DARK",
  promoTag: null,
  priceBoostMultipleImage: null,
  popularbettingopportunity: {
    __typename: "PopularBettingOpportunity",
    urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
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
  termsAndConditions: {
    __typename: "PromoTermsAndConditions",
    link: null,
    summary: "The hidden law of a probable outcome",
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

  winAverageOdds: 4.3,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 4.3 },
    trueOdds: {
      decimalOdds: { decimalOdds: 4.3 },
    },
  },
  averageOdds: 4.3,
};

const FIRST_SELECTION_ODDS = {
  runner: {
    marketId: MARKET_ID,
    selectionId: SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4.3 },
    },
    fractionalDisplayOdds: { numerator: 4, denominator: 3 },
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
    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_CARD));
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(sportPagePO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-4875]_should_display_price_boost_multiple_promo_card_with_visible_bet_button`,
    );
  });

  it("[PRPI-4875]_should_display_price_boost_multiple_promo_card_with_visible_bet_button", async () => {
    expect(
      (
        await browser.compareScreen(
          `${MODULE_NAME}_[PRPI-4875]_should_display_price_boost_multiple_promo_card_with_visible_bet_button`,
        )
      ).misMatchPercentage,
    ).toEqual(0);
  });
});
