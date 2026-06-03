/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { MarketViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { MarketView } from "../../../../../state/layout/views/View.types";

const normalizeMarketViewFragmentIntoMarketView = (
  marketView: MarketViewFragment,
): TransformedFragment<MarketView> => ({
  data: {
    urn: marketView.urn,
    canonicalUrl: marketView.canonicalUrl,
    url: marketView.url,
    typename: marketView.__typename,
    xsellBar: marketView.xsellBar,
    mainMarket: marketView.mainMarket.urn,
    items: marketView.items.edges.reduce((acc: PartialItem[], item) => {
      if (item?.node && "urn" in item.node) {
        return [
          ...acc,
          {
            urn: item.node.urn,
            typename: item.node.__typename,
            theme: item.theme,
          },
        ];
      }

      return acc;
    }, []),
  },
});

export default normalizeMarketViewFragmentIntoMarketView;
