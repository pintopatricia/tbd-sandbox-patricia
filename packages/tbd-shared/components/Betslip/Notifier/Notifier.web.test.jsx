import { BetslipNotifications } from "@ppb/the-wall-web";
import { act, render } from "@testing-library/react";
import { useContext } from "react";
import { NotificationCode } from "../betslip-notification-code";
import { Notifier } from "./Notifier.web";
import { useNotificationShown, notificationValidator } from "../../../helpers/useNotificationShown";
import { KeyboardProvider } from "../Keyboard/KeyboardContext";

jest.mock("@ppb/the-wall-web", () => ({
  BetslipNotifications: jest.fn(() => <notifications-mock />),
}));

jest.mock("../../../helpers/useNotificationShown");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

const mockFocusedTargetRef = {
  current: {
    scrollIntoView: jest.fn(),
  },
};

function renderNotifier({
  className = "x",
  notifications = [],
  isBetslipCollapsed = false,
  validations = [],
  shouldHandleNotificationShownAsException = jest.fn(),
  dispatchSportsbookValidateStake = jest.fn(),
  dispatchSportsbookNotificationShown = jest.fn(),
  dispatchExternalPush = jest.fn(),
  dispatchMaxPayoutNotificationAccepted = jest.fn(),
  dispatchSportsbookMaxPayoutNotificationUrlClick = jest.fn(),
} = {}) {
  return render(
    <KeyboardProvider>
      <Notifier
        className={className}
        isBetslipCollapsed={isBetslipCollapsed}
        notifications={notifications}
        validations={validations}
        shouldHandleNotificationShownAsException={shouldHandleNotificationShownAsException}
        dispatchSportsbookValidateStake={dispatchSportsbookValidateStake}
        dispatchSportsbookNotificationShown={dispatchSportsbookNotificationShown}
        dispatchExternalPush={dispatchExternalPush}
        dispatchMaxPayoutNotificationAccepted={dispatchMaxPayoutNotificationAccepted}
        dispatchSportsbookMaxPayoutNotificationUrlClick={dispatchSportsbookMaxPayoutNotificationUrlClick}
      />
    </KeyboardProvider>,
  );
}

describe("ConnectedNotifier", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContext.mockImplementation(() => ({
      focusedKeyboardControls: {
        focusedTargetRef: mockFocusedTargetRef,
      },
    }));
  });

  describe("when there are no notifications", () => {
    it("should not call BetslipNotifications", () => {
      const dispatchSportsbookValidateStakeSpy = jest.fn();
      renderNotifier({ dispatchSportsbookValidateStake: dispatchSportsbookValidateStakeSpy });

      expect(BetslipNotifications).not.toHaveBeenCalled();
    });
  });

  describe("when there are notifications", () => {
    it("should call BetslipNotifications", () => {
      const dispatchSportsbookValidateStakeSpy = jest.fn();

      renderNotifier({
        dispatchSportsbookValidateStake: dispatchSportsbookValidateStakeSpy,
        notifications: ["something"],
      });

      expect(BetslipNotifications).toHaveBeenCalledWith(
        {
          alerts: ["something"],
          onAlertClick: dispatchSportsbookValidateStakeSpy,
          onAlertUrlClick: expect.any(Function),
          onAlertClose: expect.any(Function),
        },
        undefined,
      );
    });

    it("should calls scrollIntoView on focused element if betslip is not collapsed", () => {
      renderNotifier({
        notifications: ["something"],
      });

      expect(mockFocusedTargetRef.current.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest",
      });
    });

    it("should not call scrollIntoView on focused element if betslip is collapsed", () => {
      renderNotifier({
        notifications: ["something"],
        isBetslipCollapsed: true,
      });

      expect(mockFocusedTargetRef.current.scrollIntoView).not.toHaveBeenCalled();
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
      it("should call the dispatchExternalPush and the dispatchSportsbookMaxPayoutNotificationUrlClick", async () => {
        const dispatchExternalPushSpy = jest.fn();
        const dispatchSportsbookMaxPayoutNotificationUrlClickSpy = jest.fn();
        const url = "some url";

        renderNotifier({
          dispatchExternalPush: dispatchExternalPushSpy,
          dispatchSportsbookMaxPayoutNotificationUrlClick: dispatchSportsbookMaxPayoutNotificationUrlClickSpy,
          notifications: [{ id: NotificationCode.MaxPayoutInfo, url }],
        });

        act(() => {
          const { onAlertUrlClick } = BetslipNotifications.mock.calls[0][0];
          onAlertUrlClick(NotificationCode.MaxPayoutInfo, url);
        });

        expect(dispatchSportsbookMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSportsbookMaxPayoutNotificationUrlClickSpy).toHaveBeenCalledWith(url);

        expect(dispatchExternalPushSpy).toHaveBeenCalledTimes(1);
        expect(dispatchExternalPushSpy).toHaveBeenCalledWith(url);
      });
    });

    describe("when onNotificationCloseCallback executes", () => {
      it("should call the dispatchMaxPayoutNotificationAccepted", async () => {
        const dispatchMaxPayoutNotificationAcceptedSpy = jest.fn();

        renderNotifier({
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
