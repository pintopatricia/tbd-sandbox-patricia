import { PromotionsHubViewFragment, ViewCategory } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizePromotionsHubViewFragmentIntoPromotionsHubView from "./promotions-hub-view-normalizer";

const PROMOTIONS_HUB_VIEW_URN = "ppb:tbd:view:promotionsHub:promotionsHub";
const URL = "/promotions";

const BFF_RESPONSE: PromotionsHubViewFragment = {
  __typename: "PromotionsHubView",
  urn: PROMOTIONS_HUB_VIEW_URN,
  url: URL,
  title: "Promotions",
  category: ViewCategory.Account,
  xsellBar: {
    __typename: "XSellBar",
    sections: [],
  },
  items: {
    edges: [
      {
        node: {
          __typename: "PromotionsHubCardGroup",
          urn: "ppb:tbd:card:promotions-hub:1",
        },
      },
      {
        node: {
          __typename: "PromotionsHubCardGroup",
          urn: "ppb:tbd:card:promotions-hub:2",
        },
      },
    ],
  },
};

describe("normalizePromotionsHubViewFragmentIntoPromotionsHubView", () => {
  it("should correctly transform and return the data object", () => {
    const { data } = normalizePromotionsHubViewFragmentIntoPromotionsHubView(BFF_RESPONSE);

    expect(data).toEqual({
      typename: "PromotionsHubView",
      urn: "ppb:tbd:view:promotionsHub:promotionsHub",
      title: "Promotions",
      url: "/promotions",
      xsellBar: {
        __typename: "XSellBar",
        sections: [],
      },
      items: [
        {
          typename: "PromotionsHubCardGroup",
          urn: "ppb:tbd:card:promotions-hub:1",
        },
        {
          typename: "PromotionsHubCardGroup",
          urn: "ppb:tbd:card:promotions-hub:2",
        },
      ],
    });
  });

  it("should handle missing title", () => {
    const fragmentWithoutTitle: PromotionsHubViewFragment = {
      ...BFF_RESPONSE,
      title: null,
    };

    const { data } = normalizePromotionsHubViewFragmentIntoPromotionsHubView(fragmentWithoutTitle);

    expect(data.title).toBeUndefined();
    expect(data.typename).toBe("PromotionsHubView");
    expect(data.urn).toBe("ppb:tbd:view:promotionsHub:promotionsHub");
  });

  it("should handle empty partialItems", () => {
    const fragmentWithEmptyItems: PromotionsHubViewFragment = {
      ...BFF_RESPONSE,
      items: {
        edges: [],
      },
    };

    const { data } = normalizePromotionsHubViewFragmentIntoPromotionsHubView(fragmentWithEmptyItems);

    expect(data.items).toEqual([]);
  });

  it("should filter out items with null or undefined nodes", () => {
    const fragmentWithNullNodes: PromotionsHubViewFragment = {
      ...BFF_RESPONSE,
      items: {
        edges: [
          {
            node: {
              __typename: "PromotionsHubCardGroup",
              urn: "ppb:tbd:card:promotions-hub:1",
            },
          },
          null,
          {
            node: {
              __typename: "PromotionsHubCardGroup",
              urn: "ppb:tbd:card:promotions-hub:2",
            },
          },
        ],
      },
    };

    const { data } = normalizePromotionsHubViewFragmentIntoPromotionsHubView(fragmentWithNullNodes);

    expect(data.items).toHaveLength(2);
    expect(data.items[0].urn).toBe("ppb:tbd:card:promotions-hub:1");
    expect(data.items[1].urn).toBe("ppb:tbd:card:promotions-hub:2");
  });

  it("should handle items without urn field", () => {
    const fragmentWithItemsWithoutUrn: PromotionsHubViewFragment = {
      ...BFF_RESPONSE,
      items: {
        edges: [
          {
            node: {
              __typename: "PromotionsHubCardGroup",
              urn: "ppb:tbd:card:promotions-hub:1",
            },
          },
          {
            node: {
              __typename: "SomeOtherType",
            } as any,
          },
        ],
      },
    };

    const { data } = normalizePromotionsHubViewFragmentIntoPromotionsHubView(fragmentWithItemsWithoutUrn);

    expect(data.items).toHaveLength(1);
    expect(data.items[0].urn).toBe("ppb:tbd:card:promotions-hub:1");
  });
});
