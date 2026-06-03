import normalizeImsPromotionTermsCardFragmentIntoImsPromotionTermsCard from "./ims-promotion-terms-card-normalizer";

describe("normalizeImsPromotionTermsCardFragmentIntoImsPromotionTermsCard", () => {
  const fragmentMock = {
    __typename: "ImsPromotionTermsAndConditionsCard",
    urn: "URN",
    promotion: {
      urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
      termsAndConditions: [
        {
          spans: [{ start: 0, end: 134, style: "em" }],
          text: "When I say JACKPOT, you say SLOTS!",
          type: "paragraph",
        },
      ],
    },
  };
  const fragmentMockNoTerms = {
    __typename: "ImsPromotionTermsAndConditionsCard",
    urn: "URN",
    title: "Title",
    promotion: {
      urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
      termsAndConditions: null,
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeImsPromotionTermsCardFragmentIntoImsPromotionTermsCard(fragmentMock)).toEqual({
      data: {
        typename: "ImsPromotionTermsAndConditionsCard",
        urn: fragmentMock.urn,
        termsAndConditions: fragmentMock.promotion.termsAndConditions,
      },
    });
  });

  it("with no terms, should correctly normalize the card", () => {
    expect(normalizeImsPromotionTermsCardFragmentIntoImsPromotionTermsCard(fragmentMockNoTerms)).toEqual({
      data: {
        typename: "ImsPromotionTermsAndConditionsCard",
        urn: fragmentMock.urn,
        title: fragmentMock.title,
        termsAndConditions: [],
      },
    });
  });
});
