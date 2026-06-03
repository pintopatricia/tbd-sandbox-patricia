import { useQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import { RaceItemsContentQuery, useRaceItemsContentQuery } from "./RaceItemsContent.graphql";

const refetch = jest.fn();

jest.mock("@apollo/client/react", () => ({
  ...jest.requireActual("@apollo/client/react"),
  useQuery: jest.fn(() => ({
    loading: true,
    data: undefined,
    previousData: undefined,
    refetch,
  })),
}));

const mockedUseQuery = jest.mocked(useQuery);

const setUseQueryReturn = (value: unknown) => {
  mockedUseQuery.mockReturnValue(value as ReturnType<typeof useQuery>);
};

describe("RaceItemsContent.graphql", () => {
  const VIEW_URN = "ppb:tbd:view:race:7|12345.1234";
  const RACE_URN = "ppb:race:12345.1500";

  afterEach(jest.clearAllMocks);

  describe("useRaceItemsContentQuery", () => {
    it("should call useQuery with the correct parameters", () => {
      renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

      expect(useQuery).toHaveBeenCalledWith(
        RaceItemsContentQuery,
        expect.objectContaining({
          variables: { viewURN: VIEW_URN, race: RACE_URN },
        }),
      );
    });

    it("should skip when race is undefined", () => {
      renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: undefined }));

      expect(useQuery).toHaveBeenCalledWith(RaceItemsContentQuery, expect.objectContaining({ skip: true }));
    });

    it("should skip when options.skip is true", () => {
      renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }, { skip: true }));

      expect(useQuery).toHaveBeenCalledWith(RaceItemsContentQuery, expect.objectContaining({ skip: true }));
    });

    it("should pass null for race variable when race is undefined", () => {
      renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: undefined }));

      expect(useQuery).toHaveBeenCalledWith(
        RaceItemsContentQuery,
        expect.objectContaining({
          variables: { viewURN: VIEW_URN, race: null },
        }),
      );
    });

    describe("when useQuery does not return data", () => {
      it("should return loading and undefined items", () => {
        const { result } = renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

        expect(result.current).toEqual({
          loading: true,
          refetch,
          data: {
            items: undefined,
            previousItems: undefined,
          },
        });
      });

      it("should handle a null data payload", () => {
        setUseQueryReturn({
          loading: false,
          data: null,
          previousData: null,
          refetch,
        });

        const { result } = renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

        expect(result.current).toEqual({
          loading: false,
          refetch,
          data: {
            items: undefined,
            previousItems: undefined,
          },
        });
      });
    });

    describe("when useQuery returns data", () => {
      it("should return items from a RaceMeetingView", () => {
        const mockItems = {
          selectedRace: { race: { urn: RACE_URN } },
          edges: [],
          pageInfo: { endCursor: null, hasNextPage: false },
        };

        setUseQueryReturn({
          loading: false,
          data: {
            View: {
              urn: VIEW_URN,
              races: [{ race: { urn: RACE_URN } }],
              items: mockItems,
            },
          },
          previousData: undefined,
          refetch,
        });

        const { result } = renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

        expect(result.current.data.items?.selectedRace.race.urn).toBe(mockItems.selectedRace.race.urn);
        expect(result.current.data.items?.edges).toEqual(mockItems.edges);
        expect(result.current.data.items?.pageInfo).toEqual(mockItems.pageInfo);
        expect(result.current.loading).toBe(false);
      });

      it("should return undefined items for a non-matching view type", () => {
        setUseQueryReturn({
          loading: false,
          data: { View: {} },
          previousData: undefined,
          refetch,
        });

        const { result } = renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

        expect(result.current.data.items).toBeUndefined();
      });

      it("should return undefined items for a SportView without urn", () => {
        setUseQueryReturn({
          loading: false,
          data: {
            View: {
              __typename: "SportView",
            },
          },
          previousData: undefined,
          refetch,
        });

        const { result } = renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

        expect(result.current.data.items).toBeUndefined();
      });

      it("should return previousItems when previousData exists", () => {
        const mockPreviousItems = {
          selectedRace: { race: { urn: "ppb:race:12345.1234" } },
          edges: [],
          pageInfo: { endCursor: null, hasNextPage: false },
        };

        setUseQueryReturn({
          loading: true,
          data: undefined,
          previousData: {
            View: {
              urn: VIEW_URN,
              races: [],
              items: mockPreviousItems,
            },
          },
          refetch,
        });

        const { result } = renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

        expect(result.current.data.previousItems?.selectedRace.race.urn).toBe(mockPreviousItems.selectedRace.race.urn);
        expect(result.current.data.previousItems?.edges).toEqual(mockPreviousItems.edges);
        expect(result.current.data.previousItems?.pageInfo).toEqual(mockPreviousItems.pageInfo);
      });
    });

    describe("query includes races field", () => {
      it("should request races alongside items for cache freshness", () => {
        const mockRaces = [{ race: { urn: "ppb:race:12345.1234" } }, { race: { urn: "ppb:race:12345.1500" } }];

        setUseQueryReturn({
          loading: false,
          data: {
            View: {
              urn: VIEW_URN,
              races: mockRaces,
              items: {
                selectedRace: { race: { urn: RACE_URN } },
                edges: [],
                pageInfo: { endCursor: null, hasNextPage: false },
              },
            },
          },
          previousData: undefined,
          refetch,
        });

        const { result } = renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: RACE_URN }));

        expect(result.current.data.items).toBeDefined();
      });

      it("should skip while preserving an empty-string race variable", () => {
        renderHook(() => useRaceItemsContentQuery({ viewURN: VIEW_URN, race: "" }));

        expect(useQuery).toHaveBeenCalledWith(
          RaceItemsContentQuery,
          expect.objectContaining({
            skip: true,
            variables: {
              viewURN: VIEW_URN,
              race: "",
            },
          }),
        );
      });
    });
  });
});
