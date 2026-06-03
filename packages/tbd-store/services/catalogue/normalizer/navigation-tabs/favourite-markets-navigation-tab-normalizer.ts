import type {
  FavouriteMarketsNavigationTabFragment,
  FavouriteMarketsNavigationTabLiteFragment,
  FavouriteMarketsNavigationTabPartialFragment,
} from "../../../../clients/catalogue/catalogue-response-types";
import type { PartialItem } from "../../../../state";
import type {
  FavouriteMarketsNavigationTab,
  FavouriteMarketsNavigationTabPartial,
} from "../../../../state/layout/navigation-tabs-list/NavigationTabsList.types";
import type { TransformedFragment } from "../Normalizer.types";
import normalizeTranslatableTextFragmentIntoTranslatableText from "../translatable-text/translatable-text-normalizer";

export const normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial = ({
  __typename,
  urn,
  badgeText,
  tabViewLink,
  metadata,
}: FavouriteMarketsNavigationTabPartialFragment): TransformedFragment<FavouriteMarketsNavigationTabPartial> => ({
  data: {
    typename: __typename,
    urn,
    title: {},
    badgeText: badgeText ? normalizeTranslatableTextFragmentIntoTranslatableText(badgeText).data : undefined,
    viewLink: tabViewLink || undefined,
    metadataTotalURN: metadata?.total.urn,
  },
});

export const normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite = (
  tab: FavouriteMarketsNavigationTabLiteFragment,
): TransformedFragment<FavouriteMarketsNavigationTab> => {
  const { partials } = tab;

  return {
    data: {
      ...normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial(tab).data,
      items: partials.edges.reduce((acc: PartialItem[], item) => {
        if (item && "urn" in item.node) {
          return [
            ...acc,
            {
              // eslint-disable-next-line no-underscore-dangle
              typename: item.node.__typename,
              urn: item.node.urn,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

const normalizeFavouriteMarketsNavigationTabFragmentIntoFavouriteMarketsNavigationTab = (
  tab: FavouriteMarketsNavigationTabFragment,
): TransformedFragment<FavouriteMarketsNavigationTab> => {
  const { partials, full } = tab;

  return {
    data: {
      ...normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial(tab).data,
      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null && "urn" in item.node) {
          return [
            ...acc,
            {
              // eslint-disable-next-line no-underscore-dangle
              typename: item.node.__typename,
              urn: item.node.urn,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeFavouriteMarketsNavigationTabFragmentIntoFavouriteMarketsNavigationTab;
