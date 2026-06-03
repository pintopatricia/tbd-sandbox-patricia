export type ExperimentVariant = {
  variant: string;
};

export type Experiments = {
  [experimentId: string]: ExperimentVariant;
};

export type ExperimentsState = Experiments;
