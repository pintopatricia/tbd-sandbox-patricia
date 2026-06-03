import { IModuleStore } from "redux-dynamic-modules";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { MODULES__LOADER_INIT } from "../actions/modules";
import { StorageState } from "../helpers";
import { createDynamicModuleLoader } from "../middlewares/module-loader";
import { ApplicationState, AppCommands } from "../state";

import { StorageModule } from "./StorageModule.types";

export const getModuleLoader = (
  store: IModuleStore<ApplicationState>,
  storage: StorageModule<StorageState>,
  appCommands: AppCommands = [],
): ISagaModule<ApplicationState> => ({
  id: "module-loader-module",
  reducerMap: {} as any,
  middlewares: [createDynamicModuleLoader(store, storage, appCommands)],
  sagas: [],
  initialActions: [{ type: MODULES__LOADER_INIT }],
});
