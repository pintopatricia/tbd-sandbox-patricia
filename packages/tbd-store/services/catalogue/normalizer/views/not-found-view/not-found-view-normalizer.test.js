import normalizeNotFoundViewFragment from "./not-found-view-normalizer";

const BFF_RESPONSE = {
  __typename: "NotFoundView",
  urn: "ppb:tbd:view:notfound:notfound",
  url: "404",
  items: {
    edges: [{ node: { __typename: "RegulatoryCard", urn: "ppb:tbd:card:regulatory:footer", otherData: "otherData" } }],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("NotFoundView normalizer", () => {
  describe("normalizeNotFoundViewFragment", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeNotFoundViewFragment(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "NotFoundView",
        urn: "ppb:tbd:view:notfound:notfound",
        url: "404",
        items: [
          {
            typename: "RegulatoryCard",
            urn: "ppb:tbd:card:regulatory:footer",
          },
        ],
      });
    });
  });
});
