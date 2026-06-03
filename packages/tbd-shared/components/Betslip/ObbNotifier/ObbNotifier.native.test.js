import { Alerts } from "@ppb/the-wall-native";
import { render } from "@testing-library/react-native";
import { NotificationCode } from "../betslip-notification-code";
import { ObbNotifier } from "./ObbNotifier.native";
import { useNotificationShown, notificationValidator } from "../../../helpers/useNotificationShown";

jest.mock("@ppb/the-wall-native", () => ({
  Alerts: jest.fn(() => <alerts-mock />),
}));

jest.mock("../../../helpers/useNotificationShown");

function renderObbNotifier({
  style = {},
  notifications = [],
  validations = [],
  dispatchObbValidateStake = jest.fn(),
  dispatchObbNotificationShown = jest.fn(),
  dispatchObbMaxPayoutNotificationUrlClick = jest.fn(),
  dispatchMaxPayoutNotificationAccepted = jest.fn(),
} = {}) {
  return render(
    <ObbNotifier
      style={style}
      notifications={notifications}
      validations={validations}
      dispatchObbValidateStake={dispatchObbValidateStake}
      dispatchObbNotificationShown={dispatchObbNotificationShown}
      dispatchObbMaxPayoutNotificationUrlClick={dispatchObbMaxPayoutNotificationUrlClick}
      dispatchMaxPayoutNotificationAccepted={dispatchMaxPayoutNotificationAccepted}
    />,
  );
}

describe("ConnectedObbNotifier", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are no notifications", () => {
    it("should not call Notifications", () => {
      const dispatchObbValidateStakeSpy = jest.fn();
      renderObbNotifier({ dispatchObbValidateStake: dispatchObbValidateStakeSpy });

      expect(Alerts).not.toHaveBeenCalled();
    });
  });

  describe("when there are notifications", () => {
    it("should call Notifications", () => {
      const dispatchObbValidateStakeSpy = jest.fn();

      renderObbNotifier({
        dispatchObbValidateStake: dispatchObbValidateStakeSpy,
        notifications: ["something"],
      });

      expect(Alerts).toHaveBeenCalledWith(
        {
          alerts: ["something"],
          onAlertClick: dispatchObbValidateStakeSpy,
          onAlertUrlClick: expect.any(Function),
          onAlertClose: expect.any(Function),
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
      describe("when notification has id MAX_PAYOUT_INFO or MAX_PAYOUT_DAILY_LIMIT", () => {
        it("should call the dispatchObbMaxPayoutNotificationUrlClick", () => {
          const dispatchObbMaxPayoutNotificationUrlClickSpy = jest.fn();
          const url = "url";

          renderObbNotifier({
            dispatchObbMaxPayoutNotificationUrlClick: dispatchObbMaxPayoutNotificationUrlClickSpy,
            notifications: [{ id: NotificationCode.MaxPayoutInfo, url }],
          });

          Alerts.mock.calls[0][0].onAlertUrlClick(NotificationCode.MaxPayoutInfo, url);

          expect(dispatchObbMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledTimes(1);
          expect(dispatchObbMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledWith(url);
        });
      });
      describe("when the notification has any other id", () => {
        it("should not call the dispatchObbMaxPayoutNotificationUrlClick", () => {
          const dispatchObbMaxPayoutNotificationUrlClickSpy = jest.fn();
          const url = "url";

          renderObbNotifier({
            dispatchObbMaxPayoutNotificationUrlClick: dispatchObbMaxPayoutNotificationUrlClickSpy,
            notifications: [{ id: NotificationCode.OddsChanged, url }],
          });

          Alerts.mock.calls[0][0].onAlertUrlClick(NotificationCode.OddsChanged, url);

          expect(dispatchObbMaxPayoutNotificationUrlClickSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe("when onNotificationCloseCallback executes", () => {
      describe("when notification has id MAX_PAYOUT_INFO", () => {
        it("should call the dispatchMaxPayoutNotificationAccepted", () => {
          const dispatchMaxPayoutNotificationAcceptedSpy = jest.fn();

          renderObbNotifier({
            dispatchMaxPayoutNotificationAccepted: dispatchMaxPayoutNotificationAcceptedSpy,
            notifications: [{ id: NotificationCode.MaxPayoutInfo }],
          });

          Alerts.mock.calls[0][0].onAlertClose(NotificationCode.MaxPayoutInfo);

          expect(dispatchMaxPayoutNotificationAcceptedSpy).toHaveBeenCalledTimes(1);
          expect(dispatchMaxPayoutNotificationAcceptedSpy).toHaveBeenCalledWith();
        });
      });

      describe("when notification has any other id", () => {
        it("should not call the dispatchMaxPayoutNotificationAccepted", () => {
          const dispatchMaxPayoutNotificationAcceptedSpy = jest.fn();

          renderObbNotifier({
            dispatchMaxPayoutNotificationAccepted: dispatchMaxPayoutNotificationAcceptedSpy,
            notifications: [{ id: NotificationCode.InsufficientFunds }],
          });

          Alerts.mock.calls[0][0].onAlertClose(NotificationCode.InsufficientFunds);

          expect(dispatchMaxPayoutNotificationAcceptedSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
