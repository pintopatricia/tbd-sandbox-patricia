/**
 * Authentication-related UI actions.
 *
 * These actions track an "is the user currently authenticating" transitional flag in the
 * store so the UI can avoid showing the misleading UI state during the authentication flow.
 */
export const AUTH__LOGIN_INITIATED = "AUTH__LOGIN_INITIATED";
export const AUTH__LOGIN_RESOLVED = "AUTH__LOGIN_RESOLVED";

export type LoginInitiatedAction = {
  type: typeof AUTH__LOGIN_INITIATED;
};

export type LoginResolvedAction = {
  type: typeof AUTH__LOGIN_RESOLVED;
};

export type AuthenticationAction = LoginInitiatedAction | LoginResolvedAction;
