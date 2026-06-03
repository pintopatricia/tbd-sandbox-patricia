import { Dispatch, Middleware } from "redux";
import i18next from "i18next";

import {
  ApplicationState,
  FETCH_CATALOGUE_FAILURE,
  FetchCatalogueFailureAction,
  FETCH_CATALOGUE_EMPTY_VIEW_FAILURE,
  FetchCatalogueEmptyViewFailureAction,
} from "@ppb/tbd-store";
import {
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  FetchAppContextFailureAction,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
  FetchAppContextTerritoryBlockingAction,
  FetchAppContextAuthFailureAction,
} from "@ppb/tbd-store/actions/app-context";
import { ErrorViewAddAction, ERROR_VIEW__ADD } from "@ppb/tbd-store/actions/error";
import { ErrorType } from "@ppb/tbd-store/state/network-status/Errors";
import {
  goBack,
  NativeEntityTypes,
  navigateTerritoryBlockingScreen,
  navigateWithThirdPartyScreenName,
  navigationRef,
  ScreenName,
} from "@ppb/tbd-router/native";
import {
  getBasePath,
  getCatalogueDefaultPath,
  CATALOGUE_LATEST_PATH,
  APP_ENVIRONMENT_DEFAULT_PATH,
} from "../config/base-path-utils.native";
import appConfiguration from "../config/app-configuration.native";
import { isHttpResponseError } from "@ppb/tbd-store/helpers/error-parsing";

type Actions =
  | FetchCatalogueFailureAction
  | FetchCatalogueEmptyViewFailureAction
  | FetchAppContextTerritoryBlockingAction
  | FetchAppContextFailureAction
  | FetchAppContextAuthFailureAction;

export const createErrorHandlingMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch }) =>
  (next: Dispatch<Actions>) =>
  (action: Actions) => {
    const result = next(action);

    switch (action.type) {
      case FETCH_CATALOGUE_FAILURE: {
        if (isHttpResponseError(action.payload.error) && action.payload.error.status === 429) {
          // Handle 429 errors elsewhere, check catalogue-failure-middleware.ts
          break;
        }
        const basePath = getBasePath();

        dispatch<ErrorViewAddAction>({
          type: ERROR_VIEW__ADD,
          payload: {
            urn: NativeEntityTypes.Error,
            errorType: ErrorType.FAILED_REQUEST,
            helpCenterUrl: appConfiguration.helpCenterUrls?.[i18next.language] || appConfiguration.helpCenterUrls?.en,
            appEnv: `${basePath}${APP_ENVIRONMENT_DEFAULT_PATH}`,
          },
        });

        if (navigationRef.isReady()) {
          goBack();
          navigateWithThirdPartyScreenName(ScreenName.ErrorScreen);
        }
        break;
      }
      case NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING: {
        if (action.payload.details.isBlockedTerritory) {
          navigateTerritoryBlockingScreen();
        }
        break;
      }
      case NETWORK__FETCH_APP_CONTEXT_FAILURE: {
        const basePath = getBasePath();

        dispatch<ErrorViewAddAction>({
          type: ERROR_VIEW__ADD,
          payload: {
            urn: NativeEntityTypes.Error,
            errorType: ErrorType.FATAL_ERROR,
            bffEndpoint: `${basePath}${getCatalogueDefaultPath()}`,
            latestBffEndpoint: `${basePath}${CATALOGUE_LATEST_PATH}`,
            appEnv: `${basePath}${APP_ENVIRONMENT_DEFAULT_PATH}`,
          },
        });
        navigateWithThirdPartyScreenName(ScreenName.RootErrorScreen);

        break;
      }
      case FETCH_CATALOGUE_EMPTY_VIEW_FAILURE: {
        const basePath = getBasePath();
        dispatch<ErrorViewAddAction>({
          type: ERROR_VIEW__ADD,
          payload: {
            urn: NativeEntityTypes.Error,
            errorType: ErrorType.FATAL_EMPTY_VIEW_ERROR,
            bffEndpoint: `${basePath}${getCatalogueDefaultPath()}`,
            latestBffEndpoint: `${basePath}${CATALOGUE_LATEST_PATH}`,
            appEnv: `${basePath}${APP_ENVIRONMENT_DEFAULT_PATH}`,
          },
        });

        navigateWithThirdPartyScreenName(ScreenName.ErrorScreen);

        break;
      }

      default:
        break;
    }

    return result;
  };
