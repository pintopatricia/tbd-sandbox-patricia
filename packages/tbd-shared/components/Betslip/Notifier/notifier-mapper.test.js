import { VALIDATION_SEVERITIES, VALIDATION_TYPES } from "@ppb/betslip-core";
import { hasSpecialValidation, isTerritoryApplicableValidation } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { getSportsbookBettingValidations } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { AlertType } from "@ppb/the-wall-common/types";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";

import { getExternalLink } from "../../../helpers/external-links";
import { NotificationCode } from "../betslip-notification-code";

import {
  buildSportsbookValidation,
  createNotificationFromCombinationValidation,
  createNotificationFromGroupValidation,
  createValidationsSelector,
  mergeSportsbookValidation,
  NOTIFICATION_TYPES,
} from "./notifier-mapper";

import { getAboveMaxStakeNotification, getBelowMinStakeNotification } from "../../../helpers/notifier-helper";

jest.mock("../../../helpers/notifier-helper", () => {
  const { getAboveMaxStakeNotification, getBelowMinStakeNotification, ...actual } = jest.requireActual(
    "../../../helpers/notifier-helper",
  );

  return {
    ...actual,
    getAboveMaxStakeNotification: jest.fn(getAboveMaxStakeNotification),
    getBelowMinStakeNotification: jest.fn(getBelowMinStakeNotification),
  };
});

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({ jurisdiction: { jurisdiction: "INTERNATIONAL" } }),
}));
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingValidations: jest.fn().mockReturnValue({}),
  getSportsbookBettingState: jest.fn().mockReturnValue({ combinations: {} }),
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

