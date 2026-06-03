import type { MapStateToPropsFactory } from "react-redux";
import { createSelectorCreator, defaultMemoize } from "reselect";

import type URN from "@ppb/tbd-store/state/layout/URN";
import type { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import type {
  BetLeg,
  ExpressionMetadata,
  LegPart,
} from "@ppb/tbd-store/state/betting/sportsbook-bets/SportsbookBet.types";
import {
  SUBSCRIBE_FIXTURE_UPDATES,
  type SubscribeFixtureUpdatesAction,
  UNSUBSCRIBE_FIXTURE_UPDATES,
  type UnsubscribeFixtureUpdatesAction,
} from "@ppb/tbd-store/actions/fixture";
import { createFixtureBySportEventURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import {
  ObbEnhancedTrackingPlayerCounterAction,
  UI__OBB_ENHANCED_TRACKING_PLAYER_COUNTER,
} from "@ppb/tbd-store/actions/obb";
import { getSportEventByURN } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";

import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getEnhancedTrackingData } from "./obb-enhanced-tracking-helper";
import type { EnhancedTrackingData } from "./ObbEnhancedTracking.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  eventUrn: NonNullable<LegPart["eventUrn"]>;
  expressionComponents: NonNullable<LegPart["expressionComponents"]>;
  expressionMetadata?: LegPart["expressionMetadata"];
  result: BetLeg["result"];
  betLegPartType?: string;
  cardUrn: string;
};

type CardProps = {
  urn: URN;
  typename: string;
  enhancedTrackingData: EnhancedTrackingData[];
  footballPlayerIds: string[];
  i18nLabels: EnhancedTrackingI18n;
  eventName?: string | undefined;
  cardUrn: string;
  betLegPartType?: string;
};

type EnhancedTrackingI18n = {
  showPlayerProgressLabel: string;
  hidePlayerProgressLabel: string;
  playerProgressTitleLabel: string;
  hideSquadsProgressLabel: string;
  squadsProgressTitleLabel: string;
  showSquadsProgressLabel: string;
};

export type StateProps = CardProps | Record<string, never>;

const createGetEnhancedTrackingSubscribeDataSelector = () =>
  createSelectorCreator(
    defaultMemoize,
    (previousStats: ExpressionMetadata, newStats: ExpressionMetadata) =>
      JSON.stringify(previousStats) === JSON.stringify(newStats),
  )(
    [(expressionMetadata: ExpressionMetadata) => expressionMetadata],
    (expressionMetadata): Pick<CardProps, "footballPlayerIds"> => ({
      footballPlayerIds: expressionMetadata.participants
        .map((participant) => ("id" in participant ? participant.id : ""))
        .filter((participantId) => !!participantId),
    }),
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFixtureBySportEventURN = createFixtureBySportEventURNSelector();
  const getEnhancedTrackingSubscribeData = createGetEnhancedTrackingSubscribeDataSelector();

  const i18nLabels: EnhancedTrackingI18n = {
    showPlayerProgressLabel: i18n({ key: "I18N.ENHANCED_TRACKING.SHOW_PROGRESS" }),
    hidePlayerProgressLabel: i18n({ key: "I18N.ENHANCED_TRACKING.HIDE_PROGRESS" }),
    playerProgressTitleLabel: i18n({ key: "I18N.ENHANCED_TRACKING.PROGRESS" }),
    hideSquadsProgressLabel: i18n({ key: "I18N.ENHANCED_TRACKING.SQUADS.HIDE_PROGRESS" }),
    squadsProgressTitleLabel: i18n({ key: "I18N.ENHANCED_TRACKING.SQUADS.PROGRESS" }),
    showSquadsProgressLabel: i18n({ key: "I18N.ENHANCED_TRACKING.SQUADS.SHOW_PROGRESS" }),
  };

  return (
    state: ApplicationState,
    { eventUrn, expressionComponents, expressionMetadata, result, cardUrn, betLegPartType }: ContainerProps,
  ): StateProps => {
    const fixture = getFixtureBySportEventURN(state.entities, eventUrn);

    if (!fixture || fixture.typename !== "FootballFixture" || !expressionMetadata) {
      return {};
    }
    const eventName = getSportEventByURN(state.entities.sportevents, eventUrn)?.name;
    const enhancedTrackingData = getEnhancedTrackingData(fixture, expressionComponents, expressionMetadata, result);
    const { footballPlayerIds } = getEnhancedTrackingSubscribeData(expressionMetadata);

    return {
      urn: fixture.urn,
      typename: fixture.typename,
      enhancedTrackingData,
      footballPlayerIds,
      i18nLabels,
      eventName,
      betLegPartType,
      cardUrn,
    };
  };
};

const dispatchSubscribeFixtureUpdates = (
  urn: URN,
  typename: string,
  footballPlayerIds: string[],
): SubscribeFixtureUpdatesAction => ({
  type: SUBSCRIBE_FIXTURE_UPDATES,
  payload: {
    urn,
    typename,
    isLite: true,
    includeStats: true,
    includePlayers: footballPlayerIds.length > 0,
    footballPlayerIds,
    includePlayerStats: true,
  },
});

const dispatchUnsubscribeFixtureUpdates = (urn: URN, typename: string): UnsubscribeFixtureUpdatesAction => ({
  type: UNSUBSCRIBE_FIXTURE_UPDATES,
  payload: {
    urn,
    typename,
  },
});

const dispatchObbEnhancedTrackingModalAction = (
  actionType: TaggingAction.OPENED | TaggingAction.CLOSED,
  eventName: string,
  cardUrn: string,
  betLegPartType: string | undefined,
): ObbEnhancedTrackingPlayerCounterAction => ({
  type: UI__OBB_ENHANCED_TRACKING_PLAYER_COUNTER,
  payload: {
    actionType,
    eventName,
    cardUrn,
    betLegPartType,
  },
});

export type DispatchProps = {
  dispatchSubscribeFixtureUpdates: typeof dispatchSubscribeFixtureUpdates;
  dispatchUnsubscribeFixtureUpdates: typeof dispatchUnsubscribeFixtureUpdates;
  dispatchObbEnhancedTrackingModalAction: typeof dispatchObbEnhancedTrackingModalAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
  dispatchObbEnhancedTrackingModalAction,
};
