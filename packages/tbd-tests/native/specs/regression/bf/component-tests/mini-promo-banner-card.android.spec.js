const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { startApp } = require("../../../../helpers/urls");
const { MiniPromotionCardSO, LoyaltyBottomSheetSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const miniPromotionCardSO = new MiniPromotionCardSO();
const loyaltyBottomSheetSO = new LoyaltyBottomSheetSO();

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

const BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
        filterTitle: {
          translated: null,
          translate: {
            key: "I18N.SWITCHER.SPORT.TITLE",
          },
        },
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
            optInState: "NOT_OPTED_IN",
            label: {
              __typename: "DisplayNameTitle",
              name: "I18N.PROMO.STATE.LABEL.PROMOTION",
            },
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
                __typename: "DisplayNameTranslationKey",
                translationKey: "I18N.PROMO.TERMS_CONDITIONS",
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

  partialItems: {
    edges: [
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
  },
};

function buildBFFSportPageWithMiniPromoBannerCardStateMock(state) {
  return {
    ...BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_MOCK,
    edges: [
      { ...BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_MOCK.edges[0] },
      {
        node: {
          ...BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_MOCK.edges[1].node,
          loyaltyPromotion: {
            ...BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_MOCK.edges[1].node.loyaltyPromotion,
            state: {
              ...BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_MOCK.edges[1].node.loyaltyPromotion.state,
              ...state,
            },
          },
        },
      },
    ],
  };
}

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
        await mockService.mockHttpRequest(getGenericLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_MOCK));
        const url = "football/s-1";
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(miniPromotionCardSO.element);
      });

      it("[PRPI-2320] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2321] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardSO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-2322] The mini promo banner card should have a checkbox displayed", async () => {
        expect(await miniPromotionCardSO.checkbox.isDisplayed()).toBe(true);
      });

      it("[PRPI-2323] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardSO.textWrapper.getText()).toBe("Mini Checkmate Test Terms & Conditions");
      });

      describe("and the card is tapped", () => {
        beforeAll(async () => {
          await miniPromotionCardSO.element.click();
          await browser.waitUntilDisplayed(loyaltyBottomSheetSO.element);
        });

        it("[PRPI-2324] The loyalty bottom sheet should have a title displayed", async () => {
          expect(await loyaltyBottomSheetSO.headerTitle.getText()).toBe("My Promotions");
        });

        it("[PRPI-2325] The loyalty bottom sheet should have a close button displayed", async () => {
          expect(await loyaltyBottomSheetSO.headerCloseButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-2326] should close bottom sheet when close is tapped", async () => {
          await loyaltyBottomSheetSO.headerCloseButton.click();

          await browser.waitUntilDisplayed(miniPromotionCardSO.element);

          expect(await loyaltyBottomSheetSO.element.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the promo is opted in", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_OPTED_IN_MOCK));
        const url = "football/s-1";
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(miniPromotionCardSO.element);
      });

      it("[PRPI-2327] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2328] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardSO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-2329] The mini promo banner card should have a read-only checkbox displayed", async () => {
        expect(await miniPromotionCardSO.checkboxReadOnly.isDisplayed()).toBe(true);
      });

      it("[PRPI-2330] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardSO.textWrapper.getText()).toBe(
          "Opted In - Mini Checkmate Test Terms & Conditions",
        );
      });
    });

    describe("and the promo is accepted", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_ACCEPTED_MOCK));
        const url = "football/s-1";
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(miniPromotionCardSO.element);
      });

      it("[PRPI-2331] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2332] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardSO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-2333] The mini promo banner card should have a read-only checkbox displayed", async () => {
        expect(await miniPromotionCardSO.checkboxReadOnly.isDisplayed()).toBe(true);
      });

      it("[PRPI-2334] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardSO.textWrapper.getText()).toBe(
          "Accepted - Mini Checkmate Test Terms & Conditions",
        );
      });
    });

    describe("and the promo is rewarded", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_SPORT_PAGE_WITH_MINI_PROMO_BANNER_CARD_REWARDED_MOCK));
        const url = "football/s-1";

        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });

        await browser.waitUntilDisplayed(miniPromotionCardSO.element);
      });

      it("[PRPI-2335] The mini promo banner card should be displayed", async () => {
        expect(await miniPromotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2336] The mini promo banner card should have a flag displayed", async () => {
        expect(await miniPromotionCardSO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-2337] The mini promo banner card should have an arrow displayed", async () => {
        expect(await miniPromotionCardSO.arrow.isDisplayed()).toBe(true);
      });

      it("[PRPI-2338] The mini promo banner card should have a text displayed", async () => {
        expect(await miniPromotionCardSO.textWrapper.getText()).toBe(
          "Rewarded - Mini Checkmate Test Terms & Conditions",
        );
      });
    });
  });
});
