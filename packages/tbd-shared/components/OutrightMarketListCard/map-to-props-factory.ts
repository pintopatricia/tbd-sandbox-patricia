import { MapStateToPropsFactory } from "react-redux";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { OutrightMarketListCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ToggleShowMoreRunnersAction, UI__TOGGLE_SHOW_MORE_RUNNERS } from "@ppb/tbd-store/actions/interface";
import {
  START_REFRESH_CARD,
  StartRefreshCardAction,
  STOP_REFRESH_CARD,
  StopRefreshCardAction,
} from "@ppb/tbd-store/actions/refresh";

import { createOutrightMarketListViewModel } from "../../view-model-factories/outright-market-list";

export type ContainerProps = {
  urn: string;
  visible?: boolean;
};

export type OutrightMarket = {
  marketName: string;
  marketUrn: string;
  runnersUrns: string[];
};

export type CardProps = {
  cardUrn: URN;
  title: string;
  numberOfRowsToDisplay?: number;
  outrightMarkets: OutrightMarket[];
  favouriteMarketsStateURN?: URN;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getOutrightMarketListCardbyURN = createCardByURNSelector<OutrightMarketListCards, URN>();
  const getOutrightMarketListViewModel = createOutrightMarketListViewModel();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getOutrightMarketListCardbyURN(state.layouts.cards.outrightmarketlistcards, urn);

    if (!card) return {};

    const { urn: cardUrn, title, numberOfRowsToDisplay, favouriteMarketsStateURN } = card;

    const outrightMarkets = getOutrightMarketListViewModel(state, card.markets);

    if (!outrightMarkets.length) return {};

    return {
      cardUrn,
      title,
      outrightMarkets,
      numberOfRowsToDisplay,
      favouriteMarketsStateURN,
    };
  };
};

const dispatchToggleShowMoreRunners = (cardUrn: URN, showMore: boolean): ToggleShowMoreRunnersAction => ({
  type: UI__TOGGLE_SHOW_MORE_RUNNERS,
  payload: {
    cardUrn,
    showMore,
  },
});

const dispatchRefreshCard = (urn: URN, isIntersecting: boolean): StartRefreshCardAction | StopRefreshCardAction => ({
  type: isIntersecting ? START_REFRESH_CARD : STOP_REFRESH_CARD,
  payload: urn,
});

export type DispatchProps = {
  dispatchToggleShowMoreRunners: typeof dispatchToggleShowMoreRunners;
  dispatchRefreshCard: typeof dispatchRefreshCard;
};

export const mapDispatchToProps: DispatchProps = { dispatchToggleShowMoreRunners, dispatchRefreshCard };
