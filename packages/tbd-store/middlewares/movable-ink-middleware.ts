import { Middleware } from "redux";
import { getCookieConsentCategories } from "../helpers/cookie-consent";
import { createIsCookieConsentCategoryActiveSelector } from "../state/cookie-consent/cookie-consent-selectors";

const isCookieConsentCategoryActive = createIsCookieConsentCategoryActiveSelector();
const { MARKETING_TARGETING_3RD_PARTY } = getCookieConsentCategories();
const script = document.createElement("script");

script.type = "text/javascript";
script.async = true;
script.src = "//movableink.betfair.com/p/js/1.js";

export const movableInkMiddleware: Middleware = (appState) => (next) => (action) => {
  const isMIScriptInjectionActive =
    appState.getState()?.entities?.throttles?.INJECT_MI_SCRIPT?.isActive &&
    isCookieConsentCategoryActive(appState.getState()?.cookieConsent, MARKETING_TARGETING_3RD_PARTY);

  if (isMIScriptInjectionActive && !document.head.contains(script)) {
    document.head.appendChild(script);
  }

  return next(action);
};
