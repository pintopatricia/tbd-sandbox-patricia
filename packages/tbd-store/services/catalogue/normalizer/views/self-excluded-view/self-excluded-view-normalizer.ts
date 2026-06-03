/* eslint-disable no-underscore-dangle */

import { SelfExcludedViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { SelfExcludedView } from "../../../../../state/layout/views/View.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSelfExcludedViewFragmentIntoSelfExcludedView = (
  selfExcludedView: SelfExcludedViewFragment,
): TransformedFragment<SelfExcludedView> => {
  const { urn, items, url, __typename, xsellBar } = selfExcludedView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
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

export default normalizeSelfExcludedViewFragmentIntoSelfExcludedView;
