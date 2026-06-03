import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  getBettingResolvers,
  getSportsbookBettingRunners,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getBetslipGroup } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store";
import { Region } from "@ppb/the-wall-icons/traps";
import { buildBaseCastRunner, buildOrderedCastRunner } from "../betslip-mapper";

export type StateProps = {
  id: string;
  horse: string;
  icon?: React.ReactNode;
  position?: number;
  positionOrdinal?: string;
  meetingCountry?: Region;
  trap?: number | string;
  isTrapIconThrottleActive?: boolean;
};

export type ContainerProps = {
  id: string;
  isOrderable?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, { id, isOrderable }) => {
    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const group = getBetslipGroup(state);
    const resolvers = getBettingResolvers(group);
    const metadata = resolvers.getMetadata(state);
    const runners = getSportsbookBettingRunners(state);
    const runner = runners[id];
    const trapIconThrottle = getThrottle(state.entities.throttles, "SHOW_TRAP_ICON");
    const runnerMetadata = metadata[id];
    const castRunner = isOrderable
      ? buildOrderedCastRunner(runner, runnerMetadata, userDetails)
      : buildBaseCastRunner(runnerMetadata, userDetails);

    return {
      ...castRunner,
      id,
      isTrapIconThrottleActive: trapIconThrottle?.isActive,
    };
  };
};

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
