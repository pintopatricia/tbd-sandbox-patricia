export type TimeformCardRunnerRatings = { name: string; stars: number }[];

export type RunnerRatingProps = {
  index: number;
  runnerName: string;
  numStars: number;
};

export type TimeformCardProps = {
  runnerRatings: TimeformCardRunnerRatings;
  verdictLabel?: string;
  verdict?: string;
  collapsed?: boolean; // Still been used by TimeFormBroadCastsCard component
};
