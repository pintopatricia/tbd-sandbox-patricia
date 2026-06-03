const {
  AcceptPromoCardPO,
  ScrollableSwimlanePO,
  ActionLinkPO,
  ConfirmDrawerPO,
  FullScreenModalPO,
  OngoingPromoCardPO,
  OngoingBadgePO,
  GameTilePO,
} = require("../../../../../page-objects");
const ImsPromotionDetailsCardPO = require("@ppb/tbd-shared/components/ImsPromotionDetailsCard/ImsPromotionDetailsCard.web.po");
const ImsPromotionTermsAndContidionsCardPO = require("@ppb/tbd-shared/components/ImsPromotionTermsAndConditionsCard/ImsPromotionTermsAndContidionsCard.web.po");

const {
  getImsPromotionLayout,
  getAcceptImsPromotion,
  getCancelImsPromotion,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const acceptPromoCardPO = new AcceptPromoCardPO();
const ongoingBadgePO = new OngoingBadgePO();
const ongoingPromoCardPO = new OngoingPromoCardPO();
const cancelButtonPO = new ActionLinkPO(ongoingPromoCardPO.buttons[0]);
const confirmDrawerPO = new ConfirmDrawerPO();
const imsPromoDetailsCardPO = new ImsPromotionDetailsCardPO();
const imsPromotionTermsAndContidionsCardPO = new ImsPromotionTermsAndContidionsCardPO();
const scrollableSwimlanePO = new ScrollableSwimlanePO();
const firstGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[0]);
const secondGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[1]);
const thirdGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[2]);
const fullScreenModalPO = new FullScreenModalPO();

const mockService = new MockService();

const BFF_IMS_PROMO = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/ip-gaming-promotion-1",
  title: "Best Promotion Ever",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:imsPromotionState:gaming-promotion-1",
        __typename: "ImsPromotionStateCard",
        title: "Best Promotion Ever",
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

const ACCEPT_BONUS_MOCK = {
  promotion: {
    status: "OPTED_IN",
    layout: "ACCEPT",
    urn: "ppb:imsPromotion:gaming-promotion-1",
    bonusInstanceCode: "1000",
  },
};

const CANCEL_BONUS_MOCK = {
  promotion: {
    status: "NOT_OPTED_IN",
    layout: "ACCEPT",
    urn: "ppb:imsPromotion:gaming-promotion-1",
    bonusInstanceCode: "1000",
  },
};

describe("When the user is on an Accept Ims promotion page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_IMS_PROMO.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(acceptPromoCardPO.element);
  });

  it("[PRPI-6578] the accept promo card should be displayed", async () => {
    expect(await acceptPromoCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-6579] the promo modal title should be displayed", async () => {
    expect(await fullScreenModalPO.headerTitle.getText()).toBe("Best Promotion Ever");
  });

  it("[PRPI-6580] the promo card title should be displayed", async () => {
    expect(await acceptPromoCardPO.title.getText()).toBe("Promo Title");
  });

  it("[PRPI-6581] the promo card text should be displayed", async () => {
    expect(await acceptPromoCardPO.termsAndConditions.getText()).toBe("This is a mocked promotion");
  });

  it("[PRPI-6582] the accept button should be displayed", async () => {
    expect(await acceptPromoCardPO.button.getText()).toBe("Accept");
  });

  it("[PRPI-6583] the promo details card should be displayed", async () => {
    expect(await imsPromoDetailsCardPO.title.getText()).toBe("Details");
    expect(await imsPromoDetailsCardPO.text.getText()).toBe("Mocked Details");
  });

  it("[PRPI-6584] the promo terms and conditions card should be displayed", async () => {
    expect(await imsPromotionTermsAndContidionsCardPO.title.getText()).toBe("Terms & Conditions");
    expect(await imsPromotionTermsAndContidionsCardPO.text.getText()).toBe("Mocked Terms and Conditions");
  });

  it("[PRPI-6585] the card group should display 3 games", async () => {
    expect(await scrollableSwimlanePO.title.getText()).toBe("Featured Eligible Games");
    expect(await scrollableSwimlanePO.gameTiles.length).toBe(3);
  });

  it("[PRPI-6586] And Game tiles on the swimlane should contain favourite button", async () => {
    expect(await firstGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await secondGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await thirdGameTile.getFavouriteButton.isDisplayed()).toBe(true);
  });

  describe("When user taps on Accept button", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAcceptImsPromotion(ACCEPT_BONUS_MOCK));
      await acceptPromoCardPO.button.click();
      await browser.waitUntilDisplayed(ongoingBadgePO.element);
    });

    it("[PRPI-6587] the ongoing badge should be displayed", async () => {
      expect(await ongoingBadgePO.element.isDisplayed()).toBe(true);
    });

    describe("When user taps on Cancel button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCancelImsPromotion(CANCEL_BONUS_MOCK));
        await cancelButtonPO.element.click();
        await browser.waitUntilDisplayed(confirmDrawerPO.element, "Cancel Promotion' drawer was not present");
      });

      it("[PRPI-6588] the box title should be: Cancel Promotion", async () => {
        expect(await confirmDrawerPO.title.getText()).toBe("Cancel Promotion");
      });

      it("[PRPI-6589] the confirmation button should be: Yes, Cancel", async () => {
        expect(await confirmDrawerPO.refuseButton.getText()).toBe("Yes, Cancel");
      });

      it("[PRPI-6590] the cancel button should be: NO", async () => {
        expect(await confirmDrawerPO.acceptButton.getText()).toBe("NO");
      });

      describe("When user taps NO button", () => {
        beforeAll(async () => {
          await confirmDrawerPO.acceptButton.click();
          await browser.waitUntilDisplayed(cancelButtonPO.element);
        });

        it("[PRPI-6591] the user should be back on ongoing promo card", async () => {
          expect(await confirmDrawerPO.element.isDisplayed()).toBe(false);
        });
      });

      describe("When user taps confirmation button", () => {
        beforeAll(async () => {
          await cancelButtonPO.element.click();
          await confirmDrawerPO.refuseButton.click();
          await browser.waitUntilBrowserUrlContains("p-1");
        });

        it("[PRPI-6592] the user should be redirected to promotions page", async () => {
          const url = await browser.getUrl();

          expect(url.endsWith("p-1")).toBe(true, `${url} does not have the gaming page ending`);
        });
      });
    });
  });
});

describe("When user is on IMS Accept Promo page from logged out state", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_IMS_PROMO.urn, { loggedIn: "false" }));
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(acceptPromoCardPO.element);
  });

  describe("the user taps on Accept button from logged out state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAcceptImsPromotion(ACCEPT_BONUS_MOCK, { loggedIn: "false" }));
      await acceptPromoCardPO.button.waitForClickable();
      await acceptPromoCardPO.button.click();
      await browser.waitUntilBrowserUrlContains("/identitysso.betfair.com");
    });

    it("[PRPI-6593] the user is redirected to the login page", async () => {
      expect(await browser.getUrl()).toContain("/view/login?");
    });
  });
});
