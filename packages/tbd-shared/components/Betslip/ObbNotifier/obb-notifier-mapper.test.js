import { hasSpecialValidation, isTerritoryApplicableValidation } from "@ppb/tbd-store/helpers/obb-betting";
import { getObbBettingValidations } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { AlertType } from "@ppb/the-wall-common/types";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { ObbValidationSeverities, ObbValidationTypes } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";

import { getExternalLink } from "../../../helpers/external-links";
import { NotificationCode } from "../betslip-notification-code";

import {
  buildObbValidation,
  createNotificationFromPotentialBetValidation,
  createNotificationFromBetslipValidation,
  createValidationsSelector,
  mergeObbValidation,
  NOTIFICATION_TYPES,
} from "./obb-notifier-mapper";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({ jurisdiction: { jurisdiction: "INTERNATIONAL" } }),
}));
jest.mock("@ppb/tbd-store/helpers/obb-betting");
jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  getObbBettingValidations: jest.fn().mockReturnValue({}),
  getObbBettingState: jest.fn().mockReturnValue({ potentialBets: {} }),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
}));

jest.mock("../../../helpers/external-links", () => ({
  getExternalLink: jest.fn(() => "some max payout url"),
}));

jest.mock("@ppb/tbd-store", () => ({
  productConfiguration: {
    getPayoutLimit: jest.fn().mockReturnValue({ hardCapKey: "I18N.KEY" }),
  },
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));
jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(() => "formatted currency"),
}));

