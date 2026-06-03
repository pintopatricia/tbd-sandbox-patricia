import { buildInterfaceEvent } from "tagging-library";
import {
  priceBoostMultisCollapseToggleTrackingResolver,
  priceBoostMultisShowMoreShowLessTrackingResolver,
} from "./price-boost-multis-resolvers";

jest.mock("tagging-library", () => ({
  buildInterfaceEvent: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("priceBoostMultisCollapseToggleTrackingResolver", () => {
  describe("when is expanded", () => {
    it("should send correct event", () => {
      const sendEventSpy = jest.fn();
      buildInterfaceEvent.mockReturnValue("collapse toggle event");
      priceBoostMultisCollapseToggleTrackingResolver(
        {
          isExpanded: true,
          pageType: "sport",
          zoneName: "Zone Name",
          tabName: "Tab name",
        },
        sendEventSpy,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "open",
        module: "sport - Zone Name - Tab name",
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
      priceBoostMultisCollapseToggleTrackingResolver(
        {
          isExpanded: false,
          pageType: "sport",
          zoneName: "Zone Name",
          tabName: "Tab name",
        },
        sendEventSpy,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "close",
        module: "sport - Zone Name - Tab name",
      });
      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith("collapse toggle event");
      expect(sendEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe("priceBoostMultisShowMoreShowLessTrackingResolver", () => {
  describe("when isOpen", () => {
    it("should send correct event with show more text", () => {
      const sendEventSpy = jest.fn();

      buildInterfaceEvent.mockReturnValue("show more event");
      priceBoostMultisShowMoreShowLessTrackingResolver(
        {
          isOpen: true,
          pageType: "sport",
          zoneName: "Zone Name",
          tabName: "Tab name",
        },
        sendEventSpy,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "show more",
        module: "sport - Zone Name - Tab name",
      });
      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith("show more event");
      expect(sendEventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when is not open", () => {
    it("should send correct event with show less text", () => {
      const sendEventSpy = jest.fn();

      buildInterfaceEvent.mockReturnValue("show more event");
      priceBoostMultisShowMoreShowLessTrackingResolver(
        {
          isOpen: false,
          pageType: "sport",
          zoneName: "Zone Name",
          tabName: "Tab name",
        },
        sendEventSpy,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "show less",
        module: "sport - Zone Name - Tab name",
      });
      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(sendEventSpy).toHaveBeenCalledWith("show more event");
      expect(sendEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});
