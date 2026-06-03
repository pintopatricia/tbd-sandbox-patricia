import { useApolloClient, useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import { useRaceMeetingViewQuery } from "./RaceMeetingView.graphql";
import { cacheWarmup } from "./cache-warmup";

jest.mock("@apollo/client/react", () => ({
  ...jest.requireActual("@apollo/client/react"),
  useApolloClient: jest.fn(),
  useLazyQuery: jest.fn(),
}));

jest.mock("./cache-warmup", () => ({
  cacheWarmup: jest.fn(),
}));

const mockedUseLazyQuery = jest.mocked(useLazyQuery);
const mockedUseApolloClient = jest.mocked(useApolloClient);
const mockedCacheWarmup = jest.mocked(cacheWarmup);

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";
const OTHER_VIEW_URN = "ppb:tbd:view:raceMeeting:7|99999.1500";
const RACE_VIEW_URN = "ppb:tbd:view:race:7|12345.1500";

function buildRaceMeetingView(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    __typename: "RaceMeetingView" as const,
    urn: VIEW_URN,
    races: [],
    items: {
      __typename: "RaceContentConnection",
      selectedRace: {
        __typename: "RaceNavigationItem",
        race: { urn: "ppb:race:12345.1500" },
        viewLink: { viewUrn: VIEW_URN, viewUrl: "horse-racing/example" },
        promotion: null,
      },
      edges: [],
      pageInfo: null,
    },
    ...overrides,
  };
}

describe("RaceMeetingView.graphql", () => {
  const fetchView = jest.fn();
  const refetch = jest.fn();
  const cache = {};

  function setLazyQueryReturn(state: {
    called?: boolean;
    loading?: boolean;
    data?: unknown;
    previousData?: unknown;
  }) {
    mockedUseLazyQuery.mockReturnValue([
      fetchView,
      {
        called: state.called ?? false,
        loading: state.loading ?? false,
        data: state.data,
        previousData: state.previousData,
        refetch,
      },
    ] as unknown as ReturnType<typeof useLazyQuery>);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseApolloClient.mockReturnValue({ cache } as ReturnType<typeof useApolloClient>);
    setLazyQueryReturn({});
  });

  describe("useRaceMeetingViewQuery", () => {
    it("fires fetchView when variables.viewURN changes", () => {
      const { rerender } = renderHook(({ urn }) => useRaceMeetingViewQuery({ viewURN: urn }), {
        initialProps: { urn: VIEW_URN },
      });

      expect(fetchView).toHaveBeenCalledTimes(1);
      expect(fetchView).toHaveBeenCalledWith({ variables: { viewURN: VIEW_URN } });

      rerender({ urn: VIEW_URN });
      expect(fetchView).toHaveBeenCalledTimes(1);

      rerender({ urn: OTHER_VIEW_URN });
      expect(fetchView).toHaveBeenCalledTimes(2);
      expect(fetchView).toHaveBeenLastCalledWith({ variables: { viewURN: OTHER_VIEW_URN } });
    });

    it("sets canRenderHeader to true when returned view URN matches variables.viewURN", () => {
      setLazyQueryReturn({
        called: true,
        loading: false,
        data: { View: buildRaceMeetingView() },
      });

      const { result } = renderHook(() => useRaceMeetingViewQuery({ viewURN: VIEW_URN }));

      expect(result.current.canRenderHeader).toBe(true);
    });

    it("sets canRenderHeader to true when one of the child races' viewLink.viewUrn matches", () => {
      const view = buildRaceMeetingView({
        urn: OTHER_VIEW_URN,
        races: [
          { viewLink: { viewUrn: "ppb:tbd:view:race:7|other" } },
          { viewLink: { viewUrn: RACE_VIEW_URN } },
        ],
      });
      setLazyQueryReturn({ called: true, loading: false, data: { View: view } });

      const { result } = renderHook(() => useRaceMeetingViewQuery({ viewURN: RACE_VIEW_URN }));

      expect(result.current.canRenderHeader).toBe(true);
    });

    it("sets canRenderHeader to false when no URN matches", () => {
      setLazyQueryReturn({
        called: true,
        loading: false,
        data: { View: buildRaceMeetingView({ urn: OTHER_VIEW_URN }) },
      });

      const { result } = renderHook(() => useRaceMeetingViewQuery({ viewURN: VIEW_URN }));

      expect(result.current.canRenderHeader).toBe(false);
    });

    it("calls cacheWarmup exactly once per resolved URN across re-renders", () => {
      setLazyQueryReturn({
        called: true,
        loading: false,
        data: { View: buildRaceMeetingView() },
      });

      const { rerender } = renderHook(({ urn }) => useRaceMeetingViewQuery({ viewURN: urn }), {
        initialProps: { urn: VIEW_URN },
      });

      rerender({ urn: VIEW_URN });
      rerender({ urn: VIEW_URN });

      expect(mockedCacheWarmup).toHaveBeenCalledTimes(1);
      expect(mockedCacheWarmup).toHaveBeenCalledWith(cache, expect.objectContaining({ urn: VIEW_URN }));
    });

    it("calls cacheWarmup again when the resolved view URN changes", () => {
      setLazyQueryReturn({
        called: true,
        loading: false,
        data: { View: buildRaceMeetingView() },
      });

      const { rerender } = renderHook(({ urn }) => useRaceMeetingViewQuery({ viewURN: urn }), {
        initialProps: { urn: VIEW_URN },
      });

      expect(mockedCacheWarmup).toHaveBeenCalledTimes(1);

      setLazyQueryReturn({
        called: true,
        loading: false,
        data: { View: buildRaceMeetingView({ urn: OTHER_VIEW_URN }) },
      });
      rerender({ urn: OTHER_VIEW_URN });

      expect(mockedCacheWarmup).toHaveBeenCalledTimes(2);
      expect(mockedCacheWarmup).toHaveBeenLastCalledWith(cache, expect.objectContaining({ urn: OTHER_VIEW_URN }));
    });

    it("treats a SportView response as no RaceMeetingView (narrowing handoff to view-redirect-link)", () => {
      setLazyQueryReturn({
        called: true,
        loading: false,
        data: { View: { __typename: "SportView", urn: VIEW_URN } },
      });

      const { result } = renderHook(() => useRaceMeetingViewQuery({ viewURN: VIEW_URN }));

      expect(result.current.data.view).toBeUndefined();
      expect(result.current.canRenderHeader).toBe(false);
      expect(mockedCacheWarmup).not.toHaveBeenCalled();
    });
  });
});
