import { CountryCode, UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Jurisdiction as JurisdictionMap } from "@ppb/tbd-store/state/constants";
import { AlertProps, AlertType } from "@ppb/the-wall-common/types";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";
import { i18n } from "./i18n";
import { TranslationKey } from "../translations/keys";
import { NotificationCode } from "../components/Betslip/betslip-notification-code";
import { getExternalLink } from "./external-links";

const UNSUPPORTED_MAX_PAYOUT_COUNTRIES = [CountryCode.IRELAND, CountryCode.UNITED_KINGDOM];
const UNSUPPORTED_MAX_PAYOUT_JURISDICTIONS = [JurisdictionMap.ITALY, JurisdictionMap.BRAZIL];

const getTranslationKey = (translationKey: keyof TranslationKey, jurisdiction: Jurisdiction): keyof TranslationKey => {
  switch (jurisdiction) {
    case "BRAZIL":
      return `${translationKey}.${jurisdiction}` as keyof TranslationKey;
    default:
      return translationKey;
  }
};

export const GTM_NOTIFICATIONS: Array<string> = [
  NotificationCode.AboveMaxStake,
  NotificationCode.BelowMinStake,
  NotificationCode.AboveMaxPayout,
  NotificationCode.IncrementOutOfRage,
  NotificationCode.InsufficientFunds,
  NotificationCode.MaxPayoutDailyLimit,
  NotificationCode.MaxPayoutInfo,
];

export const isMaxPayoutNotificationSupported = (userDetails: UserDetails): boolean =>
  !(
    UNSUPPORTED_MAX_PAYOUT_COUNTRIES.includes(userDetails.countryCode) ||
    UNSUPPORTED_MAX_PAYOUT_JURISDICTIONS.includes(userDetails.jurisdiction.jurisdiction as Jurisdiction)
  );

export const getBelowMinStakeNotification = (minValue: number, userDetails: UserDetails): AlertProps => ({
  type: AlertType.Error,
  items: [
    i18n({
      key: "I18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
      interpolationValues: {
        minStake: `${currencyFormatWithDecimalPlaces({
          ...userDetails,
          value: minValue,
          decimalPlaces: 2,
        })}`,
      },
    }),
  ],
  detail: i18n({ key: "I18N.BETSLIP.TAP_TO_UPDATE" }),
  hasClickableAction: true,
  gtmLabel: `${AlertType.Error}${getTranslationKey(
    "I18N.BETSLIP.VALIDATION_BELOW_MIN_STAKE",
    userDetails.jurisdiction.jurisdiction as Jurisdiction,
  )}`,
});

export const getAboveMaxStakeNotification = (maxValue: number, userDetails: UserDetails): AlertProps => ({
  type: AlertType.Error,
  items: [
    i18n({
      key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
      interpolationValues: {
        maxStake: `${currencyFormatWithDecimalPlaces({
          ...userDetails,
          value: maxValue,
          decimalPlaces: 2,
        })}`,
      },
    }),
  ],
  detail: i18n({ key: "I18N.BETSLIP.TAP_TO_UPDATE" }),
  hasClickableAction: true,
  gtmLabel: `${AlertType.Error}${getTranslationKey(
    "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
    userDetails.jurisdiction.jurisdiction as Jurisdiction,
  )}`,
});

export const getAboveMaxPayoutNotification = (maxValue: number, userDetails: UserDetails): AlertProps => ({
  type: AlertType.Error,
  items: [
    i18n({
      key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_PAYOUT",
      interpolationValues: {
        maxPayout: `${currencyFormatWithDecimalPlaces({
          ...userDetails,
          value: maxValue,
          decimalPlaces: 2,
        })}`,
      },
    }),
  ],
  gtmLabel: `${AlertType.Error}${getTranslationKey(
    "I18N.BETSLIP.VALIDATION_ABOVE_MAX_PAYOUT",
    userDetails.jurisdiction.jurisdiction as Jurisdiction,
  )}`,
});

