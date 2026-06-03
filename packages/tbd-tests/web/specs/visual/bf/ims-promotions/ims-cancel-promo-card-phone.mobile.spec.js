const { ActionLinkPO, OngoingPromoCardPO } = require("../../../../page-objects");

const { getImsPromotionLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const ongoingPromoCardPO = new OngoingPromoCardPO();
const cancelButtonPO = new ActionLinkPO(ongoingPromoCardPO.buttons[0]);

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
          status: "OPTED_IN",
          layout: "ACCEPT",
          headline: "Promo Title",
          subHeadline: "This is a mocked promotion",
          image: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {},
          },
          wageringLeft: 100,
          currentBonusBalance: 2,
          amountOnPendingWinnings: 1,
          timeLeft: 100,
          goldenChips: {
            initialGoldenChips: 5,
            remainingGoldenChips: 1,
            goldenChipsAmount: 2,
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
              span: [
                {
                  start: 0,
                  end: 10,
                  style: "strong",
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

const MODULE_NAME = "ims-promotions";

describe("When the user is on a Ongoing Ims promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(cancelButtonPO.element);
    await cancelButtonPO.element.click();
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1374]_should_render_cancel_promo_card`);
  });

  it("[PRPI-1374]_should_render_cancel_promo_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1374]_should_render_cancel_promo_card`)).toBe(0);
  });
});
