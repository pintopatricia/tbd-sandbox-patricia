import { BETTING__SBK_VALIDATE_STAKE } from "@ppb/tbd-store/actions/betting";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { AlertType } from "@ppb/the-wall-common/types";
import {
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  UI__BETSLIP_SBK_NOTIFICATION_SHOWN,
  UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import { EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import {
  buildSportsbookTransactionalError,
  createAvailabilityNotificationSelector,
} from "../connected-sportsbook-betslip-mapper";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createValidationsSelector } from "./notifier-mapper";
import { createGetSbkIsDepositRequiredSelector } from "../betslip-mapper";

import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";

import { i18n } from "../../../helpers/i18n";
import { NotificationCode } from "../betslip-notification-code";
import { RUNNER_FAILURE_CODES } from "@ppb/betslip-core";
import { getAllUniqueRunnersFailures } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  getPreferences: jest.fn().mockReturnValue({}),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationAvailability: jest.fn().mockReturnValue(false),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue({ combinations: {} }),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));

jest.mock("./notifier-mapper", () => ({
  createValidationsSelector: jest.fn().mockReturnValue(() => []),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn().mockReturnValue(() => false),
}));

jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  createAvailabilityNotificationSelector: jest.fn().mockReturnValue(() => undefined),
  buildSportsbookTransactionalError: jest.fn(),
}));

jest.mock("../betslip-mapper", () => ({
  createGetSbkIsDepositRequiredSelector: jest.fn().mockReturnValue(() => false),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getAllUniqueRunnersFailures: jest.fn().mockReturnValue([]),
}));

const APP_STATE = {
  betslip: {
    sportsbookOddsMovement: {},
    sportsbookHandicapMovement: {},
  },
  entities: {
    throttles: {},
  },
};

