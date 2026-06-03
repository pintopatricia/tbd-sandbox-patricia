import { ForbiddenContentCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ForbiddenContentCard } from "../../../../../state/layout/cards/Card.types";
import { ForbiddenContentType } from "../../../../../state/constants";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeForbiddenContentCardFragmentIntoForbiddenContentCard = (
  forbiddenContentCard: ForbiddenContentCardFragment,
): TransformedFragment<ForbiddenContentCard> => {
  const { urn, __typename, forbiddenCardType } = forbiddenContentCard;

  return {
    data: {
      urn,
      typename: __typename,
      forbiddenCardType: ForbiddenContentType[forbiddenCardType],
    },
  };
};

export default normalizeForbiddenContentCardFragmentIntoForbiddenContentCard;
