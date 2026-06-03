import { ObbCardsStackedLayoutFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ObbCardsStackedLayout } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";

const normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout = (
  obbCardsStackedLayout: ObbCardsStackedLayoutFragment,
  index?: number,
): ObbCardsStackedLayout => {
  const { __typename, urn, title, maxCardsToDisplay, cards, badge } = obbCardsStackedLayout;
  const titleName = title && "name" in title ? title.name : null;

  return {
    urn,
    typename: __typename,
    title: titleName ?? undefined,
    badge: badge?.name,
    maxCardsToDisplay: maxCardsToDisplay ?? undefined,
    isSelected: index === 0,
    items: cards.edges.reduce((acc: PartialItem[], item) => {
      if (item && item !== null && "urn" in item.node) {
        return [
          ...acc,
          {
            urn: item.node.urn,
            // eslint-disable-next-line no-underscore-dangle
            typename: item.node.__typename,
            filterTags: item.node.filterTags?.map((filterTag) => ({
              type: filterTag.type,
              label: filterTag.label ? normalizeDisplayNameFragmentIntoDisplayName(filterTag.label) : undefined,
            })),
          },
        ];
      }

      return acc;
    }, []),
  };
};

export default normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout;
