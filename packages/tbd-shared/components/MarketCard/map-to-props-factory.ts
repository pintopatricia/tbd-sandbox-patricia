import URN from "@ppb/tbd-store/state/layout/URN";
import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MarketCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ContainerProps as MarketCardPropsProps } from "../Market/map-to-props-factory";

export type CardProps = MarketCardPropsProps;

export type StateProps = MarketCardPropsProps | Record<string, never>;

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMarketCardByURN = createCardByURNSelector<MarketCards, URN>();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const marketCard = getMarketCardByURN(state.layouts.cards.markets, urn);

    if (!marketCard) {
      return {};
    }

    return {
      title: marketCard.title,
      displayRunners: marketCard.displayRunners,
      cardUrn: urn,
      marketViewLinks: marketCard.viewLinks,
      runnerViewLinks: marketCard.runnerViewLinks,
      isRunnerExpandable: marketCard.isRunnerExpandable,
      template: marketCard.template,
      numberOfItemsToDisplay: marketCard.numberOfItemsToDisplay,
      marketPromo: marketCard.marketPromo,
      infoBlurbs: marketCard.infoBlurbs,
    };
  };
};

export type DispatchProps = Record<string, never>;
