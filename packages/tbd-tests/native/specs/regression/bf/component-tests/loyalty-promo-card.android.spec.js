const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");

const { PromoCardSO, LoyaltyBottomSheetSO } = require("../../../../screen-objects");

const mockService = new MockService();

const promotionCardSO = new PromoCardSO();
const loyaltyBottomSheetSO = new LoyaltyBottomSheetSO();

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
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_NOT_OPTED_IN_MOCK));

        const url = `football/s-${SPORT_ID}`;
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(promotionCardSO.element);
        await browser.waitUntilDisplayed(promotionCardSO.optInCheckbox);
      });

      it("[PRPI-2230] The mini promo banner card should be displayed", async () => {
        expect(await promotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2231] The loyalty promotion card should have the correct title", async () => {
        expect(await promotionCardSO.title.getText()).toBe("GET A FREE £5 BET WHEN YOU PLACE A £5 BET");
      });

      it("[PRPI-2232] The loyalty promotion card should have the correct sub-title", async () => {
        expect(await promotionCardSO.subtitle.getText()).toBe("Spanish La Liga");
      });

      it("[PRPI-2233] The loyalty promotion card should display the image", async () => {
        expect(await promotionCardSO.image.isDisplayed()).toBe(true);
      });

      it("[PRPI-2234] The loyalty promotion card should have the correct T&Cs", async () => {
        expect(await promotionCardSO.summary.getText()).toBe(
          "Opt-in required. Max £5 Free Bet, valid 2 days on Sports. T&C Apply",
        );
      });

      it("[PRPI-2235] The loyalty promotion card should have the correct optin text", async () => {
        expect(await promotionCardSO.optInText.getText()).toBe("Opt In");
      });

      it("[PRPI-2236] The loyalty promotion card should have the optin checkbox displayed", async () => {
        expect(await promotionCardSO.optInCheckbox.isDisplayed()).toBe(true);
      });

      it("[PRPI-2237] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardSO.bookmarkText.getText()).toBe("Promotion");
      });

      describe("and the card is tapped", () => {
        beforeAll(async () => {
          await promotionCardSO.element.click();
          await browser.waitUntilDisplayed(loyaltyBottomSheetSO.element);
        });

        it("[PRPI-2238] The loyalty bottom sheet should have a title displayed", async () => {
          expect(await loyaltyBottomSheetSO.headerTitle.getText()).toBe("My Promotions");
        });

        it("[PRPI-2239] The loyalty bottom sheet should have a close button displayed", async () => {
          expect(await loyaltyBottomSheetSO.headerCloseButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-2240] should close bottom sheet when close is tapped", async () => {
          await loyaltyBottomSheetSO.headerCloseButton.click();
          await browser.waitUntilDisplayed(promotionCardSO.element);

          expect(await loyaltyBottomSheetSO.element.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the promo is opted in", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_OPTED_IN_MOCK));

        const url = `football/s-${SPORT_ID}`;
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(promotionCardSO.element);
        await browser.waitUntilDisplayed(promotionCardSO.statusLabel);
      });

      it("[PRPI-2241] The loyalty promotion card should be displayed", async () => {
        expect(await promotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2242] The loyalty promotion card should have the correct CTA text", async () => {
        expect(await promotionCardSO.statusLabel.getText()).toBe("Bet here");
      });

      it("[PRPI-2243] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardSO.bookmarkText.getText()).toBe("Opted In");
      });
    });

    describe("and the promo is accepted", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_ACCEPTED_MOCK));

        const url = `football/s-${SPORT_ID}`;
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(promotionCardSO.element);
        await browser.waitUntilDisplayed(promotionCardSO.statusLabel);
      });

      it("[PRPI-2244] The loyalty promotion card should be displayed", async () => {
        expect(await promotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2245] The loyalty promotion card should have the correct CTA text", async () => {
        expect(await promotionCardSO.statusLabel.getText()).toBe("Bet here");
      });

      it("[PRPI-2246] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardSO.bookmarkText.getText()).toBe("Accepted");
      });
    });

    describe("and the promo is rewarded", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_WITH_LOYALTY_PROMOTION_REWARDED_MOCK));

        const url = `football/s-${SPORT_ID}`;
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });
        await browser.waitUntilDisplayed(promotionCardSO.element);
        await browser.waitUntilDisplayed(promotionCardSO.statusLabel);
      });

      it("[PRPI-2247] The loyalty promotion card should be displayed", async () => {
        expect(await promotionCardSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2248] The loyalty promotion card should have the correct CTA text", async () => {
        expect(await promotionCardSO.statusLabel.getText()).toBe("Bet here");
      });

      it("[PRPI-2249] The loyalty promotion card should have the correct bookmark text", async () => {
        expect(await promotionCardSO.bookmarkText.getText()).toBe("Rewarded");
      });
    });
  });
});
