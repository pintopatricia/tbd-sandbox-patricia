import {
  NativeEntityTypes,
  ScreenName,
  navigateTerritoryBlockingScreen,
  navigateWithThirdPartyScreenName,
} from "@ppb/tbd-router/native";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ErrorType } from "@ppb/tbd-store/state/network-status/Errors";
import { Store } from "redux";
import {
  getBasePath,
  getCatalogueDefaultPath,
  CATALOGUE_LATEST_PATH,
  APP_ENVIRONMENT_DEFAULT_PATH,
} from "../../config/base-path-utils.native";
import { ErrorViewAddAction, ERROR_VIEW__ADD } from "@ppb/tbd-store/actions/error";

export const navigateOnBootFailure = (store: Store<ApplicationState>): void => {
  const { failed } = store.getState().boot;

  switch (failed) {
    case "blocked":
      navigateTerritoryBlockingScreen();
      break;
    case "failed":
      {
        const basePath = getBasePath();

        store.dispatch<ErrorViewAddAction>({
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
      }
      break;
  }
};
