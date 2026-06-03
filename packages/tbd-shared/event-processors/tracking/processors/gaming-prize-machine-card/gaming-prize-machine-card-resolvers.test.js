import "jest-dom/extend-expect";
import {
  prizeMachineCardLoadedTrackingResolver,
  prizeMachinePlayBtnClickTrackingResolver,
  prizeMachineTCsLinkClickTrackingResolver,
} from "./gaming-prize-machine-card-resolvers";
import { getGAThrottles, getGamingPrizeMachineCard } from "./GamingPrizeMachine.graphql";

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(() => ({ router: { currentUrn: "viewUrn" } })),
  }),
}));

jest.mock("./GamingPrizeMachine.graphql", () => ({
  getGAThrottles: jest.fn(() => ({
    UAEnabled: true,
    GA4Enabled: true,
  })),
  getGamingPrizeMachineCard: jest.fn(),
}));

const sendEvent = jest.fn();
const cardMock = {
  urn: "urn",
  placementId: "placementId",
  completed: false,
  jackpotAmount: 2,
  jackpotState: "jackpotState",
  activeTitle: "activeTitle",
  ctaLabel: "ctaLabel",
  displayJackpotWinnersPostPlayWidget: false,
  guaranteedPrize: true,
};

describe("GamingPrizeMachineCard Tracking resolvers", () => {
  describe("prizeMachineCardLoadedTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(null);
      });

      it("should not invoke 'sendEvent' for none of the GA collectors", () => {
        prizeMachineCardLoadedTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when both GA throttles are disabled", () => {
      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(cardMock);
        getGAThrottles.mockReturnValue({
          UAEnabled: false,
          GA4Enabled: false,
        });
      });
      it("should not invoke 'senEvent' for none of the GA collectors", () => {
        prizeMachineCardLoadedTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when both GA throttles are enabled", () => {
      beforeEach(jest.clearAllMocks);

      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(cardMock);
        getGAThrottles.mockReturnValue({
          UAEnabled: true,
          GA4Enabled: true,
        });
      });

      it("should invoke 'sendEvent' for each of the GA collectors", () => {
        prizeMachineCardLoadedTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);

        expect(sendEvent).toHaveBeenCalledTimes(2);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "displayed",
          element_text: "prize machine - plus - active jackpot - jackpotstate",
          error: "null",
          event: "game_interactions",
          game_action: "null",
          game_id: "prize pinball",
          game_name: "prize pinball",
          game_provider: "null",
          game_state: "null",
          game_type: "null",
          module: "prize machine",
          module_display_order: "null",
          position: "null",
          stake: "null",
          winnings: "null",
        });

        expect(sendEvent).toHaveBeenCalledWith({
          action: "displayed",
          category: "gaming",
          cd103: null,
          cd12: "prize pinball",
          cd13: "prize pinball",
          cd138: null,
          cd143: null,
          cd3: "prize machine",
          cd34: "view-url",
          cd42: null,
          cd43: null,
          cd67: null,
          cd68: null,
          cd69: null,
          cd74: "ppb-internal",
          cd99: null,
          event: "ga_event",
          label: "prize machine - plus - active jackpot - jackpotstate",
        });
      });
    });
  });

  describe("prizeMachinePlayBtnClickTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(null);
      });

      it("should not invoke 'senEvent' for none of the GA collectors", () => {
        prizeMachinePlayBtnClickTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when both GA throttles are disabled", () => {
      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(cardMock);
        getGAThrottles.mockReturnValue({
          UAEnabled: false,
          GA4Enabled: false,
        });
      });
      it("should not invoke 'senEvent' for none of the GA collectors", () => {
        prizeMachinePlayBtnClickTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when both GA throttles are enabled", () => {
      beforeEach(jest.clearAllMocks);

      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(cardMock);
        getGAThrottles.mockReturnValue({
          UAEnabled: true,
          GA4Enabled: true,
        });
      });

      it("should invoke 'senEvent' for each of the GA collectors", () => {
        prizeMachinePlayBtnClickTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);

        expect(sendEvent).toHaveBeenCalledTimes(2);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "navigated to",
          destination_url: "view-url",
          element_text: "prize machine - plus - active jackpot - jackpotstate",
          event: "navigation",
          event_context: "null",
          game_filter: "null",
          game_id: "prize pinball",
          game_name: "prize pinball",
          game_provider: "ppb-internal",
          module: "prize machine",
          module_display_order: "null",
          position: "null",
          swimlane_type: "null",
        });

        expect(sendEvent).toHaveBeenCalledWith({
          action: "navigated to",
          category: "navigation",
          cd103: null,
          cd12: "prize pinball",
          cd13: "prize pinball",
          cd133: null,
          cd134: null,
          cd135: null,
          cd143: null,
          cd3: "prize machine",
          cd34: "view-url",
          cd4: null,
          cd42: null,
          cd43: null,
          cd67: null,
          cd68: null,
          cd69: null,
          cd74: "ppb-internal",
          event: "ga_event",
          label: "prize machine - plus - active jackpot - jackpotstate",
        });
      });
    });
  });

  describe("prizeMachineTCsLinkClickTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(null);
      });

      it("should not invoke 'senEvent' for none of the GA collectors", () => {
        prizeMachinePlayBtnClickTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when both GA throttles are disabled", () => {
      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(cardMock);
        getGAThrottles.mockReturnValue({
          UAEnabled: false,
          GA4Enabled: false,
        });
      });
      it("should not invoke 'senEvent' for none of the GA collectors", () => {
        prizeMachineTCsLinkClickTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when both GA throttles are enabled", () => {
      beforeEach(jest.clearAllMocks);

      beforeEach(() => {
        getGamingPrizeMachineCard.mockReturnValue(cardMock);
        getGAThrottles.mockReturnValue({
          UAEnabled: true,
          GA4Enabled: true,
        });
      });

      it("should invoke 'senEvent' for each of the GA collectors", () => {
        prizeMachineTCsLinkClickTrackingResolver({ urn: "urn", viewUrl: "view-url" }, sendEvent);

        expect(sendEvent).toHaveBeenCalledTimes(2);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "navigated to",
          destination_url: "view-url",
          element_text: "terms & conditions",
          event: "navigation",
          event_context: "null",
          game_filter: "null",
          game_id: "prize pinball",
          game_name: "prize pinball",
          game_provider: "ppb-internal",
          module: "prize machine",
          module_display_order: "null",
          position: "null",
          swimlane_type: "null",
        });

        expect(sendEvent).toHaveBeenCalledWith({
          action: "navigated to",
          category: "navigation",
          cd103: null,
          cd12: "prize pinball",
          cd13: "prize pinball",
          cd133: null,
          cd134: null,
          cd135: null,
          cd143: null,
          cd3: "prize machine",
          cd34: "view-url",
          cd4: null,
          cd42: null,
          cd43: null,
          cd68: null,
          cd69: null,
          cd74: "ppb-internal",
          event: "ga_event",
          label: "terms & conditions",
        });
      });
    });
  });
});
