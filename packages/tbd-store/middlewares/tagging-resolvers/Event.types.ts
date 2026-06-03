import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { APPLICATION } from "./AnalyticsDimensions";

export type TaggingEventType = "ga_event" | "ga_pageLoad" | "metaData";

export type GenericEvent = {
  event: TaggingEventType;
  category: TaggingCategory;
  action: TaggingAction;
  label: string;
  [APPLICATION.MODULE]: string;
};

export type TaggingEvent = GenericEvent;
