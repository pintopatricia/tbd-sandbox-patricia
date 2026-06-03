import analytics from "@react-native-firebase/analytics";
import { CampaignMeasurementEvent } from "@ppb/tbd-store/middlewares/tagging-resolvers/CampaignMeasurement.types";
import { MetaDataEvent } from "@ppb/tbd-store/state/tagging/PageLoad.types";
import { TaggingTypes } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/Tagging.types";

export type AnalyticsEvent = TaggingTypes | MetaDataEvent | CampaignMeasurementEvent;

export const META_DATA_EVENT_KEY = "metaData";
const LOWERCASE_IGNORE_KEYS = ["event"];

export const isMetaDataEvent = (event: AnalyticsEvent): event is MetaDataEvent =>
  !!event && "event" in event && event.event === META_DATA_EVENT_KEY;

const isString = (value: unknown): value is string => typeof value === "string";

const sanitizeEvent = (event: AnalyticsEvent): AnalyticsEvent | {} =>
  event &&
  Object.entries(event).reduce<AnalyticsEvent>(
    (acc, [key, value]) => ({
      ...acc,
      [key]: !LOWERCASE_IGNORE_KEYS.includes(key) && isString(value) ? value.toLowerCase() : value,
    }),
    event,
  );

/**
 * Register analytics event
 */
export const sendEvent = (analyticsEvent: AnalyticsEvent): void => {
  if (isMetaDataEvent(analyticsEvent)) {
    analytics().setUserProperties({ account_id: analyticsEvent.account_id || "123456" });
    analytics().setUserId(analyticsEvent.user_id || null);
    // removing user and acc ids because they should be set in User properties instead
    analytics().setDefaultEventParameters(
      sanitizeEvent({
        ...analyticsEvent,
        account_id: undefined,
        user_id: undefined,
      }),
    );
    return;
  }

  const eventsArray = Array.isArray(analyticsEvent) ? analyticsEvent : [analyticsEvent];
  eventsArray.forEach((event) => {
    if (event) {
      analytics().logEvent(event.event, event);
    }
  });
};
