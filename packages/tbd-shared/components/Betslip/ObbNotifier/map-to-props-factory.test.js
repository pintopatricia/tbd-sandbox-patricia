import { BETTING__OBB_VALIDATE_STAKE } from "@ppb/tbd-store/actions/betting";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { AlertType } from "@ppb/the-wall-common/types";
import {
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  UI__BETSLIP_OBB_NOTIFICATION_SHOWN,
  UI__BETSLIP_OBB_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import { EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createValidationsSelector } from "./obb-notifier-mapper";
import { createGetObbIsDepositRequiredSelector } from "../betslip-mapper";

import { i18n } from "../../../helpers/i18n";
import { buildObbFailuresNotifications, createAvailabilityNotificationSelector } from "../connected-obb-betslip-mapper";
import { NotificationCode } from "../betslip-notification-code";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/helpers/obb-betting");
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  getPreferences: jest.fn().mockReturnValue({}),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue({ potentialBets: {} }),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));
jest.mock("./obb-notifier-mapper", () => ({
  createValidationsSelector: jest.fn().mockReturnValue(() => []),
}));

jest.mock("../betslip-mapper", () => ({
  createGetObbIsDepositRequiredSelector: jest.fn().mockReturnValue(() => false),
}));

jest.mock("../connected-obb-betslip-mapper", () => ({
  buildObbFailuresNotifications: jest.fn().mockReturnValue(undefined),
  createAvailabilityNotificationSelector: jest.fn().mockReturnValue(() => undefined),
}));

const APP_STATE = {
  betslip: {
    obbOddsMovement: {},
  },
  entities: {
    throttles: {},
  },
};

