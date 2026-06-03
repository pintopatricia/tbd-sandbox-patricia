import { ViewLink } from "../../cards/ViewLink.types";
import URN from "../../URN";

export type BrowseTab = "sports" | "gaming";

export type Section = {
  title: string;
  content: any;
};

export type LinkItem = {
  text: string;
  viewLink: ViewLink;
  target: string;
};
export type LinkLocales = {
  en_GB?: LinkItem[];
  es?: LinkItem[];
  es_419?: LinkItem[];
  pt_BR?: LinkItem[];
  ru?: LinkItem[];
  no?: LinkItem[];
  hu?: LinkItem[];
  fi?: LinkItem[];
  de?: LinkItem[];
  it?: LinkItem[];
};
export type LinkItems = {
  INTERNATIONAL: LinkLocales;
  SPAIN: LinkLocales;
  ITALY: LinkLocales;
};

export type BrowseInterfaceState = {
  isOpen: boolean;
  search: Search;
};

export type Search = {
  inputSearchTerm: string;
  result: SearchResult;
};

export type SearchResult = {
  query: string;
  pageSize: number;
  startIndex: number;
  didYouMean?: string | null;
  outOfIdeas?: string | null;
  items: SearchResultItem[];
};

export type SearchResultItemType =
  | "EVENT_SEARCH_RESULT_ITEM"
  | "COMPETITION_SEARCH_RESULT_ITEM"
  | "RACE_SEARCH_RESULT_ITEM"
  | "GAME_SEARCH_RESULT_ITEM";

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

export type SearchResultItem =
  | EventSearchResultItem
  | CompetitionSearchResultItem
  | GameSearchResultItem
  | RaceSearchResultItem;

export type PebbleListItem = {
  id: string;
  text: string;
};
