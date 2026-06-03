import URN from "../URN";

export type SearchBarState = {
  search: SearchBarInputResults;
};

export type SearchBarInputResults = {
  [k: string]: {
    inputSearchTerm: string;
    result: SearchBarStateResult;
  };
};

type BasicSearchResultItem = {
  urn: URN;
  url?: string;
  name: string;
  sportId?: number;
  sportName?: string;
};

export type EventSearchResultItem = {
  type: "EVENT_SEARCH_RESULT_ITEM";
  date: Date;
  competition?: string;
} & BasicSearchResultItem;

export type CompetitionSearchResultItem = {
  type: "COMPETITION_SEARCH_RESULT_ITEM";
  sportName: string;
  logo?: string;
} & BasicSearchResultItem;

export type RaceSearchResultItem = {
  type: "RACE_SEARCH_RESULT_ITEM";
  meetingName: string;
  date: Date;
} & BasicSearchResultItem;

export type GameSearchResultItem = {
  type: "GAME_SEARCH_RESULT_ITEM";
} & BasicSearchResultItem;

export type SearchBarStateResultItem =
  | EventSearchResultItem
  | CompetitionSearchResultItem
  | GameSearchResultItem
  | RaceSearchResultItem;

export type SearchBarStateResult = {
  query: string;
  pageSize: number;
  startIndex: number;
  didYouMean?: string | null;
  outOfIdeas?: string | null;
  items: SearchBarStateResultItem[];
};
