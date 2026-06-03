import { Dispatch, Middleware } from "redux";
import { QUALTRICS__SEND_NEW_PAGE_NAMED, QualtricsSendAction } from "@ppb/tbd-store/actions/qualtrics";
import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "@ppb/tbd-store/actions/app-context";
import Qualtrics from "react-native-qualtrics/src";
import appConfiguration from "../config/app-configuration.native";

type ActionTypes = FetchAppContextSuccessAction | QualtricsSendAction;

const QUALTRICS_PROJECT_KEY_ID = appConfiguration.appConfig?.QUALTRICS_KEYS.project || "";
const QUALTRICS_BRAND_KEY_ID = appConfiguration.appConfig?.QUALTRICS_KEYS.brand || "";

export const qualtricsMiddleware = (): Middleware => {
  let isInitialized = false;
  let initializing = false;
  return (appState) => (next: Dispatch<ActionTypes>) => (action: ActionTypes) => {
    const state = appState.getState();
    const isQualtricsSBGActive = state.entities.throttles.SBG_QUALTRICS?.isActive;

    if (!isQualtricsSBGActive) {
      return next(action);
    }

    switch (action.type) {
      case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
        if (initializing || !QUALTRICS_BRAND_KEY_ID || !QUALTRICS_PROJECT_KEY_ID) {
          return next(action);
        }

        const { userdetails } = action.payload.initialState?.entities || {};
        const accountId = userdetails.accountId.toString();

        if (userdetails.loggedIn && !isInitialized) {
          initializing = true;
          Qualtrics.initializeProjectWithExtRefId(
            QUALTRICS_BRAND_KEY_ID,
            QUALTRICS_PROJECT_KEY_ID,
            accountId,
            (initializationResult) => {
              initializing = false;

              const success = Object.values(initializationResult).some((item) => item.passed);
              if (success) {
                isInitialized = true;
              }
            },
          );
        } else if (!userdetails.loggedIn) {
          isInitialized = false;
        }
        break;
      }
      case QUALTRICS__SEND_NEW_PAGE_NAMED:
        if (isInitialized && !initializing) {
          const {
            payload: { pageName },
          } = action;
          Qualtrics.registerViewVisit(pageName);

          Qualtrics.evaluateProject((targetingResults) => {
            Object.entries(targetingResults).forEach(([intercept, result]) => {
              if (result.passed) {
                // Record an impression
                result.recordImpression();

                // Display survey (replace)
                Qualtrics.displayTarget(result.surveyUrl);

                // Reset view count and set display time
                Qualtrics.resetViewCounter();
                Qualtrics.setLastDisplayTimeForIntercept(intercept);
              }
            });
          });
        }
        break;
      default:
        break;
    }
    return next(action);
  };
};
