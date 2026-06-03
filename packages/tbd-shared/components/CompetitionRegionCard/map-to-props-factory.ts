import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { CompetitionRegionCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { NavigateToCompetitionView, UI__NAVIGATE_TO_COMPETITION_VIEW } from "@ppb/tbd-store/actions/navigation";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createCompetitionRegionViewModel, CompetitionRegionMapped } from "./competition-region-card-view-model";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  competitionRegions: CompetitionRegionMapped[] | null;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCompetitionRegionCardByURNSelector = createCardByURNSelector<CompetitionRegionCards, URN>();
  const getCompetitionRegionViewModel = createCompetitionRegionViewModel();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const competitionRegionCard = getCompetitionRegionCardByURNSelector(state.layouts.cards.competitionregions, urn);
    if (!competitionRegionCard) {
      return {};
    }

    return {
      competitionRegions: getCompetitionRegionViewModel(state, urn),
    };
  };
};

export const dispatchNavigateToCompetitionView = (
  cardUrn: URN,
  destinationUrl: string,
  text: string,
): NavigateToCompetitionView => ({
  type: UI__NAVIGATE_TO_COMPETITION_VIEW,
  payload: { cardType: "CompetitionRegionCard", cardUrn, href: destinationUrl, text },
});

export const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchNavigateToCompetitionView: typeof dispatchNavigateToCompetitionView;
  dispatchPushAction: typeof dispatchPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchNavigateToCompetitionView,
  dispatchPushAction,
};
