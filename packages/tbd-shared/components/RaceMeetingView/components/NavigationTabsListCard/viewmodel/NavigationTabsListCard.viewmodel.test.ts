import { renderHook } from "@testing-library/react";
import { getEventRegistry } from "eventemitter3-singleton";
import { useNavigationTabsListCardQuery } from "../model/NavigationTabsListCard.graphql";
import { useNavigationTabsListCardVM } from "./NavigationTabsListCard.viewmodel";

jest.mock("../model/NavigationTabsListCard.graphql", () => ({
  useNavigationTabsListCardQuery: jest.fn(),
}));

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();
  return {
    getEventRegistry: jest.fn(() => ({ emit })),
  };
});

const mockedQuery = jest.mocked(useNavigationTabsListCardQuery);
const emit = getEventRegistry().emit as jest.Mock;

const URN = "ppb:tbd:card:navigationTabsList:race-meeting-tabs";
const NEXT_URN = "ppb:tbd:card:navigationTabsList:race-meeting-tabs:other";
const TAB_1_URN = "ppb:tab:1";
const TAB_2_URN = "ppb:tab:2";
const VIEW_LINK = { viewUrn: "ppb:tbd:view:raceMeeting:7|12345.1500", viewUrl: "horse-racing/example" };

const buildTabNode = (overrides: Record<string, unknown> = {}) => ({
  urn: TAB_1_URN,
  title: { translated: "Form" },
  viewLink: VIEW_LINK,
  items: { edges: [{ node: { __typename: "RegulatoryCard", urn: "ppb:card:regulatory" } }] },
  ...overrides,
});

const buildList = (overrides: Record<string, unknown> = {}) => ({
  __typename: "NavigationTabsList",
  urn: URN,
  title: "Tabs",
  items: {
    edges: [{ node: buildTabNode() }],
  },
  ...overrides,
});

const setQueryReturn = (overrides: Partial<ReturnType<typeof useNavigationTabsListCardQuery>> = {}) => {
  mockedQuery.mockReturnValue({
    loading: false,
    data: { navigationTabsList: undefined },
    ...overrides,
  } as ReturnType<typeof useNavigationTabsListCardQuery>);
};

describe("NavigationTabsListCard.viewmodel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setQueryReturn();
  });

  it("returns empty data while loading and no previous data exists", () => {
    setQueryReturn({ loading: true, data: { navigationTabsList: undefined } });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));

    expect(result.current.loading).toBe(true);
    expect(result.current.transitioning).toBe(false);
    expect(result.current.vm.data).toEqual({
      title: "",
      tabs: [],
      headers: [],
      selectedTabUrn: "",
    });
  });

  it("maps tabs and headers from a complete navigationTabsList payload", () => {
    setQueryReturn({
      data: {
        navigationTabsList: buildList({
          items: {
            edges: [
              {
                node: buildTabNode({
                  urn: TAB_1_URN,
                  title: { translated: "Form" },
                  items: {
                    edges: [{ node: { __typename: "RegulatoryCard", urn: "ppb:card:regulatory" } }],
                  },
                }),
              },
              {
                node: buildTabNode({
                  urn: TAB_2_URN,
                  title: { translated: "Stats" },
                  viewLink: null,
                  items: { edges: [] },
                }),
              },
            ],
          },
        }),
      },
    });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));

    expect(result.current.vm.data.title).toBe("Tabs");
    expect(result.current.vm.data.headers).toEqual([
      { id: TAB_1_URN, title: "Form" },
      { id: TAB_2_URN, title: "Stats" },
    ]);
    expect(result.current.vm.data.tabs).toEqual([
      {
        id: TAB_1_URN,
        title: "Form",
        viewLink: VIEW_LINK,
        items: [{ urn: "ppb:card:regulatory", typename: "RegulatoryCard" }],
      },
      {
        id: TAB_2_URN,
        title: "Stats",
        viewLink: null,
        items: [],
      },
    ]);
    expect(result.current.vm.data.selectedTabUrn).toBe(TAB_1_URN);
  });

  it("falls back to empty title when navigationTabsList lacks one", () => {
    setQueryReturn({
      data: { navigationTabsList: buildList({ title: undefined, items: { edges: [] } }) as any },
    });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));

    expect(result.current.vm.data.title).toBe("");
  });

  it("filters out edges without a node", () => {
    setQueryReturn({
      data: {
        navigationTabsList: buildList({
          items: {
            edges: [null, { node: null }, { node: buildTabNode({ urn: TAB_1_URN, title: { translated: "Form" } }) }],
          },
        }),
      },
    });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));

    expect(result.current.vm.data.tabs).toHaveLength(1);
    expect(result.current.vm.data.tabs[0]?.id).toBe(TAB_1_URN);
  });

  it("filters out tab items missing a urn or typename", () => {
    setQueryReturn({
      data: {
        navigationTabsList: buildList({
          items: {
            edges: [
              {
                node: buildTabNode({
                  items: {
                    edges: [
                      { node: { __typename: "RegulatoryCard" } },
                      { node: { urn: "ppb:card:no-typename" } },
                      { node: { __typename: "RegulatoryCard", urn: "ppb:card:keep" } },
                    ],
                  },
                }),
              },
            ],
          },
        }),
      },
    });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));

    expect(result.current.vm.data.tabs[0]?.items).toEqual([{ urn: "ppb:card:keep", typename: "RegulatoryCard" }]);
  });

  it("emits NAVIGATION_TABS_LIST_CARD_TAB_CLICKED with the urn and label", () => {
    setQueryReturn({ data: { navigationTabsList: buildList() } });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));
    result.current.vm.events.onTabClick("Form");

    expect(emit).toHaveBeenCalledWith("@@UI/NAVIGATION_TABS_LIST_CARD_TAB_CLICKED", {
      label: "Form",
      urn: URN,
    });
  });

  it("emits NAVIGATION_TABS_LIST_CARD_TAB_SWITCHED with the viewLink payload", () => {
    setQueryReturn({ data: { navigationTabsList: buildList() } });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));
    result.current.vm.events.onTabSwitch(URN, TAB_1_URN, VIEW_LINK);

    expect(emit).toHaveBeenCalledWith("@@UI/NAVIGATION_TABS_LIST_CARD_TAB_SWITCHED", {
      tabsListUrn: URN,
      selectedTabUrn: TAB_1_URN,
      viewLink: VIEW_LINK,
    });
  });

  it("retains stale data and reports transitioning when urn changes while loading", () => {
    setQueryReturn({ data: { navigationTabsList: buildList() } });

    const { result, rerender } = renderHook((urn: string) => useNavigationTabsListCardVM(urn), {
      initialProps: URN,
    });

    expect(result.current.loading).toBe(false);

    setQueryReturn({ loading: true, data: { navigationTabsList: undefined } });
    rerender(NEXT_URN);

    expect(result.current.loading).toBe(false);
    expect(result.current.transitioning).toBe(true);
    expect(result.current.vm.data.headers).toHaveLength(1);
    expect(result.current.vm.data.tabs[0]?.id).toBe(TAB_1_URN);
  });

  it("reports loading=true and not transitioning on first load with no previous data", () => {
    setQueryReturn({ loading: true, data: { navigationTabsList: undefined } });

    const { result } = renderHook(() => useNavigationTabsListCardVM(URN));

    expect(result.current.loading).toBe(true);
    expect(result.current.transitioning).toBe(false);
  });
});
