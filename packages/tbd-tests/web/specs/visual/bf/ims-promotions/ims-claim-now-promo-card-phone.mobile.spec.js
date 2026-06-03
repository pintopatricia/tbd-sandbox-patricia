const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
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
  title: "Claim Now Promotion",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Claim Now Promotion",
        promotion: {
          status: "NOT_OPTED_IN",
          layout: "BUY_IN",
          headline: "Claim Now",
          ctaText: "Claim Now",
          subHeadline: "This is a mocked Claim Now promotion",
          image: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {},
          },
          buyIn: {
            buyInMinValue: 5,
            buyInMaxValue: 10,
            intervals: {
              min: 5,
              max: 10,
              percentage: 50,
            },
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:imsPromotionEligibleGames:gaming-promotion-1",
        cardGroupTitle: "Featured Eligible Games",
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:game:game-0",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Game 0",
                  __typename: "Game",
                  urn: "ppb:game:game-0",
                  backgroundColor: "#B22222",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-1",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Game 1",
                  __typename: "Game",
                  urn: "ppb:game:game-1",
                  backgroundColor: "#B22222",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Game 2",
                  __typename: "Game",
                  urn: "ppb:game:game-2",
                  backgroundColor: "#B22222",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:game:game-0",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-1",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-3",
                __typename: "GameCard",
              },
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

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

const MODULE_NAME = "ims-promotions";

describe("When the user is on an Claim Now Ims promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1375]_should_render_claim_now_promo_card`);
  });

  it("[PRPI-1375]_should_render_claim_now_promo_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1375]_should_render_claim_now_promo_card`)).toBe(0);
  });
});

describe("When the user is on an Claim Now Ims promotion page in logged out state", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn, { loggedIn: "false" }));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1376]_should_render_claim_now_promo_card_in_logged_out_state`,
    );
  });

  it("[PRPI-1376]_should_render_claim_now_promo_card_in_logged_out_state", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1376]_should_render_claim_now_promo_card_in_logged_out_state`),
    ).toBe(0);
  });
});
