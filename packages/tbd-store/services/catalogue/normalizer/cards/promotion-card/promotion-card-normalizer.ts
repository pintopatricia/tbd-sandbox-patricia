import { PromotionCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import { PromotionCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";

const normalizePromotionCardFragmentIntoPromotionCard = (
  promotionCardfragment: PromotionCardFragment,
): TransformedFragment<PromotionCard> => {
  const {
    action,
    backgroundImage,
    promotionName,
    headline,
    subHeadline,
    strapline,
    promotionContentType,
    promotionTitle,
    promoTypeLabel,
    termsAndConditions,
    isImsPromo,
    urn,
    introLine,
    endDate,
    optInState,
    tags,
    hasBetfairBoost,
    __typename,
  } = promotionCardfragment;

  const data: PromotionCard = {
    action,
    backgroundImage,
    promotionName,
    headline,
    subHeadline,
    strapline,
    promotionContentType,
    promotionTitle,
    termsAndConditions,
    urn,
    introLine,
    endDate,
    optInState,
    tags,
    isImsPromo,
    hasBetfairBoost,
    typename: __typename,
  };

  // Link
  if (promoTypeLabel) {
    data.promoTypeLabel = promoTypeLabel;
  }

  // Oddsboost
  if ("market" in action) {
    data.action = {
      ...data.action,
      market: {
        urn: action.market.urn,
      },
    };
  }

  return {
    data,
  };
};

export default normalizePromotionCardFragmentIntoPromotionCard;
