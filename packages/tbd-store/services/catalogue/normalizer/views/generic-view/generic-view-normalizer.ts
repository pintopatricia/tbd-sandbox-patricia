/* eslint-disable no-underscore-dangle */

// TODO: to add typename after engine is implemented
// type GenericViewWithTypename = GenericView & { typename: "GenericView" };

import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import {
  GenericViewFragment,
  ViewItemsPartialFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { GenericView } from "../../../../../state/layout/views/View.types";

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
    }, []);
  }
  return [];
};

const normalizeGenericViewFragmentIntoGenericView = (
  genericView: GenericViewFragment,
): TransformedFragment<GenericView> => {
  const { partialItems, items, title, url, urn, viewHeader, canonicalUrl, __typename, xsellBar } = genericView;

  const transformedItems = transformPartialItems(items);
  const transformedPartialItems = transformPartialItems(partialItems);

  return {
    data: {
      urn,
      canonicalUrl,
      url,
      title: title || undefined,
      typename: __typename,
      xsellBar,
      viewHeader: viewHeader
        ? {
            title: viewHeader.title,
            subTitle: viewHeader.subTitle,
            badge: viewHeader.badge,
          }
        : undefined,
      items: removeDuplicatedItems(transformedItems, transformedPartialItems),
    },
  };
};

export default normalizeGenericViewFragmentIntoGenericView;
