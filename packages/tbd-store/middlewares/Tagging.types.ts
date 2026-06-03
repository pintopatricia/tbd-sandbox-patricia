import { TaggingEvent } from "./tagging-resolvers/Event.types";
import { PageLoadEvent } from "./tagging-resolvers/PageLoad.types";
import { MetaDataEvent } from "../state/tagging";
import { CampaignMeasurementEvent } from "./tagging-resolvers/CampaignMeasurement.types";
import { TaggingTypes } from "./ga4-tagging-resolvers/Tagging.types";

type AnalyticsWebEventType = TaggingEvent | PageLoadEvent | MetaDataEvent;

type AnalyticsNativeEventType = TaggingTypes | MetaDataEvent | CampaignMeasurementEvent;

export type AnalyticsEventType = AnalyticsWebEventType | AnalyticsNativeEventType;