const setupMapStateToProps = ({
  appState = APP_STATE,
  validationsBuilder = jest.fn(() => []),
  oddsMovementBuilder = jest.fn(() => []),
  isDepositRequired = false,
} = {}) => {
  createValidationsSelector.mockReturnValue(validationsBuilder);
  createOddsMovementSelector.mockReturnValue(oddsMovementBuilder);
  createGetSbkIsDepositRequiredSelector.mockReturnValue(() => isDepositRequired);

  return makeMapStateToProps(appState)(appState);
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
      buildSportsbookTransactionalError.mockReturnValue();

      describe("when I have an odds movement", () => {
        describe("when sbg_betslip_error_message brand setting is not set", () => {
          it("should return notification with odds movement notification", () => {
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
        describe("when sbg_betslip_error_message brand setting is set to true", () => {
          it("should not return notification with odds movement notification", () => {
            const { notifications } = setupMapStateToProps({
              oddsMovementBuilder: jest.fn(() => ({
                selection1: { id: "selection1", movement: "up" },
                selection2: { id: "selection2", movement: "down" },
              })),
              appState: {
                ...APP_STATE,
                entities: { ...APP_STATE.entities, brandSettings: { SBG_BETSLIP_ERROR_MESSAGE: true } },
              },
            });
            expect(notifications).toEqual([]);
          });
        });
      });

      describe("when I have an availability change", () => {
        it("should return notification regarding availability", () => {
          const buildAvailabilityNotificationSpy = jest.fn(() => "availabilityNotification");
          createAvailabilityNotificationSelector.mockReturnValueOnce(buildAvailabilityNotificationSpy);

          const { notifications } = setupMapStateToProps({});
          expect(notifications).toEqual(["availabilityNotification"]);
        });
      });

      describe("when I have a handicap movement", () => {
        it("should return notification with handicap movement notification", () => {
          getBetslipCard.mockReturnValueOnce({ sportsbookHandicapMovement: { 123: { hasHandicapChanged: true } } });
          const { notifications } = setupMapStateToProps({});
          expect(notifications).toEqual([
            {
              id: NotificationCode.HandicapChanged,
              message: { key: "I18N.BETSLIP.HANDICAP_CHANGE_NOTIFICATION" },
              type: "INFO",
            },
          ]);
        });
      });

      describe("when I have an odds and handicap movement", () => {
        it("should return notification with odds and handicap movement notification", () => {
          getBetslipCard.mockReturnValueOnce({ sportsbookHandicapMovement: { 123: { hasHandicapChanged: true } } });

          const { notifications } = setupMapStateToProps({
            oddsMovementBuilder: jest.fn(() => ({
              selection1: { id: "selection1", movement: "up" },
              selection2: { id: "selection2", movement: "down" },
            })),
          });
          expect(notifications).toEqual([
            {
              id: NotificationCode.OddsHandicap,
              message: { key: "I18N.BETSLIP.ODDS_HANDICAP_CHANGE_NOTIFICATION" },
              type: "INFO",
            },
          ]);
        });
      });

      describe("when I have an odds movement and availability change", () => {
        it("should return notification with odds movement and availability change notification", () => {
          const buildAvailabilityNotificationSpy = jest.fn(() => "availabilityNotification");
          createAvailabilityNotificationSelector.mockReturnValueOnce(buildAvailabilityNotificationSpy);

          const { notifications } = setupMapStateToProps({
            oddsMovementBuilder: jest.fn(() => ({
              selection1: { id: "selection1", movement: "up" },
              selection2: { id: "selection2", movement: "down" },
            })),
          });
          expect(notifications).toEqual([
            {
              id: NotificationCode.OddsAvailability,
              message: { key: "I18N.BETSLIP.ODDS_AVAILABILITY_NOTIFICATION" },
              type: "WARNING",
            },
          ]);
        });
      });

      describe("when I have a handicap movement and availability change", () => {
        it("should return notification with handicap movement and availability change notification", () => {
          const buildAvailabilityNotificationSpy = jest.fn(() => "availabilityNotification");
          createAvailabilityNotificationSelector.mockReturnValueOnce(buildAvailabilityNotificationSpy);

          getBetslipCard.mockReturnValueOnce({ sportsbookHandicapMovement: { 123: { hasHandicapChanged: true } } });

          const { notifications } = setupMapStateToProps({});
          expect(notifications).toEqual([
            {
              id: NotificationCode.HandicapAvailability,
              message: { key: "I18N.BETSLIP.AVAILABILITY_HANDICAP_NOTIFICATION" },
              type: "WARNING",
            },
          ]);
        });
      });

      describe("when I have an odds and handicap movement and availability change", () => {
        it("should return notification with odds and handicap movement and availability change notification", () => {
          const buildAvailabilityNotificationSpy = jest.fn(() => "availabilityNotification");
          createAvailabilityNotificationSelector.mockReturnValueOnce(buildAvailabilityNotificationSpy);

          getBetslipCard.mockReturnValueOnce({ sportsbookHandicapMovement: { 123: { hasHandicapChanged: true } } });

          const { notifications } = setupMapStateToProps({
            oddsMovementBuilder: jest.fn(() => ({
              selection1: { id: "selection1", movement: "up" },
              selection2: { id: "selection2", movement: "down" },
            })),
          });
          expect(notifications).toEqual([
            {
              id: NotificationCode.OddsHandicapAvailability,
              message: { key: "I18N.BETSLIP.ODDS_AVAILABILITY_HANDICAP_NOTIFICATION" },
              type: "WARNING",
            },
          ]);
        });
      });
    });

    describe("when isDepositRequired is true", () => {
      describe("when sbg_betslip_error_message brand setting is not set", () => {
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
              message: i18n({ key: "I18N.BETSLIP.SBK.ERROR.INSUFFICIENT_FUNDS" }),
              type: AlertType.Error,
              gtmLabel: "ERRORI18N.BETSLIP.SBK.ERROR.INSUFFICIENT_FUNDS",
            },
            {
              id: NotificationCode.OddsChanged,
              message: { key: "I18N.BETSLIP.ODDS_CHANGE_NOTIFICATION" },
              type: "INFO",
            },
          ]);
        });
      });

      describe("when sbg_betslip_error_message brand setting is set to true", () => {
        it("should return notification with funds required error at the start of the array", () => {
          const { notifications } = setupMapStateToProps({
            oddsMovementBuilder: jest.fn(() => ({
              selection1: { id: "selection1", movement: "up" },
              selection2: { id: "selection2", movement: "down" },
            })),
            isDepositRequired: true,
            appState: {
              ...APP_STATE,
              entities: { ...APP_STATE.entities, brandSettings: { SBG_BETSLIP_ERROR_MESSAGE: true } },
            },
          });

          expect(notifications).toEqual([
            {
              id: NotificationCode.InsufficientFunds,
              message: i18n({ key: "I18N.BETSLIP.ERROR.FUNDS_REQUIRED" }),
              detail: i18n({ key: "I18N.BETSLIP.ERROR.PLEASE_DEPOSIT" }),
              type: AlertType.Info,
              gtmLabel: `${AlertType.Error}I18N.BETSLIP.ERROR.FUNDS_REQUIRED`,
            },
          ]);
        });
      });
    });

    describe("when I have a transactional error", () => {
      it("should return notifications with transactional error", () => {
        buildSportsbookTransactionalError.mockReturnValueOnce("transactionalError");

        const { notifications } = setupMapStateToProps({});
        expect(notifications).toEqual(["transactionalError"]);
      });

      describe("when ODDS_MOVEMENT_ALERT_SWITCH is active", () => {
        it("should suppress transactional error when all runner failures are REQUESTED_PRICE_NOT_AVAILABLE", () => {
          getAllUniqueRunnersFailures.mockReturnValueOnce([
            RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE,
            RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE,
          ]);

          const appState = {
            ...APP_STATE,
            entities: {
              ...APP_STATE.entities,
              throttles: { ODDS_MOVEMENT_ALERT_SWITCH: { isActive: true } },
            },
          };

          const { notifications } = setupMapStateToProps({ appState });
          expect(notifications).toEqual([]);
          expect(buildSportsbookTransactionalError).not.toHaveBeenCalled();
        });

        it("should not suppress transactional error when runner failures include other codes", () => {
          buildSportsbookTransactionalError.mockReturnValueOnce("transactionalError");
          getAllUniqueRunnersFailures.mockReturnValueOnce([
            RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE,
            "SOME_OTHER_FAILURE",
          ]);

          const appState = {
            ...APP_STATE,
            entities: {
              ...APP_STATE.entities,
              throttles: { ODDS_MOVEMENT_ALERT_SWITCH: { isActive: true } },
            },
          };

          const { notifications } = setupMapStateToProps({ appState });
          expect(notifications).toEqual(["transactionalError"]);
        });
      });

      describe("when ODDS_MOVEMENT_ALERT_SWITCH is not active", () => {
        it("should not suppress transactional error even if all failures are REQUESTED_PRICE_NOT_AVAILABLE", () => {
          buildSportsbookTransactionalError.mockReturnValueOnce("transactionalError");
          getAllUniqueRunnersFailures.mockReturnValueOnce([RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE]);

          const appState = {
            ...APP_STATE,
            entities: {
              ...APP_STATE.entities,
              throttles: { ODDS_MOVEMENT_ALERT_SWITCH: { isActive: false } },
            },
          };

          const { notifications } = setupMapStateToProps({ appState });
          expect(notifications).toEqual(["transactionalError"]);
        });
      });
    });

    describe("when I do not have notifications", () => {
      it("should return an empty array", () => {
        const { notifications } = setupMapStateToProps({});
        expect(notifications).toEqual([]);
      });
    });

    describe("when in CONFIRM_POTENTIAL step", () => {
      it("should return an empty array", () => {
        createIsConfirmStep.mockReturnValueOnce(jest.fn(() => true));
        const { notifications } = setupMapStateToProps();

        expect(notifications).toEqual([]);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should map dispatchSportsbookValidateStake", () => {
    const { dispatchSportsbookValidateStake } = mapDispatchToProps(jest.fn());

    expect(dispatchSportsbookValidateStake).toBeDefined();
  });

  describe("dispatchSportsbookValidateStake", () => {
    it("should dispatch a betting validation action when dispatchSportsbookValidateStake is called", () => {
      const dispatch = jest.fn();
      const { dispatchSportsbookValidateStake } = mapDispatchToProps(dispatch);

      dispatchSportsbookValidateStake("COMB:1");

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__SBK_VALIDATE_STAKE,
        payload: { combinationId: "COMB:1" },
      });
    });
  });

  it("should map dispatchSportsbookNotificationShown", () => {
    const { dispatchSportsbookNotificationShown } = mapDispatchToProps(jest.fn());

    expect(dispatchSportsbookNotificationShown).toBeDefined();
  });

  describe("dispatchSportsbookNotificationShown", () => {
    it("should dispatch a NotificationShownAction when dispatchSportsbookNotificationShown is called", () => {
      const dispatch = jest.fn();
      const { dispatchSportsbookNotificationShown } = mapDispatchToProps(dispatch);

      dispatchSportsbookNotificationShown("label");

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_NOTIFICATION_SHOWN,
        payload: { label: "label" },
      });
    });
  });

  it("should map dispatchSportsbookMaxPayoutNotificationUrlClick", () => {
    const { dispatchSportsbookMaxPayoutNotificationUrlClick } = mapDispatchToProps(jest.fn());

    expect(dispatchSportsbookMaxPayoutNotificationUrlClick).toBeDefined();
  });

  describe("dispatchSportsbookMaxPayoutNotificationUrlClick", () => {
    it("should dispatch a MaxPayoutNotificationUrlClickAction when dispatchSportsbookMaxPayoutNotificationUrlClick is called", () => {
      const dispatch = jest.fn();
      const { dispatchSportsbookMaxPayoutNotificationUrlClick } = mapDispatchToProps(dispatch);

      dispatchSportsbookMaxPayoutNotificationUrlClick("url");

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
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
