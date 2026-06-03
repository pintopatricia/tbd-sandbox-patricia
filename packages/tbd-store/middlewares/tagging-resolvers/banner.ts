import { BannerEvent, buildBannerEvent } from "tagging-library";
import { PromotionClickEvent } from "../../state/tagging/Interface.types";
import { ApplicationState } from "../../state/ApplicationState.types";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";
import { PromotionClickPayload } from "../../actions/interface";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { MAX_URL_LENGTH_FOR_TAGGING, TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { getLayoutMetadata } from "../../state/layout-snapshot";

export const getPromotionClickEvent = (
  payload: PromotionClickPayload,
  state: ApplicationState,
  action: TaggingAction,
): PromotionClickEvent => {
  const { viewLink, title, promotionUrn, isImsPromo } = payload;

  const { horizontalPosition, verticalPosition } = getLayoutMetadata(promotionUrn);

  const getViewTypeSelector = createViewTypeSelector();
  const viewType = getViewTypeSelector(state);

  const promotionType = "banner swimlane";

  return {
    event: "ga_event",
    category: TaggingCategory.BANNER,
    action,
    label: isImsPromo ? `casino - ${title}` : title,
    [APPLICATION.MODULE]: `${viewType} - ${promotionType}`,
    [BUSINESS.DESTINATION_URL]: viewLink?.viewUrl || "null",
    [BUSINESS.CMS_CARD_TITLE]: null,
    [BUSINESS.CMS_CARD_DISPLAY_ORDER]: null,
    [BUSINESS.CMS_BADGE]: null,
    [DEVICE.POSITION]: verticalPosition || null,
    [BUSINESS.TRANS_IN_PLAY_INDICATOR]: horizontalPosition || null,
    [BUSINESS.TRANS_CASHOUT_INDICATOR]: horizontalPosition || null,
  };
};

export const getBannerClickEvent = (
  payload: PromotionClickPayload,
  state: ApplicationState,
  titleConcat?: string,
): BannerEvent => {
  const { viewLink, title, promotionUrn } = payload;

  const { horizontalPosition } = getLayoutMetadata(promotionUrn);

  const getViewTypeSelector = createViewTypeSelector();
  const viewType = getViewTypeSelector(state);

  const promotionType = "banner swimlane";

  return buildBannerEvent({
    action: payload.taggingAction,
    elementText: title?.concat(titleConcat ?? ""),
    module: `${viewType} - ${promotionType}`,
    destinationUrl: viewLink?.viewUrl ? viewLink.viewUrl.slice(0, MAX_URL_LENGTH_FOR_TAGGING) : "",
    position: `${horizontalPosition}`,
  });
};
