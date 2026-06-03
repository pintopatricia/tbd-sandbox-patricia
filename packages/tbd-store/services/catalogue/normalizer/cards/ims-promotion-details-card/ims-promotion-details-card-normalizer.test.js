import normalizeImsPromotionDetailsCardFragmentIntoImsPromotionDetailsCard from "./ims-promotion-details-card-normalizer";

describe("normalizeImsPromotionDetailsCardFragmentIntoImsPromotionDetailsCard", () => {
  const fragmentMock = {
    __typename: "ImsPromotionDetailsCard",
    urn: "URN",
    promotion: {
      urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
      details: [
        {
          spans: [{ start: 0, end: 134, style: "em" }],
          text: "When I say JACKPOT, you say SLOTS!",
          type: "paragraph",
        },
      ],
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeImsPromotionDetailsCardFragmentIntoImsPromotionDetailsCard(fragmentMock)).toEqual({
      data: {
        typename: "ImsPromotionDetailsCard",
        urn: fragmentMock.urn,
        details: fragmentMock.promotion.details,
      },
    });
  });
});
