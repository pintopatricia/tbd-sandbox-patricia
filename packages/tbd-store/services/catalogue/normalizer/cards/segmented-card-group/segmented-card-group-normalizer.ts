// TODO: to add typename after engine is implemented
// type SegmentedCardGroupCardWithTypename = SegmentedCardGroupCard & { typename: "SegmentedCardGroupCard" };

import { SegmentedCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { SegmentedCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup = (
  segmentedCardGroup: SegmentedCardGroupFragment,
): TransformedFragment<SegmentedCardGroup> => {
  const { urn, full, partials, __typename } = segmentedCardGroup;

  return {
    data: {
      urn,
      typename: __typename,
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

export default normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup;
