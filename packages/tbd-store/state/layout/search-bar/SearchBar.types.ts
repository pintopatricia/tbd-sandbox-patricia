import { Search } from "../views/browse-view/BrowseInterface.types";
import { PartialItem } from "../views/PartialItem.types";

export type SearchBar = {
  results: PartialItem[];
  search: Search;
};
