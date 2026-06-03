import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { MarketViewLinkCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { CardIconTypes } from "@ppb/the-wall-common/types";
import { Badge } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  name: string;
  viewLink: ViewLink;
  badge?: CardIconTypes;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMarketViewLinkCardByURN = createCardByURNSelector<MarketViewLinkCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getMarketViewLinkCardByURN(state.layouts.cards.marketviewlinks, urn);

    if (!card) {
      return {};
    }

    return {
      name: card.marketName,
      viewLink: card.viewLink,
      badge: card.badge === Badge.Cup ? CardIconTypes.Cup : undefined,
    };
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchRouterPushAction: typeof dispatchRouterPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
};
