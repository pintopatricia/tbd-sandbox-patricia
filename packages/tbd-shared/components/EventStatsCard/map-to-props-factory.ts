import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { EventStatsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  statsUrl: URL;
  aspectRatio: number;
};

export type StateProps = CardProps | Record<string, never>;

const DEFAULT_ASPECT_RATIO = "0.5625"; // 16:9 Aspect Ratio

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFindCardbyURN = createCardByURNSelector<EventStatsCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getFindCardbyURN(state.layouts.cards.eventstats, urn);

    if (!card || !card.matchStatsUrl.length) {
      return {};
    }

    try {
      const url = new URL(card.matchStatsUrl);

      return {
        statsUrl: url,
        aspectRatio: parseFloat(url.searchParams.get("aspectRatio") || DEFAULT_ASPECT_RATIO),
      };
    } catch (error) {
      console.warn("Invalid stats URL", error);

      return {};
    }
  };
};
