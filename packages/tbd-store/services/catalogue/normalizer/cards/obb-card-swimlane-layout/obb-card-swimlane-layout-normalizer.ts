import { ObbCardsSwimlaneLayoutFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ObbCardsSwimlaneLayout } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";

const normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout = (
  obbCardsSwimlaneLayout: ObbCardsSwimlaneLayoutFragment,
  index?: number,
): ObbCardsSwimlaneLayout => {
  const { __typename, urn, title, cards, badge } = obbCardsSwimlaneLayout;
  const titleName = title && "name" in title ? title.name : null;

  return {
    urn,
    typename: __typename,
    title: titleName ?? undefined,
    badge: badge?.name,
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

export default normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout;
