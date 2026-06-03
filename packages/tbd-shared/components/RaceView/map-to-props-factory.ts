import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import {
  SUBSCRIBE_RACE_UPDATES,
  SubscribeRaceUpdatesAction,
  UNSUBSCRIBE_RACE_UPDATES,
  UnsubscribeRaceUpdatesAction,
} from "@ppb/tbd-store/actions/race";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { RaceView as RaceViewType } from "@ppb/tbd-store/state/layout/views/View.types";
import { FETCH_CATALOGUE, FetchCatalogueAction, RaceDetails } from "@ppb/tbd-store";

export type StateProps = {
  raceStatus?: RaceDetails["status"];
  resultType?: RaceDetails["resultType"];
  raceURN?: string;
  urn: string;
  isRaceViewActive?: boolean;
  isRaceMeetingViewActive?: boolean;
};

export type ContainerProps = {
  urn: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRaceViewByURN = createFindViewByURNSelector();
  const getRaceByURN = createRaceByURNSelector();
  const getThrottle = createGetThrottleSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const isRaceViewActive = getThrottle(state.entities.throttles, "RACE_VIEW_POLLING")?.isActive;
    const isRaceMeetingViewActive = getThrottle(state.entities.throttles, "RACE_MEETING_VIEW")?.isActive;

    // New RaceMeetingView is active
    if (isRaceMeetingViewActive) {
      return { urn, isRaceMeetingViewActive: true };
    }

    const raceView = getRaceViewByURN(state.layouts.views, urn);

    if (!raceView) {
      return { urn };
    }

    const { race: raceURN } = raceView as RaceViewType;
    const { details: raceDetails } = getRaceByURN(state.entities.races, raceURN);

    return {
      raceStatus: raceDetails?.status,
      resultType: raceDetails?.resultType,
      urn,
      raceURN,
      isRaceViewActive,
    };
  };
};

const dispatchSubscribeRaceUpdates = (raceUrn: URN): SubscribeRaceUpdatesAction => ({
  type: SUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

const dispatchUnsubscribeRaceUpdates = (raceUrn: URN): UnsubscribeRaceUpdatesAction => ({
  type: UNSUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

const dispatchFetchCatalogue = (urn: string): FetchCatalogueAction => ({
  type: FETCH_CATALOGUE,
  payload: {
    urn,
  },
});

export type DispatchProps = {
  dispatchSubscribeRaceUpdates: typeof dispatchSubscribeRaceUpdates;
  dispatchUnsubscribeRaceUpdates: typeof dispatchUnsubscribeRaceUpdates;
  dispatchFetchCatalogue: typeof dispatchFetchCatalogue;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  dispatchFetchCatalogue,
};
