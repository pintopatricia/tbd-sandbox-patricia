/* eslint-disable no-underscore-dangle */
import { MarketBetExpandableCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketBetExpandableCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketBetExpandableCardGroupFragmentIntoMarketBetExpandableCardGroup = (
  marketBetExpandableCardGroupFragment: MarketBetExpandableCardGroupFragment,
): TransformedFragment<MarketBetExpandableCardGroup> => {
  const { urn, partials, full, __typename, isOpen, marketBetCardGroupURN } = marketBetExpandableCardGroupFragment;

  return {
    data: {
      urn,
      typename: __typename,
      isOpen,
      marketBetCardGroupURN,
      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && "urn" in item.node && full.edges[index] !== null) {
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

export default normalizeMarketBetExpandableCardGroupFragmentIntoMarketBetExpandableCardGroup;
