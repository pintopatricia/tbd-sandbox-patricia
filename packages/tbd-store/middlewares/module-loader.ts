import { Action, Dispatch, Middleware } from "redux";
import { IDynamicallyAddedModule, IModuleStore } from "redux-dynamic-modules";

import { ModuleLoaderInit, MODULES__LOADER_INIT } from "../actions/modules";
import { UpdateProductPreferenceAction, UPDATE_PRODUCT_PREFERENCE } from "../actions/preferences";
import { StorageState } from "../helpers";
import { StorageModule } from "../modules";
import { ApplicationState, AppCommands, CMD_LOAD_SBK_BETSLIP, ProductsOption } from "../state";

type Actions = UpdateProductPreferenceAction | ModuleLoaderInit;

let sbkModule: IDynamicallyAddedModule | undefined;
let excModule: IDynamicallyAddedModule | undefined;

function loadSportsbookModule(store: IModuleStore<ApplicationState>, storage: StorageModule<StorageState>) {
  return import(/* webpackChunkName: "sbk-betting-module" */ "../modules/sbk-betting-module").then(
    ({ getSportsbookBettingModule }) => {
      if (!sbkModule) {
        sbkModule = store.addModule(getSportsbookBettingModule(storage));
      }
    },
  );
}

function loadExchangeModule(store: IModuleStore<ApplicationState>) {
  return import(/* webpackChunkName: "exc-betting-module" */ "../modules/exc-betting-module").then(
    ({ getExchangeBettingModule }) => {
      if (!excModule) {
        excModule = store.addModule(getExchangeBettingModule());
      }
    },
  );
}

export const createDynamicModuleLoader =
  (store: IModuleStore<ApplicationState>, storage: StorageModule<StorageState>, appCommands: AppCommands): Middleware =>
  ({ getState }) =>
  (next: Dispatch<Action>) =>
  async (action: Actions) => {
    next(action);

    if (action.type === UPDATE_PRODUCT_PREFERENCE) {
      if (action.payload.productSwitcherPreference === ProductsOption.sportsbook && !sbkModule) {
        loadSportsbookModule(store, storage);
      }

      if (action.payload.productSwitcherPreference === ProductsOption.exchange && !excModule) {
        loadExchangeModule(store);
      }
    }

    if (action.type === MODULES__LOADER_INIT) {
      const {
        entities: {
          preferences: { products },
        },
      } = getState();
      const hasSportsbookDeepLink = appCommands.find(({ name }) => name === CMD_LOAD_SBK_BETSLIP);

      if (products && products.length) {
        if (products.includes(ProductsOption.exchange)) {
          loadExchangeModule(store);
        }

        if (products.includes(ProductsOption.sportsbook) || hasSportsbookDeepLink) {
          loadSportsbookModule(store, storage);
        }
      } else {
        loadExchangeModule(store);
        loadSportsbookModule(store, storage);
      }
    }
  };
