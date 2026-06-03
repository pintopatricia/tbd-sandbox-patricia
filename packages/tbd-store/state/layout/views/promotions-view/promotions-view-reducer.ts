import { PUSH, PushAction } from "../../../../actions/router";
import {
  FetchCatalogueInProgressAction,
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  DELETE_VIEW_ITEMS,
  DeleteViewItems,
} from "../../../../actions/catalogue";
import { PromotionsViews } from "../View.types";
import { APOLLO_MIGRATED_CARDS } from "../../cards/Card.types";

type ActionTypes = FetchCatalogueSuccessAction | FetchCatalogueInProgressAction | PushAction | DeleteViewItems;

const INITIAL_STATE: PromotionsViews = {};

export default (currentState: undefined | PromotionsViews, action: ActionTypes): PromotionsViews => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const promotions = action.payload.data.PromotionsView || [];

      if (!promotions.length) {
        return state;
      }

      return promotions.reduce((acc: PromotionsViews, view) => {
        const { urn } = view;
        const items = state[urn] ? [...state[urn].items] : [];

        return {
          ...acc,
          [urn]: {
            ...state[urn],
            ...view,
            items: [...new Set([...items, ...view.items])],
          },
        };
      }, {});
    }

    case PUSH:
      return INITIAL_STATE;

    case DELETE_VIEW_ITEMS: {
      const urns = action.payload;

      return Object.keys(state).reduce((acc: PromotionsViews, urn) => {
        const promotionsViews = state[urn];

        acc[urn] = {
          ...promotionsViews,
          items: promotionsViews.items.filter(
            (item) => !urns.includes(item.urn) || APOLLO_MIGRATED_CARDS.includes(item.typename),
          ),
        };

        return acc;
      }, {});
    }

    default:
      return state;
  }
};
