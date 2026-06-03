import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MatchTimelineCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  SUBSCRIBE_FIXTURE_UPDATES,
  SubscribeFixtureUpdatesAction,
  UNSUBSCRIBE_FIXTURE_UPDATES,
  UnsubscribeFixtureUpdatesAction,
} from "@ppb/tbd-store/actions/fixture";
import { MatchTimelineDetailsProps } from "./snowflakes/MatchTimelineDetails/MatchTimelineDetails.types";

import { createPropsForMatchTimelineDetailsVm } from "../../view-model-factories/match-timeline";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  buttonText: string;
  matchTimelineDetailsProps: MatchTimelineDetailsProps;
  incidentsLength: number;
  fixtureURN: URN;
  typename: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const buttonText = i18n({ key: "I18N.MATCH_TIMELINE.NEW_EVENT" });

  const getMatchTimelineCardByURN = createCardByURNSelector<MatchTimelineCards, URN>();
  const getPropsForMatchTimelineDetails = createPropsForMatchTimelineDetailsVm();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getMatchTimelineCardByURN(state.layouts.cards.matchtimelines, urn);
    if (!card) {
      return {};
    }

    const footballFixture = state.entities.footballfixtures[card.fixture];
    if (!footballFixture) {
      return {};
    }

    const matchTimelineDetailsProps = getPropsForMatchTimelineDetails(footballFixture);
    if (!matchTimelineDetailsProps) {
      return {};
    }

    return {
      buttonText,
      matchTimelineDetailsProps,
      incidentsLength: footballFixture.incidents?.length || 0,
      fixtureURN: footballFixture.urn,
      typename: footballFixture.typename,
    };
  };
};

const dispatchSubscribeFixtureUpdates = (
  urn: string,
  typename: string,
  isInplay?: boolean,
): SubscribeFixtureUpdatesAction => ({
  type: SUBSCRIBE_FIXTURE_UPDATES,
  payload: {
    urn,
    typename,
    isInplay,
  },
});

const dispatchUnsubscribeFixtureUpdates = (urn: string, typename: string): UnsubscribeFixtureUpdatesAction => ({
  type: UNSUBSCRIBE_FIXTURE_UPDATES,
  payload: { urn, typename },
});

export type DispatchProps = {
  dispatchSubscribeFixtureUpdates: typeof dispatchSubscribeFixtureUpdates;
  dispatchUnsubscribeFixtureUpdates: typeof dispatchUnsubscribeFixtureUpdates;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
};
