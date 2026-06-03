const { LoyaltyBottomSheetPO, PromoCardPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const promotionCardPO = new PromoCardPO();
const loyaltyBottomSheetPO = new LoyaltyBottomSheetPO();

const SPORT_ID = 1;

const LOYALTY_PROMOTION_NOT_OPTED_IN_MOCK = {
  state: {
    optInState: "NOT_OPTED_IN",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.PROMOTION",
    },
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: "Opt In",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://promos.betfair.com/sport",
        viewDisplayMode: "BLANK_INAPP",
      },
    },
  },
};

const LOYALTY_PROMOTION_OPTED_IN_MOCK = {
  state: {
    optInState: "ONGOING",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.OPTED_IN",
    },
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: "Bet here",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://promos.betfair.com/sport",
        viewDisplayMode: "BLANK_INAPP",
      },
    },
  },
};

const LOYALTY_PROMOTION_ACCEPTED_MOCK = {
  state: {
    optInState: "ONGOING",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.ACCEPTED",
    },
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: "Bet here",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://promos.betfair.com/sport",
        viewDisplayMode: "BLANK_INAPP",
      },
    },
  },
};

const LOYALTY_PROMOTION_REWARDED_MOCK = {
  state: {
    optInState: "REWARD_AWARDED",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.REWARDED",
    },
    link: {
      label: {
        __typename: "DisplayNameTitle",
        name: "Bet here",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://promos.betfair.com/sport",
        viewDisplayMode: "BLANK_INAPP",
      },
    },
  },
};

const LOYALTY_PROMOTION = {
  __typename: "LoyaltyPromotion",
  urn: "ppb:tbd:loyaltyPromotion:pph/CHECKMATE1",
  name: "Get a free £5 bet when you place a £5 bet",
  title: "Spanish La Liga",
  promoImage: {
    url: "https://pma-s3.betfair.com/cpp/bf/2023/6/9/mockedImage.jpg",
  },
  termsAndConditions: {
    summary: "Opt-in required. Max £5 Free Bet, valid 2 days on Sports.",
    link: {
      label: {
        __typename: "DisplayNameTranslationKey",
        name: "T&Cs Apply",
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://promos.betfair.com/promotion?promoCode=CHECKMATE1",
        viewDisplayMode: "BLANK_INAPP",
      },
    },
  },
};

