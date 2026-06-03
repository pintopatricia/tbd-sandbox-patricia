import normalizeSearchBarCardFragmentIntoSearchBarCard from "./search-bar-card-normalizer";

const BFF_RESPONSE = {
  __typename: "SearchBarCard",
  urn: {
    qComponent: undefined,
    referenceId: "test|id-123456789-0.5",
    type: "test",
    uid: "test:test|id-123456789-0.5",
  },
  searchTitle: {
    name: "Card Title",
  },
  searchPlaceholder: {
    name: "Search Placeholder",
  },
};

const expectedURN = {
  qComponent: undefined,
  referenceId: "test|id-123456789-0.5",
  type: "test",
  uid: "test:test|id-123456789-0.5",
};

describe("SearchBarCard normalizer", () => {
  describe("normalizeSearchBarCardFragmentIntoSearchBarCard", () => {
    it("should return title & placeholder as null if the bff response is an empty object for title and placeholder", () => {
      const { data } = normalizeSearchBarCardFragmentIntoSearchBarCard({
        ...BFF_RESPONSE,
        searchTitle: {},
        searchPlaceholder: {},
      });

      expect(data).toEqual({
        urn: expectedURN,
        placeholder: null,
        title: null,
        typename: "SearchBarCard",
      });
    });
    it("should return title & placeholder as null if the bff response is null for title and placeholder", () => {
      const { data } = normalizeSearchBarCardFragmentIntoSearchBarCard({
        ...BFF_RESPONSE,
        searchTitle: null,
        searchPlaceholder: null,
      });

      expect(data).toEqual({
        urn: expectedURN,
        placeholder: null,
        title: null,
        typename: "SearchBarCard",
      });
    });
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSearchBarCardFragmentIntoSearchBarCard(BFF_RESPONSE);

      expect(data).toEqual({
        urn: expectedURN,
        placeholder: "Search Placeholder",
        title: "Card Title",
        typename: "SearchBarCard",
      });
    });
  });
});
