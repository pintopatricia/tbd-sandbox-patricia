import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import getTranslations from "./getTranslations";
import { i18n } from "../../../helpers/i18n";

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("when getting translation keys", () => {
  it("returns default key", () => {
    expect(getTranslations(TrackingBarStatus.PLACEHOLDER, false, 0, "")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.STATUS.CHECKING",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.STATUS.CHECKING" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });

  it("returns error keys", () => {
    expect(getTranslations("ERROR", false, 0, "")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.ERROR.SERVICE_UNAVAILABLE",
      secondLine: "I18N.LOYALTY_CLUB_TRACKER.ERROR.TRY_AGAIN_LATER",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.ERROR.SERVICE_UNAVAILABLE" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.ERROR.TRY_AGAIN_LATER" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });

  it("returns not joined and zero spent keys", () => {
    expect(getTranslations(TrackingBarStatus.PENDING, false, 0, "£0")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.UNLOCK_WEEKLY_REWARD",
      secondLine: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.CHOOSE_REWARD",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.UNLOCK_WEEKLY_REWARD" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.CHOOSE_REWARD" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });

  it("returns not joined and partially fulfilled keys and interpolation value", () => {
    expect(getTranslations(TrackingBarStatus.PENDING, false, 5, "£5")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.UNLOCK_PROGRESS",
      secondLine: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.UNLOCK_PROGRESS",
      interpolationValues: { progress: "£5" },
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });

  it("returns not joined and fulfilled keys", () => {
    expect(getTranslations(TrackingBarStatus.PENDING, true, 30, "£30")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.RECEIVE_REWARD",
      secondLine: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.REWARD_CREDITED",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.NOT_JOINED.RECEIVE_REWARD" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.REWARD_CREDITED" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });

  it("returns joined and zero spent keys and interpolation value", () => {
    expect(getTranslations(TrackingBarStatus.ACTIVE, false, 0, "£0")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.JOINED.WEEKLY_REWARD_PROGRESS",
      secondLine: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.LOYALTY_CLUB_TRACKER.JOINED.WEEKLY_REWARD_PROGRESS",
      interpolationValues: { progress: "£0" },
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });

  it("returns joined and partially fulfilled keys and interpolation value", () => {
    expect(getTranslations(TrackingBarStatus.ACTIVE, false, 5, "£5")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.JOINED.WEEKLY_REWARD_PROGRESS",
      secondLine: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.LOYALTY_CLUB_TRACKER.JOINED.WEEKLY_REWARD_PROGRESS",
      interpolationValues: { progress: "£5" },
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.QUALIFY_FOR_REWARD" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });

  it("returns joined and fulfilled keys", () => {
    expect(getTranslations(TrackingBarStatus.ACTIVE, true, 30, "£30")).toEqual({
      firstLine: "I18N.LOYALTY_CLUB_TRACKER.JOINED.QUALIFIED_FOR_WEEKLY_REWARD",
      secondLine: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.REWARD_CREDITED",
      primaryButtonLabel: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL",
    });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.JOINED.QUALIFIED_FOR_WEEKLY_REWARD" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.TIME_LEFT.REWARD_CREDITED" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.LOYALTY_CLUB_TRACKER.PRIMARY_BUTTON_LABEL" });
  });
});
