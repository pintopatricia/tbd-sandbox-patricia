import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { APPLICATION } from "./AnalyticsDimensions";

import { getBetslipDeeplinkEvent } from "./deeplink";

describe("Deeplink GTM resolvers", () => {
  describe("getBetslipDeeplink", () => {
    describe("when isBetSharing is false", () => {
      it("should return the correct event payload with betslip deeplink label", () => {
        expect(getBetslipDeeplinkEvent(false)).toEqual({
          event: "ga_event",
          category: TaggingCategory.DEEPLINK,
          action: TaggingAction.SAW,
          label: "betslip deeplink",
          [APPLICATION.MODULE]: "betslip",
        });
      });
    });

    describe("when isBetSharing is true", () => {
      it("should return the correct event payload with betslip deeplink - bet sharing label", () => {
        expect(getBetslipDeeplinkEvent(true)).toEqual({
          event: "ga_event",
          category: TaggingCategory.DEEPLINK,
          action: TaggingAction.SAW,
          label: "betslip deeplink - bet sharing",
          [APPLICATION.MODULE]: "betslip",
        });
      });
    });
  });
});
