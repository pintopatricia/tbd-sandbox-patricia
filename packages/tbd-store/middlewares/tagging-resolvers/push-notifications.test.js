import { getBetReceiptToggleClickEvent, getBetReceiptSuccessMessageSaw } from "./push-notifications";

describe("Push Notifications GTM resolvers", () => {
  describe("getBetReceiptToggleClickEvent", () => {
    describe("when called with true", () => {
      it("should return the correct event payload", () => {
        expect(getBetReceiptToggleClickEvent(true)).toEqual({
          event: "ga_event",
          category: "interface",
          action: "toggled on",
          label: "receive live alerts",
          cd3: "bet receipt",
        });
      });
    });

    describe("when called with false", () => {
      it("should return the correct event payload", () => {
        expect(getBetReceiptToggleClickEvent(false)).toEqual({
          event: "ga_event",
          category: "interface",
          action: "toggled off",
          label: "receive live alerts",
          cd3: "bet receipt",
        });
      });
    });
  });

  describe("getBetReceiptSuccessMessageSaw", () => {
    it("should return the correct event payload", () => {
      expect(getBetReceiptSuccessMessageSaw("enabled live alerts")).toEqual({
        event: "ga_event",
        category: "interface",
        action: "saw",
        label: "enabled live alerts",
        cd3: "bet receipt",
      });
    });
  });
});
