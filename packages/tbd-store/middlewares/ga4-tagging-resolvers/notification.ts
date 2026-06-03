import { buildNotificationEvent, NotificationEvent } from "tagging-library";

import type { SmartAppBannerClickAction } from "../../actions/notification";
import { PlatformType, TaggingAction } from "../tagging-resolvers/AnalyticsConstants";

const buildBaseSmartAppBannerEvent = (action: TaggingAction, destinationUrl = ""): NotificationEvent =>
  buildNotificationEvent({
    action,
    elementText: "get the native app",
    pushMessagePlatform: PlatformType.Web,
    destinationUrl,
  });

export const getSmartAppBannerClickEvent = (action: SmartAppBannerClickAction): NotificationEvent =>
  buildBaseSmartAppBannerEvent(TaggingAction.CLICKED, action.payload.url);

export const getSmartAppBannerCloseEvent = (): NotificationEvent => buildBaseSmartAppBannerEvent(TaggingAction.CLOSED);

export const getSmartAppBannerDisplayEvent = (): NotificationEvent =>
  buildBaseSmartAppBannerEvent(TaggingAction.DISPLAYED);
