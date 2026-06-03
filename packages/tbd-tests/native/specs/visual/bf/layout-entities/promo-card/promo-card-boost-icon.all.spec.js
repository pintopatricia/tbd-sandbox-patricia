const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../../helpers/urls");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { GenericViewSO, ScrollableSwimlaneSO, PromoCardSO } = require("../../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const genericViewSO = new GenericViewSO();
const firstSwimlane = new ScrollableSwimlaneSO(genericViewSO.items[0]);

const firstPromoOnFirstSwimlane = new PromoCardSO(firstSwimlane.promos[0]);

const SHORT_TITLE = "Title";
const SHORT_SUBTITLE = "Short Sub";
const SHORT_SUMMARY = "Short Summary";
const SHORT_TERMS = "Short Terms";

const IMAGE_URL = `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`;

const MARKET_ID = "924.266233830";
const SELECTION_ID = "39879518";

const PROMO_ODDSBOOST_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${MARKET_ID}`,
  promotionName: "Daily Treble Boost",
  marketType: "COMMERCIAL_ODDSBOOST",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    competition: {
      urn: "ppb:competition:2608550",
      name: "Specials",
      competitionId: 2608550,
    },
    sportevent: {
      urn: "ppb:event:26896160",
      name: "OddsBoost",
    },
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
      selectionId: SELECTION_ID,
    },
  ],

  isOddsboostMarketType: true,
  liveData: {
    __typename: "SportsbookMarketLiveData",
    urn: `ppb:sbkMarket:${MARKET_ID}`,
    sportsbookMarketStatus: "OPEN",
    bspMarket: false,
    runners: [
      {
        urn: `ppb:tbd:sbkRunnerLiveData:${MARKET_ID}/${SELECTION_ID}`,
        runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
        runnerStatus: "ACTIVE",
        odds: {
          decimal: 1.3,
          fractional: {
            numerator: 11,
            denominator: 4,
            __typename: "FractionalOdds",
          },
          __typename: "SportsbookOdds",
        },
        displayOdds: {
          decimal: 1.3,
          fractional: {
            numerator: 11,
            denominator: 4,
            __typename: "FractionalOdds",
          },
          __typename: "SportsbookOdds",
        },
        previousOdds: [
          {
            odds: {
              decimal: 1.2,
              fractional: {
                numerator: 11,
                denominator: 4,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 1.2,
              fractional: {
                numerator: 11,
                denominator: 4,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
          },
        ],

        __typename: "SportsbookRunnerLiveData",
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

const SELECTION_PROMO_CARD = {
  __typename: "SelectionPromoCard",
  urn: "ppb:tbd:card:selectionPromo:SMALL_LEFT_SIDE",
  title: SHORT_TITLE,
  subTitle: SHORT_SUBTITLE,
  promoTag: {
    iconTag: "BOOST",
  },
  theme: "LIGHT",
  promoImage: {
    url: IMAGE_URL,
  },
  termsAndConditions: {
    summary: SHORT_SUMMARY,
    link: {
      label: { __typename: "DisplayNameTitle", name: SHORT_TERMS },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
  },
  cta: {
    market: PROMO_ODDSBOOST_MARKET,
    runner: {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
    },
    displayPreviousOdd: true,
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:SWIMLANE_1",
        full: {
          edges: [
            {
              node: SELECTION_PROMO_CARD,
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "SelectionPromoCard",
                urn: "ppb:tbd:card:selectionPromo:SMALL_LEFT_SIDE",
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
        urn: "ppb:tbd:cardgroup:swimlane:SWIMLANE_1",
      },
    },
  ],
};

const APP_CONTEXT_MOCK = {
  localeCodeBcp47: "pt-BR",
  localeCode: "pt_BR",
};

const MODULE_NAME = "promo_card";

describe("PromoCard with oddsboost icon in 'pt_BR'", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await startApp("home");

    await browser.waitUntilDisplayed(firstPromoOnFirstSwimlane.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4536]_should_display_the_oddsboost_icon_in_portuguese`);
  });

  it("[PRPI-4536]_should_display_the_oddsboost_icon_in_portuguese", async () => {
    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4536]_should_display_the_oddsboost_icon_in_portuguese`))
        .misMatchPercentage,
    ).toBe(0);
  });
});
