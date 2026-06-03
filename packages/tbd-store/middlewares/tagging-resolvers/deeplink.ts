import { GenericEvent } from "../../state/tagging/Event.types";

import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { APPLICATION } from "./AnalyticsDimensions";

export const getBetslipDeeplinkEvent = (isBetSharing = false): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.DEEPLINK,
  action: TaggingAction.SAW,
  label: isBetSharing ? "betslip deeplink - bet sharing" : "betslip deeplink",
  [APPLICATION.MODULE]: "betslip",
});
