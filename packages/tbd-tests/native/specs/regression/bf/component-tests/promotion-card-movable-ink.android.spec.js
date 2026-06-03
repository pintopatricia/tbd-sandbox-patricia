const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { GenericScreenSO, PromotionCardSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");

const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const genericScreenSO = new GenericScreenSO();

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
                    url: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
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
                  viewUrn: "ppb:tbd:view:sport:1",
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
  describe("When user enters a view with promo swimlane", () => {
    const firstPromotionCardSO = new PromotionCardSO(genericScreenSO.promotionCards[0]);

    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_PAGE_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(firstPromotionCardSO.element);
    });

    it("[PRPI-2390] The first promotion card should be displayed", async () => {
      expect(await firstPromotionCardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2391] The title should be not displayed", async () => {
      expect(await firstPromotionCardSO.name.isDisplayed()).toBe(false);
    });

    it("[PRPI-2392] The subtitle should be not displayed", async () => {
      expect(await firstPromotionCardSO.title.isDisplayed()).toBe(false);
    });

    it("[PRPI-2393] The T&C link should be rendered with correct label", async () => {
      expect(await firstPromotionCardSO.termsLabel.getText()).toBe("TC’s apply");
    });

    it("[PRPI-2394] The T&C link should be pressable", async () => {
      expect(await firstPromotionCardSO.termsPressable.isDisplayed()).toBe(true);
    });
  });
});
