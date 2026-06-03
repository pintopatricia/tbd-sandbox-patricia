import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { LoyaltyPromotionCTATapEvent, LoyaltyPromotionOptInTapEvent } from "../../state/tagging/Interface.types";
import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";

export const getLoyaltyPromotionOptInTapEvent = (
  pageType: string | null,
  id: string,
  name: string | null,
  label: string,
  typename: string,
): LoyaltyPromotionOptInTapEvent => ({
  event: "ga_event",
  category: TaggingCategory.PROMOTIONS,
  action: TaggingAction.ACCEPT_PROMOTION,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${typename === "LoyaltyPromoCard" ? "banner" : "mini banner"}`,
  [BUSINESS.PROMOTION_ID]: id,
  [BUSINESS.PROMOTION_NAME]: name,
});

export const getLoyaltyPromotionCTATapEvent = (
  pageType: string | null,
  label: string,
  optInStatusLabel: string,
  destinationUrl: string,
  typename: string,
): LoyaltyPromotionCTATapEvent => ({
  event: "ga_event",
  category: TaggingCategory.PROMOTIONS,
  action: `${TaggingAction.CLICKED_BANNER} - ${optInStatusLabel?.toLocaleLowerCase() || "promotion"} - ${
    typename === "LoyaltyPromoCard" ? "bet here" : "arrow"
  }` as TaggingAction,
  label,
  [APPLICATION.MODULE]: `${pageType} - ${typename === "LoyaltyPromoCard" ? "banner" : "mini banner"}`,
  [BUSINESS.DESTINATION_URL]: destinationUrl,
});
