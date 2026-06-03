import { UserProfileI18n } from "../components/UserProfile/snowflakes/UserProfile/UserProfile.web";
import { i18n } from "../helpers/i18n";
import { getBasePath, getEndpoint } from "../config/endpoints";
import { UserMenuItem, UserMenuItemOnClick } from "../components/UserProfile/snowflakes/UserMenu/UserMenu.web";

export type PropsForUserProfile = {
  translations: UserProfileI18n;
  menuItems: UserMenuItem[];
};

export function getPropsForUserProfile(onLogoutClick: UserMenuItemOnClick): PropsForUserProfile {
  const logoutSchema = {
    host: getEndpoint("LOGOUT"),
    params: {
      product: "bfrebuild",
      redirectMethod: "GET",
      url: getBasePath(),
    },
  };
  const {
    host,
    params: { product, redirectMethod, url },
  } = logoutSchema;

  const menuItems = [
    {
      label: i18n({ key: "I18N.HEADER.LOGOUT" }),
      onClick: onLogoutClick,
      href: `${host}?product=${product}&redirectMethod=${redirectMethod}&url=${url}`,
    },
  ];

  const translations: UserProfileI18n = {
    welcomeText: i18n({ key: "I18N.WELCOME" }),
    lastLoginText: i18n({ key: "I18N.MY_ACCOUNT.LAST_LOGIN" }),
    cashBalance: {
      cashBalancesTitleLabel: i18n({ key: "I18N.CASH_BONUS_BALANCE" }),
      hiddenLabel: i18n({ key: "I18N.HIDDEN" }),
      showMoreLabel: i18n({ key: "I18N.SHOW_MORE" }),
      showLessLabel: i18n({ key: "I18N.SHOW_LESS" }),
    },
    basicPlan: i18n({ key: "I18N.BASIC_PLAN" }),
    rewardsPlan: i18n({ key: "I18N.REWARDS_PLAN" }),
  };

  return {
    translations,
    menuItems,
  };
}
