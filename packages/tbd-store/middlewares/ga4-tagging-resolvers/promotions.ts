import { buildPromotionEvent, PromotionEvent } from "tagging-library";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { IMS_PROMOTION_MODULE_NAME } from "../../state";
import { AcceptPromotion, InteractCancelPromotionModal, RefreshPromotion } from "../../actions/promotion";

export const getAcceptPromotionEvent = (action: AcceptPromotion): PromotionEvent => {
  const { urn, name, promoStatus, userStatus, type, progressValue } = action.payload;

  return buildPromotionEvent({
    action: TaggingAction.ACCEPT_PROMOTION,
    elementText: "accept",
    module: IMS_PROMOTION_MODULE_NAME,
    destinationUrl: "null",
    position: "null",
    promotionId: urn,
    promotionType: type || "null",
    promotionName: name,
    promotionUserStatus: userStatus,
    promotionState: promoStatus,
    progressBar: progressValue?.toString() || "null",
    tierLevel: "null",
  });
};

export const getCancelPromotionEvent = (action: RefreshPromotion | InteractCancelPromotionModal): PromotionEvent => {
  const { urn, name, promoStatus, userStatus, label, type, progressValue } = action.payload;

  return buildPromotionEvent({
    action: TaggingAction.CLICKED,
    elementText: label,
    module: IMS_PROMOTION_MODULE_NAME,
    destinationUrl: "null",
    position: "null",
    promotionId: urn,
    promotionName: name,
    promotionUserStatus: userStatus,
    promotionState: promoStatus,
    promotionType: type || "null",
    progressBar: progressValue?.toString() || "null",
    tierLevel: "null",
  });
};
