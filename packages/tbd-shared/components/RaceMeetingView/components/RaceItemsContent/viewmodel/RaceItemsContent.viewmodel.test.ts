import { renderHook } from "@testing-library/react";
import type { InitialItemsData } from "../../RaceMeetingView/viewmodel/RaceMeetingView.viewmodel";
import { useRaceItemsContentQuery } from "../model/RaceItemsContent.graphql";
import { useRaceItemsContentVM } from "./RaceItemsContent.viewmodel";

jest.mock("../model/RaceItemsContent.graphql", () => ({
  useRaceItemsContentQuery: jest.fn(() => ({
    loading: false,
    refetch: jest.fn(),
    data: {
      items: undefined,
      previousItems: undefined,
    },
  })),
}));

const mockedUseRaceItemsContentQuery = jest.mocked(useRaceItemsContentQuery);

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";
const RACE_URN = "ppb:race:12345.1500";
const NEXT_RACE_URN = "ppb:race:12345.1600";

type ItemsEdge = NonNullable<InitialItemsData["edges"]>[number];

const buildSelectedRace = (): NonNullable<InitialItemsData["selectedRace"]> => ({
  race: {
    urn: RACE_URN,
    raceId: "12345",
    name: "Race 1",
    startTime: "2026-04-23T15:00:00Z",
    verdict: null,
    broadcasts: null,
    primaryMarket: null,
    raceKind: null,
    availableToSubscribe: false,
  },
  viewLink: {
    viewUrn: VIEW_URN,
    viewUrl: "horse-racing/example",
  },
  promotion: null,
});

const buildItems = (edges: ItemsEdge[] = []): InitialItemsData =>
  ({
    selectedRace: buildSelectedRace(),
    edges,
    pageInfo: null,
    __typename: "RaceContentConnection",
  }) as InitialItemsData;

const buildEdge = (node: Record<string, unknown> | null | undefined): ItemsEdge =>
  ({
    node,
    cursor: null,
    theme: null,
  }) as ItemsEdge;

const initialItems = buildItems();

const expectLastItemsQueryCall = (race: string | undefined, skip: boolean) => {
  expect(mockedUseRaceItemsContentQuery.mock.calls.at(-1)).toEqual([
    { viewURN: VIEW_URN, race },
    { skip },
  ]);
};

const setQueryReturn = (overrides: Partial<ReturnType<typeof useRaceItemsContentQuery>> = {}) => {
  mockedUseRaceItemsContentQuery.mockReturnValue({
    loading: false,
    refetch: jest.fn(),
    data: { items: undefined, previousItems: undefined },
    ...overrides,
  });
};

