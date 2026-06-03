import { createSelector, OutputParametricSelector } from "reselect";
import URN from "../URN";
import { NavigationTabsLists, NavigationTabList } from "./NavigationTabsList.types";

export const createNavigationTabsListByURNSelector = (): OutputParametricSelector<
  NavigationTabsLists,
  string,
  NavigationTabList | undefined,
  (res1: NavigationTabsLists, res2: URN) => NavigationTabList | undefined
> =>
  createSelector(
    [
      (navigationtabslists: NavigationTabsLists): NavigationTabsLists => navigationtabslists,
      (_: NavigationTabsLists, urn: URN): URN => urn,
    ],
    (navigationtabslists, urn): NavigationTabList | undefined => navigationtabslists[urn],
  );
