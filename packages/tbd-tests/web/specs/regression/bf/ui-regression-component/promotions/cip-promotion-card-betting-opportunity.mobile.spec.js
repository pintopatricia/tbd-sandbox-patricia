const { PromoBannerPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const promoBannerPO = new PromoBannerPO();

const SPORT_ID = 1;

const BET_OPPORTUNITY_PROMOTION = {
  urn: "ppb:tbd:card:promotion:bo",
  __typename: "BetOpportunityPromoCard",
  theme: "LIGHT",
  ladderLevels: null,
  betOpportunityAction: {
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: "Show More",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
  },
  promoImage: {
    url: "http://example.test.com/mockedImage/image.png",
  },
  title: "Some pretty title",
  subTitle: "Some pretty sub-title",
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
                ...BET_OPPORTUNITY_PROMOTION,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: BET_OPPORTUNITY_PROMOTION.__typename,
                urn: BET_OPPORTUNITY_PROMOTION.urn,
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

  describe("And User opens a page with betting opportunity promotion", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(promoBannerPO.element);
    });

    it("[PRPI-6400] Should show betting opportunity promo banner", async () => {
      expect(await promoBannerPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6401] Should show betting opportunity promo with light theme", async () => {
      expect(await browser.containsClass(promoBannerPO.element, PromoBannerPO.themes.light)).toBe(true);
    });

    it("[PRPI-6402] Should show betting opportunity promo with backgroung image", async () => {
      expect(await promoBannerPO.element.getAttribute("style")).toContain(
        'background-image: url("http://example.test.com/mockedImage/image.png")',
      );
    });

    it("[PRPI-6403] Should show betting opportunity promo with title", async () => {
      expect(await promoBannerPO.title.getText()).toBe("SOME PRETTY TITLE");
    });

    it("[PRPI-6404] Should show betting opportunity promo with subtitle", async () => {
      const subtitleEl = await $('//*[text()="Some pretty sub-title"]');
      expect(await subtitleEl.getText()).toBe("Some pretty sub-title");
    });

    it("[PRPI-6405] Should show betting opportunity promo with action button", async () => {
      expect(await promoBannerPO.actionButton.getText()).toBe("Show More");
    });

    it("[PRPI-6406] Should not show betting opportunity promo terms and conditions information", async () => {
      expect(await promoBannerPO.fullTermsAndConditions.isExisting()).toBe(false);
    });
  });
});
