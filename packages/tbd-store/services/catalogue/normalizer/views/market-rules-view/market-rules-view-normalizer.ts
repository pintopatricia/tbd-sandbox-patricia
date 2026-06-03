/* eslint-disable no-underscore-dangle */
import { MarketRulesViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { MarketRulesView } from "../../../../../state/layout/views/View.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketRulesViewFragmentIntoMarketRulesView = (
  marketRulesView: MarketRulesViewFragment,
): TransformedFragment<MarketRulesView> => {
  const { title, items, __typename, xsellBar, ...marketRulesData } = marketRulesView;

  return {
    data: {
      typename: __typename,
      title: title || undefined,
      ...marketRulesData,
      xsellBar,
      items: items.edges.reduce((acc: PartialItem[], item) => {
        if (item?.node && "urn" in item.node) {
          return [
            ...acc,
            {
              urn: item.node.urn,
              typename: item.node.__typename,
            },
          ];
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeMarketRulesViewFragmentIntoMarketRulesView;
