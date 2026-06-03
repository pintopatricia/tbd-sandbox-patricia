import normalizeGamingCategoryViewFragmentIntoGamingCategoryView from "./gaming-category-view-normalizer";

const BFF_RESPONSE = {
  __typename: "GamingCategoryView",
  urn: "ppb:tbd:view:gamingCategory:1",
  url: "gaming/slots/gamingCategory:1",
  items: {
    edges: [
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:game:1",
        },
      },
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:game:1",
        },
      },
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
  navigationItem: {
    __typename: "NavigationItem",
    title: "Back Navigation Item",
  },
  seoMetaData: {
    __typename: "SeoMetaData",
    metaTitle: "Seo title",
    metaDescription: "Seo description",
  },
};

describe("Gaming category view normalizer", () => {
  describe("normalizeGameViewFragmentIntoGameView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeGamingCategoryViewFragmentIntoGamingCategoryView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "GameCard",
            urn: "ppb:tbd:card:game:1",
          },
        ],
        typename: "GamingCategoryView",
        urn: "ppb:tbd:view:gamingCategory:1",
        url: "gaming/slots/gamingCategory:1",
        navigationItem: {
          __typename: "NavigationItem",
          title: "Back Navigation Item",
        },
        seoMetaData: {
          metaTitle: "Seo title",
          metaDescription: "Seo description",
        },
      });
    });
  });
});
