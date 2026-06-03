import { formatTextToGA } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";
import { buildNavigationEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { XSellBarEvents } from "../../../../components/Header/events";

export const xSellBarItemClickAction = (
  action: XSellBarEvents["UI__NAVIGATE_XSELL"],
  sendEvent: (payload: any) => void,
) => {
  const { sectionUrl, index, sectionType } = action;

  const event = buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    elementText: formatTextToGA(sectionType),
    module: "xsell bar",
    destinationUrl: sectionUrl,
    position: index.toString(),
    moduleDisplayOrder: "null",
  });

  sendEvent(event);
};
