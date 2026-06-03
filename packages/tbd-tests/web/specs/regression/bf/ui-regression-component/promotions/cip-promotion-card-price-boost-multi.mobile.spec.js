const {
  SportPagePO,
  PromoBannerPO,
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
const cipPromotionsSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const promoBannerPO = new PromoBannerPO();

const betButtonPO = new SportsbookBetButtonPO();

const MARKET_ID = "924.266233830";
const SELECTION_ID = 39879518;
const SPORT_ID = 1;
const BETTING_OPPORTUNITY_ID = "bo-1";

const PRICE_BOOST_MULTI_PROMOTION = {
  __typename: "PriceBoostMultiplePromoCard",
  urn: "ppb:tbd:card:priceboostmultiplepromocard:pph/B10G10ASCOTSTAT3",
  title: "Some pretty title",
  subTitle: "Some pretty sub-title",
  promoTag: {
    __typename: "PromoIconTag",
    iconTag: "BOOST",
  },
  priceBoostMultipleImage: {
    url: "http://example.test.com/mockedImage/image.png",
  },
  popularbettingopportunity: {
    __typename: "PopularBettingOpportunity",
    urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
    count: 12345,
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
    link: {
      __typename: "LabeledLink",
      label: null,
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
        viewDisplayMode: null,
      },
    },
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
                ...PRICE_BOOST_MULTI_PROMOTION,
              },
            },
            {
              node: {
                ...PRICE_BOOST_MULTI_PROMOTION,
                urn: "ppb:tbd:card:priceboostmultiplepromocard:pph/B10G10ASCOTSTAT4",
                priceBoostMultipleImage: undefined,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: PRICE_BOOST_MULTI_PROMOTION.__typename,
                urn: PRICE_BOOST_MULTI_PROMOTION.urn,
              },
            },
            {
              node: {
                __typename: PRICE_BOOST_MULTI_PROMOTION.__typename,
                urn: "ppb:tbd:card:priceboostmultiplepromocard:pph/B10G10ASCOTSTAT4",
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
      combinationGroupId: BETTING_OPPORTUNITY_ID,
      winAvgOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.3 },
        },
        prettyDisplayOdds: {
          decimalOdds: { decimalOdds: 1.3 },
        },
      },
      originalWinAvgOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.2,
        },
      },
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
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
  });

  describe("And User opens a page with several price boost multi promotions", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(promoBannerPO.element);
    });

    it("[PRPI-6423] Should show 2 promotions on swimlane", async () => {
      expect(await cipPromotionsSwimlanePO.scrollItems.length).toBe(2);
    });

    it("[PRPI-6424] Should show 1 promo banner on swimlane for promo without bannerImage", async () => {
      expect(await promoBannerPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6425] Should show first price boost multi promo banner", async () => {
      expect(await promoBannerPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6426] Should show first price boost multi promo with backgroung image", async () => {
      expect(await promoBannerPO.element.getAttribute("style")).toContain(
        'background-image: url("http://example.test.com/mockedImage/image.png")',
      );
    });

    it("[PRPI-6427] Should show first price boost multi promo with dark theme", async () => {
      expect(await browser.containsClass(promoBannerPO.element, PromoBannerPO.themes.dark)).toBe(true);
    });

    it("[PRPI-6428] Should show first price boost multi promo with title", async () => {
      expect(await promoBannerPO.title.getText()).toBe("SOME PRETTY TITLE");
    });

    it("[PRPI-6429] Should show first price boost multi promo with subtitle", async () => {
      const subtitleEl = await $('//*[text()="Some pretty sub-title"]');
      expect(await subtitleEl.getText()).toBe("Some pretty sub-title");
    });

    it("[PRPI-6430] Should show first price boost multi promo tag", async () => {
      expect(await promoBannerPO.tag.isDisplayed()).toBe(true);
    });

    it("[PRPI-6431] Should show first price boost multi promo with full terms and conditions information", async () => {
      expect(await promoBannerPO.fullTermsAndConditions.getText()).toBe("Some summary for terms and conditions");
    });

    it("[PRPI-6432] The bet button should display bet price", async () => {
      expect(await betButtonPO.odd.getText()).toBe("1.3");
    });
  });
});