function buildBFFSportPageWithLoyaltyPromoCardStateMock(promoState) {
  return {
    urn: `ppb:tbd:view:sport:${SPORT_ID}`,
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
          full: {
            edges: [
              {
                node: {
                  __typename: "LoyaltyPromoCard",
                  urn: "ppb:tbd:card:loyaltyPromo:pph/CHECKMATE1|LIGHT",
                  theme: "LIGHT",
                  loyaltyPromotion: {
                    ...LOYALTY_PROMOTION,
                    state: {
                      ...LOYALTY_PROMOTION.state,
                      ...promoState,
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
                  __typename: "LoyaltyPromoCard",
                  urn: "ppb:tbd:card:loyaltyPromo:pph/CHECKMATE1|LIGHT",
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
          urn: `ppb:tbd:cardgroup:swimlane:X42sdBAAACEACzD1/s/${SPORT_ID}`,
        },
      },
    ],
  };
}

const BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_NOT_OPTED_IN_MOCK = buildBFFSportPageWithLoyaltyPromoCardStateMock({
  ...LOYALTY_PROMOTION_NOT_OPTED_IN_MOCK.state,
});
const BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_OPTED_IN_MOCK = buildBFFSportPageWithLoyaltyPromoCardStateMock({
  ...LOYALTY_PROMOTION_OPTED_IN_MOCK.state,
});
const BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_ACCEPTED_MOCK = buildBFFSportPageWithLoyaltyPromoCardStateMock({
  ...LOYALTY_PROMOTION_ACCEPTED_MOCK.state,
});
const BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_REWARDED_MOCK = buildBFFSportPageWithLoyaltyPromoCardStateMock({
  ...LOYALTY_PROMOTION_REWARDED_MOCK.state,
});

describe("Loyalty Promotion Card", () => {
  describe("When a user enters the football page with a swimlane containing a loyalty promotion card", () => {
    describe("and the promo is not yet opted in", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_NOT_OPTED_IN_MOCK.urn),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_NOT_OPTED_IN_MOCK));
        await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
        await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
        await browser.waitUntilDisplayed(promotionCardPO.element);
      });

      it("[PRPI-7220] The loyalty promotion card should be displayed", async () => {
        expect(await promotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7221] The loyalty promotion card should have the correct title", async () => {
        expect(await promotionCardPO.title.getText()).toBe("Get a free £5 bet when you place a £5 bet");
      });

      it("[PRPI-7222] The loyalty promotion card should have the correct sub-title", async () => {
        expect(await promotionCardPO.subtitle.getText()).toBe("Spanish La Liga");
      });

      it("[PRPI-7223] The loyalty promotion card should display the image", async () => {
        expect(await promotionCardPO.image.isDisplayed()).toBe(true);
      });

      it("[PRPI-7224] The loyalty promotion card should have the correct T&Cs summary", async () => {
        expect(await promotionCardPO.termsAndConditionsSummary.getText()).toBe(
          "Opt-in required. Max £5 Free Bet, valid 2 days on Sports.",
        );
      });

      it("[PRPI-7225] The loyalty promotion card should have the correct T&Cs link text", async () => {
        expect(await promotionCardPO.termsAndConditionsLink.getText()).toBe("T&C Apply");
      });

      it("[PRPI-7226] The loyalty promotion card should have the correct optin text", async () => {
        expect(await promotionCardPO.optInContainer.getText()).toBe("Opt In");
      });

      it("[PRPI-7227] The loyalty promotion card should have the optin checkbox displayed", async () => {
        expect(await promotionCardPO.optInCheckbox.isDisplayed()).toBe(true);
      });

      it("[PRPI-7228] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardPO.bookmark.getText()).toBe("Promotion");
      });

      describe("and the card is tapped", () => {
        beforeAll(async () => {
          await promotionCardPO.element.click();
          await browser.waitUntilDisplayed(loyaltyBottomSheetPO.element);
        });

        it("[PRPI-7229] The loyalty bottom sheet should have a title displayed", async () => {
          expect(await loyaltyBottomSheetPO.headerTitle.getText()).toBe("My Promotions");
        });

        it("[PRPI-7230] The loyalty bottom sheet should have a close button displayed", async () => {
          expect(await loyaltyBottomSheetPO.closeButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-7231] should close bottom sheet when close is tapped", async () => {
          await loyaltyBottomSheetPO.closeButton.click();

          expect(await loyaltyBottomSheetPO.element.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the promo is opted in", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_OPTED_IN_MOCK.urn));
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_OPTED_IN_MOCK));
        await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
        await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
        await browser.waitUntilDisplayed(promotionCardPO.element);
      });

      it("[PRPI-7232] The loyalty promotion card should be displayed", async () => {
        expect(await promotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7233] The loyalty promotion card should have the correct CTA text", async () => {
        expect(await promotionCardPO.ctaButton.getText()).toBe("Bet here");
      });

      it("[PRPI-7234] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardPO.bookmark.getText()).toBe("Opted In");
      });
    });

    describe("and the promo is accepted", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_ACCEPTED_MOCK.urn));
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_ACCEPTED_MOCK));
        await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
        await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
        await browser.waitUntilDisplayed(promotionCardPO.element);
      });

      it("[PRPI-7235] The loyalty promotion card should be displayed", async () => {
        expect(await promotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7236] The loyalty promotion card should have the correct CTA text", async () => {
        expect(await promotionCardPO.ctaButton.getText()).toBe("Bet here");
      });

      it("[PRPI-7237] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardPO.bookmark.getText()).toBe("Accepted");
      });
    });

    describe("and the promo is rewarded", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_REWARDED_MOCK.urn));
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_REWARDED_MOCK));
        await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
        await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
        await browser.waitUntilDisplayed(promotionCardPO.element);
      });

      it("[PRPI-7238] The loyalty promotion card should be displayed", async () => {
        expect(await promotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7239] The loyalty promotion card should have the correct CTA text", async () => {
        expect(await promotionCardPO.ctaButton.getText()).toBe("Bet here");
      });

      it("[PRPI-7240] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardPO.bookmark.getText()).toBe("Rewarded");
      });
    });
  });
});
