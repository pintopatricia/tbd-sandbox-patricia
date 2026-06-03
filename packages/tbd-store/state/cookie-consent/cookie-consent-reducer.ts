import { COOKIE_CONSENT__CATEGORIES_CHANGED, CookieConsentCategoriedChangedAction } from "../../actions/cookie-consent";
import { CookieConsentState } from "./CookieConsentState.types";

type ActionTypes = CookieConsentCategoriedChangedAction;

const INITIAL_STATE: CookieConsentState = {
  activeCategories: [],
};

export default (currentState: CookieConsentState, action: ActionTypes): CookieConsentState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case COOKIE_CONSENT__CATEGORIES_CHANGED:
      return {
        ...state,
        activeCategories: action.payload,
      };
    default:
      return state;
  }
};
