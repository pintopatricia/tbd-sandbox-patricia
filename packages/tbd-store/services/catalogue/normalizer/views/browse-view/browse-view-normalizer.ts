/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { BrowseViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { BrowseView } from "../../../../../state/layout/views/View.types";

const normalizeBrowseViewFragmentIntoBrowseView = (browseView: BrowseViewFragment): TransformedFragment<BrowseView> => {
  const { urn, items, url, __typename, xsellBar } = browseView;

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
              theme: item.theme,
            },
          ];
        }

        return acc;
      }, []),
      isOpen: false,
      search: {
        inputSearchTerm: "",
        result: {
          query: "",
          startIndex: 0,
          pageSize: 0,
          items: [],
        },
      },
    },
  };
};

export default normalizeBrowseViewFragmentIntoBrowseView;
