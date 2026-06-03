type RunnerInformationI18N = {
  jockeyLabel: string;
  trainerLabel: string;
};

export type RunnerInfoProps = {
  silkURL?: string;
  silkAlt?: string;
  runnerNumber?: string;
  runnerName?: string;
  jockey?: string;
  trainer?: string;
} & RunnerInformationI18N;
