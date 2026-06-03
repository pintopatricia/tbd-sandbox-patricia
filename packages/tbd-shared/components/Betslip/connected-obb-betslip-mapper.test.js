import {
  getObbBettingPotentialBets,
  getObbCombinedLegFailures,
  getObbCombinedPotentialBetFailures,
  getObbLegFailures,
  getObbPotentialBetFailures,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { getObbErrorCode } from "@ppb/tbd-store/helpers/obb-betting";
import { AlertType } from "@ppb/the-wall-common/types";
import {
  createAvailabilityNotificationSelector,
  buildObbFailuresNotifications,
  createGetAvailabilityFailuresOnStakedBetsSelector,
} from "./connected-obb-betslip-mapper";
import { NotificationCode } from "./betslip-notification-code";
import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  getObbLegFailures: jest.fn(),
  getObbPotentialBetFailures: jest.fn(),
  getObbBetslipFailure: jest.fn(),
  getObbBettingPotentialBets: jest.fn(),
  getObbCombinedPotentialBetFailures: jest.fn(),
  getObbCombinedLegFailures: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/obb-betting", () => ({
  getAllUniqueLegFailures: jest.fn(),
  getAllUniquePotentialBetFailures: jest.fn(),
  getObbErrorCode: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));

describe("connected-obb-betslip-mapper", () => {
  describe("createAvailabilityNotificationSelector", () => {
    it("should return a notification for OUTCOME_DEFINITION_SUSPENDED", () => {
      getObbLegFailures.mockReturnValue({ leg1: "OUTCOME_DEFINITION_SUSPENDED" });

      const selector = createAvailabilityNotificationSelector();
      const result = selector({});

      expect(result).toEqual({
        id: NotificationCode.Availability,
        type: AlertType.Warning,
        message: i18n({ key: "I18N.BETSLIP.OBB.OUTCOME_DEFINITION_SUSPENDED" }),
      });
    });

    it("should return a notification for EVENT_SUSPENDED", () => {
      getObbLegFailures.mockReturnValue({ leg1: "EVENT_SUSPENDED" });

      const selector = createAvailabilityNotificationSelector();
      const result = selector({});

      expect(result).toEqual({
        id: NotificationCode.Availability,
        type: AlertType.Warning,
        message: i18n({ key: "I18N.BETSLIP.OBB.EVENT_SUSPENDED" }),
      });
    });

    it("should return undefined if no relevant failures", () => {
      getObbLegFailures.mockReturnValue({ leg1: "OTHER_FAILURE" });

      const selector = createAvailabilityNotificationSelector();
      const result = selector({});

      expect(result).toBeUndefined();
    });
  });

  describe("buildObbFailuresNotifications", () => {
    it("should return a notification if there are failures and no availability failures", () => {
      getObbLegFailures.mockReturnValueOnce({
        leg1: "SOME_ERROR_CODE",
        leg2: "OTHER_ERROR_CODE",
        leg3: "IMPOSSIBLE_OBB_CHOICE",
      });

      getObbPotentialBetFailures.mockReturnValueOnce({
        "SINGLE:[legId1]": "SOME_ERROR_CODE",
        "SINGLE:[legId2]": "OTHER_ERROR_CODE",
        "SINGLE:[legId3]": "IMPOSSIBLE_OBB_CHOICE",
      });

      getObbCombinedLegFailures.mockReturnValueOnce({ leg3: "IMPOSSIBLE_OBB_CHOICE" });

      getObbCombinedPotentialBetFailures.mockReturnValueOnce({
        "SINGLE:[legId3]": "IMPOSSIBLE_OBB_CHOICE",
      });

      getObbErrorCode.mockReturnValue(["SOME_ERROR_CODE", "OTHER_ERROR_CODE"]);

      const appState = {};
      const result = buildObbFailuresNotifications(appState);

      expect(result).toEqual([
        {
          id: NotificationCode.TransactionalError,
          type: AlertType.Error,
          message: i18n({ key: "I18N.BETSLIP.OBB.ERROR.SOME_ERROR_CODE" }),
        },
        {
          id: NotificationCode.TransactionalError,
          message: i18n({
            key: "I18N.BETSLIP.OBB.ERROR.OTHER_ERROR_CODE",
          }),
          type: AlertType.Error,
        },
      ]);
    });

    it("should return undefined if there is no obb errorCode", () => {
      getObbLegFailures.mockReturnValueOnce({});
      getObbPotentialBetFailures.mockReturnValueOnce({});
      getObbCombinedLegFailures.mockReturnValueOnce({});
      getObbCombinedPotentialBetFailures.mockReturnValueOnce({});

      getObbErrorCode.mockReturnValue(null);

      const appState = {};
      const result = buildObbFailuresNotifications(appState);

      expect(result).toBeUndefined();
    });

    it("should return an empty array if there are availability failures", () => {
      getObbLegFailures.mockReturnValueOnce({});
      getObbPotentialBetFailures.mockReturnValueOnce({});
      getObbCombinedLegFailures.mockReturnValueOnce({});
      getObbCombinedPotentialBetFailures.mockReturnValueOnce({});

      getObbErrorCode.mockReturnValue(["EVENT_SUSPENDED"]);

      const appState = {};
      const result = buildObbFailuresNotifications(appState);

      expect(result).toEqual([]);
    });
  });

  describe("createGetAvailabilityFailuresOnStakedBetsSelector", () => {
    describe("when there are no failures", () => {
      it("should return false", () => {
        getObbBettingPotentialBets.mockReturnValue({ "potentialBet:urn:1": { stake: 1, legs: ["leg:urn:1"] } });
        getObbLegFailures.mockReturnValue({});

        const selector = createGetAvailabilityFailuresOnStakedBetsSelector();
        const result = selector({});

        expect(result).toBe(false);
      });
    });

    describe("when there are failures", () => {
      it("should return true", () => {
        getObbBettingPotentialBets.mockReturnValue({ "potentialBet:urn:1": { stake: 1, legs: ["leg:urn:1"] } });
        getObbLegFailures.mockReturnValue({ "leg:urn:1": "EVENT_SUSPENDED" });

        const selector = createGetAvailabilityFailuresOnStakedBetsSelector();
        const result = selector({});

        expect(result).toBe(true);
      });
    });
  });
});
