import { createSelector, ParametricSelector } from "reselect";
import { Entities } from "../Entities.types";
import { ExperimentsState, ExperimentVariant } from "./Experiments.types";
import { ApplicationState } from "../../ApplicationState.types";

export const getExperiments = (state: ApplicationState): ExperimentsState => {
  if (!(state.entities && state.entities.experiments)) {
    throw new Error("non existent experiments");
  }
  return state.entities.experiments;
};

export const getFormattedExperiments = (entities: Entities): { id: string; variant: string }[] => {
  if (!(entities && entities.experiments)) {
    return [];
  }

  return Object.entries(entities.experiments).map(([id, experiment]) => ({
    id,
    variant: experiment.variant,
  }));
};

export const createGetExperimentSelector = (): ParametricSelector<
  ExperimentsState,
  string,
  ExperimentVariant | undefined
> =>
  createSelector(
    [(state: ExperimentsState) => state, (_: ExperimentsState, experimentId: string) => experimentId],
    (state, experimentId): ExperimentVariant | undefined => state[experimentId],
  );
