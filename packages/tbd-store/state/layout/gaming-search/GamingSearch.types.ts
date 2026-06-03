import URN from "../URN";
import { GameCard } from "../cards/Card.types";

export type GamingSearch = {
  [key: string]: {
    inputSearchTerm: string;
    result: GamingSearchResultItem[];
    gamesRetrieved: boolean;
    hasNextPage: boolean;
    endCursor: string | null;
    totalCount: number;
    isLoadingMore: boolean;
  };
};

export type GameCardNode = {
  node: GameCard;
  __typename: "GamingCardEdge";
};

export type GamingSearchResultItem = {
  type: "GAMING_SEARCH_RESULT_ITEM";
  urn: URN;
  url?: string;
  visible?: boolean;
};
