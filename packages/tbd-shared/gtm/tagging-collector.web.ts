import { AnalyticsEventType } from "@ppb/tbd-store/middlewares/Tagging.types";

// we need to set transport mode as beacon so the request to analytics can persist between pages
// this has to be set here because we have racing conditions if we set it in master.js
let setGABeacon: (() => void) | null = () => {
  if (window.ga) {
    window.ga("set", { transport: "beacon" });
    setGABeacon = null;
  }
};

/**
 * Checks if value is of type string
 *
 * @param value
 */
const isString = (value: any): value is string => typeof value === "string";

const IGNORE_LOWERCASE_LIST = new Set(["event", "app_id", "ga_target_property"]);

/**
 * Receives a GTM event and sanitizes its values to be lowercase
 *
 * @param event a TaggingEvent or PageLoadEvent
 */
const sanitizeEvent = (event: AnalyticsEventType): AnalyticsEventType =>
  Object.entries(event).reduce<AnalyticsEventType>(
    (acc, [key, value]) => ({
      ...acc,
      [key]: !IGNORE_LOWERCASE_LIST.has(key) && isString(value) ? value.toLowerCase() : value,
    }),
    event,
  );

export const sendEvent = (event: AnalyticsEventType): void => {
  if (setGABeacon) {
    setGABeacon();
  }

  // collect all GTM tags in lower case
  const sanitizedEvent = sanitizeEvent(event);

  // the GTM script currently needs metaData to be in datalayer to load OneTrust
  if ("event" in sanitizedEvent && sanitizedEvent.event === "metaData") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(sanitizedEvent);
  } else if (window._aw_ && typeof window._aw_.analyticsPushEvent === "function") {
    window._aw_.analyticsPushEvent(sanitizedEvent);
  } else {
    if (!window.enhancedDataLayer) window.enhancedDataLayer = [];
    window.enhancedDataLayer.push(sanitizedEvent);
  }
};
