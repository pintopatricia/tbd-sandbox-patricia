import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../../actions/catalogue";
import { BottomBar, BottomBarTile } from "./BottomBarCard.types";

const INITIAL_STATE = null;
type ActionTypes = FetchCatalogueSuccessAction;

export default (currentState: undefined | BottomBar | null, action: ActionTypes): BottomBar | null => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS:
      if (action.payload.data?.MyBetsView) {
        const bottomBarState = action.payload.data.BottomBar?.[0] || state;
        const myBetsView = action.payload.data.MyBetsView?.[0];
        if (myBetsView && bottomBarState) {
          return {
            ...bottomBarState,
            tiles: bottomBarState.tiles.map((tile: BottomBarTile) => {
              if (tile.tileType === "MY_BETS") {
                return {
                  ...tile,
                  viewLink: {
                    viewUrl: myBetsView.url,
                    viewUrn: myBetsView.urn,
                  },
                };
              }
              return tile;
            }),
          };
        }
      }

      if (action.payload.data.BottomBar?.[0]) {
        return action.payload.data.BottomBar?.[0];
      }

      return state;
    default:
      return state;
  }
};
