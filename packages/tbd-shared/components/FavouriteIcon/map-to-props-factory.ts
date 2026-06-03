import type { MapStateToPropsFactory } from "react-redux";

import {
  UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
  type FavouriteMarketsToggleFavouriteAction,
} from "@ppb/tbd-store/actions/favourite-markets";
import type { ApplicationState } from "@ppb/tbd-store/state";
import { createGetFavouriteMarketsStateByURNSelector } from "@ppb/tbd-store/state/entities/favourite-markets-state/favourite-markets-state-selectors";
import { createGetFavouriteMarketsIsMutationInProgressSelector } from "@ppb/tbd-store/state/favourite-markets/favourite-markets-selectors";
import type URN from "@ppb/tbd-store/state/layout/URN";

export type ContainerProps = {
  urn: URN;
  contentSectionURN: URN;
};

export type StateProps = {
  isPressBlocked?: boolean;
  isFavourite?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFavouriteMarketsStateByURN = createGetFavouriteMarketsStateByURNSelector();
  const getFavouriteMarketsIsMutationInProgress = createGetFavouriteMarketsIsMutationInProgressSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const favouriteMarketsState = getFavouriteMarketsStateByURN(state.entities.favouritemarketsstates, urn);

    if (!favouriteMarketsState) {
      return {};
    }

    const { isFavourite } = favouriteMarketsState;

    return {
      isPressBlocked: getFavouriteMarketsIsMutationInProgress(state.favouriteMarkets),
      isFavourite,
    };
  };
};

const dispatchToggleFavouriteAction = (
  contentSectionURN: URN,
  isFavourite: boolean,
  favouriteMarketsURN: URN,
): FavouriteMarketsToggleFavouriteAction => ({
  type: UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
  payload: { contentSectionURN, isFavourite, favouriteMarketsURN },
});

export type DispatchProps = {
  dispatchToggleFavouriteAction: typeof dispatchToggleFavouriteAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchToggleFavouriteAction,
};
