import { PopularSwimlaneCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import type { PartialItem } from "../../../../../state/layout/Layout.types";
import { PopularSwimlaneCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup = (
  swimlaneCardGroup: PopularSwimlaneCardGroupFragment,
): TransformedFragment<PopularSwimlaneCardGroup> => {
  const {
    urn,
    popularSwimlaneCardGroupTitle: title,
    displayName,
    partialItems,
    fullItems,
    __typename,
  } = swimlaneCardGroup;

  const isExpectedPartialItem = (item: any): item is PartialItem =>
    (item && "urn" in item && "__typename" in item && item.__typename === "PopularBetBuilderCard") ||
    item.__typename === "PopularMultiplesBetBuilderCard";

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      displayName: displayName ?? undefined,
      items: partialItems.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && fullItems.edges[index] !== null && isExpectedPartialItem(item.node)) {
          acc.push({
            typename: item.node.__typename,
            urn: item.node.urn,
          });
        }
        return acc;
      }, []),
    },
  };
};

export default normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup;
