/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { MyAccountViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MyAccountView } from "../../../../../state/layout/views/View.types";

const normalizeMyAccountViewFragmentIntoMyAccountView = (
  fragment: MyAccountViewFragment,
): TransformedFragment<MyAccountView> => {
  const { urn, url, items, wizardUrl, __typename, xsellBar } = fragment;

  return {
    data: {
      typename: __typename,
      xsellBar,
      urn,
      url,
      wizardUrl,
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

export default normalizeMyAccountViewFragmentIntoMyAccountView;
