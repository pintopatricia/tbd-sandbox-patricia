import { createSelector, OutputParametricSelector } from "reselect";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { RouterState } from "../../router/RouterState.types";
import { Views } from "../views/View.types";
import { ApplicationState } from "../../ApplicationState.types";
import { getViewbyURN } from "../views/event-view/event-view-selectors";
import { ViewZone, ViewZones } from "../cards/ViewZone.types";
import URN from "../URN";
import { BrowseTab } from "../views/browse-view/browse-view-reducer";

export const createViewZoneByURNSelector = (): OutputParametricSelector<
  ViewZones,
  string,
  ViewZone | undefined,
  (viewZones: ViewZones, urn: URN) => ViewZone | undefined
> =>
  createSelector(
    [(viewZones: ViewZones): ViewZones => viewZones, (_: ViewZones, urn: URN): URN => urn],
    (viewZones, urn): ViewZone | undefined => viewZones[urn],
  );

export const getViewZones = (state: ApplicationState): ViewZones => state.layouts.viewzones;

/**
 * getViewZoneByItemUrn
 * For a given item URN, returns the corresponding viewZone that has that item
 */
export const getViewZoneByItemUrn = createSelector(
  [
    (state: ApplicationState) => state.router,
    getViewZones,
    (state: ApplicationState) => state.layouts.views,
    (_: ApplicationState, itemUrn: URN) => itemUrn,
  ],
  (router: RouterState, viewZones: ViewZones, views: Views, itemUrn: URN) => {
    const getViewZonebyURN = createViewZoneByURNSelector();
    let viewZoneResulted: ViewZone | undefined;
    const { currentView } = router;
    const currentViewUrn =
      currentView === EntityType.BrowseView ? codecs.browseView.encode(BrowseTab.Gaming).uid : router.currentUrn;

    const view = currentViewUrn ? getViewbyURN(views, currentViewUrn) : null;
    if (view) {
      const itemsInPage = view.items.map((item) => item.urn);
      const multifunctionalAndJackpotUrns = itemsInPage?.filter((item: URN) =>
        /masterConfigElement:(?:masterConfigElement)*(?:multifunctional_module|jackpot_merchandising)/.test(item),
      );
      if (multifunctionalAndJackpotUrns?.length) {
        multifunctionalAndJackpotUrns.forEach((urn) => {
          const viewZone = getViewZonebyURN(viewZones, urn);
          viewZoneResulted = viewZone?.items?.find((partialItem) => partialItem.urn === itemUrn)
            ? viewZone
            : viewZoneResulted;
        });
      }
    }
    return {
      viewZone: viewZoneResulted,
    };
  },
);
