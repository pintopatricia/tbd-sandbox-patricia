import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { useLogin } from "@flutter-global/react-native-cet-framework";
import {
  AUTH__LOGIN_INITIATED,
  AUTH__LOGIN_RESOLVED,
  LoginInitiatedAction,
  LoginResolvedAction,
} from "@ppb/tbd-store/actions/authentication";
import { getIsAuthenticating, getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

// Safety net for the case where the authenticated app-context refresh never
// arrives (e.g. user cancels the CET login modal, network failure, etc.). We
// only run this timer while the betslip is focused — the user spends an
// unbounded amount of time on the CET login screen typing credentials, and a
// wall-clock timer that started on button tap would fire prematurely the
// moment they returned, clobbering the transient "…" label before the BFF
// refetch lands.
const AUTH_SAFETY_TIMEOUT_MS = 10000;

const getIsLoggedIn = (state: ApplicationState): boolean => {
  try {
    return !!getUserDetails(state).loggedIn;
  } catch {
    return false;
  }
};

/**
 * Wraps the CET framework's `useLogin` hook with a Redux dispatch that flips a
 * transient `isAuthenticating` flag on the user details state. This is needed
 * by the betslip place button to avoid showing a stale "Login to Place Bet"
 * label after the user has already submitted valid credentials but before the
 * BFF app-context refresh has propagated `loggedIn: true` to the store.
 *
 * The safety-net timeout runs only while the host screen (betslip) is focused,
 * so time spent on the CET login screen does not count against it.
 */
const useLoginWithPendingState = (): (() => void) => {
  const dispatch = useDispatch();
  const login = useLogin();
  const isFocused = useIsFocused();
  const isAuthenticating = useSelector(getIsAuthenticating);
  const isLoggedIn = useSelector(getIsLoggedIn);

  useEffect(() => {
    if (!isFocused || !isAuthenticating || isLoggedIn) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      dispatch<LoginResolvedAction>({ type: AUTH__LOGIN_RESOLVED });
    }, AUTH_SAFETY_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [dispatch, isFocused, isAuthenticating, isLoggedIn]);

  return useCallback(() => {
    dispatch<LoginInitiatedAction>({ type: AUTH__LOGIN_INITIATED });
    login();
  }, [dispatch, login]);
};

export default useLoginWithPendingState;
