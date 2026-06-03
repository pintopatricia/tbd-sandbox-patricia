const { getImsPromotionLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const BFF_IMS_PROMO = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  edges: [
    {
      node: {
        __typename: "ImsPromotionErrorCard",
        urn: "ppb:tbd:card:imsPromotionError:gaming-promotion-1",
        errorCode: "ALREADY_COMPLETED",
        seeAll: {},
      },
    },
  ],
};

const MODULE_NAME = "ims-promotions";

describe("When the user is on a Promo Error Message page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1381]_should_render_promo_error_card`);
  });

  it("[PRPI-1381]_should_render_promo_error_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1381]_should_render_promo_error_card`)).toBe(0);
  });
});
