import { BannerEvent, buildBannerEvent } from "tagging-library";
import { ApplicationState } from "../../state";
import { PromotionCallToActionClickAction } from "../../actions/interface";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { getLayoutMetadata } from "../../state/layout-snapshot";
import { MAX_URL_LENGTH_FOR_TAGGING } from "../tagging-resolvers/AnalyticsConstants";

const getViewTypeSelector = createViewTypeSelector();

export const getPromotionClickEvent = (
  action: PromotionCallToActionClickAction,
  state: ApplicationState,
): BannerEvent => {
  const { viewLink, title, promotionUrn, isImsPromo, taggingAction } = action.payload;

  const { horizontalPosition } = getLayoutMetadata(promotionUrn);

  const viewType = getViewTypeSelector(state);

  return buildBannerEvent({
    action: taggingAction,
    elementText: isImsPromo ? `casino - ${title}` : title,
    module: `${viewType} - banner swimlane`,
    destinationUrl: viewLink?.viewUrl.slice(0, MAX_URL_LENGTH_FOR_TAGGING) ?? "",
    position: `${horizontalPosition}`,
  });
};
