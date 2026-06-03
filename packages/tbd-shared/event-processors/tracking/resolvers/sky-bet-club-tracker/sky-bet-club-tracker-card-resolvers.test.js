import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { skyBetClubTrackerHomepageLinkTrackingResolver } from "./sky-bet-club-tracker-card-resolvers";

const sendEvent = jest.fn();

describe("SkyBetClubTrackerCard resolvers", () => {
  describe("skyBetClubTrackerHomepageLinkTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    it("should call sendEvent with the correct payload", () => {
      const payload = {
        destinationUrl: "url_to_destination_mock",
      };
      skyBetClubTrackerHomepageLinkTrackingResolver(payload, sendEvent);

      expect(sendEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith({
        event: "navigation",
        action: TaggingAction.NAVIGATED_TO,
        destination_url: payload.destinationUrl,
        element_text: "loyalty club tracker",
        module: "betslip",
        position: "null",
        module_display_order: "null",
        event_context: "null",
        game_filter: "null",
        game_id: "null",
        game_name: "null",
        game_provider: "null",
        swimlane_type: "null",
      });
    });

    describe("when payload is empty", () => {
      it("should call sendEvent with destination url as null", () => {
        const payload = {};

        skyBetClubTrackerHomepageLinkTrackingResolver(payload, sendEvent);

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          event: "navigation",
          action: TaggingAction.NAVIGATED_TO,
          destination_url: "null",
          element_text: "loyalty club tracker",
          module: "betslip",
          position: "null",
          module_display_order: "null",
          event_context: "null",
          game_filter: "null",
          game_id: "null",
          game_name: "null",
          game_provider: "null",
          swimlane_type: "null",
        });
      });
    });
  });
});
