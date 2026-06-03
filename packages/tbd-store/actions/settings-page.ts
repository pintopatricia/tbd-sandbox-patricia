import { ThrottlesState } from "../state";

export const UI__SETTINGS_TABS_CLICK = "UI__SETTINGS_TABS_CLICK";
export const SET_THROTTLES = "SET_THROTTLES";
export const RESET_THROTTLES = "RESET_THROTTLES";

export type SettingsNavigationPayload = {
  menuText: string;
  moduleName: string;
  destinationURL: string;
};

export type SettingsNavigationAction = {
  type: typeof UI__SETTINGS_TABS_CLICK;
  payload: SettingsNavigationPayload;
};

export type SetThrottlesAction = {
  type: typeof SET_THROTTLES;
  payload: {
    value: ThrottlesState;
  };
};

export type ResetThrottlesAction = {
  type: typeof RESET_THROTTLES;
};
