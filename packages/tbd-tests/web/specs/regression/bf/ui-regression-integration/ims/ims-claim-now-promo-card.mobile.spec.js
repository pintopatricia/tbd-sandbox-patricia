const {
  ClaimNowPromoPO,
  FullScreenModalPO,
  OverlayPO,
  DisclaimerPO,
  SliderPO,
  OngoingBadgePO,
} = require("../../../../../page-objects");

const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getImsPromotionLayout, getAcceptImsPromotion } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const claimNowPromoPO = new ClaimNowPromoPO();
const sliderPO = new SliderPO();
const disclaimerPO = new DisclaimerPO();
const fullScreenModalPO = new FullScreenModalPO();
const ongoingBadgePO = new OngoingBadgePO();
const overlayPO = new OverlayPO();

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

  partialEdges: [
    { node: { __typename: "ImsPromotionStateCard", urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1" } },
  ],
};

const BFF_IMS_PROMO_FIXED_AMOUNT = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  title: "Claim Now Fixed Amount",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Claim Now Fixed Amount",
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
            buyInMinValue: 99.99,
            buyInMaxValue: 100,
            intervals: [
              {
                amount: 75,
                min: 99.99,
                max: 100,
              },
            ],
          },
          wagerType: "PRE_WAGER",
        },
      },
    },
  ],

  partialEdges: [{ node: { __typename: "ImsPromotionStateCard" } }],
};

const ACCEPT_BONUS_MOCK = {
  promotion: {
    status: "OPTED_IN",
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
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];
const INSUFFICIENT_WAS_REQUEST = [{ walletName: "MAIN", amount: "1" }];

describe("When the user is on a Claim Now Ims promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(claimNowPromoPO.element);
  });

  it("[PRPI-6594] the claim now promo card should be displayed", async () => {
    expect(await claimNowPromoPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-6595] the promo modal title should be displayed", async () => {
    expect(await fullScreenModalPO.headerTitle.getText()).toBe("Claim Now Promotion");
  });

  it("[PRPI-6596] the claim now promo card title should be displayed", async () => {
    expect(await claimNowPromoPO.title.getText()).toBe("CLAIM NOW");
  });

  it("[PRPI-6597] the claim now promo card subheader should be displayed", async () => {
    expect(await claimNowPromoPO.subHeader.getText()).toBe("This is a mocked Claim Now promotion");
  });

  it("[PRPI-6598] the claim now promo card avaialable funds should be displayed", async () => {
    expect(await claimNowPromoPO.availableFunds.getText()).toBe("Available funds: $123.00");
  });

  it("[PRPI-6599] the claim now slider should be displayed", async () => {
    expect(await sliderPO.element.isDisplayed()).toBe(true);
  });

  describe("When user double taps on decrease button", () => {
    beforeAll(async () => {
      await sliderPO.buttons[0].click();
      await sliderPO.buttons[0].click();
      await browser.waitUntilDisplayed(sliderPO.tootTip);
    });

    it("[PRPI-6600] the tooltip amount should be: $8", async () => {
      expect(await sliderPO.tootTip.getText()).toBe("$8");
    });

    describe("When user taps on increase button", () => {
      beforeAll(async () => {
        await sliderPO.buttons[1].click();
        await browser.waitUntilDisplayed(sliderPO.tootTip);
      });

      it("[PRPI-6601] the tooltip amount should be: $9", async () => {
        expect(await sliderPO.tootTip.getText()).toBe("$9");
      });

      it("[PRPI-6602] the claim now disclaimer component should be displayed", async () => {
        expect(await disclaimerPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-6603] the claim now button should be displayed", async () => {
        expect(await claimNowPromoPO.button.getText()).toBe("Claim Now");
      });

      describe("When user taps on Claim Now button", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getAcceptImsPromotion(ACCEPT_BONUS_MOCK));
          await claimNowPromoPO.button.click();
          await browser.waitUntilDisplayed(ongoingBadgePO.element);
        });

        it("[PRPI-6604] the ongoing badge should be displayed", async () => {
          expect(await ongoingBadgePO.element.isDisplayed()).toBe(true);
        });
      });
    });
  });
});

describe("When the user is on a Claim Now Fixed amount Ims promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO_FIXED_AMOUNT.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO_FIXED_AMOUNT));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(claimNowPromoPO.element);
  });

  it("[PRPI-6605] the tooltip amount should be: $75", async () => {
    expect(await sliderPO.tootTip.getText()).toBe("$75");
  });

  describe("When user taps on decrease or increase button", () => {
    beforeAll(async () => {
      await sliderPO.buttons[0].click();
      await sliderPO.buttons[0].click();
      await sliderPO.buttons[1].click();
      await browser.waitUntilDisplayed(sliderPO.tootTip);
    });

    it("[PRPI-6606] the tooltip amount should be: $75", async () => {
      expect(await sliderPO.tootTip.getText()).toBe("$75");
    });
  });
});

describe("When the user is on a Claim Now Ims promotion page with insufficient funds to claim promo", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockHttpRequest(getWallets(INSUFFICIENT_WAS_REQUEST));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(claimNowPromoPO.element);
  });

  it("[PRPI-6607] the deposit button should be displayed", async () => {
    expect(await claimNowPromoPO.button.getText()).toBe("Deposit");
  });

  describe("When the user taps on Deposit button", () => {
    beforeAll(async () => {
      await claimNowPromoPO.button.click();
      await browser.waitUntilDisplayed(overlayPO.element);
    });

    xit("[861796] the user should be redirected to deposit page", async () => {
      expect(await browser.getUrl()).toContain("betting/myAccountView");
    });
  });
});

describe("When user is on Claim Now page from logged out state", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn, { loggedIn: "false" }));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(claimNowPromoPO.element);
  });

  describe("the user taps on Claim Now button from logged out state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAcceptImsPromotion(ACCEPT_BONUS_MOCK, { loggedIn: "false" }));
      await claimNowPromoPO.button.waitForClickable();
      await claimNowPromoPO.button.click();
      await browser.waitUntilBrowserUrlContains("/identitysso.betfair.com");
    });

    it("[PRPI-6608] the user is redirected to the login page", async () => {
      expect(await browser.getUrl()).toContain("/view/login?");
    });
  });
});
