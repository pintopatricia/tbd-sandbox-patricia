import { createSelector, ParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { RaceRunner, RaceRunners } from "../index";

/**
 * For a given race runner URN, returns the corresponding race runner or undefined if there's none
 */
export const createRaceRunnerByURNSelector = (): ParametricSelector<RaceRunners, URN, RaceRunner> =>
  createSelector(
    [(raceRunners: RaceRunners) => raceRunners, (_: RaceRunners, urn: URN) => urn],
    (raceRunners, urn): RaceRunner => raceRunners[urn],
  );

/**
 * For a given race URN, returns all race runners corresponding to that race or undefined if there's none
 */
export const createRaceRunnersByRaceURNSelector = (): ParametricSelector<RaceRunners, URN, RaceRunners> =>
  createSelector(
    (raceRunners: RaceRunners, raceURN: URN) => ({ raceRunners, raceURN }),
    ({ raceRunners, raceURN }): RaceRunners =>
      Object.values(raceRunners)
        .filter(({ raceURN: raceRunnerRaceURN }) => raceRunnerRaceURN === raceURN)
        .reduce(
          (acc: RaceRunners, raceRunner: RaceRunner) => ({
            ...acc,
            [raceRunner.urn]: raceRunner,
          }),
          {},
        ),
  );
