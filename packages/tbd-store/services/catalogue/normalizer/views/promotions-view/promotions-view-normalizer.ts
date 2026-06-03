/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import {
  PromotionsViewFragment,
  ViewItemsPartialFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { PromotionsView } from "../../../../../state/layout/views/View.types";

const removeDuplicatedItems = (items: PartialItem[], partialItems: PartialItem[]): PartialItem[] =>
  items
    .concat(partialItems)
    .filter(
      (currentItem, index, array) =>
        array.findIndex((temp) => temp.urn === currentItem.urn && temp.typename === currentItem.typename) === index,
    );

const transformPartialItems = <T extends ViewItemsPartialFragment | {}>(fragment: T): PartialItem[] => {
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

const normalizePromotionsViewFragmentIntoPromotionsView = (
  promotionsView: PromotionsViewFragment,
): TransformedFragment<PromotionsView> => {
  const { partialItems, items, url, urn, __typename, xsellBar } = promotionsView;

  const transformedItems = transformPartialItems(items);
  const transformedPartialItems = transformPartialItems(partialItems);

  return {
    data: {
      urn,
      url,
      typename: __typename,
      xsellBar,
      items: removeDuplicatedItems(transformedItems, transformedPartialItems),
    },
  };
};

export default normalizePromotionsViewFragmentIntoPromotionsView;
