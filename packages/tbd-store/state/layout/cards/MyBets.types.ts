import URN from "../URN";
import { ViewLink } from "../views/ViewLink.types";

export const MY_BETS_MODULE_NAME = "my bets";

export type MyBetsState = {
  orderTypeFilter?: string;
  productTypeFilter?: string;
  orderStatusFilter?: string;
  viewUrn?: URN;
  isHeritageView?: boolean;
  transactionHistoryLink?: ViewLink;
  settlementLink?: string | null;
  hasEmptyStateImage?: boolean;
};

export type MyBetsFilters = {
  orderType: MyBetsFilterByOrderType;
  productType: MyBetsFilterByProductType;
  marketIds: string[];
  matchedStatus?: MyBetsFilterByMatchedStatus;
  totalDaysRange: number;
  hasHeritageBets?: boolean;
  isHeritageView?: boolean;
};

export type MyBetsItem = {
  isEmptyStateCard?: boolean;
  urn: URN;
  typename: string;
};

export type MyBetsFilterByOrderType = {
  items: OrderTypeFilterItem[];
  defaultIndex: number;
};

export type MyBetsFilterByProductType = {
  items: ProductTypeFilterItem[];
  defaultIndex: number;
};

export type MyBetsFilterByMatchedStatus = {
  items: MatchedStatusFilterItems[];
  defaultIndex: number;
};

export enum OrderTypeFilterItem {
  Open = "open",
  Settled = "settled",
}

export enum HeritageOrderTypeFilterItem {
  Open = "hopen",
  Settled = "hsettled",
}

export type ProductTypeFilterItem = "exc" | "sbk";

export type MatchedStatusFilterItems = {
  filterURN: URN;
  filter: MatchedStatusFilterItem;
  numberOfBets?: number;
};

export type MatchedStatusFilterItem = "matched" | "unmatched";
