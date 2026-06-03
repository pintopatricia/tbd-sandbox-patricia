import { BetOpportunityPromoCardEvents } from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/viewmodel/events";
import { EditorialPromoCardEvents } from "@ppb/tbd-components-promotions/components/EditorialPromoCard/viewmodel/events";
import { LoyaltyPromoCardEvents } from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/viewmodel/events";
import { SelectionPromoCardEvents } from "@ppb/tbd-components-promotions/components/SelectionPromoCard/viewmodel/events";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getPromotionCardTrackingParams } from "../../Promotions.graphql";
import { convertViewLink } from "../misc/misc-util";

export type PromoCardTapEvents =
  | LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_TAP"]
  | LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_CTA_TAP"]
  | LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_BOTTOM_SHEET_OPEN"]
  | EditorialPromoCardEvents["@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP"]
  | SelectionPromoCardEvents["@@UI/SELECTION_PROMO_CARD_PROMO_TAP"]
  | BetOpportunityPromoCardEvents["@@UI/BET_OPPORTUNITY_PROMO_CARD_PROMO_TAP"];

export type PromoCardTermsAndConditionEvents =
  | EditorialPromoCardEvents["@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP"]
  | BetOpportunityPromoCardEvents["@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP"];

export const getBannerEventPayload = (
  action: PromoCardTapEvents | PromoCardTermsAndConditionEvents,
  taggingAction: TaggingAction,
) => {
  const { viewLink, urn } = action;
  const { title } = getPromotionCardTrackingParams(urn) || {};

  if (!title) {
    return;
  }

  const payload = {
    viewLink: viewLink ? convertViewLink(viewLink) : undefined,
    title,
    promotionUrn: urn,
    taggingAction: taggingAction,
  };

  return payload;
};
