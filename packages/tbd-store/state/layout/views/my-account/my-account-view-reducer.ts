import { PUSH, PushAction } from "../../../../actions/router";
import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../../../actions/catalogue";
import { MyAccountViews } from "../View.types";

type ActionTypes = FetchCatalogueSuccessAction | PushAction;

const INITIAL_STATE: MyAccountViews = {};

export default (currentState: undefined | MyAccountViews, action: ActionTypes): MyAccountViews => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const myaccount = action.payload.data.MyAccountView;

      if (!myaccount) {
        return state;
      }

      return myaccount.reduce((acc: MyAccountViews, view) => {
        const { urn } = view;
        return {
          ...acc,
          [urn]: {
            ...state[urn],
            ...view,
          },
        };
      }, {});
    }

    case PUSH:
      return INITIAL_STATE;

    default:
      return state;
  }
};
