import { LoyaltyPromotion } from "../state/entities/loyalty-promotions/LoyaltyPromotion.types";
import URN from "../state/layout/URN";

export const OPTIN_PROMOTION = "OPTIN_PROMOTION";
export const UI__LOYALTY_PROMOTION_OPT_IN_TAP = "UI/PROMOTION_OPT_IN_TAP";
export const UI__LOYALTY_PROMOTION_CTA_TAP = "UI/PROMOTION_CTA_TAP";
export const UI__LOYALTY_PROMOTION_BOTTOM_SHEET_OPEN = "UI/PROMOTION_BOTTOM_SHEET_OPEN";
export const UI__LOYALTY_PROMOTION_BOTTOM_SHEET_CLOSE = "UI/PROMOTION_BOTTOM_SHEET_CLOSE";

export type OptInPromotionAction = {
  type: typeof OPTIN_PROMOTION;
  payload: {
    urn: URN;
  };
};

export type LoyaltyPromotionOptInTapAction = {
  type: typeof UI__LOYALTY_PROMOTION_OPT_IN_TAP;
  payload: {
    id: string;
    title: string | null;
    description: string;
    optInState: LoyaltyPromotion["state"]["optInState"];
    optInStateLabel: string;
    typename: string;
  };
};

export type LoyaltyPromotionCTATapAction = {
  type: typeof UI__LOYALTY_PROMOTION_CTA_TAP;
  payload: {
    description: string;
    optInStatusLabel: string;
    destinationUrl: string;
    typename: string;
  };
};

export type LoyaltyPromotionBottomSheetOpenAction = {
  type: typeof UI__LOYALTY_PROMOTION_BOTTOM_SHEET_OPEN;
  payload: {
    description: string;
  };
};

export type LoyaltyPromotionBottomSheetCloseAction = {
  type: typeof UI__LOYALTY_PROMOTION_BOTTOM_SHEET_CLOSE;
  payload: {
    description: string;
  };
};
