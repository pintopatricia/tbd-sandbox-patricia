import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import { MyBetsUpdateCursorAction, MY_BETS_UPDATE_VIEW_CURSOR } from "../../../../actions/my-bets";
import { PartialItem } from "../PartialItem.types";
import { MyBetsViews } from "../View.types";

type ActionTypes = FetchCatalogueSuccessAction | MyBetsUpdateCursorAction | DeleteLayoutAction;

export default (currentState: undefined | MyBetsViews, action: ActionTypes): MyBetsViews => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const mybets = action.payload.data.MyBetsView;

      if (!mybets) {
        return state;
      }

      const bets = mybets.reduce((acc: MyBetsViews, view) => {
        const { urn } = view;
        const items = [...(state[urn]?.items ?? [])];
        const newItems = view.items ?? [];

        let filtereDuplicatedItems = newItems;

        // Unless we have items, we do not need to filter anything
        if (items.length && action.payload.withPagination) {
          filtereDuplicatedItems = [...items, ...newItems].reduce((myBetsItems: PartialItem[], current) => {
            const duplicate = myBetsItems.find((item) => item.urn === current.urn);
            if (!duplicate) {
              return myBetsItems.concat([current]);
            }
            return myBetsItems;
          }, []);
        }

        return {
          ...acc,
          [urn]: {
            ...state[urn],
            ...view,
            items: filtereDuplicatedItems,
          },
        };
      }, state);

      return bets;
    }

    case MY_BETS_UPDATE_VIEW_CURSOR: {
      const { viewURN, cursor } = action.payload;
      return {
        ...state,
        [viewURN]: {
          ...state[viewURN],
          pageInfo: {
            ...state[viewURN].pageInfo,
            endCursor: cursor,
          },
        },
      };
    }

    case DELETE_LAYOUT:
      return {};

    default:
      return state;
  }
};
