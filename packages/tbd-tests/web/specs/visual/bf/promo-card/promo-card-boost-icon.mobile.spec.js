const { SportPagePO } = require("../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const SPORT_ID = 1;

const sportPagePO = new SportPagePO();

const MEDIUM_TITLE = "HE DEALS THE CARDS AS A MEDITATION";

const SHORT_SUBTITLE = "Shape of my Heart";

const SHORT_SUMMARY = "The hidden law of a probable outcome";

const SHORT_TERMS = "Terms and Conditions";

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
      name: "Ciro Immobile, Lorenzo Insigne and Breel Embolo to have 1 or more shots on target each",
      selectionId: SELECTION_ID,
    },
  ],

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
  isOddsboostMarketType: true,
};

const SELECTION_PROMO_CARD = {
  __typename: "SelectionPromoCard",
  urn: "ppb:tbd:card:selectionPromo:pph/B10G10ASCOTSTAT3",
  title: MEDIUM_TITLE,
  subTitle: SHORT_SUBTITLE,
  theme: "DARK",
  termsAndConditions: {
    summary: SHORT_SUMMARY,
    link: {
      label: { name: SHORT_TERMS, __typename: "DisplayNameTitle" },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
  },
  promoTag: {
    iconTag: "BOOST",
  },
  cta: {
    market: PROMO_ODDSBOOST_MARKET,
    runner: {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
    },
    displayPreviousOdd: true,
  },
};

const BFF_SPORT_PAGE_MOCK_1_CARD = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
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
                urn: "ppb:tbd:card:selectionPromo:pph/B10G10ASCOTSTAT3",
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

const MODULE_NAME = "promo_card";

describe("PromoCard with oddsboost icon in 'pt_BR'", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK_1_CARD.urn, { localeCode: "pt_BR" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK_1_CARD));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1515]_should_display_the_oddsboost_icon_in_portuguese`);
  });

  it("[PRPI-1515]_should_display_the_oddsboost_icon_in_portuguese", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1515]_should_display_the_oddsboost_icon_in_portuguese`),
    ).toEqual(0);
  });
});
