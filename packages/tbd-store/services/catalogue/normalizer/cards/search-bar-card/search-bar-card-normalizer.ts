import { SearchBarCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import { SearchBarCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";

const normalizeSearchBarCardFragmentIntoSearchBarCard = (
  searchBarCard: SearchBarCardFragment,
): TransformedFragment<SearchBarCard> => {
  const { urn, __typename, searchTitle, searchPlaceholder } = searchBarCard;

  return {
    data: {
      urn,
      title: searchTitle && "name" in searchTitle ? searchTitle.name : null,
      placeholder: searchPlaceholder && "name" in searchPlaceholder ? searchPlaceholder.name : null,
      typename: __typename,
    },
  };
};

export default normalizeSearchBarCardFragmentIntoSearchBarCard;
