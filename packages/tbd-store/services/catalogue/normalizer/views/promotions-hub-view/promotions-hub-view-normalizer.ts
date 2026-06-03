import {
  PromotionsHubViewFragment,
  ViewItemsPartialFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { PromotionsHubView } from "../../../../../state/layout/views/View.types";
import { PartialItem } from "../../../../../state";

const transformItems = <T extends ViewItemsPartialFragment | {}>(fragment: T): PartialItem[] => {
  if ("edges" in fragment) {
    return fragment.edges.reduce((acc: PartialItem[], item) => {
      if (item?.node !== undefined && "urn" in item.node) {
        return [...acc, { urn: item.node.urn, typename: item.node.__typename }];
      }
      return acc;
    }, []);
  }
  return [];
};

const normalizePromotionsHubViewFragmentIntoPromotionsHubView = (
  promotionsHubView: PromotionsHubViewFragment,
): TransformedFragment<PromotionsHubView> => {
  const { urn, url, title, __typename, items, xsellBar } = promotionsHubView;

  return {
    data: {
      typename: __typename,
      urn,
      title: title || undefined,
      url,
      xsellBar,
      items: transformItems(items),
    },
  };
};

export default normalizePromotionsHubViewFragmentIntoPromotionsHubView;
