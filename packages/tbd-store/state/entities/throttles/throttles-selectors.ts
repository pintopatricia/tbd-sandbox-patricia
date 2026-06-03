import { createSelector, ParametricSelector } from "reselect";
import { Entities } from "../Entities.types";
import { ThrottlesState, FeatureThrottle, ThrottleOverrides } from "./Throttles.types";
import { ApplicationState } from "../../ApplicationState.types";

export const getThrottles = (state: ApplicationState): ThrottlesState => {
  if (!(state.entities && state.entities.throttles)) {
    throw new Error("non existent throttles");
  }

  return state.entities.throttles;
};

export const getActiveThrottles = (throttles: ThrottlesState): string[] => {
  const throttleNames = Object.keys(throttles);

  return throttleNames.reduce((acc, value) => {
    if (throttles[value].isActive) {
      acc.push(value);
    }
    return acc;
  }, [] as string[]);
};

export const createGetThrottleSelector = (): ParametricSelector<ThrottlesState, string, FeatureThrottle | undefined> =>
  createSelector(
    [(state: ThrottlesState) => state, (_: ThrottlesState, throttleId: string) => throttleId],
    (state, throttleId): FeatureThrottle | undefined => state[throttleId],
  );

export const getOverridenThrottles = (entities: Entities): ThrottleOverrides => {
  const allOverriden = Object.entries(entities.throttles).filter(([, { isOverriden }]) => isOverriden);

  if (allOverriden.length === 0) {
    return {};
  }

  return {
    throttlesOn: allOverriden.filter(([, { isActive }]) => isActive).map(([throttleId]) => throttleId),
    throttlesOff: allOverriden.filter(([, { isActive }]) => !isActive).map(([throttleId]) => throttleId),
  };
};
