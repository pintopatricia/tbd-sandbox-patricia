import normalizeSearchZoneFragmentIntoSearchZone from "./search-zone-normalizer";

const BFF_RESPONSE = {
  __typename: "SearchZone",
  urn: "ppb:tbd:gaming:masterConfigElement:search_zone/0",
  searchZoneItems: {
    edges: [
      {
        node: {
          __typename: "SearchBarCard",
          searchTitle: null,
          searchPlaceholder: null,
          urn: "ppb:tbd:card:searchBar:search|id-1728465800784-0.3368816793311209",
        },
      },
    ],
  },
};

const BFF_RESPONSE2 = {
  __typename: "SearchZone",
  urn: "ppb:tbd:gaming:masterConfigElement:search_zone/0",
  searchZoneItems: {
    edges: [undefined, undefined],
  },
};

describe("View zone normalizer", () => {
  describe("normalizeSearchZoneFragmentIntoSearchZone", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSearchZoneFragmentIntoSearchZone(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "SearchBarCard",
            urn: "ppb:tbd:card:searchBar:search|id-1728465800784-0.3368816793311209",
          },
        ],
        urn: "ppb:tbd:gaming:masterConfigElement:search_zone/0",
        typename: "SearchZone",
      });
    });

    // eslint-disable-next-line jest/no-identical-title
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSearchZoneFragmentIntoSearchZone(BFF_RESPONSE2);

      expect(data).toEqual({
        items: [],
        urn: "ppb:tbd:gaming:masterConfigElement:search_zone/0",
        typename: "SearchZone",
      });
    });
  });
});
