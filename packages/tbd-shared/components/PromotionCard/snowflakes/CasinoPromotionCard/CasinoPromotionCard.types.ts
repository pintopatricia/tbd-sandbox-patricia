import {
  PromotionNavigationAction,
  PromotionTermsAndConditions,
} from "@ppb/the-wall-common/types/PromoCard/PromoCard.types";

export type CasinoPromotionCardProps = {
  action: PromotionNavigationAction;
  onActionButtonTap: () => void;
  promotionImage?: string;
  subtitle?: string;
  headline?: string;
  termsAndConditions?: PromotionTermsAndConditions | null;
  title: string | undefined;
};
