import {
  isObject,
  isObjectWithTypename,
  isNormalizable,
  isValidTypename,
  isApolloMigratedCard,
  isFragmentWithEdges,
  getNormalizableObjectsFromPartial,
  isPartial,
  isFragmentMinimal,
  isNormalizablePartial,
} from "./normalizer-helpers";

jest.mock("./normalizer-config", () => ({
  normalizers: {},
}));

describe("normalizer-helpers", () => {
  describe("isObject", () => {
    it("should return true for plain objects", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: "value" })).toBe(true);
      expect(isObject({ __typename: "Test" })).toBe(true);
    });

    it("should return false for null", () => {
      expect(isObject(null)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
      expect(isObject([{ key: "value" }])).toBe(false);
    });

    it("should return false for primitives", () => {
      expect(isObject("string")).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });

    it("should return false for functions", () => {
      expect(isObject(() => {})).toBe(false);
      expect(isObject(() => {})).toBe(false);
    });
  });

  describe("isObjectWithTypename", () => {
    it("should return true for objects with __typename property", () => {
      expect(isObjectWithTypename({ __typename: "Test" })).toBe(true);
      expect(isObjectWithTypename({ __typename: "Sport", id: "123" })).toBe(true);
    });

    it("should return false for objects without __typename property", () => {
      expect(isObjectWithTypename({})).toBe(false);
      expect(isObjectWithTypename({ key: "value" })).toBe(false);
    });
  });

  describe("isNormalizable", () => {
    it("should return true for objects", () => {
      expect(isNormalizable({})).toBe(true);
      expect(isNormalizable({ key: "value" })).toBe(true);
      expect(isNormalizable({ __typename: "Test" })).toBe(true);
    });

    it("should return true for arrays", () => {
      expect(isNormalizable([])).toBe(true);
      expect(isNormalizable([1, 2, 3])).toBe(true);
      expect(isNormalizable([{ key: "value" }])).toBe(true);
    });

    it("should return false for primitives", () => {
      expect(isNormalizable("string")).toBe(false);
      expect(isNormalizable(123)).toBe(false);
      expect(isNormalizable(true)).toBe(false);
      expect(isNormalizable(null)).toBe(false);
      expect(isNormalizable(undefined)).toBe(false);
    });

    it("should return false for functions", () => {
      expect(isNormalizable(() => {})).toBe(false);
      expect(isNormalizable(() => {})).toBe(false);
    });
  });

  describe("isValidTypename", () => {
    it("should return false for invalid typenames", () => {
      expect(isValidTypename("InvalidType")).toBe(false);
      expect(isValidTypename("")).toBe(false);
      expect(isValidTypename("SportInvalid")).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isValidTypename(null)).toBe(false);
      expect(isValidTypename(undefined)).toBe(false);
      expect(isValidTypename(123)).toBe(false);
      expect(isValidTypename({})).toBe(false);
      expect(isValidTypename([])).toBe(false);
    });
  });

  describe("isApolloMigratedCard", () => {
    it("should return false for not migrated cards", () => {
      expect(isApolloMigratedCard("QuickLinksCard")).toBe(false);
    });

    it("should return true for migrated cards", () => {
      expect(isApolloMigratedCard("GamingPrizeMachineCard")).toBe(true);
    });
  });

  describe("isFragmentWithEdges", () => {
    it("should return true for a fragment with edges", () => {
      expect(
        isFragmentWithEdges({
          __typename: "FragmentTypename",
          edges: [{ node: { __typename: "PebbleCardGroup" } }],
        }),
      ).toBe(true);
    });

    it("should return false for a fragment with edges without elements", () => {
      expect(isFragmentWithEdges({ __typename: "FragmentTypename", edges: [] })).toBe(false);
    });

    it("should return false for a fragment with edges that is not an array", () => {
      expect(isFragmentWithEdges({ __typename: "FragmentTypename", edges: {} })).toBe(false);
    });

    it("should return false for a fragment without typename", () => {
      expect(isFragmentWithEdges({})).toBe(false);
    });
  });

  describe("getNormalizableObjectsFromPartial", () => {
    const METADATA_PARTIAL_MOCK = {
      __typename: "FavouriteMarketsMetadata",
      total: {
        __typename: "FavouriteMarketsCountMetadata",
        urn: "ppb:tbd:favouriteMarkets:metadata:total",
        limit: 50,
        currentCount: 0,
      },
    };

    const FRAGMENT_MOCK = {
      __typename: "NavigationTabConnection",
      edges: [
        {
          node: {
            __typename: "FavouriteMarketsNavigationTab",
            urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/35140355",
            metadata: {
              ...METADATA_PARTIAL_MOCK,
            },
            objectWithoutTypename: {
              someData: "someData",
            },
          },
        },
      ],
    };

    it("should return an array with the valid partials to normalize", () => {
      expect(getNormalizableObjectsFromPartial(FRAGMENT_MOCK)).toStrictEqual([METADATA_PARTIAL_MOCK]);
    });

    it("should return an empty array when the fragment has no valid fragment to normalize", () => {
      expect(
        getNormalizableObjectsFromPartial({
          __typename: "FragmentTypename",
          edges: [undefined, { __typename: "InvalidType" }],
        }),
      ).toStrictEqual([]);
    });

    it("should return an empty array when the inner fragment is not an object with typename", () => {
      const INVALID_FRAGMENT_MOCK = { ...FRAGMENT_MOCK };
      delete INVALID_FRAGMENT_MOCK.edges[0].node.__typename;

      expect(getNormalizableObjectsFromPartial(INVALID_FRAGMENT_MOCK)).toStrictEqual([]);
    });
  });

  describe("isNormalizablePartial", () => {
    it("should return true for PebbleCardGroup normalizable partials", () => {
      expect(
        isNormalizablePartial({
          __typename: "FragmentTypename",
          edges: [{ node: { __typename: "PebbleCardGroup" } }],
        }),
      ).toBe(true);
    });

    it("should return true for ExpandableMarketCard normalizable partials", () => {
      expect(
        isNormalizablePartial({
          __typename: "FragmentTypename",
          edges: [{ node: { __typename: "ExpandableMarketCard" } }],
        }),
      ).toBe(true);
    });

    it("should return true for PopularSelectionsCard normalizable partials", () => {
      expect(
        isNormalizablePartial({
          __typename: "FragmentTypename",
          edges: [{ node: { __typename: "PopularSelectionsCard" } }],
        }),
      ).toBe(true);
    });

    it("should return false for non-normalizable partials", () => {
      expect(
        isNormalizablePartial({
          __typename: "FragmentTypename",
          edges: [undefined, { node: { __typename: "InvalidType" } }],
        }),
      ).toBe(false);
    });

    it("should return false for an empty array", () => {
      expect(isNormalizablePartial({ __typename: "FragmentTypename", edges: [] })).toBe(false);
    });

    it("should return false for objects without __typename", () => {
      expect(isNormalizablePartial({ __typename: "FragmentTypename", edges: [{ node: {} }] })).toBe(false);
    });
  });

  describe("isPartial", () => {
    it("should return true for valid partial fragment keys", () => {
      expect(isPartial("partials")).toBe(true);
      expect(isPartial("partialItems")).toBe(true);
      expect(isPartial("halfTimeSpecialsPartials")).toBe(true);
    });

    it("should return false for invalid fragment keys", () => {
      expect(isPartial("invalid")).toBe(false);
      expect(isPartial("")).toBe(false);
      expect(isPartial("partial")).toBe(false);
      expect(isPartial("items")).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isPartial(null)).toBe(false);
      expect(isPartial(undefined)).toBe(false);
      expect(isPartial(123)).toBe(false);
      expect(isPartial({})).toBe(false);
      expect(isPartial([])).toBe(false);
    });
  });

  describe("isFragmentMinimal", () => {
    it("should return false for fragments with only __typename and urn", () => {
      expect(isFragmentMinimal({ __typename: "Test", urn: "urn:test" })).toBe(false);
    });

    it("should return true for fragments with more than two properties", () => {
      expect(isFragmentMinimal({ __typename: "Test", urn: "urn:test", extra: "value" })).toBe(true);
    });

    it("should return false for fragments with only one property", () => {
      expect(isFragmentMinimal({ __typename: "Test" })).toBe(false);
      expect(isFragmentMinimal({ urn: "urn:test" })).toBe(false);
    });
  });
});
