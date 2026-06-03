import { BUSINESS } from "./AnalyticsDimensions";
import { GenericEvent } from "./Event.types";

export type MediaEvent = {
  [BUSINESS.SPORT_ID]: number | null;
  [BUSINESS.SPORT_NAME]: string | null;
  [BUSINESS.EVENT_ID]: number | null;
  [BUSINESS.EVENT_NAME]: string | null;
};

export type BroadcastsMediaEvent = GenericEvent & MediaEvent;
