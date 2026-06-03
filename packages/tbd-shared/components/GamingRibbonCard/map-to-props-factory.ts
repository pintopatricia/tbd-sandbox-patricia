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
  visible?: boolean;
};

export type CardProps = {
  urn: URN;
  label: string;
  icon: string;
  viewLink: ViewLink;
  games: string[];
  isGamesRibbonHighlighted?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGamingLinkCardByURN = createCardByURNSelector<GamingLinkCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getGamingLinkCardByURN(state.layouts.cards.gaminglinks, urn);

    if (card) {
      const { label, icon, viewLink } = card.link;
      const newlyReleasedGames = card.games
        ? card.games
            .filter(({ releaseDate }) =>
              releaseDate ? new Date().getTime() - new Date(releaseDate).getTime() <= 7 * MILLISECONDS_IN_A_DAY : false,
            )
            .map((game) => game.uid)
        : [];

      const isGamesRibbonHighlighted = state.entities?.brandSettings?.HIGHLIGHTED_SPORTS_RIBBON || false;

      return {
        urn,
        label,
        icon: icon || CardIconTypes.Games,
        viewLink,
        games: newlyReleasedGames,
        isGamesRibbonHighlighted,
      };
    }

    return {};
  };
};

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchNavigateToGameCategoryViewAction = (
  viewLink: ViewLink,
  cardUrn: URN,
  title?: string,
): NavigateToGameCategoryView => ({
  type: UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
  payload: {
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
