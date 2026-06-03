/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import {
  ImsPromotionViewFragment,
  ViewItemsPartialFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { ImsPromotionView } from "../../../../../state/layout/views/View.types";

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

const normalizeImsPromotionViewFragmentIntoImsPromotionView = (
  imsPromotionView: ImsPromotionViewFragment,
): TransformedFragment<ImsPromotionView> => {
  const { partialItems, items, url, urn, __typename, title, xsellBar } = imsPromotionView;

  const transformedItems = transformPartialItems(items);
  const transformedPartialItems = transformPartialItems(partialItems);

  return {
    data: {
      urn,
      url,
      xsellBar,
      title: title ?? "",
      typename: __typename,
      items: removeDuplicatedItems(transformedItems, transformedPartialItems),
    },
  };
};

export default normalizeImsPromotionViewFragmentIntoImsPromotionView;