const setupMapStateToProps = ({
  appState = APP_STATE,
  validationsBuilder = jest.fn(() => []),
  oddsMovementBuilder = jest.fn(() => []),
  availabilityFailuresBuilder = jest.fn(() => undefined),
  isDepositRequired = false,
} = {}) => {
  createValidationsSelector.mockReturnValue(validationsBuilder);
  createOddsMovementSelector.mockReturnValue(oddsMovementBuilder);
  createGetObbIsDepositRequiredSelector.mockReturnValue(() => isDepositRequired);
  createAvailabilityNotificationSelector.mockReturnValue(availabilityFailuresBuilder);

  return makeMapStateToProps()(appState);
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("notifications", () => {
    describe("when I have high priority notifications", () => {
      it("should return notifications with validations", () => {
        const validationsBuilder = jest.fn(() => [
          { type: "ABOVE_MAX_PAYOUT", notification: { type: "warning", items: ["message"] } },
        ]);
        const { notifications } = setupMapStateToProps({ validationsBuilder });

        expect(notifications).toEqual([{ items: ["message"], type: "warning" }]);
      });
    });

    describe("when I have low priority notifications", () => {
      describe("when I have an odds movement and availability failures", () => {
        it("should return notifications with odds movement and availability notification", () => {
          const { notifications } = setupMapStateToProps({
            oddsMovementBuilder: jest.fn(() => ({
              selection1: { id: "selection1", movement: "up" },
              selection2: { id: "selection2", movement: "down" },
            })),
            availabilityFailuresBuilder: jest.fn(() => ({
              message: { key: "I18N.BETSLIP.OBB.OUTCOME_DEFINITION_SUSPENDED" },
              type: AlertType.Warning,
              id: NotificationCode.Availability,
            })),
          });
          expect(notifications).toEqual([
            {
              id: NotificationCode.OddsAvailability,
              message: {
                interpolationValues: undefined,
                key: "I18N.BETSLIP.ODDS_AVAILABILITY_NOTIFICATION",
              },
              type: "WARNING",
            },
          ]);
        });
      });

      describe("when I have availability failures", () => {
        it("should return notifications with availability notification", () => {
          const { notifications } = setupMapStateToProps({
            availabilityFailuresBuilder: jest.fn(() => ({
              message: { key: "I18N.BETSLIP.OBB.OUTCOME_DEFINITION_SUSPENDED" },
              type: AlertType.Warning,
              id: NotificationCode.Availability,
            })),
          });
          expect(notifications).toEqual([
            {
              id: NotificationCode.Availability,
              message: { key: "I18N.BETSLIP.OBB.OUTCOME_DEFINITION_SUSPENDED" },
              type: "WARNING",
            },
          ]);
        });
      });

      describe("when I have an odds movement", () => {
        it("should return notifications with odds movement notification", () => {
          const { notifications } = setupMapStateToProps({
            oddsMovementBuilder: jest.fn(() => ({
              selection1: { id: "selection1", movement: "up" },
              selection2: { id: "selection2", movement: "down" },
            })),
          });
          expect(notifications).toEqual([
            {
              id: NotificationCode.OddsChanged,
              message: { key: "I18N.BETSLIP.ODDS_CHANGE_NOTIFICATION" },
              type: "INFO",
            },
          ]);
        });
      });
    });

    describe("when I have failure notifications", () => {
      it("should return notifications with failure notification", () => {
        buildObbFailuresNotifications.mockReturnValueOnce([{ type: AlertType.Error, message: "message" }]);
        const { notifications } = setupMapStateToProps({});
        expect(notifications).toEqual([{ type: AlertType.Error, message: "message" }]);
      });
    });

    describe("when isDepositRequired is true", () => {
      it("should return notification with insufficient funds error at the start of the array", () => {
        const { notifications } = setupMapStateToProps({
          oddsMovementBuilder: jest.fn(() => ({
            selection1: { id: "selection1", movement: "up" },
            selection2: { id: "selection2", movement: "down" },
          })),
          isDepositRequired: true,
        });

        expect(notifications).toEqual([
          {
            id: NotificationCode.InsufficientFunds,
            message: i18n({ key: "I18N.BETSLIP.OBB.ERROR.INSUFFICIENT_FUNDS" }),
            type: AlertType.Error,
            gtmLabel: "ERRORI18N.BETSLIP.OBB.ERROR.INSUFFICIENT_FUNDS",
          },
          {
            id: NotificationCode.OddsChanged,
            message: { interpolationValues: undefined, key: "I18N.BETSLIP.ODDS_CHANGE_NOTIFICATION" },
            type: "INFO",
          },
        ]);
      });
    });

    describe("when I do not have notifications", () => {
      it("should return an empty array", () => {
        const { notifications } = setupMapStateToProps({});
        expect(notifications).toEqual([]);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should map dispatchObbValidateStake", () => {
    const { dispatchObbValidateStake } = mapDispatchToProps(jest.fn());

    expect(dispatchObbValidateStake).toBeDefined();
  });

  describe("dispatchObbValidateStake", () => {
    it("should dispatch a betting validation action when dispatchObbValidateStake is called", () => {
      const dispatch = jest.fn();
      const { dispatchObbValidateStake } = mapDispatchToProps(dispatch);

      dispatchObbValidateStake("potentialBet:1");

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__OBB_VALIDATE_STAKE,
        payload: { potentialBetId: "potentialBet:1" },
      });
    });
  });

  it("should map dispatchObbNotificationShown", () => {
    const { dispatchObbNotificationShown } = mapDispatchToProps(jest.fn());

    expect(dispatchObbNotificationShown).toBeDefined();
  });

  describe("dispatchObbNotificationShown", () => {
    it("should dispatch a NotificationShownAction when dispatchObbNotificationShown is called", () => {
      const dispatch = jest.fn();
      const { dispatchObbNotificationShown } = mapDispatchToProps(dispatch);

      dispatchObbNotificationShown("label");

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_OBB_NOTIFICATION_SHOWN,
        payload: { label: "label" },
      });
    });
  });

  it("should map dispatchObbMaxPayoutNotificationUrlClick", () => {
    const { dispatchObbMaxPayoutNotificationUrlClick } = mapDispatchToProps(jest.fn());

    expect(dispatchObbMaxPayoutNotificationUrlClick).toBeDefined();
  });

  describe("dispatchObbMaxPayoutNotificationUrlClick", () => {
    it("should dispatch a MaxPayoutNotificationUrlClickAction when dispatchObbMaxPayoutNotificationUrlClick is called", () => {
      const dispatch = jest.fn();
      const { dispatchObbMaxPayoutNotificationUrlClick } = mapDispatchToProps(dispatch);

      dispatchObbMaxPayoutNotificationUrlClick("url");

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_OBB_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
        payload: { url: "url" },
      });
    });
  });

  it("should map dispatchExternalPush", () => {
    const { dispatchExternalPush } = mapDispatchToProps(jest.fn());

    expect(dispatchExternalPush).toBeDefined();
  });

  describe("dispatchExternalPush", () => {
    it("should dispatch a ExternalPushAction when dispatchExternalPush is called", () => {
      const dispatch = jest.fn();
      const { dispatchExternalPush } = mapDispatchToProps(dispatch);

      dispatchExternalPush("url");

      expect(dispatch).toHaveBeenCalledWith({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "url",
          gtmData: {
            label: "I18N.BETSLIP.VALIDATION_SEE_TC_FOR_MORE_INFO",
            moduleName: "betslip",
          },
        },
      });
    });
  });

  it("should map dispatchMaxPayoutNotificationAccepted", () => {
    const { dispatchMaxPayoutNotificationAccepted } = mapDispatchToProps(jest.fn());

    expect(dispatchMaxPayoutNotificationAccepted).toBeDefined();
  });

  describe("dispatchMaxPayoutNotificationAccepted", () => {
    it("should dispatch a BetslipMaxPayoutNotificationAcceptedAction when dispatchMaxPayoutNotificationAccepted is called", () => {
      const dispatch = jest.fn();
      const { dispatchMaxPayoutNotificationAccepted } = mapDispatchToProps(dispatch);

      dispatchMaxPayoutNotificationAccepted();

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
      });
    });
  });
});
