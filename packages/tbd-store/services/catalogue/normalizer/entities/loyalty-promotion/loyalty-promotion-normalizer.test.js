import normalizeLoyaltyPromotionFragmentIntoLoyaltyPromotion from "./loyalty-promotion-normalizer";

describe("normalizeLoyaltyPromotionFragmentIntoLoyaltyPromotion", () => {
  const fragmentMock = {
    __typename: "LoyaltyPromotion",
    urn: "ppb:tbd:loyaltyPromotion:pph/CHECKMATE1",
    name: "Checkmate Testing",
    title: null,
    promoImage: {
      url: "https://pma-s3.betfair.com.nxt.ppbdev.com/cpp/bf/2023/7/18/2023-07-18_14-43-22_458x457.png",
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
          name: "Opt-inTest",
        },
        viewLink: {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://promos.betfair.com/promotion?promoCode=CHECKMATE1",
          viewDisplayMode: "BLANK_INAPP",
        },
      },
    },
    termsAndConditions: {
      summary: null,
      link: {
        label: {
          __typename: "DisplayNameTranslationKey",
          translationKey: "I18N.PROMO.T&C.TEXT",
        },
        viewLink: {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://promos.betfair.com/promotion?promoCode=CHECKMATE1",
          viewDisplayMode: "BLANK_INAPP",
        },
      },
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeLoyaltyPromotionFragmentIntoLoyaltyPromotion(fragmentMock)).toEqual({
      data: {
        typename: "LoyaltyPromotion",
        urn: "ppb:tbd:loyaltyPromotion:pph/CHECKMATE1",
        name: "Checkmate Testing",
        title: null,
        promoImage: {
          url: "https://pma-s3.betfair.com.nxt.ppbdev.com/cpp/bf/2023/7/18/2023-07-18_14-43-22_458x457.png",
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
              name: "Opt-inTest",
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://promos.betfair.com/promotion?promoCode=CHECKMATE1",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
        },
        termsAndConditions: {
          summary: null,
          link: {
            label: {
              __typename: "DisplayNameTranslationKey",
              translationKey: "I18N.PROMO.T&C.TEXT",
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://promos.betfair.com/promotion?promoCode=CHECKMATE1",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
        },
      },
    });
  });
});
