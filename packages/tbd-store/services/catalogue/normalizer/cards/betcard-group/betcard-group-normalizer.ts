/* eslint-disable no-underscore-dangle */
import { BetCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { BetCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBetCardGroupFragmentIntoBetCardGroup = (
  betCardGroup: BetCardGroupFragment,
): TransformedFragment<BetCardGroup> => {
  const { urn, full, __typename, aggregatorId, aggregatorDesc } = betCardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      aggregatorId: aggregatorId || undefined,
      aggregatorDesc: aggregatorDesc || undefined,
      items: full.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null && "urn" in item.node) {
          return [
            ...acc,
            {
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

export default normalizeBetCardGroupFragmentIntoBetCardGroup;
