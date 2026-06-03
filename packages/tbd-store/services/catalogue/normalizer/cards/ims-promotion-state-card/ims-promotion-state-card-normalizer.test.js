import normalizeImsPromotionStateCardFragmentIntoImsPromotionStateCard from "./ims-promotion-state-card-normalizer";

describe("normalizeImsPromotionStateCardFragmentIntoImsPromotionStateCard", () => {
  const fragmentMock = {
    __typename: "ImsPromotionStateCard",
    urn: "URN",
    promotion: {
      urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
    },
    depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
  };

  const fragmentMockNoLink = {
    __typename: "ImsPromotionStateCard",
    urn: "URN",
    promotion: {
      urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
    },
    depositLink: null,
  };

  it("should correctly normalize the card", () => {
    expect(normalizeImsPromotionStateCardFragmentIntoImsPromotionStateCard(fragmentMock)).toEqual({
      data: {
        typename: "ImsPromotionStateCard",
        urn: fragmentMock.urn,
        promotion: fragmentMock.promotion.urn,
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      },
    });
  });

  it("with no link, should correctly normalize the card", () => {
    expect(normalizeImsPromotionStateCardFragmentIntoImsPromotionStateCard(fragmentMockNoLink)).toEqual({
      data: {
        typename: "ImsPromotionStateCard",
        urn: fragmentMock.urn,
        promotion: fragmentMock.promotion.urn,
        depositLink: undefined,
      },
    });
  });
});
