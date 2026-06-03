export const NETWORK__REALITY_CHECK_ALERT = "NETWORK/REALITY_CHECK_ALERT";

export const UI__SMART_APP_BANNER_CLICK = "UI/SMART_APP_BANNER_CLICK";
export const UI__SMART_APP_BANNER_CLOSE = "UI/SMART_APP_BANNER_CLOSE";
export const UI__SMART_APP_BANNER_DISPLAY = "UI/SMART_APP_BANNER_DISPLAY";

export type RealityCheckAlertAction = {
  type: typeof NETWORK__REALITY_CHECK_ALERT;
  payload: {
    duration: number;
  };
};

export type SmartAppBannerClickAction = {
  type: typeof UI__SMART_APP_BANNER_CLICK;
  payload: {
    url: string;
  };
};

export type SmartAppBannerCloseAction = {
  type: typeof UI__SMART_APP_BANNER_CLOSE;
};

export type SmartAppBannerDisplayAction = {
  type: typeof UI__SMART_APP_BANNER_DISPLAY;
};
