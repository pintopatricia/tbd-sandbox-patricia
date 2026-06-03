import normalizeMarketBetExpandableCardGroupFragmentIntoMarketBetExpandableCardGroup from "./market-bet-expandable-card-group-normalizer";

describe("normalizeMarketBetExpandableCardGroupFragmentIntoMarketBetExpandableCardGroup", () => {
  const fragmentMock = {
    __typename: "typename",
    urn: "URN",
    marketBetCardGroupURN: "marketBetCardGroupURN",
    isOpen: false,
    partials: {
      edges: [
        null,
        {
          node: {
            __typename: "MarketBetSelectionCardGroup",
            urn: "URN1",
          },
        },
        {
          node: {
            __typename: "MarketBetSelectionCardGroup",
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
            __typename: "MarketBetSelectionCardGroup",
            urn: "URN1",
          },
        },
      ],
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeMarketBetExpandableCardGroupFragmentIntoMarketBetExpandableCardGroup(fragmentMock)).toEqual({
      data: {
        typename: "typename",
        urn: "URN",
        marketBetCardGroupURN: "marketBetCardGroupURN",
        isOpen: false,
        items: fragmentMock.partials.edges.slice(1).map(({ node: { __typename, urn } }) => ({
          typename: __typename,
          urn,
        })),
      },
    });
  });
});
