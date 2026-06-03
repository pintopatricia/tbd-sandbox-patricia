import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { i18n } from "../../../helpers/i18n";

export type SkyBetClubTrackerTranslations = {
  firstLine: string;
  secondLine?: string;
  primaryButtonLabel: string;
};

export default (
  sbcStatus: TrackingBarStatus | "ERROR",
  fulfilled: boolean,
  current: number,
  currentFormatted: string,
): SkyBetClubTrackerTranslations => {
  const primaryButtonLabel = i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });

  if (sbcStatus === "ERROR") {
    return {
      firstLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.ERROR.SERVICE_UNAVAILABLE" }),
      secondLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.ERROR.TRY_AGAIN_LATER" }),
      primaryButtonLabel,
    };
  }

  if (sbcStatus === TrackingBarStatus.PENDING) {
    if (fulfilled) {
      return {
        firstLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.RECEIVE_REWARD" }),
        secondLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.REWARD_CREDITED" }),
        primaryButtonLabel,
      };
    }

    if (current > 0) {
      return {
        firstLine: i18n({
          key: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.UNLOCK_PROGRESS",
          interpolationValues: { progress: currentFormatted },
        }),
        secondLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD" }),
        primaryButtonLabel,
      };
    }

    return {
      firstLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.UNLOCK_WEEKLY_REWARD" }),
      secondLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.CHOOSE_REWARD" }),
      primaryButtonLabel,
    };
  }

  if (sbcStatus === TrackingBarStatus.ACTIVE) {
    if (fulfilled) {
      return {
        firstLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.JOINED.QUALIFIED_FOR_WEEKLY_REWARD" }),
        secondLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.REWARD_CREDITED" }),
        primaryButtonLabel,
      };
    }

    return {
      firstLine: i18n({
        key: "I18N.LOYALTY_CLUB_TRACKER.JOINED.WEEKLY_REWARD_PROGRESS",
        interpolationValues: { progress: currentFormatted },
      }),
      secondLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD" }),
      primaryButtonLabel,
    };
  }

  return {
    firstLine: i18n({ key: "I18N.LOYALTY_CLUB_TRACKER.STATUS.CHECKING" }),
    primaryButtonLabel,
  };
};
