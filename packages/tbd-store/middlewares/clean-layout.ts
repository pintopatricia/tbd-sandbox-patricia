import { Middleware } from "redux";
import { ApplicationState } from "../state/ApplicationState.types";
import { DELETE_VIEW, DeleteViewAction } from "../actions/catalogue";
import { PushAction, PUSH } from "../actions/router";

/**
 * This middleware just exist to handle the PRESERVE_LAYOUT throttle. Since we want to manipulate the
 * behaviour of a reducer and throttles info are stored also in store, using a middleware is the only way.
 *
 * Please remove this code when the PRESERVE_LAYOUT is deprecated
 */
const FAVOURITE_GAMES_URN_PATTERN = "gaming:favouriteGames";

const hasFavouriteGamesCard = (state: ApplicationState): string | null => {
  const gamingCategoryViews = state.layouts?.views?.gamingcategory;

  if (!gamingCategoryViews) {
    return null;
  }

  for (const [viewUrn, view] of Object.entries(gamingCategoryViews)) {
    if (view?.items) {
      const hasFavourites = view.items.some((item) => item.urn.includes(FAVOURITE_GAMES_URN_PATTERN));
      if (hasFavourites) {
        return viewUrn;
      }
    }
  }

  return null;
};

export const cleanLayoutMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ getState, dispatch }) =>
  (next) =>
  (action: PushAction) => {
    if (action.type === PUSH) {
      const state = getState();

      const favouriteGamesViewUrn = hasFavouriteGamesCard(state);
      // If we have a favourite games card view, delete it to force a refetch
      if (favouriteGamesViewUrn) {
        dispatch<DeleteViewAction>({
          type: DELETE_VIEW,
          payload: favouriteGamesViewUrn,
        });
      }

      if (!state.entities.throttles.PRESERVE_LAYOUT?.isActive) {
        dispatch<DeleteViewAction>({
          type: DELETE_VIEW,
          payload: action.payload.viewUrn,
        });
      }
    }

    return next(action);
  };
