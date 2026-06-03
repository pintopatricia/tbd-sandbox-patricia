import { CountryCode, OfflineUserDetails, UserDetailsState } from "./UserDetailsState";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS, FetchAppContextSuccessAction } from "../../../actions/app-context";
import { AUTH__LOGIN_INITIATED, AUTH__LOGIN_RESOLVED, AuthenticationAction } from "../../../actions/authentication";

const INITIAL_STATE: OfflineUserDetails = {
  loggedIn: false,
  isAuthenticating: false,
  localeCode: "en_GB",
  localeCodeBcp47: "en-GB",
  timezone: "Europe/London",
  countryCode: CountryCode.UNITED_KINGDOM,
};

type Action = FetchAppContextSuccessAction | AuthenticationAction;

export default (currentState: undefined | UserDetailsState, action: Action): UserDetailsState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      const nextUserDetails = action.payload.initialState?.entities?.userdetails;
      if (nextUserDetails) {
        return {
          ...state,
          ...nextUserDetails,
          // Only clear the transient authenticating flag once the refetch
          // confirms the user is logged in. On slow devices the betslip can
          // re-mount after the post-login navigation reset before the
          // authenticated app-context payload arrives — an interim refetch
          // (still `loggedIn: false`) must not flip the UI back to the
          // "Log in to place bet" label. If login never resolves (e.g. user
          // cancels or it fails), the hook's safety timeout dispatches
          // `AUTH__LOGIN_RESOLVED` to clear the flag.
          isAuthenticating: nextUserDetails.loggedIn ? false : state.isAuthenticating,
        };
      }

      return state;
    }
    case AUTH__LOGIN_INITIATED: {
      return {
        ...state,
        isAuthenticating: true,
      };
    }
    case AUTH__LOGIN_RESOLVED: {
      return {
        ...state,
        isAuthenticating: false,
      };
    }
    default:
      return state;
  }
};
