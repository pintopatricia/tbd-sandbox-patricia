import { SportViewLinkCard } from "../../../../../state/layout/cards/Card.types";
import { SportViewLinkCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSportViewLinkCardFragmentIntoSportViewLinkCard = (
  sportViewLinkCard: SportViewLinkCardFragment,
): TransformedFragment<SportViewLinkCard> => {
  const { urn, sport, viewLink, __typename } = sportViewLinkCard;

  return {
    data: {
      typename: __typename,
      urn,
      sport: sport.urn,
      viewLink,
    },
  };
};

export default normalizeSportViewLinkCardFragmentIntoSportViewLinkCard;
