import produce from "immer";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueInProgressAction,
  DeleteViewItems,
  DELETE_VIEW_ITEMS,
  DELETE_VIEW,
  DELETE_LAYOUT,
  DeleteViewAction,
  DeleteLayoutAction,
} from "../../../actions/catalogue";
import { TransformedLayout } from "../../../services/catalogue/catalogue-types";
import mixin from "../../mixin";
import { CommonView } from "./View.types";
import { APOLLO_MIGRATED_CARDS } from "../cards/Card.types";

type ActionTypes =
  | FetchCatalogueSuccessAction
  | FetchCatalogueInProgressAction
  | DeleteViewItems
  | DeleteViewAction
  | DeleteLayoutAction;

/**
 * Factory function for every view reducer that handles FETCH_CATALOGUE_SUCCESS, DELETE_VIEW_ITEMS and PUSH
 *
 * @param sliceName - the name of the corresponding views state slice
 * @returns
 */
export default function createViewReducer<ViewType extends CommonView>(
  sliceName: keyof TransformedLayout["data"],
): any {
  type ViewsType = { [urn: string]: ViewType };

  // Type guard to guarantee that we're dealing with a view
  function isViewEntry(entry: any): entry is ViewType[] {
    return !!(entry as ViewType[]) && entry.length && !entry.find((v: ViewType) => !v.urn);
  }

  return (currentState: undefined | ViewsType, action: ActionTypes): ViewsType => {
    const state = currentState || {};

    switch (action.type) {
      case FETCH_CATALOGUE_SUCCESS: {
        const views = action.payload.data[sliceName];

        if (!views || !isViewEntry(views)) {
          return state;
        }

        const update = views.reduce((acc: ViewsType, value) => {
          acc[value.urn] = { ...value, metadata: { cacheTimestamp: Date.now() } };
          return acc;
        }, {});

        const nextState = produce(state, (draft) => {
          mixin(draft, update);
        });

        return nextState;
      }

      case DELETE_VIEW: {
        return produce(state, (draft) => {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete draft[action.payload];
        });
      }

      case DELETE_VIEW_ITEMS: {
        const urns = action.payload;

        const nextState = produce(state, (draft) => {
          Object.values(draft).forEach((view) => {
            urns.forEach((urn) => {
              const index = view.items.findIndex(
                (item) => item.urn === urn && !APOLLO_MIGRATED_CARDS.includes(item.typename),
              );

              if (index !== -1) {
                view.items.splice(index, 1);
              }
            });
          });
        });

        return nextState;
      }

      case DELETE_LAYOUT:
        return {};

      default:
        return state;
    }
  };
}
