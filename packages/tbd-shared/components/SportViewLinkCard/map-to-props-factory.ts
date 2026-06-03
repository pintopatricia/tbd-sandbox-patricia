import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { SportViewLinkCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { NavigateViewFromFavouritesClick, UI_NAVIGATE_VIEW_FROM_FAVOURITES } from "@ppb/tbd-store/actions/navigation";
import { getSportByURN } from "@ppb/tbd-store/state/entities/sports/sport-selectors";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  urn: URN;
  sportId: number;
  sportName: string;
  sportViewLink: ViewLink;
  isSportsRibbonHighlighted: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportViewLinkCardByURN = createCardByURNSelector<SportViewLinkCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getSportViewLinkCardByURN(state.layouts.cards.sportviewlinks, urn);
    const sport = getSportByURN(state.entities.sports, card?.sport ?? "");
    const isSportsRibbonHighlighted = state.entities.brandSettings?.HIGHLIGHTED_SPORTS_RIBBON || false;

    if (card && sport) {
      const { viewLink } = card;
      const { sportId, name, shortName } = sport;

      return {
        urn,
        sportId,
        sportName: shortName || name,
        sportViewLink: viewLink,
        isSportsRibbonHighlighted,
      };
    }

    return {};
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchNavigationViewFromFavourites = (
  cardUrn: string,
  label: string,
  href: string,
): NavigateViewFromFavouritesClick => ({
  type: UI_NAVIGATE_VIEW_FROM_FAVOURITES,
  payload: { label, cardUrn, href },
});

export type DispatchProps = {
  dispatchRouterPushAction: typeof dispatchRouterPushAction;
  dispatchNavigationViewFromFavourites: typeof dispatchNavigationViewFromFavourites;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
  dispatchNavigationViewFromFavourites,
};
