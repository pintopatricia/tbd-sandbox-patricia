import { ImsPromotion } from "../../../../../state/entities";
import { ImsPromotionFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeImsPromotionFragmentIntoImsPromotion = (
  imsPromotion: ImsPromotionFragment,
): TransformedFragment<ImsPromotion> => {
  const {
    __typename,
    urn,
    headline,
    subHeadline,
    bonusInstanceCode,
    ctaText,
    layout,
    status,
    timeLeft,
    wagerType,
    wageringLeft,
    bonusAwarded,
    bonusWagering,
    buyIn,
    percentCompleted,
    freeSpins,
    image,
    goldenChips,
    currentBonusBalance,
    amountOnPendingWinnings,
  } = imsPromotion;

  return {
    data: {
      typename: __typename,
      urn,
      headline,
      subHeadline,
      bonusInstanceCode,
      ctaText,
      layout,
      status,
      timeLeft,
      freeSpins,
      image,
      wagerType,
      wageringLeft,
      bonusAwarded,
      bonusWagering,
      buyIn,
      percentCompleted,
      goldenChips,
      currentBonusBalance,
      amountOnPendingWinnings,
    },
  };
};

export default normalizeImsPromotionFragmentIntoImsPromotion;
