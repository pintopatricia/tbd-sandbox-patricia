/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { AllMarketsViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { AllMarketsView } from "../../../../../state/layout/views/View.types";

const normalizeAllMarketsViewFragmentIntoAllMarketsView = (
  allMarketsView: AllMarketsViewFragment,
): TransformedFragment<AllMarketsView> => {
  const { urn, partialItems, url, title, __typename, xsellBar } = allMarketsView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      xsellBar,
      title: title || undefined,
      items: partialItems.edges.reduce((acc: PartialItem[], partialItem) => {
        if (partialItem?.node && "urn" in partialItem.node) {
          return [...acc, { urn: partialItem.node.urn, typename: partialItem.node.__typename }];
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeAllMarketsViewFragmentIntoAllMarketsView;
