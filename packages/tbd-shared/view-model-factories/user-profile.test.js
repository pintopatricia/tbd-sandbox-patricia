import { getPropsForUserProfile } from "./user-profile";
import { getBasePath, getEndpoint } from "../config/endpoints";

jest.mock("../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "isso"),
  getBasePath: jest.fn(() => "http://localhost/path"),
}));

const onLogoutClickMock = jest.fn();

describe("user profile view model factory", () => {
  it("should return the correct view model", () => {
    const result = getPropsForUserProfile(onLogoutClickMock);

    expect(getBasePath).toHaveBeenCalledWith();
    expect(getBasePath).toHaveBeenCalledTimes(1);
    expect(getEndpoint).toHaveBeenCalledWith("LOGOUT");
    expect(getEndpoint).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      menuItems: [
        {
          href: "isso?product=bfrebuild&redirectMethod=GET&url=http://localhost/path",
          label: "I18N.HEADER.LOGOUT",
          onClick: onLogoutClickMock,
        },
      ],
      translations: {
        welcomeText: "I18N.WELCOME",
        lastLoginText: "I18N.MY_ACCOUNT.LAST_LOGIN",
        cashBalance: {
          cashBalancesTitleLabel: "I18N.CASH_BONUS_BALANCE",
          hiddenLabel: "I18N.HIDDEN",
          showMoreLabel: "I18N.SHOW_MORE",
          showLessLabel: "I18N.SHOW_LESS",
        },
        basicPlan: "I18N.BASIC_PLAN",
        rewardsPlan: "I18N.REWARDS_PLAN",
      },
    });
  });
});
