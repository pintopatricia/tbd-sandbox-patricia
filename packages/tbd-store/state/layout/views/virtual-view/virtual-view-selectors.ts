import { codecs } from "@ppb/tbd-urn-codecs";
import { createSelector } from "reselect";
import { NavigationTabsLists } from "../../navigation-tabs-list/NavigationTabsList.types";
import { ApplicationState } from "../../../ApplicationState.types";
import { createNavigationTabsListByURNSelector } from "../../navigation-tabs-list/navigation-tabs-list-selectors";
import { createNavigationTabByURNSelector } from "../../navigation-tabs/navigation-tabs-selectors";
import { createFindViewByURNSelector } from "../view-selectors";
import { Views } from "../View.types";

const findViewByURN = createFindViewByURNSelector();
const findNavigationTabListByURN = createNavigationTabsListByURNSelector();

const isVirtualsView = (viewUrn: string): boolean => {
  if (!viewUrn) {
    return false;
  }

  const urn = codecs.parse(viewUrn);
  return urn !== null && codecs.genericView.virtuals.isValid(urn);
};

const findSelectedVirtualsTabUrn = (
  views: Views,
  navigationtabslists: NavigationTabsLists,
  viewUrn: string,
): string | undefined => {
  const view = findViewByURN(views, viewUrn);
  const navigationTabsListUrn = view?.items.find((item) => item.typename === "NavigationTabsList")?.urn;

  if (!navigationTabsListUrn) {
    return undefined;
  }

  return findNavigationTabListByURN(navigationtabslists, navigationTabsListUrn)?.selectedTabUrn;
};

export const createSelectedVirtualNavigationTabSelector = () =>
  createSelector(
    [
      (state: ApplicationState) => state.layouts,
      (state: ApplicationState) => state.router.currentUrn,
      createNavigationTabByURNSelector,
    ],
    (layouts, currentViewUrn, findNavigationTabByURN) => {
      if (!currentViewUrn || !isVirtualsView(currentViewUrn)) {
        return undefined;
      }

      const urn = findSelectedVirtualsTabUrn(layouts.views, layouts.navigationtabslists, currentViewUrn);
      if (!urn) {
        return undefined;
      }

      return findNavigationTabByURN(layouts.navigationtabs, urn);
    },
  );
