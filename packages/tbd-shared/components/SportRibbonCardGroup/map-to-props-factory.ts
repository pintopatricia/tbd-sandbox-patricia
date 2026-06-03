import URN from "@ppb/tbd-store/state/layout/URN";
import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { SportRibbonCardGroup, SportRibbonCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { PushAction, PUSH } from "@ppb/tbd-store";
import { NavigateViewFromFavouritesClick, UI_NAVIGATE_VIEW_FROM_FAVOURITES } from "@ppb/tbd-store/actions/navigation";
import { ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { Badge, PackIcon } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { OthersIconName, SportsIconName, NavigationIconName, CasinoIconName } from "@ppb/the-wall-icons";
import { getSportIcon } from "@ppb/the-wall-icons/SportIcon/sports-icon-helper";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { iconsMap } from "@ppb/the-wall-icons/icons";

const ICON_MAPPING = {
  [Badge.Oddsonthat]: OthersIconName.ODDS_ON_THAT,
  [Badge.Cup]: OthersIconName.OUTRIGHTS,
  [Badge.Oddsboost]: SportsIconName.FOOTBALL,
  [Badge.Virtuals]: SportsIconName.VIRTUALS,
  [Badge.Inplay]: SportsIconName.IN_PLAY,
  [Badge.Casino]: NavigationIconName.CASINO_ALTERNATIVE,
  [Badge.MyBets]: NavigationIconName.MY_BETS,
  [Badge.Roulette]: CasinoIconName.ROULETTE,
  [Badge.SuperSpin]: CasinoIconName.SUPER_SPIN,
};

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  items: SportRibbonCardGroup["items"];
  isSportsRibbonHighlighted: boolean;
  getIcon: typeof getIcon;
};

export type StateProps = CardProps | Record<string, never>;

function getIcon(icon?: PackIcon | null, badge?: Badge | null, sportId?: number | null): Icons {
  const fallbackIcon = SportsIconName.GENERIC_SPORTS;

  if (icon) {
    return iconsMap[icon.category][icon.id];
  }

  if (badge) {
    return ICON_MAPPING[badge];
  }

  if (sportId) {
    return getSportIcon(sportId) ?? fallbackIcon;
  }

  return fallbackIcon;
}

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportRibbonCardGroupByURNSelector = createCardGroupByURNSelector<SportRibbonCardGroups, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const sportRibbonCardGroup = getSportRibbonCardGroupByURNSelector(
      state.layouts.cardgroups.sportribboncardgroups,
      urn,
    );
    const isSportsRibbonHighlighted = state.entities.brandSettings?.HIGHLIGHTED_SPORTS_RIBBON || false;

    if (!sportRibbonCardGroup) {
      return {};
    }

    return {
      items: sportRibbonCardGroup.items,
      isSportsRibbonHighlighted,
      getIcon,
    };
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchNavigationViewFromFavourites = (
  label: string,
  href: string,
  cardUrn: URN,
): NavigateViewFromFavouritesClick => ({
  type: UI_NAVIGATE_VIEW_FROM_FAVOURITES,
  payload: {
    label,
    href,
    cardUrn,
  },
});

export type DispatchProps = {
  dispatchRouterPushAction: typeof dispatchRouterPushAction;
  dispatchNavigationViewFromFavourites: typeof dispatchNavigationViewFromFavourites;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
  dispatchNavigationViewFromFavourites,
};