describe("Notifier Mapper", () => {
  beforeEach(jest.clearAllMocks);

  describe("createNotificationFromCombinationValidation", () => {
    const userDetails = {
      locale: "en_GB",
      jurisdiction: {
        jurisdiction: "INTERNATIONAL",
      },
    };

    function setupValidation(validation) {
      const baseValidation = {
        ...validation,
        data: {
          ...validation?.data,
        },
      };

      const combination = {
        minStakeIncrement: 1,
      };

      return {
        validation: baseValidation,
        userDetails,
        combination,
      };
    }

    describe("when there is a BELOW_MIN_STAKE validation", () => {
      it("should return a BELOW_MIN_STAKE notification", () => {
        const { validation, userDetails } = setupValidation({
          type: VALIDATION_TYPES.BELOW_MIN_STAKE,
          data: {
            min: "min",
            max: "max",
            suggestedStake: "suggestedStake",
          },
        });

        const notification = createNotificationFromCombinationValidation(validation, userDetails);

        expect(getBelowMinStakeNotification).toHaveBeenCalledWith(validation.data.min, userDetails);

        expect(notification).toEqual({
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
        const { validation, userDetails } = setupValidation({
          type: VALIDATION_TYPES.ABOVE_MAX_STAKE,

          data: {
            min: "min",
            max: "max",
            suggestedStake: "suggestedStake",
          },
        });

        const notification = createNotificationFromCombinationValidation(validation, userDetails);

        expect(getAboveMaxStakeNotification).toHaveBeenCalledWith(validation.data.max, userDetails);

        expect(notification).toEqual({
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
        const { validation, userDetails } = setupValidation({ type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT });

        expect(createNotificationFromCombinationValidation(validation, userDetails)).toEqual({
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
        const { validation, userDetails, combination } = setupValidation({
          type: VALIDATION_TYPES.INCREMENT_OUT_OF_RANGE,
        });

        expect(createNotificationFromCombinationValidation(validation, userDetails, combination)).toEqual({
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

        expect(createNotificationFromCombinationValidation(validation, userDetails)).toEqual(null);
      });
    });
  });

  describe("createNotificationFromGroupValidation", () => {
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
          type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
          severity: "ERROR",
        });

        expect(createNotificationFromGroupValidation(validation, userDetails)).toEqual({
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
          type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
          severity: VALIDATION_SEVERITIES.WARNING,
        });

        const notification = createNotificationFromGroupValidation(validation, userDetails);

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

        expect(createNotificationFromGroupValidation(validation, userDetails)).toEqual(null);
      });
    });
  });

  describe("buildSportsbookValidation", () => {
    function setupCombinationValidation(combinationValidation) {
      const baseValidation = {
        ...combinationValidation,
        validation: {
          type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
          ...combinationValidation?.validation,
        },
      };
      return {
        combinationValidation: baseValidation,
      };
    }

    describe("when there is no notification", () => {
      it("should return a SportsbookValidation without a notification", () => {
        const { combinationValidation } = setupCombinationValidation();

        expect(buildSportsbookValidation(combinationValidation, null)).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
          notification: null,
        });
      });
    });

    describe("when there is a notification without items", () => {
      it("should return a SportsbookValidation without a notification", () => {
        const { combinationValidation } = setupCombinationValidation();

        expect(buildSportsbookValidation(combinationValidation, { items: null })).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
          notification: null,
        });
      });
    });

    describe("when there is a notification with items", () => {
      it("should return a SportsbookValidation with the notification", () => {
        const { combinationValidation } = setupCombinationValidation({ id: "ID:1" });

        expect(buildSportsbookValidation(combinationValidation, { items: ["x"] })).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
          notification: { id: "ID:1", items: ["x"] },
        });
      });
    });
  });

  describe("mergeSportsbookValidation", () => {
    describe("when there is no notification in the A portion", () => {
      it("should return notification as null", () => {
        const mergedValidation = mergeSportsbookValidation(
          {
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
            notification: null,
          },
          {
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
            notification: { id: "ID:1", items: ["x"] },
          },
        );

        expect(mergedValidation).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
          notification: null,
        });
      });
    });

    describe("when there is no notification in the B portion", () => {
      it("should return notification as null but retain other properties", () => {
        const mergedValidation = mergeSportsbookValidation(
          {
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
            notification: null,
          },
          {
            type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
            notification: { id: "ID:1", items: ["x"] },
          },
        );

        expect(mergedValidation).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
          notification: null,
        });
      });
    });

    describe("when there is no notification items in the A portion", () => {
      it("should return notification items as undefined", () => {
        const mergedValidation = mergeSportsbookValidation(
          {
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
            notification: { id: "ID:1" },
          },
          {
            type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
            notification: { id: "ID:1", items: ["x"] },
          },
        );

        expect(mergedValidation).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
          notification: { id: "ID:1", items: undefined },
        });
      });
    });

    describe("when there is no notification items in the B portion", () => {
      it("should return notification items as undefined", () => {
        const mergedValidation = mergeSportsbookValidation(
          {
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
            notification: { id: "ID:1", items: ["x"] },
          },
          {
            type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
            notification: { id: "ID:1" },
          },
        );

        expect(mergedValidation).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
          notification: { id: "ID:1", items: undefined },
        });
      });
    });

    describe("when merging B into A", () => {
      it("should retain properties from B where possible and combine items", () => {
        const mergedValidation = mergeSportsbookValidation(
          {
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
            notification: { id: "ID:1", items: ["X"] },
          },
          {
            type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
            notification: { id: "ID:1", items: ["Y"], detail: "Some Detail" },
          },
        );

        expect(mergedValidation).toEqual({
          type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
          notification: { id: "ID:1", items: ["X", "Y"], detail: "Some Detail" },
        });
      });
    });
  });

  describe("createValidationsSelector", () => {
    describe("when a validation can be grouped", () => {
      it("should return the correct notification", () => {
        getUserDetails.mockReturnValue({ jurisdiction: { jurisdiction: Jurisdiction.ITALY } });
        getSportsbookBettingValidations.mockReturnValue({
          combinations: {
            "ID:1": [
              { type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT, data: { max: 100 } },
              { type: VALIDATION_TYPES.ABOVE_MAX_STAKE, data: { max: 3 } },
            ],
          },
          group: [],
        });
        isTerritoryApplicableValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([
          {
            type: "ABOVE_MAX_STAKE",
            notification: {
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
              id: "ID:1",
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
        getSportsbookBettingValidations.mockReturnValue({
          combinations: {
            "ID:1": [{ type: VALIDATION_TYPES.BELOW_MIN_STAKE, data: { min: 1 } }],
            "ID:2": [{ type: VALIDATION_TYPES.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
          group: [
            {
              type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "ERROR",
            },
          ],
        });
        isTerritoryApplicableValidation.mockReturnValue(true);
        hasSpecialValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([
          {
            type: VALIDATION_TYPES.ABOVE_MAX_STAKE,
            notification: {
              id: "ID:2",
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
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
            type: VALIDATION_TYPES.BELOW_MIN_STAKE,
            notification: {
              id: "ID:1",
              gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
              type: "ERROR",
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
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
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
        getSportsbookBettingValidations.mockReturnValueOnce({
          combinations: {
            "ID:1": [{ type: VALIDATION_TYPES.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
          group: [
            {
              type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "ERROR",
            },
          ],
        });
        hasSpecialValidation.mockReturnValueOnce(false);

        const result = createValidationsSelector()({}, {});

        expect(result).toEqual(
          expect.arrayContaining([expect.objectContaining({ type: VALIDATION_TYPES.ABOVE_MAX_STAKE })]),
        );
        expect(result).toEqual(
          expect.not.arrayContaining([expect.objectContaining({ type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT })]),
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
        getSportsbookBettingValidations.mockReturnValue({
          combinations: [],
          group: [
            {
              type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "ERROR",
            },
            {
              type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
              data: { max: 1 },
              severity: "WARNING",
            },
          ],
        });
        isTerritoryApplicableValidation.mockReturnValue(true);
        hasSpecialValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([
          {
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
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
            type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
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
        getSportsbookBettingValidations.mockReturnValue({
          combinations: {
            "ID:1": [{ type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT, data: { max: 3 } }],
          },
          group: [
            {
              type: VALIDATION_TYPES.ABOVE_MAX_PAYOUT,
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
        getSportsbookBettingValidations.mockReturnValue({
          combinations: {
            "ID:1": [{ type: VALIDATION_TYPES.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
        });
        isTerritoryApplicableValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([]);
      });
    });

    describe("when there are user details but they are offline details", () => {
      it("should not return notifications", () => {
        getUserDetails.mockReturnValue({});
        getSportsbookBettingValidations.mockReturnValue({
          combinations: {
            "ID:1": [{ type: VALIDATION_TYPES.ABOVE_MAX_STAKE, data: { max: 3 } }],
          },
        });
        isTerritoryApplicableValidation.mockReturnValue(true);

        expect(createValidationsSelector()({}, {})).toEqual([]);
      });
    });

    describe("when there are no validations", () => {
      it("should not return notifications", () => {
        getUserDetails.mockReturnValue({ jurisdiction: { jurisdiction: Jurisdiction.ITALY } });
        getSportsbookBettingValidations.mockReturnValue({ combinations: {}, group: [] });
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
          getSportsbookBettingValidations.mockReturnValue({ combinations: {}, group: [] });
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
          getSportsbookBettingValidations.mockReturnValue({ combinations: {}, group: [] });
          isTerritoryApplicableValidation.mockReturnValue(false);
          getBetslipCard.mockReturnValue({ showMaxPayoutNotification: true });

          expect(createValidationsSelector()({}, {})).toEqual([]);
        });
      });
    });
  });
});
