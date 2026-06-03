import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { BOTTOM_BAR_PUSH, BottomBarPushAction, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { GenericViewLinkCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { Badge } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SportsIconName, OthersIconName, NavigationIconName, CasinoIconName } from "@ppb/the-wall-icons";
import { NavigateViewFromFavouritesClick, UI_NAVIGATE_VIEW_FROM_FAVOURITES } from "@ppb/tbd-store/actions/navigation";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

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
  visible?: boolean;
};

export type CardProps = {
  urn: URN;
  title: string;
  viewLink: ViewLink;
  icon: Icons | undefined;
  inPlay: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGenericViewLinkCardByURN = createCardByURNSelector<GenericViewLinkCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getGenericViewLinkCardByURN(state.layouts.cards.genericviewlinks, urn);

    if (card) {
      const { viewLink, badge, title } = card;

      return {
        urn,
        title: i18n({ key: title as keyof TranslationKey }),
        viewLink,
        icon: badge ? ICON_MAPPING[badge] : undefined,
        inPlay: badge === Badge.Inplay,
      };
    }

    return {};
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchBottomBarPushAction = (viewLink: ViewLink): BottomBarPushAction => ({
  type: BOTTOM_BAR_PUSH,
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
  dispatchBottomBarPushAction: typeof dispatchBottomBarPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
  dispatchNavigationViewFromFavourites,
  dispatchBottomBarPushAction,
};
