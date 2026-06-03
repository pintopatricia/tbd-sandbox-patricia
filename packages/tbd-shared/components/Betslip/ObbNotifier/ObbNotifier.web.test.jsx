import { BetslipNotifications } from "@ppb/the-wall-web";
import { act, render } from "@testing-library/react";
import { NotificationCode } from "../betslip-notification-code";
import { ObbNotifier } from "./ObbNotifier.web";
import { useNotificationShown, notificationValidator } from "../../../helpers/useNotificationShown";

jest.mock("@ppb/the-wall-web", () => ({
  BetslipNotifications: jest.fn(() => <notifications-mock />),
}));

jest.mock("../../../helpers/useNotificationShown");

function renderObbNotifier({
  className = "obb",
  notifications = [],
  validations = [],
  dispatchObbValidateStake = jest.fn(),
  dispatchObbNotificationShown = jest.fn(),
  dispatchExternalPush = jest.fn(),
  dispatchMaxPayoutNotificationAccepted = jest.fn(),
  dispatchObbMaxPayoutNotificationUrlClick = jest.fn(),
} = {}) {
  return render(
    <ObbNotifier
      className={className}
      notifications={notifications}
      validations={validations}
      dispatchObbValidateStake={dispatchObbValidateStake}
      dispatchObbNotificationShown={dispatchObbNotificationShown}
      dispatchExternalPush={dispatchExternalPush}
      dispatchMaxPayoutNotificationAccepted={dispatchMaxPayoutNotificationAccepted}
      dispatchObbMaxPayoutNotificationUrlClick={dispatchObbMaxPayoutNotificationUrlClick}
    />,
  );
}

describe("ConnectedObbNotifier", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are no notifications", () => {
    it("should not call BetslipNotifications", () => {
      const dispatchObbValidateStakeSpy = jest.fn();
      renderObbNotifier({ dispatchObbValidateStake: dispatchObbValidateStakeSpy });

      expect(BetslipNotifications).not.toHaveBeenCalled();
    });
  });

  describe("when there are notifications", () => {
    it("should call BetslipNotifications", () => {
      const dispatchObbValidateStakeSpy = jest.fn();

      renderObbNotifier({
        dispatchObbValidateStake: dispatchObbValidateStakeSpy,
        notifications: ["something"],
      });

      expect(BetslipNotifications).toHaveBeenCalledWith(
        {
          alerts: ["something"],
          onAlertClick: dispatchObbValidateStakeSpy,
          onAlertClose: expect.any(Function),
          onAlertUrlClick: expect.any(Function),
        },
        undefined,
      );
    });

    describe("useNotificationShown", () => {
      it("should call useNotificationShown", () => {
        const dispatchObbNotificationShownSpy = jest.fn();

        useNotificationShown.mockImplementationOnce(
          (_notifications, _whitelist, _handler, shouldHandleNotification) => {
            shouldHandleNotification({ id: undefined });
          },
        );

        renderObbNotifier({
          dispatchObbNotificationShown: dispatchObbNotificationShownSpy,
          notifications: [{ id: NotificationCode.MaxPayoutDailyLimit, type: "ERROR" }],
          validations: [],
        });

        expect(useNotificationShown).toHaveBeenCalledWith(
          [{ id: NotificationCode.MaxPayoutDailyLimit, type: "ERROR" }],
          [
            NotificationCode.AboveMaxStake,
            NotificationCode.BelowMinStake,
            NotificationCode.AboveMaxPayout,
            NotificationCode.IncrementOutOfRage,
            NotificationCode.InsufficientFunds,
            NotificationCode.MaxPayoutDailyLimit,
            NotificationCode.MaxPayoutInfo,
          ],
          expect.any(Function),
          expect.any(Function),
        );
      });

      describe("when validation succeeds and triggers notifications", () => {
        it("should dispatch handler", () => {
          const dispatchObbNotificationShownSpy = jest.fn();
          notificationValidator.mockReturnValueOnce(true);

          useNotificationShown.mockImplementationOnce((notifications, whitelist, handler, shouldHandleNotification) => {
            if (shouldHandleNotification(notifications[0], whitelist)) {
              handler("notification");
            }
          });

          renderObbNotifier({
            dispatchObbNotificationShown: dispatchObbNotificationShownSpy,
            notifications: [{ id: "123", type: NotificationCode.MaxPayoutDailyLimit }],
            validations: [{ type: NotificationCode.MaxPayoutDailyLimit, notification: { id: "123" } }],
          });

          expect(dispatchObbNotificationShownSpy).toHaveBeenCalledWith("notification");
        });
      });

      describe("when validation fails and does not trigger notifications", () => {
        it("should not dispatch handler", () => {
          const dispatchObbNotificationShownSpy = jest.fn();
          notificationValidator.mockReturnValueOnce(false);

          useNotificationShown.mockImplementationOnce((notifications, whitelist, handler, shouldHandleNotification) => {
            if (shouldHandleNotification(notifications[0], whitelist)) {
              handler("notification");
            }
          });

          renderObbNotifier({
            dispatchObbNotificationShown: dispatchObbNotificationShownSpy,
            notifications: [{ id: "123", type: NotificationCode.MaxPayoutDailyLimit }],
            validations: [{ type: "Invalid Type", notification: { id: "123" } }],
          });

          expect(dispatchObbNotificationShownSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe("when onNotificationUrlClickCallback executes", () => {
      it("should call the dispatchExternalPush and the dispatchObbMaxPayoutNotificationUrlClick", () => {
        const dispatchExternalPushSpy = jest.fn();
        const dispatchObbMaxPayoutNotificationUrlClickSpy = jest.fn();
        const url = "some url";

        renderObbNotifier({
          dispatchExternalPush: dispatchExternalPushSpy,
          dispatchObbMaxPayoutNotificationUrlClick: dispatchObbMaxPayoutNotificationUrlClickSpy,
          notifications: [{ id: NotificationCode.MaxPayoutInfo, url }],
        });

        act(() => {
          const { onAlertUrlClick } = BetslipNotifications.mock.calls[0][0];
          onAlertUrlClick(NotificationCode.MaxPayoutInfo, url);
        });

        expect(dispatchObbMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledTimes(1);
        expect(dispatchObbMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledWith(url);

        expect(dispatchExternalPushSpy).toHaveBeenCalledTimes(1);
        expect(dispatchExternalPushSpy).toHaveBeenCalledWith(url);
      });
    });

    describe("when onNotificationCloseCallback executes", () => {
      it("should call dispatchMaxPayoutNotificationAccepted", () => {
        const dispatchMaxPayoutNotificationAcceptedSpy = jest.fn();

        renderObbNotifier({
          dispatchMaxPayoutNotificationAccepted: dispatchMaxPayoutNotificationAcceptedSpy,
          notifications: [{ id: NotificationCode.MaxPayoutInfo }],
        });

        act(() => {
          const { onAlertClose } = BetslipNotifications.mock.calls[0][0];
          onAlertClose(NotificationCode.MaxPayoutInfo);
        });

        expect(dispatchMaxPayoutNotificationAcceptedSpy).toHaveBeenCalledTimes(1);
        expect(dispatchMaxPayoutNotificationAcceptedSpy).toHaveBeenCalledWith();
      });
    });
  });
});
