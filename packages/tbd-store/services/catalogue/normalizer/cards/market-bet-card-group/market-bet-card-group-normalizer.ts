/* eslint-disable no-underscore-dangle */
import { MarketBetCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketBetCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketBetCardGroupFragmentIntoMarketBetCardGroup = (
  marketBetCardGroupFragment: MarketBetCardGroupFragment,
): TransformedFragment<MarketBetCardGroup> => {
  const { urn, partials, full, __typename } = marketBetCardGroupFragment;

  return {
    data: {
      urn,
      typename: __typename,
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

export default normalizeMarketBetCardGroupFragmentIntoMarketBetCardGroup;
