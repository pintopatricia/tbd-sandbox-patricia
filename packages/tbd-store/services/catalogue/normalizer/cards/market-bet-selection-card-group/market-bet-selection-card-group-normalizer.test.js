import normalizeMarketBetCardGroupFragmentIntoMarketBetCardGroup from "./market-bet-selection-card-group-normalizer";

describe("normalizeMarketBetCardGroupFragmentIntoMarketBetCardGroup", () => {
  const fragmentMock = {
    __typename: "typename",
    urn: "URN",
    betCardGroupURN: "betCardGroupURN",
    marketBetCardURN: "marketBetCardURN",
    marketBetCardGroupURN: "marketBetCardGroupURN",
    partials: {
      edges: [
        null,
        {
          node: {
            __typename: "MarketBetSelectionCard",
            urn: "URN1",
          },
        },
        {
          node: {
            __typename: "MarketBetSelectionCard",
            urn: "URN2",
          },
        },
      ],
    },
    full: {
      edges: [
        null,
        {
          node: {
            __typename: "MarketBetSelectionCard",
            urn: "URN1",
          },
        },
      ],
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeMarketBetCardGroupFragmentIntoMarketBetCardGroup(fragmentMock)).toEqual({
      data: {
        typename: "typename",
        urn: "URN",
        betCardGroupURN: "betCardGroupURN",
        marketBetCardURN: "marketBetCardURN",
        marketBetCardGroupURN: "marketBetCardGroupURN",
        items: fragmentMock.partials.edges.slice(1).map(({ node: { __typename, urn } }) => ({
          typename: __typename,
          urn,
        })),
      },
    });
  });
});
