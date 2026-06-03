export type FootballRunnerProps = {
  runnerName: string;
  statValue?: string;
  statValueInterpolation?: Record<string, string | number>;
  statLabel?: string;
  rightColumn?: React.ReactNode;
  jersey?: string;
  useFallbackJersey?: boolean;
  shouldRenderJerseySpace?: boolean;
};
