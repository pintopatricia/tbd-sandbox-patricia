import { Alerts } from "@ppb/the-wall-native";
import { render } from "@testing-library/react-native";
import { NotificationCode } from "../betslip-notification-code";
import { Notifier } from "./Notifier.native";
import { useNotificationShown, notificationValidator } from "../../../helpers/useNotificationShown";

jest.mock("@ppb/the-wall-native", () => ({
  Alerts: jest.fn(() => <alerts-mock />),
}));

jest.mock("../../../helpers/useNotificationShown");

function renderNotifier({
  style = {},
  notifications = [],
  validations = [],
  dispatchSportsbookValidateStake = jest.fn(),
  dispatchSportsbookNotificationShown = jest.fn(),
  dispatchSportsbookMaxPayoutNotificationUrlClick = jest.fn(),
  dispatchMaxPayoutNotificationAccepted = jest.fn(),
} = {}) {
  return render(
    <Notifier
      style={style}
      notifications={notifications}
      validations={validations}
      dispatchSportsbookValidateStake={dispatchSportsbookValidateStake}
      dispatchSportsbookNotificationShown={dispatchSportsbookNotificationShown}
      dispatchSportsbookMaxPayoutNotificationUrlClick={dispatchSportsbookMaxPayoutNotificationUrlClick}
      dispatchMaxPayoutNotificationAccepted={dispatchMaxPayoutNotificationAccepted}
    />,
  );
}

describe("ConnectedNotifier", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are no notifications", () => {
    it("should not call Alerts", () => {
      const dispatchSportsbookValidateStakeSpy = jest.fn();
      renderNotifier({ dispatchSportsbookValidateStake: dispatchSportsbookValidateStakeSpy });

      expect(Alerts).not.toHaveBeenCalled();
    });
  });

  describe("when there are notifications", () => {
    it("should call Alerts", () => {
      const dispatchSportsbookValidateStakeSpy = jest.fn();

      renderNotifier({
        dispatchSportsbookValidateStake: dispatchSportsbookValidateStakeSpy,
        notifications: ["something"],
      });

      expect(Alerts).toHaveBeenCalledWith(
        {
          alerts: ["something"],
          onAlertClick: dispatchSportsbookValidateStakeSpy,
          onAlertUrlClick: expect.any(Function),
          onAlertClose: expect.any(Function),
        },
        undefined,
      );
    });

    describe("useNotificationShown", () => {
      it("should call useNotificationShown", () => {
        const dispatchNotificationShownSpy = jest.fn();

        useNotificationShown.mockImplementationOnce(
          (_notifications, _whitelist, _handler, shouldHandleNotification) => {
            shouldHandleNotification({ id: undefined });
          },
        );

        renderNotifier({
          dispatchSportsbookNotificationShown: dispatchNotificationShownSpy,
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
          const dispatchNotificationShownSpy = jest.fn();

          notificationValidator.mockReturnValueOnce(true);
          useNotificationShown.mockImplementationOnce((notifications, whitelist, handler, shouldHandleNotification) => {
            if (shouldHandleNotification(notifications[0], whitelist)) {
              handler("notification");
            }
          });

          renderNotifier({
            dispatchSportsbookNotificationShown: dispatchNotificationShownSpy,
            notifications: [{ id: "123", type: NotificationCode.MaxPayoutDailyLimit }],
            validations: [{ type: NotificationCode.MaxPayoutDailyLimit, notification: { id: "123" } }],
          });

          expect(dispatchNotificationShownSpy).toHaveBeenCalledWith("notification");
        });
      });

      describe("when validation fails and does not trigger notifications", () => {
        it("should not dispatch handler", () => {
          const dispatchNotificationShownSpy = jest.fn();

          notificationValidator.mockReturnValueOnce(false);
          useNotificationShown.mockImplementationOnce((notifications, whitelist, handler, shouldHandleNotification) => {
            if (shouldHandleNotification(notifications[0], whitelist)) {
              handler("notification");
            }
          });

          renderNotifier({
            dispatchSportsbookNotificationShown: dispatchNotificationShownSpy,
            notifications: [{ id: "123", type: NotificationCode.MaxPayoutDailyLimit }],
            validations: [{ type: "Invalid Type", notification: { id: "123" } }],
          });

          expect(dispatchNotificationShownSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe("when onNotificationUrlClickCallback executes", () => {
      describe("when notification has id MAX_PAYOUT_INFO or MAX_PAYOUT_DAILY_LIMIT", () => {
        it("should call the dispatchSportsbookMaxPayoutNotificationUrlClick", () => {
          const dispatchSportsbookMaxPayoutNotificationUrlClickSpy = jest.fn();
          const url = "some url";

          renderNotifier({
            dispatchSportsbookMaxPayoutNotificationUrlClick: dispatchSportsbookMaxPayoutNotificationUrlClickSpy,
            notifications: [{ id: NotificationCode.MaxPayoutInfo, url }],
          });

          Alerts.mock.calls[0][0].onAlertUrlClick(NotificationCode.MaxPayoutInfo, url);

          expect(dispatchSportsbookMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledTimes(1);
          expect(dispatchSportsbookMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledWith(url);
        });
      });
      describe("when the notification has any other id", () => {
        it("should not call the dispatchSportsbookMaxPayoutNotificationUrlClick", () => {
          const dispatchSportsbookMaxPayoutNotificationUrlClickSpy = jest.fn();
          const url = "some url";

          renderNotifier({
            dispatchSportsbookMaxPayoutNotificationUrlClick: dispatchSportsbookMaxPayoutNotificationUrlClickSpy,
            notifications: [{ id: NotificationCode.NotCombinable, url }],
          });

          Alerts.mock.calls[0][0].onAlertUrlClick(NotificationCode.NotCombinable, url);

          expect(dispatchSportsbookMaxPayoutNotificationUrlClickSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe("when onNotificationCloseCallback executes", () => {
      describe("when the notification has id MAX_PAYOUT_INFO", () => {
        it("should call the dispatchMaxPayoutNotificationAccepted", async () => {
          const dispatchMaxPayoutNotificationAcceptedSpy = jest.fn();

          renderNotifier({
            dispatchMaxPayoutNotificationAccepted: dispatchMaxPayoutNotificationAcceptedSpy,
            notifications: [{ id: NotificationCode.MaxPayoutInfo }],
          });

          Alerts.mock.calls[0][0].onAlertClose(NotificationCode.MaxPayoutInfo);

          expect(dispatchMaxPayoutNotificationAcceptedSpy).toHaveBeenCalledTimes(1);
          expect(dispatchMaxPayoutNotificationAcceptedSpy).toHaveBeenCalledWith();
        });
      });
      describe("when the notification has any other id", () => {
        it("should not call the dispatchMaxPayoutNotificationAccepted", () => {
          const dispatchMaxPayoutNotificationAcceptedSpy = jest.fn();

          renderNotifier({
            dispatchMaxPayoutNotificationAccepted: dispatchMaxPayoutNotificationAcceptedSpy,
            notifications: [{ id: NotificationCode.NotCombinable }],
          });

          Alerts.mock.calls[0][0].onAlertClose(NotificationCode.NotCombinable);

          expect(dispatchMaxPayoutNotificationAcceptedSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
