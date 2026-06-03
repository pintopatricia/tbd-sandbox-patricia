import { FilteredGroupSort, MarketTypeFilterLayout } from "../../../../clients/catalogue/catalogue-response-types";
import { Competition, Product } from "../../../entities";
import URN from "../../URN";
import { PartialItem } from "../../views/PartialItem.types";
import { ViewAllLink } from "../../views/ViewAll.types";

type PageInfo = {
  hasNextPage: boolean;
};

// Date Range Filter
export type DateRangeFilter = {
  urn: URN;
  defaultOption?: DateRangeFilterOption;
  availableOptions: DateRangeFilterOption[];
  selectedOption?: DateRangeFilterOption;
};

export type DateRangeFilterOption = {
  urn: URN;
  name: string;
};

// Sort
export type SortOption = {
  defaultOption?: FilteredGroupSort;
  availableOptions: FilteredGroupSort[];
  selectedOption?: FilteredGroupSort;
};

// Market Filter
type MarketTypeFilter = {
  urn: URN;
  availableOptions: MarketTypeFilterOption[];
  defaultOption?: MarketTypeFilterOption;
  selectedOption?: MarketTypeFilterOption;
  layout: MarketTypeFilterLayout;
};

export type MarketTypeFilterOption = {
  marketType: string;
  name: string;
};

// Competition Filter
type CompetitionsFilter = {
  urn: URN;
  defaultOptions?: Competition[];
  selectedOptions?: CompetitionOption[];
  topCompetitions: Competition[];
};

export type CompetitionOption = {
  name: string;
  urn: string;
};

// Countries Filter
type CountriesFilter = {
  urn: URN;
  defaultOptions?: CountriesFilterOption[];
  availableOptions: CountriesFilterOption[];
  selectedOptions?: CountriesFilterOption[];
};

type CountriesFilterOption = {
  urn: URN;
  name: string;
};

// Month Filter
type MonthFilter = {
  urn: URN;
  defaultOptions?: MonthFilterOption[];
  availableOptions: MonthFilterOption[];
  selectedOptions?: MonthFilterOption[];
};

type MonthFilterOption = {
  urn: URN;
  date: string;
};

// List of all filters
export type FilteredCouponFilters = {
  dateRangeFilter?: DateRangeFilter;
  marketTypeFilter?: MarketTypeFilter;
  competitionsFilter?: CompetitionsFilter;
  countriesFilter?: CountriesFilter;
  monthFilter?: MonthFilter;
};

// List of all coupon options
export type FilteredCouponOptions = {
  sortOption?: SortOption;
  filtersSorting?: string[];
} & FilteredCouponFilters;

export type FilterByInput = {
  dateRange?: URN;
  marketType: URN | null;
  competitions?: URN[];
  months?: URN[];
  countries?: URN[];
};

// Card
export type FilteredCouponCardGroup = {
  urn: URN;
  has90Min?: boolean;
  typename: "FilteredCouponCardGroup";
  selectedMarketTab?: Product;
  title: string;
  filterOptions: FilteredCouponOptions;
  viewAll?: ViewAllLink;
  pageInfo: PageInfo;
  items: PartialItem[];
};

// Store entry
export type FilteredCouponCardGroups = {
  [urn: string]: FilteredCouponCardGroup;
};

export { FilteredGroupSort } from "../../../../clients/catalogue/catalogue-response-types";
