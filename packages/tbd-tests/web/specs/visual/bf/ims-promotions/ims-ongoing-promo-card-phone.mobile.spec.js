const { getImsPromotionLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService(browser);

const PARTIAL_MOCK = [
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
];

const BFF_IMS_PROMO_OPT_IN = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  title: "Opt In Promotion",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Opt In Promotion",
        promotion: {
          status: "OPTED_IN",
          layout: "OPT_IN",
          headline: "Opt In mocked promotion",
          ctaText: "Opt In",
          subHeadline: "This is a mocked Opt In promotion",
          image: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {},
          },
          timeLeft: 1234,
        },
      },
    },
    ...PARTIAL_MOCK,
  ],

  partialEdges: [{ node: { __typename: "ImsPromotionStateCard" } }],
};

const BFF_IMS_PROMO_GOLDEN_CHIPS = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  title: "Golden Chips Promotion",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Opt In Promotion",
        promotion: {
          status: "OPTED_IN",
          layout: "ACCEPT",
          headline: "Golden Chips mocked promotion",
          ctaText: "Opt In",
          subHeadline: "This is a mocked Golden Chips promotion",
          image: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {},
          },
          goldenChips: {
            goldenChipsAmount: 1,
            initialGoldenChips: 5,
            remainingGoldenChips: 4,
          },
          currentBonusBalance: 5,
          amountOnPendingWinnings: 1,
          timeLeft: 10000,
          bonusAwarded: 5,
          bonusWagering: 5,
          wagerType: "GOLDEN_CHIPS",
          wageringLeft: 3.5,
          percentCompleted: 50,
        },
      },
    },
    ...PARTIAL_MOCK,
  ],

  partialEdges: [{ node: { __typename: "ImsPromotionStateCard" } }],
};

const BFF_IMS_PROMO_PRE_WAGER = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  title: "Pre Wager Promotion",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Pre Wager Promotion",
        promotion: {
          status: "OPTED_IN",
          layout: "ACCEPT",
          headline: "Pre Wager mocked promotion",
          ctaText: "Accept",
          subHeadline: "This is a mocked Pre Wager promotion",
          image: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {},
          },
          timeLeft: 10000,
          bonusAwarded: 1,
          bonusWagering: 2,
          wagerType: "PRE_WAGER",
          wageringLeft: 1,
          percentCompleted: 50,
        },
      },
    },
    ...PARTIAL_MOCK,
  ],

  partialEdges: [{ node: { __typename: "ImsPromotionStateCard" } }],
};

const BFF_IMS_PROMO_FREE_SPINS = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  title: "Free Spins Promotion",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Free Spins Promotion",
        promotion: {
          status: "OPTED_IN",
          layout: "ACCEPT",
          headline: "Free Spins mocked promotion",
          ctaText: "Opt In",
          subHeadline: "This is a mocked Free Spins promotion",
          image: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {},
          },
          freeSpins: {
            initialFreeSpins: 10,
            remainingFreeSpins: 8,
          },
          timeLeft: 100000,
          wagerType: "FREE_SPINS",
        },
      },
    },
    ...PARTIAL_MOCK,
  ],

  partialEdges: [{ node: { __typename: "ImsPromotionStateCard" } }],
};

const MODULE_NAME = "ims-promotions";

describe("When the user is on a ongoing Opt In promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_OPT_IN.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_OPT_IN));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1377]_should_render_ongoing_optin_promo_card`);
  });

  it("[PRPI-1377]_should_render_ongoing_optin_promo_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1377]_should_render_ongoing_optin_promo_card`)).toBe(0);
  });
});

describe("When the user is on a ongoing Golden Chips promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_GOLDEN_CHIPS.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_GOLDEN_CHIPS));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1378]_should_render_ongoing_golden_chips_promo_card`);
  });

  it("[PRPI-1378]_should_render_ongoing_golden_chips_promo_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1378]_should_render_ongoing_golden_chips_promo_card`)).toBe(
      0,
    );
  });
});

describe("When the user is on a ongoing Pre Wager promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_PRE_WAGER.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_PRE_WAGER));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1379]_should_render_ongoing_pre_wager_promo_card`);
  });

  it("[PRPI-1379]_should_render_ongoing_pre_wager_promo_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1379]_should_render_ongoing_pre_wager_promo_card`)).toBe(0);
  });
});

describe("When the user is on a ongoing Free Spins promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_FREE_SPINS.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_FREE_SPINS));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1380]_should_render_ongoing_free_spins_promo_card`);
  });

  it("[PRPI-1380]_should_render_ongoing_free_spins_promo_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1380]_should_render_ongoing_free_spins_promo_card`)).toBe(0);
  });
});
