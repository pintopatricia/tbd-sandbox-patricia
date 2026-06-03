import { MapStateToPropsFactory } from "react-redux";
import { createSelectorCreator, defaultMemoize } from "reselect";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BetLeg, LegPart } from "@ppb/tbd-store/state/betting/sportsbook-bets/SportsbookBet.types";
import {
  SUBSCRIBE_FIXTURE_UPDATES,
  SubscribeFixtureUpdatesAction,
  UNSUBSCRIBE_FIXTURE_UPDATES,
  UnsubscribeFixtureUpdatesAction,
} from "@ppb/tbd-store/actions/fixture";
import { createFixtureBySportEventURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ParticipantType } from "@ppb/tbd-store/state/constants";

import { EnhancedTrackingData, getEnhancedTrackingData } from "./enhanced-tracking-helper";

export type ContainerProps = {
  eventUrn: NonNullable<LegPart["eventUrn"]>;
  includeSubstitutions: boolean;
  outcomeDefinitionExp: NonNullable<LegPart["outcomeDefinitionExp"]>;
  result: BetLeg["result"];
};

type CardProps = {
  urn: URN;
  typename: string;
  enhancedTrackingData: EnhancedTrackingData[];
  subscribeTeamStats: boolean;
  footballPlayerIds: string[];
};

export type StateProps = CardProps | Record<string, never>;

const createGetEnhancedTrackingSubscribeDataSelector = () =>
  createSelectorCreator(
    defaultMemoize,
    (previousStats: EnhancedTrackingData[], newStats: EnhancedTrackingData[]) =>
      JSON.stringify(previousStats) === JSON.stringify(newStats),
  )(
    [(enhancedTrackingData: EnhancedTrackingData[]) => enhancedTrackingData],
    (enhancedTrackingData): Pick<CardProps, "subscribeTeamStats" | "footballPlayerIds"> => ({
      subscribeTeamStats: enhancedTrackingData.some(({ participantType }) => participantType === ParticipantType.TEAM),
      footballPlayerIds: enhancedTrackingData
        .map(({ participantId }) => participantId)
        .filter((participantId): participantId is string => !!participantId),
    }),
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFixtureBySportEventURN = createFixtureBySportEventURNSelector();
  const getEnhancedTrackingSubscribeData = createGetEnhancedTrackingSubscribeDataSelector();

  return (
    state: ApplicationState,
    { eventUrn, outcomeDefinitionExp, result, includeSubstitutions }: ContainerProps,
  ): StateProps => {
    const fixture = getFixtureBySportEventURN(state.entities, eventUrn);

    if (!fixture) {
      return {};
    }

    const enhancedTrackingData = getEnhancedTrackingData(fixture, outcomeDefinitionExp, includeSubstitutions, result);
    const { subscribeTeamStats, footballPlayerIds } = getEnhancedTrackingSubscribeData(enhancedTrackingData);

    return {
      urn: fixture.urn,
      typename: fixture.typename,
      enhancedTrackingData,
      subscribeTeamStats,
      footballPlayerIds,
    };
  };
};

const dispatchSubscribeFixtureUpdates = (
  urn: URN,
  typename: string,
  includeStats: boolean,
  footballPlayerIds: string[],
  includeSubstitutions: boolean,
): SubscribeFixtureUpdatesAction => ({
  type: SUBSCRIBE_FIXTURE_UPDATES,
  payload: {
    urn,
    typename,
    isLite: true,
    includeStats,
    includePlayers: footballPlayerIds.length > 0,
    footballPlayerIds,
    includePlayerStats: true,
    includeSubstitutions,
  },
});

const dispatchUnsubscribeFixtureUpdates = (urn: URN, typename: string): UnsubscribeFixtureUpdatesAction => ({
  type: UNSUBSCRIBE_FIXTURE_UPDATES,
  payload: {
    urn,
    typename,
  },
});

export type DispatchProps = {
  dispatchSubscribeFixtureUpdates: typeof dispatchSubscribeFixtureUpdates;
  dispatchUnsubscribeFixtureUpdates: typeof dispatchUnsubscribeFixtureUpdates;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
};
