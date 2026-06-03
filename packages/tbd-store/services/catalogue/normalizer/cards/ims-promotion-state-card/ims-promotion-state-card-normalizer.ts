import { ImsPromotionStateCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ImsPromotionStateCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeImsPromotionStateCardFragmentIntoImsPromotionStateCard = (
  imsPromoStateCard: ImsPromotionStateCardFragment,
): TransformedFragment<ImsPromotionStateCard> => {
  const { urn, promotion, __typename, depositLink } = imsPromoStateCard;

  return {
    data: {
      typename: __typename,
      urn,
      promotion: promotion.urn,
      depositLink: depositLink || undefined,
    },
  };
};

export default normalizeImsPromotionStateCardFragmentIntoImsPromotionStateCard;
