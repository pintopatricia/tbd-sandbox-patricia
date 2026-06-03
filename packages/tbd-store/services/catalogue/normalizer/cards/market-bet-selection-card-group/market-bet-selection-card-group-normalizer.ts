/* eslint-disable no-underscore-dangle */
import { MarketBetSelectionCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketBetSelectionCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketBetSelectionCardGroupFragmentIntoMarketBetSelectionCardGroup = (
  marketBetSelectionCardGroupFragment: MarketBetSelectionCardGroupFragment,
): TransformedFragment<MarketBetSelectionCardGroup> => {
  const { urn, partials, full, __typename, betCardGroupURN, marketBetCardURN, marketBetCardGroupURN } =
    marketBetSelectionCardGroupFragment;

  return {
    data: {
      urn,
      typename: __typename,
      betCardGroupURN,
      marketBetCardURN,
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

export default normalizeMarketBetSelectionCardGroupFragmentIntoMarketBetSelectionCardGroup;
