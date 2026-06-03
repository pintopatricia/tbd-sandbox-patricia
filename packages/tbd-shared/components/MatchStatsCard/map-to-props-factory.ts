import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

import { MatchStatsProps } from "@ppb/the-wall-common/types";

import URN from "@ppb/tbd-store/state/layout/URN";
import { createHydratedMatchStatsCardByURNSelector } from "@ppb/tbd-store/state/application-state-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  SUBSCRIBE_FIXTURE_UPDATES,
  SubscribeFixtureUpdatesAction,
  UNSUBSCRIBE_FIXTURE_UPDATES,
  UnsubscribeFixtureUpdatesAction,
} from "@ppb/tbd-store/actions/fixture";
import { createGetMatchStatsVM } from "../../view-model-factories/match-stats-card";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  matchStats: MatchStatsProps;
  typename: string;
  fixtureURN: URN;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getHydratedMatchStatsCardByURN = createHydratedMatchStatsCardByURNSelector();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();
  const getMatchStatsVM = createGetMatchStatsVM();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const hydratedCard = getHydratedMatchStatsCardByURN(state, urn);

    if (!hydratedCard?.home.stats || !hydratedCard.away.stats) {
      return {};
    }

    const footballFixture = state.entities.footballfixtures[hydratedCard.fixture];

    if (!footballFixture) {
      return {};
    }

    const userDetails = <UserDetails>getCountryLocalCurrencyCode(state);
    const { matchStats } = getMatchStatsVM(hydratedCard, userDetails.localeCode);

    if (!matchStats.barStats.length) {
      return {};
    }

    return {
      matchStats,
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