export const getIncrementOutOfRangeNotification = (
  minStakeIncrement: number,
  userDetails: UserDetails,
): AlertProps => ({
  type: AlertType.Error,
  items: [
    i18n({
      key: "I18N.BETSLIP.VALIDATION_INCREMENT_OUT_OF_RANGE",
      interpolationValues: {
        increment: `${currencyFormatWithDecimalPlaces({
          ...userDetails,
          value: minStakeIncrement,
          decimalPlaces: 2,
        })}`,
      },
    }),
  ],
  gtmLabel: `${AlertType.Error}${getTranslationKey(
    "I18N.BETSLIP.VALIDATION_INCREMENT_OUT_OF_RANGE",
    userDetails.jurisdiction.jurisdiction as Jurisdiction,
  )}`,
});

export const getAboveMaxPayoutGroupErrorNotification = (
  userDetails: UserDetails,
  maxPayoutKey: keyof TranslationKey,
): AlertProps => ({
  id: NotificationCode.MaxPayoutDailyLimit,
  type: AlertType.Error,
  items: [
    i18n({
      key: getTranslationKey(
        "I18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
        userDetails.jurisdiction.jurisdiction as Jurisdiction,
      ),
      interpolationValues: {
        maxPayout: i18n({
          key: maxPayoutKey,
        }),
      },
    }),
  ],
  detail: i18n({
    key: "I18N.BETSLIP.VALIDATION_PLEASE_REVIEW_YOUR_STAKE",
  }),
  gtmLabel: `${AlertType.Error}${getTranslationKey(
    "I18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
    userDetails.jurisdiction.jurisdiction as Jurisdiction,
  )}`,
});

export const getAboveMaxPayoutGroupWarningNotification = (
  userDetails: UserDetails,
  maxPayoutKey: keyof TranslationKey,
): AlertProps => ({
  id: NotificationCode.MaxPayoutDailyLimit,
  type: AlertType.Warning,
  items: [
    i18n({
      key: getTranslationKey(
        "I18N.BETSLIP.VALIDATION_SPORT_MAX_PAYOUT_TITLE",
        userDetails.jurisdiction.jurisdiction as Jurisdiction,
      ),
    }),
  ],
  detail: i18n({
    key: getTranslationKey(
      "I18N.BETSLIP.VALIDATION_MAX_DAILY_PAYOUT_WARNING",
      userDetails.jurisdiction.jurisdiction as Jurisdiction,
    ),
    interpolationValues: {
      maxPayout: i18n({
        key: maxPayoutKey,
      }),
    },
  }),
  extraDetailInfo: i18n({
    key: "I18N.BETSLIP.VALIDATION_SEE_TC_SHORT",
  }),
  url: getExternalLink("MAX_PAYOUT", userDetails.jurisdiction.jurisdiction, userDetails.localeCode),
  gtmLabel: `${AlertType.Warning}${getTranslationKey(
    "I18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
    userDetails.jurisdiction.jurisdiction as Jurisdiction,
  )}`,
});

export const getMaxPayoutNotification = (userDetails: UserDetails): AlertProps => ({
  id: NotificationCode.MaxPayoutInfo,
  type: AlertType.Warning,
  message: i18n({ key: "I18N.BETSLIP.GENERIC.PAYOUT.HEADER" }),
  detail: i18n({ key: "I18N.BETSLIP.GENERIC.PAYOUT.DESCRIPTION" }),
  extraDetailInfo: i18n({ key: "I18N.BETSLIP.VALIDATION_SEE_TC_SHORT" }),
  url: getExternalLink("MAX_PAYOUT", userDetails.jurisdiction.jurisdiction, userDetails.localeCode),
  dismissLabel: i18n({ key: "I18N.BETSLIP.MAX.PAYOUT.ACCEPT" }),
  showCloseIcon: false,
});
