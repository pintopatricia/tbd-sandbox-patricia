import { createSelector } from "reselect";
import URN from "../../layout/URN";
import { VirtualRunner, VirtualRunners } from "./VirtualRunner.types";

export const getVirtualRunnerByURN = (state: VirtualRunners, urn: URN): VirtualRunner | undefined => state[urn];

export const getVirtualRunnerById = (state: VirtualRunners, id: number): VirtualRunner | undefined =>
  Object.values(state).find((runner) => runner.selectionId === id);

export const createVirtualRunnerByURNSelector = () =>
  createSelector(
    [(virtualRunners: VirtualRunners) => virtualRunners, (_: VirtualRunners, urn: URN) => urn],
    getVirtualRunnerByURN,
  );

export const createVirtualRunnerByIdSelector = () =>
  createSelector(
    [(virtualRunners: VirtualRunners) => virtualRunners, (_: VirtualRunners, id: number) => id],
    getVirtualRunnerById,
  );
