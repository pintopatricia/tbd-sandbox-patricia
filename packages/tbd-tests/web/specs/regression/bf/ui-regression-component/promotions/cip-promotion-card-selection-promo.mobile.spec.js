const {
  SportPagePO,
  PromoBannerPO,
  PromotedPricePO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const promoBannerPO = new PromoBannerPO();
const promotedPricePO = new PromotedPricePO();
const cipPromotionsSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const secondPromoCard = new PromoBannerPO(cipPromotionsSwimlanePO.scrollItems[1]);

const secondCardBetButtonPO = new SportsbookBetButtonPO(secondPromoCard.betButton);

const MARKET_ID = "924.266233830";
const MARKET_ID_2 = "924.266233831";
const SELECTION_ID = 39879518;
const SELECTION_ID_2 = 39879519;
const SPORT_ID = 1;
const EVENT_ID = 221;
const COMPETITION_ID = 2608550;

const BFF_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${MARKET_ID}`,
  promotionName: "Daily Treble Boost",
  marketType: "COMMERCIAL_ODDSBOOST",
  name: "Anytime Goalscorer",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "Specials",
      competitionId: COMPETITION_ID,
    },
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
      name: "OddsBoost",
    },
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
      selectionId: SELECTION_ID,
      name: "Selection Name that is very long",
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

const BFF_MARKET_NON_BOOSTED = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${MARKET_ID_2}`,
  promotionName: "Daily Treble Boost",
  marketType: "COMMERCIAL_ODDSBOOST",
  name: "Anytime Goalscorer",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    competition: {
      urn: `ppb:competition:${COMPETITION_ID}`,
      name: "Specials",
      competitionId: COMPETITION_ID,
    },
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
      name: "OddsBoost",
    },
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_2}`,
      selectionId: SELECTION_ID,
      name: "Selection Name that is very long",
    },
  ],

  isOddsboostMarketType: undefined,
  liveData: {
    __typename: "SportsbookMarketLiveData",
    urn: `ppb:sbkMarket:${MARKET_ID_2}`,
    sportsbookMarketStatus: "OPEN",
    bspMarket: false,
    runners: [
      {
        urn: `ppb:tbd:sbkRunnerLiveData:${MARKET_ID_2}/${SELECTION_ID_2}`,
        runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_2}`,
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

const SELECTION_PROMO_CARD_BOOSTED = {
  __typename: "SelectionPromoCard",
  urn: "ppb:tbd:card:selectionPromo:pph/B10G10ASCOTSTAT5",
  theme: "LIGHT",
  title: "Some pretty selection title",
  subTitle: "Some pretty selection sub-title",
  promoTag: {
    iconTag: "BOOST",
  },
  selectionImage: {
    url: "http://example.test.com/mockedImage/image.png",
  },
  cta: {
    runner: {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
    },
    displayPreviousOdd: true,
    market: {
      ...BFF_MARKET,
    },
  },
  termsAndConditions: {
    full: "Terms & Conditions",
    summary: "Some summary for terms and conditions",
  },
};

const SELECTION_PROMO_CARD_NON_BOOSTED = {
  __typename: "SelectionPromoCard",
  urn: "ppb:tbd:card:selectionPromo:pph/B10G10ASCOTSTAT4",
  theme: "LIGHT",
  title: "Some pretty selection title",
  subTitle: "Some pretty selection sub-title",
  selectionImage: {
    url: "http://example.test.com/mockedImage/image.png",
  },
  cta: {
    runner: {
      runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_2}`,
    },
    displayPreviousOdd: true,
    market: {
      ...BFF_MARKET_NON_BOOSTED,
    },
  },
  termsAndConditions: {
    full: "Terms & Conditions",
    summary: "Some summary for terms and conditions",
  },
};

const BFF_SPORT_PAGE_MOCK = {
  title: "Football",
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:SWIMLANE_1",
        full: {
          edges: [
            {
              node: {
                ...SELECTION_PROMO_CARD_BOOSTED,
              },
            },
            {
              node: {
                ...SELECTION_PROMO_CARD_NON_BOOSTED,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: SELECTION_PROMO_CARD_BOOSTED.__typename,
                urn: SELECTION_PROMO_CARD_BOOSTED.urn,
              },
            },
            {
              node: {
                __typename: SELECTION_PROMO_CARD_NON_BOOSTED.__typename,
                urn: SELECTION_PROMO_CARD_NON_BOOSTED.urn,
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

describe("Promotions - When application has brandSetting ENABLE_CIP_BANNER enabled", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_SPORT_PAGE_MOCK.urn, {
        brandSettings: {
          ENABLE_CIP_BANNER: true,
        },
      }),
    );
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
  });

  describe("And User opens a page with several selection card promotions", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(promoBannerPO.element);
      await browser.waitUntilEquals(promotedPricePO.currentOdds, "1.3");
    });

    it("[PRPI-6433] Should show 2 promo on swimlane", async () => {
      expect(await cipPromotionsSwimlanePO.scrollItems.length).toBe(2);
    });

    it("[PRPI-6434] Should show selection card promotion banner", async () => {
      expect(await promoBannerPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6435] Should show first price boost multi promo with light theme", async () => {
      expect(await browser.containsClass(promoBannerPO.element, PromoBannerPO.themes.light)).toBe(true);
    });

    it("[PRPI-6436] Should show selection card promotion with backgroung image", async () => {
      expect(await promoBannerPO.element.getAttribute("style")).toContain(
        'background-image: url("http://example.test.com/mockedImage/image.png")',
      );
    });

    it("[PRPI-6437] Should show first price boost multi promo tag", async () => {
      expect(await promoBannerPO.tag.isDisplayed()).toBe(true);
    });

    it("[PRPI-6438] Should show selection card promotion with title", async () => {
      expect(await promoBannerPO.title.getText()).toBe("SOME PRETTY SELECTION TITLE");
    });

    it("[PRPI-6439] Should show selection card promotion with subtitle", async () => {
      const subtitleEl = await $('//*[text()="Some pretty selection sub-title"]');
      expect(await subtitleEl.getText()).toBe("Some pretty selection sub-title");
    });

    it("[PRPI-6440] Should show selection card promotion tag", async () => {
      expect(await promoBannerPO.tag.isDisplayed()).toBe(true);
    });

    it("[PRPI-6441] Should show selection card promotion with full terms and conditions information", async () => {
      expect(await promoBannerPO.fullTermsAndConditions.getText()).toBe("Some summary for terms and conditions");
    });

    it("[PRPI-6442] The promoted price in the boosted card should display both prices", async () => {
      expect(await promotedPricePO.currentOdds.getText()).toBe("1.3");
      expect(await promotedPricePO.previousOdds.getText()).toBe("1.2");
    });

    it("[PRPI-6443] The bet button in non-boosted card should display just the odds", async () => {
      await secondPromoCard.element.scrollIntoView();

      expect(await secondCardBetButtonPO.odd.getText()).toBe("1.3");
      expect(await secondCardBetButtonPO.secondaryLabel.isDisplayed()).toBe(false);
    });
  });
});
