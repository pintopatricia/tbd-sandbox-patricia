import {
  MyBetsViewFilterByOrderType,
  MyBetsViewFilterByProductType,
  MyBetsViewFragment,
  ViewItemsFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import {
  MatchedStatusFilterItem,
  MatchedStatusFilterItems,
  OrderTypeFilterItem,
  ProductTypeFilterItem,
} from "../../../../../state/layout/cards/MyBets.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { MyBetsView } from "../../../../../state/layout/views/View.types";

import { TransformedFragment } from "../../Normalizer.types";

const mapMyBetsViewFilterByOrderTypeToOrderTypeFilterItem: Record<string, OrderTypeFilterItem> = {
  OPEN: OrderTypeFilterItem.Open,
  SETTLED: OrderTypeFilterItem.Settled,
};

const mapMyBetsViewFilterByProductTypeToProductTypeFilterItem: Record<string, ProductTypeFilterItem> = {
  EXCHANGE: "exc",
  SPORTSBOOK: "sbk",
};

const mapMyBetsViewFilterByMatchedStatusToMatchedStatusFilterItem: Record<string, MatchedStatusFilterItem> = {
  MATCHED: "matched",
  UNMATCHED: "unmatched",
};

const mapOrderTypeFilterItems = <T extends Pick<MyBetsViewFilterByOrderType, "items" | "defaultIndex">>(
  orderType: T,
): OrderTypeFilterItem[] => {
  const mappedOrderTypeItems = [] as OrderTypeFilterItem[];
  orderType.items.forEach((order) => {
    if (!order) {
      return;
    }
    mappedOrderTypeItems.push(mapMyBetsViewFilterByOrderTypeToOrderTypeFilterItem[order]);
  });

  return mappedOrderTypeItems;
};

const mapProductTypeFilterItems = <T extends Pick<MyBetsViewFilterByProductType, "items" | "defaultIndex">>(
  productType: T,
): ProductTypeFilterItem[] => {
  const mappedProductTypeItems = [] as ProductTypeFilterItem[];

  productType.items.forEach((product) => {
    if (!product) {
      return;
    }
    mappedProductTypeItems.push(mapMyBetsViewFilterByProductTypeToProductTypeFilterItem[product]);
  });
  return mappedProductTypeItems;
};

const mapMatchedStatusFilterItems = <
  T extends Pick<NonNullable<MyBetsViewFragment["filters"]["matchedStatus"]>, "items" | "defaultIndex">,
>(
  matchedStatusFilter: T,
): MatchedStatusFilterItems[] => {
  const mappedProductTypeItems = [] as MatchedStatusFilterItems[];

  matchedStatusFilter.items.forEach((filterItem) => {
    if (filterItem) {
      mappedProductTypeItems.push({
        filterURN: filterItem.filterURN,
        filter: mapMyBetsViewFilterByMatchedStatusToMatchedStatusFilterItem[filterItem.filter],
        numberOfBets: filterItem.numberOfBets || undefined,
      });
    }
  });

  return mappedProductTypeItems;
};

const mapToPartialItems = (items: ViewItemsFragment): PartialItem[] =>
  items.edges.reduce((acc: PartialItem[], item) => {
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
  }, []);

const normalizeMyBetsViewFragmentIntoMyBetsView = (myBetsView: MyBetsViewFragment): TransformedFragment<MyBetsView> => {
  const {
    filters,
    __typename,
    urn,
    url,
    items,
    transactionHistoryLink,
    hasEmptyStateImage,
    xsellBar,
    settlementLink,
    headerItems,
  } = myBetsView;
  const { marketIds, orderType, productType, matchedStatus, totalDaysRange, hasHeritageBets, isHeritageView } = filters;

  return {
    data: {
      urn,
      url,
      xsellBar,
      settlementLink,
      typename: __typename,
      transactionHistoryLink,
      hasEmptyStateImage,
      items: mapToPartialItems(items),
      pageInfo: {
        hasNextPage: items.pageInfo?.hasNextPage || false,
        endCursor: items.pageInfo?.endCursor || "",
      },
      filters: {
        orderType: {
          items: mapOrderTypeFilterItems(orderType),
          defaultIndex: orderType.defaultIndex || 0,
        },
        productType: {
          items: mapProductTypeFilterItems(productType),
          defaultIndex: productType.defaultIndex || 0,
        },
        marketIds,
        totalDaysRange,
        matchedStatus: matchedStatus
          ? {
              items: mapMatchedStatusFilterItems(matchedStatus),
              defaultIndex: matchedStatus.defaultIndex,
            }
          : undefined,
        hasHeritageBets: Boolean(hasHeritageBets),
        isHeritageView: Boolean(isHeritageView),
      },
      headerItems: mapToPartialItems(headerItems),
    },
  };
};

export default normalizeMyBetsViewFragmentIntoMyBetsView;
