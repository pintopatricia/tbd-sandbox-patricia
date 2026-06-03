import { useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  useStatsPebbleCardGroupQuery,
  StatsPebbleCardGroupQuery,
  writeLocalStatsPebbleCardGroupFragment,
  LocalStatsPebbleCardGroupFragment,
} from "./StatsPebbleCardGroup.graphql";
import { hydrateItemCards } from "./HydratePebbleItemCards";

const CARD_URN = "ppb:tbd:card:1";
const PEBBLE_URN = "ppb:tbd:pebble:1";
const PEBBLE_TYPENAME = "StatsFormCard";
const CACHE_ID = "StatsPebbleCardGroup:ppb:tbd:card:1";

const callFn = jest.fn();
const mockIdentify = jest.fn();
const mockReadFragment = jest.fn();
const mockWriteFragment = jest.fn();

jest.mock("@apollo/client/react", () => ({
  ...jest.requireActual("@apollo/client/react"),
  useLazyQuery: jest.fn(),
}));

jest.mock("../../../apollo-client/client", () => ({
  getApolloClient: jest.fn(() => ({
    cache: {
      identify: mockIdentify,
      readFragment: mockReadFragment,
      writeFragment: mockWriteFragment,
    },
  })),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  generateLayoutSnapshot: jest.fn((value) => value),
}));

jest.mock("./HydratePebbleItemCards", () => ({
  hydrateItemCards: jest.fn(() => true),
}));

function setup() {
  const { result } = renderHook(() => useStatsPebbleCardGroupQuery({ cardURN: CARD_URN }, { visible: true }));
  return result;
}

describe("StatsPebbleCardGroup.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIdentify.mockReturnValue(CACHE_ID);
  });

  describe("useStatsPebbleCardGroupQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "StatsPebbleCardGroup",
                urn: CARD_URN,
                partials: {},
              },
            ],
          },
        },
      ]);
      mockReadFragment.mockReturnValue({});
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();

      expect(useLazyQuery).toHaveBeenCalledWith(StatsPebbleCardGroupQuery);
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.current).toEqual({
        loading: false,
        data: {
          baseCard: {},
          card: {
            __typename: "StatsPebbleCardGroup",
            urn: CARD_URN,
            partials: {},
          },
        },
      });
    });

    it("should hydrate the item cards", () => {
      setup();

      expect(hydrateItemCards).toHaveBeenCalled();
    });

    it("should fetch the card when the component is mounted", () => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: false,
          loading: false,
        },
      ]);

      setup();

      expect(callFn).toHaveBeenCalledWith({
        variables: {
          urn: CARD_URN,
        },
      });
    });

    it("should write the first pebble if it exists", () => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "StatsPebbleCardGroup",
                urn: CARD_URN,
                partials: {
                  edges: [
                    {
                      node: { __typename: PEBBLE_TYPENAME, urn: PEBBLE_URN },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);

      setup();

      expect(mockWriteFragment).toHaveBeenCalledWith({
        id: CACHE_ID,
        fragment: LocalStatsPebbleCardGroupFragment,
        data: {
          selectedPebble: {
            typename: PEBBLE_TYPENAME,
            urn: PEBBLE_URN,
          },
        },
      });
    });
  });

  describe("writeLocalStatsPebbleCardGroupFragment", () => {
    it("should write the fragment to the cache with the correct data", () => {
      writeLocalStatsPebbleCardGroupFragment(CARD_URN, {
        pebbleUrn: PEBBLE_URN,
        typename: PEBBLE_TYPENAME,
      });

      expect(mockWriteFragment).toHaveBeenCalledWith({
        id: CACHE_ID,
        fragment: LocalStatsPebbleCardGroupFragment,
        data: {
          selectedPebble: {
            typename: PEBBLE_TYPENAME,
            urn: PEBBLE_URN,
          },
        },
      });
    });
  });
});
