import { CountryCode } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Jurisdiction as JurisdictionMap } from "@ppb/tbd-store/state/constants";
import { AlertType } from "@ppb/the-wall-common/types";
import {
  isMaxPayoutNotificationSupported,
  getBelowMinStakeNotification,
  getAboveMaxStakeNotification,
  getAboveMaxPayoutNotification,
  getIncrementOutOfRangeNotification,
  getAboveMaxPayoutGroupErrorNotification,
  getAboveMaxPayoutGroupWarningNotification,
  getMaxPayoutNotification,
} from "./notifier-helper";
import { NotificationCode } from "../components/Betslip/betslip-notification-code";
import { i18n } from "./i18n";
import { getExternalLink } from "./external-links";

jest.mock("./i18n");
jest.mock("./external-links");

describe("notifier-helper", () => {
  const userDetails = {
    countryCode: CountryCode.PORTUGAL,
    jurisdiction: { jurisdiction: JurisdictionMap.INTERNATIONAL },
    localeCode: "en-GB",
  };

  beforeEach(() => {
    i18n.mockImplementation(({ key }) => key);
    getExternalLink.mockImplementation(() => "http://example.com");
  });

  describe("isMaxPayoutNotificationSupported", () => {
    it("should return false for unsupported countries", () => {
      const unsupportedUserDetails = { ...userDetails, countryCode: CountryCode.IRELAND };
      expect(isMaxPayoutNotificationSupported(unsupportedUserDetails)).toBe(false);
    });

    it("should return false for unsupported jurisdictions", () => {
      const unsupportedUserDetails = { ...userDetails, jurisdiction: { jurisdiction: JurisdictionMap.BRAZIL } };
      expect(isMaxPayoutNotificationSupported(unsupportedUserDetails)).toBe(false);
    });

    it("should return true for supported countries and jurisdictions", () => {
      expect(isMaxPayoutNotificationSupported(userDetails)).toBe(true);
    });
  });

  describe("getBelowMinStakeNotification", () => {
    it("should return the correct notification props", () => {
      const minValue = 5;
      const notification = getBelowMinStakeNotification(minValue, userDetails);
      expect(notification).toEqual({
        type: AlertType.Error,
        items: ["I18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE"],
        detail: "I18N.BETSLIP.TAP_TO_UPDATE",
        gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
        hasClickableAction: true,
      });
    });
  });

  describe("getAboveMaxStakeNotification", () => {
    it("should return the correct notification props", () => {
      const maxValue = 100;
      const notification = getAboveMaxStakeNotification(maxValue, userDetails);
      expect(notification).toEqual({
        type: AlertType.Error,
        items: ["I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE"],
        detail: "I18N.BETSLIP.TAP_TO_UPDATE",
        gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
        hasClickableAction: true,
      });
    });
  });

  describe("getAboveMaxPayoutNotification", () => {
    it("should return the correct notification props", () => {
      const maxValue = 1000;
      const notification = getAboveMaxPayoutNotification(maxValue, userDetails);
      expect(notification).toEqual({
        type: AlertType.Error,
        items: ["I18N.BETSLIP.VALIDATION_ABOVE_MAX_PAYOUT"],
        gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_ABOVE_MAX_PAYOUT",
      });
    });
  });

  describe("getIncrementOutOfRangeNotification", () => {
    it("should return the correct notification props", () => {
      const minStakeIncrement = 1;
      const notification = getIncrementOutOfRangeNotification(minStakeIncrement, userDetails);
      expect(notification).toEqual({
        type: AlertType.Error,
        items: ["I18N.BETSLIP.VALIDATION_INCREMENT_OUT_OF_RANGE"],
        gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_INCREMENT_OUT_OF_RANGE",
      });
    });
  });

  describe("getAboveMaxPayoutGroupErrorNotification", () => {
    it("should return the correct notification props", () => {
      const maxPayoutKey = "I18N.BETSLIP.MAX_PAYOUT";
      const notification = getAboveMaxPayoutGroupErrorNotification(userDetails, maxPayoutKey);
      expect(notification).toEqual({
        id: NotificationCode.MaxPayoutDailyLimit,
        type: AlertType.Error,
        items: ["I18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT"],
        detail: "I18N.BETSLIP.VALIDATION_PLEASE_REVIEW_YOUR_STAKE",
        gtmLabel: "ERRORI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
      });
    });
  });

  describe("getAboveMaxPayoutGroupWarningNotification", () => {
    it("should return the correct notification props", () => {
      const maxPayoutKey = "I18N.BETSLIP.MAX_PAYOUT";
      const notification = getAboveMaxPayoutGroupWarningNotification(userDetails, maxPayoutKey);
      expect(notification).toEqual({
        id: NotificationCode.MaxPayoutDailyLimit,
        type: AlertType.Warning,
        items: ["I18N.BETSLIP.VALIDATION_SPORT_MAX_PAYOUT_TITLE"],
        detail: "I18N.BETSLIP.VALIDATION_MAX_DAILY_PAYOUT_WARNING",
        extraDetailInfo: "I18N.BETSLIP.VALIDATION_SEE_TC_SHORT",
        url: "http://example.com",
        gtmLabel: "WARNINGI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
      });
    });
  });

  describe("getMaxPayoutNotification", () => {
    it("should return the correct notification props", () => {
      const notification = getMaxPayoutNotification(userDetails);
      expect(notification).toEqual({
        id: NotificationCode.MaxPayoutInfo,
        type: AlertType.Warning,
        message: "I18N.BETSLIP.GENERIC.PAYOUT.HEADER",
        detail: "I18N.BETSLIP.GENERIC.PAYOUT.DESCRIPTION",
        extraDetailInfo: "I18N.BETSLIP.VALIDATION_SEE_TC_SHORT",
        url: "http://example.com",
        dismissLabel: "I18N.BETSLIP.MAX.PAYOUT.ACCEPT",
        showCloseIcon: false,
      });
    });
  });
});
