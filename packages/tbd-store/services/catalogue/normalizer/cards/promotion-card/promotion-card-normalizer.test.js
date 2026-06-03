import promotionCardNormalizer from "./promotion-card-normalizer";

const BFF_RESPONSE_BASE = {
  introLine: "introLine",
  endDate: "12.12.2022",
  optInState: "Completed",
  tags: ["tags"],
  backgroundImage: [
    {
      urn: "https://confluence.app.betfair/download/attachments/272779508/image2020-8-5_15-45-7.png?version=1&modificationDate=1596638708000&api=v2",
      height: 333,
      weight: 444,
    },
  ],
  promotionName: "BET €20 ON THE 13:45 RACE AT GOODWOOD",
  promotionTitle: "GET €20 TO START A FREE BET STREAK",
  termsAndConditions: {
    summary: "Place €20 or more in Exchange back bets on the ‘win’ market of the 13:45 race at Goodwood.",
    url: "https://promos.betfair.com/promotion?promoCode=excstreak280720",
  },
  headline: "headline",
  subHeadline: "subHeadline",
  strapline: "strapline",
  urn: "ppb:tbd:card:promotion:1",
  __typename: "PromotionCard",
  isImsPromo: true,
};

const BFF_RESPONSE_GENERIC = {
  ...BFF_RESPONSE_BASE,
  promotionContentType: "GENERIC",
  action: {
    label: "Bet Now",
    viewLink: {
      viewUrl: "https://promos.betfair.com/promotion?promoCode=excstreak280720",
      viewUrn: "ppb:tbd:view:external:external",
    },
  },
};

const BFF_RESPONSE_ODDSBOOST = {
  ...BFF_RESPONSE_BASE,
  promotionContentType: "ODDSBOOST",
  action: {
    market: {
      urn: "ppb:sbkMarket:924.235275395",
    },
    runner: {
      selectionId: 1,
      handicap: 0,
      runnerURN: "ppb:tbd:some:runner",
    },
    displayPreviousOdd: true,
  },
};

const BFF_RESPONSE_LINK = {
  ...BFF_RESPONSE_GENERIC,
  promotionContentType: "LINK",
  promoTypeLabel: "Betting.Betfair",
};

describe("PromotionCard normalizer", () => {
  describe("normalizePromotionCardFragmentIntoPromotionCard", () => {
    describe("when the promotion type is GENERIC", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = promotionCardNormalizer(BFF_RESPONSE_GENERIC);

        expect(data).toEqual({
          introLine: "introLine",
          endDate: "12.12.2022",
          optInState: "Completed",
          tags: ["tags"],
          action: {
            label: "Bet Now",
            viewLink: {
              viewUrl: "https://promos.betfair.com/promotion?promoCode=excstreak280720",
              viewUrn: "ppb:tbd:view:external:external",
            },
          },
          backgroundImage: [
            {
              urn: "https://confluence.app.betfair/download/attachments/272779508/image2020-8-5_15-45-7.png?version=1&modificationDate=1596638708000&api=v2",
              height: 333,
              weight: 444,
            },
          ],
          headline: "headline",
          subHeadline: "subHeadline",
          strapline: "strapline",
          promotionName: "BET €20 ON THE 13:45 RACE AT GOODWOOD",
          promotionContentType: "GENERIC",
          promotionTitle: "GET €20 TO START A FREE BET STREAK",
          termsAndConditions: {
            summary: "Place €20 or more in Exchange back bets on the ‘win’ market of the 13:45 race at Goodwood.",
            url: "https://promos.betfair.com/promotion?promoCode=excstreak280720",
          },
          urn: "ppb:tbd:card:promotion:1",
          typename: "PromotionCard",
          isImsPromo: true,
        });
      });
    });

    describe("when the promotion type is ODDSBOOST", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = promotionCardNormalizer(BFF_RESPONSE_ODDSBOOST);

        expect(data).toEqual({
          introLine: "introLine",
          endDate: "12.12.2022",
          optInState: "Completed",
          tags: ["tags"],
          action: {
            market: {
              urn: "ppb:sbkMarket:924.235275395",
            },
            runner: {
              selectionId: 1,
              handicap: 0,
              runnerURN: "ppb:tbd:some:runner",
            },
            displayPreviousOdd: true,
          },
          backgroundImage: [
            {
              urn: "https://confluence.app.betfair/download/attachments/272779508/image2020-8-5_15-45-7.png?version=1&modificationDate=1596638708000&api=v2",
              height: 333,
              weight: 444,
            },
          ],
          headline: "headline",
          subHeadline: "subHeadline",
          strapline: "strapline",
          promotionName: "BET €20 ON THE 13:45 RACE AT GOODWOOD",
          promotionContentType: "ODDSBOOST",
          promotionTitle: "GET €20 TO START A FREE BET STREAK",
          termsAndConditions: {
            summary: "Place €20 or more in Exchange back bets on the ‘win’ market of the 13:45 race at Goodwood.",
            url: "https://promos.betfair.com/promotion?promoCode=excstreak280720",
          },
          typename: "PromotionCard",
          urn: "ppb:tbd:card:promotion:1",
          isImsPromo: true,
        });
      });
    });

    describe("when the promotion type is LINK", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = promotionCardNormalizer(BFF_RESPONSE_LINK);

        expect(data).toEqual({
          introLine: "introLine",
          endDate: "12.12.2022",
          optInState: "Completed",
          tags: ["tags"],
          action: {
            label: "Bet Now",
            viewLink: {
              viewUrl: "https://promos.betfair.com/promotion?promoCode=excstreak280720",
              viewUrn: "ppb:tbd:view:external:external",
            },
          },
          backgroundImage: [
            {
              urn: "https://confluence.app.betfair/download/attachments/272779508/image2020-8-5_15-45-7.png?version=1&modificationDate=1596638708000&api=v2",
              height: 333,
              weight: 444,
            },
          ],
          isImsPromo: true,
          headline: "headline",
          subHeadline: "subHeadline",
          strapline: "strapline",
          promotionName: "BET €20 ON THE 13:45 RACE AT GOODWOOD",
          promoTypeLabel: "Betting.Betfair",
          promotionContentType: "LINK",
          promotionTitle: "GET €20 TO START A FREE BET STREAK",
          termsAndConditions: {
            summary: "Place €20 or more in Exchange back bets on the ‘win’ market of the 13:45 race at Goodwood.",
            url: "https://promos.betfair.com/promotion?promoCode=excstreak280720",
          },
          urn: "ppb:tbd:card:promotion:1",
          typename: "PromotionCard",
        });
      });
    });
  });
});
