import { ISagaModule } from "redux-dynamic-modules-saga";
import { IModuleStore } from "redux-dynamic-modules";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { CetFrameworkSetup, createAppContextMiddleware } from "./app-context-middleware.native";
import { APP_CONTEXT__FETCH } from "@ppb/tbd-store/actions/app-context";
import {
  getBasePath,
  getCatalogueDefaultPath,
  CATALOGUE_LATEST_PATH,
  APP_ENVIRONMENT_DEFAULT_PATH,
} from "../../config/base-path-utils.native";
import { getTimeZone } from "react-native-localize";
import DeviceInfo from "react-native-device-info";
import { Cookie } from "@react-native-cookies/cookies";

const basePath = getBasePath();
const buildNumber = DeviceInfo.getBuildNumber();

export const getAppContextModule = (
  store: IModuleStore<ApplicationState>,
  appKey: string,
  userAgent: string,
  initialCetFrameworkSetup: CetFrameworkSetup,
  authenticationToken: Cookie,
  excEnabled: boolean,
  onReady: () => void,
): ISagaModule<ApplicationState> => ({
  id: "app-context-module",
  middlewares: [createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)],
  initialActions: [
    {
      type: APP_CONTEXT__FETCH,
      payload: {
        defaultBffEndpoint: `${basePath}${getCatalogueDefaultPath()}`,
        defaultAppEnv: `${basePath}${APP_ENVIRONMENT_DEFAULT_PATH}`,
        latestBffEndpoint: `${basePath}${CATALOGUE_LATEST_PATH}`,
        timezone: getTimeZone(),
        authenticationToken,
        excEnabled,
        buildNumber,
      },
    },
  ],
});