describe("RaceItemsContent.viewmodel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setQueryReturn();
  });

  it("keeps the items query skipped while parent race data is still loading", () => {
    renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN, undefined, undefined, true));

    expect(mockedUseRaceItemsContentQuery).toHaveBeenCalledWith(
      { viewURN: VIEW_URN, race: RACE_URN },
      { skip: true },
    );
  });

  it("keeps the items query skipped when matching parent items are available", () => {
    renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN, initialItems));

    expect(mockedUseRaceItemsContentQuery).toHaveBeenCalledWith(
      { viewURN: VIEW_URN, race: RACE_URN },
      { skip: true },
    );
  });

  it("allows the items query when parent data does not cover the selected race", () => {
    renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN));

    expect(mockedUseRaceItemsContentQuery).toHaveBeenCalledWith(
      { viewURN: VIEW_URN, race: RACE_URN },
      { skip: false },
    );
  });

  it("activates the items query when a quick result needs fresh data", () => {
    const { rerender } = renderHook(
      ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, initialItems, resultType),
      {
        initialProps: { resultType: undefined as string | null | undefined },
      },
    );

    rerender({ resultType: "QUICK_RESULT" });

    expectLastItemsQueryCall(RACE_URN, false);
  });

  describe("mapCardEdges", () => {
    it("filters invalid nodes and maps urn keys", () => {
      const { result } = renderHook(() =>
        useRaceItemsContentVM(
          VIEW_URN,
          RACE_URN,
          buildItems([
            buildEdge(null),
            buildEdge({ urn: "ppb:card:missing-typename" }),
            buildEdge({ __typename: "NavigationTabsList" }),
            buildEdge({ __typename: "RegulatoryCard", urn: "ppb:card:regulatory" }),
          ]),
        ),
      );

      expect(result.current.vm.data.cardEdges).toEqual([
        {
          key: "NavigationTabsList-null",
          typename: "NavigationTabsList",
          urn: null,
        },
        {
          key: "RegulatoryCard-ppb:card:regulatory",
          typename: "RegulatoryCard",
          urn: "ppb:card:regulatory",
        },
      ]);
    });

    it("returns an empty list when edges are empty", () => {
      const { result } = renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN, buildItems()));

      expect(result.current.vm.data.cardEdges).toEqual([]);
    });
  });

  describe("race change resets transition tracking", () => {
    it("updates the query inputs when the race changes after result transitions", () => {
      const refetch = jest.fn();
      setQueryReturn({ refetch });

      const { rerender } = renderHook(
        ({ raceUrn, resultType }) => useRaceItemsContentVM(VIEW_URN, raceUrn, undefined, resultType),
        {
          initialProps: {
            raceUrn: RACE_URN,
            resultType: undefined as string | null | undefined,
          },
        },
      );

      rerender({ raceUrn: RACE_URN, resultType: "QUICK_RESULT" });
      expect(refetch).toHaveBeenCalledTimes(1);

      rerender({ raceUrn: RACE_URN, resultType: "FULL_RESULT" });
      expect(refetch).toHaveBeenCalledTimes(1);

      rerender({ raceUrn: NEXT_RACE_URN, resultType: "FULL_RESULT" });

      expectLastItemsQueryCall(NEXT_RACE_URN, false);
      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("does not throw when raceUrn becomes undefined", () => {
      const { rerender } = renderHook(
        ({ raceUrn }) => useRaceItemsContentVM(VIEW_URN, raceUrn, initialItems, "FULL_RESULT"),
        {
          initialProps: { raceUrn: RACE_URN as string | undefined },
        },
      );

      expect(() => rerender({ raceUrn: undefined })).not.toThrow();
    });
  });

  describe("result-type activation", () => {
    it("does not re-activate on quick result when the query is already active", () => {
      const { rerender } = renderHook(
        ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, undefined, resultType),
        {
          initialProps: {
            resultType: undefined as string | null | undefined,
          },
        },
      );

      mockedUseRaceItemsContentQuery.mockClear();
      rerender({ resultType: "QUICK_RESULT" });

      expectLastItemsQueryCall(RACE_URN, false);
    });

    it("activates the query for a first full result transition while skipped", () => {
      const { rerender } = renderHook(
        ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, initialItems, resultType),
        {
          initialProps: {
            resultType: undefined as string | null | undefined,
          },
        },
      );

      rerender({ resultType: "FULL_RESULT" });

      expectLastItemsQueryCall(RACE_URN, false);
    });

    it("does not re-activate when full result is rendered twice", () => {
      const { rerender } = renderHook(
        ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, initialItems, resultType),
        {
          initialProps: {
            resultType: undefined as string | null | undefined,
          },
        },
      );

      rerender({ resultType: "FULL_RESULT" });
      mockedUseRaceItemsContentQuery.mockClear();

      rerender({ resultType: "FULL_RESULT" });

      expect(mockedUseRaceItemsContentQuery).toHaveBeenCalledTimes(1);
      expectLastItemsQueryCall(RACE_URN, false);
    });

    it("keeps the query active across quick-result to full-result transitions", () => {
      const { rerender } = renderHook(
        ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, initialItems, resultType),
        {
          initialProps: {
            resultType: undefined as string | null | undefined,
          },
        },
      );

      rerender({ resultType: "QUICK_RESULT" });
      rerender({ resultType: "FULL_RESULT" });

      expectLastItemsQueryCall(RACE_URN, false);
    });
  });

  describe("refetch effect", () => {
    it("refetches on quick result when the query is active", () => {
      const refetch = jest.fn();
      setQueryReturn({ refetch });

      const { rerender } = renderHook(
        ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, undefined, resultType),
        {
          initialProps: {
            resultType: undefined as string | null | undefined,
          },
        },
      );

      rerender({ resultType: "QUICK_RESULT" });

      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("does not refetch on quick result while the query is skipped", () => {
      const refetch = jest.fn();
      setQueryReturn({ refetch });

      renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN, initialItems, "QUICK_RESULT"));

      expect(refetch).not.toHaveBeenCalled();
    });

    it("does not refetch again when full result follows quick result for the same race", () => {
      const refetch = jest.fn();
      setQueryReturn({ refetch });

      const { rerender } = renderHook(
        ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, undefined, resultType),
        {
          initialProps: {
            resultType: undefined as string | null | undefined,
          },
        },
      );

      rerender({ resultType: "QUICK_RESULT" });
      rerender({ resultType: "FULL_RESULT" });
      rerender({ resultType: "FULL_RESULT" });

      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("does not refetch when resultType is missing or unrelated", () => {
      const refetch = jest.fn();
      setQueryReturn({ refetch });

      const { rerender } = renderHook(
        ({ resultType }) => useRaceItemsContentVM(VIEW_URN, RACE_URN, undefined, resultType),
        {
          initialProps: {
            resultType: undefined as string | null | undefined,
          },
        },
      );

      rerender({ resultType: "PENDING" });
      rerender({ resultType: null });

      expect(refetch).not.toHaveBeenCalled();
    });
  });

  describe("initialItems lifecycle", () => {
    it("resets activation when new initialItems arrive", () => {
      const { rerender } = renderHook(
        ({ currentInitialItems }) =>
          useRaceItemsContentVM(VIEW_URN, RACE_URN, currentInitialItems, undefined as string | null | undefined),
        {
          initialProps: {
            currentInitialItems: undefined as InitialItemsData | undefined,
          },
        },
      );

      rerender({ currentInitialItems: initialItems });

      expectLastItemsQueryCall(RACE_URN, true);
    });

    it("does not reset activation when initialItems are removed", () => {
      const initialProps: {
        currentInitialItems: InitialItemsData | undefined;
        resultType: string | null | undefined;
      } = {
        currentInitialItems: initialItems,
        resultType: undefined,
      };

      const { rerender } = renderHook(
        ({
          currentInitialItems,
          resultType,
        }: {
          currentInitialItems: InitialItemsData | undefined;
          resultType: string | null | undefined;
        }) =>
          useRaceItemsContentVM(VIEW_URN, RACE_URN, currentInitialItems, resultType),
        {
          initialProps,
        },
      );

      rerender({ currentInitialItems: initialItems, resultType: "QUICK_RESULT" });
      rerender({ currentInitialItems: undefined, resultType: "QUICK_RESULT" });

      expectLastItemsQueryCall(RACE_URN, false);
    });
  });

  describe("loading, transitioning, and effectiveCardEdges", () => {
    it("reports loading on first paint without previous data", () => {
      setQueryReturn({
        loading: true,
        data: {
          items: buildItems(),
          previousItems: buildItems(),
        },
      });

      const { result } = renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN));

      expect(result.current.loading).toBe(true);
      expect(result.current.transitioning).toBe(false);
      expect(result.current.vm.data.cardEdges).toEqual([]);
    });

    it("returns current data when the query has resolved", () => {
      const currentItems = buildItems([
        buildEdge({ __typename: "NavigationTabsList", urn: "ppb:card:navigation" }),
        buildEdge({ __typename: "RegulatoryCard", urn: "ppb:card:regulatory" }),
      ]);
      setQueryReturn({
        loading: false,
        data: {
          items: currentItems,
          previousItems: buildItems(),
        },
      });

      const { result } = renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN));

      expect(result.current.loading).toBe(false);
      expect(result.current.transitioning).toBe(false);
      expect(result.current.vm.data.cardEdges).toEqual([
        {
          key: "NavigationTabsList-ppb:card:navigation",
          typename: "NavigationTabsList",
          urn: "ppb:card:navigation",
        },
        {
          key: "RegulatoryCard-ppb:card:regulatory",
          typename: "RegulatoryCard",
          urn: "ppb:card:regulatory",
        },
      ]);
    });

    it("uses previous data while a refetch is loading", () => {
      const previousItems = buildItems([
        buildEdge({ __typename: "NavigationTabsList", urn: "ppb:card:navigation" }),
        buildEdge({ __typename: "RegulatoryCard", urn: "ppb:card:regulatory" }),
        buildEdge({ __typename: "RaceResultsCard", urn: "ppb:card:results" }),
      ]);
      setQueryReturn({
        loading: true,
        data: {
          items: buildItems(),
          previousItems,
        },
      });

      const { result } = renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN));

      expect(result.current.loading).toBe(false);
      expect(result.current.transitioning).toBe(true);
      expect(result.current.vm.data.cardEdges.length).toBe(3);
      expect(result.current.vm.data.cardEdges[2]).toEqual({
        key: "RaceResultsCard-ppb:card:results",
        typename: "RaceResultsCard",
        urn: "ppb:card:results",
      });
    });

    it("returns new data after a refetch completes", () => {
      const currentItems = buildItems([
        buildEdge({ __typename: "NavigationTabsList", urn: "ppb:card:navigation" }),
        buildEdge({ __typename: "RaceResultsCard", urn: "ppb:card:results" }),
      ]);
      const previousItems = buildItems([
        buildEdge({ __typename: "NavigationTabsList", urn: "ppb:card:old-navigation" }),
        buildEdge({ __typename: "RegulatoryCard", urn: "ppb:card:old-regulatory" }),
        buildEdge({ __typename: "RaceResultsCard", urn: "ppb:card:old-results" }),
      ]);
      setQueryReturn({
        loading: false,
        data: {
          items: currentItems,
          previousItems,
        },
      });

      const { result } = renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN));

      expect(result.current.loading).toBe(false);
      expect(result.current.transitioning).toBe(false);
      expect(result.current.vm.data.cardEdges).toEqual([
        {
          key: "NavigationTabsList-ppb:card:navigation",
          typename: "NavigationTabsList",
          urn: "ppb:card:navigation",
        },
        {
          key: "RaceResultsCard-ppb:card:results",
          typename: "RaceResultsCard",
          urn: "ppb:card:results",
        },
      ]);
    });
  });

  describe("items fallback", () => {
    it("falls back to initialItems when fetched items are undefined", () => {
      const fallbackItems = buildItems([buildEdge({ __typename: "NavigationTabsList", urn: "ppb:card:navigation" })]);

      const { result } = renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN, fallbackItems));

      expect(result.current.vm.data.cardEdges).toEqual([
        {
          key: "NavigationTabsList-ppb:card:navigation",
          typename: "NavigationTabsList",
          urn: "ppb:card:navigation",
        },
      ]);
    });

    it("prefers fetched items over initialItems", () => {
      setQueryReturn({
        data: {
          items: buildItems([buildEdge({ __typename: "RegulatoryCard", urn: "ppb:card:regulatory" })]),
          previousItems: undefined,
        },
      });

      const { result } = renderHook(() =>
        useRaceItemsContentVM(
          VIEW_URN,
          RACE_URN,
          buildItems([buildEdge({ __typename: "NavigationTabsList", urn: "ppb:card:navigation" })]),
        ),
      );

      expect(result.current.vm.data.cardEdges).toEqual([
        {
          key: "RegulatoryCard-ppb:card:regulatory",
          typename: "RegulatoryCard",
          urn: "ppb:card:regulatory",
        },
      ]);
    });

    it("returns an empty list when both fetched and initial items are undefined", () => {
      const { result } = renderHook(() => useRaceItemsContentVM(VIEW_URN, RACE_URN));

      expect(result.current.vm.data.cardEdges).toEqual([]);
    });
  });
});