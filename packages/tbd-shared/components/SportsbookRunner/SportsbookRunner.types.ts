import { SportsbookRunnerStatus } from "@ppb/the-wall-common/types";

export type SportsbookMarketRunner = {
  urn: string;
  name: string;
  handicapLabel?: string;
  status?: SportsbookRunnerStatus;
  jerseyUrl?: string;
  useFallbackJersey?: boolean;
  statValue?: string;
  statValueInterpolation?: Record<string, string | number>;
  statLabel?: string;
};

export type SportsbookRaceMarketRunner = {
  horseName: string;
  jockeyName: string;
  trainerName: string;
  saddleCloth: string;
  silk?: string;
  draw?: number;
  form?: string;
} & SportsbookMarketRunner;

export type SbkMarketRunner = SportsbookRaceMarketRunner | SportsbookMarketRunner;
