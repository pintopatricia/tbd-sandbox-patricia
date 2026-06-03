import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  DisplayRunners,
  MarketExtendedCards,
  MarketBlurbPromotion,
  RunnerViewLinks,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  title?: string;
  cardUrn: URN;
  marketViewLinks?: ViewLink[];
  eventViewLink?: ViewLink;
  runnerViewLinks?: RunnerViewLinks;
  displayRunners: DisplayRunners;
  isRunnerExpandable?: boolean;
  numberOfItemsToDisplay?: number;
  marketPromo?: MarketBlurbPromotion;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMarketExtendedCardByURN = createCardByURNSelector<MarketExtendedCards, URN>();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const marketExtendedCard = getMarketExtendedCardByURN(state.layouts.cards.marketsextended, urn);

    if (!marketExtendedCard) {
      return {};
    }

    const { title, runnerViewLinks, displayRunners, raceViewLink, numberOfItemsToDisplay, marketPromo } =
      marketExtendedCard;

    return {
      title,
      displayRunners,
      cardUrn: urn,
      runnerViewLinks,
      eventViewLink: raceViewLink,
      numberOfItemsToDisplay,
      marketPromo,
    };
  };
};
