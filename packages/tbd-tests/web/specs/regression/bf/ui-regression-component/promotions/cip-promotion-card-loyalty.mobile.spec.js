const { SportPagePO, PromoBannerPO, ScrollableSwimlanePO, PromoCardPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const cipPromotionsSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const promoBannerPO = new PromoBannerPO();
const promotionCardPO = new PromoCardPO();

const SPORT_ID = 1;

const LOYALTY_PROMOTION = {
  urn: "ppb:tbd:card:loyaltyPromo:pph/CHECKMATE1|LIGHT",
  __typename: "LoyaltyPromoCard",
  theme: "LIGHT",
  loyaltyPromotion: {
    urn: "ppb:tbd:loyaltyPromotion:pph/CHECKMATE1",
    name: "Get a free £5 bet when you place a £5 bet",
    title: "Spanish La Liga",
    promoImage: {
      url: "http://example.test.com/mockedImage/image.png",
    },
    termsAndConditions: {
      summary: "Opt-in required. Max £5 Free Bet, valid 2 days on Sports.",
      link: {
        label: {
          __typename: "DisplayNameTranslationKey",
          name: "T&Cs Apply",
        },
        viewLink: {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://promos.betfair.com/promotion?promoCode=CHECKMATE1",
          viewDisplayMode: "BLANK_INAPP",
        },
      },
    },
    state: {
      optInState: "NOT_OPTED_IN",
      label: {
        __typename: "DisplayNameTitle",
        name: "I18N.PROMO.STATE.LABEL.PROMOTION",
      },
      link: {
        label: {
          __typename: "DisplayNameTitle",
          name: "Opt In or Check Progress with more long text",
        },
        viewLink: {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://promos.betfair.com/sport",
          viewDisplayMode: "BLANK_INAPP",
        },
      },
    },
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
                ...LOYALTY_PROMOTION,
              },
            },
            {
              node: {
                ...LOYALTY_PROMOTION,
                urn: "ppb:tbd:card:loyaltyPromo:pph/CHECKMATE3|LIGHT",
                loyaltyPromotion: {
                  ...LOYALTY_PROMOTION.loyaltyPromotion,
                  urn: "ppb:tbd:loyaltyPromotion:pph/CHECKMATE3",
                  promoImage: undefined,
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: LOYALTY_PROMOTION.__typename,
                urn: LOYALTY_PROMOTION.urn,
              },
            },
            {
              node: {
                __typename: LOYALTY_PROMOTION.__typename,
                urn: "ppb:tbd:card:loyaltyPromo:pph/CHECKMATE3|LIGHT",
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

describe("Promotions - When application has brandSetting ENABLE_CIP_BANNER enabled", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_SPORT_PAGE_MOCK.urn, {
        brandSettings: {
          ENABLE_CIP_BANNER: true,
        },
      }),
    );
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
  });

  describe("And User opens a page with several loyalty promotions", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(promoBannerPO.element);
    });

    it("[PRPI-6414] Should show 2 promotions on swimlane", async () => {
      expect(await cipPromotionsSwimlanePO.scrollItems.length).toBe(2);
    });

    it("[PRPI-6415] Should show 1 promotion card on swimlane for promo without bannerImage", async () => {
      expect(await promotionCardPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6416] Should show first loyalty promo banner", async () => {
      expect(await promoBannerPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6417] Should show first loyalty promo with backgroung image", async () => {
      expect(await promoBannerPO.element.getAttribute("style")).toContain(
        'background-image: url("http://example.test.com/mockedImage/image.png")',
      );
    });

    it("[PRPI-6418] Should show first loyalty promo with light theme", async () => {
      expect(await browser.containsClass(promoBannerPO.element, PromoBannerPO.themes.light)).toBe(true);
    });

    it("[PRPI-6419] Should show first loyalty promo with title", async () => {
      expect(await promoBannerPO.title.getText()).toBe("GET A FREE £5 BET WHEN YOU PLACE A £5 BET");
    });

    it("[PRPI-6420] Should show first loyalty promo with subtitle", async () => {
      const subtitleEl = await $('//*[text()="Spanish La Liga"]');
      expect(await subtitleEl.getText()).toBe("Spanish La Liga");
    });

    it("[PRPI-6421] Should show loyalty checkbox", async () => {
      expect(await promoBannerPO.optInContainer.getText()).toBe("Opt In or Check Progress with more long text");
    });

    it("[PRPI-6422] Should show first loyalty promo with full terms and conditions information", async () => {
      expect(await promoBannerPO.fullTermsAndConditions.getText()).toBe(
        "Opt-in required. Max £5 Free Bet, valid 2 days on Sports. T&C Apply",
      );
    });
  });
});
