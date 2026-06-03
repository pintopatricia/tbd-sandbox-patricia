const { OngoingPromoCardPO } = require("../../../../../page-objects");
const { getImsPromotionLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const ongoingPromoCardPO = new OngoingPromoCardPO();

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

describe("When the user is on a ongoing Opt In promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_OPT_IN.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_OPT_IN));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(ongoingPromoCardPO.element);
  });

  it("[PRPI-5964] the headline should be displayed", async () => {
    expect(await ongoingPromoCardPO.title.getText()).toBe("OPT IN MOCKED PROMOTION");
  });

  it("[PRPI-5965] the T&C text should be displayed", async () => {
    expect(await ongoingPromoCardPO.tcText.getText()).toBe("This is a mocked Opt In promotion");
  });

  it("[PRPI-5966] the time left should be displayed", async () => {
    expect(await ongoingPromoCardPO.timeLeftText.getText()).toBe("Time left: less than 1 hour");
  });
});

describe("When the user is on a ongoing Golden Chips promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_GOLDEN_CHIPS.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_GOLDEN_CHIPS));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(ongoingPromoCardPO.element);
  });

  it("[PRPI-5967] the headline should be displayed", async () => {
    expect(await ongoingPromoCardPO.title.getText()).toBe("GOLDEN CHIPS MOCKED PROMOTION");
  });

  it("[PRPI-5968] the T&C text should be displayed", async () => {
    expect(await ongoingPromoCardPO.tcText.getText()).toBe("This is a mocked Golden Chips promotion");
  });

  it("[PRPI-5969] the requirements should be displayed", async () => {
    expect(await ongoingPromoCardPO.requirements.getText()).toBe("Requirements: Bet your $5.00 bonus 1 time.");
  });

  it("[PRPI-5970] the remaining header should be displayed", async () => {
    expect(await ongoingPromoCardPO.remainingHeader.getText()).toBe("Remaining to wager: $3.50");
  });

  it("[PRPI-5971] the remaining subheader should be displayed", async () => {
    expect(await ongoingPromoCardPO.remainingSubheader.getText()).toBe("4 Golden Chips Remaining, worth $1.00 each");
  });

  it("[PRPI-5972] the progress bar should be displayed", async () => {
    expect(await ongoingPromoCardPO.progressBar.isDisplayed()).toBe(true);
  });

  it("[PRPI-5973] the time left should be displayed", async () => {
    expect(await ongoingPromoCardPO.timeLeftSection.getText()).toBe("Time left: 2 hours");
  });

  it("[PRPI-5974] the pending winnings should be displayed", async () => {
    expect(await ongoingPromoCardPO.timeLeftText.getText()).toBe("Pending winnings: $2.00");
  });

  it("[PRPI-5975] the cancel button should be displayed", async () => {
    expect(await ongoingPromoCardPO.buttons[0].isDisplayed()).toBe(true);
  });

  it("[PRPI-5976] the refresh button should be displayed", async () => {
    expect(await ongoingPromoCardPO.buttons[1].isDisplayed()).toBe(true);
  });
});

describe("When the user is on a ongoing Pre Wager promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_PRE_WAGER.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_PRE_WAGER));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(ongoingPromoCardPO.element);
  });

  it("[PRPI-5977] the headline should be displayed", async () => {
    expect(await ongoingPromoCardPO.title.getText()).toBe("PRE WAGER MOCKED PROMOTION");
  });

  it("[PRPI-5978] the T&C text should be displayed", async () => {
    expect(await ongoingPromoCardPO.tcText.getText()).toBe("This is a mocked Pre Wager promotion");
  });

  it("[PRPI-5979] the remaining header should be displayed", async () => {
    expect(await ongoingPromoCardPO.remainingHeader.getText()).toBe("Remaining to wager: $1.00");
  });

  it("[PRPI-5980] the remaining subheader should be displayed", async () => {
    expect(await ongoingPromoCardPO.remainingSubheader.getText()).toBe("Bet your $1.00 bonus 2 times.");
  });

  it("[PRPI-5981] the progress bar should be displayed", async () => {
    expect(await ongoingPromoCardPO.progressBar.isDisplayed()).toBe(true);
  });

  it("[PRPI-5982] the time left should be displayed", async () => {
    expect(await ongoingPromoCardPO.timeLeftText.getText()).toBe("Time left: 2 hours");
  });

  it("[PRPI-5983] the cancel button should be displayed", async () => {
    expect(await ongoingPromoCardPO.buttons[0].isDisplayed()).toBe(true);
  });

  it("[PRPI-5984] the refresh button should be displayed", async () => {
    expect(await ongoingPromoCardPO.buttons[1].isDisplayed()).toBe(true);
  });
});

describe("When the user is on a ongoing Free Spins promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_FREE_SPINS.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_FREE_SPINS));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(ongoingPromoCardPO.element);
  });

  it("[PRPI-5985] the headline should be displayed", async () => {
    expect(await ongoingPromoCardPO.title.getText()).toBe("FREE SPINS MOCKED PROMOTION");
  });

  it("[PRPI-5986] the T&C text should be displayed", async () => {
    expect(await ongoingPromoCardPO.tcText.getText()).toBe("This is a mocked Free Spins promotion");
  });

  it("[PRPI-5987] the remaining header should be displayed", async () => {
    expect(await ongoingPromoCardPO.remainingHeader.getText()).toBe("8 Free Spins Remaining");
  });

  it("[PRPI-5988] the time left should be displayed", async () => {
    expect(await ongoingPromoCardPO.timeLeftText.getText()).toBe("Time left: 1 day & 3 hours");
  });

  it("[PRPI-5989] the cancel button should be displayed", async () => {
    expect(await ongoingPromoCardPO.buttons[0].isDisplayed()).toBe(true);
  });

  it("[PRPI-5990] the refresh button should be displayed", async () => {
    expect(await ongoingPromoCardPO.buttons[1].isDisplayed()).toBe(true);
  });
});
