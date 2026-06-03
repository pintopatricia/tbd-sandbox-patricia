import { act, renderHook } from "@testing-library/react";
import { NotificationCode } from "../components/Betslip/betslip-notification-code";
import { useNotificationShown, notificationValidator } from "./useNotificationShown";

describe("useNotificationShown", () => {
  describe("when there are no notifications", () => {
    it("should not call the handler", () => {
      const handler = jest.fn();

      renderHook(() => useNotificationShown([], [NotificationCode.MaxPayoutDailyLimit], handler));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("when there are notifications", () => {
    describe("when the notification codes don't match", () => {
      it("should not call the handler", () => {
        const handler = jest.fn();

        renderHook(() =>
          useNotificationShown(
            [{ id: NotificationCode.Availability }],
            [NotificationCode.MaxPayoutDailyLimit],
            handler,
            () => true,
          ),
        );

        expect(handler).not.toHaveBeenCalled();
      });
    });

    describe("when the notification codes match", () => {
      describe("when notification gtmLabel is undefined", () => {
        it("should not call the handler", () => {
          const handler = jest.fn();

          renderHook(() =>
            useNotificationShown(
              [{ id: NotificationCode.MaxPayoutDailyLimit }],
              [NotificationCode.MaxPayoutDailyLimit],
              handler,
              () => true,
            ),
          );

          expect(handler).not.toHaveBeenCalled();
        });
      });

      describe("when notification gtmLabel is defined", () => {
        it("should call the handler with the correct params once", () => {
          const handler = jest.fn();

          const { rerender } = renderHook(() =>
            useNotificationShown(
              [{ id: NotificationCode.MaxPayoutDailyLimit, gtmLabel: "label" }],
              [NotificationCode.MaxPayoutDailyLimit],
              handler,
              () => true,
            ),
          );

          act(() => {
            rerender();
          });

          expect(handler).toHaveBeenCalledWith("label");
          expect(handler).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

describe("notificationValidator", () => {
  it("should return false when notification has no id", () => {
    const notification = { id: undefined };

    expect(notificationValidator(notification, [], [])).toBe(false);
  });

  describe("when the notification has an id", () => {
    describe("and the id matches an entry in the whitelist", () => {
      it("should return true", () => {
        const notification = { id: "NOTIF" };
        const whitelist = ["NOTIF"];

        expect(notificationValidator(notification, whitelist, [])).toBe(true);
      });
    });

    describe("and the id does not match any entry in the whitelist", () => {
      it("should return true if the notification matches a validation entry and the validation type is whitelisted", () => {
        const notification = { id: "123" };
        const whitelist = ["NOTIF"];
        const validations = [{ type: "NOTIF", notification: { id: "123" } }];

        expect(notificationValidator(notification, whitelist, validations)).toBe(true);
      });

      it("should return false if the notification does not match any validation entry", () => {
        const notification = { id: "123" };
        const whitelist = ["NOTIF"];
        const validations = [{ type: "NOTIF", notification: { id: "aaa" } }];

        expect(notificationValidator(notification, whitelist, validations)).toBe(false);
      });

      it("should return false if the notification matches a validation entry, but the validation type is not whitelisted", () => {
        const notification = { id: "123" };
        const whitelist = ["NOTIF"];
        const validations = [{ type: "ERROR", notification: { id: "123" } }];

        expect(notificationValidator(notification, whitelist, validations)).toBe(false);
      });
    });
  });
});
