import { LoyaltyPromotion } from "../../../../../state/entities";
import { LoyaltyPromotionFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeLoyaltyPromotionFragmentIntoLoyaltyPromotion = (
  loyaltyPromotion: LoyaltyPromotionFragment,
): TransformedFragment<LoyaltyPromotion> => {
  const { __typename, urn, name, title, state, termsAndConditions, promoImage } = loyaltyPromotion;

  return {
    data: {
      typename: __typename,
      urn,
      name,
      title,
      state,
      promoImage,
      termsAndConditions,
    },
  };
};

export default normalizeLoyaltyPromotionFragmentIntoLoyaltyPromotion;
