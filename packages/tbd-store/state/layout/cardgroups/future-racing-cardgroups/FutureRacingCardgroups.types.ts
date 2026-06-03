import URN from "../../URN";
import { PartialItem } from "../../views/PartialItem.types";

type PageInfo = {
  hasNextPage: boolean;
};

// Month Filter
export type MonthFilter = {
  urn: URN;
  defaultOptions?: MonthFilterOption;
  availableOptions: MonthFilterOption[];
  selectedOptions: MonthFilterOption[];
};

export type MonthFilterOption = {
  urn: URN;
  date: string;
};

// Countries Filter
export type CountriesFilter = {
  urn: URN;
  defaultOptions?: CountriesFilterOption[];
  availableOptions: CountriesFilterOption[];
  selectedOptions: CountriesFilterOption[];
};

export type CountriesFilterOption = {
  urn: URN;
  name: string;
};

// List of all filters
export type FutureRacingFilters = {
  countriesFilter?: CountriesFilter;
  monthFilter?: MonthFilter;
};

export type FutureRacingCardGroupPartialItem = {
  date: string;
} & PartialItem;

// Card
export type FutureRacingCardGroup = {
  urn: URN;
  typename: "FutureRacingCardGroup";
  filterOptions: FutureRacingFilters;
  pageInfo: PageInfo;
  items: FutureRacingCardGroupPartialItem[];
};

// Store entry
export type FutureRacingCardGroups = {
  [urn: string]: FutureRacingCardGroup;
};
