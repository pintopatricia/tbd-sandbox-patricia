import { GamingPlayNewCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GamingPlayNewCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeGamingPlayNewCardFragmentIntoGamingPlayNewCard = (
  gamingPlayNewCard: GamingPlayNewCardFragment,
): TransformedFragment<GamingPlayNewCard> => {
  const {
    urn,
    title,
    subtitle,
    backgroundImage,
    logoImage,
    termsAndConditions,
    endDate,
    optInState,
    tags,
    __typename,
  } = gamingPlayNewCard;

  return {
    data: {
      urn,
      typename: __typename,
      title,
      subtitle,
      backgroundImage,
      logoImage,
      termsAndConditions,
      endDate,
      optInState,
      tags,
    },
  };
};

export default normalizeGamingPlayNewCardFragmentIntoGamingPlayNewCard;
