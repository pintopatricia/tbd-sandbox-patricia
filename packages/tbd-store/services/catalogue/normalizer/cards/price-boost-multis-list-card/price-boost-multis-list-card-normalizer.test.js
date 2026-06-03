import priceBoostMultisListCardNormalizer from "./price-boost-multis-list-card-normalizer";
import { normalizeBlurbFragment } from "../blurb-card/blurb-card-normalizer";

jest.mock("../blurb-card/blurb-card-normalizer", () => ({
  normalizeBlurbFragment: jest.fn(() => ({
    title: "blurb title 1",
    description: "blurb description 1",
    isExpanded: true,
  })),
}));

const BFF_RESPONSE = {
  urn: "ppb:tbd:card:priceboostmultislist:1",
  __typename: "PriceBoostMultisListCard",
  pbmTitle: "Title",
  showWasPrice: true,
  blurbs: [
    { title: "blurb title 1", description: "blurb description 1", isCollapsed: false },
    { title: "blurb title 2", description: "blurb description 2", isCollapsed: true },
  ],
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

describe("PriceBoostMultisListCard normalizer", () => {
  describe("normalizePriceBoostMultisListCardFragmentIntoPriceBoostMultisListCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = priceBoostMultisListCardNormalizer(BFF_RESPONSE);

      expect(normalizeBlurbFragment).toHaveBeenCalledTimes(1);
      expect(normalizeBlurbFragment).toHaveBeenCalledWith({
        isCollapsed: false,
        title: "blurb title 1",
        description: "blurb description 1",
      });

      expect(data).toEqual({
        typename: "PriceBoostMultisListCard",
        urn: "ppb:tbd:card:priceboostmultislist:1",
        displayName: "Title",
        showWasPrice: true,
        blurb: { title: "blurb title 1", description: "blurb description 1", isExpanded: true },
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
  });
});
