import { MapStateToPropsFactory } from "react-redux";

import { NavigateToCompetitionView, UI__NAVIGATE_TO_COMPETITION_VIEW } from "@ppb/tbd-store/actions/navigation";
import { PUSH, PushAction } from "@ppb/tbd-store";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { createCompetitionViewLinkCardHydratedByURNSelector } from "@ppb/tbd-store/state/layout/cards/competition-viewlinks/competition-viewlinks-selectors";
import { getSportIcon } from "@ppb/the-wall-icons/SportIcon/sports-icon-helper";
import { CircularImageCommonProps } from "./snowflakes/CircularImage/CircularImage.types";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  viewLink: ViewLink;
  name: NonNullable<CircularImageCommonProps["text"]>;
  logo?: string;
  fallbackIcon?: CircularImageCommonProps["fallbackIcon"];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCompetitionViewLinkCardHydratedByURN = createCompetitionViewLinkCardHydratedByURNSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const hydratedCard = getCompetitionViewLinkCardHydratedByURN(state, urn);

    if (!hydratedCard) {
      return {};
    }

    const { competition, sport, card } = hydratedCard;

    return {
      viewLink: card.viewLink,
      name: competition.name,
      logo: competition.logo?.large || competition.country?.flag,
      fallbackIcon: sport && getSportIcon(sport.sportId),
    };
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchNavigateToCompetitionView = (viewUrl: string, name: string, urn: URN): NavigateToCompetitionView => ({
  type: UI__NAVIGATE_TO_COMPETITION_VIEW,
  payload: { href: viewUrl, text: name, cardUrn: urn, cardType: "CompetitionViewLinkCard" },
});

export type DispatchProps = {
  dispatchRouterPushAction: typeof dispatchRouterPushAction;
  dispatchNavigateToCompetitionView: typeof dispatchNavigateToCompetitionView;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
  dispatchNavigateToCompetitionView,
};
