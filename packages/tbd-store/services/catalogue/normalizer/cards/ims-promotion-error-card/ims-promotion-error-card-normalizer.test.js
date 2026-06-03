import normalizeImsPromotionErrorCardFragmentIntoImsPromotionErrorCard from "./ims-promotion-error-card-normalizer";

describe("normalizeImsPromotionErrorCardFragmentIntoImsPromotionErrorCard", () => {
  it("should correctly normalize the card for ALREADY_COMPLETED errorCode", () => {
    const fragmentMock = {
      __typename: "ImsPromotionErrorCard",
      urn: "URN",
      errorCode: "ALREADY_COMPLETED",
      seeAll: {
        viewURN: "viewURN",
        viewURL: "viewURL",
      },
    };
    expect(normalizeImsPromotionErrorCardFragmentIntoImsPromotionErrorCard(fragmentMock)).toEqual({
      data: {
        typename: "ImsPromotionErrorCard",
        urn: fragmentMock.urn,
        errorCode: "COMPLETED",
        seeAll: fragmentMock.seeAll,
      },
    });
  });

  it("should correctly normalize the card for NotEligible errorCode", () => {
    const fragmentMock = {
      __typename: "ImsPromotionErrorCard",
      urn: "URN",
      errorCode: "NOT_ELIGIBLE",
      seeAll: {
        viewURN: "viewURN",
        viewURL: "viewURL",
      },
    };
    expect(normalizeImsPromotionErrorCardFragmentIntoImsPromotionErrorCard(fragmentMock)).toEqual({
      data: {
        typename: "ImsPromotionErrorCard",
        urn: fragmentMock.urn,
        errorCode: "NOT_ELIGIBLE",
        seeAll: fragmentMock.seeAll,
      },
    });
  });

  it("should correctly normalize the card for an unknown errorCode", () => {
    const fragmentMock = {
      __typename: "ImsPromotionErrorCard",
      urn: "URN",
      errorCode: "OPTED_IN",
      seeAll: {
        viewURN: "viewURN",
        viewURL: "viewURL",
      },
    };
    expect(normalizeImsPromotionErrorCardFragmentIntoImsPromotionErrorCard(fragmentMock)).toEqual({
      data: {
        typename: "ImsPromotionErrorCard",
        urn: fragmentMock.urn,
        errorCode: "GENERAL",
        seeAll: fragmentMock.seeAll,
      },
    });
  });
});
