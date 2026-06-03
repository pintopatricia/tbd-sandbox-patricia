import type {
  NavigationTabFragment,
  NavigationTabPartialFragment,
} from "../../../../clients/catalogue/catalogue-response-types";
import type { PartialItem } from "../../../../state";
import type {
  NavigationTab,
  NavigationTabPartial,
} from "../../../../state/layout/navigation-tabs-list/NavigationTabsList.types";
import type { TransformedFragment } from "../Normalizer.types";
import normalizeTranslatableTextFragmentIntoTranslatableText from "../translatable-text/translatable-text-normalizer";

export const normalizeNavigationTabPartialFragmentIntoNavigationTabPartial = ({
  __typename,
  urn,
  tabTitle,
  badgeText,
  tabViewLink,
}: NavigationTabPartialFragment): TransformedFragment<NavigationTabPartial> => ({
  data: {
    typename: __typename,
    urn,
    title: normalizeTranslatableTextFragmentIntoTranslatableText(tabTitle).data,
    badgeText: badgeText ? normalizeTranslatableTextFragmentIntoTranslatableText(badgeText).data : undefined,
    viewLink: tabViewLink || undefined,
  },
});

const normalizeNavigationTabFragmentIntoNavigationTab = (
  tab: NavigationTabFragment,
): TransformedFragment<NavigationTab> => {
  const { partials, full } = tab;

  return {
    data: {
      ...normalizeNavigationTabPartialFragmentIntoNavigationTabPartial(tab).data,
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

export default normalizeNavigationTabFragmentIntoNavigationTab;
