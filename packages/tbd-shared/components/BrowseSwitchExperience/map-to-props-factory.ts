import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";

import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";

export type StateProps = {
  browsePagePrismic?: boolean;
};

export type ContainerProps = {
  urn: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState): StateProps => ({
    browsePagePrismic: getThrottle(state.entities.throttles, "BROWSE_PAGE_PRISMIC")?.isActive,
  });
};
