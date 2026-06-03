const {
  SportPagePO,
  PromotionCardPO,
  ScrollableSwimlanePO,
  PromotionTitlesPO,
} = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const promotionsSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const promotionFirstCardPO = new PromotionCardPO(promotionsSwimlanePO.scrollItems[0]);
const promotionTitlesFirstCardPO = new PromotionTitlesPO(promotionFirstCardPO.element);

const BFF_HOME_PAGE_MOCK = {
  title: "Home",
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
        full: {
          edges: [
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:mi/Y3JXshAAAPUOQrZ3",
                promotionContentType: "MOVABLE_INK",
                promoTypeLabel: null,
                promotionName: null,
                headline: null,
                subHeadline: null,
                strapline: null,
                promotionTitle: null,
                backgroundImage: [
                  {
                    url: "http://example.test.com/mockedImage/image.png",
                    width: 0,
                    height: 0,
                    tag: null,
                  },
                ],

                termsAndConditions: {
                  summary: "Tries Markets",
                  url: "https://promos.betfair.com/promotion?promoCode=day1claim2wc",
                  label: {
                    __typename: "DisplayNameTitle",
                    name: "TC’s apply",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:external:external",
                    viewUrl: "https://promos.betfair.com/promotion?promoCode=day1claim2wc",
                    viewDisplayMode: "BLANK_INAPP",
                  },
                },
                isImsPromo: false,
                label: "Click here",
                viewLink: {
                  viewUrn: "ppb:tbd:view:external:external",
                  viewUrl: "https://www.betfair.com/betting/football/s-1",
                  viewDisplayMode: "BLANK_INAPP",
                },
                introLine: null,
                endDate: null,
                optInState: "NOT_OPTED_IN",
                tags: [],
                hasBetfairBoost: false,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:mi/Y3JXshAAAPUOQrZ3",
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
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
      },
    },
  ],
};

describe("Promotions", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_HOME_PAGE_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_PAGE_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
  });

  describe("When the user is in the Promotion swimlane and there's a MovableInk Promo", () => {
    beforeAll(async () => {
      await browser.url(routes.getHomeViewUrl());
    });

    it("[PRPI-6444] The card's image should be displayed", async () => {
      expect(await promotionFirstCardPO.image.isDisplayed()).toBe(true);
    });

    it("[PRPI-6445] The header should not be displayed", async () => {
      expect(await promotionFirstCardPO.header.isDisplayed()).toBe(false);
    });

    it("[PRPI-6446] The title should not be rendered in the card", async () => {
      expect(await promotionTitlesFirstCardPO.title.isDisplayed()).toBe(false);
    });

    it("[PRPI-6447] The subtitle should not be rendered in the card", async () => {
      expect(await promotionTitlesFirstCardPO.subtitle.isDisplayed()).toBe(false);
    });

    it("[PRPI-6448] The summary should not be displayed", async () => {
      expect(await promotionFirstCardPO.summary.isDisplayed()).toBe(false);
    });

    it("[PRPI-6449] The T&C link label should show the correct label", async () => {
      expect(await promotionFirstCardPO.termsAndConditionsLink.getText()).toEqual("TC’s apply");
    });

    it("[PRPI-6450] The 'T&C Apply' link should be rendered in the card", async () => {
      expect(await promotionFirstCardPO.termsAndConditionsLink.isDisplayed()).toBe(true);
    });

    it("[PRPI-6451] The actionButton should not be displayed", async () => {
      expect(await promotionFirstCardPO.actionButton.isDisplayed()).toBe(false);
    });

    it("[PRPI-6452] The movable ink's image anchor html element should exist in the DOM", async () => {
      expect(await promotionFirstCardPO.MIHref.isExisting()).toBe(true);
    });

    describe("When the user clicks on the image, outside the T&C's", () => {
      beforeAll(async () => {
        await promotionFirstCardPO.image.click();
      });

      it("[PRPI-6453] The user should be redirected to the url configured", async () => {
        const url = await browser.getUrl();

        expect(url.toString().includes("football")).toBe(true, `${url} does not contain football`);
      });
    });

    describe("When the user clicks on the T&C's link", () => {
      beforeAll(async () => {
        await browser.url(routes.getHomeViewUrl());
        await promotionFirstCardPO.termsAndConditionsLink.click();
      });

      it("[PRPI-6454] The user should be redirected to the T&C page", async () => {
        const url = await browser.getUrl();

        expect(url.toString().includes("promotion?promoCode")).toBe(true, `${url} does not contain promoCode`);
      });
    });
  });
});
