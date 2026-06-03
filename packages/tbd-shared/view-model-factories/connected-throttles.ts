import { createSelector, Selector } from "reselect";
import { ThrottlesState } from "@ppb/tbd-store/state/entities/throttles/Throttles.types";

export type Throttle = { id: string; isActive: boolean; isOverriden?: boolean };

export const createThrottlesBuilder = (): Selector<ThrottlesState, Throttle[]> =>
  createSelector([(state: ThrottlesState) => state], (state) =>
    Object.keys(state)
      .sort()
      .map((throttleId) => {
        const isActive = !!state[throttleId]?.isActive;
        const isOverriden = !!state[throttleId]?.isOverriden;

        return { id: throttleId, isActive, isOverriden };
      }),
  );
