import { buildInterfaceEvent } from "tagging-library";
import { pebbleCardGroupCollapseToggleTrackingResolver } from "./pebble-card-group-resolvers";

jest.mock("tagging-library", () => ({
  buildInterfaceEvent: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("pebbleCardGroupCollapseToggleTrackingResolver", () => {
  describe("when is expanded", () => {
    it("should send correct event", () => {
      const sendEventSpy = jest.fn();
      buildInterfaceEvent.mockReturnValue("collapse toggle event");
      pebbleCardGroupCollapseToggleTrackingResolver(
        {
          isExpanded: true,
          pageType: "sport",
          pebbleCardGroupTitle: "Card group title",
          tabName: "Tab name",
        },
        sendEventSpy,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "open",
        module: "sport - Card group title - Tab name",
      });
      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith("collapse toggle event");
      expect(sendEventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when is not expanded", () => {
    it("should send correct event", () => {
      const sendEventSpy = jest.fn();
      buildInterfaceEvent.mockReturnValue("collapse toggle event");
      pebbleCardGroupCollapseToggleTrackingResolver(
        {
          isExpanded: false,
          pageType: "sport",
          pebbleCardGroupTitle: "Card group title",
          tabName: "Tab name",
        },
        sendEventSpy,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "close",
        module: "sport - Card group title - Tab name",
      });
      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith("collapse toggle event");
      expect(sendEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});
