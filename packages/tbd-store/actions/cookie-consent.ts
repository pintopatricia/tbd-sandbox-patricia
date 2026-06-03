export const COOKIE_CONSENT__CATEGORIES_CHANGED = "COOKIE_CONSENT/CATEGORIES_CHANGED";

export type CookieConsentCategoriedChangedAction = {
  type: typeof COOKIE_CONSENT__CATEGORIES_CHANGED;
  payload: string[];
};
