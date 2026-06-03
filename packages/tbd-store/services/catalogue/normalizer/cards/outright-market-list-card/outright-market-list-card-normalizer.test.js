import normalizeOutrightMarketListCardFragmentIntoOutrightMarketListCard from "./outright-market-list-card-normalizer";

const BFF_RESPONSE = {
  __typename: "OutrightMarketListCard",
  urn: "ppb:tbd:card:outrightMarketList:12345",
  title: "Card Title",
  numberOfRowsToDisplay: 2,
  markets: [
    {
      urn: "ppb:sbkMarket:924.1111",
      name: "Winner",
    },
    {
      urn: "ppb:sbkMarket:924.2222",
      name: "Winner",
    },
  ],
  favouriteMarketsState: null,
};

describe("OutrightMarketListCard normalizer", () => {
  it("should correctly transform and return the data object", () => {
    const { data } = normalizeOutrightMarketListCardFragmentIntoOutrightMarketListCard(BFF_RESPONSE);

    expect(data).toEqual({
      typename: "OutrightMarketListCard",
      urn: "ppb:tbd:card:outrightMarketList:12345",
      markets: ["ppb:sbkMarket:924.1111", "ppb:sbkMarket:924.2222"],
      title: "Card Title",
      numberOfRowsToDisplay: 2,
    });
  });

  it("should return numberOfRowsToDisplay as undefined if BFF returns that value as null", () => {
    const { data } = normalizeOutrightMarketListCardFragmentIntoOutrightMarketListCard({
      ...BFF_RESPONSE,
      numberOfRowsToDisplay: null,
    });

    expect(data.numberOfRowsToDisplay).toBeUndefined();
  });

  it("should return favouriteMarketsStateURN as undefined if BFF returns favouriteMarketsState as null", () => {
    const { data } = normalizeOutrightMarketListCardFragmentIntoOutrightMarketListCard({
      ...BFF_RESPONSE,
      favouriteMarketsState: null,
    });

    expect(data.favouriteMarketsStateURN).toBeUndefined();
  });

  it("should return favouriteMarketsStateURN correctly when favouriteMarketsState is received", () => {
    const { data } = normalizeOutrightMarketListCardFragmentIntoOutrightMarketListCard({
      ...BFF_RESPONSE,
      favouriteMarketsState: {
        urn: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
      },
    });

    expect(data.favouriteMarketsStateURN).toEqual("ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107");
  });
});
