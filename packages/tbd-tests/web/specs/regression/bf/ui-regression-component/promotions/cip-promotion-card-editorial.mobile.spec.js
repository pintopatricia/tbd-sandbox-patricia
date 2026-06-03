const { PromoBannerPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const promoBannerPO = new PromoBannerPO();

const SPORT_ID = 1;

const FULL_EDITORIAL_PROMO = {
  urn: "ppb:tbd:card:editorial:full",
  __typename: "EditorialPromoCard",
  editorialAction: {
    link: {
      label: {
        name: "Some pretty text tag",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
      },
    },
  },
  promoTag: {
    label: "Some pretty text tag",
  },
  title: "Some pretty title",
  subTitle: "Some pretty sub-title",
  theme: "DARK",
  promoImage: {
    url: "http://example.test.com/mockedImage/image.png",
  },
  termsAndConditions: {
    full: "Terms & Conditions",
    link: {
      label: {
        __typename: "DisplayNameTranslationKey",
        name: "T&Cs Apply",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/betting/",
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
                ...FULL_EDITORIAL_PROMO,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: FULL_EDITORIAL_PROMO.__typename,
                urn: FULL_EDITORIAL_PROMO.urn,
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

  describe("And User opens a page with several editorial promotions", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK));
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(promoBannerPO.element);
    });

    it("[PRPI-6407] Should show first editorial promo banner", async () => {
      expect(await promoBannerPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6408] Should show first editorial promo with backgroung image", async () => {
      expect(await promoBannerPO.element.getAttribute("style")).toContain(
        'background-image: url("http://example.test.com/mockedImage/image.png")',
      );
    });

    it("[PRPI-6409] Should show first editorial promo with dark theme", async () => {
      expect(await browser.containsClass(promoBannerPO.element, PromoBannerPO.themes.dark)).toBe(true);
    });

    it("[PRPI-6410] Should show first editorial promo tag", async () => {
      expect(await promoBannerPO.tag.getText()).toBe("Some pretty text tag");
    });

    it("[PRPI-6411] Should show first editorial promo with title", async () => {
      expect(await promoBannerPO.title.getText()).toBe("SOME PRETTY TITLE");
    });

    it("[PRPI-6412] Should show first editorial promo with subtitle", async () => {
      const subtitleEl = await $('//*[text()="Some pretty sub-title"]');
      expect(await subtitleEl.getText()).toBe("Some pretty sub-title");
    });

    it("[PRPI-6413] Should show first editorial promo with full terms and conditions information", async () => {
      expect(await promoBannerPO.fullTermsAndConditions.getText()).toBe("Some summary for terms and conditions");
    });
  });
});
