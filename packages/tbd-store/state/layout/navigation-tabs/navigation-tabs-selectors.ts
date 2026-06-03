import { createSelector, OutputParametricSelector } from "reselect";
import { NavigationTabListItem, NavigationTabListItems } from "../navigation-tabs-list/NavigationTabsList.types";
import URN from "../URN";

export const createNavigationTabByURNSelector = (): OutputParametricSelector<
  NavigationTabListItems,
  URN,
  NavigationTabListItem | undefined,
  (res1: NavigationTabListItems, res2: URN) => NavigationTabListItem | undefined
> =>
  createSelector(
    [
      (navigationTabListItems: NavigationTabListItems): NavigationTabListItems => navigationTabListItems,
      (_: NavigationTabListItems, urn: URN): URN => urn,
    ],
    (navigationTabListItems, urn): NavigationTabListItem | undefined => navigationTabListItems[urn],
  );
