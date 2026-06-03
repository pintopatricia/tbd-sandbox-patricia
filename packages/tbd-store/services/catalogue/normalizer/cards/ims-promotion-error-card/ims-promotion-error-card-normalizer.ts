import {
  ImsPromotionErrorCardFragment,
  PromotionErrorCode,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { ImsPromotionErrorCard } from "../../../../../state/layout/cards/Card.types";
import { ImsPromotionErrorCodes } from "../../../../../state/constants";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeImsPromotionErrorCardFragmentIntoImsPromotionErrorCard = (
  imsPromotionErrorCard: ImsPromotionErrorCardFragment,
): TransformedFragment<ImsPromotionErrorCard> => {
  const { urn, errorCode, seeAll, __typename } = imsPromotionErrorCard;

  let promoErrorCode = ImsPromotionErrorCodes.General;
  switch (errorCode) {
    case PromotionErrorCode.AlreadyCompleted:
      promoErrorCode = ImsPromotionErrorCodes.Completed;
      break;
    case PromotionErrorCode.NotEligible:
      promoErrorCode = ImsPromotionErrorCodes.NotEligible;
      break;
    default:
      promoErrorCode = ImsPromotionErrorCodes.General;
  }

  return {
    data: {
      typename: __typename,
      urn,
      errorCode: promoErrorCode,
      seeAll: seeAll || undefined,
    },
  };
};

export default normalizeImsPromotionErrorCardFragmentIntoImsPromotionErrorCard;
