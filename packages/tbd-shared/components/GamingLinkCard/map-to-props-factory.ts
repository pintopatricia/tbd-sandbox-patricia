import { MapStateToPropsFactory } from "react-redux";
import { MILLISECONDS_IN_A_DAY } from "@ppb/tbd-store/helpers/dates";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { GamingLinkCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  NavigateToGameCategoryView,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
} from "@ppb/tbd-store/actions/navigation";
import { CardIconTypes } from "@ppb/the-wall-common/types";

export type ContainerProps = {
  urn: URN;
  moduleTitle?: string;
};

export type CardProps = {
  name: string;
  viewLink: ViewLink;
  icon: CardIconTypes;
  zoneTitle: string;
  games: string[];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGamingLinkCardByURN = createCardByURNSelector<GamingLinkCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn, moduleTitle }: ContainerProps): StateProps {
    const card = getGamingLinkCardByURN(state.layouts.cards.gaminglinks, urn);

    if (!card) {
      return {};
    }
    const newlyReleasedGames = card.games
      ? card.games
          .filter(({ releaseDate }) =>
            releaseDate ? new Date().getTime() - new Date(releaseDate).getTime() <= 7 * MILLISECONDS_IN_A_DAY : false,
          )
          .map((game) => game.uid)
      : [];

    return {
      name: card.link.label,
      viewLink: card.link.viewLink,
      icon: card.link.icon || CardIconTypes.Games,
      zoneTitle: moduleTitle || "",
      games: newlyReleasedGames,
    };
  };
};

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchNavigateToGameCategoryViewAction = (
  viewLink: ViewLink,
  cardUrn: URN,
  module: string,
  title?: string,
): NavigateToGameCategoryView => ({
  type: UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
  payload: {
    module,
    cardType: "GamingLinkCard",
    href: viewLink.viewUrl,
    viewUrn: viewLink.viewUrn,
    cardUrn,
    categoryName: title || "",
  },
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
  dispatchNavigateToGameCategoryViewAction: typeof dispatchNavigateToGameCategoryViewAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushAction,
  dispatchNavigateToGameCategoryViewAction,
};
