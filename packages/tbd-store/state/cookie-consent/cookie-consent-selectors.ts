import { ParametricSelector, createSelector } from "reselect";
import { CookieConsentState } from "./CookieConsentState.types";

export const createIsCookieConsentCategoryActiveSelector = (): ParametricSelector<
  CookieConsentState,
  string,
  boolean
> =>
  createSelector(
    [(state: CookieConsentState, category: string) => state?.activeCategories?.includes(category)],
    (isCookieConsentCategoryActive) => isCookieConsentCategoryActive,
  );
