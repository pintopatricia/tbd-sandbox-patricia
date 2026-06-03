const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getGenericLayout, getMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../../helpers/urls");
const MockService = require("../../../../../mock-essentials/mocking-service");
const {
  GenericViewSO,
  SportsbookBetButtonSO,
  SportsbookPlacePanelSO,
  BetDetailsSO,
  FixedNumberInputFieldSO,
  PromoCardSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const genericViewSO = new GenericViewSO();
const firstPromo = new PromoCardSO(genericViewSO.items[0]);
const secondPromo = new PromoCardSO(genericViewSO.items[1]);
const thirdPromo = new PromoCardSO(genericViewSO.items[2]);
const oddsBoostButton = new SportsbookBetButtonSO(secondPromo.oddsBoostButton);

const sportsbookSinglePlacePanelSO = new SportsbookPlacePanelSO();
const betDetailsSO = new BetDetailsSO(sportsbookSinglePlacePanelSO.element);
const sportsbookPriceInputSO = new FixedNumberInputFieldSO();

const SWIMLANE_1_PROMO_TITLE_1 = "This is the biggest";

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
  name: "Daily Treble Boost",
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

const BET_OPPORTUNITY_PROMO_CARD = {
  __typename: "BetOpportunityPromoCard",
  urn: "ppb:tbd:card:betOpportunityPromo:SMALL_LEFT_SIDE",
  title: SHORT_TITLE,
  subTitle: SHORT_SUBTITLE,
  theme: "LIGHT",
  promoImage: {
    url: IMAGE_URL,
  },
  ladderLevels: null,
  betOpportunityAction: {
    link: {
      label: { __typename: "DisplayNameTitle", name: "Show More" },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
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
};

const EDITORIAL_PROMO_CARD = {
  __typename: "EditorialPromoCard",
  urn: "ppb:tbd:card:editorialPromo:SWIMLANE_1_EDITORIAL_1",
  title: SWIMLANE_1_PROMO_TITLE_1,
  subTitle: "H1 with 24px in 1 line",
  theme: "DARK",
  promoImage: {
    url: IMAGE_URL,
  },
  editorialAction: null,
  promoTag: {
    iconTag: "TIMEFORM",
  },
  termsAndConditions: { summary: SHORT_SUMMARY },
};

const SELECTION_PROMO_CARD = {
  __typename: "SelectionPromoCard",
  urn: "ppb:tbd:card:selectionPromo:SMALL_LEFT_SIDE",
  title: SHORT_TITLE,
  subTitle: SHORT_SUBTITLE,
  theme: "LIGHT",
  selectionImage: {
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
      node: EDITORIAL_PROMO_CARD,
    },
    {
      node: SELECTION_PROMO_CARD,
    },
    {
      node: BET_OPPORTUNITY_PROMO_CARD,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: EDITORIAL_PROMO_CARD.__typename,
        urn: EDITORIAL_PROMO_CARD.urn,
      },
    },
    {
      node: {
        __typename: SELECTION_PROMO_CARD.__typename,
        urn: SELECTION_PROMO_CARD.urn,
      },
    },
    {
      node: {
        __typename: BET_OPPORTUNITY_PROMO_CARD.__typename,
        urn: BET_OPPORTUNITY_PROMO_CARD.urn,
      },
    },
  ],
};

const IMPLY_MOCK = {
  betCombinations: [
    {
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
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: MARKET_ID,
        selectionId: SELECTION_ID,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.3 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.3,
        },
      },
    },
  ],
};

const BFF_MARKETS_MOCK = {
  markets: [
    {
      __typename: "SportsbookMarket",
      urn: PROMO_ODDSBOOST_MARKET.urn,
      isOddsboostMarketType: true,
      runners: [
        {
          runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
          selectionId: SELECTION_ID,
          name: "Some Runner Name",
        },
      ],

      hierarchy: PROMO_ODDSBOOST_MARKET.hierarchy,
    },
  ],
};

describe("Promotions - When application has brandSetting ENABLE_CIP_BANNER disabled", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
    await mockService.mockHttpRequest(getMarkets(BFF_MARKETS_MOCK));
    await startApp("home");

    await browser.waitUntilDisplayed(genericViewSO.element);
  });

  it("[PRPI-4143] should show 3 promo cards", async () => {
    expect(await genericViewSO.items.length).toBe(3);
  });

  it("[PRPI-4145] should show first promo banner with all information", async () => {
    expect(await firstPromo.title.getText()).toBe("THIS IS THE BIGGEST");
    expect(await firstPromo.subtitle.getText()).toBe("H1 with 24px in 1 line");
    expect(await firstPromo.summary.getText()).toBe("Short Summary");
  });

  it("[PRPI-4146] should show second promo banner with all information", async () => {
    expect(await secondPromo.title.getText()).toBe("TITLE");
    expect(await secondPromo.subtitle.getText()).toBe("Short Sub");
    expect(await oddsBoostButton.odd.getText()).toBe("1.3");
    expect(await oddsBoostButton.secondaryLabel.getText()).toBe("1.2");
    expect(await secondPromo.summary.getText()).toBe("Short Summary Short Terms");
  });

  it("[PRPI-4147] should show third promo banner with all information", async () => {
    expect(await thirdPromo.title.getText()).toBe("TITLE");
    expect(await thirdPromo.subtitle.getText()).toBe("Short Sub");
    expect(await thirdPromo.statusLabel.getText()).toBe("Show More");
    expect(await thirdPromo.summary.getText()).toBe("Short Summary Short Terms");
  });

  describe("When user clicks on bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(oddsBoostButton.element);
      await oddsBoostButton.element.click();
      await browser.waitUntilDisplayed(betDetailsSO.element);
      await browser.waitUntilEquals(sportsbookPriceInputSO.numberField, "1.3");
    });

    it("[PRPI-3584] The betslip should exist", async () => {
      expect(await betDetailsSO.element.isExisting()).toBe(true);
    });

    it("[PRPI-3585] The betslip should be opened with correct title", async () => {
      expect(await betDetailsSO.title.getText()).toBe("Some Runner Name");
    });

    it("[PRPI-3586] The betslip should be opened with correct subtitle", async () => {
      expect(await betDetailsSO.subtitle.getText()).toBe("Match Odds - OddsBoost");
    });

    it("[PRPI-3587] The betslip should be opened with correct oddsboost price", async () => {
      expect(await sportsbookPriceInputSO.numberField.getText()).toBe("1.3");
    });

    it("[PRPI-3588] The betslip should be opened with correct previous odd", async () => {
      expect(await sportsbookPriceInputSO.previousValue.getText()).toBe("1.2");
    });
  });
});
