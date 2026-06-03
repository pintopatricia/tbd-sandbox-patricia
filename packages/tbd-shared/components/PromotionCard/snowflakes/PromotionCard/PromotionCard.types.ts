import {
  PromotionAction,
  PromotionBackgroundImage,
  PromotionContentType,
  PromotionTermsAndConditions,
} from "@ppb/the-wall-common/types/PromoCard/PromoCard.types";

export type ImagePaths = {
  goldFoilPath: string | undefined;
  paperPatternPath: string | undefined;
  arrowPatternPath: string | undefined;
};

export type PromotionCardProps = {
  children: React.ReactNode;

  action: PromotionAction;
  backgroundImage?: PromotionBackgroundImage;
  isImsPromo?: boolean;
  hasPersonalisation?: boolean;
  promotionContentType?: PromotionContentType;
  promoTypeLabel?: string;
  name: string;
  onPromotionCardTap: () => void;
  onTermsAndConditionsTap: () => void;
  termsAndConditions: PromotionTermsAndConditions | null;
  termsAndConditionsLabel?: string;
  title: string | null;
  hasBetfairBoost?: boolean;
};
