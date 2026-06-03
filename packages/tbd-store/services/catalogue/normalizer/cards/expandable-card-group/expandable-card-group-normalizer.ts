import { ExpandableCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ExpandableCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

// const relations = (expandableCardGroup: ExpandableCardGroupFragment): (() => TransformedFragment<Card>)[] => {
//   const { full, partials } = expandableCardGroup;
//   const items = [...full.edges, ...partials.edges];

//   return items.map(edge => {
//     return () => {
//       return normalizeCardFragmentIntoCard(edge?.node as Card);
//     };
//   });
// };

const normalizeExpandableCardGroupFragmentIntoExpandableCardGroup = (
  cardGroup: ExpandableCardGroupFragment,
): TransformedFragment<ExpandableCardGroup> => {
  const { urn, expandableCardGroupTitle: title, isExpandable, isExpanded, partials, full, __typename } = cardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      isExpandable: isExpandable ?? undefined,
      isExpanded: isExpanded ?? undefined,
      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null) {
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

export default normalizeExpandableCardGroupFragmentIntoExpandableCardGroup;
