import { PromotionStatus } from "../../../clients/catalogue/catalogue-response-types";
import { DisplayName, LabeledLink, PromoImage } from "../../layout/cards/Card.types";
import URN from "../../layout/URN";

export type PromoState = {
  optInState: `${PromotionStatus}`;
  label?: DisplayName | null;
  link?: LabeledLink | null;
};

export type PromoTermsAndConditions = {
  link?: LabeledLink | null;
  summary?: string | null;
};

export type LoyaltyPromotion = {
  typename: "LoyaltyPromotion";
  urn: URN;
  name: string;
  state: PromoState;
  title?: string | null;
  termsAndConditions?: PromoTermsAndConditions;
  promoImage?: PromoImage | null;
};

export type LoyaltyPromotions = {
  [urn: string]: LoyaltyPromotion;
};
