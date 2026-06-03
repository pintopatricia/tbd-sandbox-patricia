/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { NotFoundViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { NotFoundView } from "../../../../../state/layout/views/View.types";

const normalizeNotFoundViewFragmentIntoNotFoundView = (
  notFoundView: NotFoundViewFragment,
): TransformedFragment<NotFoundView> => {
  const { urn, url, items, __typename, xsellBar } = notFoundView;

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

export default normalizeNotFoundViewFragmentIntoNotFoundView;
