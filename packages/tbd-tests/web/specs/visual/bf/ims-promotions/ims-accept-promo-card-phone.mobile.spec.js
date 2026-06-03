const { AcceptPromoCardPO, AlertPO } = require("../../../../page-objects");
const { getImsPromotionLayout, getAcceptImsPromotion } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const acceptPromoCardPO = new AcceptPromoCardPO();
const alertPO = new AlertPO();

const mockService = new MockService();

const BFF_IMS_PROMO = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Best promotion ever",
        promotion: {
          status: "NOT_OPTED_IN",
          layout: "ACCEPT",
          headline: "Promo Title",
          subHeadline: "This is a mocked promotion",
          image: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {},
          },
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionDetails:gaming-promotion-1",
        __typename: "ImsPromotionDetailsCard",
        title: "Details",
        promotion: {
          details: [
            {
              span: [
                {
                  start: 0,
                  end: 10,
                  style: "strong",
                },
              ],

              type: "paragraph",
              text: "Mocked Details",
            },
          ],
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionTermsAndConditions:gaming-promotion-1",
        __typename: "ImsPromotionTermsAndConditionsCard",
        title: "Terms & Conditions",
        promotion: {
          termsAndConditions: [
            {
              spans: [
                {
                  start: 0,
                  end: 27,
                  style: "hyperlink",
                  url: "mockedLink",
                },
              ],

              type: "paragraph",
              text: "Mocked Terms and Conditions",
            },
          ],
        },
      },
    },
  ],

  partialEdges: [{ node: { __typename: "ImsPromotionStateCard" } }],
};

const ACCEPT_BONUS_MOCK = {
  responseCode: -1,
  promotion: {
    status: "NOT_OPTED_IN",
    layout: "ACCEPT",
    urn: "ppb:imsPromotion:gaming-promotion-1",
    bonusInstanceCode: "1000",
  },
};

const MODULE_NAME = "ims-promotions";

describe("When the user is on an Accept Ims promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1371]_should_render_accept_promo_card`);
  });

  it("[PRPI-1371]_should_render_accept_promo_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1371]_should_render_accept_promo_card`)).toBe(0);
  });

  describe("When user taps on Accept button and there is an error with services", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAcceptImsPromotion(ACCEPT_BONUS_MOCK));
      await acceptPromoCardPO.button.click();
      await alertPO.element.waitForDisplayed({ timeout: 5000, timeoutMsg: "Notification error not displayed" });
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1372]_should_render_accept_promo_card_with_error_message`,
      );
    });

    it("[PRPI-1372]_should_render_accept_promo_card_with_error_message", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1372]_should_render_accept_promo_card_with_error_message`),
      ).toBe(0);
    });
  });
});

describe("When user taps on Accept button from logged out state", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn, { loggedIn: "false" }));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1373]_should_render_accept_promo_card_in_logged_out_state`,
    );
  });

  it("[PRPI-1373]_should_render_accept_promo_card_in_logged_out_state", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1373]_should_render_accept_promo_card_in_logged_out_state`),
    ).toBe(0);
  });
});
