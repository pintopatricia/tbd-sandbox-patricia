import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import { LeftSidebar } from "../../left-side-bar/LeftSideBar.types";

const INITIAL_STATE: LeftSidebar = {
  typename: "LeftSidebar",
  items: [],
};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | LeftSidebar, action: ActionTypes): LeftSidebar => {
  const state: LeftSidebar = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const sidebarState = action.payload.data.LeftSidebar?.[0];

      if (!sidebarState) {
        return state;
      }

      return sidebarState;
    }
    default:
      return state;
  }
};
