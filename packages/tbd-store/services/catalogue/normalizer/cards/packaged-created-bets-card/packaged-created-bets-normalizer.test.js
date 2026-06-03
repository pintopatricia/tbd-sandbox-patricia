import packagedCreatedBetsNormalizer from "./packaged-created-bets-normalizer";

const BFF_RESPONSE = {
  urn: "ppb:tbd:card:packagedcreatedbets:1",
  __typename: "PackagedCreatedBetsCard",
  pcbLayout: "IN_CARD",
  pcbTitle: "Title",
  favouriteMarketsState: null,
  items: {
    pageInfo: {
      endCursor: "MA==",
      hasNextPage: true,
    },
    edges: [
      {
        cursor: "MA==",
        node: {
          urn: "ppb:item:12345",
        },
      },
    ],
  },
};

describe("PackagedCreatedBetsCard normalizer", () => {
  describe("normalizePackagedCreatedBetsCardFragmentIntoPackagedCreatedBetsCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = packagedCreatedBetsNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "PackagedCreatedBetsCard",
        urn: "ppb:tbd:card:packagedcreatedbets:1",
        displayName: "Title",
        layout: "IN_CARD",
        endCursor: "MA==",
        hasNextPage: true,
        items: [
          {
            cursor: "MA==",
            urn: "ppb:item:12345",
            typename: undefined,
          },
        ],
      });
    });

    describe("when favouriteMarketsState is present", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = packagedCreatedBetsNormalizer({
          ...BFF_RESPONSE,
          favouriteMarketsState: {
            urn: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
          },
        });

        expect(data.favouriteMarketsStateURN).toEqual("ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107");
      });
    });
  });
});
