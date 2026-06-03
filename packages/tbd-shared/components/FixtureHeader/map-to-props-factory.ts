import type { ComponentProps } from "react";
import { MapStateToPropsFactory } from "react-redux";
// Types
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BaseFixture } from "@ppb/tbd-store/state/entities/BaseFixture.types";
import { FixtureTypename } from "@ppb/tbd-store/state/entities/Fixture.types";

// Store
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createFixtureByURNSelector, isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";

// Football Fixture
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import {
  SUBSCRIBE_FIXTURE_UPDATES,
  SubscribeFixtureUpdatesAction,
  UNSUBSCRIBE_FIXTURE_UPDATES,
  UnsubscribeFixtureUpdatesAction,
} from "@ppb/tbd-store/actions/fixture";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

import type EventHeader from "../EventHeader";
import { DisplayRunnersDefinition } from "@ppb/tbd-store/state/layout/cards/Card.types";

export type ContainerProps = {
  fixture: URN | BaseFixture;
  activeProduct?: Product;
  marketURN?: URN;
  sporteventURN: URN;
  displayRunners?: DisplayRunnersDefinition["runners"];
  cardURN?: URN;
  viewMode: ScoreboardViewMode;
  stickyOnScroll?: boolean | undefined;
  showBottomSeparator?: boolean;
  showEventDateBelow?: boolean;
  showHorizontalDuration?: boolean;
  onSticky?: (flag: boolean) => void;
  availableToSubscribe?: boolean;
  videoAvailable?: boolean;
  iconsList?: ComponentProps<typeof EventHeader>["iconsList"];
};

export type CardProps = {
  // all these fields are optional, because when is past event, we don't have event and competition info
  // but we can show the scoreboard anyway with SCA info
  typename?: string;
  fixtureURN?: URN;
  competitionURN?: URN;
  sporteventURN: URN;
  sportsbookURN?: URN;
  exchangeURN?: URN;
  displayRunners?: URN[] | undefined;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportEventByURN = createSportEventByURNSelector();
  const getFixtureByURN = createFixtureByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();

  return function mapStateToProps(state: ApplicationState, props: ContainerProps): StateProps {
    const sportevent = getSportEventByURN(state.entities.sportevents, props.sporteventURN);
    const competition = sportevent && getCompetitionByURN(state.entities.competitions, sportevent.competition);

    const baseProps = {
      competitionURN: competition?.urn,
      sporteventURN: props.sporteventURN,
      displayRunners: props.displayRunners?.map((runner) => runner.urn),
    };

    if (!isBaseFixture(props.fixture)) {
      const fixture = getFixtureByURN(state.entities, props.fixture);

      if (!fixture) return {};

      const isSupportedFixture = Object.values(FixtureTypename).includes(fixture.typename as FixtureTypename);

      if (!isSupportedFixture) return {};

      return {
        ...baseProps,
        fixtureURN: fixture.urn,
        typename: fixture.typename,
      };
    }

    if (!sportevent) return {};

    const { sportsbook, exchange } = props.fixture.mainMarket;

    return {
      ...baseProps,
      sportsbookURN: sportsbook,
      exchangeURN: exchange,
    };
  };
};

const dispatchSubscribeFixtureUpdates = (
  urn: string,
  typename: string,
  viewMode: ScoreboardViewMode,
  isInplay?: boolean,
): SubscribeFixtureUpdatesAction => ({
  type: SUBSCRIBE_FIXTURE_UPDATES,
  payload: {
    urn,
    typename,
    isLite: viewMode !== ScoreboardViewMode.DEFAULT && viewMode !== ScoreboardViewMode.COUPON,
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
