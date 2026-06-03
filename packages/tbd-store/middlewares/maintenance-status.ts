import { codecs } from "@ppb/tbd-urn-codecs";
import { Action, Dispatch, Middleware } from "redux";
import { FETCH_CATALOGUE_SUCCESS } from "../actions/catalogue";

const { type: maintenanceViewType } = codecs.maintenanceView.encode();

export const createMaintenanceStatusMiddleware =
  (callback: (isFullSplash: boolean) => void): Middleware =>
  () =>
  (next: Dispatch<Action>) =>
  (action) => {
    const result = next(action);

    if (action.type === FETCH_CATALOGUE_SUCCESS) {
      if (action.payload.router?.currentView === maintenanceViewType) {
        const [maintenanceView] = action.payload.data.MaintenanceView;
        // redirectUrl is returned only in full splashes
        const isFullSplash = !!maintenanceView.redirectUrl;

        callback(isFullSplash);
      }
    }

    return result;
  };
