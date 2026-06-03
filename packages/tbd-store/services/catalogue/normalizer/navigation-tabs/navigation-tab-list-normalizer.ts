/* eslint-disable no-underscore-dangle */
import type { NavigationTabsListFragment } from "../../../../clients/catalogue/catalogue-response-types";
import type {
  NavigationTabList,
  NavigationTabListItemPartial,
} from "../../../../state/layout/navigation-tabs-list/NavigationTabsList.types";
import type { TransformedFragment } from "../Normalizer.types";
import { normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial } from "./favourite-markets-navigation-tab-normalizer";
import { normalizeNavigationTabPartialFragmentIntoNavigationTabPartial } from "./navigation-tab-normalizer";

const normalizeNavigationTabFragmentIntoNavigationTab = (
  navigationTab: NavigationTabsListFragment,
): TransformedFragment<NavigationTabList> => {
  const { urn, tabsTitle, partials, full, __typename } = navigationTab;

  const getSelectedTabURN = () => {
    if (full.edges[0]?.node && "urn" in full.edges[0].node) {
      return full.edges[0].node.urn;
    }

    if (partials.edges[0]?.node && "urn" in partials.edges[0].node) {
      return partials.edges[0].node.urn;
    }

    return undefined;
  };

  return {
    data: {
      urn,
      typename: __typename,
      title: tabsTitle || "",
      selectedTabUrn: getSelectedTabURN(),
      items: partials.edges.reduce((acc: NavigationTabListItemPartial[], item, index) => {
        if (!item?.node || !("urn" in item.node) || full.edges[index] === null) {
          return acc;
        }
        const tab = item.node;

        if (tab.__typename === "NavigationTab") {
          return [...acc, normalizeNavigationTabPartialFragmentIntoNavigationTabPartial(tab).data];
        }

        if (tab.__typename === "FavouriteMarketsNavigationTab") {
          return [
            ...acc,
            normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial(tab).data,
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeNavigationTabFragmentIntoNavigationTab;
