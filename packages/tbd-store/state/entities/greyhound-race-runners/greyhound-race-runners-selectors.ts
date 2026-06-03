import { createSelector, ParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { Entities, GreyhoundRaceRunner, GreyhoundRaceRunners } from "../index";

export const createGreyhoundRaceRunnerByURNSelector = (): ParametricSelector<
  GreyhoundRaceRunners,
  URN,
  GreyhoundRaceRunner
> =>
  createSelector(
    [(runners: GreyhoundRaceRunners) => runners, (_: GreyhoundRaceRunners, urn: URN) => urn],
    (runners, urn): GreyhoundRaceRunner => runners[urn],
  );

export const createGreyhoundRaceRunnerByRaceAndSelectionIdSelector = () =>
  createSelector(
    [
      (state: Entities) => state.greyhoundracerunners,
      (_state: Entities, selectionId: number) => selectionId,
      (_state: Entities, _: number, raceURN: URN) => raceURN,
    ],
    (greyhoundRunners, selectionId, raceURN: URN) =>
      Object.values(greyhoundRunners).find(
        (runner) => raceURN === runner.raceURN && runner.selectionId === selectionId,
      ),
  );

export const createGreyhoundRaceRunnersByRaceURNSelector = (): ParametricSelector<
  Entities,
  URN,
  GreyhoundRaceRunners
> =>
  createSelector(
    [(state: Entities) => state.greyhoundracerunners, (_state: Entities, raceURN: URN) => raceURN],
    (greyhoundRunners, raceURN: URN) =>
      Object.values(greyhoundRunners)
        .filter((runner) => raceURN === runner.raceURN)
        .reduce(
          (acc: GreyhoundRaceRunners, greyhoundRaceRunner: GreyhoundRaceRunner) => ({
            ...acc,
            [greyhoundRaceRunner.urn]: greyhoundRaceRunner,
          }),
          {},
        ),
  );
