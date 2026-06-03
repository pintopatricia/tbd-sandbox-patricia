import normalizeMarketBetCardGroupFragmentIntoMarketBetCardGroup from "./market-bet-card-group-normalizer";

describe("normalizeMarketBetCardGroupFragmentIntoMarketBetCardGroup", () => {
  const fragmentMock = {
    __typename: "typename",
    urn: "URN",
    partials: {
      edges: [
        null,
        {
          node: {
            __typename: "MarketBetCard",
            urn: "URN1",
          },
        },
        {
          node: {
            __typename: "MarketBetExpandableCardGroup",
            urn: "URN2",
          },
        },
        {
          node: {
            __typename: "MarketBetSelectionCardGroup",
            urn: "URN3",
          },
        },
        {
          node: {
            __typename: "POTATOES",
            urn: "URN4",
          },
        },
        {
          node: {
            __typename: "MarketBetCard",
            urn: "URN5",
          },
        },
        {
          node: {
            __typename: "MarketBetExpandableCardGroup",
            urn: "URN6",
          },
        },
        {
          node: {
            __typename: "MarketBetSelectionCardGroup",
            urn: "URN7",
          },
        },
      ],
    },
    full: {
      edges: [
        null,
        {
          node: {
            __typename: "MarketBetCard",
            urn: "URN1",
          },
        },
        {
          node: {
            __typename: "MarketBetExpandableCardGroup",
            urn: "URN2",
          },
        },
        {
          node: {
            __typename: "MarketBetSelectionCardGroup",
            urn: "URN3",
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
        items: fragmentMock.partials.edges.slice(1).map(({ node: { __typename, urn } }) => ({
          typename: __typename,
          urn,
        })),
      },
    });
  });
});
