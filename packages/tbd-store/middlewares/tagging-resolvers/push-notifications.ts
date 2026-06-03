import { APPLICATION } from "../../state/tagging/AnalyticsDimensions";
import { GenericEvent } from "../../state/tagging/Event.types";
import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";

const MODULE_NAME = "bet receipt";

export const getBetReceiptToggleClickEvent = (isSelected: boolean): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: isSelected ? TaggingAction.TOGGLE_ON : TaggingAction.TOGGLE_OFF,
  label: "receive live alerts",
  [APPLICATION.MODULE]: MODULE_NAME,
});

export const getBetReceiptSuccessMessageSaw = (label: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.INTERFACE,
  action: TaggingAction.SAW,
  label,
  [APPLICATION.MODULE]: MODULE_NAME,
});
