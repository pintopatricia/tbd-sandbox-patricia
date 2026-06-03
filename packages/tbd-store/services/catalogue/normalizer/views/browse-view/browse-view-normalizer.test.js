import normalizeBrowseViewFragmentIntoBrowseView from "./browse-view-normalizer";

const BFF_RESPONSE = {
  __typename: "BrowseView",
  urn: "ppb:tbd:view:generic:browse",
  url: "browse/browse",
  items: {
    edges: [
      {
        node: {
          __typename: "QuickLinksCard",
          urn: "ppb:tbd:card:quickLinks:azMenu:sports",
        },
        theme: "THEME",
      },
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("Browse view normalizer", () => {
  describe("normalizeBrowseViewFragmentIntoBrowseView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeBrowseViewFragmentIntoBrowseView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "QuickLinksCard",
            urn: "ppb:tbd:card:quickLinks:azMenu:sports",
            theme: "THEME",
          },
        ],
        typename: "BrowseView",
        urn: "ppb:tbd:view:generic:browse",
        url: "browse/browse",
        isOpen: false,
        search: {
          inputSearchTerm: "",
          result: {
            items: [],
            pageSize: 0,
            query: "",
            startIndex: 0,
          },
        },
      });
    });
  });
});
