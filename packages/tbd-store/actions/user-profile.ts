export const UI__USER_PROFILE_QUICK_LINK_CLICK = "UI__USER_PROFILE_QUICK_LINK_CLICK";
export const UI__USER_PROFILE_MENU_LINK_CLICK = "UI__USER_PROFILE_MENU_LINK_CLICK";
export const UI__USER_PROFILE_EYE_ICON_CLICK = "UI__USER_PROFILE_EYE_ICON_CLICK";
export const UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK = "UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK";
export const UI__USER_PROFILE_BUDGET_LINK_CLICK = "UI__USER_PROFILE_BUDGET_LINK_CLICK";

type UserProfileMenuLinkPayload = {
  menuText: string;
  jurisdiction: string;
  href: string;
};

type UserProfileQuickLinkPayload = {
  title: string;
  jurisdiction: string;
  href: string;
};

type UserProfileEyeIconPayload = {
  showBalances: boolean;
  jurisdiction: string;
};

type UserProfileToggleCashBalancesViewPayload = {
  jurisdiction: string;
  showLessToggle: boolean;
};

type UserProfileBudgetLinkClickPayload = {
  module: string;
  url: string;
  jurisdiction: string;
  text: string;
};

export type UserProfileQuickLinkClickAction = {
  type: typeof UI__USER_PROFILE_QUICK_LINK_CLICK;
  payload: UserProfileQuickLinkPayload;
};

export type UserProfileMenuLinkClickAction = {
  type: typeof UI__USER_PROFILE_MENU_LINK_CLICK;
  payload: UserProfileMenuLinkPayload;
};

export type UserProfileMenuEyeIconClickAction = {
  type: typeof UI__USER_PROFILE_EYE_ICON_CLICK;
  payload: UserProfileEyeIconPayload;
};

export type UserProfileToggleCashBalancesViewClickAction = {
  type: typeof UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK;
  payload: UserProfileToggleCashBalancesViewPayload;
};

export type UserProfileBudgetLinkClickAction = {
  type: typeof UI__USER_PROFILE_BUDGET_LINK_CLICK;
  payload: UserProfileBudgetLinkClickPayload;
};
