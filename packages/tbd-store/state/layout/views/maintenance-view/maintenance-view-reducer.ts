import produce from "immer";

import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../../../actions/catalogue";

import mixin from "../../../mixin";
import { MaintenanceViews } from "../View.types";

type ActionTypes = FetchCatalogueSuccessAction;

export const maintenanceReducer = (
  currentState: MaintenanceViews | undefined,
  action: ActionTypes,
): MaintenanceViews => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const views = action.payload.data.MaintenanceView;

      if (!views) {
        return state;
      }

      const update = views.reduce((acc: MaintenanceViews, value) => {
        acc[value.urn] = value;
        return acc;
      }, {});

      return produce(state, (draft) => {
        mixin(draft, update);
      });
    }

    default: {
      return state;
    }
  }
};
