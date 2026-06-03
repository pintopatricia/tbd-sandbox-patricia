import { useFragment, useQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  NavigationTabsListCardFragment,
  NavigationTabsListCardQuery,
  useNavigationTabsListCardQuery,
} from "./NavigationTabsListCard.graphql";

jest.mock("@apollo/client/react", () => ({
  ...jest.requireActual("@apollo/client/react"),
  useFragment: jest.fn(),
  useQuery: jest.fn(),
}));

const mockedUseFragment = jest.mocked(useFragment);
const mockedUseQuery = jest.mocked(useQuery);

const URN = "ppb:tbd:card:navigationTabsList:race-meeting-tabs";

const setFragmentReturn = (value: unknown) => {
  mockedUseFragment.mockReturnValue(value as ReturnType<typeof useFragment>);
};

const setQueryReturn = (value: unknown) => {
  mockedUseQuery.mockReturnValue(value as ReturnType<typeof useQuery>);
};

describe("NavigationTabsListCard.graphql", () => {
  afterEach(jest.clearAllMocks);

  beforeEach(() => {
    setFragmentReturn({ complete: false, data: {} });
    setQueryReturn({ loading: true, data: undefined });
  });

  it("reads the fragment from the cache by NavigationTabsList urn", () => {
    renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(useFragment).toHaveBeenCalledWith({
      fragment: NavigationTabsListCardFragment,
      from: { __typename: "NavigationTabsList", urn: URN },
    });
  });

  it("issues the network query when the fragment is incomplete", () => {
    renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(useQuery).toHaveBeenCalledWith(
      NavigationTabsListCardQuery,
      expect.objectContaining({
        variables: { urns: [URN] },
        skip: false,
      }),
    );
  });

  it("skips the network query when the fragment is complete", () => {
    setFragmentReturn({ complete: true, data: { urn: URN } });

    renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(useQuery).toHaveBeenCalledWith(NavigationTabsListCardQuery, expect.objectContaining({ skip: true }));
  });

  it("returns fragment data immediately when the fragment is complete", () => {
    const fragmentData = { urn: URN, title: "Tabs" };
    setFragmentReturn({ complete: true, data: fragmentData });

    const { result } = renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(result.current).toEqual({
      loading: false,
      data: { navigationTabsList: fragmentData },
    });
  });

  it("falls back to undefined when the fragment is complete but missing a urn key", () => {
    setFragmentReturn({ complete: true, data: {} });

    const { result } = renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(result.current.data.navigationTabsList).toBeUndefined();
  });

  it("returns the matching NavigationTabsList card from query data", () => {
    const card = { __typename: "NavigationTabsList", urn: URN, title: "Tabs" };
    setQueryReturn({
      loading: false,
      data: { Cards: [{ __typename: "RegulatoryCard", urn: "ppb:card:other" }, card] },
    });

    const { result } = renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(result.current.data.navigationTabsList).toEqual(card);
    expect(result.current.loading).toBe(false);
  });

  it("returns undefined navigationTabsList when no Cards entry matches the typename", () => {
    setQueryReturn({
      loading: false,
      data: { Cards: [{ __typename: "SomeOtherCard", urn: URN }] },
    });

    const { result } = renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(result.current.data.navigationTabsList).toBeUndefined();
  });

  it("returns undefined navigationTabsList while still loading", () => {
    setQueryReturn({ loading: true, data: undefined });

    const { result } = renderHook(() => useNavigationTabsListCardQuery(URN));

    expect(result.current).toEqual({
      loading: true,
      data: { navigationTabsList: undefined },
    });
  });
});