describe("Obb Notifier Mapper", () => {
  beforeEach(jest.clearAllMocks);

  describe("createNotificationFromPotentialBetValidation", () => {
    function setupValidation(validation) {
      const baseValidation = {
        ...validation,
        data: {
          ...validation?.data,
        },
      };
      const userDetails = {
        locale: "en_GB",
        jurisdiction: {
          jurisdiction: "INTERNATIONAL",
        },
      };
      const potentialBet = {
        minStakeIncrement: 1,
      };
      return {
        validation: baseValidation,
        userDetails,
        potentialBet,
      };
    }

    describe("when there is a BELOW_MIN_STAKE validation", () => {
      it("should return a BELOW_MIN_STAKE notification", () => {
        const { validation, userDetails } = setupValidation({ type: ObbValidationTypes.BELOW_MIN_STAKE });

        expect(createNotificationFromPotentialBetValidation(validation, userDetails)).toEqual({
          gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
          type: AlertType.Error,
          items: [
            {
              key: "I18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
              interpolationValues: { minStake: "formatted currency" },
            },
          ],
          detail: { key: "I18N.BETSLIP.TAP_TO_UPDATE" },
          hasClickableAction: true,
        });
      });
    });

    describe("when there is a ABOVE_MAX_STAKE validation", () => {
      it("should return a ABOVE_MAX_STAKE notification", () => {
        const { validation, userDetails } = setupValidation({ type: ObbValidationTypes.ABOVE_MAX_STAKE });

        expect(createNotificationFromPotentialBetValidation(validation, userDetails)).toEqual({
          gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
          type: AlertType.Error,
          items: [
            {
              key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
              interpolationValues: { maxStake: "formatted currency" },
            },
          ],
          detail: { key: "I18N.BETSLIP.TAP_TO_UPDATE" },
          hasClickableAction: true,
        });
      });
    });

    describe("when there is a ABOVE_MAX_PAYOUT validation", () => {
      it("should return a ABOVE_MAX_PAYOUT notification", () => {
        const { validation, userDetails } = setupValidation({ type: ObbValidationTypes.ABOVE_MAX_PAYOUT });

        expect(createNotificationFromPotentialBetValidation(validation, userDetails)).toEqual({
          gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_PAYOUT",
          type: AlertType.Error,
          items: [
            {
              key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_PAYOUT",
              interpolationValues: { maxPayout: "formatted currency" },
            },
          ],
        });
      });
    });

    describe("when there is a INCREMENT_OUT_OF_RANGE validation", () => {
      it("should return a INCREMENT_OUT_OF_RANGE notification", () => {
        const { validation, userDetails, potentialBet } = setupValidation({
          type: ObbValidationTypes.INCREMENT_OUT_OF_RANGE,
        });

        expect(createNotificationFromPotentialBetValidation(validation, userDetails, potentialBet)).toEqual({
          gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_INCREMENT_OUT_OF_RANGE",
          type: AlertType.Error,
          items: [
            {
              key: "I18N.BETSLIP.VALIDATION_INCREMENT_OUT_OF_RANGE",
              interpolationValues: {
                increment: "formatted currency",
              },
            },
          ],
        });
      });
    });

    describe("when there is a an unknown validation", () => {
      it("should return null", () => {
        const { validation, userDetails } = setupValidation({ type: "SOMETHING" });

        expect(createNotificationFromPotentialBetValidation(validation, userDetails)).toEqual(null);
      });
    });
  });

  describe("createNotificationFromBetslipValidation", () => {
    function setupValidation(validation) {
      return {
        validation: {
          ...validation,
          data: {
            ...validation?.data,
          },
          severity: validation.severity,
        },
        userDetails: {
          currencyCode: "USD",
          localeCode: "en",
          jurisdiction: {
            jurisdiction: "INTERNATIONAL",
          },
        },
      };
    }

    describe("when there is a ABOVE_MAX_PAYOUT error validation", () => {
      it("should return a ABOVE_MAX_PAYOUT notification", () => {
        const { validation, userDetails } = setupValidation({
          type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
          severity: "ERROR",
        });

        expect(createNotificationFromBetslipValidation(validation, userDetails)).toEqual({
          type: AlertType.Error,
          id: NotificationCode.MaxPayoutDailyLimit,
          items: [
            {
              key: "I18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
              interpolationValues: {
                maxPayout: { key: "I18N.KEY" },
              },
            },
          ],
          detail: {
            key: "I18N.BETSLIP.VALIDATION_PLEASE_REVIEW_YOUR_STAKE",
          },
          gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
        });
      });
    });

    describe("when there is a ABOVE_MAX_PAYOUT warning validation", () => {
      it("should return a ABOVE_MAX_PAYOUT notification", () => {
        const { validation, userDetails } = setupValidation({
          type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
          severity: ObbValidationSeverities.WARNING,
        });

        const notification = createNotificationFromBetslipValidation(validation, userDetails);

        expect(getExternalLink).toHaveBeenCalledWith("MAX_PAYOUT", "INTERNATIONAL", "en");
        expect(getExternalLink).toHaveBeenCalledTimes(1);

        expect(notification).toEqual({
          type: AlertType.Warning,
          id: NotificationCode.MaxPayoutDailyLimit,
          items: [
            {
              key: "I18N.BETSLIP.VALIDATION_SPORT_MAX_PAYOUT_TITLE",
            },
          ],
          detail: {
            key: "I18N.BETSLIP.VALIDATION_MAX_DAILY_PAYOUT_WARNING",
            interpolationValues: {
              maxPayout: { key: "I18N.KEY" },
            },
          },
          extraDetailInfo: {
            key: "I18N.BETSLIP.VALIDATION_SEE_TC_SHORT",
          },
          url: "some max payout url",
          gtmLabel: "WARNINGI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
        });
      });
    });

    describe("when there is a an unknown validation", () => {
      it("should return null", () => {
        const { validation, userDetails } = setupValidation({ type: "SOMETHING" });

        expect(createNotificationFromBetslipValidation(validation, userDetails)).toEqual(null);
      });
    });
  });

  describe("buildObbValidation", () => {
    function setupPotentialBetValidation(potentialBetValidation) {
      const baseValidation = {
        ...potentialBetValidation,
        validation: {
          type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
          ...potentialBetValidation?.validation,
        },
      };
      return {
        potentialBetValidation: baseValidation,
      };
    }

    describe("when there is no notification", () => {
      it("should return a ObbValidation without a notification", () => {
        const { potentialBetValidation } = setupPotentialBetValidation();

        expect(buildObbValidation(potentialBetValidation, null)).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
          notification: null,
        });
      });
    });

    describe("when there is a notification without items", () => {
      it("should return a ObbValidation without a notification", () => {
        const { potentialBetValidation } = setupPotentialBetValidation();

        expect(buildObbValidation(potentialBetValidation, { items: null })).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
          notification: null,
        });
      });
    });

    describe("when there is a notification with items", () => {
      it("should return a ObbValidation with the notification", () => {
        const { potentialBetValidation } = setupPotentialBetValidation({ id: "potentialBet:1" });

        expect(buildObbValidation(potentialBetValidation, { items: ["x"] })).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
          notification: { id: "potentialBet:1", items: ["x"] },
        });
      });
    });
  });

  describe("mergeObbValidation", () => {
    describe("when there is no notification in the A portion", () => {
      it("should return notification as null", () => {
        const mergedValidation = mergeObbValidation(
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: null,
          },
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: { id: "potentialBet:1", items: ["x"] },
          },
        );

        expect(mergedValidation).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
          notification: null,
        });
      });
    });

    describe("when there is no notification in the B portion", () => {
      it("should return notification as null but retain other properties", () => {
        const mergedValidation = mergeObbValidation(
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: null,
          },
          {
            type: ObbValidationTypes.ABOVE_MAX_STAKE,
            notification: { id: "potentialBet:1", items: ["x"] },
          },
        );

        expect(mergedValidation).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_STAKE,
          notification: null,
        });
      });
    });

    describe("when there is no notification items in the A portion", () => {
      it("should return notification items as undefined", () => {
        const mergedValidation = mergeObbValidation(
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: { id: "potentialBet:1" },
          },
          {
            type: ObbValidationTypes.ABOVE_MAX_STAKE,
            notification: { id: "potentialBet:1", items: ["x"] },
          },
        );

        expect(mergedValidation).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_STAKE,
          notification: { id: "potentialBet:1", items: undefined },
        });
      });
    });

    describe("when there is no notification items in the B portion", () => {
      it("should return notification items as undefined", () => {
        const mergedValidation = mergeObbValidation(
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: { id: "potentialBet:1", items: ["x"] },
          },
          {
            type: ObbValidationTypes.ABOVE_MAX_STAKE,
            notification: { id: "potentialBet:1" },
          },
        );

        expect(mergedValidation).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_STAKE,
          notification: { id: "potentialBet:1", items: undefined },
        });
      });
    });

    describe("when merging B into A", () => {
      it("should retain properties from B where possible and combine items", () => {
        const mergedValidation = mergeObbValidation(
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: { id: "potentialBet:1", items: ["X"] },
          },
          {
            type: ObbValidationTypes.ABOVE_MAX_STAKE,
            notification: { id: "potentialBet:1", items: ["Y"], detail: "Some Detail" },
          },
        );

        expect(mergedValidation).toEqual({
          type: ObbValidationTypes.ABOVE_MAX_STAKE,
          notification: { id: "potentialBet:1", items: ["X", "Y"], detail: "Some Detail" },
        });
      });
    });
  });

  describe("createValidationsSelector", () => {
    describe("when a validation can be grouped", () => {
      it("should return the correct notification", () => {
        getUserDetails.mockReturnValue({ jurisdiction: { jurisdiction: Jurisdiction.ITALY } });
        getObbBettingValidations.mockReturnValue({
          potentialBets: {
            "potentialBet:1": [
              { type: ObbValidationTypes.ABOVE_MAX_PAYOUT, data: { max: 100 } },
              { type: ObbValidationTypes.ABOVE_MAX_STAKE, data: { max: 3 } },
            ],
          },
          betslip: [],
        });
        isTerritoryApplicableValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([
          {
            type: "ABOVE_MAX_STAKE",
            notification: {
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
              id: "potentialBet:1",
              type: "ERROR",
              items: [
                {
                  key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_PAYOUT",
                  interpolationValues: {
                    maxPayout: "formatted currency",
                  },
                },
                {
                  key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
                  interpolationValues: {
                    maxStake: "formatted currency",
                  },
                },
              ],
              detail: {
                key: "I18N.BETSLIP.TAP_TO_UPDATE",
              },
              hasClickableAction: true,
            },
          },
        ]);
      });
    });

    describe("when no grouping is possible", () => {
      it("should return the correct separate notifications", () => {
        getUserDetails.mockReturnValue({ jurisdiction: { jurisdiction: Jurisdiction.ITALY }, countryCode: "GB" });
        getObbBettingValidations.mockReturnValue({
          potentialBets: {
            "potentialBet:1": [{ type: ObbValidationTypes.BELOW_MIN_STAKE, data: { min: 1 } }],
            "potentialBet:2": [{ type: ObbValidationTypes.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
          betslip: [
            {
              type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "ERROR",
            },
          ],
        });
        isTerritoryApplicableValidation.mockReturnValue(true);
        hasSpecialValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([
          {
            type: ObbValidationTypes.ABOVE_MAX_STAKE,
            notification: {
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
              id: "potentialBet:2",
              type: "ERROR",
              items: [
                {
                  key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
                  interpolationValues: {
                    maxStake: "formatted currency",
                  },
                },
              ],
              detail: {
                key: "I18N.BETSLIP.TAP_TO_UPDATE",
              },
              hasClickableAction: true,
            },
          },
          {
            type: ObbValidationTypes.BELOW_MIN_STAKE,
            notification: {
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
              type: "ERROR",
              id: "potentialBet:1",
              items: [
                {
                  key: "I18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
                  interpolationValues: {
                    minStake: "formatted currency",
                  },
                },
              ],
              detail: {
                key: "I18N.BETSLIP.TAP_TO_UPDATE",
              },
              hasClickableAction: true,
            },
          },
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: {
              id: NotificationCode.MaxPayoutDailyLimit,
              type: "ERROR",
              items: [
                {
                  key: "I18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
                  interpolationValues: {
                    maxPayout: { key: "I18N.KEY" },
                  },
                },
              ],
              detail: {
                key: "I18N.BETSLIP.VALIDATION_PLEASE_REVIEW_YOUR_STAKE",
              },
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
            },
          },
        ]);
      });
    });

    describe("when there is ABOVE_MAX_PAYOUT and ABOVE_MAX_STAKE", () => {
      it("should return the correct notifications without ABOVE_MAX_PAYOUT notification", () => {
        getObbBettingValidations.mockReturnValueOnce({
          potentialBets: {
            "potentialBet:2": [{ type: ObbValidationTypes.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
          betslip: [
            {
              type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "ERROR",
            },
          ],
        });
        hasSpecialValidation.mockReturnValueOnce(false);

        const result = createValidationsSelector()({}, {});

        expect(result).toEqual(
          expect.arrayContaining([expect.objectContaining({ type: ObbValidationTypes.ABOVE_MAX_STAKE })]),
        );
        expect(result).toEqual(
          expect.not.arrayContaining([expect.objectContaining({ type: ObbValidationTypes.ABOVE_MAX_PAYOUT })]),
        );
      });
    });

    describe("when jurisdiction is brazil", () => {
      it("should display a different error message", () => {
        getUserDetails.mockReturnValue({
          jurisdiction: { jurisdiction: Jurisdiction.BRAZIL },
          countryCode: "BR",
          currencyCode: "BRL",
        });
        getObbBettingValidations.mockReturnValue({
          potentialBets: [],
          betslip: [
            {
              type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "ERROR",
            },
            {
              type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "WARNING",
            },
          ],
        });
        isTerritoryApplicableValidation.mockReturnValue(true);
        hasSpecialValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: {
              id: NotificationCode.MaxPayoutDailyLimit,
              type: "ERROR",
              items: [
                {
                  key: "I18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT.BRAZIL",
                  interpolationValues: {
                    maxPayout: {
                      key: "I18N.KEY",
                      interpolationValues: undefined,
                    },
                  },
                },
              ],
              detail: {
                key: "I18N.BETSLIP.VALIDATION_PLEASE_REVIEW_YOUR_STAKE",
                interpolationValues: undefined,
              },
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT.BRAZIL",
            },
          },
          {
            type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
            notification: {
              id: NotificationCode.MaxPayoutDailyLimit,
              items: [
                {
                  interpolationValues: undefined,
                  key: "I18N.BETSLIP.VALIDATION_SPORT_MAX_PAYOUT_TITLE.BRAZIL",
                },
              ],
              type: AlertType.Warning,
              detail: {
                key: "I18N.BETSLIP.VALIDATION_MAX_DAILY_PAYOUT_WARNING.BRAZIL",
                interpolationValues: {
                  maxPayout: {
                    interpolationValues: undefined,
                    key: "I18N.KEY",
                  },
                },
              },
              extraDetailInfo: {
                interpolationValues: undefined,
                key: "I18N.BETSLIP.VALIDATION_SEE_TC_SHORT",
              },
              url: "some max payout url",
              gtmLabel: "WARNINGI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT.BRAZIL",
            },
          },
        ]);
      });
    });

    describe("when there are restricted validations", () => {
      it("should not return it", () => {
        getUserDetails.mockReturnValue({
          jurisdiction: { jurisdiction: Jurisdiction.INTERNATIONAL },
          countryCode: "PT",
        });
        getObbBettingValidations.mockReturnValue({
          potentialBets: {
            "potentialBet:1": [{ type: ObbValidationTypes.ABOVE_MAX_PAYOUT, data: { max: 3 } }],
          },
          betslip: [
            {
              type: ObbValidationTypes.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "ERROR",
            },
          ],
        });
        isTerritoryApplicableValidation.mockReturnValue(false);
        hasSpecialValidation.mockReturnValue(false);

        expect(createValidationsSelector()({}, {})).toEqual([]);
      });
    });

    describe("when there are no user details", () => {
      it("should not return notifications", () => {
        getUserDetails.mockReturnValue(null);
        getObbBettingValidations.mockReturnValue({
          potentialBets: {
            "potentialBet:1": [{ type: ObbValidationTypes.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
        });
        isTerritoryApplicableValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([]);
      });
    });

    describe("when there are user details but they are offline details", () => {
      it("should not return notifications", () => {
        getUserDetails.mockReturnValue({});
        getObbBettingValidations.mockReturnValue({
          potentialBets: {
            "potentialBet:1": [{ type: ObbValidationTypes.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
        });
        isTerritoryApplicableValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([]);
      });
    });

    describe("when there are no validations", () => {
      it("should not return notifications", () => {
        getUserDetails.mockReturnValue({ jurisdiction: { jurisdiction: Jurisdiction.ITALY } });
        getObbBettingValidations.mockReturnValue({ potentialBets: {}, betslip: [] });
        isTerritoryApplicableValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([]);
      });
    });

    describe("when the max payout notification can be shown", () => {
      describe("when it is a supported jurisdiction or country", () => {
        it("should return the correct notification", () => {
          getUserDetails.mockReturnValue({
            jurisdiction: { jurisdiction: "SPAIN" },
            countryCode: "ES",
            localeCode: "es",
          });
          getObbBettingValidations.mockReturnValue({ potentialBets: {}, betslip: [] });
          isTerritoryApplicableValidation.mockReturnValue(false);
          getBetslipCard.mockReturnValue({ showMaxPayoutNotification: true });

          expect(createValidationsSelector()({}, {})).toEqual([
            {
              type: NOTIFICATION_TYPES.MAX_PAYOUT,
              notification: {
                id: NotificationCode.MaxPayoutInfo,
                type: AlertType.Warning,
                message: { key: "I18N.BETSLIP.GENERIC.PAYOUT.HEADER" },
                detail: { key: "I18N.BETSLIP.GENERIC.PAYOUT.DESCRIPTION" },
                extraDetailInfo: { key: "I18N.BETSLIP.VALIDATION_SEE_TC_SHORT" },
                url: "some max payout url",
                dismissLabel: { key: "I18N.BETSLIP.MAX.PAYOUT.ACCEPT" },
                showCloseIcon: false,
              },
            },
          ]);
        });
      });
      describe("when it is not a supported jurisdiction or country", () => {
        it("should not return the notification", () => {
          getUserDetails.mockReturnValue({
            jurisdiction: { jurisdiction: "SPAIN" },
            countryCode: "GB",
            localeCode: "en_GB",
          });
          getObbBettingValidations.mockReturnValue({ potentialBets: {}, betslip: [] });
          isTerritoryApplicableValidation.mockReturnValue(false);
          getBetslipCard.mockReturnValue({ showMaxPayoutNotification: true });

          expect(createValidationsSelector()({}, {})).toEqual([]);
        });
      });
    });
  });
});
