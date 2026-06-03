import { HorsePerformance } from "../../state/entities";
import { RaceRunnerHorsePastPerformanceFragment } from "../../clients/catalogue/catalogue-response-types";
import normalizeRaceRunnerFragmentIntoRaceRunner from "./normalizer/entities/race-runners/race-runners-normalizer";

export const buildRaceRunnersPastPerformancesPayload = (
  raceRunners: (RaceRunnerHorsePastPerformanceFragment | null)[] | null,
): { [urn: string]: HorsePerformance[] } | undefined => {
  if (!raceRunners) {
    return undefined;
  }

  return raceRunners.reduce((acc, raceRunnerFragment) => {
    if (raceRunnerFragment) {
      const {
        urn,
        horse: { pastPerformances },
      } = normalizeRaceRunnerFragmentIntoRaceRunner(raceRunnerFragment).data;

      return {
        ...acc,
        [urn]: pastPerformances,
      };
    }
    return acc;
  }, {});
};
