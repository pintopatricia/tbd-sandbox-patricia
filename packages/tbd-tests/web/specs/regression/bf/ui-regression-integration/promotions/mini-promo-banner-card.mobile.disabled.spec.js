const { MiniPromotionCardPO, LoyaltyBottomSheetPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const miniPromotionCardPO = new MiniPromotionCardPO();
const loyaltyBottomSheetPO = new LoyaltyBottomSheetPO();

const EVENT_TYPE_ID = 1;

const MINI_PROMO_BANNER_CARD_NOT_OPTED_IN_MOCK = {
  state: {
    optInState: "NOT_OPTED_IN",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.PROMOTION",
    },
  },
};

const MINI_PROMO_BANNER_CARD_OPTED_IN_MOCK = {
  state: {
    optInState: "ONGOING",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.OPTED_IN",
    },
  },
};

const MINI_PROMO_BANNER_CARD_ACCEPTED_MOCK = {
  state: {
    optInState: "ONGOING",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.ACCEPTED",
    },
  },
};

const MINI_PROMO_BANNER_CARD_REWARDED_MOCK = {
  state: {
    optInState: "REWARD_AWARDED",
    label: {
      __typename: "DisplayNameTitle",
      name: "I18N.PROMO.STATE.LABEL.REWARDED",
    },
  },
};

function buildBFFSportPageWithMiniPromoBannerCardStateMock(state) {
  return {
    urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
    edges: [
      {
        node: {
          __typename: "GenericSwitcherCard",
          urn: "ppb:tbd:card:genericswitcher:sport:1",
          selectedViewLink: {
            label: "Football",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/s-1",
            },
          },
        },
      },
      {
        node: {
          __typename: "MiniPromoBannerCard",
          urn: "ppb:tbd:card:miniPromoBanner:ZOi-hhAAACcAEI21/s/1",
          theme: "LIGHT",
          loyaltyPromotion: {
            __typename: "LoyaltyPromotion",
            urn: "ppb:tbd:loyaltyPromotion:MINICHECKMATE1",
            name: "Mini Checkmate Test",
            title: "Title",
            promoImage: {
              url: "https://pma-s3.betfair.com.nxt.ppbdev.com/cdn-cgi/image/f=auto,q=90,w=300/cpp/bf/2023/8/25/2023-08-25_13-46-17_458x457.png",
            },
            state: {
              ...state,
              link: {
                label: {
                  __typename: "DisplayNameTitle",
                  name: "Opted in",
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:external:external",
                  viewUrl: "https://www.nxt.com.betfair/betting/",
                  viewDisplayMode: "BLANK_WEBVIEW",
                },
              },
            },
            termsAndConditions: {
              summary: null,
              link: {
                label: {
                  name: "T&C Apply",
                  __typename: "DisplayNameTranslationKey",
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:external:external",
                  viewUrl: "https://promos.nxt.com.betfair/promotion?promoCode=MINICHECKMATE1",
                  viewDisplayMode: "BLANK_WEBVIEW",
                },
              },
            },
          },
        },
      },
    ],

    partialEdges: [
      {
        node: {
          __typename: "GenericSwitcherCard",
          urn: "ppb:tbd:card:genericswitcher:sport:1",
        },
      },
      {
        node: {
          __typename: "MiniPromoBannerCard",
          urn: "ppb:tbd:card:miniPromoBanner:ZOi-hhAAACcAEI21/s/1",
        },
      },
    ],
  };
}

const BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_NOT_OPTED_IN_MOCK = buildBFFSportPageWithMiniPromoBannerCardStateMock({
  ...MINI_PROMO_BANNER_CARD_NOT_OPTED_IN_MOCK.state,
});

const BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_OPTED_IN_MOCK = buildBFFSportPageWithMiniPromoBannerCardStateMock({
  ...MINI_PROMO_BANNER_CARD_OPTED_IN_MOCK.state,
});
const BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_ACCEPTED_MOCK = buildBFFSportPageWithMiniPromoBannerCardStateMock({
  ...MINI_PROMO_BANNER_CARD_ACCEPTED_MOCK.state,
});
const BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_REWARDED_MOCK = buildBFFSportPageWithMiniPromoBannerCardStateMock({
  ...MINI_PROMO_BANNER_CARD_REWARDED_MOCK.state,
});

describe("MiniPromoBannerCard", () => {
  describe("When a user enters the football page with a mini promo banner card", () => {
    describe("and the promo is not yet opted in", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_NOT_OPTED_IN_MOCK.urn),
        );
        await mockService.mockHttpRequest(
          getSportsLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_NOT_OPTED_IN_MOCK),
        );
        await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
        await browser.waitUntilDisplayed(miniPromotionCardPO.element);
      });

      it("[PRPI-7241] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7242] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardPO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-7243] The mini promo banner card should have a checkbox displayed", async () => {
        expect(await miniPromotionCardPO.checkbox.isDisplayed()).toBe(true);
      });

      it("[PRPI-7244] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardPO.textWrapper.getText()).toBe("Mini Checkmate TestT&C Apply");
      });

      describe("and the card is tapped", () => {
        beforeAll(async () => {
          await miniPromotionCardPO.element.click();
          await browser.waitUntilDisplayed(loyaltyBottomSheetPO.element);
        });

        it("[PRPI-7245] The loyalty bottom sheet should have a title displayed", async () => {
          expect(await loyaltyBottomSheetPO.headerTitle.getText()).toBe("My Promotions");
        });

        it("[PRPI-7246] The loyalty bottom sheet should have a close button displayed", async () => {
          expect(await loyaltyBottomSheetPO.closeButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-7247] should close bottom sheet when close is tapped", async () => {
          await loyaltyBottomSheetPO.closeButton.click();

          expect(await loyaltyBottomSheetPO.element.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the promo is opted in", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_OPTED_IN_MOCK.urn),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_OPTED_IN_MOCK));
        await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
        await browser.waitUntilDisplayed(miniPromotionCardPO.element);
      });

      it("[PRPI-7248] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7249] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardPO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-7250] The mini promo banner card should have a read-only checkbox displayed", async () => {
        expect(await miniPromotionCardPO.checkboxReadOnly.isDisplayed()).toBe(true);
      });

      it("[PRPI-7251] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardPO.textWrapper.getText()).toBe("Opted In - Mini Checkmate TestT&C Apply");
      });
    });

    describe("and the promo is accepted", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_ACCEPTED_MOCK.urn),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_ACCEPTED_MOCK));
        await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
        await browser.waitUntilDisplayed(miniPromotionCardPO.element);
      });

      it("[PRPI-7252] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7253] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardPO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-7254] The mini promo banner card should have a read-only checkbox displayed", async () => {
        expect(await miniPromotionCardPO.checkboxReadOnly.isDisplayed()).toBe(true);
      });

      it("[PRPI-7255] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardPO.textWrapper.getText()).toBe("Accepted - Mini Checkmate TestT&C Apply");
      });
    });

    describe("and the promo is rewarded", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_REWARDED_MOCK.urn),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_REWARDED_MOCK));
        await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
        await browser.waitUntilDisplayed(miniPromotionCardPO.element);
      });

      it("[PRPI-7256] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7257] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardPO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-7258] The mini promo banner card should have an arrow displayed", async () => {
        expect(await miniPromotionCardPO.arrow.isDisplayed()).toBe(true);
      });

      it("[PRPI-7259] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardPO.textWrapper.getText()).toBe("Rewarded - Mini Checkmate TestT&C Apply");
      });
    });
  });
});
